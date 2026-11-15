import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Cenario, Logo, Palco, Titulo } from '../componentes/Base';
import { IconeComentario } from '../componentes/Icones';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 9 — fechamento (80 a 90 s): pergunta, logo e chamada para comentar.
export const Cena9Fechamento: React.FC = () => {
  const pergunta = useEntrada(0.2);
  const logo = useCrescer(momento('fechamento', 'pergunta', 1) + 0.2);
  const cta = useEntrada(momento('fechamento', 'comenta'), 80);
  const pers = useCrescer(0.4);
  return (
    <Palco style={{ justifyContent: 'flex-start', gap: 30 }}>
      <Titulo style={pergunta}>{TEXTOS.fechamento.pergunta}</Titulo>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, height: 260 }}>
        <Cenario altura={260} largura={220} style={pers}>
          <ellipse cx={110} cy={252} rx={80} ry={12} fill={CORES.royalClaro} />
          <Personagem pose="acenando" expressao="feliz" x={110} y={250} escala={0.78} />
        </Cenario>
        <div style={logo}>
          <Logo altura={150} />
        </div>
      </div>
      <div
        style={{
          background: CORES.marinho,
          color: CORES.branco,
          borderRadius: 30,
          padding: '28px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          maxWidth: 960,
          ...cta,
        }}
      >
        <IconeComentario tamanho={100} cor={CORES.branco} espessura={3.4} style={{ flexShrink: 0 }} />
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: FONTE.tamTituloMenor, lineHeight: 1.08 }}>
          {TEXTOS.fechamento.cta1}
          <br />
          <span style={{ color: '#9CC0FF' }}>{TEXTOS.fechamento.cta2}</span>
        </div>
      </div>
    </Palco>
  );
};
