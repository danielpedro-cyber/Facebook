import React from 'react';
import { CORES, FONTE, TEXTOS } from '../constantes';
import { Palco } from '../componentes/Base';
import { IconeCalculadora } from '../componentes/Icones';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 6 — gestão do investimento (42 a 50 s).
// Os "números" são perguntas (?) — nada de valores ou promessas de ganho.
const ATRASOS = [0.3, 1.3, 2.4];

const Pergunta: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => {
  const linha = useEntrada(atraso, 70);
  const selo = useCrescer(atraso + 0.2);
  return (
    <div
      style={{
        width: 900,
        height: 116,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '0 26px',
        background: CORES.branco,
        border: `4px solid ${CORES.marinho}`,
        borderRadius: 24,
        ...linha,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 999,
          background: CORES.royal,
          color: CORES.branco,
          fontSize: 50,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...selo,
        }}
      >
        ?
      </div>
      <span style={{ fontSize: FONTE.texto, fontWeight: 800 }}>{texto}</span>
    </div>
  );
};

const Comparacao: React.FC<{ rotulo: string; resultado: string; atraso: number; destaque?: boolean }> = ({
  rotulo,
  resultado,
  atraso,
  destaque,
}) => (
  <div
    style={{
      width: 900,
      padding: '18px 30px',
      borderRadius: 999,
      display: 'flex',
      justifyContent: 'center',
      gap: 16,
      fontSize: 44,
      fontWeight: 700,
      background: destaque ? CORES.marinho : 'transparent',
      color: destaque ? CORES.branco : CORES.cinza,
      border: `4px solid ${destaque ? CORES.marinho : CORES.trilho}`,
      ...useEntrada(atraso),
    }}
  >
    <span>{rotulo}</span>
    <span>=</span>
    <span style={{ fontWeight: 800 }}>{resultado}</span>
  </div>
);

export const Cena6Gestao: React.FC = () => {
  const calc = useCrescer(0.1);
  return (
    <Palco style={{ gap: 18 }}>
      <div style={{ ...calc, marginBottom: 6 }}>
        <IconeCalculadora tamanho={150} espessura={3} />
      </div>
      {TEXTOS.gestao.map((t, i) => (
        <Pergunta key={t} texto={t} atraso={ATRASOS[i]} />
      ))}
      <div style={{ height: 10 }} />
      <Comparacao rotulo="Gastar sem medir" resultado="despesa" atraso={4.0} />
      <Comparacao rotulo="Gastar medindo" resultado="investimento" atraso={6.0} destaque />
    </Palco>
  );
};
