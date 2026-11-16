/* "Hasta pronto, Camilo y familia": farewell for the family that stayed in apartment 1204 (surf style).
   Same script as the first farewell video, adapted: one short line per scene. */
import {LOOKS} from '../story/kit';
import type {Historia} from './tipos';

export const camilo1204: Historia = {
  id: 'camilo-1204',
  transicion: 'ola',
  ritmo: {palabra: 0.27, base: 1.0, cola: 14, colaVoz: 0.7},
  reparto: {kids: [{look: LOOKS.boy, s: 0.9}], dog: false, toddler: true, title: '¡Hasta pronto, Camilo y familia!', puerta: '1204'},
  primerCuadroLleno: true,
  musica: true,
  sonidos: false,
  voz: true,
  escenas: [
    {escena: 'inicio1204', texto: '¡Hola, Camilo y familia! Hoy es el check-out: salida máxima, 12 del mediodía.', dicho: '¡Hola, Camilo y familia! Hoy es el chek aut: salida máxima, doce del mediodía.'},
    {escena: 'apagar', texto: 'Antes de tu check-out, aquí algunas recomendaciones: luces, aires y electrodomésticos apagados.', dicho: 'Antes de tu chek aut, aquí algunas recomendaciones: luces, aires y electrodomésticos apagados.'},
    {escena: 'pasillo1204', texto: 'La basura va al chute, y la llave a la cajita de seguridad.'},
    {escena: 'terraza1204', texto: 'Cuéntennos cómo fue su experiencia reservando y hospedándose con nosotros. ¡Gracias por elegirnos!'},
    {escena: 'benciu1204', texto: 'Beneficios para quienes vuelven y reservan directo. Cartagena, Barranquilla, Santa Marta y Bogotá los esperan.'},
    {escena: 'avion', texto: 'Hoy regresan a Bogotá. ¡Buen viaje, Camilo y familia!'},
    {escena: 'cierre1204', texto: 'En 77Rentals no despedimos huéspedes, ¡damos la bienvenida a futuras experiencias!', dicho: 'No despedimos huéspedes: ¡damos la bienvenida a futuras experiencias! Escríbenos por WhatsApp.'},
  ],
};
