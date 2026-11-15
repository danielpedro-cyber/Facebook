import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CORES, FONTE } from '../constantes';
import { Cenario, Palco, SeloIcone } from '../componentes/Base';
import { IconeAmigos, IconeEmpresa, IconeFamilia } from '../componentes/Icones';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada, useMola, useProgresso } from '../componentes/animacoes';
import { Balao, CabecalhoEtapa, Capa, CartaoDica, FechamentoSerie } from '../serie/Pecas';
import { CENAS3, CLIENTE, TEXTOS3, momento3 } from './constantes';

type Passo = 'passo1' | 'passo2' | 'passo3' | 'passo4' | 'passo5';

const Carro: React.FC<{ tamanho?: number; cor?: string }> = ({ tamanho = 80, cor = CORES.azulProfundo }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill="none" stroke={cor} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 40 V32 L14 20 H44 L54 32 H58 V40 Z" />
    <path d="M17 22 L13 31 H51 L43 22" />
    <circle cx={19} cy={42} r={6} fill="#fff" />
    <circle cx={47} cy={42} r={6} fill="#fff" />
  </svg>
);

/** Estrutura comum de cada passo: cabeçalho, ilustração e cartão com a dica. */
const EstruturaPasso: React.FC<{ n: number; cena: Passo; children: React.ReactNode }> = ({ n, cena, children }) => (
  <Palco style={{ justifyContent: 'flex-start' }}>
    <CabecalhoEtapa selo={`Passo ${n}`} titulo={TEXTOS3.passos[n - 1].titulo} atrasoTitulo={momento3(cena, `p${n}t`, 0.4)} />
    <div style={{ position: 'absolute', top: 250, left: 0, width: 960, height: 420 }}>{children}</div>
    <CartaoDica texto={TEXTOS3.passos[n - 1].dica} atraso={momento3(cena, `p${n}f`)} />
  </Palco>
);

// ---------------------------------------------------------------- gancho / promessa
export const Gancho3: React.FC = () => {
  const frame = useCurrentFrame();
  const pontos = Math.floor(frame / 8) % 4;
  return (
    <Capa serie={TEXTOS3.serie} titulo={TEXTOS3.gancho.titulo} destaque={TEXTOS3.gancho.destaque} tamanho={92}>
      <div style={{ position: 'absolute', top: 400, right: 40, width: 420, height: 390, borderRadius: 40, border: `8px solid ${CORES.marinho}`, background: CORES.branco, padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ alignSelf: 'flex-end', background: CORES.royal, color: CORES.branco, borderRadius: '24px 24px 6px 24px', padding: '14px 20px', fontSize: 30, fontWeight: 600 }}>Te mando a proposta?</div>
        <div style={{ alignSelf: 'flex-end', fontSize: 24, color: CORES.cinza, fontWeight: 600 }}>Visto ✓✓</div>
        <div style={{ alignSelf: 'flex-start', background: CORES.royalClaro, borderRadius: '24px 24px 24px 6px', padding: '14px 26px', fontSize: 40, fontWeight: 800, color: CORES.cinza, letterSpacing: 4 }}>{'.'.repeat(pontos || 1)}</div>
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={250} cy={812} rx={90} ry={12} fill={CORES.royalClaro} />
        <Personagem pose="celular" objeto="celular" expressao="triste" cabecaBaixa x={250} y={810} escala={0.78} />
      </Cenario>
    </Capa>
  );
};

export const Promessa3: React.FC = () => {
  const l1 = useEntrada(momento3('promessa', 'falta'), 50);
  const l2 = useEntrada(momento3('promessa', 'cinco'), 50);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ ...l1, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 96, letterSpacing: -2.5, color: CORES.marinho, textAlign: 'center' }}>
        Falta um <span style={{ color: CORES.royal }}>caminho.</span>
      </div>
      <div style={{ ...l2, display: 'flex', gap: 22, marginTop: 50 }}>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <PontoPromessa key={n} n={n} atraso={momento3('promessa', 'cinco') + i * 0.15} />
        ))}
      </div>
      <div style={{ ...l2, marginTop: 30, fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 64, color: CORES.cinza }}>5 passos. Fica até o final.</div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={480} cy={812} rx={90} ry={12} fill={CORES.royalClaro} />
        <Personagem pose="apontando" expressao="feliz" x={440} y={810} escala={0.7} />
      </Cenario>
    </Palco>
  );
};
const PontoPromessa: React.FC<{ n: number; atraso: number }> = ({ n, atraso }) => (
  <div style={{ width: 120, height: 120, borderRadius: 999, background: CORES.royal, color: CORES.branco, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 56, ...useCrescer(atraso) }}>{n}</div>
);

