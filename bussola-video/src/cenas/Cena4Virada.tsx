import React from 'react';
import { interpolateColors } from 'remotion';
import { CORES, TEXTOS, momento } from '../constantes';
import { Palco, Titulo } from '../componentes/Base';
import { IconeLampada } from '../componentes/Icones';
import { useEntrada, useMola, useProgresso } from '../componentes/animacoes';

// CENA 4 — virada de mentalidade (24 a 32 s)
export const Cena4Virada: React.FC = () => {
  const desenho = useProgresso(0.2, 1.4);
  const acende = useProgresso(1.8, 0.6);
  const raios = useMola(2.0);
  const texto = useEntrada(momento('virada', 'daqui'));
  const destaque = useMola(momento('virada', 'investir', 0.5));

  const preenchimento = interpolateColors(acende, [0, 1], [CORES.fundo, CORES.royalClaro]);
  const corTraco = interpolateColors(acende, [0, 1], [CORES.marinho, CORES.royal]);

  return (
    <Palco style={{ gap: 50 }}>
      <div style={{ position: 'relative', width: 420, height: 420 }}>
        <svg width={420} height={420} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const ang = (-90 + (i - 3) * 30) * (Math.PI / 180);
            const r1 = 175;
            const r2 = 175 + 40 * raios;
            return (
              <line
                key={i}
                x1={210 + Math.cos(ang) * r1}
                y1={185 + Math.sin(ang) * r1}
                x2={210 + Math.cos(ang) * r2}
                y2={185 + Math.sin(ang) * r2}
                stroke={CORES.royal}
                strokeWidth={10}
                strokeLinecap="round"
                opacity={raios > 0.02 ? 1 : 0}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: 60, top: 30 }}>
          <IconeLampada tamanho={300} espessura={2.6} desenho={desenho} cor={corTraco} preenchimento={preenchimento} />
        </div>
      </div>
      <Titulo style={{ ...texto, maxWidth: 940 }}>
        {TEXTOS.virada.antes}
        <span
          style={{
            color: CORES.royal,
            display: 'inline-block',
            transform: `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, destaque))})`,
            borderBottom: `8px solid ${CORES.royal}`,
          }}
        >
          {TEXTOS.virada.destaque}
        </span>
      </Titulo>
    </Palco>
  );
};
