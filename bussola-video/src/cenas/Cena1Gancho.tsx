import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CORES, FONTE, TEXTOS, s } from '../constantes';
import { Cenario, Estrada, Logo, Palco } from '../componentes/Base';
import { Personagem, useTrocaPose } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 1 — gancho (0 a 5 s): logo, frase de abertura e o consultor entrando na estrada.
const CHEGA = 2.8; // s em que o personagem para

const Palavra: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => (
  <span style={{ display: 'inline-block', marginRight: '0.24em', ...useEntrada(atraso, 60) }}>{texto}</span>
);

export const Cena1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useCrescer(0.1);
  const x = interpolate(frame, [s(0.3), s(CHEGA)], [-120, 470], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const troca = useTrocaPose(CHEGA, 0.4);
  const andando = frame < s(CHEGA);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={logo}>
        <Logo altura={130} />
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: FONTE.titulo,
          fontWeight: 600,
          fontSize: FONTE.tamTitulo,
          lineHeight: 1.06,
          letterSpacing: -1.5,
          textAlign: 'center',
          color: CORES.marinho,
          maxWidth: 940,
        }}
      >
        {TEXTOS.gancho.split(' ').map((p, i) => (
          <Palavra key={i} texto={p} atraso={0.5 + i * 0.12} />
        ))}
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <Estrada y={735} />
        <Personagem
          pose={andando ? 'andando' : 'acenando'}
          dePose={andando ? undefined : 'parado'}
          transicao={troca}
          x={x}
          y={730}
          escala={0.85}
        />
      </Cenario>
    </Palco>
  );
};
