import React from 'react';
import { CORES } from '../constantes';

// Ícones de linha simples (viewBox 64x64). A cor vem de `cor` (stroke).

type Props = {
  tamanho?: number;
  cor?: string;
  espessura?: number;
  style?: React.CSSProperties;
  /** 0 → 1: desenha o traço progressivamente. */
  desenho?: number;
};

const Base: React.FC<Props & { children: React.ReactNode }> = ({
  tamanho = 120,
  cor = CORES.marinho,
  espessura = 3.2,
  style,
  desenho = 1,
  children,
}) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 64 64"
    fill="none"
    stroke={cor}
    strokeWidth={espessura}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {/* pathLength=1 permite desenhar qualquer traço com dashoffset */}
    <g
      style={{
        strokeDasharray: desenho < 1 ? 1 : undefined,
        strokeDashoffset: desenho < 1 ? 1 - desenho : undefined,
      }}
    >
      {children}
    </g>
  </svg>
);

const P: React.FC<React.SVGProps<SVGPathElement>> = (p) => <path pathLength={1} {...p} />;

export const IconeCelular: React.FC<Props> = (p) => (
  <Base {...p}>
    <rect x="18" y="5" width="28" height="54" rx="6" pathLength={1} />
    <P d="M28 11 H36" />
    <P d="M28 52 H36" />
  </Base>
);

export const IconeFamilia: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M8 30 L32 11 L56 30" />
    <P d="M15 25 V55 H49 V25" />
    <P d="M32 47 C24 41 23 33 28 32 C30.5 31.5 32 33.5 32 35 C32 33.5 33.5 31.5 36 32 C41 33 40 41 32 47 Z" />
  </Base>
);

export const IconeAmigos: React.FC<Props> = (p) => (
  <Base {...p}>
    <circle cx="23" cy="22" r="8" pathLength={1} />
    <P d="M8 53 C8 39 38 39 38 53" />
    <circle cx="43" cy="25" r="7" pathLength={1} />
    <P d="M37 41 C44 37 57 40 57 52" />
  </Base>
);

export const IconeMaleta: React.FC<Props> = (p) => (
  <Base {...p}>
    <rect x="8" y="20" width="48" height="33" rx="4" pathLength={1} />
    <P d="M24 20 V13 H40 V20" />
    <P d="M8 34 H56" />
    <P d="M30 34 V38 H34 V34" />
  </Base>
);

export const IconeSinoMudo: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M19 43 V30 C19 22 25 16 32 16 C39 16 45 22 45 30 V43" />
    <P d="M14 43 H50" />
    <P d="M28 49 C28 53 36 53 36 49" />
    <P d="M11 11 L53 53" />
  </Base>
);

export const IconeLampada: React.FC<Props & { preenchimento?: string }> = ({ preenchimento, ...p }) => (
  <Base {...p}>
    <P
      d="M24 42 V38 C19 34 16 29 16 24 C16 15 23 8 32 8 C41 8 48 15 48 24 C48 29 45 34 40 38 V42 Z"
      fill={preenchimento ?? 'none'}
    />
    <P d="M24 48 H40" />
    <P d="M27 54 H37" />
    <P d="M27 31 L32 25 L37 31" />
  </Base>
);

export const IconeRede: React.FC<Props> = (p) => (
  <Base {...p}>
    <circle cx="32" cy="12" r="6" pathLength={1} />
    <circle cx="12" cy="48" r="6" pathLength={1} />
    <circle cx="52" cy="48" r="6" pathLength={1} />
    <circle cx="32" cy="34" r="5" pathLength={1} />
    <P d="M32 18 V29 M28 37 L17 45 M36 37 L47 45 M18 48 H46" />
  </Base>
);

export const IconeCapelo: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M4 24 L32 12 L60 24 L32 36 Z" />
    <P d="M16 30 V43 C24 50 40 50 48 43 V30" />
    <P d="M57 25 V40" />
  </Base>
);

