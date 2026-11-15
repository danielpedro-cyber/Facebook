import React from 'react';
import { CORES, TEXTOS } from '../constantes';
import { Palco, SeloIcone } from '../componentes/Base';
import { IconeCheck, IconeEmpresa, IconeVendedor } from '../componentes/Icones';
import { useCrescer, useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 7 — a escolha (50 a 70 s).
// Os dois cartões usam o MESMO componente, mesmas cores, tamanhos e tempos:
// nenhum caminho pode parecer superior. Os itens aparecem em pares (linha a linha).
const LARGURA_CARTAO = 466;
const ITENS_INICIO = 2.0; // s, relativo à cena
const ITENS_PASSO = 1.5;

const Bifurcacao: React.FC = () => {
  const p = useProgresso(0.3, 1.3);
  const igual = useCrescer(14.8);
  const esq = LARGURA_CARTAO / 2;
  const dir = 960 - LARGURA_CARTAO / 2;
  const comum = { stroke: CORES.royal, strokeWidth: 14, fill: 'none', strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };
  return (
    <div style={{ position: 'relative', width: 960, height: 92, flexShrink: 0 }}>
      <svg width={960} height={92} style={{ position: 'absolute', inset: 0 }}>
        <path d={`M 480 0 V 22 C 480 58, ${esq} 40, ${esq} 88`} {...comum} />
        <path d={`M 480 0 V 22 C 480 58, ${dir} 40, ${dir} 88`} {...comum} />
      </svg>
      {/* "=" entre os caminhos quando a narração diz "não existe caminho melhor" */}
      <div style={{ position: 'absolute', left: 480 - 38, top: 26, ...igual }}>
        <SeloIcone tamanho={76} fundo={CORES.marinho}>
          <span style={{ color: CORES.branco, fontSize: 54, fontWeight: 800, lineHeight: 1, marginTop: -4 }}>=</span>
        </SeloIcone>
      </div>
    </div>
  );
};

const Item: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', ...useEntrada(atraso, 40) }}>
    <IconeCheck tamanho={40} cor={CORES.royal} espessura={6} style={{ flexShrink: 0, marginTop: 1 }} />
    <span style={{ fontSize: 33, fontWeight: 600, lineHeight: 1.2 }}>{texto}</span>
  </div>
);

const CartaoCaminho: React.FC<{ titulo: string; itens: string[]; Icone: typeof IconeVendedor }> = ({
  titulo,
  itens,
  Icone,
}) => {
  const entrada = useEntrada(1.0, 80);
  return (
    <div
      style={{
        width: LARGURA_CARTAO,
        height: '100%',
        background: CORES.branco,
        border: `4px solid ${CORES.marinho}`,
        borderRadius: 28,
        padding: '22px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...entrada,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 112, flexShrink: 0 }}>
        <SeloIcone tamanho={84}>
          <Icone tamanho={58} cor={CORES.marinho} espessura={3.6} />
        </SeloIcone>
        <span style={{ fontSize: 33, fontWeight: 800, lineHeight: 1.12, textTransform: 'uppercase' }}>{titulo}</span>
      </div>
      <div style={{ height: 4, background: CORES.royalClaro, borderRadius: 4 }} />
      {itens.map((t, i) => (
        <Item key={t} texto={t} atraso={ITENS_INICIO + i * ITENS_PASSO} />
      ))}
    </div>
  );
};

export const Cena7Escolha: React.FC = () => {
  const { vendedor, empresario } = TEXTOS.caminhos;
  return (
    <Palco style={{ justifyContent: 'flex-start', top: 528, height: 850 }}>
      <Bifurcacao />
      <div style={{ display: 'flex', gap: 28, height: 752, marginTop: 4 }}>
        <CartaoCaminho titulo={vendedor.titulo} itens={vendedor.itens} Icone={IconeVendedor} />
        <CartaoCaminho titulo={empresario.titulo} itens={empresario.itens} Icone={IconeEmpresa} />
      </div>
    </Palco>
  );
};
