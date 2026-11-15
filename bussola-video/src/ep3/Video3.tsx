import React from 'react';
import { Efeito } from '../componentes/TrilhaSonora';
import { Marcadores, RotuloFaixas } from '../serie/Marcadores';
import { VideoEpisodio, whooshes } from '../serie/VideoEpisodio';
import { COMPONENTES3 } from './cenas';
import { CENAS3, LEGENDAS3, TEXTOS3, abs3 } from './constantes';

const PASSOS = ['passo1', 'passo2', 'passo3', 'passo4', 'passo5'] as const;
const fimPasso = (i: number) => CENAS3[PASSOS[i]].fim;

export const EFEITOS3 = (): Efeito[] => [
  ...whooshes(CENAS3),
  ...PASSOS.flatMap((p, i) => [
    { arquivo: 'tique', em: CENAS3[p].inicio + 0.25, volume: 0.6 },
    { arquivo: 'brilho', em: abs3(`p${i + 1}f`), volume: 0.4 },
  ]),
  { arquivo: 'pop', em: abs3('p1f', 0.15), volume: 0.5 },
  ...[0.5, 0.68, 0.86].map((f) => ({ arquivo: 'pop', em: abs3('p2f', f), volume: 0.45 })),
  ...[0.15, 0.4, 0.65].map((f) => ({ arquivo: 'pop', em: abs3('p3f', f), volume: 0.4 })),
  { arquivo: 'ding', em: abs3('p4f', 0.55), volume: 0.4 },
  { arquivo: 'pop', em: abs3('p5f', 0.3), volume: 0.5 },
  ...[0, 1, 2].map((i) => ({ arquivo: 'pop', em: abs3('p5i', 0.1 + i * 0.22), volume: 0.45 })),
  { arquivo: 'brilho', em: CENAS3.fechamento.inicio + 0.2, volume: 0.4 },
  { arquivo: 'pop', em: abs3('manda'), volume: 0.5 },
  { arquivo: 'pop', em: abs3('comenta'), volume: 0.5 },
];

export const VideoBussola3: React.FC = () => (
  <VideoEpisodio
    cenas={CENAS3}
    componentes={COMPONENTES3}
    legendas={LEGENDAS3}
    narracao="narracao-ep3.mp3"
    trilha="trilha-ep3.mp3"
    efeitos={EFEITOS3()}
    sobreposicao={
      <>
        <Marcadores
          xs={[140, 340, 540, 740, 940]}
          estado={(i, t) => {
            const ini = CENAS3[PASSOS[i]].inicio;
            const fim = fimPasso(i);
            return t >= fim ? { estado: 'ok', desde: fim } : t >= ini ? { estado: 'atual', desde: ini } : { estado: 'pendente', desde: 0 };
          }}
        />
        <RotuloFaixas faixas={PASSOS.map((p, i) => ({ ...CENAS3[p], texto: `Passo ${i + 1} de 5 · ${TEXTOS3.passos[i].titulo}` }))} />
      </>
    }
  />
);
