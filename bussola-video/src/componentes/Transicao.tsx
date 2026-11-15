import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { TRANSICAO_CENA, s } from '../constantes';

/**
 * Transição entre cenas: a nova cena entra deslizando da direita e a anterior sai
 * para a esquerda (a "câmera" segue a estrada), com um zoom lento durante a cena.
 */
export const Transicao: React.FC<{ children: React.ReactNode; primeira: boolean; ultima: boolean }> = ({
  children,
  primeira,
  ultima,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = s(TRANSICAO_CENA);
  const op = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
  const entra = primeira ? 1 : interpolate(frame, [0, t], [0, 1], { ...op, easing: Easing.out(Easing.cubic) });
  const sai = ultima ? 0 : interpolate(frame, [durationInFrames - t, durationInFrames], [0, 1], { ...op, easing: Easing.in(Easing.cubic) });
  const x = (1 - entra) * 110 - sai * 110;
  const zoom = 1 + 0.03 * (frame / durationInFrames);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entra, 1 - sai),
        transform: `translateX(${x}px) scale(${zoom})`,
        transformOrigin: '50% 50%',
        filter: entra < 1 || sai > 0 ? `blur(${Math.max(1 - entra, sai) * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
