import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CORES, s } from '../constantes';
import { Fundo } from '../componentes/Base';
import { Legendas } from '../componentes/Legendas';
import { Transicao } from '../componentes/Transicao';
import { TrilhaSonora } from '../componentes/TrilhaSonora';
import { CENAS2, DURACAO2, LEGENDAS2, NomeCena2 } from './constantes';
import { EFEITOS2 } from './efeitos';
import { Progresso, RotuloProgresso } from './Progresso';
import { Gancho2 } from './cenas/Gancho';
import { Promessa2 } from './cenas/Promessa';
import { Erro1 } from './cenas/Erro1';
import { Erro2 } from './cenas/Erro2';
import { Erro3 } from './cenas/Erro3';
import { Resumo2 } from './cenas/Resumo';
import { Fechamento2 } from './cenas/Fechamento';

const COMPONENTES: Record<NomeCena2, React.FC> = {
  gancho: Gancho2,
  promessa: Promessa2,
  erro1: Erro1,
  erro2: Erro2,
  erro3: Erro3,
  resumo: Resumo2,
  fechamento: Fechamento2,
};

/** Bússola #2 — "3 erros de quem começa". */
export const VideoBussola2: React.FC = () => {
  const nomes = Object.keys(CENAS2) as NomeCena2[];
  return (
    <AbsoluteFill style={{ backgroundColor: CORES.fundo }}>
      <Fundo />
      {nomes.map((nome, i) => {
        const { inicio, fim } = CENAS2[nome];
        const Cena = COMPONENTES[nome];
        return (
          <Sequence key={nome} name={nome} from={s(inicio)} durationInFrames={s(fim - inicio)}>
            <Transicao primeira={i === 0} ultima={i === nomes.length - 1}>
              <Cena />
            </Transicao>
          </Sequence>
        );
      })}
      <Progresso />
      <RotuloProgresso />
      <Legendas legendas={LEGENDAS2} />
      <TrilhaSonora narracao="narracao-ep2.mp3" trilha="trilha-ep2.mp3" legendas={LEGENDAS2} efeitos={EFEITOS2} duracaoSeg={DURACAO2} />
    </AbsoluteFill>
  );
};
