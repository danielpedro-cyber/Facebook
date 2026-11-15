import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { CORES, FONTE, LAYOUT, LOGO_ARQUIVO, VIDEO } from '../constantes';
import { IconeBussola } from './Icones';

/** Fundo claro com ondas suaves, como nos slides d'A Bússola do Consórcio. */
export const Fundo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CORES.fundo }}>
    <svg width={VIDEO.largura} height={VIDEO.altura}>
      <path d="M -120 1480 C 260 1200, 720 1960, 1260 1480" stroke={CORES.onda} strokeWidth={240} fill="none" />
      <path d="M -200 120 C 200 380, 700 -80, 1300 200" stroke={CORES.onda} strokeWidth={160} fill="none" opacity={0.7} />
    </svg>
  </AbsoluteFill>
);

/** Área de conteúdo das cenas (entre a rota e as legendas). */
export const Palco: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: 'absolute',
      top: LAYOUT.palcoTopo,
      height: LAYOUT.palcoAltura,
      left: 60,
      right: 60,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONTE.texto,
      color: CORES.marinho,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Titulo: React.FC<{ children: React.ReactNode; tamanho?: number; cor?: string; style?: React.CSSProperties }> = ({
  children,
  tamanho = FONTE.tamTitulo,
  cor = CORES.marinho,
  style,
}) => (
  <div
    style={{
      fontFamily: FONTE.titulo,
      fontWeight: 600,
      fontSize: tamanho,
      lineHeight: 1.04,
      letterSpacing: -1.5,
      textAlign: 'center',
      color: cor,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rótulo em caixa-alta espaçada (como "PROPOSTA COMERCIAL" nos slides). */
export const Rotulo: React.FC<{ children: React.ReactNode; cor?: string; style?: React.CSSProperties }> = ({
  children,
  cor = CORES.royal,
  style,
}) => (
  <div
    style={{
      fontFamily: FONTE.texto,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 7,
      textTransform: 'uppercase',
      color: cor,
      textAlign: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Logo d'A Bússola do Consórcio (ou placeholder em texto se LOGO_ARQUIVO = null). */
export const Logo: React.FC<{ altura?: number; style?: React.CSSProperties }> = ({ altura = 120, style }) => {
  if (LOGO_ARQUIVO) {
    return <Img src={staticFile(LOGO_ARQUIVO)} style={{ height: altura, objectFit: 'contain', ...style }} />;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: altura * 0.2, ...style }}>
      <IconeBussola tamanho={altura} />
      <span style={{ fontFamily: FONTE.titulo, fontWeight: 800, fontSize: altura * 0.6, color: CORES.marinho }}>A Bússola do Consórcio</span>
    </div>
  );
};

/** Círculo claro com ícone dentro. */
export const SeloIcone: React.FC<{ tamanho: number; children: React.ReactNode; fundo?: string; style?: React.CSSProperties }> = ({
  tamanho,
  children,
  fundo = CORES.royalClaro,
  style,
}) => (
  <div
    style={{
      width: tamanho,
      height: tamanho,
      borderRadius: 999,
      background: fundo,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Camada SVG do tamanho do palco, para desenhar o personagem e o cenário. */
export const Cenario: React.FC<{ children: React.ReactNode; altura?: number; largura?: number; style?: React.CSSProperties }> = ({
  children,
  altura = LAYOUT.palcoAltura,
  largura = 960,
  style,
}) => (
  <svg width={largura} height={altura} viewBox={`0 0 ${largura} ${altura}`} style={{ overflow: 'visible', ...style }}>
    {children}
  </svg>
);

/** Estrada clara com faixa tracejada (chão onde o personagem anda). */
export const Estrada: React.FC<{ y: number; d?: string; largura?: number }> = ({ y, d, largura = 90 }) => {
  const caminho = d ?? `M -80 ${y} C 240 ${y - 40}, 720 ${y + 40}, 1040 ${y}`;
  return (
    <g>
      <path d={caminho} stroke={CORES.royalClaro} strokeWidth={largura} fill="none" strokeLinecap="round" />
      <path d={caminho} stroke={CORES.royal} strokeWidth={8} fill="none" strokeDasharray="34 22" strokeLinecap="round" />
    </g>
  );
};
