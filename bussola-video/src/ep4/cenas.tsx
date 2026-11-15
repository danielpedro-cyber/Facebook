import React from 'react';
import { CORES, FONTE } from '../constantes';
import { Cenario, Palco } from '../componentes/Base';
import { Personagem, Pose } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';
import { CabecalhoEtapa, Capa, FechamentoSerie } from '../serie/Pecas';
import { CENAS4, EMPRESARIO, TEXTOS4, momento4 } from './constantes';

type Periodo = 'manha' | 'tarde' | 'noite';

export const Sol: React.FC<{ tamanho?: number; baixo?: boolean }> = ({ tamanho = 44, baixo }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round">
    <circle cx={32} cy={baixo ? 40 : 32} r={11} fill="currentColor" />
    {(baixo ? [-150, -120, -90, -60, -30] : [0, 45, 90, 135, 180, 225, 270, 315]).map((a) => {
      const r = (a * Math.PI) / 180;
      const cy = baixo ? 40 : 32;
      return <line key={a} x1={32 + Math.cos(r) * 18} y1={cy + Math.sin(r) * 18} x2={32 + Math.cos(r) * 26} y2={cy + Math.sin(r) * 26} />;
    })}
    {baixo && <line x1={6} y1={52} x2={58} y2={52} />}
  </svg>
);
export const Lua: React.FC<{ tamanho?: number }> = ({ tamanho = 44 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 64 64">
    <path d="M42 10 A24 24 0 1 0 54 44 A18 18 0 1 1 42 10 Z" fill="currentColor" />
  </svg>
);
const ICONES: Record<Periodo, React.ReactNode> = { manha: <Sol />, tarde: <Sol baixo />, noite: <Lua /> };

/** Coluna de um caminho: rótulo, personagem e cartão. As duas colunas usam este MESMO componente. */
const Coluna: React.FC<{ rotulo: string; texto: string; atraso: number; pose: Pose; objeto?: 'celular' | 'calculadora' | null; empresario?: boolean; espelhado?: boolean }> = ({
  rotulo,
  texto,
  atraso,
  pose,
  objeto = null,
  empresario,
  espelhado,
}) => {
  const card = useEntrada(atraso, 50);
  return (
    <div style={{ width: 455, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontFamily: FONTE.texto, fontWeight: 700, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: CORES.royal, height: 60, textAlign: 'center', display: 'flex', alignItems: 'center' }}>{rotulo}</div>
      <Cenario altura={260} largura={455}>
        <ellipse cx={227} cy={252} rx={90} ry={12} fill={CORES.royalClaro} />
        <Personagem pose={pose} objeto={objeto} vibrando={objeto === 'celular'} expressao="feliz" espelhado={espelhado} x={227} y={250} escala={0.78} {...(empresario ? EMPRESARIO : {})} />
      </Cenario>
      <div style={{ marginTop: 14, width: 455, height: 180, borderRadius: 26, background: CORES.branco, border: `4px solid ${CORES.royal}`, padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 42, lineHeight: 1.08, color: CORES.marinho, ...card }}>
        {texto}
      </div>
    </div>
  );
};

const POSES: Record<Periodo, { v: Pose; vo?: 'celular' | 'calculadora' | null; e: Pose; eo?: 'celular' | 'calculadora' | null }> = {
  manha: { v: 'celular', vo: 'celular', e: 'apontando' },
  tarde: { v: 'segurando', e: 'apontando' },
  noite: { v: 'celular', vo: 'celular', e: 'segurando', eo: 'calculadora' },
};
const IDS: Record<Periodo, { v: string; e: string }> = { manha: { v: 'mV', e: 'mE' }, tarde: { v: 'tV', e: 'tE' }, noite: { v: 'nV', e: 'nE' } };

const CenaPeriodo: React.FC<{ p: Periodo }> = ({ p }) => {
  const t = TEXTOS4.periodos[p];
  const po = POSES[p];
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ color: CORES.royal }}>
        <CabecalhoEtapa selo={t.selo} titulo={t.titulo} atrasoTitulo={0.5} icone={<span style={{ display: 'flex', color: CORES.royal }}>{ICONES[p]}</span>} />
      </div>
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Coluna rotulo={TEXTOS4.colunas.vendedor} texto={t.vendedor} atraso={momento4(p, IDS[p].v, 0.3)} pose={po.v} objeto={po.vo} />
        <Coluna rotulo={TEXTOS4.colunas.empresario} texto={t.empresario} atraso={momento4(p, IDS[p].e, 0.3)} pose={po.e} objeto={po.eo} empresario espelhado />
      </div>
    </Palco>
  );
};
export const Manha: React.FC = () => <CenaPeriodo p="manha" />;
export const Tarde: React.FC = () => <CenaPeriodo p="tarde" />;
export const Noite: React.FC = () => <CenaPeriodo p="noite" />;