// ---------------------------------------------------------------- passos
export const Passo1: React.FC = () => (
  <EstruturaPasso n={1} cena="passo1">
    <Cenario altura={420} style={{ position: 'absolute', inset: 0 }}>
      <ellipse cx={480} cy={412} rx={340} ry={14} fill={CORES.royalClaro} />
      <Personagem pose="acenando" expressao="feliz" x={300} y={410} escala={0.8} />
      <Personagem pose="parado" expressao="neutro" espelhado x={680} y={410} escala={0.8} {...CLIENTE} />
    </Cenario>
    <Balao texto="Oi! Posso te fazer uma pergunta?" atraso={momento3('passo1', 'p1f', 0.15)} style={{ left: 30, top: -10, width: 520 }} />
  </EstruturaPasso>
);

export const Passo2: React.FC = () => {
  const nuvem = useCrescer(momento3('passo2', 'p2f', 0.2));
  const icones = [
    { el: <IconeFamilia tamanho={74} cor={CORES.royal} />, rot: 'Casa', f: 0.5 },
    { el: <Carro tamanho={74} cor={CORES.royal} />, rot: 'Carro', f: 0.68 },
    { el: <IconeEmpresa tamanho={74} cor={CORES.royal} />, rot: 'Empresa', f: 0.86 },
  ];
  return (
    <EstruturaPasso n={2} cena="passo2">
      <Cenario altura={420} style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx={300} cy={412} rx={260} ry={14} fill={CORES.royalClaro} />
        <Personagem pose="parado" expressao="feliz" x={150} y={410} escala={0.78} />
        <Personagem pose="pensando" expressao="feliz" espelhado x={420} y={410} escala={0.78} {...CLIENTE} />
        <g opacity={nuvem.opacity as number}>
          <circle cx={505} cy={190} r={12} fill={CORES.royalClaro} />
          <circle cx={530} cy={150} r={18} fill={CORES.royalClaro} />
        </g>
      </Cenario>
      <div style={{ position: 'absolute', left: 540, top: 10, width: 410, height: 210, borderRadius: 110, background: CORES.royalClaro, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', ...nuvem }}>
        {icones.map((ic) => (
          <IconeObjetivo key={ic.rot} atraso={momento3('passo2', 'p2f', ic.f)} rotulo={ic.rot}>
            {ic.el}
          </IconeObjetivo>
        ))}
      </div>
    </EstruturaPasso>
  );
};
const IconeObjetivo: React.FC<{ atraso: number; rotulo: string; children: React.ReactNode }> = ({ atraso, rotulo, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, ...useCrescer(atraso) }}>
    <SeloIcone tamanho={96} fundo={CORES.branco}>{children}</SeloIcone>
    <span style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 28, color: CORES.marinho }}>{rotulo}</span>
  </div>
);

export const Passo3: React.FC = () => {
  const doc = useEntrada(momento3('passo3', 'p3t', 0.6), 60);
  const linhas = ['Objetivo: a casa', 'Parcela que cabe no bolso', 'Prazo combinado'];
  return (
    <EstruturaPasso n={3} cena="passo3">
      <Cenario altura={420} style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx={230} cy={412} rx={110} ry={14} fill={CORES.royalClaro} />
        <Personagem pose="apontando" expressao="feliz" x={220} y={410} escala={0.82} />
      </Cenario>
      <div style={{ position: 'absolute', left: 420, top: 0, width: 520, height: 400, borderRadius: 26, background: CORES.branco, border: `4px solid ${CORES.trilho}`, padding: '26px 28px', ...doc }}>
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 40, color: CORES.marinho, paddingBottom: 14, borderBottom: `4px solid ${CORES.royal}` }}>Plano sob medida</div>
        {linhas.map((l, i) => (
          <LinhaDoc key={l} texto={l} atraso={momento3('passo3', 'p3f', 0.15 + i * 0.25)} />
        ))}
      </div>
    </EstruturaPasso>
  );
};
const LinhaDoc: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22, ...useEntrada(atraso, 30) }}>
    <svg width={38} height={38} viewBox="0 0 40 40"><path d="M 8 21 L 17 30 L 33 11" stroke={CORES.royal} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    <span style={{ fontSize: 34, fontWeight: 600, color: CORES.marinho }}>{texto}</span>
  </div>
);

