import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Cenario, Palco, SeloIcone, Titulo } from '../componentes/Base';
import { IconeAlvo, IconeCapelo, IconeMegafone, IconeRede } from '../componentes/Icones';
import { Personagem } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 5 — canais (32 a 42 s): o consultor aponta para os canais pagos.
const ICONES = [IconeRede, IconeCapelo, IconeMegafone, IconeAlvo];
const ATRASOS = [
  momento('canais', 'bni'),
  momento('canais', 'educacao'),
  momento('canais', 'propaganda'),
  momento('canais', 'propaganda', 0.5), // "tráfego pago"
];

const Cartao: React.FC<{ indice: number }> = ({ indice }) => {
  const Icone = ICONES[indice];
  return (
    <div
      style={{
        width: 680,
        height: 118,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '0 26px',
        background: CORES.branco,
        borderRadius: 24,
        border: `3px solid ${CORES.trilho}`,
        borderLeft: `10px solid ${CORES.royal}`,
        ...useEntrada(ATRASOS[indice], 80),
      }}
    >
      <SeloIcone tamanho={80} style={useCrescer(ATRASOS[indice] + 0.15)}>
        <Icone tamanho={54} cor={CORES.royal} espessura={3.6} />
      </SeloIcone>
      <span style={{ fontFamily: FONTE.titulo, fontSize: 46, fontWeight: 700 }}>{TEXTOS.canais[indice]}</span>
    </div>
  );
};

export const Cena5Canais: React.FC = () => {
  const entra = useCrescer(0.05);
  const rodape = useEntrada(momento('canais', 'gratis'));
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <Cenario altura={600} style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={120} cy={565} rx={110} ry={14} fill={CORES.royalClaro} />
        <g opacity={entra.opacity as number}>
          <Personagem pose="apontando" expressao="feliz" x={110} y={562} escala={0.95} />
        </g>
      </Cenario>
      <div style={{ position: 'absolute', top: 20, right: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {TEXTOS.canais.map((_, i) => (
          <Cartao key={i} indice={i} />
        ))}
      </div>
      <Titulo tamanho={FONTE.tamTituloMenor} style={{ ...rodape, position: 'absolute', top: 650, left: 0, right: 0 }}>
        Não existe canal <span style={{ color: CORES.royal }}>de graça.</span>
      </Titulo>
    </Palco>
  );
};
