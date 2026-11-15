import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CORES, FONTE, LAYOUT, LEGENDAS, s } from '../constantes';

// Legendas grandes, centralizadas e sempre na tela.
// Cada legenda fica até a próxima começar (ver LEGENDAS em constantes.ts).

export const Legendas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let idx = 0;
  LEGENDAS.forEach((l, i) => {
    if (t >= l.inicio) idx = i;
  });
  const atual = LEGENDAS[idx];
  const entra = idx === 0 ? 1 : spring({ frame: frame - s(atual.inicio), fps, config: { damping: 20, stiffness: 180 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.legendaTopo,
        height: LAYOUT.legendaAltura,
        left: 50,
        right: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: CORES.marinho,
          color: CORES.branco,
          fontFamily: FONTE.texto,
          fontWeight: 700,
          fontSize: FONTE.tamLegenda,
          lineHeight: 1.22,
          textAlign: 'center',
          padding: '22px 38px',
          borderRadius: 24,
          maxWidth: 960,
          opacity: interpolate(entra, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `translateY(${(1 - entra) * 24}px)`,
        }}
      >
        {atual.texto}
      </div>
    </div>
  );
};
