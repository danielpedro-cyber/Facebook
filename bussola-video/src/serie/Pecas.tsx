import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CORES, FONTE } from '../constantes';
import { Cenario, Logo, Palco } from '../componentes/Base';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada, useMola } from '../componentes/animacoes';

/** Capa (1º quadro): tag da série + título com destaque já visíveis no quadro 0. */
export const Capa: React.FC<{ serie: string; titulo: string; destaque: string; tamanho?: number; children?: React.ReactNode }> = ({
  serie,
  titulo,
  destaque,
  tamanho = 104,
  children,
}) => {
  const frame = useCurrentFrame();
  const i = titulo.indexOf(destaque);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ alignSelf: 'flex-start', fontFamily: FONTE.texto, fontWeight: 800, fontSize: 30, letterSpacing: 5, textTransform: 'uppercase', color: CORES.branco, background: CORES.royal, padding: '8px 20px', borderRadius: 12 }}>
        {serie}
      </div>
      <div style={{ marginTop: 26, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: tamanho, lineHeight: 1.0, letterSpacing: -2.5, textAlign: 'center', color: CORES.marinho, transform: `scale(${1 + 0.012 * Math.sin(frame * 0.12)})` }}>
        {i >= 0 ? (
          <>
            {titulo.slice(0, i)}
            <span style={{ color: CORES.royal }}>{destaque}</span>
            {titulo.slice(i + destaque.length)}
          </>
        ) : (
          titulo
        )}
      </div>
      {children}
    </Palco>
  );
};

/** Cabeçalho de etapa: selo ("PASSO 1", "MANHÃ"...) + título. */
export const CabecalhoEtapa: React.FC<{ selo: string; titulo: string; atrasoTitulo: number; icone?: React.ReactNode }> = ({ selo, titulo, atrasoTitulo, icone }) => {
  const m = useMola(0.25, 160);
  const tit = useEntrada(atrasoTitulo, 50);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: icone ? '10px 26px 10px 14px' : '10px 26px',
          borderRadius: 999,
          background: CORES.royalClaro,
          color: CORES.royal,
          fontFamily: FONTE.titulo,
          fontWeight: 800,
          fontSize: 38,
          letterSpacing: 2,
          textTransform: 'uppercase',
          transform: `scale(${0.5 + 0.5 * m})`,
          opacity: Math.min(1, m * 1.5),
        }}
      >
        {icone}
        {selo}
      </div>
      <div style={{ ...tit, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 76, lineHeight: 1.02, letterSpacing: -2, textAlign: 'center', color: CORES.marinho, maxWidth: 940 }}>{titulo}</div>
    </div>
  );
};

/** Cartão azul com a dica/ação da etapa (fica na base do palco). */
export const CartaoDica: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => {
  const e = useEntrada(atraso, 70);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 30px', borderRadius: 28, background: CORES.branco, border: `4px solid ${CORES.royal}`, boxShadow: `0 10px 0 ${CORES.royalClaro}`, ...e }}>
      <div style={{ width: 70, height: 70, borderRadius: 999, background: CORES.royal, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={40} height={40} viewBox="0 0 40 40">
          <path d="M 8 21 L 17 30 L 33 11" stroke={CORES.branco} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 44, lineHeight: 1.08, color: CORES.marinho }}>{texto}</div>
    </div>
  );
};

/** Balão de fala simples. */
export const Balao: React.FC<{ texto: string; atraso: number; lado?: 'esquerda' | 'direita'; style?: React.CSSProperties }> = ({ texto, atraso, lado = 'esquerda', style }) => {
  const e = useCrescer(atraso);
  return (
    <div style={{ position: 'absolute', ...style, ...e }}>
      <div style={{ position: 'relative', background: CORES.branco, border: `4px solid ${CORES.marinho}`, borderRadius: 28, padding: '18px 24px', fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: CORES.marinho }}>
        {texto}
        <svg width={40} height={30} style={{ position: 'absolute', bottom: -26, [lado === 'esquerda' ? 'left' : 'right']: 40 }}>
          <path d={lado === 'esquerda' ? 'M 0 0 L 10 26 L 30 0' : 'M 10 0 L 30 26 L 40 0'} fill={CORES.branco} stroke={CORES.marinho} strokeWidth={4} strokeLinejoin="round" />
          <rect x={0} y={-4} width={40} height={6} fill={CORES.branco} />
        </svg>
      </div>
    </div>
  );
};

/** Fechamento padrão da série: logo, pedido de envio e pergunta para comentar (com opções). */
export const FechamentoSerie: React.FC<{
  envio1: string;
  envio2: string;
  comenta: string;
  opcoes: string[];
  atrasoEnvio: number;
  atrasoComenta: number;
  topo?: React.ReactNode;
}> = ({ envio1, envio2, comenta, opcoes, atrasoEnvio, atrasoComenta, topo }) => {
  const logo = useCrescer(0.2);
  const envio = useEntrada(atrasoEnvio, 80);
  const com = useEntrada(atrasoComenta, 50);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={logo}>
        <Logo altura={120} />
      </div>
      {topo}
      <div style={{ marginTop: 30, background: CORES.marinho, color: CORES.branco, borderRadius: 34, padding: '28px 36px', display: 'flex', alignItems: 'center', gap: 24, width: 960, ...envio }}>
        <svg width={96} height={96} viewBox="0 0 64 64" fill="none" stroke={CORES.branco} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M6 30 L58 8 L44 56 L30 36 Z" />
          <path d="M30 36 L58 8" />
        </svg>
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 60, lineHeight: 1.04 }}>
          {envio1} <span style={{ color: '#9CC0FF' }}>{envio2}</span>
        </div>
      </div>
      <div style={{ ...com, marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 56, lineHeight: 1.08, textAlign: 'center' }}>{comenta}</div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {opcoes.map((n) => (
            <div key={n} style={{ minWidth: 76, height: 76, padding: '0 22px', borderRadius: 999, border: `4px solid ${CORES.royal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 38, color: CORES.royal }}>
              {n}
            </div>
          ))}
        </div>
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <g style={{ opacity: logo.opacity as number }}>
          <ellipse cx={850} cy={818} rx={70} ry={11} fill={CORES.royalClaro} />
          <Personagem pose="acenando" expressao="feliz" x={850} y={816} escala={0.6} />
        </g>
      </Cenario>
    </Palco>
  );
};
