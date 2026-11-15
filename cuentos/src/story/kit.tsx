import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, Easing} from 'remotion';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';
import {outfit} from '../theme';

export const hand = loadCaveat('normal', {weights: ['600', '700'], subsets: ['latin']}).fontFamily;

/* Storybook watercolor palette */
export const P = {
  ink: '#3b2438',
  paper: '#fbf3e4',
  sky: '#bfe3ec',
  skyWarm: '#f9d9b8',
  sea: '#5fb3c1',
  seaDeep: '#2f8a9b',
  sand: '#f1d8a6',
  leaf: '#7fb069',
  leafDark: '#4f8a4a',
  mountain: '#6a9c78',
  mountainFar: '#a7c4b0',
  purple: '#8B3FA1',
  purpleDeep: '#5E2370',
  purpleDark: '#3A1248',
  gold: '#E3B23C',
  goldSoft: '#F2D58A',
  coral: '#e8866a',
  white: '#fffaf2',
};

export const W = 1080;
export const H = 1920;

/* Global SVG filters: "boiling" hand-drawn line + paper grain. Rendered once per frame. */
export const Filters: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 4) % 5; // redraw wobble every 4 frames, like drawn animation
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={seed + 11} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.2  0 0 0 0.55 0" />
        </filter>
        <filter id="blotch">
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={8} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0.35 0" />
        </filter>
      </defs>
    </svg>
  );
};

/* Paper texture overlay on top of everything */
export const Paper: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width={W} height={H} style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.35}}>
      <rect width={W} height={H} filter="url(#blotch)" />
    </svg>
    <svg width={W} height={H} style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.22}}>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(80,40,30,.35)'}} />
  </AbsoluteFill>
);

/* A drawn layer: all shapes inside get the wobble */
export const Sketch: React.FC<{children: React.ReactNode; wash?: boolean}> = ({children, wash}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', overflow: 'visible'}}>
    <g filter={`url(#${wash ? 'wash' : 'sketch'})`}>{children}</g>
  </svg>
);

