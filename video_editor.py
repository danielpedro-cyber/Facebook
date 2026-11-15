"""
Editor de Vídeo — linha de comando
==================================
Monta um vídeo (slideshow) a partir de imagens, com transições, efeitos,
zoom (Ken Burns), legendas e trilha sonora, usando o FFmpeg instalado no sistema.

Uso:
    python video_editor.py fotos/*.jpg -o anuncio.mp4
    python video_editor.py a.jpg b.jpg c.jpg -o stories.mp4 --formato stories \\
        --audio musica.mp3 --transicao slideleft --zoom \\
        --legenda "0-3:Oferta por tempo limitado" --legenda "3-6:Chame no WhatsApp"

Requer: ffmpeg e ffprobe no PATH (https://ffmpeg.org/download.html).
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field

# Formatos prontos (largura x altura) para anúncios
FORMATOS = {
    "feed": (1080, 1080),       # quadrado 1:1
    "vertical": (1080, 1350),   # feed 4:5
    "stories": (1080, 1920),    # stories / reels 9:16
    "paisagem": (1920, 1080),   # 16:9
    "hd": (1280, 720),
}

# Nomes amigáveis -> transições do filtro xfade do FFmpeg
TRANSICOES = {
    "nenhuma": None,
    "fade": "fade",
    "dissolver": "dissolve",
    "preto": "fadeblack",
    "branco": "fadewhite",
    "deslizar-esquerda": "slideleft",
    "deslizar-direita": "slideright",
    "deslizar-cima": "slideup",
    "deslizar-baixo": "slidedown",
    "cortina-esquerda": "wipeleft",
    "cortina-direita": "wiperight",
    "circulo": "circleopen",
    "radial": "radial",
    "pixelizar": "pixelize",
    "zoom": "zoomin",
}

EFEITOS = ("pb", "sepia", "vintage", "brilho", "contraste", "saturacao", "desfoque", "vinheta")


@dataclass
class Legenda:
    inicio: float
    fim: float
    texto: str


@dataclass
class Projeto:
    imagens: list[str]
    saida: str
    largura: int = 1080
    altura: int = 1080
    fps: int = 30
    duracao: float = 3.0
    transicao: str | None = "fade"
    duracao_transicao: float = 0.8
    zoom: bool = False
    preencher: bool = False
    fundo: str = "black"
    efeitos: list[str] = field(default_factory=list)
    intensidade: float = 50.0
    audio: str | None = None
    repetir_audio: bool = False
    volume: float = 100.0
    fade_in: float = 0.0
    fade_out: float = 0.0
    legendas: list[Legenda] = field(default_factory=list)
    arquivo_srt: str | None = None
    tamanho_fonte: int = 0
    bitrate: int = 0
    crf: int = 23

    @property
    def sobreposicao(self) -> float:
        return self.duracao_transicao if self.transicao and len(self.imagens) > 1 else 0.0

    @property
    def duracao_total(self) -> float:
        n = len(self.imagens)
        return n * self.duracao - (n - 1) * self.sobreposicao


# ---------------------------------------------------------------------------
# Montagem dos filtros
# ---------------------------------------------------------------------------

def _filtro_imagem(p: Projeto, idx: int) -> str:
    """Filtro que transforma uma imagem estática em um clipe de `duracao` segundos."""
    w, h, fps = p.largura, p.altura, p.fps
    frames = max(1, round(p.duracao * fps))
    if p.zoom:
        # Ken Burns: amplia a imagem e faz zoom suave até 15%, alternando o sentido
        zw, zh = w * 2, h * 2
        z = f"1+0.15*on/{frames}" if idx % 2 == 0 else f"1.15-0.15*on/{frames}"
        return (
            f"scale={zw}:{zh}:force_original_aspect_ratio=increase,crop={zw}:{zh},"
            f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
            f":d={frames}:s={w}x{h}:fps={fps},setsar=1,format=yuv420p"
        )
    if p.preencher:
        enquadrar = f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}"
    else:
        enquadrar = (
            f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:color={p.fundo}"
        )
    return f"{enquadrar},setsar=1,fps={fps},trim=duration={p.duracao},format=yuv420p"


def _filtros_efeitos(p: Projeto) -> list[str]:
    k = max(0.0, min(p.intensidade, 100.0)) / 100.0
    filtros: list[str] = []
    for ef in p.efeitos:
        if ef == "pb":
            filtros.append("hue=s=0")
        elif ef in ("sepia", "vintage"):
            filtros.append(
                "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131"
            )
            if ef == "vintage":
                filtros += ["eq=contrast=1.1:saturation=0.8", "vignette=PI/4", "noise=alls=8:allf=t"]
        elif ef == "brilho":
            filtros.append(f"eq=brightness={0.25 * k:.3f}")
        elif ef == "contraste":
            filtros.append(f"eq=contrast={1 + 0.8 * k:.3f}")
        elif ef == "saturacao":
            filtros.append(f"eq=saturation={1 + 1.5 * k:.3f}")
        elif ef == "desfoque":
            filtros.append(f"gblur=sigma={0.5 + 8 * k:.2f}")
        elif ef == "vinheta":
            filtros.append(f"vignette=angle={0.2 + 0.6 * k:.2f}")
    return filtros


def _tempo_srt(seg: float) -> str:
    ms = round(seg * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _escrever_srt(legendas: list[Legenda], caminho: str) -> None:
    with open(caminho, "w", encoding="utf-8") as f:
        for i, lg in enumerate(legendas, 1):
            f.write(f"{i}\n{_tempo_srt(lg.inicio)} --> {_tempo_srt(lg.fim)}\n{lg.texto}\n\n")


def montar_comando(p: Projeto, pasta_temp: str) -> list[str]:
    """Gera a linha de comando do FFmpeg. Deve ser executada com cwd=pasta_temp."""
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-nostats", "-progress", "pipe:1"]

    # Entradas: uma por imagem
    for img in p.imagens:
        if p.zoom:
            cmd += ["-i", img]  # zoompan gera os quadros a partir de uma imagem só
        else:
            cmd += ["-loop", "1", "-framerate", str(p.fps), "-t", f"{p.duracao}", "-i", img]
    idx_audio = None
    if p.audio:
        idx_audio = len(p.imagens)
        if p.repetir_audio:
            cmd += ["-stream_loop", "-1"]
        cmd += ["-i", p.audio]

    partes: list[str] = []
    for i in range(len(p.imagens)):
        partes.append(f"[{i}:v]{_filtro_imagem(p, i)}[c{i}]")

    # Junta os clipes (com transição ou corte seco)
    n = len(p.imagens)
    if n == 1:
        atual = "c0"
    elif p.sobreposicao > 0:
        atual = "c0"
        passo = p.duracao - p.sobreposicao
        for k in range(1, n):
            saida = f"x{k}"
            partes.append(
                f"[{atual}][c{k}]xfade=transition={p.transicao}"
                f":duration={p.sobreposicao}:offset={k * passo:.3f}[{saida}]"
            )
            atual = saida
    else:
        entradas = "".join(f"[c{i}]" for i in range(n))
        partes.append(f"{entradas}concat=n={n}:v=1:a=0[cc]")
        atual = "cc"

    # Efeitos + legendas
    pos = _filtros_efeitos(p)
    if p.legendas or p.arquivo_srt:
        if p.arquivo_srt:
            shutil.copy(p.arquivo_srt, os.path.join(pasta_temp, "legendas.srt"))
        else:
            _escrever_srt(p.legendas, os.path.join(pasta_temp, "legendas.srt"))
        # Tamanho em pixels do vídeo; o libass mede legendas SRT numa tela de 288 px de altura
        fonte_px = p.tamanho_fonte or max(16, round(min(p.largura, p.altura) / 18))
        escala = 288 / p.altura
        estilo = (
            f"FontName=DejaVu Sans,Bold=1,FontSize={fonte_px * escala:.1f},"
            f"PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,"
            f"Outline={max(1.0, fonte_px * escala / 12):.1f},Shadow=0,Alignment=2,"
            f"MarginV={round(p.altura * 0.08 * escala)}"
        )
        pos.append(f"subtitles=legendas.srt:charenc=UTF-8:force_style='{estilo}'")
    pos.append("format=yuv420p")
    partes.append(f"[{atual}]{','.join(pos)}[v]")

    mapas = ["-map", "[v]"]
    if idx_audio is not None:
        total = p.duracao_total
        af = [f"atrim=0:{total:.3f}", "asetpts=PTS-STARTPTS", f"volume={p.volume / 100:.3f}"]
        if p.fade_in > 0:
            af.append(f"afade=t=in:st=0:d={p.fade_in}")
        if p.fade_out > 0:
            af.append(f"afade=t=out:st={max(0.0, total - p.fade_out):.3f}:d={p.fade_out}")
        partes.append(f"[{idx_audio}:a]{','.join(af)}[a]")
        mapas += ["-map", "[a]"]

    cmd += ["-filter_complex", ";".join(partes)] + mapas
    cmd += ["-r", str(p.fps), "-t", f"{p.duracao_total:.3f}"]

    ext = os.path.splitext(p.saida)[1].lower()
    if ext == ".webm":
        cmd += ["-c:v", "libvpx-vp9", "-row-mt", "1"]
        cmd += ["-b:v", f"{p.bitrate}k"] if p.bitrate else ["-crf", str(p.crf + 8), "-b:v", "0"]
        if idx_audio is not None:
            cmd += ["-c:a", "libopus", "-b:a", "128k"]
    else:
        cmd += ["-c:v", "libx264", "-preset", "medium", "-pix_fmt", "yuv420p"]
        cmd += ["-b:v", f"{p.bitrate}k"] if p.bitrate else ["-crf", str(p.crf)]
        if idx_audio is not None:
            cmd += ["-c:a", "aac", "-b:a", "192k"]
        if ext in (".mp4", ".mov", ".m4v"):
            cmd += ["-movflags", "+faststart"]
    cmd.append(p.saida)
    return cmd


# ---------------------------------------------------------------------------
# Execução
# ---------------------------------------------------------------------------

def renderizar(p: Projeto, simular: bool = False) -> int:
    with tempfile.TemporaryDirectory(prefix="video_editor_") as tmp:
        cmd = montar_comando(p, tmp)
        if simular:
            print("(executar dentro de uma pasta temporária com legendas.srt, se houver)")
            print(" ".join(_citar(c) for c in cmd))
            return 0

        total = p.duracao_total
        print(f"🎬 Renderizando {len(p.imagens)} imagem(ns) → {p.saida} "
              f"({p.largura}x{p.altura}, {p.fps} fps, {total:.1f}s)")
        proc = subprocess.Popen(cmd, cwd=tmp, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, text=True)
        assert proc.stdout is not None
        for linha in proc.stdout:
            if linha.startswith("out_time_us=") and total > 0:
                try:
                    seg = int(linha.split("=", 1)[1]) / 1_000_000
                except ValueError:
                    continue
                pct = max(0, min(100, int(seg / total * 100)))
                barra = "█" * (pct // 4) + "░" * (25 - pct // 4)
                print(f"\r   [{barra}] {pct:3d}%", end="", flush=True)
        erro = proc.stderr.read() if proc.stderr else ""
        proc.wait()
        print()
        if proc.returncode != 0:
            print("❌ O FFmpeg falhou:\n" + erro.strip(), file=sys.stderr)
            return proc.returncode
        tamanho = os.path.getsize(p.saida) / 1_048_576
        print(f"✅ Vídeo gerado: {p.saida} ({tamanho:.1f} MB)")
        return 0


def _citar(arg: str) -> str:
    return arg if re.fullmatch(r"[\w@%+=:,./-]+", arg) else "'" + arg.replace("'", "'\\''") + "'"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _parse_legenda(valor: str) -> Legenda:
    m = re.fullmatch(r"\s*([\d.]+)\s*-\s*([\d.]+)\s*:(.+)", valor, re.S)
    if not m:
        raise argparse.ArgumentTypeError(
            f"legenda inválida: {valor!r} (use INICIO-FIM:texto, ex.: \"0-3:Olá\")")
    ini, fim = float(m.group(1)), float(m.group(2))
    if fim <= ini:
        raise argparse.ArgumentTypeError(f"legenda {valor!r}: o fim deve ser maior que o início")
    return Legenda(ini, fim, m.group(3).strip().replace("\\n", "\n"))


def _parse_formato(valor: str) -> tuple[int, int]:
    if valor in FORMATOS:
        return FORMATOS[valor]
    m = re.fullmatch(r"(\d+)[xX:](\d+)", valor)
    if not m:
        raise argparse.ArgumentTypeError(
            f"formato inválido: {valor!r} (use {', '.join(FORMATOS)} ou LARGURAxALTURA)")
    w, h = int(m.group(1)), int(m.group(2))
    # libx264 com yuv420p exige dimensões pares
    return w - w % 2, h - h % 2


def criar_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        prog="video_editor.py",
        description="Cria vídeos a partir de imagens (slideshow) com transições, efeitos, "
                    "legendas e música, usando FFmpeg.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "formatos: " + ", ".join(f"{k} ({w}x{h})" for k, (w, h) in FORMATOS.items()) + "\n"
            "transições: " + ", ".join(TRANSICOES) + "\n"
            "efeitos: " + ", ".join(EFEITOS) + "\n\n"
            "exemplo:\n"
            "  python video_editor.py fotos/*.jpg -o reels.mp4 --formato stories --zoom \\\n"
            "      --audio musica.mp3 --fade-out 2 --legenda \"0-3:Oferta imperdível\""
        ),
    )
    ap.add_argument("imagens", nargs="+", help="imagens na ordem em que devem aparecer")
    ap.add_argument("-o", "--saida", default="video.mp4", help="arquivo de saída (.mp4 ou .webm)")

    g = ap.add_argument_group("vídeo")
    g.add_argument("-f", "--formato", type=_parse_formato, default=FORMATOS["feed"],
                   help="feed, vertical, stories, paisagem, hd ou LARGURAxALTURA (padrão: feed)")
    g.add_argument("-d", "--duracao", type=float, default=3.0, help="segundos por imagem (padrão: 3)")
    g.add_argument("--fps", type=int, default=30, help="quadros por segundo (padrão: 30)")
    g.add_argument("-t", "--transicao", default="fade",
                   help="transição entre imagens (padrão: fade; 'nenhuma' para corte seco). "
                        "Também aceita qualquer nome do filtro xfade do FFmpeg")
    g.add_argument("--duracao-transicao", type=float, default=0.8,
                   help="segundos de transição (padrão: 0.8)")
    g.add_argument("-z", "--zoom", action="store_true", help="efeito Ken Burns (zoom suave)")
    g.add_argument("--preencher", action="store_true",
                   help="cortar a imagem para preencher a tela, em vez de usar bordas")
    g.add_argument("--fundo", default="black", help="cor das bordas (padrão: black)")
    g.add_argument("--crf", type=int, default=23, help="qualidade: menor = melhor (padrão: 23)")
    g.add_argument("--bitrate", type=int, default=0, help="bitrate de vídeo em kbps (substitui --crf)")

    g = ap.add_argument_group("efeitos")
    g.add_argument("-e", "--efeito", action="append", default=[], choices=EFEITOS,
                   help="efeito de cor/imagem (pode repetir)")
    g.add_argument("--intensidade", type=float, default=50, help="intensidade dos efeitos 0–100")

    g = ap.add_argument_group("áudio")
    g.add_argument("-a", "--audio", help="trilha sonora (mp3, wav, m4a...)")
    g.add_argument("--repetir-audio", action="store_true", help="repetir o áudio se for mais curto")
    g.add_argument("--volume", type=float, default=100, help="volume em %% (padrão: 100)")
    g.add_argument("--fade-in", type=float, default=0, help="fade-in do áudio em segundos")
    g.add_argument("--fade-out", type=float, default=0, help="fade-out do áudio em segundos")

    g = ap.add_argument_group("legendas")
    g.add_argument("-l", "--legenda", action="append", default=[], type=_parse_legenda,
                   metavar="INICIO-FIM:TEXTO", help='ex.: "0-3:Olá" (pode repetir; \\n quebra linha)')
    g.add_argument("--srt", help="arquivo .srt com legendas")
    g.add_argument("--tamanho-fonte", type=int, default=0, help="tamanho da fonte em pixels")

    ap.add_argument("--simular", action="store_true", help="só mostra o comando FFmpeg, sem executar")
    return ap


def main(argv: list[str] | None = None) -> int:
    ap = criar_parser()
    a = ap.parse_args(argv)

    if not shutil.which("ffmpeg"):
        ap.error("ffmpeg não encontrado no PATH. Instale em https://ffmpeg.org/download.html")

    for caminho in a.imagens + [x for x in (a.audio, a.srt) if x]:
        if not os.path.isfile(caminho):
            ap.error(f"arquivo não encontrado: {caminho}")
    if a.legenda and a.srt:
        ap.error("use --legenda ou --srt, não os dois")
    if a.duracao <= 0 or a.fps <= 0:
        ap.error("--duracao e --fps devem ser maiores que zero")

    nome = a.transicao.lower()
    transicao = TRANSICOES.get(nome, nome)
    if transicao and len(a.imagens) > 1 and not 0 < a.duracao_transicao < a.duracao:
        ap.error("--duracao-transicao deve ser maior que 0 e menor que --duracao")

    w, h = a.formato
    p = Projeto(
        imagens=[os.path.abspath(x) for x in a.imagens],
        saida=os.path.abspath(a.saida),
        largura=w, altura=h, fps=a.fps, duracao=a.duracao,
        transicao=transicao, duracao_transicao=a.duracao_transicao,
        zoom=a.zoom, preencher=a.preencher, fundo=a.fundo,
        efeitos=a.efeito, intensidade=a.intensidade,
        audio=os.path.abspath(a.audio) if a.audio else None,
        repetir_audio=a.repetir_audio, volume=a.volume,
        fade_in=a.fade_in, fade_out=a.fade_out,
        legendas=a.legenda,
        arquivo_srt=os.path.abspath(a.srt) if a.srt else None,
        tamanho_fonte=a.tamanho_fonte, bitrate=a.bitrate, crf=a.crf,
    )
    os.makedirs(os.path.dirname(p.saida) or ".", exist_ok=True)
    return renderizar(p, simular=a.simular)


if __name__ == "__main__":
    sys.exit(main())
