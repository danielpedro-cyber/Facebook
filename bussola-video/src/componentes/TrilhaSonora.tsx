import React from 'react';
import { Audio, Sequence, getStaticFiles, interpolate, staticFile, useVideoConfig } from 'remotion';
import { AUDIO, s } from '../constantes';

export type Legenda = { id: string; inicio: number; fim: number; texto: string };
export type Efeito = { arquivo: string; em: number; volume?: number };

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === arquivo);

/** 0 → 1 conforme a narração está falando (com rampas suaves) — usado no ducking da trilha. */
const vozAtiva = (legendas: Legenda[], tSeg: number) => {
  let v = 0;
  for (const l of legendas) {
    const sobe = (tSeg - (l.inicio - 0.3)) / 0.3;
    const desce = (l.fim + 0.45 - tSeg) / 0.3;
    v = Math.max(v, Math.min(1, Math.max(0, Math.min(sobe, desce))));
  }
  return v;
};

/**
 * Narração + trilha (que abaixa sozinha quando a voz fala) + efeitos sonoros.
 * Arquivos que não existirem em /public são ignorados.
 */
export const TrilhaSonora: React.FC<{
  narracao: string;
  trilha: string;
  legendas: Legenda[];
  efeitos: Efeito[];
  duracaoSeg: number;
}> = ({ narracao, trilha, legendas, efeitos, duracaoSeg }) => {
  const temNarracao = existe(narracao);
  const temTrilha = existe(trilha);
  const total = s(duracaoSeg);
  const fade = s(AUDIO.fadeTrilhaSeg);
  const { fps } = useVideoConfig();
  const base = (f: number) =>
    temNarracao
      ? AUDIO.volumeTrilhaEntreFrases - (AUDIO.volumeTrilhaEntreFrases - AUDIO.volumeTrilhaComNarracao) * vozAtiva(legendas, f / fps)
      : AUDIO.volumeTrilhaSemNarracao;
  return (
    <>
      {temNarracao && <Audio src={staticFile(narracao)} volume={AUDIO.volumeNarracao} />}
      {temTrilha && (
        <Audio
          src={staticFile(trilha)}
          loop
          volume={(f) =>
            base(f) *
            interpolate(f, [0, fade, total - fade, total], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
      {efeitos
        .filter((e) => existe(`sfx/${e.arquivo}.mp3`))
        .map((e, i) => (
          <Sequence key={i} from={Math.max(0, s(e.em))} durationInFrames={s(2.5)} layout="none">
            <Audio src={staticFile(`sfx/${e.arquivo}.mp3`)} volume={(e.volume ?? 0.5) * AUDIO.volumeEfeitos * 1.4} />
          </Sequence>
        ))}
    </>
  );
};
