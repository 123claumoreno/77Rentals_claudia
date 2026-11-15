/* "Hasta pronto, Camilo y familia": farewell for the family that stayed in apartment 1204 (surf style).
   Same script as the first farewell video, adapted: one short line per scene. */
import {LOOKS} from '../story/kit';
import type {Historia} from './tipos';

export const camilo1204: Historia = {
  id: 'camilo-1204',
  transicion: 'ola',
  ritmo: {palabra: 0.27, base: 1.0, cola: 10, colaVoz: 0.35},
  reparto: {kids: [{look: LOOKS.boy, s: 0.9}], dog: false, toddler: true, title: '¡Hasta pronto, Camilo y familia!', puerta: '1204'},
  primerCuadroLleno: true,
  musica: true,
  sonidos: false,
  voz: true,
  escenas: [
    {escena: 'hola1204', texto: '¡Hola, Camilo y familia! Esperamos que hayan disfrutado muchísimo.'},
    {escena: 'checkout', texto: 'Hoy toca el check-out: salida máxima a las 12 del mediodía.', dicho: 'Hoy toca el chek aut: salida máxima a las doce del mediodía.'},
    {escena: 'apagar', texto: 'Antes de salir: luces, aires y electrodomésticos apagados.'},
    {escena: 'basura', texto: 'La basura va al chute de basuras del edificio.'},
    {escena: 'llave', texto: 'Y la llave se guarda en la cajita de seguridad.'},
    {escena: 'opinion', texto: 'Cuéntennos cómo fue su experiencia reservando y hospedándose con nosotros.'},
    {escena: 'gracias1204', texto: '¡Gracias por elegirnos! Fue un placer recibirlos.'},
    {escena: 'beneficios', texto: 'Beneficios especiales para quienes vuelven y reservan directo.'},
    {escena: 'ciudades', texto: 'Cartagena, Barranquilla, Santa Marta y Bogotá los esperan.'},
    {escena: 'avion', texto: 'Hoy regresan a Bogotá. ¡Buen viaje, Camilo y familia!'},
    {escena: 'cierre1204', texto: 'En 77Rentals no despedimos huéspedes, ¡damos la bienvenida a futuras experiencias!', dicho: 'No despedimos huéspedes: ¡damos la bienvenida a futuras experiencias! Escríbenos por WhatsApp.'},
  ],
};