export const ln = {stroke: P.ink, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/* ───────── Characters ───────── */
export type PersonLook = {
  skin: string;
  shirt: string;
  pants: string;
  hair: string;
  hairStyle: 'short' | 'long' | 'bun' | 'curly';
  kid?: boolean;
  hat?: boolean;
};

export const LOOKS: Record<'dad' | 'mom' | 'girl' | 'boy', PersonLook> = {
  dad: {skin: '#d9a47c', shirt: '#5fb3c1', pants: '#e9dcc0', hair: '#3b2a22', hairStyle: 'short', hat: true},
  mom: {skin: '#c98d68', shirt: '#e8866a', pants: '#8B3FA1', hair: '#2c1c18', hairStyle: 'long'},
  girl: {skin: '#d29a72', shirt: '#F2D58A', pants: '#7fb069', hair: '#3b2418', hairStyle: 'bun', kid: true},
  boy: {skin: '#d9a47c', shirt: '#8B3FA1', pants: '#5fb3c1', hair: '#4a2e20', hairStyle: 'curly', kid: true},
};

/* A cut-out puppet. (x,y) = feet. walk = phase in frames (0 = standing). */
export const Person: React.FC<{
  look: PersonLook; x: number; y: number; s?: number; walk?: number; face?: 1 | -1;
  wave?: boolean; armsUp?: boolean; jump?: number; smile?: 'open' | 'soft';
}> = ({look, x, y, s = 1, walk = 0, face = 1, wave, armsUp, jump = 0, smile = 'soft'}) => {
  const frame = useCurrentFrame();
  const k = look.kid ? 0.66 : 1;
  const sw = walk ? Math.sin(walk * 0.35) * 28 : 0;
  const bob = walk ? Math.abs(Math.sin(walk * 0.35)) * 8 : 0;
  const waveA = wave ? -140 + Math.sin(frame * 0.4) * 25 : null;
  const armL = armsUp ? -150 : waveA ?? -sw;
  const armR = armsUp ? 150 : sw;
  return (
    <g transform={`translate(${x} ${y - bob - jump}) scale(${s * k * face} ${s * k})`}>
      {/* legs */}
      {[sw, -sw].map((a, i) => (
        <g key={i} transform={`translate(${i ? 14 : -14} -150) rotate(${a})`}>
          <line x1={0} y1={0} x2={0} y2={140} stroke={P.ink} strokeWidth={40} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={140} stroke={look.pants} strokeWidth={30} strokeLinecap="round" />
          <ellipse cx={12} cy={150} rx={27} ry={14} fill={P.ink} />
        </g>
      ))}
      {/* back arm */}
      <g transform={`translate(-62 -285) rotate(${armL + 10})`}>
        <line x1={0} y1={0} x2={0} y2={110} stroke={P.ink} strokeWidth={34} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={60} stroke={look.shirt} strokeWidth={25} strokeLinecap="round" />
        <line x1={0} y1={60} x2={0} y2={110} stroke={look.skin} strokeWidth={25} strokeLinecap="round" />
      </g>
      {/* torso */}
      <path d="M-62 -305 Q0 -325 62 -305 Q78 -220 70 -140 Q0 -125 -70 -140 Q-78 -220 -62 -305 Z" fill={look.shirt} {...ln} />
      {/* front arm */}
      <g transform={`translate(62 -285) rotate(${armR - 10})`}>
        <line x1={0} y1={0} x2={0} y2={110} stroke={P.ink} strokeWidth={34} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={60} stroke={look.shirt} strokeWidth={25} strokeLinecap="round" />
        <line x1={0} y1={60} x2={0} y2={110} stroke={look.skin} strokeWidth={25} strokeLinecap="round" />
      </g>
      <Head look={look} y={-360} smile={smile} />
    </g>
  );
};

export const Head: React.FC<{look: PersonLook; y?: number; smile?: 'open' | 'soft'; r?: number; asleep?: boolean}> = ({look, y = 0, smile = 'soft', r = 58, asleep}) => {
  const frame = useCurrentFrame();
  const blink = asleep || frame % 90 < 4;
  return (
    <g transform={`translate(0 ${y}) scale(${r / 58})`}>
      {look.hairStyle === 'long' && <path d="M-62 -10 Q-70 70 -40 80 L40 80 Q70 70 62 -10 Z" fill={look.hair} {...ln} />}
      {look.hairStyle === 'bun' && <circle cx={0} cy={-68} r={24} fill={look.hair} {...ln} />}
      <circle cx={0} cy={0} r={58} fill={look.skin} {...ln} />
      {/* hair cap */}
      {look.hairStyle === 'curly' ? (
        [-40, -20, 0, 20, 40].map((hx) => <circle key={hx} cx={hx} cy={-44 + Math.abs(hx) * 0.35} r={20} fill={look.hair} {...ln} strokeWidth={4} />)
      ) : (
        <path d="M-58 -4 Q-56 -62 0 -62 Q56 -62 58 -4 Q30 -30 -10 -28 Q-40 -24 -58 -4 Z" fill={look.hair} {...ln} />
      )}
      {look.hat && (
        <g>
          <ellipse cx={0} cy={-38} rx={90} ry={16} fill="#f3d38a" {...ln} />
          <path d="M-45 -40 Q-40 -95 0 -95 Q40 -95 45 -40 Z" fill="#f3d38a" {...ln} />
          <path d="M-44 -52 Q0 -46 44 -52" stroke={P.purple} strokeWidth={9} fill="none" />
        </g>
      )}
      {/* face (looks toward +x) */}
      {blink ? (
        <>
          <path d="M4 8 q8 4 16 0" stroke={P.ink} strokeWidth={4} fill="none" />
          <path d="M28 8 q8 4 16 0" stroke={P.ink} strokeWidth={4} fill="none" />
        </>
      ) : (
        <>
          <ellipse cx={12} cy={6} rx={6} ry={8} fill={P.ink} />
          <ellipse cx={36} cy={6} rx={6} ry={8} fill={P.ink} />
        </>
      )}
      <circle cx={0} cy={26} r={10} fill={P.coral} opacity={0.45} />
      <circle cx={48} cy={26} r={8} fill={P.coral} opacity={0.45} />
      {smile === 'open' ? (
        <path d="M14 30 Q26 50 40 30 Z" fill="#8a3a3a" stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
      ) : (
        <path d="M14 32 Q26 44 40 32" stroke={P.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

/* The family dog: a little golden mutt */
export const Dog: React.FC<{x: number; y: number; s?: number; walk?: number; face?: 1 | -1; headOnly?: boolean}> = ({x, y, s = 1, walk = 0, face = 1, headOnly}) => {
  const frame = useCurrentFrame();
  const wag = Math.sin(frame * 0.8) * 25;
  const sw = walk ? Math.sin(walk * 0.5) * 22 : 0;
  const bob = walk ? Math.abs(Math.sin(walk * 0.5)) * 6 : 0;
  const head = (
    <g transform="translate(62 -92)">
      <path d="M-18 -30 Q-40 -10 -26 22 Q-10 10 -8 -20 Z" fill="#b5793f" {...ln} />
      <circle cx={0} cy={0} r={34} fill="#e2b06a" {...ln} />
      <ellipse cx={30} cy={10} rx={20} ry={15} fill="#f4dcae" {...ln} />
      <ellipse cx={44} cy={4} rx={7} ry={6} fill={P.ink} />
      <circle cx={10} cy={-8} r={5} fill={P.ink} />
      <path d="M22 26 q8 12 16 0" fill="#e87a7a" stroke={P.ink} strokeWidth={3} />
    </g>
  );
  if (headOnly) return <g transform={`translate(${x} ${y}) scale(${s * face} ${s}) translate(-62 92)`}>{head}</g>;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s * face} ${s})`}>
      <path d={`M-60 -70 q-30 ${-20 + wag * 0.4} -40 ${-40 + wag}`} stroke={P.ink} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d={`M-60 -70 q-30 ${-20 + wag * 0.4} -40 ${-40 + wag}`} stroke="#e2b06a" strokeWidth={7} strokeLinecap="round" fill="none" />
      {[[-40, sw], [-20, -sw], [30, -sw], [50, sw]].map(([lx, a], i) => (
        <g key={i} transform={`translate(${lx} -45) rotate(${a})`}>
          <line x1={0} y1={0} x2={0} y2={45} stroke={P.ink} strokeWidth={20} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={45} stroke="#d9a35d" strokeWidth={12} strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx={5} cy={-65} rx={72} ry={36} fill="#e2b06a" {...ln} />
      <ellipse cx={-5} cy={-80} rx={30} ry={14} fill="#f4dcae" opacity={0.7} />
      {head}
    </g>
  );
};

/* Yellow Macondo butterfly, drawn style */
export const Fly: React.FC<{x: number; y: number; s?: number; phase?: number; rot?: number}> = ({x, y, s = 1, phase = 0, rot = 0}) => {
  const frame = useCurrentFrame();
  const flap = 0.3 + 0.7 * Math.abs(Math.cos((frame + phase) * 0.5));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <g transform={`scale(${flap} 1)`}>
        <path d="M0 0 C-25 -35 -50 -25 -35 0 C-50 25 -25 35 0 0 C25 35 50 25 35 0 C50 -25 25 -35 0 0Z" fill="#f7d54a" stroke={P.ink} strokeWidth={3} />
      </g>
      <line x1={0} y1={-14} x2={0} y2={16} stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/* Fluffy cloud */
export const Cloud: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 30 Q-160 20 -120 -15 Q-110 -70 -40 -55 Q0 -100 55 -62 Q115 -75 115 -15 Q160 5 125 35 Q100 65 60 50 Q20 75 -20 52 Q-70 72 -110 30 Z" fill={P.white} {...ln} strokeWidth={4} />
  </g>
);

/* Palm tree, swaying */
export const Palm: React.FC<{x: number; y: number; s?: number; phase?: number}> = ({x, y, s = 1, phase = 0}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin((frame + phase) / 22) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${sway})`}>
        <path d="M-10 0 Q-20 -160 20 -330 L36 -328 Q0 -160 12 0 Z" fill="#a8744a" {...ln} />
        {[-150, -110, -60, -20, 25, 70].map((a, i) => (
          <path key={i} transform={`translate(28 -330) rotate(${a + sway * 2})`} d="M0 0 Q70 -40 150 10 Q80 -10 0 0 Z" fill={i % 2 ? P.leaf : P.leafDark} {...ln} strokeWidth={4} />
        ))}
      </g>
    </g>
  );
};

/* Hand-lettered banner text */
export const Banner: React.FC<{children: React.ReactNode; delay?: number; y?: number; size?: number; sub?: string}> = ({children, delay = 0, y = 170, size = 104, sub}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, p * 1.5), transform: `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * -4}deg)`}}>
      <div style={{background: P.white, border: `5px solid ${P.ink}`, borderRadius: '28px 36px 30px 40px', padding: '14px 44px 20px', boxShadow: `8px 10px 0 ${P.purple}`, transform: 'rotate(-1.5deg)'}}>
        <div style={{fontFamily: hand, fontWeight: 700, fontSize: size, color: P.purpleDeep, lineHeight: 1, textAlign: 'center'}}>{children}</div>
      </div>
      {sub && (
        <div style={{marginTop: 26, background: P.gold, border: `4px solid ${P.ink}`, borderRadius: 999, padding: '10px 32px', fontFamily: outfit, fontWeight: 600, fontSize: 44, color: P.purpleDark, transform: 'rotate(1deg)'}}>{sub}</div>
      )}
    </div>
  );
};

export const rand = (s: string) => random(s);
