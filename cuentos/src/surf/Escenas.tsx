/* Scenes of "Hasta pronto, Camilo y familia" (apartment 1204, surf style). Same drawing ingredients as Macondo. */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {P, Sketch, W, H, hand, ln} from '../story/kit';
import {Mom} from '../cuento/people';
import {outfit} from '../theme';
import {Balcon, Cielo, CiudadMar, Habitacion, Lobby, Maleta, Pasillo, PuertaMadera, Sala, Terraza, Tabla, clampE} from './decor';
import {Cochecito, MAMA, MamaCoche, PLAYA, Pers, VIAJE} from './gente';

const ease = {...clampE, easing: Easing.inOut(Easing.cubic)};
const camina = (f: number, de: number, a: number, ini: number, dur = 38) => {
  const t = interpolate(f, [ini, ini + dur], [0, 1], ease);
  return {x: de + (a - de) * t, w: t > 0 && t < 1 ? f : 0, t};
};
const wv = (f: number, p = 0, a = 24) => Math.sin(f * 0.4 + p) * a;
const Pulgar: React.FC<{skin: string}> = ({skin}) => <ellipse cx={0} cy={-18} rx={11} ry={22} fill={skin} {...ln} strokeWidth={4} />;
const Estrella: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => {
  let d = '';
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.45 : 1; const a = -Math.PI / 2 + (i * Math.PI) / 5; d += `${i ? 'L' : 'M'}${(Math.cos(a) * r * 56).toFixed(1)} ${(Math.sin(a) * r * 56).toFixed(1)}`; }
  return <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} d={`${d}Z`} fill={P.gold} {...ln} strokeWidth={5} />;
};
const Destello: React.FC<{x: number; y: number; r: number; c?: string}> = ({x, y, r, c = P.white}) => (
  <path d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`} fill={c} stroke={P.ink} strokeWidth={2.5} />
);

/* 1 · hello, in the bedroom with the balcony */
export const SHola: React.FC = () => {
  const f = useCurrentFrame();
  const m = camina(f, 20, 250, 0), c = camina(f, 120, 480, 0), t = camina(f, 330, 700, 0), n = camina(f, 1230, 890, 0, 34);
  const lk = (p: number) => Math.sin(f / 9 + p) * 0.6;
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Habitacion />
        <Mom x={m.x} y={1730} s={1.0} walk={m.w} baby hat waveBack={m.t >= 1} smile="open" skin={MAMA.playa.skin} />
        <Pers r={PLAYA.camilo} x={c.x} y={1740} s={1.12} walk={c.w} wave={c.t >= 1} smile="open" look={c.t >= 1 ? lk(1) : 0} />
        <Pers r={PLAYA.tia} x={t.x} y={1740} s={1.05} walk={t.w} wave={t.t >= 1} smile="open" look={t.t >= 1 ? lk(3) : 0} />
        <Pers r={PLAYA.nino} x={n.x} y={1740} s={1.22} walk={n.w} aL={n.t >= 1 ? 140 + wv(f, 0, 18) : undefined} aR={n.t >= 1 ? 140 + wv(f, 1, 18) : undefined} jump={n.t >= 1 ? Math.abs(Math.sin(f / 5)) * 20 : 0} smile="open" />
        {f > 40 && [[180, 1010], [420, 960], [640, 1030], [880, 980]].map(([sx, sy], i) => <Destello key={i} x={sx} y={sy} r={10 + Math.max(0, Math.sin(f / 5 + i * 1.7)) * 26} c={i % 2 ? P.goldSoft : P.white} />)}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 2 · check-out: the clock at twelve, suitcases, thumbs up */
export const SCheckout: React.FC = () => {
  const f = useCurrentFrame();
  const up = interpolate(f, [26, 46], [0, 1], ease);
  const tic = Math.floor(f / 15);
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Habitacion reloj cartel tic={tic} />
        <text x={tic % 2 ? 640 : 330} y={tic % 2 ? 560 : 580} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={60} fill={P.coral} stroke={P.ink} strokeWidth={2}>{tic % 2 ? 'tac' : 'tic'}</text>
        <Maleta x={395} y={1770} color={P.coral} />
        <Maleta x={600} y={1775} color={P.sea} s={0.9} />
        <Mom x={250} y={1730} s={1.0} baby hat waveBack smile="open" skin={MAMA.playa.skin} />
        <Pers r={PLAYA.camilo} x={480} y={1740} s={1.12} aR={95 * up} holdR={up > 0.5 ? <Pulgar skin={PLAYA.camilo.skin} /> : undefined} smile="open" look={Math.sin(f / 12) * 0.5} jump={up > 0.9 ? Math.abs(Math.sin(f / 6)) * 8 : 0} />
        <Pers r={PLAYA.tia} x={700} y={1740} s={1.05} aL={140 + wv(f, 2, 10)} smile="open" look={Math.sin(f / 12 + 2) * 0.5} />
        <Pers r={PLAYA.nino} x={890} y={1740} s={1.22} aL={120 + wv(f, 0, 20)} aR={120 + wv(f, 1, 20)} jump={Math.abs(Math.sin(f / 5)) * 18} smile="open" />
      </Sketch>
    </AbsoluteFill>
  );
};

/* 3 · lights, AC and TV off */
export const SApagar: React.FC = () => {
  const f = useCurrentFrame();
  const m = camina(f, -700, 590, 0, 44), c = camina(f, -330, 430, 6), t = camina(f, -420, 240, 12), n = camina(f, 1350, 330, 4, 34);
  const off = f >= 70, led = f >= 82, tv = f < 96;
  const dark = interpolate(f, [70, 84], [0, 0.32], clampE);
  const press = t.t >= 1 ? interpolate(f, [52, 60, 70], [95, 120, 100], clampE) : undefined;
  const k1 = spring({frame: f - 104, fps: 30, config: {damping: 11}}), k2 = spring({frame: f - 114, fps: 30, config: {damping: 11}});
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Sala tv={tv} ledRojo={led} interruptor={!off} />
        <Pers r={VIAJE.nino} x={n.x} y={1740} s={1.22} walk={n.w} jump={n.t >= 1 ? Math.abs(Math.sin(f / 5)) * 12 : 0} aL={n.t >= 1 ? 40 : undefined} smile="open" />
        <Pers r={VIAJE.tia} x={t.x} y={1740} s={1.05} walk={t.w} aL={t.t >= 1 ? 118 : undefined} smile="open" />
        <Pers r={VIAJE.camilo} x={c.x} y={1740} s={1.12} walk={c.w} aL={c.t >= 1 ? interpolate(f, [40, 56], [0, 125], clampE) : undefined} holdL={c.t >= 1 && f > 44 ? <rect x={-9} y={-40} width={18} height={54} rx={7} fill={P.ink} /> : undefined} smile="open" />
        <MamaCoche x={m.x} y={1740} s={1.0} walk={m.w} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        {f > 60 && f < 96 && <path d={`M300 1320 Q310 900 ${330 + Math.sin(f / 3) * 4} 580`} stroke={P.gold} strokeWidth={6} strokeDasharray="16 16" fill="none" />}
        <rect x={-20} y={-20} width={1120} height={1960} fill={P.purpleDark} opacity={dark} />
        {f > 104 && (
          <g transform={`translate(190 800) scale(${k1})`}>
            <circle r={66} fill={P.white} {...ln} />
            <path d="M-4 -40 Q40 -30 30 18 Q-6 38 -34 10 Q-30 -26 -4 -40 Z" fill={P.leaf} {...ln} strokeWidth={4} />
            <path d="M-24 30 Q0 0 26 -26" stroke={P.white} strokeWidth={5} fill="none" />
          </g>
        )}
        {f > 114 && (
          <g transform={`translate(820 440) scale(${k2})`}>
            <circle r={66} fill={P.white} {...ln} />
            <path d="M10 -44 L-24 8 H-4 L-12 44 L26 -10 H6 Z" fill={P.gold} {...ln} strokeWidth={4} />
          </g>
        )}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 4 · trash goes down the chute */
const Bolsa: React.FC<{x?: number; y?: number; s?: number}> = ({x = 0, y = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -48 Q-44 4 -26 30 Q0 44 26 30 Q44 4 30 -48 Q0 -62 -30 -48 Z" fill="#5b4a72" {...ln} />
    <path d="M-16 -56 Q0 -90 16 -56" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={-12} cy={-12} rx={7} ry={16} fill={P.white} opacity={0.25} />
  </g>
);
export const SBasura: React.FC = () => {
  const f = useCurrentFrame();
  const c = camina(f, 90, 310, 0, 42), n = camina(f, -260, 130, 8, 40), m = camina(f, 1100, 650, 4, 40);
  const reach = interpolate(f, [44, 58], [0, 90], clampE);
  const flap = interpolate(f, [52, 62, 96, 106], [0, 1, 1, 0], clampE);
  const drop = interpolate(f, [60, 82], [0, 1], clampE);
  const star = spring({frame: f - 96, fps: 30, config: {damping: 10}});
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Pasillo flap={flap} />
        <Pers r={VIAJE.nino} x={n.x} y={1740} s={1.22} walk={n.w} aL={n.t >= 1 ? 120 + wv(f, 0, 16) : undefined} jump={n.t >= 1 ? Math.abs(Math.sin(f / 5)) * 12 : 0} smile="open" />
        <MamaCoche x={m.x} y={1740} s={0.85} walk={m.w} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        <Pers r={VIAJE.camilo} x={c.x} y={1740} s={1.12} walk={c.w} aR={c.t >= 1 ? reach : undefined} holdR={drop < 0.02 ? <Bolsa y={50} s={0.9} /> : undefined} smile="open" />
        {drop > 0.02 && drop < 1 && <Bolsa x={interpolate(drop, [0, 1], [540, 500])} y={interpolate(drop, [0, 1], [1340, 1360]) + drop * drop * 40} s={0.9 * (1 - drop * 0.6)} />}
        {f > 96 && <g><Estrella x={430} y={1030} s={1.6 * star} rot={-10} /><Destello x={540} y={940} r={16} c={P.goldSoft} /><Destello x={330} y={1000} r={12} /></g>}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 5 · the key goes into the small lockbox by the door */
const Llave: React.FC = () => (
  <g>
    <circle cx={0} cy={-32} r={15} fill={P.gold} {...ln} strokeWidth={4} />
    <circle cx={0} cy={-32} r={5} fill={P.ink} />
    <rect x={-4} y={-18} width={8} height={44} rx={3} fill={P.gold} {...ln} strokeWidth={3} />
    <path d="M4 10 h14 M4 20 h10" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const SLlave: React.FC = () => {
  const f = useCurrentFrame();
  const c = camina(f, -250, 400, 0, 42), t = camina(f, -420, 130, 8, 40), n = camina(f, -340, 270, 14, 36);
  const up = interpolate(f, [44, 62], [0, 118], clampE);
  const open = interpolate(f, [62, 72, 100, 110], [0, 1, 1, 0], clampE);
  const inside = interpolate(f, [70, 92], [0, 1], clampE);
  const ok = spring({frame: f - 112, fps: 30, config: {damping: 9}});
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <PuertaMadera />
        <g transform="translate(600 1330)">
          <rect x={-38} y={-52} width={76} height={104} rx={12} fill="#2f2640" {...ln} />
          {inside > 0.02 && inside < 1 && <g transform={`translate(0 ${-30 + inside * 36}) scale(0.5)`}><Llave /></g>}
          <g transform={`translate(-38 0) scale(${1 - open * 0.88} 1)`}>
            <rect x={0} y={-52} width={76} height={104} rx={12} fill="#9b8fb4" {...ln} />
            {[[18, -28], [38, -28], [58, -28], [18, -10], [38, -10], [58, -10]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={5} fill={P.goldSoft} />)}
            <rect x={14} y={14} width={48} height={14} rx={6} fill={P.sea} />
          </g>
        </g>
        <Pers r={VIAJE.nino} x={n.x} y={1740} s={1.22} walk={n.w} aL={n.t >= 1 ? 120 + wv(f, 0, 16) : undefined} jump={n.t >= 1 ? Math.abs(Math.sin(f / 5)) * 12 : 0} smile="open" />
        <Pers r={VIAJE.tia} x={t.x} y={1740} s={1.05} walk={t.w} aR={t.t >= 1 ? 130 + wv(f, 1, 14) : undefined} smile="open" />
        <Pers r={VIAJE.camilo} x={c.x} y={1740} s={1.12} walk={c.w} aR={c.t >= 1 ? up : undefined} holdR={inside < 0.02 && c.t >= 1 ? <g transform="translate(6 10) rotate(-40)"><Llave /></g> : undefined} smile="open" />
        {f > 112 && <g transform={`translate(600 1200) scale(${ok})`}><circle r={46} fill={P.leaf} {...ln} /><path d="M-22 2 l14 14 l30 -32" stroke={P.white} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 6 · opinion: stars appear one by one */
export const SOpinion: React.FC = () => {
  const f = useCurrentFrame();
  const m = camina(f, -700, 110, 0, 44), c = camina(f, 1300, 640, 6), t = camina(f, 1500, 800, 12), n = camina(f, 1400, 940, 4, 34);
  const up = interpolate(f, [44, 62], [0, 118], clampE);
  const pos: [number, number][] = [[190, 640], [340, 560], [520, 520], [700, 560], [860, 640]];
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Lobby />
        <MamaCoche x={m.x} y={1740} s={1.0} walk={m.w} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        <Pers r={VIAJE.camilo} x={c.x} y={1740} s={1.12} walk={c.w} aR={c.t >= 1 ? up : undefined} holdR={up > 60 ? <g transform="translate(0 -4)"><rect x={-17} y={-62} width={34} height={64} rx={8} fill={P.ink} /><rect x={-13} y={-57} width={26} height={50} rx={4} fill="#9be3f5" /></g> : undefined} smile="open" />
        <Pers r={VIAJE.tia} x={t.x} y={1740} s={1.05} walk={t.w} aL={t.t >= 1 ? interpolate(f, [60, 76], [0, 80], clampE) : undefined} smile="open" />
        <Pers r={VIAJE.nino} x={n.x} y={1740} s={1.22} walk={n.w} aL={n.t >= 1 ? 130 + wv(f, 0, 16) : undefined} aR={n.t >= 1 ? 130 + wv(f, 1, 16) : undefined} jump={n.t >= 1 ? Math.abs(Math.sin(f / 5)) * 18 : 0} smile="open" />
        {pos.map(([sx, sy], i) => {
          const k = spring({frame: f - (46 + i * 10), fps: 30, config: {damping: 9}});
          return k > 0.01 ? <g key={i}><Estrella x={sx} y={sy} s={1.05 * k} rot={Math.sin(f / 8 + i) * 8} />{k > 0.9 && <Destello x={sx + 56} y={sy - 46} r={8 + Math.max(0, Math.sin(f / 4 + i)) * 12} />}</g> : null;
        })}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 7 · thank you: waving goodbye on the terrace; heads turn to look at each other */
export const SGracias: React.FC = () => {
  const f = useCurrentFrame();
  const m = camina(f, -700, 110, 0, 44), c = camina(f, -330, 640, 6), t = camina(f, -420, 800, 12), n = camina(f, 1350, 940, 4, 34);
  const g1 = Math.sin(f / 9) * 0.9, g2 = Math.sin(f / 9 + 1.9) * 0.9;
  const there = (x: {t: number}) => x.t >= 1;
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Terraza />
        <Maleta x={560} y={1782} color={P.coral} s={0.9} />
        <MamaCoche x={m.x} y={1740} s={1.0} walk={m.w} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        <Pers r={VIAJE.camilo} x={c.x} y={1740} s={1.12} walk={c.w} aR={there(c) ? 120 + wv(f, 0, 22) : undefined} look={there(c) ? -g1 : 0} smile="open" />
        <Pers r={VIAJE.tia} x={t.x} y={1740} s={1.05} walk={t.w} aL={there(t) ? 120 + wv(f, 2, 22) : undefined} look={there(t) ? g2 : 0} smile="open" />
        <Pers r={VIAJE.nino} x={n.x} y={1740} s={1.22} walk={n.w} aR={there(n) ? 130 + wv(f, 1, 22) : undefined} look={there(n) ? -g2 : 0} jump={there(n) ? Math.abs(Math.sin(f / 5)) * 10 : 0} smile="open" />
        {f > 50 && [0, 1, 2, 3, 4, 5].map((i) => {
          const tt = ((f - 50 + i * 24) % 140) / 140;
          return <path key={i} transform={`translate(${160 + i * 150 + Math.sin(f / 9 + i) * 18} ${1250 - tt * 720}) scale(${0.5 + (i % 3) * 0.12})`} d="M0 22C-44 -8 -34 -46 -14 -46 -4 -46 0 -36 0 -36S4 -46 14 -46C34 -46 44 -8 0 22Z" fill={[P.coral, P.gold, '#f0a0b8'][i % 3]} stroke={P.ink} strokeWidth={5} opacity={Math.sin(tt * Math.PI)} />;
        })}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 8 · benefits card with the logo and a gold ribbon */
export const SBeneficios: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = spring({frame: f - 4, fps, config: {damping: 12}});
  const shine = interpolate(f, [30, 70], [-300, 1200], clampE);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #fff3d6, #f1d8a6)'}}>
      <Sketch>
        <Tabla x={120} y={1180} s={1.1} rot={-12} c1={P.sea} c2={P.coral} />
        <Tabla x={960} y={1220} s={1.0} rot={10} c1={P.coral} c2={P.white} />
        {Array.from({length: 14}).map((_, i) => <Destello key={i} x={random(`bx${i}`) * W} y={480 + random(`by${i}`) * 1100} r={8 + Math.max(0, Math.sin(f / 6 + i * 2.1)) * 22} c={i % 2 ? P.goldSoft : P.white} />)}
      </Sketch>
      <div style={{position: 'absolute', left: 120, top: 640, width: 840, height: 640, transform: `scale(${k}) rotate(${(1 - k) * -14 - 2}deg)`}}>
        <div style={{position: 'absolute', inset: 0, background: P.purpleDark, border: `8px solid ${P.gold}`, borderRadius: 54, boxShadow: '0 24px 0 rgba(58,18,72,.25)', overflow: 'hidden'}}>
          <Img src={staticFile('img/logo.jpeg')} style={{position: 'absolute', left: 120, top: 30, width: 600, borderRadius: 24}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontFamily: outfit, fontWeight: 600, fontSize: 46, letterSpacing: '0.2em', color: P.goldSoft}}>HUÉSPED FRECUENTE</div>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: shine, width: 120, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />
        </div>
        <svg width={840} height={640} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path d="M-30 540 L150 640 H-30 Z" fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
          <g transform="translate(420 -6)">
            <path d="M0 0 L-100 -56 V50 Z M0 0 L100 -56 V50 Z" fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
            <circle r={30} fill={P.goldSoft} stroke={P.ink} strokeWidth={5} />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* 9 · four cities, by the sea */
export const SCiudades: React.FC = () => {
  const f = useCurrentFrame();
  const m = camina(f, -700, 110, 0, 44), c = camina(f, -330, 640, 6), t = camina(f, -420, 800, 12), n = camina(f, 1350, 940, 4, 34);
  const tags: [string, number, number][] = [['Cartagena', 250, 560], ['Barranquilla', 760, 640], ['Santa Marta', 270, 780], ['Bogotá', 740, 860]];
  const g = Math.sin(f / 9) * 0.7;
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <CiudadMar />
        {tags.map(([name, tx, ty], i) => {
          const k = spring({frame: f - (34 + i * 20), fps: 30, config: {damping: 10}});
          return k > 0.01 ? (
            <g key={name} transform={`translate(${tx} ${ty + Math.sin(f / 14 + i) * 5}) scale(${k})`}>
              <rect x={-168} y={-44} width={336} height={88} rx={44} fill={P.purpleDeep} {...ln} />
              <circle cx={-126} cy={0} r={12} fill={P.gold} />
              <text x={14} y={16} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={56} fill={P.white}>{name}</text>
            </g>
          ) : null;
        })}
        <MamaCoche x={m.x} y={1760} s={1.0} walk={m.w} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        <Pers r={VIAJE.camilo} x={c.x} y={1760} s={1.12} walk={c.w} aR={c.t >= 1 ? 120 + wv(f, 0, 22) : undefined} look={c.t >= 1 ? -g : 0} smile="open" />
        <Pers r={VIAJE.tia} x={t.x} y={1760} s={1.05} walk={t.w} aL={t.t >= 1 ? 120 + wv(f, 2, 22) : undefined} look={t.t >= 1 ? g : 0} smile="open" />
        <Pers r={VIAJE.nino} x={n.x} y={1760} s={1.22} walk={n.w} aR={n.t >= 1 ? 130 + wv(f, 1, 22) : undefined} jump={n.t >= 1 ? Math.abs(Math.sin(f / 5)) * 10 : 0} smile="open" />
      </Sketch>
    </AbsoluteFill>
  );
};

/* 10 · the plane to Bogotá, with the family at the windows */
const Ventana: React.FC<{x: number; skin: string; hair: string; kid?: boolean}> = ({x, skin, hair, kid}) => (
  <g transform={`translate(${x} -6)`}>
    <circle r={22} fill="#cfeaf1" {...ln} strokeWidth={4} />
    <clipPath id={`vw${x}`}><circle r={20} /></clipPath>
    <g clipPath={`url(#vw${x})`}>
      <circle cx={0} cy={kid ? 14 : 8} r={kid ? 13 : 15} fill={skin} />
      <path d={`M-16 ${kid ? 6 : 0} Q0 -22 16 ${kid ? 6 : 0} Q0 ${kid ? -4 : -10} -16 ${kid ? 6 : 0} Z`} fill={hair} />
      <circle cx={-5} cy={kid ? 14 : 8} r={2.2} fill={P.ink} />
      <circle cx={5} cy={kid ? 14 : 8} r={2.2} fill={P.ink} />
      <path d={`M-5 ${kid ? 20 : 14} q5 5 10 0`} stroke={P.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  </g>
);
export const SAvion: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const p = interpolate(f, [0, D - 10], [0, 1], clampE);
  const inK = interpolate(f, [0, 34], [0, 1], {...clampE, easing: Easing.out(Easing.cubic)});
  const outK = interpolate(f, [D - 40, D - 6], [0, 1], {...clampE, easing: Easing.in(Easing.cubic)});
  const px = 160 + p * 320 - (1 - inK) * 900 + outK * 800;
  const py = 1000 - p * 90 + Math.sin(f / 14) * 12;
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Cielo />
        <path d="M120 1480 Q520 1120 960 900" stroke={P.white} strokeWidth={9} strokeDasharray="6 26" strokeLinecap="round" fill="none" />
        <g transform="translate(240 1560)"><rect x={-180} y={-46} width={360} height={92} rx={46} fill={P.purpleDeep} {...ln} /><text x={0} y={20} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={60} fill={P.white}>Cartagena</text></g>
        <g transform="translate(830 790)"><rect x={-140} y={-46} width={280} height={92} rx={46} fill={P.gold} {...ln} /><text x={0} y={20} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={60} fill={P.purpleDark}>Bogotá</text></g>
        <g transform={`translate(${px} ${py}) rotate(-8) scale(1.3)`}>
          <path d="M-250 -32 L-292 -128 L-206 -128 L-150 -32 Z" fill={P.purpleDeep} {...ln} />
          <path d="M-262 -70 L-196 -70" stroke={P.gold} strokeWidth={9} />
          <path d="M-30 20 L-140 150 L-50 150 L90 20 Z" fill="#e9e4f3" {...ln} />
          <path d="M-290 0 Q-290 -36 -236 -40 L170 -40 Q296 -34 308 0 Q296 32 170 36 L-236 36 Q-290 32 -290 0 Z" fill={P.white} {...ln} />
          <path d="M-282 8 H296" stroke={P.gold} strokeWidth={11} />
          <path d="M250 -36 Q300 -30 308 0 Q298 14 262 18 Z" fill={P.gold} {...ln} />
          <Ventana x={-170} skin="#ebc6a0" hair="#3b2a22" />
          <Ventana x={-100} skin="#ecc19c" hair="#2c1c18" />
          <Ventana x={-30} skin="#e4b690" hair="#2c1c18" />
          <Ventana x={40} skin="#efcdab" hair="#4a2e20" kid />
          <Ventana x={110} skin="#f3d2b3" hair="#4a2e20" kid />
        </g>
      </Sketch>
    </AbsoluteFill>
  );
};

