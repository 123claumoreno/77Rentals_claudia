/* Scenes of "Hasta pronto, Camilo y familia" (apartment 1204, surf style). Same drawing ingredients as Macondo. */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {P, Sketch, W, H, hand, ln} from '../story/kit';
import {Mom} from '../cuento/people';
import {outfit} from '../theme';
import {Cielo, CiudadMar, Habitacion, Maleta, PasilloLargo, Sala, Terraza, clampE} from './decor';
import {Cochecito, MAMA, MamaCoche, PLAYA, Pers, VIAJE} from './gente';
import {VOCES} from '../voz';
import {VOZ_INICIO} from '../motor/voz';

const ease = {...clampE, easing: Easing.inOut(Easing.cubic)};
const camina = (f: number, de: number, a: number, ini: number, dur = 38) => {
  const t = interpolate(f, [ini, ini + dur], [0, 1], ease);
  return {x: de + (a - de) * t, w: t > 0 && t < 1 ? f : 0, t};
};
const wv = (f: number, p = 0, a = 24) => Math.sin(f * 0.4 + p) * a;
/* a suitcase hanging from the hand (kept upright by the puppet) */
const MaletaMano: React.FC<{color: string}> = ({color}) => <g transform="translate(0 150)"><Maleta x={0} y={0} color={color} s={0.8} /></g>;
const Pulgar: React.FC<{skin: string}> = ({skin}) => <ellipse cx={0} cy={-18} rx={11} ry={22} fill={skin} {...ln} strokeWidth={4} />;
const Estrella: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => {
  let d = '';
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.45 : 1; const a = -Math.PI / 2 + (i * Math.PI) / 5; d += `${i ? 'L' : 'M'}${(Math.cos(a) * r * 56).toFixed(1)} ${(Math.sin(a) * r * 56).toFixed(1)}`; }
  return <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} d={`${d}Z`} fill={P.gold} {...ln} strokeWidth={5} />;
};
const Destello: React.FC<{x: number; y: number; r: number; c?: string}> = ({x, y, r, c = P.white}) => (
  <path d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`} fill={c} stroke={P.ink} strokeWidth={2.5} />
);

/* helper pieces used by several scenes */
const Bolsa: React.FC<{x?: number; y?: number; s?: number}> = ({x = 0, y = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -48 Q-44 4 -26 30 Q0 44 26 30 Q44 4 30 -48 Q0 -62 -30 -48 Z" fill="#5b4a72" {...ln} />
    <path d="M-16 -56 Q0 -90 16 -56" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={-12} cy={-12} rx={7} ry={16} fill={P.white} opacity={0.25} />
  </g>
);
const Llave: React.FC = () => (
  <g>
    <circle cx={0} cy={-32} r={15} fill={P.gold} {...ln} strokeWidth={4} />
    <circle cx={0} cy={-32} r={5} fill={P.ink} />
    <rect x={-4} y={-18} width={8} height={44} rx={3} fill={P.gold} {...ln} strokeWidth={3} />
    <path d="M4 10 h14 M4 20 h10" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
  </g>
);
const Celu: React.FC = () => (
  <g transform="translate(0 -4)"><rect x={-17} y={-62} width={34} height={64} rx={8} fill={P.ink} /><rect x={-13} y={-57} width={26} height={50} rx={4} fill="#9be3f5" /></g>
);
/* the family stays where it is (nobody runs in): same spots for the stroller scenes */
const GRUPO = {mom: 100, camilo: 600, tia: 740, tia2: 860, nino: 975};

/* 1 · hello and check-out, in the surf bedroom: first they greet, then the clock and the suitcases */
export const SInicio: React.FC = () => {
  const f = useCurrentFrame();
  const second = f >= 76;
  const up = interpolate(f, [76, 98], [0, 1], ease);
  const tic = Math.floor(f / 15);
  const pack = spring({frame: f - 74, fps: 30, config: {damping: 10}});
  const lk = (p: number) => Math.sin(f / 9 + p) * 0.6;
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Habitacion reloj cartel tic={tic} />
        {second && <text x={tic % 2 ? 640 : 330} y={tic % 2 ? 560 : 580} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={60} fill={P.coral} stroke={P.ink} strokeWidth={2}>{tic % 2 ? 'tac' : 'tic'}</text>}
        {pack > 0.02 && (
          <g>
            <Maleta x={245} y={1772} color={P.coral} s={pack} />
            <Maleta x={430} y={1776} color={P.sea} s={0.9 * pack} />
            <Maleta x={610} y={1774} color={P.gold} s={0.85 * pack} />
          </g>
        )}
        <Mom x={150} y={1730} s={1.0} baby hat waveBack smile="open" skin={MAMA.playa.skin} />
        <Pers r={PLAYA.camilo} x={340} y={1740} s={1.12} wave={!second} aL={second ? 0 : undefined} aR={second ? 95 * up : undefined} holdR={second && up > 0.5 ? <Pulgar skin={PLAYA.camilo.skin} /> : undefined} smile="open" look={lk(1)} jump={second && up > 0.9 ? Math.abs(Math.sin(f / 6)) * 8 : 0} />
        <Pers r={PLAYA.tia} x={520} y={1740} s={1.05} wave smile="open" look={lk(3)} />
        <Pers r={PLAYA.tia2} x={700} y={1740} s={1.05} aR={125 + wv(f, 2, 22)} smile="open" look={lk(5)} />
        <Pers r={PLAYA.nino} x={890} y={1740} s={1.22} aL={140 + wv(f, 0, 18)} aR={140 + wv(f, 1, 18)} jump={Math.abs(Math.sin(f / 5)) * 20} smile="open" />
        {!second && [[150, 1010], [400, 960], [620, 1030], [860, 980]].map(([sx, sy], i) => <Destello key={i} x={sx} y={sy} r={10 + Math.max(0, Math.sin(f / 5 + i * 1.7)) * 26} c={i % 2 ? P.goldSoft : P.white} />)}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 2 · lights, AC and TV go off */
export const SApagar: React.FC = () => {
  const f = useCurrentFrame();
  const off = f >= 46, led = f >= 58, tv = f < 72;
  const dark = interpolate(f, [46, 60], [0, 0.32], clampE);
  const press = interpolate(f, [24, 34, 46], [95, 122, 100], clampE);
  const rm = interpolate(f, [12, 30], [0, 125], clampE);
  const k1 = spring({frame: f - 80, fps: 30, config: {damping: 11}}), k2 = spring({frame: f - 90, fps: 30, config: {damping: 11}});
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Sala tv={tv} ledRojo={led} interruptor={!off} />
        <Maleta x={600} y={1782} color={P.sea} s={0.8} />
        <Pers r={VIAJE.nino} x={320} y={1740} s={1.12} jump={Math.abs(Math.sin(f / 5)) * 10} aL={40} smile="open" />
        <Pers r={VIAJE.tia} x={220} y={1740} s={1.0} aL={press} smile="open" />
        <Pers r={VIAJE.tia2} x={430} y={1740} s={1.0} aR={125 + wv(f, 3, 16)} smile="open" />
        <Pers r={VIAJE.camilo} x={540} y={1740} s={1.08} aL={rm} holdL={rm > 40 ? <rect x={-9} y={-40} width={18} height={54} rx={7} fill={P.ink} /> : undefined} holdR={<MaletaMano color={P.coral} />} smile="open" />
        <MamaCoche x={700} y={1740} s={0.8} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        {f > 34 && f < 72 && <path d={`M360 1330 Q345 900 ${330 + Math.sin(f / 3) * 4} 580`} stroke={P.gold} strokeWidth={6} strokeDasharray="16 16" fill="none" />}
        <rect x={-20} y={-20} width={1120} height={1960} fill={P.purpleDark} opacity={dark} />
        {f > 80 && (
          <g transform={`translate(190 800) scale(${k1})`}>
            <circle r={66} fill={P.white} {...ln} />
            <path d="M-4 -40 Q40 -30 30 18 Q-6 38 -34 10 Q-30 -26 -4 -40 Z" fill={P.leaf} {...ln} strokeWidth={4} />
            <path d="M-24 30 Q0 0 26 -26" stroke={P.white} strokeWidth={5} fill="none" />
          </g>
        )}
        {f > 90 && (
          <g transform={`translate(820 440) scale(${k2})`}>
            <circle r={66} fill={P.white} {...ln} />
            <path d="M10 -44 L-24 8 H-4 L-12 44 L26 -10 H6 Z" fill={P.gold} {...ln} strokeWidth={4} />
          </g>
        )}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 3 · hallway: the bag goes down the chute, then the key goes into the lockbox (two things, one scene) */
export const SPasillo: React.FC = () => {
  const f = useCurrentFrame();
  const aR = f < 68 ? interpolate(f, [18, 36], [0, 90], clampE) : interpolate(f, [68, 82], [90, 0], clampE);
  const aL = f < 140 ? interpolate(f, [86, 102], [0, 100], clampE) : interpolate(f, [140, 154], [100, 0], clampE);
  const flap = interpolate(f, [36, 44, 62, 72], [0, 1, 1, 0], clampE);
  const drop = interpolate(f, [46, 66], [0, 1], clampE);
  const star = spring({frame: f - 70, fps: 30, config: {damping: 10}});
  const open = interpolate(f, [104, 112, 128, 136], [0, 1, 1, 0], clampE);
  const inside = interpolate(f, [110, 130], [0, 1], clampE);
  const ok = spring({frame: f - 138, fps: 30, config: {damping: 9}});
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <PasilloLargo flap={flap} />
        <g transform="translate(268 1340)">
          <rect x={-38} y={-52} width={76} height={104} rx={12} fill="#2f2640" {...ln} />
          {inside > 0.02 && inside < 1 && <g transform={`translate(0 ${-30 + inside * 36}) scale(0.5)`}><Llave /></g>}
          <g transform={`translate(-38 0) scale(${1 - open * 0.88} 1)`}>
            <rect x={0} y={-52} width={76} height={104} rx={12} fill="#9b8fb4" {...ln} />
            {[[18, -28], [38, -28], [58, -28], [18, -10], [38, -10], [58, -10]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={5} fill={P.goldSoft} />)}
            <rect x={14} y={14} width={48} height={14} rx={6} fill={P.sea} />
          </g>
        </g>
        <Maleta x={330} y={1782} color={P.sea} s={0.8} />
        <Maleta x={580} y={1784} color={P.gold} s={0.8} />
        <Pers r={VIAJE.tia} x={150} y={1740} s={1.0} aR={125 + wv(f, 1, 16)} smile="open" />
        <Pers r={VIAJE.tia2} x={250} y={1740} s={1.0} aL={undefined} aR={0} smile="open" />
        <Pers r={VIAJE.nino} x={390} y={1740} s={1.1} aL={120 + wv(f, 0, 16)} jump={Math.abs(Math.sin(f / 5)) * 10} smile="open" />
        <Pers r={VIAJE.camilo} x={490} y={1740} s={1.08} aR={aR} aL={aL} holdR={drop < 0.02 ? <Bolsa y={50} s={0.9} /> : undefined} holdL={f >= 86 && inside < 0.02 ? <g transform="translate(-4 10) rotate(40)"><Llave /></g> : undefined} smile="open" />
        <MamaCoche x={700} y={1740} s={0.8} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        {drop > 0.02 && drop < 1 && <Bolsa x={interpolate(drop, [0, 1], [668, 612])} y={interpolate(drop, [0, 1], [1400, 1340]) + drop * drop * 40} s={0.9 * (1 - drop * 0.6)} />}
        {f > 70 && f < 118 && <g><Estrella x={640} y={1060} s={1.5 * star} rot={-10} /><Destello x={730} y={980} r={16} c={P.goldSoft} /></g>}
        {f > 138 && <g transform={`translate(268 1210) scale(${ok})`}><circle r={46} fill={P.leaf} {...ln} /><path d="M-22 2 l14 14 l30 -32" stroke={P.white} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 4 · terrace: first the opinion (stars one by one), then the thank-you wave with heads turning */
export const STerraza: React.FC = () => {
  const f = useCurrentFrame();
  const second = f >= 118;
  const up = interpolate(f, [6, 26], [0, 118], clampE);
  const g1 = Math.sin(f / 9) * 0.9, g2 = Math.sin(f / 9 + 1.9) * 0.9;
  const fade = interpolate(f, [108, 120], [1, 0], clampE);
  const pos: [number, number][] = [[190, 640], [340, 560], [520, 520], [700, 560], [860, 640]];
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <Terraza />
        <Maleta x={500} y={1782} color={P.coral} s={0.85} />
        <MamaCoche x={GRUPO.mom} y={1740} s={0.85} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        <Pers r={VIAJE.camilo} holdL={<MaletaMano color={P.coral} />} x={GRUPO.camilo} y={1740} s={1.08} aR={second ? 120 + wv(f, 0, 22) : up} holdR={!second && up > 60 ? <Celu /> : undefined} look={second ? -g1 : 0} smile="open" />
        <Pers r={VIAJE.tia} x={GRUPO.tia} y={1740} s={1.0} aL={second ? 120 + wv(f, 2, 22) : interpolate(f, [40, 56], [0, 80], clampE)} look={second ? g2 : 0} smile="open" />
        <Pers r={VIAJE.tia2} x={GRUPO.tia2} y={1740} s={1.0} aR={second ? 125 + wv(f, 3, 22) : 0} look={second ? -g2 : 0} smile="open" />
        <Pers r={VIAJE.nino} x={GRUPO.nino} y={1740} s={1.12} aL={second ? undefined : 130 + wv(f, 0, 16)} aR={130 + wv(f, 1, 22)} look={second ? g1 : 0} jump={Math.abs(Math.sin(f / 5)) * 10} smile="open" />
        {pos.map(([sx, sy], i) => {
          const k = spring({frame: f - (16 + i * 9), fps: 30, config: {damping: 9}}) * fade;
          return k > 0.01 ? <g key={i}><Estrella x={sx} y={sy} s={1.05 * k} rot={Math.sin(f / 8 + i) * 8} />{k > 0.9 && <Destello x={sx + 56} y={sy - 46} r={8 + Math.max(0, Math.sin(f / 4 + i)) * 12} />}</g> : null;
        })}
        {second && [0, 1, 2, 3, 4, 5].map((i) => {
          const tt = ((f - 118 + i * 24) % 140) / 140;
          return <path key={i} transform={`translate(${160 + i * 150 + Math.sin(f / 9 + i) * 18} ${1250 - tt * 720}) scale(${0.5 + (i % 3) * 0.12})`} d="M0 22C-44 -8 -34 -46 -14 -46 -4 -46 0 -36 0 -36S4 -46 14 -46C34 -46 44 -8 0 22Z" fill={[P.coral, P.gold, '#f0a0b8'][i % 3]} stroke={P.ink} strokeWidth={5} opacity={Math.sin(tt * Math.PI)} />;
        })}
      </Sketch>
    </AbsoluteFill>
  );
};

/* 5 · benefits card, then the four cities by the sea (the tags appear when the narrator says each one) */
export const SBenCiu: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lv = VOCES['camilo-1204']?.[4];
  const exacto = !!lv && lv.palabras.length === 15;
  const idx = [7, 8, 9, 12];
  const cuando = (i: number) => (exacto ? 8 + VOZ_INICIO + Math.round(lv!.palabras[idx[i]].s * 30) - 4 : 120 + i * 22);
  const tExit = cuando(0) - 12;
  const k = spring({frame: f - 4, fps, config: {damping: 12}});
  const exit = interpolate(f, [tExit, tExit + 14], [1, 0], clampE);
  const shine = interpolate(f, [24, 64], [-300, 1200], clampE);
  const tags: [string, number, number][] = [['Cartagena', 250, 560], ['Barranquilla', 760, 640], ['Santa Marta', 270, 780], ['Bogotá', 740, 860]];
  const g = Math.sin(f / 9) * 0.7;
  return (
    <AbsoluteFill style={{background: '#f2e5cc'}}>
      <Sketch>
        <CiudadMar />
        {tags.map(([name, tx, ty], i) => {
          const kk = spring({frame: f - cuando(i), fps: 30, config: {damping: 10}});
          return kk > 0.01 ? (
            <g key={name} transform={`translate(${tx} ${ty + Math.sin(f / 14 + i) * 5}) scale(${kk})`}>
              <rect x={-168} y={-44} width={336} height={88} rx={44} fill={P.purpleDeep} {...ln} />
              <circle cx={-126} cy={0} r={12} fill={P.gold} />
              <text x={14} y={16} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={56} fill={P.white}>{name}</text>
            </g>
          ) : null;
        })}
        <MamaCoche x={GRUPO.mom} y={1760} s={0.85} dress={MAMA.viaje.dress} dressLight={MAMA.viaje.dressLight} skin={MAMA.viaje.skin} smile="open" />
        <Pers r={VIAJE.camilo} x={GRUPO.camilo} y={1760} s={1.08} aR={120 + wv(f, 0, 22)} look={-g} smile="open" />
        <Pers r={VIAJE.tia} x={GRUPO.tia} y={1760} s={1.0} aL={120 + wv(f, 2, 22)} look={g} smile="open" />
        <Pers r={VIAJE.tia2} x={GRUPO.tia2} y={1760} s={1.0} aR={125 + wv(f, 3, 22)} look={-g} smile="open" />
        <Pers r={VIAJE.nino} x={GRUPO.nino} y={1760} s={1.12} aR={130 + wv(f, 1, 22)} jump={Math.abs(Math.sin(f / 5)) * 10} smile="open" />
      </Sketch>
      <div style={{position: 'absolute', left: 150, top: 560, width: 780, height: 520, transform: `scale(${k * exit}) rotate(${(1 - k) * -14 - 2 + (1 - exit) * 12}deg)`, opacity: exit}}>
        <div style={{position: 'absolute', inset: 0, background: P.purpleDark, border: `8px solid ${P.gold}`, borderRadius: 54, boxShadow: '0 24px 0 rgba(58,18,72,.25)', overflow: 'hidden'}}>
          <Img src={staticFile('img/logo.jpeg')} style={{position: 'absolute', left: 110, top: 24, width: 560, borderRadius: 24}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: outfit, fontWeight: 600, fontSize: 42, letterSpacing: '0.2em', color: P.goldSoft}}>HUÉSPED FRECUENTE</div>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: shine, width: 120, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />
        </div>
        <svg width={780} height={520} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path d="M-30 440 L130 520 H-30 Z" fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
          <g transform="translate(390 -6)">
            <path d="M0 0 L-90 -50 V46 Z M0 0 L90 -50 V46 Z" fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
            <circle r={28} fill={P.goldSoft} stroke={P.ink} strokeWidth={5} />
          </g>
        </svg>
      </div>
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
/* a kiss sent from the plane: lips or a heart that drifts toward us and grows */
const Beso: React.FC<{x: number; y: number; s: number; tipo: number; rot: number}> = ({x, y, s, tipo, rot}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {tipo % 2 ? (
      <path d="M0 22C-44 -8 -34 -46 -14 -46 -4 -46 0 -36 0 -36S4 -46 14 -46C34 -46 44 -8 0 22Z" fill={P.coral} {...ln} strokeWidth={5} />
    ) : (
      <g>
        <path d="M-36 0 Q-20 -26 0 -10 Q20 -26 36 0 Q18 28 0 30 Q-18 28 -36 0 Z" fill="#d9443f" {...ln} strokeWidth={5} />
        <path d="M-30 2 Q0 12 30 2" stroke="#8f2a2a" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    )}
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
          <Ventana x={-195} skin="#ebc6a0" hair="#3b2a22" />
          <Ventana x={-127} skin="#ecc19c" hair="#2c1c18" />
          <Ventana x={-59} skin="#e4b690" hair="#2c1c18" />
          <Ventana x={9} skin="#eac4a0" hair="#5a3a2a" />
          <Ventana x={77} skin="#efcdab" hair="#4a2e20" kid />
          <Ventana x={145} skin="#f3d2b3" hair="#4a2e20" kid />
        </g>
        {Array.from({length: 14}).map((_, k) => {
          const t0 = 30 + k * 9, prog = (f - t0) / 70;
          if (prog < 0 || prog > 1 || f > D - 30) return null;
          const wx = [-195, -127, -59, 9, 77, 145][k % 6];
          const ca = Math.cos((-8 * Math.PI) / 180), sa = Math.sin((-8 * Math.PI) / 180);
          const sx = px + 1.3 * (wx * ca + 6 * sa), sy = py + 1.3 * (wx * sa - 6 * ca);
          const dx = 160 + (k % 3) * 120, dy = -420 - (k % 4) * 90;
          return <g key={k} opacity={Math.sin(prog * Math.PI)}><Beso x={sx + dx * prog + Math.sin(prog * 9 + k) * 26} y={sy + dy * prog} s={0.4 + prog * 1.0} tipo={k} rot={Math.sin(prog * 7 + k) * 16} /></g>;
        })}
        {[0, 1, 2].map((k) => {
          const tt = f - (46 + k * 40);
          if (tt < 0 || tt > 30) return null;
          return <text key={k} x={470 + k * 120} y={880 - k * 90 - tt * 3} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={70} fill={P.coral} stroke={P.ink} strokeWidth={2} opacity={Math.sin((tt / 30) * Math.PI)}>muá</text>;
        })}
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
  const logos: [string, number][] = [['airbnb', 190], ['booking', 280], ['despegar', 200], ['hotels', 260], ['tripadvisor', 260]];
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${P.purple}, ${P.purpleDeep} 55%, ${P.purpleDark})`}}>
      <Sketch>
        {Array.from({length: 22}).map((_, i) => <Destello key={i} x={random(`cx${i}`) * W} y={random(`cy${i}`) * H} r={6 + Math.max(0, Math.sin(f / 7 + i * 1.9)) * 18} c={i % 3 ? P.goldSoft : P.white} />)}
      </Sketch>
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('img/logo.jpeg')} style={{width: 400, borderRadius: 36, border: `5px solid ${P.goldSoft}`, transform: `scale(${logo}) rotate(${(1 - logo) * -10}deg)`, boxShadow: '0 20px 60px rgba(0,0,0,.4)'}} />
      </div>
      <div style={{position: 'absolute', top: 880, left: 50, right: 50, textAlign: 'center'}}>
        <div style={{opacity: line(34), fontFamily: hand, fontWeight: 700, fontSize: 96, color: P.goldSoft, lineHeight: 1}}>¡Hasta pronto, Camilo y familia!</div>
        <div style={{opacity: line(46), marginTop: 30, fontFamily: outfit, fontWeight: 600, fontSize: 54, color: P.white, letterSpacing: '0.06em'}}>77rentals.com</div>
        <div style={{opacity: line(54), marginTop: 26, display: 'inline-block', background: P.gold, border: `4px solid ${P.ink}`, borderRadius: 999, padding: '14px 38px', fontFamily: outfit, fontWeight: 600, fontSize: 42, color: P.purpleDark}}>WhatsApp +57 304 673 6241</div>
        <div style={{opacity: line(62), marginTop: 16, fontFamily: hand, fontWeight: 600, fontSize: 56, color: P.goldSoft}}>Claudia · tu anfitriona</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1470, opacity: line(70), transform: `translateY(${(1 - line(70)) * 40}px)`}}>
        <div style={{textAlign: 'center', fontFamily: outfit, fontWeight: 600, fontSize: 30, letterSpacing: '0.2em', color: P.goldSoft, marginBottom: 12}}>ENCUÉNTRANOS EN</div>
        <div style={{background: P.white, border: `5px solid ${P.ink}`, borderRadius: 38, padding: '22px 30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '18px 34px', boxShadow: `8px 10px 0 ${P.purple}`}}>
          {logos.map(([n, w]) => <Img key={n} src={staticFile(`plataformas/${n}.svg`)} style={{width: w}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
