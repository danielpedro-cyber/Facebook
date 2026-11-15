import React from 'react';
import { Efeito } from '../componentes/TrilhaSonora';
import { Marcadores } from '../serie/Marcadores';
import { VideoEpisodio, whooshes } from '../serie/VideoEpisodio';
import { COMPONENTES4, Lua, Sol } from './cenas';
import { CENAS4, LEGENDAS4, abs4 } from './constantes';

const PERIODOS = ['manha', 'tarde', 'noite'] as const;
const IDS = { manha: ['mV', 'mE'], tarde: ['tE', 'tV'], noite: ['nV', 'nE'] } as const;

export const EFEITOS4 = (): Efeito[] => [
  ...whooshes(CENAS4),
  ...PERIODOS.flatMap((p) => [
    { arquivo: 'tique', em: CENAS4[p].inicio + 0.25, volume: 0.6 },
    ...IDS[p].map((id) => ({ arquivo: 'pop', em: abs4(id, 0.3), volume: 0.45 })),
  ]),
  { arquivo: 'pop', em: abs4('pV', 0.3), volume: 0.45 },
  { arquivo: 'pop', em: abs4('pE', 0.3), volume: 0.45 },
  { arquivo: 'brilho', em: abs4('liberdade', 0.5), volume: 0.4 },
  { arquivo: 'brilho', em: CENAS4.fechamento.inicio + 0.2, volume: 0.4 },
  { arquivo: 'pop', em: abs4('manda'), volume: 0.5 },
  { arquivo: 'pop', em: abs4('comenta'), volume: 0.5 },
];

const icone = (i: number) => (
  <foreignObject x={-22} y={-22} width={44} height={44}>
    <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>{i === 2 ? <Lua tamanho={40} /> : <Sol tamanho={40} baixo={i === 1} />}</div>
  </foreignObject>
);

export const VideoBussola4: React.FC = () => (
  <VideoEpisodio
    cenas={CENAS4}
    componentes={COMPONENTES4}
    legendas={LEGENDAS4}
    narracao="narracao-ep4.mp3"
    trilha="trilha-ep4.mp3"
    efeitos={EFEITOS4()}
    sobreposicao={
      <>
        <Marcadores
          xs={[240, 540, 840]}
          rotulo={icone}
          estado={(i, t) => {
            const { inicio, fim } = CENAS4[PERIODOS[i]];
            return t >= fim ? { estado: 'ok', desde: fim } : t >= inicio ? { estado: 'atual', desde: inicio } : { estado: 'pendente', desde: 0 };
          }}
        />
      </>
    }
  />
);
