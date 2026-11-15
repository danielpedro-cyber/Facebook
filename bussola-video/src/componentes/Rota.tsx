import React, { useMemo } from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { getLength, getPointAtLength } from '@remotion/paths';
import { CENAS, CORES, FONTE, LAYOUT, PARADAS, VIDEO, s } from '../constantes';
import { RosaDosVentos } from './Icones';

// Estrada azul que se desenha no topo do vídeo e ganha uma parada numerada
// a cada cena. Fica fixa durante todo o vídeo (elemento recorrente).

const CAMINHO =
  'M 70 110 C 150 30, 230 30, 300 95 S 450 175, 540 105 S 700 30, 790 90 S 940 160, 1010 80';

const TOTAL_PARADAS = PARADAS.length + 1; // + chegada (bandeira)
const fracaoDaParada = (i: number) => (i + 1) / TOTAL_PARADAS; // i = 0..5
const DESENHO_SEG = 1.2;
const ponto = (dist: number) => getPointAtLength(CAMINHO, dist) ?? { x: 0, y: 0 }; // tempo para a linha chegar à próxima parada

/** Quadros-chave do progresso da linha (0 → 1). */
const chaves = (() => {
  const t: number[] = [0, s(0.4), s(2.4)];
  const v: number[] = [0, 0, 0.05];
  PARADAS.forEach((p, i) => {
    const ini = CENAS[p.cena].inicio + 0.15;
    t.push(s(ini), s(ini + DESENHO_SEG));
    v.push(v[v.length - 1], fracaoDaParada(i));
  });
  const fim = CENAS.fechamento.inicio + 0.2;
  t.push(s(fim), s(fim + DESENHO_SEG));
  v.push(fracaoDaParada(PARADAS.length - 1), 1);
  return { t, v };
})();

export const Rota: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const comprimento = useMemo(() => getLength(CAMINHO), []);

  const progresso = interpolate(frame, chaves.t, chaves.v, {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const pontos = useMemo(
    () =>
      [...PARADAS.map((_, i) => fracaoDaParada(i)), 1].map((f) =>
        ponto(f * comprimento),
      ),
    [comprimento],
  );
  const inicio = ponto(0);
  const ponta = ponto(Math.max(0.001, progresso) * comprimento);

  // Parada atual = última parada já alcançada
  const atual = PARADAS.reduce((acc, _, i) => (progresso >= fracaoDaParada(i) - 1e-4 ? i : acc), -1);

  return (
    <svg
      width={VIDEO.largura}
      height={LAYOUT.rotaAltura}
      viewBox={`0 0 ${VIDEO.largura} ${LAYOUT.rotaAltura}`}
      style={{ position: 'absolute', top: LAYOUT.rotaTopo, left: 0 }}
    >
      {/* trilho ainda não percorrido */}
      <path d={CAMINHO} stroke={CORES.trilho} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="2 20" />
      {/* trecho percorrido */}
      <path
        d={CAMINHO}
        stroke={CORES.royal}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={comprimento}
        strokeDashoffset={comprimento * (1 - progresso)}
      />
      {/* ponto de partida */}
      <circle cx={inicio.x} cy={inicio.y} r={11} fill={CORES.marinho} />

      {pontos.map((pt, i) => {
        const ehChegada = i === PARADAS.length;
        const quadroChegada = (() => {
          // primeiro quadro em que o progresso alcança esta parada
          const alvo = ehChegada ? 1 : fracaoDaParada(i);
          for (let k = 0; k < chaves.t.length; k++) if (chaves.v[k] >= alvo - 1e-4) return chaves.t[k];
          return Infinity;
        })();
        const pop = spring({ frame: frame - quadroChegada, fps, config: { damping: 12, stiffness: 160 } });
        if (pop <= 0.001) return null;

        if (ehChegada) {
          return (
            <g key="chegada" transform={`translate(${pt.x} ${pt.y}) scale(${pop})`}>
              <path d="M -4 6 V -58 M -4 -56 H 34 L 26 -44 L 34 -32 H -4" stroke={CORES.marinho} strokeWidth={6} fill={CORES.royalClaro} strokeLinejoin="round" strokeLinecap="round" />
              <circle r={13} fill={CORES.marinho} />
            </g>
          );
        }
        const ativa = i === atual;
        const tam = ativa ? 84 : 60;
        return (
          <g key={i} transform={`translate(${pt.x} ${pt.y}) scale(${pop})`}>
            {ativa && <circle r={50} fill={CORES.royalClaro} />}
            <g transform={`translate(${-tam / 2} ${-tam / 2})`}>
              <RosaDosVentos tamanho={tam} />
            </g>
            <g transform={`translate(${ativa ? 34 : 26} ${ativa ? 30 : 22})`}>
              <circle r={17} fill={ativa ? CORES.marinho : CORES.branco} stroke={CORES.marinho} strokeWidth={3} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONTE.texto} fontWeight={800} fontSize={19} fill={ativa ? CORES.branco : CORES.marinho}>
                {i + 1}
              </text>
            </g>
          </g>
        );
      })}

      {/* "veículo": ponta da linha enquanto ela avança */}
      {progresso > 0.001 && progresso < 0.999 && (
        <circle cx={ponta.x} cy={ponta.y} r={9} fill={CORES.branco} stroke={CORES.royal} strokeWidth={5} />
      )}
    </svg>
  );
};

/** Etiqueta "PARADA N · Título" abaixo da rota, durante a cena da parada. */
export const EtiquetaParada: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const parada = PARADAS.find((p) => t >= CENAS[p.cena].inicio && t < CENAS[p.cena].fim);
  if (!parada) return null;

  const { inicio, fim } = CENAS[parada.cena];
  const entra = spring({ frame: frame - s(inicio + 1.1), fps, config: { damping: 16, stiffness: 120 } });
  const sai = interpolate(frame, [s(fim - 0.4), s(fim)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vermelho = parada.cena === 'baixa';

  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.paradaTopo + 8,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: FONTE.texto,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 7,
        textTransform: 'uppercase',
        color: vermelho ? CORES.vermelho : CORES.royal,
        opacity: Math.min(entra, sai),
        transform: `translateY(${(1 - entra) * 30}px)`,
      }}
    >
      Parada {parada.numero} · {parada.titulo}
    </div>
  );
};
