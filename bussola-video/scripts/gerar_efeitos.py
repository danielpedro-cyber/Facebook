"""
Gera os efeitos sonoros do vídeo em public/sfx/ (tudo sintetizado aqui,
sem direitos autorais de terceiros).

Uso:
    .venv/bin/python scripts/gerar_efeitos.py

Requer numpy, scipy e ffmpeg.
"""

from __future__ import annotations

import os
import subprocess
import tempfile
import wave

import numpy as np
from scipy.signal import butter, sosfilt

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
rng = np.random.default_rng(11)


def t(d: float) -> np.ndarray:
    return np.arange(int(d * SR)) / SR


def filtro(x: np.ndarray, tipo: str, f) -> np.ndarray:
    return sosfilt(butter(2, f, tipo, fs=SR, output="sos"), x)


def whoosh() -> np.ndarray:
    d = 0.55
    tt = t(d)
    ruido = rng.standard_normal(len(tt))
    # varre o filtro de grave para agudo e volta (sensação de passagem)
    partes = np.array_split(ruido, 24)
    saida = []
    for i, p in enumerate(partes):
        c = 500 + 2600 * np.sin(np.pi * i / 23)
        saida.append(filtro(p, "bandpass", [c * 0.6, c * 1.4]))
    x = np.concatenate(saida)
    env = np.sin(np.pi * tt / d) ** 2
    return x * env * 0.9


def pop() -> np.ndarray:
    tt = t(0.12)
    f = 520 + 520 * (tt / 0.12)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.035)
    return x


def tique() -> np.ndarray:
    tt = t(0.09)
    x = (np.sin(2 * np.pi * 1250 * tt) + 0.5 * np.sin(2 * np.pi * 2500 * tt)) * np.exp(-tt / 0.018)
    return x


def ding() -> np.ndarray:
    tt = t(1.6)
    f0 = 1318.5
    x = np.sin(2 * np.pi * f0 * tt) + 0.4 * np.sin(2 * np.pi * f0 * 2.01 * tt) * np.exp(-tt / 0.25) + 0.2 * np.sin(2 * np.pi * f0 * 3.0 * tt) * np.exp(-tt / 0.12)
    return x * np.exp(-tt / 0.55)


def toque() -> np.ndarray:
    # toque de celular suave: dois "trrrim" curtos
    um = t(0.7)
    tom = (np.sin(2 * np.pi * 880 * um) + np.sin(2 * np.pi * 1108 * um)) * 0.5
    mod = (np.sin(2 * np.pi * 18 * um) > 0).astype(float) * 0.7 + 0.3
    env = np.minimum(1, um / 0.02) * np.minimum(1, (0.7 - um) / 0.05)
    toque1 = filtro(tom * mod * env, "lowpass", 3000)
    pausa = np.zeros(int(0.35 * SR))
    return np.concatenate([toque1, pausa, toque1])


def impacto() -> np.ndarray:
    tt = t(0.6)
    f = 45 + 80 * np.exp(-tt / 0.05)
    grave = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.18)
    ruido = filtro(rng.standard_normal(len(tt)), "lowpass", 900) * np.exp(-tt / 0.04) * 0.6
    return grave + ruido


def brilho() -> np.ndarray:
    notas = [1046.5, 1318.5, 1568.0, 2093.0]
    total = np.zeros(int(1.6 * SR))
    for i, f in enumerate(notas):
        tt = t(1.2)
        n = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt) * np.exp(-tt / 0.1)) * np.exp(-tt / 0.35)
        ini = int(i * 0.07 * SR)
        total[ini : ini + len(n)] += n * (0.8 - i * 0.1)
    return total


EFEITOS = {
    "whoosh": (whoosh, 0.55),
    "pop": (pop, 0.5),
    "tique": (tique, 0.45),
    "ding": (ding, 0.45),
    "toque": (toque, 0.35),
    "impacto": (impacto, 0.8),
    "brilho": (brilho, 0.45),
}


def main() -> None:
    destino = os.path.join(RAIZ, "public", "sfx")
    os.makedirs(destino, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for nome, (fn, pico) in EFEITOS.items():
            x = fn()
            x = x / max(1e-6, np.abs(x).max()) * pico
            wav = os.path.join(tmp, f"{nome}.wav")
            with wave.open(wav, "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(SR)
                w.writeframes((x * 32767).astype(np.int16).tobytes())
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", os.path.join(destino, f"{nome}.mp3")],
                check=True,
            )
            print(f"✅ sfx/{nome}.mp3")


if __name__ == "__main__":
    main()