// ---------------------------------------------------------------- gancho / promessa / precisa / fechamento
const Dupla: React.FC<{ y: number; escala?: number; vPose?: Pose; ePose?: Pose }> = ({ y, escala = 0.75, vPose = 'parado', ePose = 'parado' }) => (
  <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
    <ellipse cx={300} cy={y + 2} rx={90} ry={12} fill={CORES.royalClaro} />
    <ellipse cx={660} cy={y + 2} rx={90} ry={12} fill={CORES.royalClaro} />
    <Personagem pose={vPose} expressao="feliz" x={300} y={y} escala={escala} />
    <Personagem pose={ePose} expressao="feliz" espelhado x={660} y={y} escala={escala} {...EMPRESARIO} />
  </Cenario>
);

export const Gancho4: React.FC = () => (
  <Capa serie={TEXTOS4.serie} titulo={TEXTOS4.gancho.titulo} destaque={TEXTOS4.gancho.destaque}>
    {[
      { r: TEXTOS4.colunas.vendedor, x: 300 },
      { r: TEXTOS4.colunas.empresario, x: 660 },
    ].map(({ r, x }) => (
      <div key={r} style={{ position: 'absolute', top: 410, left: x - 180, width: 360, height: 70, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', textAlign: 'center', fontFamily: FONTE.texto, fontWeight: 700, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: CORES.royal }}>
        {r}
      </div>
    ))}
    <div style={{ position: 'absolute', top: 520, left: 440, color: CORES.royal }}><Sol tamanho={80} /></div>
    <Dupla y={800} escala={0.85} vPose="celular" ePose="apontando" />
  </Capa>
);

export const Promessa4: React.FC = () => {
  const l1 = useEntrada(momento4('promessa', 'liberdade'), 50);
  const l2 = useEntrada(momento4('promessa', 'diferente'), 50);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ ...l1, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 92, letterSpacing: -2.5, color: CORES.marinho, textAlign: 'center' }}>
        Os dois dão <span style={{ color: CORES.royal }}>liberdade.</span>
      </div>
      <div style={{ ...l2, marginTop: 14, fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 68, color: CORES.cinza, textAlign: 'center' }}>Mas o dia a dia é diferente.</div>
      <Dupla y={790} escala={0.85} vPose="comemorando" ePose="comemorando" />
    </Palco>
  );
};

const Precisa: React.FC<{ quem: string; texto: string; atraso: number }> = ({ quem, texto, atraso }) => {
  const e = useEntrada(atraso, 50);
  return (
    <div style={{ width: 455, textAlign: 'center', ...e }}>
      <div style={{ fontFamily: FONTE.texto, fontWeight: 600, fontSize: 32, color: CORES.cinza }}>{quem} precisa de</div>
      <div style={{ marginTop: 10, fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 60, lineHeight: 1.02, color: CORES.royal }}>{texto}</div>
    </div>
  );
};
export const Precisa4: React.FC = () => {
  const c = useCrescer(0.2);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={{ ...c, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 76, color: CORES.marinho, textAlign: 'center' }}>O que cada um precisa</div>
      <div style={{ position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Precisa quem="O vendedor" texto={TEXTOS4.precisa.vendedor} atraso={momento4('precisa', 'pV', 0.3)} />
        <Precisa quem="O empresário" texto={TEXTOS4.precisa.empresario} atraso={momento4('precisa', 'pE', 0.3)} />
      </div>
      <Dupla y={800} escala={0.85} vPose="segurando" ePose="segurando" />
    </Palco>
  );
};

export const Fechamento4: React.FC = () => {
  const f = TEXTOS4.fechamento;
  const fr = useEntrada(momento4('fechamento', 'melhor'), 40);
  return (
    <FechamentoSerie
      envio1={f.envio1}
      envio2={f.envio2}
      comenta={f.comenta}
      opcoes={['Vendedor', 'Empresário']}
      atrasoEnvio={momento4('fechamento', 'manda')}
      atrasoComenta={momento4('fechamento', 'comenta')}
      topo={
        <div style={{ ...fr, marginTop: 22, fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 56, lineHeight: 1.08, textAlign: 'center', color: CORES.marinho }}>
          {f.frase1} <span style={{ color: CORES.royal }}>{f.frase2}</span>
        </div>
      }
    />
  );
};

export const COMPONENTES4: Record<keyof typeof CENAS4, React.FC> = {
  gancho: Gancho4,
  promessa: Promessa4,
  manha: Manha,
  tarde: Tarde,
  noite: Noite,
  precisa: Precisa4,
  fechamento: Fechamento4,
};
