import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CORES, s } from '../../constantes';
import { Cenario, Palco, SeloIcone } from '../../componentes/Base';
import { IconeAmigos, IconeFamilia, IconeMaleta } from '../../componentes/Icones';
import { Personagem } from '../../componentes/Personagem';
import { useCrescer } from '../../componentes/animacoes';
import { TEXTOS2, momento2 } from '../constantes';
import { CabecalhoErro, CartaoCorrecao } from '../Partes';

// ERRO 1 — depender só da lista de amigos.
// Os contatos aparecem, vão "acabando" um a um, e no fim surgem contatos novos (azuis, com +).
const POS = [
  { x: 130, y: 110, Icone: IconeFamilia },
  { x: 140, y: 290, Icone: IconeAmigos },
  { x: 830, y: 110, Icone: IconeMaleta },
  { x: 820, y: 290, Icone: IconeAmigos },
];
export const E1 = {
  aparece: () => momento2('erro1', 'e1n'),
  acaba: () => momento2('erro1', 'e1a'),
  novos: () => momento2('erro1', 'e1f'),
};

const Contato: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { x, y, Icone } = POS[i];
  const entra = useCrescer(E1.aparece() + i * 0.25);
  const tAcaba = E1.acaba() + i * 0.45;
  const some = interpolate(frame, [s(tAcaba), s(tAcaba + 0.4)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const novo = useCrescer(E1.novos() + 0.3 + i * 0.2);
  const ehNovo = frame >= s(E1.novos() + 0.3 + i * 0.2);
  const estilo: React.CSSProperties = ehNovo
    ? { ...novo, border: `5px solid ${CORES.royal}`, background: CORES.branco }
    : { opacity: (entra.opacity as number) * (1 - 0.75 * some), transform: `${entra.transform} scale(${1 - 0.35 * some})`, border: `5px solid ${some > 0.5 ? CORES.trilho : CORES.azulProfundo}`, background: CORES.branco };
  return (
    <div style={{ position: 'absolute', left: x - 60, top: y - 60 }}>
      <SeloIcone tamanho={120} style={estilo}>
        <Icone tamanho={70} cor={ehNovo ? CORES.royal : some > 0.5 ? CORES.cinza : CORES.azulProfundo} />
      </SeloIcone>
      {ehNovo && (
        <div style={{ position: 'absolute', right: -6, top: -6, width: 44, height: 44, borderRadius: 999, background: CORES.royal, color: CORES.branco, fontSize: 36, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', ...novo }}>
          +
        </div>
      )}
    </div>
  );
};

export const Erro1: React.FC = () => {
  const frame = useCurrentFrame();
  const triste = frame >= s(E1.acaba() + 1.0) && frame < s(E1.novos());
  return (
    <Palco style={{ justifyContent: 'flex-start' }}>
      <CabecalhoErro numero={1} titulo={TEXTOS2.erros[0].titulo} atrasoTitulo={momento2('erro1', 'e1n')} />
      <div style={{ position: 'absolute', top: 250, left: 0, width: 960, height: 400 }}>
        <Cenario altura={400} style={{ position: 'absolute', inset: 0 }}>
          <ellipse cx={480} cy={392} rx={110} ry={13} fill={CORES.royalClaro} />
          <Personagem pose="celular" objeto="celular" vibrando={!triste && frame < s(E1.acaba())} expressao={triste ? 'triste' : 'feliz'} cabecaBaixa={triste} x={470} y={390} escala={0.85} />
        </Cenario>
        {POS.map((_, i) => (
          <Contato key={i} i={i} />
        ))}
      </div>
      <CartaoCorrecao texto={TEXTOS2.erros[0].correcao} atraso={E1.novos()} />
    </Palco>
  );
};
