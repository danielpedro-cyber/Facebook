import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Cenario, Logo, Palco } from '../componentes/Base';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 9 — fechamento: logo, pedido de ENVIO (o sinal que mais leva o vídeo a quem
// não te segue) e pedido de comentário. "antes que ele desista" fecha o ciclo com o gancho.
export const ENTRA_LOGO = 0.2;
export const ENTRA_ENVIO = momento('fechamento', 'manda');
export const ENTRA_COMENTA = momento('fechamento', 'comenta');

const Aviao: React.FC = () => (
  <svg width={104} height={104} viewBox="0 0 64 64" fill="none" stroke={CORES.branco} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" style={{ flexShrink: 0 }}>
    <path d="M6 30 L58 8 L44 56 L30 36 Z" />
    <path d="M30 36 L58 8" />
  </svg>
);

export const Cena9Fechamento: React.FC = () => {
  const t = TEXTOS.fechamento;
  const logo = useCrescer(ENTRA_LOGO);
  const envio = useEntrada(ENTRA_ENVIO, 80);
  const comenta = useEntrada(ENTRA_COMENTA, 50);
  const pers = useCrescer(0.4);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={logo}>
        <Logo altura={130} />
      </div>
      <div
        style={{
          marginTop: 40,
          background: CORES.marinho,
          color: CORES.branco,
          borderRadius: 34,
          padding: '30px 38px',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          width: 960,
          ...envio,
        }}
      >
        <Aviao />
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 64, lineHeight: 1.04 }}>
          {t.envio1} <span style={{ color: '#9CC0FF' }}>{t.envio2}</span>
        </div>
      </div>
      <div style={{ ...comenta, marginTop: 30, fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 58, lineHeight: 1.08, textAlign: 'center' }}>
        {t.comenta} <span style={{ color: CORES.royal }}>{t.opcao1}</span> ou <span style={{ color: CORES.royal }}>{t.opcao2}</span>
      </div>
      <Cenario altura={820} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <g style={{ opacity: pers.opacity as number }}>
          <ellipse cx={480} cy={818} rx={80} ry={11} fill={CORES.royalClaro} />
          <Personagem pose="acenando" expressao="feliz" x={480} y={816} escala={0.6} />
        </g>
      </Cenario>
    </Palco>
  );
};
