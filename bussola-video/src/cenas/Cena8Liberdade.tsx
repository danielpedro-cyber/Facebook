import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Palco, Titulo } from '../componentes/Base';
import { useEntrada, useMola, useProgresso } from '../componentes/animacoes';

// CENA 8 — liberdade e gestão (70 a 80 s): os dois caminhos voltam a se encontrar.
export const Cena8Liberdade: React.FC = () => {
  const p = useProgresso(0.1, 1.4);
  const palavra = useMola(1.3, 90);
  const sub = useEntrada(momento('liberdade', 'gestaoFinal'));
  const sublinhado = useProgresso(momento('liberdade', 'gestaoFinal', 0.6), 0.8);
  const comum = { stroke: CORES.royal, strokeWidth: 14, fill: 'none', strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };

  return (
    <Palco style={{ justifyContent: 'flex-start', gap: 0 }}>
      <svg width={960} height={250}>
        <path d="M 233 10 C 233 140, 480 110, 480 236" {...comum} />
        <path d="M 727 10 C 727 140, 480 110, 480 236" {...comum} />
        <circle cx={480} cy={236} r={14} fill={CORES.marinho} opacity={p > 0.98 ? 1 : 0} />
      </svg>
      <div
        style={{
          marginTop: 40,
          fontFamily: FONTE.familia,
          fontWeight: 900,
          fontSize: 138,
          letterSpacing: 2,
          color: CORES.marinho,
          opacity: Math.min(1, palavra * 1.5),
          transform: `scale(${0.7 + 0.3 * palavra})`,
        }}
      >
        {TEXTOS.liberdade.palavra}
      </div>
      <div style={{ marginTop: 30, ...sub }}>
        <Titulo tamanho={FONTE.tituloMenor + 4} cor={CORES.royal}>
          {TEXTOS.liberdade.sub}
        </Titulo>
        <div style={{ height: 8, marginTop: 10, background: CORES.royal, borderRadius: 8, width: `${sublinhado * 100}%`, marginLeft: 'auto', marginRight: 'auto' }} />
      </div>
    </Palco>
  );
};
