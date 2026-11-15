import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Cenario, Palco } from '../componentes/Base';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 6 — gestão do investimento (42 a 50 s): o consultor faz as contas.
// Os "números" são perguntas (?) — nada de valores ou promessas de ganho.
const ATRASOS = [momento('gestao', 'invisto', 0.5), momento('gestao', 'devolve'), momento('gestao', 'devolve', 0.6)];

const Pergunta: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => (
  <div
    style={{
      width: 680,
      height: 108,
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      padding: '0 24px',
      background: CORES.branco,
      border: `3px solid ${CORES.trilho}`,
      borderRadius: 24,
      ...useEntrada(atraso, 70),
    }}
  >
    <div
      style={{
        width: 68,
        height: 68,
        borderRadius: 999,
        background: CORES.royal,
        color: CORES.branco,
        fontFamily: FONTE.titulo,
        fontSize: 46,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...useCrescer(atraso + 0.2),
      }}
    >
      ?
    </div>
    <span style={{ fontFamily: FONTE.titulo, fontSize: 44, fontWeight: 700 }}>{texto}</span>
  </div>
);

const Comparacao: React.FC<{ rotulo: string; resultado: string; atraso: number; destaque?: boolean }> = ({ rotulo, resultado, atraso, destaque }) => (
  <div
    style={{
      width: 960,
      padding: '18px 30px',
      borderRadius: 999,
      display: 'flex',
      justifyContent: 'center',
      gap: 16,
      fontSize: 42,
      fontWeight: 600,
      background: destaque ? CORES.marinho : 'transparent',
      color: destaque ? CORES.branco : CORES.cinza,
      border: `3px solid ${destaque ? CORES.marinho : CORES.trilho}`,
      ...useEntrada(atraso),
    }}
  >
    <span>{rotulo}</span>
    <span>=</span>
    <span style={{ fontWeight: 800 }}>{resultado}</span>
  </div>
);

export const Cena6Gestao: React.FC = () => {
  const entra = useCrescer(0.05);
  const final = momento('gestao', 'investimento', 0.3);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ position: 'absolute', top: 10, left: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TEXTOS.gestao.map((t, i) => (
          <Pergunta key={t} texto={t} atraso={ATRASOS[i]} />
        ))}
      </div>
      <Cenario altura={560} style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={850} cy={518} rx={100} ry={14} fill={CORES.royalClaro} />
        <g opacity={entra.opacity as number}>
          <Personagem pose="segurando" objeto="calculadora" espelhado expressao="neutro" x={850} y={515} escala={0.9} />
        </g>
      </Cenario>
      <div style={{ position: 'absolute', top: 580, left: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Comparacao rotulo="Gastar sem medir" resultado="despesa" atraso={momento('gestao', 'despesa', 0.3)} />
        <Comparacao rotulo="Gastar medindo" resultado="investimento" atraso={final} destaque />
      </div>
    </Palco>
  );
};
