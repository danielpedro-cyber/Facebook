import React, { useMemo } from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { getLength, getPointAtLength } from '@remotion/paths';
import { CORES, FONTE, s } from '../../constantes';
import { Cenario, Estrada, Palco } from '../../componentes/Base';
import { Personagem } from '../../componentes/Personagem';
import { useEntrada } from '../../componentes/animacoes';
import { TEXTOS2, momento2 } from '../constantes';
import { CabecalhoErro, CartaoCorrecao } from '../Partes';

// ERRO 3 — desistir na primeira baixa. O consultor desce pelo "vale" da baixa,
// para lá embaixo... e sobe do outro lado quando entende que faz parte do caminho.
const CAMINHO = 'M 10 200 C 250 200, 300 360, 480 360 S 710 200, 950 190';
export const E3 = {
  desce: () => 0.4,
  vale: () => momento2('erro3', 'e3a', 0.6),
  sobe: () => momento2('erro3', 'e3f'),
};

export const Erro3: React.FC = () => {
  const frame = useCurrentFrame();
  const comp = useMemo(() => getLength(CAMINHO), []);
  const op = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.quad) };
  const p = interpolate(
    frame,
    [s(E3.desce()), s(E3.vale()), s(E3.sobe()), s(E3.sobe() + 2.4)],
    [0.02, 0.5, 0.5, 0.97],
    op,
  );
  const pt = getPointAtLength(CAMINHO, p * comp) ?? { x: 0, y: 0 };
  const andando = (frame > s(E3.desce()) && frame < s(E3.vale())) || (frame > s(E3.sobe()) && frame < s(E3.sobe() + 2.4));
  const chegou = frame >= s(E3.sobe() + 2.4);
  const naBaixa = p > 0.3 && p < 0.7;
  const rotBaixa = useEntrada(E3.vale() - 0.6, 30);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <CabecalhoErro numero={3} titulo={TEXTOS2.erros[2].titulo} atrasoTitulo={momento2('erro3', 'e3n')} />
      <Cenario altura={420} style={{ position: 'absolute', top: 250, left: 0 }}>
        <Estrada y={0} d={CAMINHO} largura={70} />
        <g transform="translate(950 190)">
          <path d="M -4 6 V -58 M -4 -56 H 34 L 26 -44 L 34 -32 H -4" stroke={CORES.marinho} strokeWidth={6} fill={CORES.royalClaro} strokeLinejoin="round" strokeLinecap="round" />
        </g>
        <Personagem
          pose={chegou ? 'comemorando' : andando ? 'andando' : 'parado'}
          expressao={chegou ? 'feliz' : naBaixa ? 'triste' : 'neutro'}
          cabecaBaixa={naBaixa && !andando}
          x={pt.x}
          y={pt.y - 4}
          escala={0.6}
        />
      </Cenario>
      <div style={{ ...rotBaixa, position: 'absolute', top: 652, left: 0, right: 0, textAlign: 'center', fontFamily: FONTE.texto, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase', color: CORES.vermelho }}>
        a baixa
      </div>
      <CartaoCorrecao texto={TEXTOS2.erros[2].correcao} atraso={E3.sobe()} />
    </Palco>
  );
};
