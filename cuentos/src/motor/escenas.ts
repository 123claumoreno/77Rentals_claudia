/* The scene library. Each story is a list of these scenes, in any order.
   min  = shortest the scene may last (frames, 30 fps), because its animation needs that long
   lead = frames before the story card appears (the balcony waits for its door to open) */
import React from 'react';
import {S1Door, S2Arrival, S3Delventto, S4Balcony, S5Pool, S6Sunset, S7Night, S8Close} from '../cuento/Scenes';

export type EscenaId = 'puerta' | 'llegada' | 'edificio' | 'balcon' | 'piscina' | 'atardecer' | 'noche' | 'cierre';

export const ESCENAS: Record<EscenaId, {comp: React.FC; min: number; lead: number; que: string; sonido?: 'mar' | 'chapuzon' | 'noche'}> = {
  puerta: {comp: S1Door, min: 150, lead: 22, que: 'A storybook door with a golden glow; the family peeks in. Good opening.'},
  llegada: {comp: S2Arrival, min: 210, lead: 24, que: 'A plane flies over the Caribbean and the family arrives by taxi with suitcases.'},
  edificio: {comp: S3Delventto, min: 190, lead: 24, que: 'The Delventto tower in Santa Marta, palms, the family walking in. (This scene is the Delventto building.)'},
  balcon: {comp: S4Balcony, min: 280, lead: 72, que: 'Mom opens the balcony door; breeze, sea and sky. Plays the sea sound.', sonido: 'mar'},
  piscina: {comp: S5Pool, min: 215, lead: 24, que: 'Pool afternoon: the kids jump in, splash. (With a toddler in the cast it becomes a calm splash.)', sonido: 'chapuzon'},
  atardecer: {comp: S6Sunset, min: 180, lead: 24, que: 'Purple sky at sunset from the rooftop; nobody wants to go down.'},
  noche: {comp: S7Night, min: 190, lead: 24, que: 'The family sleeping well at night, stars. Plays soft night sounds.', sonido: 'noche'},
  cierre: {comp: S8Close, min: 210, lead: 34, que: 'Closing card: the title from the cast, logo, 77rentals.com, WhatsApp, "Claudia · tu anfitriona".'},
};
