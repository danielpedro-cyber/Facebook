import React from 'react';
import { CORES, FONTE, TEXTOS, momento } from '../constantes';
import { Palco, SeloIcone, Titulo } from '../componentes/Base';
import { IconeAlvo, IconeCapelo, IconeMegafone, IconeRede } from '../componentes/Icones';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 5 — canais (32 a 42 s). Cartões entram um a um, junto com a narração.
const ICONES = [IconeRede, IconeCapelo, IconeMegafone, IconeAlvo];
const ATRASOS = [
  momento('canais', 'bni'),
  momento('canais', 'educacao'),
  momento('canais', 'propaganda'),
  momento('canais', 'propaganda', 0.5), // "tráfego pago"
];

const Cartao: React.FC<{ indice: number }> = ({ indice }) => {
  const Icone = ICONES[indice];
  const estilo = useEntrada(ATRASOS[indice], 90);
  const icone = useCrescer(ATRASOS[indice] + 0.15);
  return (
    <div
      style={{
        width: 900,
        height: 132,
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '0 30px',
        background: CORES.branco,
        borderRadius: 26,
        border: `4px solid ${CORES.marinho}`,
        boxShadow: `0 8px 0 ${CORES.royalClaro}`,
        ...estilo,
      }}
    >
      <SeloIcone tamanho={92} style={icone}>
        <Icone tamanho={64} cor={CORES.royal} espessura={3.6} />
      </SeloIcone>
      <span style={{ fontSize: FONTE.texto, fontWeight: 800 }}>{TEXTOS.canais[indice]}</span>
    </div>
  );
};

export const Cena5Canais: React.FC = () => {
  const rodape = useEntrada(momento('canais', 'gratis'));
  return (
    <Palco style={{ gap: 22 }}>
      {TEXTOS.canais.map((_, i) => (
        <Cartao key={i} indice={i} />
      ))}
      <Titulo tamanho={FONTE.tituloMenor} style={{ ...rodape, marginTop: 24 }}>
        Não existe canal <span style={{ color: CORES.royal }}>de graça.</span>
      </Titulo>
    </Palco>
  );
};
