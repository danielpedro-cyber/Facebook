import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { s } from '../constantes';

/** Mola suave (0 → 1) que começa em `atrasoSeg` segundos do início da cena. */
export const useMola = (atrasoSeg = 0, rigidez = 110) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - s(atrasoSeg),
    fps,
    config: { damping: 18, stiffness: rigidez, mass: 0.9 },
  });
};

/** Texto entrando de baixo: retorna o estilo pronto. */
export const useEntrada = (atrasoSeg = 0, distancia = 60): React.CSSProperties => {
  const p = useMola(atrasoSeg);
  return {
    opacity: interpolate(p, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${(1 - p) * distancia}px)`,
  };
};

/** Ícone crescendo (escala com mola). */
export const useCrescer = (atrasoSeg = 0): React.CSSProperties => {
  const p = useMola(atrasoSeg, 140);
  return {
    opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `scale(${0.4 + 0.6 * p})`,
  };
};

/** Progresso linear 0 → 1 entre dois instantes da cena (com easing suave). */
export const useProgresso = (inicioSeg: number, duracaoSeg: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [s(inicioSeg), s(inicioSeg + duracaoSeg)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};