/* 11 · closing: title, logo, contacts, and the platforms where they can book */
export const SCierre: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: f - 22, fps, config: {damping: 13}});
  const line = (d: number) => interpolate(f - d, [0, 14], [0, 1], clampE);
  const logos: [string, number][] = [['airbnb', 200], ['booking', 300], ['despegar', 210], ['hotels', 280], ['tripadvisor', 280]];
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${P.purple}, ${P.purpleDeep} 55%, ${P.purpleDark})`}}>
      <Sketch>
        {Array.from({length: 22}).map((_, i) => <Destello key={i} x={random(`cx${i}`) * W} y={random(`cy${i}`) * H} r={6 + Math.max(0, Math.sin(f / 7 + i * 1.9)) * 18} c={i % 3 ? P.goldSoft : P.white} />)}
      </Sketch>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('img/logo.jpeg')} style={{width: 470, borderRadius: 36, border: `5px solid ${P.goldSoft}`, transform: `scale(${logo}) rotate(${(1 - logo) * -10}deg)`, boxShadow: '0 20px 60px rgba(0,0,0,.4)'}} />
      </div>
      <div style={{position: 'absolute', top: 760, left: 50, right: 50, textAlign: 'center'}}>
        <div style={{opacity: line(34), fontFamily: hand, fontWeight: 700, fontSize: 104, color: P.goldSoft, lineHeight: 1}}>¡Hasta pronto, Camilo y familia!</div>
        <div style={{opacity: line(46), marginTop: 30, fontFamily: outfit, fontWeight: 600, fontSize: 54, color: P.white, letterSpacing: '0.06em'}}>77rentals.com</div>
        <div style={{opacity: line(54), marginTop: 26, display: 'inline-block', background: P.gold, border: `4px solid ${P.ink}`, borderRadius: 999, padding: '14px 38px', fontFamily: outfit, fontWeight: 600, fontSize: 42, color: P.purpleDark}}>WhatsApp +57 304 673 6241</div>
        <div style={{opacity: line(62), marginTop: 16, fontFamily: hand, fontWeight: 600, fontSize: 56, color: P.goldSoft}}>Claudia · tu anfitriona</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1330, opacity: line(70), transform: `translateY(${(1 - line(70)) * 40}px)`}}>
        <div style={{textAlign: 'center', fontFamily: outfit, fontWeight: 600, fontSize: 34, letterSpacing: '0.2em', color: P.goldSoft, marginBottom: 18}}>ENCUÉNTRANOS EN</div>
        <div style={{background: P.white, border: `5px solid ${P.ink}`, borderRadius: 38, padding: '30px 34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '26px 40px', boxShadow: `8px 10px 0 ${P.purple}`}}>
          {logos.map(([n, w]) => <Img key={n} src={staticFile(`plataformas/${n}.svg`)} style={{width: w}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
