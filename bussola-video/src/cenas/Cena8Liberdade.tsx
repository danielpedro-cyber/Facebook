import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CORES, FONTE, TEXTOS, momento, s } from '../constantes';
import { Cenario, Palco, Titulo } from '../componentes/Base';
import { Personagem, useTrocaPose } from '../componentes/Personagem';
import { useEntrada, useMola, useProgresso } from '../componentes/animacoes';

// CENA 8 — liberdade e gestão (70 a 80 s): os caminhos se reencontram e o consultor comemora.
export const Cena8Liberdade: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgresso(0.1, 1.3);
  const chega = 1.6;
  const comemora = useTrocaPose(chega, 0.4);
  const palavra = useMola(1.4, 90);
  const sub = useEntrada(momento('liberdade', 'gestaoFinal'));
  const sublinhado = useProgresso(momento('liberdade', 'gestaoFinal', 0.6), 0.8);
  const y = interpolate(frame, [s(0.2), s(chega)], [120, 300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const comum = { stroke: CORES.royal, strokeWidth: 10, fill: 'none', strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <Cenario altura={320} style={{ position: 'absolute', top: 0, left: 0 }}>
        <path d="M 120 0 C 120 160, 480 160, 480 300" stroke={CORES.royalClaro} strokeWidth={70} fill="none" strokeLinecap="round" />
        <path d="M 840 0 C 840 160, 480 160, 480 300" stroke={CORES.royalClaro} strokeWidth={70} fill="none" strokeLinecap="round" />
        <path d="M 120 0 C 120 160, 480 160, 480 300" {...comum} />
        <path d="M 840 0 C 840 160, 480 160, 480 300" {...comum} />
        <Personagem pose={frame < s(chega) ? 'andando' : 'comemorando'} dePose="parado" transicao={frame < s(chega) ? 1 : comemora} x={480} y={y} escala={0.75} />
      </Cenario>
      <div
        style={{
          position: 'absolute',
          top: 350,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONTE.titulo,
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: 2,
          color: CORES.azulProfundo,
          opacity: Math.min(1, palavra * 1.5),
          transform: `scale(${0.7 + 0.3 * palavra})`,
        }}
      >
        {TEXTOS.liberdade.palavra}
      </div>
      <div style={{ position: 'absolute', top: 560, left: 0, right: 0, ...sub }}>
        <Titulo tamanho={FONTE.tamTituloMenor + 4} cor={CORES.royal}>
          {TEXTOS.liberdade.sub}
        </Titulo>
        <div style={{ height: 7, marginTop: 10, background: CORES.royal, borderRadius: 8, width: `${sublinhado * 62}%`, marginLeft: 'auto', marginRight: 'auto' }} />
      </div>
    </Palco>
  );
};
