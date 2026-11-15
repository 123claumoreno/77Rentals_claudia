/* Example: the original Macondo story (family of four + golden dog). */
import {LOOKS} from '../story/kit';
import type {Historia} from './tipos';

export const macondo: Historia = {
  id: 'macondo',
  reparto: {kids: [{look: LOOKS.girl, s: 1}, {look: LOOKS.boy, s: 1}], dog: true, title: 'Macondo en Delventto'},
  escenas: [
    {escena: 'puerta', texto: 'Dicen que detrás de esta puerta… las vacaciones empiezan solas.'},
    {escena: 'llegada', texto: 'La familia llegó un viernes, con un perro que no se quiso quedar.'},
    {escena: 'edificio', texto: 'Diez minutos después, ya estaban en el Edificio Delventto.'},
    {escena: 'balcon', texto: 'Mamá abrió el balcón, y la brisa del mar entró a saludar.'},
    {escena: 'piscina', texto: 'La tarde entera se les fue en la piscina, entre chapuzones y risas.'},
    {escena: 'atardecer', texto: 'Y cuando el cielo se puso morado, nadie quiso bajar.'},
    {escena: 'noche', texto: 'Esa noche durmieron como hacía tiempo no dormían.'},
    {escena: 'cierre', texto: 'Tu viaje empieza con 77Rentals.', dicho: 'Tu viaje empieza aquí.'},
  ],
};
