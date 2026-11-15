/* The "Estilo Cuento" engine: plays a story's scenes with butterfly wipes between them, and shows
   each line as a hand-lettered storybook card. Without a voice the words light up at reading pace;
   once the story is narrated (scripts/voz.mjs) each scene lasts as long as its line and the words
   light up as the narrator says them. Soft music (public/music.mp3) and scene sounds are optional. */
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Filters, P, Paper, hand} from '../story/kit';
import {FlyWipe} from '../story/Scenes';
import {OlaWipe} from '../surf/Ola';
import {CastCtx} from '../cuento/people';
import {ROOM_AT, SPLASH_AT} from '../cuento/Scenes';
import {ESCENAS, type EscenaId} from './escenas';
import {Narracion, VOZ_INICIO, momentoPalabra, tieneVoz, vozDe, type LineaVoz} from './voz';
import {CUENTO_CAST} from '../cuento/people';
import type {Historia} from '../historias/tipos';

export const FPS = 30;
const WIPE = 36;
const TAIL = 26;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Seconds a line needs on screen to be read comfortably (words light up at this pace). */
const PER_WORD = 0.36;
const readSeconds = (texto: string, r?: Historia['ritmo']) => (r ? r.base : 1.8) + texto.split(/\s+/).filter(Boolean).length * (r ? r.palabra : PER_WORD);

export const timeline = (h: Historia) => {
  let at = 0;
  return h.escenas.map((e, i) => {
    const def = ESCENAS[e.escena as EscenaId];
    if (!def) throw new Error(`Escena desconocida en "${h.id}": ${e.escena}`);
    const voz = vozDe(h, i, e.texto);
    const secs = voz ? VOZ_INICIO / FPS + voz.dur + 0.7 : readSeconds(e.texto, h.ritmo);
    const dur = Math.max(def.min, def.lead + Math.ceil(secs * FPS) + (h.ritmo ? h.ritmo.cola : TAIL));
    const s = {from: at, dur, lead: def.lead, voz, i, ...e};
    at += dur;
    return s;
  });
};
export const totalFrames = (h: Historia) => timeline(h).reduce((a, s) => a + s.dur, 0);

/* the story line as a storybook card; words light up one after another */
const Tarjeta: React.FC<{texto: string; dur: number; voz?: LineaVoz; llena?: boolean}> = ({texto, dur, voz, llena}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const pop = llena ? 1 : interpolate(f, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const words = texto.split(/\s+/).filter(Boolean);
  return (
    <div style={{position: 'absolute', top: 170, left: 70, right: 70, display: 'flex', justifyContent: 'center', opacity: Math.min(1, pop * 1.5) * out}}>
      <div
        style={{
          background: P.white,
          border: `5px solid ${P.ink}`,
          borderRadius: '28px 36px 30px 40px',
          padding: '16px 42px 24px',
          boxShadow: `8px 10px 0 ${P.purple}`,
          transform: `scale(${0.85 + 0.15 * pop}) rotate(-1deg)`,
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 72,
          lineHeight: 1.08,
          color: P.purpleDeep,
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{opacity: t >= (voz ? VOZ_INICIO / FPS + momentoPalabra(voz, i, words.length) : 0.4 + i * PER_WORD) ? 1 : 0.22}}>{w} </span>
        ))}
      </div>
    </div>
  );
};

const Musica: React.FC<{bajita?: boolean}> = ({bajita}) => {
  const {durationInFrames} = useVideoConfig();
  if (!getStaticFiles().some((s) => s.name === 'music.mp3')) return null;
  const v = bajita ? 0.16 : 0.35; // softer under the narrator
  return <Audio src={staticFile('music.mp3')} volume={(f) => interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, v, v, 0], clamp)} />;
};

export const Cuento: React.FC<{historia: Historia}> = ({historia: h}) => {
  const tl = timeline(h);
  return (
    <CastCtx.Provider value={h.reparto ?? CUENTO_CAST}>
      <AbsoluteFill style={{backgroundColor: P.paper}}>
        <Filters />
        {tl.map((s, i) => {
          const Scene = ESCENAS[s.escena as EscenaId].comp;
          return (
            <Sequence key={i} from={s.from} durationInFrames={s.dur}>
              <Scene />
            </Sequence>
          );
        })}
        {tl.slice(1).map((s) => (
          <Sequence key={`w${s.from}`} from={s.from - WIPE / 2} durationInFrames={WIPE}>
            {h.transicion === 'ola' ? <OlaWipe dur={WIPE} /> : <FlyWipe dur={WIPE} />}
          </Sequence>
        ))}
        <Paper />
        {tl.map((s, i) => {
          const dur = s.dur - s.lead - WIPE / 2;
          return s.texto ? (
            <Sequence key={`t${i}`} from={s.from + s.lead} durationInFrames={dur}>
              <Tarjeta texto={s.texto} dur={dur} voz={s.voz} llena={h.primerCuadroLleno && i === 0} />
              {s.voz && (
                <Sequence from={VOZ_INICIO}>
                  <Narracion id={h.id} i={s.i} />
                </Sequence>
              )}
            </Sequence>
          ) : null;
        })}
        {h.sonidos !== false &&
          tl.map((s, i) => {
            const son = ESCENAS[s.escena as EscenaId].sonido;
            if (son === 'mar') {
              const d = s.dur - ROOM_AT + 12;
              return (
                <Sequence key={`s${i}`} from={s.from + ROOM_AT} durationInFrames={d}>
                  <Audio src={staticFile('sfx/ocean.mp3')} volume={(f) => interpolate(f, [0, 60, 100, d - 26, d], [0.04, 0.07, 0.42, 0.42, 0], clamp)} />
                </Sequence>
              );
            }
            if (son === 'chapuzon')
              return (
                <Sequence key={`s${i}`} from={s.from + SPLASH_AT - 2} durationInFrames={90}>
                  <Audio src={staticFile('sfx/splash.mp3')} volume={(f) => interpolate(f, [0, 60, 90], [0.5, 0.5, 0], clamp)} />
                </Sequence>
              );
            if (son === 'noche')
              return (
                <Sequence key={`s${i}`} from={s.from} durationInFrames={s.dur}>
                  <Audio src={staticFile('sfx/night.mp3')} volume={(f) => interpolate(f, [0, 30, s.dur - 30, s.dur], [0, 0.3, 0.3, 0], clamp)} />
                </Sequence>
              );
            return null;
          })}
        {h.musica !== false && <Musica bajita={tieneVoz(h)} />}
      </AbsoluteFill>
    </CastCtx.Provider>
  );
};
