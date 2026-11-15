import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { AUDIO, CENAS, CORES, LEGENDAS, NomeCena, VIDEO, s } from './constantes';
import { Transicao } from './componentes/Transicao';
import { TrilhaSonora } from './componentes/TrilhaSonora';
import { EFEITOS } from './efeitos';
import { CenaPromessa } from './cenas/CenaPromessa';
import { Legendas } from './componentes/Legendas';
import { Fundo } from './componentes/Base';
import { EtiquetaParada, Rota } from './componentes/Rota';
import { Cena1Gancho } from './cenas/Cena1Gancho';
import { Cena2MercadoQuente } from './cenas/Cena2MercadoQuente';
import { Cena3Baixa } from './cenas/Cena3Baixa';
import { Cena4Virada } from './cenas/Cena4Virada';
import { Cena5Canais } from './cenas/Cena5Canais';
import { Cena6Gestao } from './cenas/Cena6Gestao';
import { Cena7Escolha } from './cenas/Cena7Escolha';
import { Cena8Liberdade } from './cenas/Cena8Liberdade';
import { Cena9Fechamento } from './cenas/Cena9Fechamento';

const COMPONENTES: Record<NomeCena, React.FC> = {
  gancho: Cena1Gancho,
  promessa: CenaPromessa,
  mercadoQuente: Cena2MercadoQuente,
  baixa: Cena3Baixa,
  virada: Cena4Virada,
  canais: Cena5Canais,
  gestao: Cena6Gestao,
  escolha: Cena7Escolha,
  liberdade: Cena8Liberdade,
  fechamento: Cena9Fechamento,
};

export const VideoBussola: React.FC = () => {
  const nomes = Object.keys(CENAS) as NomeCena[];
  return (
    <AbsoluteFill style={{ backgroundColor: CORES.fundo }}>
      <Fundo />
      {nomes.map((nome, i) => {
        const { inicio, fim } = CENAS[nome];
        const Cena = COMPONENTES[nome];
        return (
          <Sequence key={nome} name={nome} from={s(inicio)} durationInFrames={s(fim - inicio)}>
            <Transicao primeira={i === 0} ultima={i === nomes.length - 1}>
              <Cena />
            </Transicao>
          </Sequence>
        );
      })}
      <Rota />
      <EtiquetaParada />
      <Legendas />
      <TrilhaSonora narracao={AUDIO.narracao} trilha={AUDIO.trilha} legendas={LEGENDAS} efeitos={EFEITOS} duracaoSeg={VIDEO.duracaoSeg} />
    </AbsoluteFill>
  );
};
