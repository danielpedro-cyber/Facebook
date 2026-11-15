import React from 'react';
import { CORES, FONTE, TEXTOS } from '../constantes';
import { Logo, Palco, Titulo } from '../componentes/Base';
import { IconeComentario } from '../componentes/Icones';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 9 — fechamento (80 a 90 s): pergunta, logo e chamada para comentar.
export const Cena9Fechamento: React.FC = () => {
  const pergunta = useEntrada(0.2);
  const logo = useCrescer(2.2);
  const cta = useEntrada(3.8, 80);
  return (
    <Palco style={{ gap: 56 }}>
      <Titulo style={pergunta}>{TEXTOS.fechamento.pergunta}</Titulo>
      <div style={logo}>
        <Logo altura={120} />
      </div>
      <div
        style={{
          background: CORES.marinho,
          color: CORES.branco,
          borderRadius: 32,
          padding: '28px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          maxWidth: 960,
          ...cta,
        }}
      >
        <IconeComentario tamanho={110} cor={CORES.branco} espessura={3.4} style={{ flexShrink: 0 }} />
        <div style={{ fontFamily: FONTE.familia, fontWeight: 800, fontSize: FONTE.tituloMenor, lineHeight: 1.12 }}>
          {TEXTOS.fechamento.cta1}
          <br />
          <span style={{ fontWeight: 700 }}>{TEXTOS.fechamento.cta2}</span>
        </div>
      </div>
    </Palco>
  );
};
