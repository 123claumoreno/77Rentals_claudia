/* PLANTILLA: the starting point for a new style of Claudia's own. It is deliberately plain:
   flat colour backgrounds, one big line of text per scene, a soft fade between scenes, and the
   closing card with logo and contacts. To make a new style, copy this folder to
   src/estilos/<nombre>/, change ESTILO below, draw new scenes, and register it in src/estilos/index.ts.
   Voice works the same as in Estilo Cuento (src/motor/voz.ts). */
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {outfit, serif} from '../../theme';
import {Narracion, VOZ_INICIO, momentoPalabra, tieneVoz, vozDe, type LineaVoz} from '../../motor/voz';
import type {Historia} from '../../historias/tipos';

const FPS = 30;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---- the style sheet: colours, letters, timing. Change these first. ---- */
export const ESTILO = {
  fondo: '#FBF7F0',
  fondoFuerte: '#3A1248',
  tinta: '#3A1248',
  acento: '#E3B23C',
  letra: serif, // any font loaded in src/theme.ts (@remotion/google-fonts is installed)
  letraChica: outfit,
  fundido: 20, // frames of the fade between scenes
  porPalabra: 0.36, // reading pace when there is no voice (seconds per word)
};

/* ---- scene library. Each scene draws only its background and drawings; the text is added on top. ---- */
const Portada: React.FC = () => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, 90], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: ESTILO.fondoFuerte}}>
      <div style={{position: 'absolute', left: 540 - 300 * r, top: 1500, width: 600 * r, height: 6, background: ESTILO.acento, borderRadius: 3}} />
    </AbsoluteFill>
  );
};
const Frase: React.FC = () => <AbsoluteFill style={{background: ESTILO.fondo}} />;
const Cierre: React.FC = () => (
  <AbsoluteFill style={{background: ESTILO.fondoFuerte, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 260, gap: 22}}>
    <Img src={staticFile('img/logo.jpeg')} style={{width: 220, height: 220, borderRadius: 110, objectFit: 'cover', border: `6px solid ${ESTILO.acento}`}} />
    <div style={{fontFamily: ESTILO.letraChica, fontWeight: 600, fontSize: 52, color: '#FBF7F0'}}>77rentals.com</div>
    <div style={{fontFamily: ESTILO.letraChica, fontWeight: 500, fontSize: 40, color: ESTILO.acento}}>WhatsApp +57 304 673 6241</div>
    <div style={{fontFamily: ESTILO.letraChica, fontWeight: 300, fontSize: 34, color: '#FBF7F0'}}>Claudia · tu anfitriona</div>
  </AbsoluteFill>
);

/** min = shortest the scene may last (frames). claro = the text goes light on a dark scene. */
export const ESCENAS_PLANTILLA: Record<string, {comp: React.FC; min: number; claro?: boolean}> = {
  portada: {comp: Portada, min: 90, claro: true},
  frase: {comp: Frase, min: 75},
  cierre: {comp: Cierre, min: 150, claro: true},
};

/* ---- engine ---- */
const segundos = (texto: string) => 0.6 + texto.split(/\s+/).filter(Boolean).length * ESTILO.porPalabra + 1.2;
const linea = (h: Historia) => {
  let at = 0;
  return h.escenas.map((e, i) => {
    const def = ESCENAS_PLANTILLA[e.escena];
    if (!def) throw new Error(`Escena desconocida en "${h.id}": ${e.escena}`);
    const voz = vozDe(h, i, e.texto);
    const secs = voz ? VOZ_INICIO / FPS + voz.dur + 0.6 : segundos(e.texto);
    const dur = Math.max(def.min, Math.ceil(secs * FPS) + ESTILO.fundido);
    const s = {from: at, dur, voz, i, def, ...e};
    at += dur;
    return s;
  });
};
export const framesPlantilla = (h: Historia) => linea(h).reduce((a, s) => a + s.dur, 0);

const Texto: React.FC<{texto: string; voz?: LineaVoz; claro?: boolean; abajo?: boolean}> = ({texto, voz, claro, abajo}) => {
  const t = useCurrentFrame() / FPS;
  const words = texto.split(/\s+/).filter(Boolean);
  return (
    <AbsoluteFill style={{justifyContent: abajo ? 'flex-start' : 'center', paddingTop: abajo ? 360 : 0, paddingLeft: 90, paddingRight: 90}}>
      <div style={{fontFamily: ESTILO.letra, fontWeight: 600, fontSize: 92, lineHeight: 1.1, textAlign: 'center', color: claro ? '#FBF7F0' : ESTILO.tinta}}>
        {words.map((w, i) => {
          const at = voz ? VOZ_INICIO / FPS + momentoPalabra(voz, i, words.length) : 0.3 + i * ESTILO.porPalabra;
          return (
            <span key={i} style={{opacity: t >= at ? 1 : 0.2}}>
              {w}{' '}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Fundido: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, ESTILO.fundido, dur - 4, dur], [0, 1, 1, 1], {...clamp, easing: Easing.out(Easing.quad)});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Plantilla: React.FC<{historia: Historia}> = ({historia: h}) => {
  const {durationInFrames} = useVideoConfig();
  const musica = h.musica !== false && getStaticFiles().some((s) => s.name === 'music.mp3');
  const v = tieneVoz(h) ? 0.16 : 0.35;
  return (
    <AbsoluteFill style={{background: ESTILO.fondo}}>
      {linea(h).map((s) => {
        const Scene = s.def.comp;
        return (
          <Sequence key={s.i} from={s.from} durationInFrames={s.dur + (s.i < h.escenas.length - 1 ? ESTILO.fundido : 0)}>
            <Fundido dur={s.dur}>
              <Scene />
              {s.texto && <Texto texto={s.texto} voz={s.voz} claro={s.def.claro} abajo={s.escena === 'cierre'} />}
            </Fundido>
            {s.voz && (
              <Sequence from={VOZ_INICIO}>
                <Narracion id={h.id} i={s.i} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {musica && <Audio src={staticFile('music.mp3')} volume={(f) => interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, v, v, 0], clamp)} />}
    </AbsoluteFill>
  );
};
