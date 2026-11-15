/* Every video style the kit knows. A story picks one with `estilo: '<key>'` (default 'cuento').
   prefijo = the start of the video name, e.g. Cuento-bienvenida.
   To add Claudia's own style: copy src/estilos/plantilla/, then add one line here. */
import type React from 'react';
import type {Historia} from '../historias/tipos';
import {Cuento, totalFrames} from '../motor/Cuento';
import {Plantilla, framesPlantilla} from './plantilla/Plantilla';

export type Estilo = {prefijo: string; comp: React.FC<{historia: Historia}>; frames: (h: Historia) => number};

export const ESTILOS: Record<string, Estilo> = {
  cuento: {prefijo: 'Cuento', comp: Cuento, frames: totalFrames},
  plantilla: {prefijo: 'Plantilla', comp: Plantilla, frames: framesPlantilla},
};
