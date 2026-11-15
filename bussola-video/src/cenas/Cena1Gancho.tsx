import React from 'react';
import { CORES, FONTE, TEXTOS } from '../constantes';
import { Logo, Palco } from '../componentes/Base';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 1 — gancho (0 a 5 s)
const Palavra: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => {
  const estilo = useEntrada(atraso, 70);
  return <span style={{ display: 'inline-block', marginRight: '0.26em', ...estilo }}>{texto}</span>;
};

export const Cena1Gancho: React.FC = () => {
  const logo = useCrescer(0.1);
  const palavras = TEXTOS.gancho.split(' ');
  return (
    <Palco style={{ justifyContent: 'center', gap: 90 }}>
      <div style={logo}>
        <Logo altura={110} />
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: FONTE.titulo + 8,
          lineHeight: 1.12,
          letterSpacing: -1,
          textAlign: 'center',
          color: CORES.marinho,
          maxWidth: 900,
        }}
      >
        {palavras.map((p, i) => (
          <Palavra key={i} texto={p} atraso={0.7 + i * 0.13} />
        ))}
      </div>
    </Palco>
  );
};
