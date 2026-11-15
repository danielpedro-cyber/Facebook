import React from 'react';
import { CORES, FONTE } from '../constantes';
import { Palco, SeloIcone } from '../componentes/Base';
import { IconeAmigos, IconeCelular, IconeFamilia, IconeMaleta } from '../componentes/Icones';
import { useCrescer, useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 2 — mercado quente (5 a 15 s). Tempos relativos ao início da cena.
const CONTATOS = [
  { rotulo: 'Família', Icone: IconeFamilia, x: 160, y: 120, atraso: 0.5 },
  { rotulo: 'Amigos', Icone: IconeAmigos, x: 800, y: 120, atraso: 2.3 },
  { rotulo: 'Ex-trabalho', Icone: IconeMaleta, x: 480, y: 440, atraso: 3.6 },
];
const CENTRO = { x: 480, y: 210 };

const Contato: React.FC<(typeof CONTATOS)[number]> = ({ rotulo, Icone, x, y, atraso }) => {
  const estilo = useCrescer(atraso);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 160,
        top: y - 85,
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        ...estilo,
      }}
    >
      <SeloIcone tamanho={150} fundo={CORES.branco} style={{ border: `4px solid ${CORES.marinho}` }}>
        <Icone tamanho={92} />
      </SeloIcone>
      <span style={{ fontSize: 44, fontWeight: 700, whiteSpace: 'nowrap' }}>{rotulo}</span>
    </div>
  );
};

const Ligacao: React.FC<{ x: number; y: number; atraso: number }> = ({ x, y, atraso }) => {
  const p = useProgresso(atraso - 0.2, 0.6);
  const x2 = CENTRO.x + (x - CENTRO.x) * p;
  const y2 = CENTRO.y + (y - CENTRO.y) * p;
  return <line x1={CENTRO.x} y1={CENTRO.y} x2={x2} y2={y2} stroke={CORES.royal} strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />;
};

const Pilula: React.FC<{ texto: string; atraso: number; cheia?: boolean }> = ({ texto, atraso, cheia }) => (
  <div
    style={{
      padding: '18px 34px',
      borderRadius: 999,
      fontSize: FONTE.texto - 4,
      fontWeight: 800,
      background: cheia ? CORES.marinho : CORES.branco,
      color: cheia ? CORES.branco : CORES.marinho,
      border: `4px solid ${CORES.marinho}`,
      ...useEntrada(atraso),
    }}
  >
    {texto}
  </div>
);

export const Cena2MercadoQuente: React.FC = () => {
  const celular = useCrescer(0.1);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ position: 'relative', width: 960, height: 590 }}>
        <svg width={960} height={590} style={{ position: 'absolute', inset: 0 }}>
          {CONTATOS.map((c) => (
            <Ligacao key={c.rotulo} x={c.x} y={c.y} atraso={c.atraso} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: CENTRO.x - 110, top: CENTRO.y - 140, ...celular }}>
          <SeloIcone tamanho={220} fundo={CORES.royalClaro}>
            <IconeCelular tamanho={170} espessura={3} />
          </SeloIcone>
        </div>
        {CONTATOS.map((c) => (
          <Contato key={c.rotulo} {...c} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 50 }}>
        <Pilula texto="Sem custo" atraso={5.6} />
        <Pilula texto="Exige coragem" atraso={7.4} cheia />
      </div>
    </Palco>
  );
};
