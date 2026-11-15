import React from 'react';
import {Composition} from 'remotion';
import {HISTORIAS} from './historias';
import {ESTILOS} from './estilos';
import {Elenco} from './motor/Elenco';

export const RemotionRoot: React.FC = () => (
  <>
    {HISTORIAS.map((h) => {
      const e = ESTILOS[h.estilo ?? 'cuento'];
      if (!e) throw new Error(`La historia "${h.id}" usa un estilo que no existe: ${h.estilo}`);
      return (
        <Composition key={h.id} id={`${e.prefijo}-${h.id}`} component={e.comp} fps={30} width={1080} height={1920} durationInFrames={e.frames(h)} defaultProps={{historia: h}} />
      );
    })}
    {/* the cast line-up, for checking characters */}
    <Composition id="Elenco" component={Elenco} fps={30} width={1080} height={1920} durationInFrames={60} />
  </>
);
