import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CENAS, CORES, FONTE, TEXTOS, momentoOu, s } from '../constantes';
import { Cenario, Palco } from '../componentes/Base';
import { Personagem } from '../componentes/Personagem';

// CENA 1 — gancho (0 a 8 s).
// O PRIMEIRO QUADRO já mostra a pergunta inteira (funciona sem som e vira a capa do Reels).
// Sem logo na abertura: ela aparece só no final.
// "esse vídeo é pra você": o consultor levanta a cabeça (nas versões curtas, perto do fim do gancho)
const OLHA = momentoOu('gancho', 'praVoce', CENAS.gancho.fim - CENAS.gancho.inicio - 1.2);

export const Cena1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { pergunta, destaque } = TEXTOS.gancho;
  const i = pergunta.lastIndexOf(destaque);
  // leve "respiração" do título para não ficar parado
  const escala = 1 + 0.012 * Math.sin(frame * 0.12);
  const olhou = frame >= s(OLHA);
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div
        style={{
          alignSelf: 'flex-start',
          fontFamily: FONTE.texto,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 5,
          textTransform: 'uppercase',
          color: CORES.branco,
          background: CORES.royal,
          padding: '8px 20px',
          borderRadius: 12,
        }}
      >
        {TEXTOS.serie}
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: FONTE.titulo,
          fontWeight: 700,
          fontSize: pergunta.length > 44 ? 92 : 104,
          lineHeight: 1.0,
          letterSpacing: -2.5,
          textAlign: 'center',
          color: CORES.marinho,
          transform: `scale(${escala})`,
        }}
      >
        {pergunta.slice(0, i)}
        <span style={{ color: CORES.royal }}>{destaque}</span>
        {pergunta.slice(i + destaque.length)}
      </div>
      <Cenario style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={480} cy={790} rx={260} ry={16} fill={CORES.royalClaro} />
        <rect x={360} y={670} width={240} height={120} rx={14} fill="#BFD0EC" />
        <Personagem
          pose="celularSentado"
          objeto="celular"
          expressao={olhou ? 'neutro' : 'triste'}
          cabecaBaixa={!olhou}
          x={470}
          y={794}
          escala={1}
        />
      </Cenario>
    </Palco>
  );
};
