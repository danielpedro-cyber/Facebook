"""
Gera a narração (public/narracao.mp3) com voz neural local (Piper) e
calcula os tempos das legendas a partir da fala real (src/legendas/<versão>.ts).

Uso (uma vez):
    python -m venv .venv && .venv/bin/pip install piper-tts==1.8.0 numpy
    # baixe a voz (CC0) para scripts/voz/:
    #   https://huggingface.co/rhasspy/piper-voices/tree/main/pt/pt_BR/faber/medium
    .venv/bin/python scripts/gerar_narracao.py [--voz scripts/voz/pt_BR-faber-medium.onnx]

    # opcional: gera várias versões de cada frase e escolhe a mais clara,
    # conferindo com reconhecimento de fala (pip install faster-whisper)
    .venv/bin/python scripts/gerar_narracao.py --conferir 6

Requer ffmpeg no PATH.

Como funciona: cada frase do roteiro (scripts/roteiros/*.json) é sintetizada inteira (entonação
natural), os silêncios das pontas são cortados e as frases são distribuídas
dentro do tempo da cena. Se uma cena não couber, a fala daquela cena é
acelerada. O início de cada trecho de legenda é estimado pela proporção de
fonemas dentro da frase.
"""

from __future__ import annotations

import argparse
import difflib
import json
import os
import re
import subprocess
import sys
import tempfile
import wave

import numpy as np
from piper import PiperVoice, SynthesisConfig

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INICIO_CENA = 0.3  # s de respiro no começo de cada cena
FIM_CENA = 0.3  # s de respiro antes da próxima cena
PAUSA_MIN = 0.22  # pausa mínima entre frases
PAUSA_MAX = 0.85  # pausa máxima entre frases (o resto vira silêncio no fim)
VELOCIDADE_BASE = 1.18  # >1 = mais devagar (length_scale do Piper) — ritmo didático
LIMIAR_SILENCIO = 0.012


def sintetizar(voz: PiperVoice, texto: str, escala: float) -> np.ndarray:
    cfg = SynthesisConfig(length_scale=escala, noise_scale=0.5, noise_w_scale=0.6)
    partes = [c.audio_float_array for c in voz.synthesize(texto, syn_config=cfg)]
    audio = np.concatenate(partes) if partes else np.zeros(1, dtype=np.float32)
    # corta silêncio nas pontas
    ativo = np.where(np.abs(audio) > LIMIAR_SILENCIO)[0]
    if len(ativo):
        sr = voz.config.sample_rate
        audio = audio[max(0, ativo[0] - int(0.03 * sr)) : ativo[-1] + int(0.08 * sr)]
    return audio.astype(np.float32)


def _normaliza(texto: str) -> list[str]:
    t = texto.lower()
    t = re.sub(r"\bpros\b", "para os", t)
    t = re.sub(r"\bpro\b", "para o", t)
    t = re.sub(r"\bpra\b", "para", t)
    return re.findall(r"[a-zà-ú]+", t)


class Conferente:
    """Escolhe, entre várias versões sintetizadas, a que o Whisper entende melhor."""

    def __init__(self) -> None:
        from faster_whisper import WhisperModel

        self.modelo = WhisperModel("small", device="cpu", compute_type="int8")

    def nota(self, audio: np.ndarray, sr: int, esperado: str) -> float:
        n16 = int(len(audio) * 16000 / sr)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n16), np.arange(len(audio)), audio).astype(np.float32)
        a16 = np.concatenate([np.zeros(8000, np.float32), a16, np.zeros(4000, np.float32)])
        segs, _ = self.modelo.transcribe(a16, language="pt", beam_size=5)
        ouvido = " ".join(x.text for x in segs)
        return difflib.SequenceMatcher(None, _normaliza(ouvido), _normaliza(esperado)).ratio()


def melhor_versao(voz, frase, escala, conferente, versoes) -> np.ndarray:
    fala = " ".join(t.get("fala", t["texto"]) for t in frase)
    if not conferente or versoes <= 1:
        return sintetizar(voz, fala, escala)
    esperado = " ".join(t["texto"] for t in frase)
    melhor, nota_melhor = None, -1.0
    for _ in range(versoes):
        audio = sintetizar(voz, fala, escala)
        nota = conferente.nota(audio, voz.config.sample_rate, esperado)
        if nota > nota_melhor:
            melhor, nota_melhor = audio, nota
        if nota >= 0.999:
            break
    if nota_melhor < 0.9:
        print(f"   ⚠️  clareza {nota_melhor:.0%}: {esperado}", file=sys.stderr)
    return melhor


