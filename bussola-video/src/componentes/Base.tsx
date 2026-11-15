import React from 'react';
import { Img, staticFile } from 'remotion';
import { CORES, FONTE, LAYOUT, LOGO_ARQUIVO } from '../constantes';
import { IconeBussola } from './Icones';

/** Área de conteúdo das cenas (entre a rota e as legendas). */
export const Palco: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
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
      fontFamily: FONTE.familia,
      color: CORES.marinho,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Titulo: React.FC<{
  children: React.ReactNode;
  tamanho?: number;
  cor?: string;
  style?: React.CSSProperties;
}> = ({ children, tamanho = FONTE.titulo, cor = CORES.marinho, style }) => (
  <div
    style={{
      fontFamily: FONTE.familia,
      fontWeight: 800,
      fontSize: tamanho,
      lineHeight: 1.12,
      letterSpacing: -1,
      textAlign: 'center',
      color: cor,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Logo da Bússola. Enquanto LOGO_ARQUIVO for null, mostra um placeholder
 * em texto; coloque a logo em /public e defina LOGO_ARQUIVO em constantes.ts.
 */
export const Logo: React.FC<{ altura?: number; style?: React.CSSProperties }> = ({ altura = 120, style }) => {
  if (LOGO_ARQUIVO) {
    return <Img src={staticFile(LOGO_ARQUIVO)} style={{ height: altura, objectFit: 'contain', ...style }} />;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: altura * 0.2, ...style }}>
      <IconeBussola tamanho={altura} />
      <span
        style={{
          fontFamily: FONTE.familia,
          fontWeight: 800,
          fontSize: altura * 0.72,
          color: CORES.marinho,
          letterSpacing: -1,
        }}
      >
        Bússola
      </span>
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
