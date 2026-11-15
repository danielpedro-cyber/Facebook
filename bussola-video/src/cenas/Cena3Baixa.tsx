import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { CORES, FONTE, momento, s, temLegenda } from '../constantes';
import { Cenario, Palco, Titulo } from '../componentes/Base';
import { Personagem } from '../componentes/Personagem';
import { useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 3 — a baixa. Único lugar com vermelho suave.
// Zoom dramático em "É aqui que a maioria desiste".
// o celular toca (efeito sonoro) e para pouco antes de "o telefone para de tocar"
// (nas versões sem a frase do telefone, o celular só vibra até "a lista acaba", sem som)
export const TEM_TOQUE = temLegenda('telefone');
export const TOQUE_INICIO = 0.2;
const SILENCIO = TEM_TOQUE ? TOQUE_INICIO + 1.75 : momento('baixa', 'lista', 1);
const QUEDA = momento('baixa', 'vendasCaem'); // "e as vendas caem"
const ANTES = [0.95, 0.9, 0.85, 0.92, 0.88];
const DEPOIS = [0.95, 0.72, 0.48, 0.28, 0.1];

const Placa: React.FC = () => {
  const entra = useProgresso(0.3, 0.8);
  const queda = useProgresso(QUEDA, 1.4);
  const seta = useProgresso(QUEDA + 0.7, 0.8);
  return (
    <g transform="translate(560 40)">
      <rect x={160} y={300} width={14} height={220} fill={CORES.marinho} />
      <rect x={0} y={0} width={340} height={300} rx={22} fill={CORES.branco} stroke={CORES.marinho} strokeWidth={5} />
      <text x={26} y={52} fontFamily={FONTE.titulo} fontWeight={700} fontSize={32} fill={CORES.marinho}>
        Minhas vendas
      </text>
      {ANTES.map((a, i) => {
        const h = 190 * (a + (DEPOIS[i] - a) * queda) * entra;
        const caiu = queda > 0.05 && i > 0;
        return <rect key={i} x={28 + i * 60} y={270 - h} width={44} height={h} rx={8} fill={caiu ? CORES.vermelhoSuave : CORES.royal} />;
      })}
      <path d="M 40 90 L 160 140 L 300 240" stroke={CORES.vermelho} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - seta} />
      <path d="M 274 244 L 302 242 L 296 214" stroke={CORES.vermelho} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={seta > 0.95 ? 1 : 0} />
    </g>
  );
};

export const Cena3Baixa: React.FC = () => {
  const frame = useCurrentFrame();
  const titulo = useEntrada(0.2);
  const desiste = useEntrada(momento('baixa', 'desiste'));
  const zoom = interpolate(frame, [s(momento('baixa', 'desiste') - 0.2), s(momento('baixa', 'desiste') + 0.6)], [1, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const nuvem = interpolate(frame, [s(SILENCIO), s(SILENCIO + 0.6)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vibrando = frame < s(SILENCIO) && Math.floor(frame / 6) % 2 === 0;
  return (
    <Palco style={{ justifyContent: 'flex-start', transform: `scale(${zoom})`, transformOrigin: '50% 12%' }}>
      <Titulo style={titulo}>A lista acaba.</Titulo>
      <Cenario altura={580} style={{ position: 'absolute', top: 100, left: 0 }}>
        <ellipse cx={420} cy={560} rx={470} ry={18} fill={CORES.royalClaro} />
        <Placa />
        {/* nuvem cinza */}
        <g opacity={nuvem} transform={`translate(${250} ${90 + (1 - nuvem) * 20})`} fill="#C9D3E2">
          <circle cx={0} cy={40} r={46} />
          <circle cx={60} cy={20} r={62} />
          <circle cx={124} cy={44} r={44} />
          <rect x={-40} y={40} width={200} height={50} rx={25} />
        </g>
        {/* caixote */}
        <rect x={200} y={440} width={220} height={120} rx={14} fill="#BFD0EC" />
        <Personagem
          pose="celularSentado"
          objeto="celular"
          vibrando={vibrando}
          expressao={frame < s(SILENCIO) ? 'neutro' : 'triste'}
          cabecaBaixa={frame >= s(SILENCIO)}
          x={300}
          y={564}
          escala={1}
        />
      </Cenario>
      <Titulo tamanho={FONTE.tamTituloMenor} style={{ ...desiste, position: 'absolute', top: 690, left: 0, right: 0 }}>
        É aqui que a maioria <span style={{ color: CORES.vermelho }}>desiste.</span>
      </Titulo>
    </Palco>
  );
};