export const IconeMegafone: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M10 26 V38 H20 L46 50 V14 L20 26 Z" />
    <P d="M20 38 L24 52 H30 L28 41" />
    <P d="M52 25 C55 29 55 35 52 39" />
  </Base>
);

export const IconeAlvo: React.FC<Props> = (p) => (
  <Base {...p}>
    <circle cx="29" cy="35" r="21" pathLength={1} />
    <circle cx="29" cy="35" r="12" pathLength={1} />
    <circle cx="29" cy="35" r="3" pathLength={1} />
    <P d="M29 35 L52 12" />
    <P d="M44 11 H53 V20" />
  </Base>
);

export const IconeCalculadora: React.FC<Props> = (p) => (
  <Base {...p}>
    <rect x="14" y="5" width="36" height="54" rx="5" pathLength={1} />
    <rect x="20" y="11" width="24" height="12" rx="2" pathLength={1} />
    <P d="M22 32 H26 M30 32 H34 M38 32 H42 M22 41 H26 M30 41 H34 M38 41 H42 M22 50 H26 M30 50 H34 M38 50 H42" />
  </Base>
);

export const IconeVendedor: React.FC<Props> = (p) => (
  <Base {...p}>
    <circle cx="25" cy="20" r="9" pathLength={1} />
    <P d="M9 55 C9 38 41 38 41 55" />
    <P d="M44 32 L56 20" />
    <P d="M48 19 H57 V28" />
  </Base>
);

export const IconeEmpresa: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M12 55 V11 H37 V55" />
    <P d="M37 27 H53 V55" />
    <P d="M6 55 H58" />
    <P d="M19 19 H23 M27 19 H31 M19 28 H23 M27 28 H31 M19 37 H23 M27 37 H31 M19 46 H23 M27 46 H31 M43 35 H47 M43 44 H47" />
  </Base>
);

export const IconeCheck: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M14 33 L26 45 L50 20" />
  </Base>
);

export const IconeComentario: React.FC<Props> = (p) => (
  <Base {...p}>
    <P d="M10 14 H54 V42 H30 L18 52 V42 H10 Z" />
    <P d="M20 25 H44 M20 33 H36" />
  </Base>
);

/** Rosa dos ventos simples (usada no placeholder da logo). */
export const IconeBussola: React.FC<{ tamanho?: number }> = ({ tamanho = 120 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" stroke={CORES.marinho} strokeWidth="3.5" />
    <path d="M32 12 L38 32 H26 Z" fill={CORES.royal} />
    <path d="M32 52 L26 32 H38 Z" fill={CORES.marinho} />
    <circle cx="32" cy="32" r="3" fill={CORES.branco} />
  </svg>
);

/** Rosa dos ventos de 8 pontas, no estilo da bússola do evento. */
export const RosaDosVentos: React.FC<{ tamanho?: number; cor?: string; corEscura?: string; style?: React.CSSProperties }> = ({
  tamanho = 80,
  cor = CORES.royal,
  corEscura = '#1F4FD0',
  style,
}) => (
  <svg width={tamanho} height={tamanho} viewBox="-50 -50 100 100" style={style}>
    <g transform="rotate(45)" opacity={0.8}>
      {[0, 90, 180, 270].map((r) => (
        <path key={r} d="M0 -30 L6 -6 L0 0 L-6 -6Z" fill="#0B2E7A" transform={`rotate(${r})`} />
      ))}
    </g>
    {[0, 90, 180, 270].map((r) => (
      <g key={r} transform={`rotate(${r})`}>
        <path d="M0 -48 L9 -9 L0 0Z" fill={corEscura} />
        <path d="M0 -48 L-9 -9 L0 0Z" fill={cor} />
      </g>
    ))}
    <circle r={7} fill="#fff" stroke="#0B2E7A" strokeWidth={3} />
  </svg>
);
