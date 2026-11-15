import React from 'react';
import { CORES, FONTE } from '../../constantes';
import { Cenario, Logo, Palco } from '../../componentes/Base';
import { Personagem } from '../../componentes/Personagem';
import { useCrescer, useEntrada } from '../../componentes/animacoes';
import { TEXTOS2, momento2 } from '../constantes';

// FECHAMENTO: logo, pedido de envio e pergunta para comentar ("qual desses erros você já cometeu?").
export const F2 = { logo: 0.2, envio: () => momento2('fechamento', 'manda'), comenta: () => momento2('fechamento', 'comenta') };

export const Fechamento2: React.FC = () => {
  const t = TEXTOS2.fechamento;
  const logo = useCrescer(F2.logo);
  const envio = useEntrada(F2.envio(), 80);
  const comenta = useEntrada(F2.comenta(), 50);
  const pers = useCrescer(0.4);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={logo}>
        <Logo altura={130} />
      </div>
      <div style={{ marginTop: 40, background: CORES.marinho, color: CORES.branco, borderRadius: 34, padding: '30px 38px', display: 'flex', alignItems: 'center', gap: 26, width: 960, ...envio }}>
        <svg width={104} height={104} viewBox="0 0 64 64" fill="none" stroke={CORES.branco} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M6 30 L58 8 L44 56 L30 36 Z" />
          <path d="M30 36 L58 8" />
        </svg>
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 64, lineHeight: 1.04 }}>
          {t.envio1} <span style={{ color: '#9CC0FF' }}>{t.envio2}</span>
        </div>
      </div>
      <div style={{ ...comenta, marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 58, lineHeight: 1.08, textAlign: 'center' }}>{t.comenta}</div>
        <div style={{ display: 'flex', gap: 22 }}>
          {['1', '2', '3'].map((n) => (
            <div key={n} style={{ width: 80, height: 80, borderRadius: 999, border: `4px solid ${CORES.royal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 42, color: CORES.royal }}>
              {n}
            </div>
          ))}
        </div>
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <g style={{ opacity: pers.opacity as number }}>
          <ellipse cx={850} cy={818} rx={70} ry={11} fill={CORES.royalClaro} />
          <Personagem pose="acenando" expressao="feliz" x={850} y={816} escala={0.6} />
        </g>
      </Cenario>
    </Palco>
  );
};
