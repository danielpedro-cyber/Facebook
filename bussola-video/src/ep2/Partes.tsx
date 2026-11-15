import React from 'react';
import { CORES, FONTE } from '../constantes';
import { useEntrada, useMola } from '../componentes/animacoes';

/** Cabeçalho das cenas de erro: selo "ERRO N" (vermelho suave) + título do erro. */
export const CabecalhoErro: React.FC<{ numero: number; titulo: string; atrasoTitulo: number }> = ({ numero, titulo, atrasoTitulo }) => {
  const selo = useMola(0.25, 160);
  const tit = useEntrada(atrasoTitulo, 50);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 26px 10px 14px',
          borderRadius: 999,
          background: CORES.vermelhoClaro,
          color: CORES.vermelho,
          fontFamily: FONTE.titulo,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 2,
          transform: `scale(${0.5 + 0.5 * selo}) rotate(${(1 - selo) * -8}deg)`,
          opacity: Math.min(1, selo * 1.5),
        }}
      >
        <span
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: CORES.vermelhoSuave,
            color: CORES.branco,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
          }}
        >
          ✕
        </span>
        ERRO {numero}
      </div>
      <div
        style={{
          ...tit,
          fontFamily: FONTE.titulo,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.02,
          letterSpacing: -2,
          textAlign: 'center',
          color: CORES.marinho,
          maxWidth: 940,
        }}
      >
        {titulo}
      </div>
    </div>
  );
};

/** Cartão azul com a correção ("faça isso"). */
export const CartaoCorrecao: React.FC<{ texto: string; atraso: number; style?: React.CSSProperties }> = ({ texto, atraso, style }) => {
  const e = useEntrada(atraso, 70);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '24px 30px',
        borderRadius: 28,
        background: CORES.branco,
        border: `4px solid ${CORES.royal}`,
        boxShadow: `0 10px 0 ${CORES.royalClaro}`,
        ...e,
        ...style,
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 999,
          background: CORES.royal,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={40} height={40} viewBox="0 0 40 40">
          <path d="M 8 21 L 17 30 L 33 11" stroke={CORES.branco} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 44, lineHeight: 1.08, color: CORES.marinho }}>{texto}</div>
    </div>
  );
};