def n_fonemas(voz: PiperVoice, texto: str) -> int:
    return max(1, sum(len(p) for p in voz.phonemize(texto)))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--voz", default=os.path.join(RAIZ, "scripts", "voz", "pt_BR-faber-medium.onnx"))
    ap.add_argument("--roteiro", default=os.path.join(RAIZ, "scripts", "roteiros", "completa.json"))
    ap.add_argument("--saida", default=os.path.join(RAIZ, "public", "narracao-completa.mp3"))
    ap.add_argument("--legendas", default=os.path.join(RAIZ, "src", "legendas", "completa.ts"))
    ap.add_argument("--conferir", type=int, default=0, metavar="N",
                    help="gera N versões de cada frase e escolhe a mais clara (requer faster-whisper)")
    a = ap.parse_args()
    conferente = Conferente() if a.conferir > 1 else None

    voz = PiperVoice.load(a.voz)
    sr = voz.config.sample_rate
    roteiro = json.load(open(a.roteiro, encoding="utf-8"))
    duracao_total = max(c["fim"] for c in roteiro["cenas"])
    trilha = np.zeros(int((duracao_total + 1) * sr), dtype=np.float32)
    legendas: list[dict] = []

    for cena in roteiro["cenas"]:
        janela = cena["fim"] - cena["inicio"] - INICIO_CENA - FIM_CENA
        frases = cena["frases"]
        escala = VELOCIDADE_BASE
        for _ in range(6):
            audios = [melhor_versao(voz, f, escala, conferente, a.conferir) for f in frases]
            fala = sum(len(x) for x in audios) / sr
            precisa = fala + PAUSA_MIN * (len(frases) - 1)
            if precisa <= janela:
                break
            escala *= max(0.85, janela / precisa * 0.99)
        else:
            print(f"⚠️  cena {cena['cena']} não coube mesmo acelerando", file=sys.stderr)

        folga = janela - fala
        pausa = min(PAUSA_MAX, folga / (len(frases) - 1)) if len(frases) > 1 else 0
        t = cena["inicio"] + INICIO_CENA
        for frase, audio in zip(frases, audios):
            ini = int(t * sr)
            trilha[ini : ini + len(audio)] += audio
            dur = len(audio) / sr
            # divide a frase entre os trechos de legenda pela proporção de fonemas
            pesos = [n_fonemas(voz, x.get("fala", x["texto"])) for x in frase]
            acumulado = 0
            for trecho, peso in zip(frase, pesos):
                inicio = t + dur * acumulado / sum(pesos)
                acumulado += peso
                fim = t + dur * acumulado / sum(pesos)
                legendas.append({"id": trecho["id"], "inicio": round(inicio, 2), "fim": round(fim, 2), "texto": trecho["texto"]})
            t += dur + pausa
        print(f"{cena['cena']:<14} fala {fala:5.1f}s / janela {janela:4.1f}s  velocidade {VELOCIDADE_BASE / escala:.2f}x")

    trilha = trilha[: int(duracao_total * sr)]
    trilha /= max(1e-6, np.abs(trilha).max()) / 0.9

    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "narracao.wav")
        with wave.open(wav, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes((trilha * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", wav,
             "-af", "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=7",
             "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", a.saida],
            check=True,
        )

    linhas = [
        f"// Gerado por scripts/gerar_narracao.py a partir de {os.path.relpath(a.roteiro, RAIZ)}.",
        "// Ao trocar a narração por uma gravação real, ajuste 'inicio' e 'fim' (segundos).",
        "// 'inicio' = quando a legenda entra; 'fim' = quando aquele trecho termina de ser falado.",
        "export const LEGENDAS: { id: string; inicio: number; fim: number; texto: string }[] = [",
    ]
    for l in legendas:
        linhas.append(f"  {{ id: {json.dumps(l['id'])}, inicio: {l['inicio']}, fim: {l['fim']}, texto: {json.dumps(l['texto'], ensure_ascii=False)} }},")
    linhas.append("];\n")
    open(a.legendas, "w", encoding="utf-8").write("\n".join(linhas))
    print(f"✅ {a.saida}\n✅ {a.legendas}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
