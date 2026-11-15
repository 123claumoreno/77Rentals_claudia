/* Example: a personalised guest welcome (short). Change the names, kids, dog and date.
   kids: LOOKS.girl / LOOKS.boy, s = size (0.85 small … 1 normal). toddler: true adds a little one. */
import {LOOKS} from '../story/kit';
import type {Historia} from './tipos';

export const bienvenida: Historia = {
  id: 'bienvenida',
  reparto: {
    kids: [{look: LOOKS.boy, s: 0.9}],
    dog: false,
    title: '¡Bienvenidos, familia Pérez!',
    checkin: 'Check-in · 20 de diciembre',
    puerta: '717', // number on the door ('' = no number)
  },
  escenas: [
    {escena: 'puerta', texto: 'Dicen que hoy, detrás de esta puerta, alguien especial va a llegar.'},
    {escena: 'llegada', texto: 'Viene la familia Pérez, con muchas ganas de mar.'},
    {escena: 'balcon', texto: 'El balcón ya está abierto, y la brisa los está esperando.'},
    {escena: 'piscina', texto: 'Y la piscina también.'},
    {escena: 'cierre', texto: '¡Bienvenidos! Los esperamos.'},
  ],
};
