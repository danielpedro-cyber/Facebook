import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CORES, FONTE, LAYOUT, LEGENDAS, s } from '../constantes';

// Legendas grandes, centralizadas e sempre na tela, no estilo "karaokê":
// a palavra que está sendo falada ganha destaque azul; as próximas ficam esmaecidas.
// O tempo de cada palavra é estimado dentro do trecho (inicio → fim) pelo tamanho da palavra.

const palavrasComTempo = (texto: string, inicio: number, fim: number) => {
  const palavras = texto.split(' ');
  const pesos = palavras.map((p) => p.replace(/[^\p{L}\p{N}]/gu, '').length + 1.5);
  const total = pesos.reduce((a, b) => a + b, 0);
  let acc = 0;
  return palavras.map((p, i) => {
    const ini = inicio + ((fim - inicio) * acc) / total;
    acc += pesos[i];
    return { p, ini, fim: inicio + ((fim - inicio) * acc) / total };
  });
};

export const Legendas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let idx = 0;
  LEGENDAS.forEach((l, i) => {
    if (t >= l.inicio) idx = i;
  });
  const atual = LEGENDAS[idx];
  const entra = idx === 0 ? 1 : spring({ frame: frame - s(atual.inicio), fps, config: { damping: 20, stiffness: 180 } });
  const palavras = palavrasComTempo(atual.texto, atual.inicio, atual.fim);

  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.legendaTopo,
        height: LAYOUT.legendaAltura,
        left: 50,
        right: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: CORES.marinho,
          color: CORES.branco,
          fontFamily: FONTE.texto,
          fontWeight: 800,
          fontSize: FONTE.tamLegenda + 2,
          lineHeight: 1.3,
          textAlign: 'center',
          padding: '20px 34px',
          borderRadius: 24,
          maxWidth: 960,
          opacity: interpolate(entra, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `translateY(${(1 - entra) * 24}px)`,
        }}
      >
        {palavras.map((w, i) => {
          const falando = t >= w.ini && t < w.fim;
          // antes da primeira fala (1º quadro = capa) a legenda aparece inteira
          const futura = t < w.ini && t >= LEGENDAS[0].inicio;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  color: futura ? 'rgba(255,255,255,0.45)' : CORES.branco,
                  background: falando ? CORES.royal : 'transparent',
                  borderRadius: 10,
                  padding: '0 6px',
                  margin: '0 -6px',
                }}
              >
                {w.p}
              </span>{' '}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
