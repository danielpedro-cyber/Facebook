import React, { useEffect, useState } from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import { VIDEO, s } from './constantes';
import { VideoBussola } from './Video';
import { VideoBussola2 } from './ep2/Video2';
import { DURACAO2 } from './ep2/constantes';
import { VideoBussola3 } from './ep3/Video3';
import { DURACAO3 } from './ep3/constantes';
import { VideoBussola4 } from './ep4/Video4';
import { DURACAO4 } from './ep4/constantes';

/** Garante que as fontes estejam carregadas antes de capturar os quadros. */
const ComFonte: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Carregando fontes'));
  useEffect(() => {
    const pesos = ['400', '500', '600', '700', '800'];
    Promise.all(
      pesos.flatMap((w) => [
        document.fonts.load(`${w} 64px "Urbanist Variable"`),
        document.fonts.load(`${w} 64px "Inter Variable"`),
      ]),
    )
      .then(() => document.fonts.ready)
      .finally(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};

const Episodio1: React.FC = () => (
  <ComFonte>
    <VideoBussola />
  </ComFonte>
);

const Episodio2: React.FC = () => (
  <ComFonte>
    <VideoBussola2 />
  </ComFonte>
);

const Episodio3: React.FC = () => (
  <ComFonte>
    <VideoBussola3 />
  </ComFonte>
);

const Episodio4: React.FC = () => (
  <ComFonte>
    <VideoBussola4 />
  </ComFonte>
);

export const RemotionRoot: React.FC = () => (
  <>
    {/* Bússola #1 — versão escolhida por REMOTION_VERSAO (src/versoes.ts) */}
    <Composition id="Bussola" component={Episodio1} durationInFrames={s(VIDEO.duracaoSeg)} fps={VIDEO.fps} width={VIDEO.largura} height={VIDEO.altura} />
    {/* Bússola #2 — 3 erros de quem começa */}
    <Composition id="Bussola2" component={Episodio2} durationInFrames={s(DURACAO2)} fps={VIDEO.fps} width={VIDEO.largura} height={VIDEO.altura} />
    {/* Bússola #3 — Do contato à venda */}
    <Composition id="Bussola3" component={Episodio3} durationInFrames={s(DURACAO3)} fps={VIDEO.fps} width={VIDEO.largura} height={VIDEO.altura} />
    {/* Bússola #4 — Um dia de cada caminho */}
    <Composition id="Bussola4" component={Episodio4} durationInFrames={s(DURACAO4)} fps={VIDEO.fps} width={VIDEO.largura} height={VIDEO.altura} />
  </>
);
