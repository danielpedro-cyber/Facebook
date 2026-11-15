import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { CORES, FONTE, TEXTOS, momento, s } from '../constantes';
import { Cenario, Palco } from '../componentes/Base';
import { Personagem } from '../componentes/Personagem';
import { useEntrada, useMola } from '../componentes/animacoes';

// CENA 6 — gestão do investimento: frase de impacto em tela cheia.
// "Investir em canal de venda não é GASTO. É INVESTIMENTO, e investimento se mede pelo retorno."
// Nada de valores ou promessas de ganho.
export const RISCA_GASTO = momento('gestao', 'naoGasto', 0.6);
export const ENTRA_INVESTIMENTO = momento('gestao', 'investimento');

export const Cena6Gestao: React.FC = () => {
  const frame = useCurrentFrame();
  const t = TEXTOS.gestao;
  const l1 = useEntrada(momento('gestao', 'canal'), 50);
  const gasto = useMola(momento('gestao', 'naoGasto'), 140);
  const risco = interpolate(frame, [s(RISCA_GASTO), s(RISCA_GASTO + 0.35)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const invest = useMola(ENTRA_INVESTIMENTO, 120);
  const retorno = useEntrada(momento('gestao', 'retorno'), 40);
  const pers = useEntrada(0.2, 40);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ ...l1, fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 64, color: CORES.cinza, textAlign: 'center' }}>{t.canal}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 6, opacity: Math.min(1, gasto * 1.5) }}>
        <span style={{ fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 64, color: CORES.cinza }}>{t.naoE}</span>
        <span
          style={{
            position: 'relative',
            fontFamily: FONTE.titulo,
            fontWeight: 800,
            fontSize: 170,
            letterSpacing: -4,
            color: interpolate(risco, [0, 1], [0, 1]) > 0.5 ? '#9AA6BC' : CORES.marinho,
            display: 'inline-block',
            transform: `scale(${0.6 + 0.4 * gasto})`,
          }}
        >
          {t.gasto}
          <span
            style={{
              position: 'absolute',
              left: -10,
              top: '52%',
              height: 16,
              width: `${risco * 104}%`,
              background: CORES.marinho,
              borderRadius: 8,
              transform: 'rotate(-4deg)',
            }}
          />
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 22,
          marginTop: 10,
          opacity: Math.min(1, invest * 1.5),
          transform: `scale(${0.6 + 0.4 * invest})`,
        }}
      >
        <span style={{ fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 64, color: CORES.cinza }}>{t.e}</span>
        <span style={{ fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 116, letterSpacing: -3, color: CORES.royal }}>{t.investimento}</span>
      </div>
      <div style={{ ...retorno, marginTop: 24, fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 52, color: CORES.marinho, textAlign: 'center', maxWidth: 760, lineHeight: 1.1 }}>
        {t.retorno}
      </div>
      <Cenario altura={820} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <g style={{ opacity: pers.opacity as number }}>
          <ellipse cx={850} cy={812} rx={80} ry={12} fill={CORES.royalClaro} />
          <Personagem pose="segurando" objeto="calculadora" espelhado expressao="feliz" x={850} y={810} escala={0.62} />
        </g>
      </Cenario>
    </Palco>
  );
};
