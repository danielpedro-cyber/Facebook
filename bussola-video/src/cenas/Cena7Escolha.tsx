import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Cenario, Estrada, Palco } from '../componentes/Base';
import { IconeCheck } from '../componentes/Icones';
import { Personagem, useTrocaPose } from '../componentes/Personagem';
import { useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 7 — a escolha: o consultor chega à bifurcação (fecha o "loop" aberto na promessa).
// As duas colunas usam o MESMO componente, mesmas cores, tamanhos e tempos:
// nenhum caminho pode parecer superior. Os itens aparecem em pares.
const ITENS_INICIO = momento('escolha', 'vendedor');
const N_ITENS = TEXTOS.caminhos.vendedor.itens.length;
const ITENS_PASSO = (momento('escolha', 'escala', 1) - ITENS_INICIO) / N_ITENS;
export const MOMENTOS_ITENS = Array.from({ length: N_ITENS }, (_, i) => ITENS_INICIO + i * ITENS_PASSO);
const CALMO = momento('escolha', 'melhor');

const Item: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', ...useEntrada(atraso, 40) }}>
    <IconeCheck tamanho={42} cor={CORES.royal} espessura={6} style={{ flexShrink: 0, marginTop: 2 }} />
    <span style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.2, color: CORES.marinho }}>{texto}</span>
  </div>
);

const Coluna: React.FC<{ titulo: string; itens: string[] }> = ({ titulo, itens }) => (
  <div style={{ width: 450, display: 'flex', flexDirection: 'column', gap: 18, ...useEntrada(0.8, 60) }}>
    <div
      style={{
        fontFamily: FONTE.titulo,
        fontWeight: 700,
        fontSize: 48,
        lineHeight: 1.02,
        height: 112,
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: 12,
        borderBottom: `5px solid ${CORES.royal}`,
      }}
    >
      {titulo}
    </div>
    {itens.map((t, i) => (
      <Item key={t} texto={t} atraso={MOMENTOS_ITENS[i]} />
    ))}
  </div>
);

export const Cena7Escolha: React.FC = () => {
  const estrada = useProgresso(0.1, 1.0);
  const calmo = useTrocaPose(CALMO, 0.5);
  const { vendedor, empresario } = TEXTOS.caminhos;
  const ramo = (lado: number) => `M 480 300 L 480 210 C 480 130, ${480 + lado * 250} 140, ${480 + lado * 255} 30`;
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <Cenario altura={300} style={{ position: 'absolute', top: 0, left: 0, opacity: estrada }}>
        <g style={{ clipPath: `inset(${(1 - estrada) * 100}% 0 0 0)` }}>
          <Estrada y={0} d={ramo(-1)} largura={70} />
          <Estrada y={0} d={ramo(1)} largura={70} />
        </g>
        <Personagem pose={calmo > 0 ? 'parado' : 'pensando'} dePose="pensando" transicao={calmo} expressao={calmo > 0.5 ? 'feliz' : 'neutro'} x={480} y={292} escala={0.78} />
      </Cenario>
      <div style={{ position: 'absolute', top: 310, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Coluna titulo={vendedor.titulo} itens={vendedor.itens} />
        <Coluna titulo={empresario.titulo} itens={empresario.itens} />
      </div>
    </Palco>
  );
};
