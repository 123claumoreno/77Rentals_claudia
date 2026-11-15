/* The scene library. Each story is a list of these scenes, in any order.
   min  = shortest the scene may last (frames, 30 fps), because its animation needs that long
   lead = frames before the story card appears (the balcony waits for its door to open) */
import React from 'react';
import {SApagar, SAvion, SBasura, SBeneficios, SCheckout, SCierre, SCiudades, SGracias, SHola, SLlave, SOpinion} from '../surf/Escenas';
import {S1Door, S2Arrival, S3Delventto, S4Balcony, S5Pool, S6Sunset, S7Night, S8Close} from '../cuento/Scenes';

export type EscenaId = 'puerta' | 'llegada' | 'edificio' | 'balcon' | 'piscina' | 'atardecer' | 'noche' | 'cierre'
  | 'hola1204' | 'checkout' | 'apagar' | 'basura' | 'llave' | 'opinion' | 'gracias1204' | 'beneficios' | 'ciudades' | 'avion' | 'cierre1204';

export const ESCENAS: Record<EscenaId, {comp: React.FC; min: number; lead: number; que: string; sonido?: 'mar' | 'chapuzon' | 'noche'}> = {
  puerta: {comp: S1Door, min: 150, lead: 22, que: 'A storybook door with a golden glow; the family peeks in. Good opening.'},
  llegada: {comp: S2Arrival, min: 210, lead: 24, que: 'A plane flies over the Caribbean and the family arrives by taxi with suitcases.'},
  edificio: {comp: S3Delventto, min: 190, lead: 24, que: 'The Delventto tower in Santa Marta, palms, the family walking in. (This scene is the Delventto building.)'},
  balcon: {comp: S4Balcony, min: 280, lead: 72, que: 'Mom opens the balcony door; breeze, sea and sky. Plays the sea sound.', sonido: 'mar'},
  piscina: {comp: S5Pool, min: 215, lead: 24, que: 'Pool afternoon: the kids jump in, splash. (With a toddler in the cast it becomes a calm splash.)', sonido: 'chapuzon'},
  atardecer: {comp: S6Sunset, min: 180, lead: 24, que: 'Purple sky at sunset from the rooftop; nobody wants to go down.'},
  noche: {comp: S7Night, min: 190, lead: 24, que: 'The family sleeping well at night, stars. Plays soft night sounds.', sonido: 'noche'},
  cierre: {comp: S8Close, min: 210, lead: 34, que: 'Closing card: the title from the cast, logo, 77rentals.com, WhatsApp, "Claudia · tu anfitriona".'},
  // surf story for apartment 1204 (src/surf/)
  hola1204: {comp: SHola, min: 110, lead: 0, que: 'Surf bedroom with two double beds and the balcony: the family walks in and waves hello.'},
  checkout: {comp: SCheckout, min: 130, lead: 8, que: 'Surf bedroom: clock at twelve, the Apartamento 1204 sign, suitcases, thumbs up.'},
  apagar: {comp: SApagar, min: 150, lead: 8, que: 'Living room: switch, AC and TV turn off.'},
  basura: {comp: SBasura, min: 150, lead: 8, que: 'Hallway: the bag goes down the chute next to the elevator.'},
  llave: {comp: SLlave, min: 150, lead: 8, que: 'The key goes into the small lockbox by the door.'},
  opinion: {comp: SOpinion, min: 130, lead: 8, que: 'Lobby: Camilo on the phone and five stars appear one by one.'},
  gracias1204: {comp: SGracias, min: 110, lead: 8, que: 'Terrace with pool and sea: everyone waves goodbye, heads turning.'},
  beneficios: {comp: SBeneficios, min: 110, lead: 8, que: 'Frequent guest card with the logo and a gold ribbon.'},
  ciudades: {comp: SCiudades, min: 130, lead: 8, que: 'City by the sea with the four city tags.'},
  avion: {comp: SAvion, min: 120, lead: 8, que: 'The plane to Bogotá with the family at the windows.'},
  cierre1204: {comp: SCierre, min: 200, lead: 10, que: 'Closing: title, logo, contacts and the booking platforms.'},
};
