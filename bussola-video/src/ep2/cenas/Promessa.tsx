import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CORES, FONTE } from '../../constantes';
import { Cenario, Palco } from '../../componentes/Base';
import { Personagem } from '../../componentes/Personagem';
import { useCrescer, useEntrada } from '../../componentes/animacoes';
import { TEXTOS2, momento2 } from '../constantes';

// PROMESSA (5–8,5 s): "O terceiro é o mais comum. Fica até o final." — abre um ciclo.
export const Promessa2: React.FC = () => {
  const frame = useCurrentFrame();
  const l1 = useEntrada(momento2('promessa', 'terceiro'), 50);
  const l2 = useEntrada(momento2('promessa', 'fica'), 50);
  const destaque = useCrescer(momento2('promessa', 'terceiro', 0.3));
  const pulso = 1 + 0.06 * Math.abs(Math.sin(frame * 0.2));
  const [a, b, c] = TEXTOS2.promessa.linha1;
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 100, lineHeight: 1.02, letterSpacing: -2.5, textAlign: 'center', color: CORES.marinho }}>
        <div style={l1}>
          {a}
          <span style={{ color: CORES.royal }}>{b}</span>
          {c}
        </div>
        <div style={{ ...l2, color: CORES.cinza, fontSize: 76, marginTop: 10 }}>{TEXTOS2.promessa.linha2}</div>
      </div>
      <div style={{ display: 'flex', gap: 36, alignItems: 'center', marginTop: 46 }}>
        {[1, 2].map((n) => (
          <div key={n} style={{ width: 120, height: 120, borderRadius: 999, border: `5px solid ${CORES.trilho}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 52, color: CORES.cinza }}>
            {n}
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...destaque }}>
          <div style={{ width: 170, height: 170, borderRadius: 999, background: CORES.vermelhoSuave, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 84, color: CORES.branco, transform: `scale(${pulso})` }}>
            3
          </div>
          <div style={{ fontFamily: FONTE.texto, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: CORES.vermelho }}>o mais comum</div>
        </div>
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={150} cy={812} rx={80} ry={12} fill={CORES.royalClaro} />
        <Personagem pose="apontando" expressao="feliz" x={140} y={810} escala={0.68} />
      </Cenario>
    </Palco>
  );
};
