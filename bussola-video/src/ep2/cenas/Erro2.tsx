import React from 'react';
import { interpolate, interpolateColors, useCurrentFrame } from 'remotion';
import { CORES, FONTE, s } from '../../constantes';
import { Cenario, Palco } from '../../componentes/Base';
import { Personagem, useTrocaPose } from '../../componentes/Personagem';
import { useProgresso } from '../../componentes/animacoes';
import { TEXTOS2, momento2 } from '../constantes';
import { CabecalhoErro, CartaoCorrecao } from '../Partes';

// ERRO 2 — investir sem medir. Primeiro "no escuro" (flechas errando o alvo);
// quando vem a correção, a luz acende e aparece a anotação: canal, quanto investiu, vendas.
// Sem números: só as colunas e as marcas de anotação.
export const E2 = {
  escuro: () => momento2('erro2', 'e2a'),
  luz: () => momento2('erro2', 'e2f'),
};
const LINHAS = ['Evento', 'Anúncio', 'Grupo'];

const Flecha: React.FC<{ d: string; ponta: [number, number, number]; atraso: number }> = ({ d, ponta, atraso }) => {
  const p = useProgresso(atraso, 0.35);
  const [x, y, ang] = ponta;
  return (
    <g>
      <path d={d} stroke="#9CC0FF" strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {p > 0.95 && <path d="M -16 -9 L 0 0 L -16 9" transform={`translate(${x} ${y}) rotate(${ang})`} stroke="#9CC0FF" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
};

const Rabisco: React.FC<{ x: number; y: number; atraso: number }> = ({ x, y, atraso }) => {
  const p = useProgresso(atraso, 0.3);
  return <path d={`M ${x} ${y} q 14 -16 28 0 t 28 0 t 28 0`} stroke={CORES.royal} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
};

export const Erro2: React.FC = () => {
  const frame = useCurrentFrame();
  const luz = interpolate(frame, [s(E2.luz()), s(E2.luz() + 0.4)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pega = useTrocaPose(E2.luz() + 0.2, 0.5);
  const fundo = interpolateColors(luz, [0, 1], [CORES.marinho, CORES.branco]);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <CabecalhoErro numero={2} titulo={TEXTOS2.erros[1].titulo} atrasoTitulo={momento2('erro2', 'e2n')} />
      <div style={{ position: 'absolute', top: 260, left: 0, width: 680, height: 380, borderRadius: 30, background: fundo, border: `3px solid ${luz > 0.5 ? CORES.trilho : CORES.marinho}`, overflow: 'hidden' }}>
        {/* no escuro */}
        <svg width={680} height={380} style={{ position: 'absolute', inset: 0, opacity: 1 - luz }}>
          <g transform="translate(530 190)" fill="none" stroke="#41557F" strokeWidth={6}>
            <circle r={110} />
            <circle r={70} />
            <circle r={30} />
          </g>
          <Flecha d="M 40 70 L 330 40" ponta={[330, 40, -6]} atraso={E2.escuro() + 0.1} />
          <Flecha d="M 40 190 L 360 320" ponta={[360, 320, 22]} atraso={E2.escuro() + 0.6} />
          <Flecha d="M 40 300 L 380 230" ponta={[380, 230, -11]} atraso={E2.escuro() + 1.1} />
          <text x={530} y={210} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={64} fill="#9CC0FF">?</text>
        </svg>
        {/* com a luz acesa: a anotação */}
        <div style={{ position: 'absolute', inset: 0, padding: '26px 30px', opacity: luz }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', rowGap: 18, alignItems: 'center' }}>
            {['Canal', 'Investi', 'Vendas'].map((h) => (
              <div key={h} style={{ fontFamily: FONTE.texto, fontWeight: 700, fontSize: 28, letterSpacing: 3, textTransform: 'uppercase', color: CORES.cinza, paddingBottom: 10, borderBottom: `3px solid ${CORES.trilho}` }}>
                {h}
              </div>
            ))}
            {LINHAS.map((l, i) => (
              <React.Fragment key={l}>
                <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 44, color: CORES.marinho }}>{l}</div>
                <svg width={120} height={40}><Rabisco x={6} y={24} atraso={E2.luz() + 0.6 + i * 0.5} /></svg>
                <svg width={120} height={40}><Rabisco x={6} y={24} atraso={E2.luz() + 0.85 + i * 0.5} /></svg>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <Cenario altura={400} style={{ position: 'absolute', top: 250, left: 0 }}>
        <ellipse cx={830} cy={392} rx={90} ry={12} fill={CORES.royalClaro} />
        <Personagem pose={pega > 0 ? 'segurando' : 'pensando'} dePose="pensando" transicao={pega} objeto={pega > 0.5 ? 'calculadora' : null} espelhado expressao={luz > 0.5 ? 'feliz' : 'neutro'} x={830} y={390} escala={0.8} />
      </Cenario>
      <CartaoCorrecao texto={TEXTOS2.erros[1].correcao} atraso={E2.luz()} />
    </Palco>
  );
};
