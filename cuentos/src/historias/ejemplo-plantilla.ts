/* Example for the plain PLANTILLA style (the starting point for a new style of your own). */
import type {Historia} from './tipos';

export const ejemploPlantilla: Historia = {
  id: 'ejemplo-plantilla',
  estilo: 'plantilla',
  escenas: [
    {escena: 'portada', texto: 'Un fin de semana en Santa Marta'},
    {escena: 'frase', texto: 'Llegas, abres la ventana, y el viaje empieza solo.'},
    {escena: 'cierre', texto: 'Te esperamos.'},
  ],
};
