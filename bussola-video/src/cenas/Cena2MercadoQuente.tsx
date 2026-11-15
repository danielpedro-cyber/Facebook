import React from 'react';
import { CORES, FONTE, momento } from '../constantes';
import { Cenario, Palco, SeloIcone } from '../componentes/Base';
import { IconeAmigos, IconeFamilia, IconeMaleta } from '../componentes/Icones';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 2 — mercado quente: o consultor liga para a família, amigos e ex-colegas.
const CONTATOS = [
  { rotulo: 'Família', Icone: IconeFamilia, x: 150, y: 150, atraso: momento('mercadoQuente', 'familia', 0.12) },
  { rotulo: 'Amigos', Icone: IconeAmigos, x: 810, y: 150, atraso: momento('mercadoQuente', 'familia', 0.38) },
  { rotulo: 'Ex-trabalho', Icone: IconeMaleta, x: 810, y: 420, atraso: momento('mercadoQuente', 'familia', 0.68) },
];
const MAO = { x: 545, y: 330 }; // posição aproximada do celular

const Contato: React.FC<(typeof CONTATOS)[number]> = ({ rotulo, Icone, x, y, atraso }) => (
  <div
    style={{
      position: 'absolute',
      left: x - 150,
      top: y - 75,
      width: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      ...useCrescer(atraso),
    }}
  >
    <SeloIcone tamanho={140} fundo={CORES.branco} style={{ border: `5px solid ${CORES.royal}` }}>
      <Icone tamanho={86} cor={CORES.azulProfundo} />
    </SeloIcone>
    <span style={{ fontFamily: FONTE.titulo, fontSize: 44, fontWeight: 700, whiteSpace: 'nowrap' }}>{rotulo}</span>
  </div>
);

const Ligacao: React.FC<{ x: number; y: number; atraso: number }> = ({ x, y, atraso }) => {
  const p = useProgresso(atraso - 0.25, 0.5);
  return (
    <line x1={MAO.x} y1={MAO.y} x2={MAO.x + (x - MAO.x) * p} y2={MAO.y + (y - MAO.y) * p} stroke={CORES.royal} strokeWidth={6} strokeDasharray="3 16" strokeLinecap="round" />
  );
};

const Pilula: React.FC<{ texto: string; atraso: number; cheia?: boolean }> = ({ texto, atraso, cheia }) => (
  <div
    style={{
      padding: '18px 36px',
      borderRadius: 999,
      fontFamily: FONTE.titulo,
      fontSize: 50,
      fontWeight: 700,
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
  const entra = useCrescer(0.1);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ position: 'relative', width: 960, height: 640 }}>
        <Cenario altura={640} style={{ position: 'absolute', inset: 0 }}>
          {CONTATOS.map((c) => (
            <Ligacao key={c.rotulo} x={c.x} y={c.y} atraso={c.atraso} />
          ))}
          <g style={{ opacity: entra.opacity as number }}>
            <Personagem pose="celular" objeto="celular" expressao="feliz" x={470} y={610} escala={1.05} />
          </g>
        </Cenario>
        {CONTATOS.map((c) => (
          <Contato key={c.rotulo} {...c} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 30 }}>
        <Pilula texto="Sem custo" atraso={momento('mercadoQuente', 'semCusto', 0.2)} />
        <Pilula texto="Exige coragem" atraso={momento('mercadoQuente', 'coragem', 0.2)} cheia />
      </div>
    </Palco>
  );
};
