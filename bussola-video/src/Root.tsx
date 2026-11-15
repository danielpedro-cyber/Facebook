import React, { useEffect, useState } from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import { VIDEO, s } from './constantes';
import { VideoBussola } from './Video';

/** Garante que a Montserrat esteja carregada antes de capturar os quadros. */
const ComFonte: React.FC = () => {
  const [handle] = useState(() => delayRender('Carregando Montserrat'));
  useEffect(() => {
    Promise.all(['600', '700', '800', '900'].map((w) => document.fonts.load(`${w} 64px "Montserrat Variable"`)))
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
