import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CORES, s } from '../constantes';

// O consultor: personagem geométrico simples (sem rosto detalhado), reaproveitado
// em todas as cenas. Coordenadas com os pés em (0, 0) e o corpo para cima.
//
// Ângulos em graus: 0 = apontando para baixo; positivo = para a frente (direita).
// Cada membro tem dois segmentos (superior e inferior, este relativo ao superior).

export type Pose =
  | 'parado'
  | 'andando'
  | 'sentado'
  | 'celular'
  | 'celularSentado'
  | 'apontando'
  | 'comemorando'
  | 'acenando'
  | 'pensando'
  | 'segurando';

export type Expressao = 'feliz' | 'neutro' | 'triste';

type Membro = [number, number]; // [ângulo superior, ângulo inferior relativo]
type Angulos = { bracoTras: Membro; bracoFrente: Membro; pernaTras: Membro; pernaFrente: Membro; sentado?: boolean };

const POSES: Record<Pose, Angulos> = {
  parado: { bracoTras: [-8, 4], bracoFrente: [8, -4], pernaTras: [-4, 0], pernaFrente: [4, 0] },
  andando: { bracoTras: [0, 0], bracoFrente: [0, 0], pernaTras: [0, 0], pernaFrente: [0, 0] }, // animado
  sentado: { bracoTras: [10, 40], bracoFrente: [20, 50], pernaTras: [85, -85], pernaFrente: [95, -95], sentado: true },
  celular: { bracoTras: [-6, 4], bracoFrente: [20, 125], pernaTras: [-4, 0], pernaFrente: [4, 0] },
  celularSentado: { bracoTras: [15, 60], bracoFrente: [25, 115], pernaTras: [85, -85], pernaFrente: [95, -95], sentado: true },
  apontando: { bracoTras: [-8, 4], bracoFrente: [115, 0], pernaTras: [-6, 0], pernaFrente: [6, 0] },
  comemorando: { bracoTras: [-150, -10], bracoFrente: [150, 10], pernaTras: [-10, 0], pernaFrente: [10, 0] },
  acenando: { bracoTras: [-8, 4], bracoFrente: [140, 30], pernaTras: [-4, 0], pernaFrente: [4, 0] },
  pensando: { bracoTras: [10, 70], bracoFrente: [25, 150], pernaTras: [-4, 0], pernaFrente: [4, 0] },
  segurando: { bracoTras: [25, 75], bracoFrente: [30, 80], pernaTras: [-4, 0], pernaFrente: [4, 0] },
};

const COXA = 66;
const CANELA = 66;
const BRACO = 52;
const ANTEBRACO = 50;
const TRONCO = 112;

const rad = (g: number) => (g * Math.PI) / 180;
const ponta = (x: number, y: number, comp: number, ang: number) => ({
  x: x + comp * Math.sin(rad(ang)),
  y: y + comp * Math.cos(rad(ang)),
});

const mistura = (a: Angulos, b: Angulos, t: number): Angulos => {
  const m = (p: Membro, q: Membro): Membro => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  return {
    bracoTras: m(a.bracoTras, b.bracoTras),
    bracoFrente: m(a.bracoFrente, b.bracoFrente),
    pernaTras: m(a.pernaTras, b.pernaTras),
    pernaFrente: m(a.pernaFrente, b.pernaFrente),
    sentado: t < 0.5 ? a.sentado : b.sentado,
  };
};

type Props = {
  pose: Pose;
  /** Pose anterior e progresso (0→1) para transições suaves entre poses. */
  dePose?: Pose;
  transicao?: number;
  expressao?: Expressao;
  /** Objeto na mão da frente. */
  objeto?: 'celular' | 'calculadora' | null;
  /** O celular está vibrando? (desenha ondinhas) */
  vibrando?: boolean;
  escala?: number;
  /** Olhar para a esquerda (espelha). */
  espelhado?: boolean;
  x: number;
  y: number; // posição dos pés (px na tela)
  cabecaBaixa?: boolean;
};

