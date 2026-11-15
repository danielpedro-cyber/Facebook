import React, { useEffect, useState } from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import { VIDEO, s } from './constantes';
import { VideoBussola } from './Video';

/** Garante que as fontes estejam carregadas antes de capturar os quadros. */
const ComFonte: React.FC = () => {
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
  return <VideoBussola />;
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Bussola"
    component={ComFonte}
    durationInFrames={s(VIDEO.duracaoSeg)}
    fps={VIDEO.fps}
    width={VIDEO.largura}
    height={VIDEO.altura}
  />
);
