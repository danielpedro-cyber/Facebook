"""
Compõe a trilha instrumental (public/trilha.mp3): leve, otimista e sem
direitos autorais de terceiros — tudo é sintetizado aqui.

Uso:
    .venv/bin/pip install numpy scipy
    .venv/bin/python scripts/gerar_trilha.py

Requer ffmpeg no PATH. A trilha acompanha as cenas (constantes abaixo):
fica mais vazia e menor na "baixa", ganha ritmo na virada e cresce até a escolha.
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
DURACAO = 78.0
BPM = 120
BATIDA = 60 / BPM  # 0,5 s
COMPASSO = 4 * BATIDA  # 2 s

# Cenas (s) — iguais a CENAS em src/constantes.ts
BAIXA = (21, 29)
VIRADA = 29
RITMO = 35  # entra percussão leve
ESCOLHA = 50
LIBERDADE = (64, 69)
FINAL = 69

# Progressões (notas MIDI). Normal: C – G – Am – F. Baixa: Am – F – Dm – E(sus)
NORMAL = [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69])]
TRISTE = [(45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (38, [57, 62, 65, 69]), (40, [56, 59, 64, 68])]


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def env_adsr(n: int, a: float, r: float) -> np.ndarray:
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def tom(freq: float, dur: float, harmonicos=(1.0, 0.3, 0.12), detune=0.0) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    x = np.zeros_like(t)
    for k, amp in enumerate(harmonicos, 1):
        x += amp * np.sin(2 * np.pi * freq * k * t)
        if detune:
            x += amp * np.sin(2 * np.pi * freq * k * (1 + detune) * t + 1.3)
    return x


def pluck(freq: float, dur: float = 0.9, decai: float = 0.32) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.08)
    x += 0.08 * np.sin(2 * np.pi * 3 * freq * t) * np.exp(-t / 0.05)
    return x * np.exp(-t / decai) * env_adsr(len(t), 0.004, 0.05)


def sino(freq: float, dur: float = 2.2) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.3)
    return x * np.exp(-t / 0.7) * env_adsr(len(t), 0.003, 0.2)


def bumbo() -> np.ndarray:
    t = np.arange(int(0.35 * SR)) / SR
    f = 50 + 70 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.11)


def chimbal(rng: np.random.Generator) -> np.ndarray:
    n = int(0.05 * SR)
    ruido = rng.standard_normal(n)
    ruido = sosfilt(butter(4, 7000, "highpass", fs=SR, output="sos"), ruido)
    return ruido * np.exp(-np.arange(n) / SR / 0.012)


def adiciona(buf: np.ndarray, sinal: np.ndarray, inicio: float, ganho: float, pan: float = 0.0) -> None:
    i = int(inicio * SR)
    if i >= buf.shape[1]:
        return
    sinal = sinal[: buf.shape[1] - i]
    esq, dir_ = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i : i + len(sinal)] += sinal * ganho * esq * 1.41
    buf[1, i : i + len(sinal)] += sinal * ganho * dir_ * 1.41


def intensidade(t: float) -> float:
    """Curva de energia da música ao longo do vídeo (0–1)."""
    if t < 8:
        return 0.55
    if t < BAIXA[0]:
        return 0.7
    if t < BAIXA[1]:
        return 0.45
    if t < RITMO:
        return 0.75
    if t < ESCOLHA:
        return 0.85
    if t < LIBERDADE[0]:
        return 0.9
    if t < LIBERDADE[1]:
        return 1.0
    return 0.8


def main() -> int:
    rng = np.random.default_rng(7)
    n = int(DURACAO * SR)
    pad = np.zeros((2, n))
    arpejo = np.zeros((2, n))
    graves = np.zeros((2, n))
    perc = np.zeros((2, n))
    melodia = np.zeros((2, n))

    padrao_arpejo = [0, 1, 2, 3, 2, 1, 2, 3]  # índices nas notas do acorde (colcheias)
    compassos = int(DURACAO / COMPASSO)
    for c in range(compassos):
        t0 = c * COMPASSO
        triste = BAIXA[0] <= t0 < BAIXA[1]
        baixo, notas = (TRISTE if triste else NORMAL)[c % 4]
        e = intensidade(t0)

        # pad (acorde sustentado, ataque lento)
        for nota in notas[:3]:
            s = tom(hz(nota), COMPASSO + 0.6, (1.0, 0.18, 0.05), detune=0.0025)
            adiciona(pad, s * env_adsr(len(s), 0.5, 0.6), t0, 0.05)

        # baixo
        if t0 >= 8:
            s = tom(hz(baixo), COMPASSO, (1.0, 0.25))
            s *= np.exp(-np.arange(len(s)) / SR / 1.2) * env_adsr(len(s), 0.01, 0.1)
            adiciona(graves, s, t0, 0.16 * e)

        # arpejo (piano elétrico suave) — some na baixa, volta na virada
        if not triste:
            for k, idx in enumerate(padrao_arpejo):
                if t0 < 8 and k % 2:  # abertura mais espaçada
                    continue
                oitava = 12 if (c % 2 and k >= 4 and t0 >= VIRADA) else 0
                adiciona(arpejo, pluck(hz(notas[idx] + oitava)), t0 + k * BATIDA / 2, 0.11 * e, pan=-0.35 if k % 2 else 0.35)
        else:
            # na baixa: só notas longas e espaçadas
            adiciona(arpejo, pluck(hz(notas[3]), 1.6, 0.8), t0, 0.08)

        # percussão leve a partir dos canais
        if RITMO <= t0 < FINAL + 6:
            for b in range(4):
                if b in (0, 2):
                    adiciona(perc, bumbo(), t0 + b * BATIDA, 0.32 * e)
                adiciona(perc, chimbal(rng), t0 + b * BATIDA + BATIDA / 2, 0.045 * e, pan=0.3)

        # pequena melodia de sinos na escolha e na liberdade
        if ESCOLHA <= t0 < FINAL:
            frase = [notas[3] + 12, notas[2] + 12] if c % 2 == 0 else [notas[1] + 12, notas[3] + 12]
            for k, nota in enumerate(frase):
                adiciona(melodia, sino(hz(nota)), t0 + k * BATIDA * 1.5, 0.055 if t0 < LIBERDADE[0] else 0.075, pan=0.15)

    # acorde final sustentado
    for nota in [60, 64, 67, 72]:
        s = tom(hz(nota), 4.0, (1.0, 0.2, 0.05), detune=0.002)
        adiciona(pad, s * np.exp(-np.arange(len(s)) / SR / 1.6) * env_adsr(len(s), 0.02, 0.5), DURACAO - 4.0, 0.06)

    pad = sosfilt(butter(2, 2200, "lowpass", fs=SR, output="sos"), pad, axis=1)
    arpejo = sosfilt(butter(2, 3800, "lowpass", fs=SR, output="sos"), arpejo, axis=1)
    mix = pad + arpejo + graves + perc + melodia

    # reverberação simples (cauda de ruído decaindo)
    cauda = rng.standard_normal((2, int(1.8 * SR))) * np.exp(-np.arange(int(1.8 * SR)) / SR / 0.45)
    cauda = sosfilt(butter(2, 5000, "lowpass", fs=SR, output="sos"), cauda, axis=1)
    rev = np.stack([fftconvolve(mix[i] - perc[i] * 0.7, cauda[i])[:n] for i in range(2)])
    mix = mix + 0.018 * rev

    # fade de entrada/saída
    fade_in, fade_out = int(1.0 * SR), int(3.0 * SR)
    mix[:, :fade_in] *= np.linspace(0, 1, fade_in)
    mix[:, -fade_out:] *= np.linspace(1, 0, fade_out)
    mix /= np.abs(mix).max() / 0.9

    saida = os.path.join(RAIZ, "public", "trilha.mp3")
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "trilha.wav")
        with wave.open(wav, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5:LRA=9",
             "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "160k", saida],
            check=True,
        )
    print(f"✅ {saida}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
