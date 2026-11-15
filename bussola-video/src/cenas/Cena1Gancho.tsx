import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CORES, FONTE, TEXTOS, momento, s } from '../constantes';
import { Cenario, Estrada, Logo, Palco } from '../componentes/Base';
import { Personagem, useTrocaPose } from '../componentes/Personagem';
import { useCrescer, useEntrada } from '../componentes/animacoes';

// CENA 1 — gancho (0 a 8 s).
// 1) Pergunta: "Você sabia que a maioria dos vendedores desiste no mesmo ponto da carreira?"
// 2) Resposta: "E tudo começa do mesmo jeito..." — o consultor entra andando na estrada.
const PERGUNTA = momento('gancho', 'sabia');
const DESTAQUE = momento('gancho', 'mesmoPonto');
const RESPOSTA = momento('gancho', 'gancho');
const CHEGA = RESPOSTA + 1.9; // s em que o personagem para

const Palavra: React.FC<{ texto: string; atraso: number; destaque?: boolean }> = ({ texto, atraso, destaque }) => (
  <span
    style={{
      display: 'inline-block',
      marginRight: '0.24em',
      color: destaque ? CORES.royal : undefined,
      ...useEntrada(atraso, 50),
    }}
  >
    {texto}
  </span>
);

const estiloTexto: React.CSSProperties = {
  fontFamily: FONTE.titulo,
  fontWeight: 600,
  lineHeight: 1.06,
  letterSpacing: -1.5,
  textAlign: 'center',
  color: CORES.marinho,
  maxWidth: 940,
};

export const Cena1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useCrescer(0.1);

  // pergunta: palavras entram junto com a fala; o trecho-chave fica em azul
  const { pergunta, destaque, resposta } = TEXTOS.gancho;
  const iDestaque = pergunta.indexOf(destaque);
  const antes = pergunta.slice(0, iDestaque).trim().split(' ');
  const meio = destaque.split(' ');
  const depois = pergunta.slice(iDestaque + destaque.length).trim().split(' ').filter(Boolean);
  const passoAntes = Math.max(0.08, (DESTAQUE - PERGUNTA) / antes.length);

  // troca pergunta → resposta
  const saiPergunta = interpolate(frame, [s(RESPOSTA - 0.25), s(RESPOSTA + 0.15)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const entraResposta = useEntrada(RESPOSTA, 60);

  // personagem entra na estrada quando "tudo começa"
  const x = interpolate(frame, [s(RESPOSTA), s(CHEGA)], [-140, 470], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const troca = useTrocaPose(CHEGA, 0.4);
  const andando = frame < s(CHEGA);

  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <div style={logo}>
        <Logo altura={120} />
      </div>
      <div style={{ position: 'relative', width: 960, height: 400, marginTop: 30 }}>
        {saiPergunta > 0 && (
          <div
            style={{
              ...estiloTexto,
              fontSize: 78,
              position: 'absolute',
              inset: 0,
              opacity: saiPergunta,
              transform: `translateY(${(1 - saiPergunta) * -30}px)`,
            }}
          >
            {antes.map((p, i) => (
              <Palavra key={`a${i}`} texto={p} atraso={PERGUNTA + i * passoAntes} />
            ))}
            {meio.map((p, i) => (
              <Palavra key={`m${i}`} texto={p} atraso={DESTAQUE + i * 0.14} destaque />
            ))}
            {depois.map((p, i) => (
              <Palavra key={`d${i}`} texto={p} atraso={DESTAQUE + (meio.length + i) * 0.14} />
            ))}
          </div>
        )}
        <div style={{ ...estiloTexto, fontSize: FONTE.tamTitulo, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...entraResposta }}>
          {resposta}
        </div>
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
