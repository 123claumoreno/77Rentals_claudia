/* Shared voice helpers for every style. A story gets a voice after running
   `node scripts/voz.mjs narrar <id> --si`: that writes public/voz/<id>/s<N>.mp3 and src/voz/<id>.json.
   A line only uses its voice while its on-screen text still matches what was narrated, so an edited
   line falls back to reading pace until it is narrated again. */
import React from 'react';
import {Audio, staticFile} from 'remotion';
import {VOCES} from '../voz';

export type Palabra = {w: string; s: number; e: number};
export type LineaVoz = {texto: string; dicho: string; vozId: string; dur: number; palabras: Palabra[]};

/** frames between the card appearing and the voice starting */
export const VOZ_INICIO = 6;

export const vozDe = (h: {id: string; voz?: boolean}, i: number, texto: string): LineaVoz | undefined => {
  if (h.voz === false) return undefined;
  const l = VOCES[h.id]?.[i];
  return l && l.texto === texto ? l : undefined;
};

export const tieneVoz = (h: {id: string; voz?: boolean; escenas: {texto: string}[]}) => h.escenas.some((e, i) => vozDe(h, i, e.texto));

/** seconds after the voice starts when on-screen word i (of n) should light up */
export const momentoPalabra = (l: LineaVoz, i: number, n: number) => (l.palabras.length === n ? l.palabras[i].s : (i / n) * l.dur * 0.92);

export const Narracion: React.FC<{id: string; i: number}> = ({id, i}) => <Audio src={staticFile(`voz/${id}/s${i + 1}.mp3`)} />;
