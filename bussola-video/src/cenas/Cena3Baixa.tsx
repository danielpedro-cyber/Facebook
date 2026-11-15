import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CORES, FONTE, s } from '../constantes';
import { Palco, SeloIcone, Titulo } from '../componentes/Base';
import { IconeCelular, IconeSinoMudo } from '../componentes/Icones';
import { useCrescer, useEntrada, useProgresso } from '../componentes/animacoes';

// CENA 3 — a baixa (15 a 24 s). Único lugar com vermelho suave.
const ALTURAS_ANTES = [0.9, 0.95, 0.85, 0.9, 0.8];
const ALTURAS_DEPOIS = [0.9, 0.72, 0.5, 0.3, 0.14];

const Celular: React.FC = () => {
  const frame = useCurrentFrame();
  const entrada = useCrescer(0.1);
  // vibra no começo e para quando "o telefone para de tocar" (~2 s)
  const vibrando = frame < s(1.9);
  const tremor = vibrando ? Math.sin(frame * 1.9) * 4 : 0;
  const ondas = interpolate(frame, [s(1.5), s(2.0)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sino = useCrescer(2.1);
  return (
    <div style={{ position: 'relative', width: 340, height: 420, ...entrada }}>
      <div style={{ position: 'absolute', left: 60, top: 40, transform: `rotate(${tremor}deg)` }}>
        <IconeCelular tamanho={240} espessura={2.6} cor={frame > s(2) ? CORES.cinza : CORES.marinho} />
      </div>
      <svg width={340} height={420} style={{ position: 'absolute', inset: 0, opacity: ondas }}>
        {[0, 1].map((i) => (
          <g key={i} stroke={CORES.royal} strokeWidth={6} fill="none" strokeLinecap="round">
            <path d={`M ${48 - i * 22} ${130 - i * 16} Q ${28 - i * 22} 160 ${48 - i * 22} ${190 + i * 16}`} />
            <path d={`M ${292 + i * 22} ${130 - i * 16} Q ${312 + i * 22} 160 ${292 + i * 22} ${190 + i * 16}`} />
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', right: 0, bottom: 10, ...sino }}>
        <SeloIcone tamanho={130} fundo={CORES.vermelhoClaro} style={{ border: `4px solid ${CORES.vermelho}` }}>
          <IconeSinoMudo tamanho={84} cor={CORES.vermelho} />
        </SeloIcone>
      </div>
    </div>
  );
};

const Grafico: React.FC = () => {
  const entrada = useProgresso(0.3, 1.0);
  const queda = useProgresso(3.8, 1.6);
  const seta = useProgresso(4.6, 0.9);
  const L = 440;
  const H = 360;
  const larg = 58;
  const passo = 82;
  return (
    <svg width={L} height={H + 20}>
      <line x1={10} y1={H} x2={L - 10} y2={H} stroke={CORES.marinho} strokeWidth={5} strokeLinecap="round" />
      {ALTURAS_ANTES.map((a, i) => {
        const alvo = a + (ALTURAS_DEPOIS[i] - a) * queda;
        const h = (H - 40) * alvo * entrada;
        return (
          <rect
            key={i}
            x={30 + i * passo}
            y={H - h}
            width={larg}
            height={h}
            rx={10}
            fill={queda > 0.05 ? CORES.vermelho : CORES.royal}
            opacity={queda > 0.05 ? 0.35 + 0.65 * Math.min(1, queda * 1.5) : 1}
          />
        );
      })}
      <path
        d={`M 50 70 L 190 150 L 260 140 L 400 270`}
        stroke={CORES.vermelho}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - seta}
      />
      <path d="M 372 270 H 404 V 238" stroke={CORES.vermelho} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={seta > 0.95 ? 1 : 0} />
    </svg>
  );
};

export const Cena3Baixa: React.FC = () => {
  const titulo = useEntrada(0.2);
  const desiste = useEntrada(5.7);
  return (
    <Palco style={{ justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
      <Titulo style={titulo}>A lista acaba.</Titulo>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 40 }}>
        <Celular />
        <Grafico />
      </div>
      <Titulo tamanho={FONTE.tituloMenor} style={desiste}>
        É aqui que a maioria <span style={{ color: CORES.vermelho }}>desiste.</span>
      </Titulo>
    </Palco>
  );
};
