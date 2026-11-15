import React from 'react';
import { CORES, FONTE } from '../../constantes';
import { Cenario, Palco } from '../../componentes/Base';
import { Personagem } from '../../componentes/Personagem';
import { useCrescer, useEntrada } from '../../componentes/animacoes';
import { TEXTOS2, momento2 } from '../constantes';

// RESUMO: os três acertos, um por vez, junto com a narração.
export const MOMENTOS_RESUMO = () => ['r1', 'r2', 'r3'].map((id) => momento2('resumo', id));

const Item: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => {
  const e = useEntrada(atraso, 50);
  const c = useCrescer(atraso + 0.1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, ...e }}>
      <div style={{ width: 84, height: 84, borderRadius: 999, background: CORES.royal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...c }}>
        <svg width={46} height={46} viewBox="0 0 40 40">
          <path d="M 8 21 L 17 30 L 33 11" stroke={CORES.branco} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 62, lineHeight: 1.04, color: CORES.marinho }}>{texto}</div>
    </div>
  );
};

export const Resumo2: React.FC = () => {
  const m = MOMENTOS_RESUMO();
  const pers = useCrescer(m[2] + 0.4);
  return (
    <Palco style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 30 }}>
        {TEXTOS2.resumo.map((t, i) => (
          <Item key={t} texto={t} atraso={m[i]} />
        ))}
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <g style={{ opacity: pers.opacity as number }}>
          <ellipse cx={480} cy={792} rx={100} ry={13} fill={CORES.royalClaro} />
          <Personagem pose="comemorando" expressao="feliz" x={480} y={790} escala={0.85} />
        </g>
      </Cenario>
    </Palco>
  );
};