export const Personagem: React.FC<Props> = ({
  pose,
  dePose,
  transicao = 1,
  expressao = 'feliz',
  objeto = null,
  vibrando = false,
  escala = 1,
  espelhado = false,
  x,
  y,
  cabecaBaixa = false,
}) => {
  const frame = useCurrentFrame();

  const animado = (p: Pose): Angulos => {
    if (p !== 'andando') return POSES[p];
    const c = Math.sin(frame * 0.42);
    return {
      bracoTras: [-22 * c, 10],
      bracoFrente: [22 * c, 10],
      pernaTras: [26 * c, Math.max(0, -c) * 30],
      pernaFrente: [-26 * c, Math.max(0, c) * 30],
    };
  };
  const ang = dePose && transicao < 1 ? mistura(animado(dePose), animado(pose), transicao) : animado(pose);

  // respiração/bob
  const bob = pose === 'andando' ? Math.abs(Math.sin(frame * 0.42)) * -6 : Math.sin(frame * 0.08) * 1.5;
  const sentado = !!ang.sentado;
  const quadrilY = (sentado ? -CANELA : -(COXA + CANELA)) + bob;
  const ombroY = quadrilY - TRONCO + 12;
  const cabecaY = quadrilY - TRONCO - 40;
  const inclinacao = cabecaBaixa ? 12 : 0;

  // piscar
  const piscando = frame % 110 < 4;

  const perna = (m: Membro, dx: number, cor: string) => {
    const j = ponta(dx, quadrilY, COXA, m[0]);
    const p = ponta(j.x, j.y, CANELA, m[0] + m[1]);
    return (
      <g>
        <path d={`M ${dx} ${quadrilY} L ${j.x} ${j.y} L ${p.x} ${p.y}`} stroke={cor} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx={p.x + 9} cy={p.y + 2} rx={19} ry={10} fill={CORES.marinho} />
      </g>
    );
  };

  const braco = (m: Membro, dx: number, frente: boolean) => {
    const cot = ponta(dx, ombroY, BRACO, m[0]);
    const mao = ponta(cot.x, cot.y, ANTEBRACO, m[0] + m[1]);
    return (
      <g>
        <path d={`M ${dx} ${ombroY} L ${cot.x} ${cot.y}`} stroke={frente ? CORES.camisa : '#2560D8'} strokeWidth={22} strokeLinecap="round" />
        <path d={`M ${cot.x} ${cot.y} L ${mao.x} ${mao.y}`} stroke={CORES.pele} strokeWidth={18} strokeLinecap="round" />
        <circle cx={mao.x} cy={mao.y} r={11} fill={CORES.pele} />
        {frente && objeto === 'celular' && (
          <g transform={`translate(${mao.x} ${mao.y}) rotate(${-(m[0] + m[1]) + 180})`}>
            <rect x={-13} y={-40} width={26} height={44} rx={6} fill={CORES.marinho} />
            <rect x={-9} y={-35} width={18} height={30} rx={3} fill={vibrando ? '#9CC0FF' : '#41557F'} />
            {vibrando && (
              <g stroke={CORES.royal} strokeWidth={4} strokeLinecap="round" fill="none">
                <path d="M -24 -30 Q -30 -18 -24 -6" />
                <path d="M 24 -30 Q 30 -18 24 -6" />
              </g>
            )}
          </g>
        )}
        {frente && objeto === 'calculadora' && (
          <g transform={`translate(${mao.x + 4} ${mao.y - 8})`}>
            <rect x={-20} y={-30} width={42} height={58} rx={7} fill={CORES.marinho} />
            <rect x={-14} y={-24} width={30} height={13} rx={2} fill="#9CC0FF" />
            {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-14 + c * 11} y={-6 + r * 10} width={7} height={6} rx={1.5} fill="#C7D7EF" />))}
          </g>
        )}
      </g>
    );
  };

  const boca =
    expressao === 'feliz'
      ? 'M -10 8 Q 2 18 14 8'
      : expressao === 'triste'
        ? 'M -9 15 Q 2 6 13 15'
        : 'M -8 12 L 12 12';

  return (
    <g transform={`translate(${x} ${y}) scale(${espelhado ? -escala : escala} ${escala})`}>
      {/* sombra */}
      <ellipse cx={0} cy={4} rx={sentado ? 70 : 54} ry={10} fill="#0E1F45" opacity={0.08} />
      {perna(ang.pernaTras, -8, '#24365E')}
      {braco(ang.bracoTras, -10, false)}
      {/* tronco */}
      <rect x={-36} y={quadrilY - TRONCO} width={72} height={TRONCO + 12} rx={30} fill={CORES.camisa} />
      <path d={`M -14 ${quadrilY - TRONCO + 2} L 0 ${quadrilY - TRONCO + 20} L 14 ${quadrilY - TRONCO + 2}`} fill="#FFFFFF" opacity={0.9} />
      <rect x={-36} y={quadrilY - 14} width={72} height={20} rx={8} fill={CORES.calca} />
      {perna(ang.pernaFrente, 8, CORES.calca)}
      {/* cabeça */}
      <g transform={`translate(4 ${cabecaY}) rotate(${inclinacao})`}>
        <rect x={-9} y={22} width={18} height={20} fill={CORES.pele} />
        <circle r={38} fill={CORES.pele} />
        <path d="M -38 -2 C -42 -46, 40 -52, 40 -6 C 22 -24, -8 -26, -38 -2 Z" fill={CORES.cabelo} />
        <circle cx={-36} cy={4} r={7} fill={CORES.pele} />
        {piscando ? (
          <g stroke={CORES.marinho} strokeWidth={3.5} strokeLinecap="round">
            <path d="M 4 -4 H 14" />
            <path d="M 22 -4 H 32" />
          </g>
        ) : (
          <g fill={CORES.marinho}>
            <circle cx={9} cy={-4} r={4.5} />
            <circle cx={27} cy={-4} r={4.5} />
          </g>
        )}
        {expressao === 'triste' && (
          <g stroke={CORES.marinho} strokeWidth={3.5} strokeLinecap="round">
            <path d="M 3 -16 L 13 -13" />
            <path d="M 33 -16 L 23 -13" />
          </g>
        )}
        <path d={boca} transform="translate(16 0)" stroke="#7A4B2E" strokeWidth={4} strokeLinecap="round" fill="none" />
      </g>
      {braco(ang.bracoFrente, 10, true)}
    </g>
  );
};

/** Progresso suave 0→1 para trocar de pose a partir de um instante (s). */
export const useTrocaPose = (inicioSeg: number, duracaoSeg = 0.5) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [s(inicioSeg), s(inicioSeg + duracaoSeg)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
