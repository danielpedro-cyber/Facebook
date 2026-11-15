import React from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AUDIO, CENAS, CORES, LEGENDAS, NomeCena, TRANSICAO_CENA, VIDEO, s } from './constantes';
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

/**
 * Transição entre cenas: a nova cena entra deslizando da direita e a anterior sai
 * para a esquerda (a "câmera" segue a estrada), com um zoom lento durante a cena.
 */
const Transicao: React.FC<{ children: React.ReactNode; primeira: boolean; ultima: boolean }> = ({
  children,
  primeira,
  ultima,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = s(TRANSICAO_CENA);
  const op = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
  const entra = primeira ? 1 : interpolate(frame, [0, t], [0, 1], { ...op, easing: Easing.out(Easing.cubic) });
  const sai = ultima ? 0 : interpolate(frame, [durationInFrames - t, durationInFrames], [0, 1], { ...op, easing: Easing.in(Easing.cubic) });
  const x = (1 - entra) * 110 - sai * 110;
  const zoom = 1 + 0.03 * (frame / durationInFrames);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entra, 1 - sai),
        transform: `translateX(${x}px) scale(${zoom})`,
        transformOrigin: '50% 50%',
        filter: entra < 1 || sai > 0 ? `blur(${Math.max(1 - entra, sai) * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** 0 → 1 conforme a narração está falando (com rampas suaves) — usado no ducking da trilha. */
const vozAtiva = (tSeg: number) => {
  let v = 0;
  for (const l of LEGENDAS) {
    const sobe = (tSeg - (l.inicio - 0.3)) / 0.3;
    const desce = (l.fim + 0.45 - tSeg) / 0.3;
    v = Math.max(v, Math.min(1, Math.max(0, Math.min(sobe, desce))));
  }
  return v;
};

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === arquivo);


/** Narração + trilha. Se um arquivo não existir em /public, ele é ignorado. */
const TrilhaSonora: React.FC = () => {
  const temNarracao = existe(AUDIO.narracao);
  const temTrilha = existe(AUDIO.trilha);
  const total = s(VIDEO.duracaoSeg);
  const fade = s(AUDIO.fadeTrilhaSeg);
  const { fps } = useVideoConfig();
  const base = (f: number) =>
    temNarracao
      ? AUDIO.volumeTrilhaEntreFrases - (AUDIO.volumeTrilhaEntreFrases - AUDIO.volumeTrilhaComNarracao) * vozAtiva(f / fps)
      : AUDIO.volumeTrilhaSemNarracao;
  return (
    <>
      {temNarracao && <Audio src={staticFile(AUDIO.narracao)} volume={AUDIO.volumeNarracao} />}
      {temTrilha && (
        <Audio
          src={staticFile(AUDIO.trilha)}
          loop
          volume={(f) =>
            base(f) *
            interpolate(f, [0, fade, total - fade, total], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
      {EFEITOS.filter((e) => existe(`sfx/${e.arquivo}.mp3`)).map((e, i) => (
        <Sequence key={i} from={Math.max(0, s(e.em))} durationInFrames={s(2.5)} layout="none">
          <Audio src={staticFile(`sfx/${e.arquivo}.mp3`)} volume={(e.volume ?? 0.5) * AUDIO.volumeEfeitos * 1.4} />
        </Sequence>
      ))}
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
