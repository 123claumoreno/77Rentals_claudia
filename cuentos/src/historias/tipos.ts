import type {Cast} from '../cuento/people';

/** A story = which style draws it + who is in it + a list of scenes, each with one short line (Spanish). */
export type Historia = {
  /** short id without spaces, used for the video name (Cuento-<id>, or the style's own prefix) */
  id: string;
  /** which style draws it: 'cuento' (default) or another style registered in src/estilos/index.ts */
  estilo?: string;
  /** the family / guests (Estilo Cuento). Scenes read this: kids, dog, toddler, closing title, check-in line */
  reparto?: Cast;
  /** escena = a scene id from the style's library. texto = what shows on screen.
      dicho = optional: how the narrator should say it, when it differs (numbers in words, no brand). */
  escenas: {escena: string; texto: string; dicho?: string}[];
  /** soft background music (public/music.mp3). Default: on */
  musica?: boolean;
  /** sea / splash / night sounds in their scenes. Default: on */
  sonidos?: boolean;
  /** narrator voice, once the story has been narrated with scripts/voz.mjs. Default: on */
  voz?: boolean;
};
