import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CORES, s } from '../constantes';
import { Fundo } from '../componentes/Base';
import { Legendas } from '../componentes/Legendas';
import { Transicao } from '../componentes/Transicao';
import { Efeito, TrilhaSonora } from '../componentes/TrilhaSonora';
import { Faixa, Legenda } from './tempos';

/** Monta um episódio: cenas em sequência com transição, sobreposições fixas, legendas e áudio. */
export const VideoEpisodio: React.FC<{
  cenas: Record<string, Faixa>;
  componentes: Record<string, React.FC>;
  legendas: Legenda[];
  narracao: string;
  trilha: string;
  efeitos: Efeito[];
  sobreposicao?: React.ReactNode;
}> = ({ cenas, componentes, legendas, narracao, trilha, efeitos, sobreposicao }) => {
  const nomes = Object.keys(cenas);
  const duracao = Math.max(...Object.values(cenas).map((c) => c.fim));
  return (
    <AbsoluteFill style={{ backgroundColor: CORES.fundo }}>
      <Fundo />
      {nomes.map((nome, i) => {
        const { inicio, fim } = cenas[nome];
        const Cena = componentes[nome];
        return (
          <Sequence key={nome} name={nome} from={s(inicio)} durationInFrames={s(fim - inicio)}>
            <Transicao primeira={i === 0} ultima={i === nomes.length - 1}>
              <Cena />
            </Transicao>
          </Sequence>
        );
      })}
      {sobreposicao}
      <Legendas legendas={legendas} />
      <TrilhaSonora narracao={narracao} trilha={trilha} legendas={legendas} efeitos={efeitos} duracaoSeg={duracao} />
    </AbsoluteFill>
  );
};

/** Whoosh em toda troca de cena. */
export const whooshes = (cenas: Record<string, Faixa>): Efeito[] =>
  Object.values(cenas)
    .slice(1)
    .map((c) => ({ arquivo: 'whoosh', em: c.inicio - 0.2, volume: 0.5 }));
