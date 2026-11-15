import React from 'react';
import { interpolateColors } from 'remotion';
import { CORES, TEXTOS, momento } from '../constantes';
import { Cenario, Palco, Titulo } from '../componentes/Base';
import { IconeLampada } from '../componentes/Icones';
import { Personagem, useTrocaPose } from '../componentes/Personagem';
import { useEntrada, useMola, useProgresso } from '../componentes/animacoes';

// CENA 4 — virada de mentalidade (24 a 32 s): o consultor se levanta e tem a ideia.
const LEVANTA = 0.3;
const ACENDE = 1.7;
const DECIDE = momento('virada', 'investir');

export const Cena4Virada: React.FC = () => {
  const levanta = useTrocaPose(LEVANTA, 0.6);
  const decide = useTrocaPose(DECIDE, 0.5);
  const lampada = useMola(ACENDE - 0.4);
  const acende = useProgresso(ACENDE, 0.5);
  const raios = useMola(ACENDE + 0.2);
  const texto = useEntrada(momento('virada', 'daqui'));
  const destaque = useMola(momento('virada', 'investir', 0.5));

  const pose = decide > 0 ? 'apontando' : 'pensando';
  const dePose = decide > 0 ? 'pensando' : 'sentado';
  const t = decide > 0 ? decide : levanta;
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <Cenario altura={540} style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={480} cy={515} rx={260} ry={16} fill={CORES.royalClaro} />
        <rect x={230} y={395} width={180} height={120} rx={14} fill="#BFD0EC" opacity={1 - levanta} />
        <Personagem pose={pose} dePose={dePose} transicao={t} expressao={acende > 0.5 ? 'feliz' : 'neutro'} x={360} y={512} escala={1.05} />
        {/* lâmpada acima da cabeça */}
        <g transform={`translate(640 190) scale(${0.3 + 0.7 * lampada})`} opacity={Math.min(1, lampada * 1.4)}>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = ((-90 + (i - 3) * 30) * Math.PI) / 180;
            return (
              <line key={i} x1={Math.cos(a) * 110} y1={Math.sin(a) * 110} x2={Math.cos(a) * (110 + 36 * raios)} y2={Math.sin(a) * (110 + 36 * raios)} stroke={CORES.royal} strokeWidth={9} strokeLinecap="round" opacity={raios > 0.05 ? 1 : 0} />
            );
          })}
          <g transform="translate(-95 -105)">
            <IconeLampada tamanho={190} espessura={3} cor={interpolateColors(acende, [0, 1], [CORES.marinho, CORES.royal])} preenchimento={interpolateColors(acende, [0, 1], ['#FFFFFF', CORES.royalClaro])} />
          </g>
        </g>
      </Cenario>
      <Titulo style={{ ...texto, position: 'absolute', top: 590, left: 0, right: 0 }}>
        {TEXTOS.virada.antes}
        <span style={{ color: CORES.royal, display: 'inline-block', transform: `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, destaque))})`, borderBottom: `7px solid ${CORES.royal}` }}>
          {TEXTOS.virada.destaque}
        </span>
      </Titulo>
    </Palco>
  );
};
