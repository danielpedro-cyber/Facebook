import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CORES, FONTE } from '../../constantes';
import { Cenario, Palco } from '../../componentes/Base';
import { Personagem } from '../../componentes/Personagem';
import { TEXTOS2 } from '../constantes';

// GANCHO (0–5 s): 1º quadro = capa. Título inteiro já no quadro 0, três "X" e o consultor preocupado.
export const Gancho2: React.FC = () => {
  const frame = useCurrentFrame();
  const { titulo, destaque } = TEXTOS2.gancho;
  const i = titulo.indexOf(destaque);
  const escala = 1 + 0.012 * Math.sin(frame * 0.12);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ alignSelf: 'flex-start', fontFamily: FONTE.texto, fontWeight: 800, fontSize: 30, letterSpacing: 5, textTransform: 'uppercase', color: CORES.branco, background: CORES.royal, padding: '8px 20px', borderRadius: 12 }}>
        {TEXTOS2.serie}
      </div>
      <div style={{ marginTop: 26, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 104, lineHeight: 1.0, letterSpacing: -2.5, textAlign: 'center', color: CORES.marinho, transform: `scale(${escala})` }}>
        {titulo.slice(0, i)}
        <span style={{ color: CORES.royal }}>{destaque}</span>
        {titulo.slice(i + destaque.length)}
      </div>
      <div style={{ display: 'flex', gap: 40, marginTop: 34 }}>
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            style={{
              width: 120,
              height: 120,
              borderRadius: 999,
              background: CORES.vermelhoClaro,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${Math.sin(frame * 0.1 + k) * 4}deg)`,
            }}
          >
            <svg width={60} height={60} viewBox="0 0 60 60">
              <path d="M 14 14 L 46 46 M 46 14 L 14 46" stroke={CORES.vermelhoSuave} strokeWidth={10} strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={480} cy={812} rx={90} ry={12} fill={CORES.royalClaro} />
        <Personagem pose="pensando" expressao="triste" x={480} y={810} escala={0.68} />
      </Cenario>
    </Palco>
  );
};
