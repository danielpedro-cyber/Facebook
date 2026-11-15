import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Cenario, Estrada, Palco } from '../componentes/Base';
import { Personagem, useTrocaPose } from '../componentes/Personagem';
import { useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 1b — promessa (8 a 12 s): "Fica até o final: eu vou te mostrar os dois caminhos pra sair dessa."
// Abre um "loop" que só fecha na cena da escolha — segura quem está assistindo.
export const CenaPromessa: React.FC = () => {
  const levanta = useTrocaPose(0.1, 0.5);
  const l1 = useEntrada(momento('promessa', 'fica'), 50);
  const l2 = useEntrada(momento('promessa', 'doisCaminhos', 0.35), 50);
  const ramos = useProgresso(momento('promessa', 'doisCaminhos', 0.3), 0.9);
  const ramo = (lado: number) => `M 480 780 L 480 650 C 480 560, ${480 + lado * 240} 560, ${480 + lado * 260} 430`;
  const { linha1, destaque, linha2 } = TEXTOS.promessa;
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 100, lineHeight: 1.02, letterSpacing: -2.5, textAlign: 'center', color: CORES.marinho }}>
        <div style={l1}>{linha1}</div>
        <div style={l2}>
          <span style={{ color: CORES.royal }}>{destaque}</span> {linha2}
        </div>
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <g style={{ clipPath: `inset(${(1 - ramos) * 100}% 0 0 0)` }}>
          <Estrada y={0} d={ramo(-1)} largura={70} />
          <Estrada y={0} d={ramo(1)} largura={70} />
        </g>
        {[-1, 1].map((lado) => (
          <g key={lado} transform={`translate(${480 + lado * 260} ${405}) scale(${ramos})`}>
            <circle r={34} fill={CORES.marinho} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONTE.titulo} fontWeight={800} fontSize={40} fill={CORES.branco}>
              ?
            </text>
          </g>
        ))}
        <Personagem pose="pensando" dePose="sentado" transicao={levanta} expressao="neutro" x={480} y={782} escala={0.92} />
      </Cenario>
    </Palco>
  );
};
