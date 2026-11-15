import React from 'react';
import { AbsoluteFill, Audio, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AUDIO, CENAS, CORES, NomeCena, TRANSICAO_CENA, VIDEO, s } from './constantes';
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
  mercadoQuente: Cena2MercadoQuente,
  baixa: Cena3Baixa,
  virada: Cena4Virada,
  canais: Cena5Canais,
  gestao: Cena6Gestao,
  escolha: Cena7Escolha,
  liberdade: Cena8Liberdade,
  fechamento: Cena9Fechamento,
};

/** Fade suave na entrada e na saída de cada cena. */
const Transicao: React.FC<{ children: React.ReactNode; primeira: boolean; ultima: boolean }> = ({
  children,
  primeira,
  ultima,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = s(TRANSICAO_CENA);
  const entra = primeira ? 1 : interpolate(frame, [0, t], [0, 1], { extrapolateRight: 'clamp' });
  const sai = ultima ? 1 : interpolate(frame, [durationInFrames - t, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  return <AbsoluteFill style={{ opacity: Math.min(entra, sai) }}>{children}</AbsoluteFill>;
};

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === arquivo);

/** Narração + trilha. Se um arquivo não existir em /public, ele é ignorado. */
const TrilhaSonora: React.FC = () => {
  const temNarracao = existe(AUDIO.narracao);
  const temTrilha = existe(AUDIO.trilha);
  const total = s(VIDEO.duracaoSeg);
  const fade = s(AUDIO.fadeTrilhaSeg);
  const base = temNarracao ? AUDIO.volumeTrilhaComNarracao : AUDIO.volumeTrilhaSemNarracao;
  return (
    <>
      {temNarracao && <Audio src={staticFile(AUDIO.narracao)} volume={AUDIO.volumeNarracao} />}
      {temTrilha && (
        <Audio
          src={staticFile(AUDIO.trilha)}
          loop
          volume={(f) =>
            base *
            interpolate(f, [0, fade, total - fade, total], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
    </>
  );
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
      <TrilhaSonora />
    </AbsoluteFill>
  );
};