export const Passo4: React.FC = () => {
  const cal = useEntrada(momento3('passo4', 'p4t', 0.5), 60);
  const marca = useProgresso(momento3('passo4', 'p4f', 0.55), 0.6);
  const relogio = useCrescer(momento3('passo4', 'p4f', 0.8));
  return (
    <EstruturaPasso n={4} cena="passo4">
      <Cenario altura={420} style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx={480} cy={412} rx={440} ry={14} fill={CORES.royalClaro} />
        <Personagem pose="apontando" expressao="feliz" x={110} y={410} escala={0.72} />
        <Personagem pose="parado" expressao="feliz" espelhado x={850} y={410} escala={0.72} {...CLIENTE} />
      </Cenario>
      <div style={{ position: 'absolute', left: 250, top: 10, width: 400, height: 360, borderRadius: 26, background: CORES.branco, border: `4px solid ${CORES.marinho}`, overflow: 'hidden', ...cal }}>
        <div style={{ height: 64, background: CORES.royal, color: CORES.branco, fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Agenda</div>
        <svg width={400} height={296}>
          {Array.from({ length: 20 }).map((_, k) => {
            const c = k % 5;
            const r = Math.floor(k / 5);
            return <rect key={k} x={26 + c * 72} y={22 + r * 66} width={56} height={48} rx={10} fill={k === 12 ? CORES.royalClaro : '#F1F4F9'} />;
          })}
          <circle cx={26 + 2 * 72 + 28} cy={22 + 2 * 66 + 24} r={42} fill="none" stroke={CORES.royal} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - marca} />
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 600, top: 250, ...relogio }}>
        <svg width={110} height={110} viewBox="0 0 64 64">
          <circle cx={32} cy={32} r={26} fill={CORES.branco} stroke={CORES.marinho} strokeWidth={4} />
          <path d="M32 18 V32 L42 38" stroke={CORES.royal} strokeWidth={4} fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </EstruturaPasso>
  );
};

export const Passo5: React.FC = () => {
  const coracao = useMola(momento3('passo5', 'p5f', 0.3), 150);
  const ind = (i: number) => momento3('passo5', 'p5i', 0.1 + i * 0.22);
  return (
    <EstruturaPasso n={5} cena="passo5">
      <Cenario altura={420} style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx={300} cy={412} rx={120} ry={14} fill={CORES.royalClaro} />
        <Personagem pose="celular" objeto="celular" expressao="feliz" x={300} y={410} escala={0.82} />
        <g transform={`translate(420 110) scale(${coracao})`} opacity={Math.min(1, coracao * 1.5)}>
          <path d="M0 18 C -26 0 -24 -22 -10 -22 C -4 -22 0 -16 0 -12 C 0 -16 4 -22 10 -22 C 24 -22 26 0 0 18 Z" fill={CORES.royal} transform="scale(2)" />
        </g>
      </Cenario>
      {[0, 1, 2].map((i) => (
        <Indicacao key={i} atraso={ind(i)} x={600 + (i % 2) * 170} y={20 + i * 115} />
      ))}
      <div style={{ position: 'absolute', left: 560, top: 370, fontFamily: FONTE.texto, fontWeight: 700, fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: CORES.royal, ...useEntrada(ind(0), 20) }}>indicações</div>
    </EstruturaPasso>
  );
};
const Indicacao: React.FC<{ atraso: number; x: number; y: number }> = ({ atraso, x, y }) => (
  <div style={{ position: 'absolute', left: x, top: y, ...useCrescer(atraso) }}>
    <SeloIcone tamanho={110} fundo={CORES.branco} style={{ border: `5px solid ${CORES.royal}` }}>
      <IconeAmigos tamanho={64} cor={CORES.royal} />
    </SeloIcone>
    <div style={{ position: 'absolute', right: -6, top: -6, width: 42, height: 42, borderRadius: 999, background: CORES.royal, color: CORES.branco, fontSize: 32, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</div>
  </div>
);

// ---------------------------------------------------------------- fechamento
export const Fechamento3: React.FC = () => (
  <FechamentoSerie
    {...TEXTOS3.fechamento}
    opcoes={['1', '2', '3', '4', '5']}
    atrasoEnvio={momento3('fechamento', 'manda')}
    atrasoComenta={momento3('fechamento', 'comenta')}
  />
);

export const COMPONENTES3: Record<keyof typeof CENAS3, React.FC> = {
  gancho: Gancho3,
  promessa: Promessa3,
  passo1: Passo1,
  passo2: Passo2,
  passo3: Passo3,
  passo4: Passo4,
  passo5: Passo5,
  fechamento: Fechamento3,
};
