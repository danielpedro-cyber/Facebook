import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CORES, FONTE, LAYOUT, VIDEO, s } from '../constantes';
import { CENAS2, ERROS_TEMPO } from './constantes';

// Indicador fixo no topo: três marcadores (erro 1, 2, 3) ligados por uma linha.
// Pendente → X vermelho suave quando o erro aparece → ✓ azul quando é corrigido.
const XS = [240, 540, 840];
const Y = 95;

export const Progresso: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const naPromessa = t >= CENAS2.promessa.inicio && t < CENAS2.promessa.fim;
  const preenchido = interpolate(
    t,
    [ERROS_TEMPO[0].aparece, ERROS_TEMPO[1].aparece, ERROS_TEMPO[2].aparece, CENAS2.resumo.inicio],
    [0, 0.5, 1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <svg width={VIDEO.largura} height={LAYOUT.rotaAltura} style={{ position: 'absolute', top: LAYOUT.rotaTopo, left: 0 }}>
      <line x1={XS[0]} y1={Y} x2={XS[2]} y2={Y} stroke={CORES.trilho} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 20" />
      <line x1={XS[0]} y1={Y} x2={XS[0] + (XS[2] - XS[0]) * preenchido} y2={Y} stroke={CORES.royal} strokeWidth={10} strokeLinecap="round" />
      {XS.map((x, i) => {
        const { aparece, corrige } = ERROS_TEMPO[i];
        const tc = corrige();
        const estado = t >= tc ? 'ok' : t >= aparece ? 'erro' : 'pendente';
        const desde = estado === 'ok' ? tc : estado === 'erro' ? aparece : 0;
        const pop = estado === 'pendente' ? 1 : spring({ frame: frame - s(desde), fps, config: { damping: 11, stiffness: 170 } });
        const pulso = naPromessa && i === 2 ? 1 + 0.12 * Math.abs(Math.sin(frame * 0.18)) : 1;
        const fundo = estado === 'ok' ? CORES.royal : estado === 'erro' ? CORES.vermelhoSuave : CORES.branco;
        return (
          <g key={i} transform={`translate(${x} ${Y}) scale(${(0.6 + 0.4 * pop) * pulso})`}>
            {estado !== 'pendente' && <circle r={50} fill={estado === 'ok' ? CORES.royalClaro : CORES.vermelhoClaro} />}
            <circle r={36} fill={fundo} stroke={estado === 'pendente' ? CORES.trilho : 'none'} strokeWidth={5} />
            {estado === 'pendente' && (
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONTE.titulo} fontWeight={800} fontSize={34} fill={CORES.cinza}>
                {i + 1}
              </text>
            )}
            {estado === 'erro' && <path d="M -13 -13 L 13 13 M 13 -13 L -13 13" stroke={CORES.branco} strokeWidth={8} strokeLinecap="round" />}
            {estado === 'ok' && <path d="M -15 1 L -4 12 L 16 -10" stroke={CORES.branco} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </g>
        );
      })}
    </svg>
  );
};

/** Rótulo abaixo do indicador: "ERRO 1 DE 3", "RESUMO". */
export const RotuloProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const faixas: { inicio: number; fim: number; texto: string; cor: string }[] = [
    { ...CENAS2.erro1, texto: 'Erro 1 de 3', cor: CORES.vermelho },
    { ...CENAS2.erro2, texto: 'Erro 2 de 3', cor: CORES.vermelho },
    { ...CENAS2.erro3, texto: 'Erro 3 de 3 · o mais comum', cor: CORES.vermelho },
    { ...CENAS2.resumo, texto: 'Resumo', cor: CORES.royal },
  ];
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
        color: f.cor,
        opacity: Math.min(entra, sai),
        transform: `translateY(${(1 - entra) * 30}px)`,
      }}
    >
      {f.texto}
    </div>
  );
};
