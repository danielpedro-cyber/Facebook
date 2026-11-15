import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CORES, FONTE, LAYOUT, VIDEO, s } from '../constantes';

// Marcadores de progresso no topo (substitui a estrada): pendente → atual → ok.
export type EstadoMarcador = 'pendente' | 'atual' | 'ok';

export const Marcadores: React.FC<{
  xs: number[];
  /** Estado de cada marcador e desde quando (s), no instante t. */
  estado: (i: number, t: number) => { estado: EstadoMarcador; desde: number };
  /** Conteúdo do marcador quando pendente/atual (padrão: número). */
  rotulo?: (i: number) => React.ReactNode;
}> = ({ xs, estado, rotulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Y = 95;
  const estados = xs.map((_, i) => estado(i, t));
  // linha preenchida até o último marcador não pendente
  let ultimo = -1;
  estados.forEach((e, i) => {
    if (e.estado !== 'pendente') ultimo = i;
  });
  return (
    <svg width={VIDEO.largura} height={LAYOUT.rotaAltura} style={{ position: 'absolute', top: LAYOUT.rotaTopo, left: 0 }}>
      <line x1={xs[0]} y1={Y} x2={xs[xs.length - 1]} y2={Y} stroke={CORES.trilho} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 20" />
      {ultimo > 0 && <line x1={xs[0]} y1={Y} x2={xs[ultimo]} y2={Y} stroke={CORES.royal} strokeWidth={10} strokeLinecap="round" />}
      {xs.map((x, i) => {
        const { estado: e, desde } = estados[i];
        const pop = e === 'pendente' ? 1 : spring({ frame: frame - s(desde), fps, config: { damping: 11, stiffness: 170 } });
        return (
          <g key={i} transform={`translate(${x} ${Y}) scale(${0.6 + 0.4 * pop})`}>
            {e !== 'pendente' && <circle r={46} fill={CORES.royalClaro} />}
            <circle r={34} fill={e === 'ok' ? CORES.royal : e === 'atual' ? CORES.marinho : CORES.branco} stroke={e === 'pendente' ? CORES.trilho : 'none'} strokeWidth={5} />
            {e === 'ok' ? (
              <path d="M -14 1 L -4 11 L 15 -9" stroke={CORES.branco} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ) : (
              <g fill={e === 'atual' ? CORES.branco : CORES.cinza}>
                {rotulo ? (
                  rotulo(i)
                ) : (
                  <text textAnchor="middle" dominantBaseline="central" fontFamily={FONTE.titulo} fontWeight={800} fontSize={32}>
                    {i + 1}
                  </text>
                )}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Rótulo em caixa-alta abaixo dos marcadores, por faixa de tempo. */
export const RotuloFaixas: React.FC<{ faixas: { inicio: number; fim: number; texto: string; cor?: string }[] }> = ({ faixas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = faixas.find((x) => t >= x.inicio && t < x.fim);
  if (!f) return null;
  const entra = spring({ frame: frame - s(f.inicio + 0.2), fps, config: { damping: 16, stiffness: 120 } });
  const sai = interpolate(t, [f.fim - 0.35, f.fim], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.paradaTopo + 8,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: FONTE.texto,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 7,
        textTransform: 'uppercase',
        color: f.cor ?? CORES.royal,
        opacity: Math.min(entra, sai),
        transform: `translateY(${(1 - entra) * 30}px)`,
      }}
    >
      {f.texto}
    </div>
  );
};
