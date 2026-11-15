/* Puppets for the Camilo 1204 story, in the same cut-out style as Person/Mom:
   Pers = an adult or kid that can wear beach clothes (trunks, swimsuit and pareo) or travel clothes (tee, jeans, sneakers),
   BabyHeld = the baby in mom's arms, Cochecito = the stroller with the baby inside, MamaCoche = mom pushing it. */
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Head, P, ln, type PersonLook} from '../story/kit';
import {Mom} from '../cuento/people';

export type Ropa = {
  skin: string; hair: string; hairStyle: PersonLook['hairStyle'];
  top: string; topStyle: 'bare' | 'tee' | 'suit';
  bottom: string; bottomStyle: 'trunks' | 'jeans' | 'pareo';
  zapato: 'chancla' | 'tenis'; zapatoColor?: string;
  gorro?: 'vueltiao' | 'gorra' | 'pescador'; gorroColor?: string; gafas?: boolean; mochila?: string; kid?: boolean;
};

const SK = {camilo: '#ebc6a0', tia: '#e4b690', nino: '#efcdab', mama: '#ecc19c', bebe: '#f3d2b3'};
export const PLAYA: Record<'camilo' | 'tia' | 'tia2' | 'nino', Ropa> = {
  camilo: {skin: SK.camilo, hair: '#3b2a22', hairStyle: 'short', top: P.purple, topStyle: 'bare', bottom: P.purpleDeep, bottomStyle: 'trunks', zapato: 'chancla', zapatoColor: P.gold, gorro: 'vueltiao', gafas: true},
  tia: {skin: SK.tia, hair: '#2c1c18', hairStyle: 'curly', top: P.sea, topStyle: 'suit', bottom: P.white, bottomStyle: 'pareo', zapato: 'chancla', zapatoColor: P.gold},
  tia2: {skin: '#eac4a0', hair: '#5a3a2a', hairStyle: 'long', top: P.leaf, topStyle: 'suit', bottom: P.white, bottomStyle: 'pareo', zapato: 'chancla', zapatoColor: P.coral},
  nino: {skin: SK.nino, hair: '#4a2e20', hairStyle: 'curly', top: P.gold, topStyle: 'bare', bottom: P.gold, bottomStyle: 'trunks', zapato: 'chancla', zapatoColor: P.sea, gorro: 'pescador', gorroColor: P.coral, kid: true},
};
export const VIAJE: Record<'camilo' | 'tia' | 'tia2' | 'nino', Ropa> = {
  camilo: {skin: SK.camilo, hair: '#3b2a22', hairStyle: 'short', top: P.purple, topStyle: 'tee', bottom: '#6b8fb5', bottomStyle: 'jeans', zapato: 'tenis', gorro: 'gorra'},
  tia: {skin: SK.tia, hair: '#2c1c18', hairStyle: 'curly', top: P.sea, topStyle: 'tee', bottom: P.purpleDeep, bottomStyle: 'jeans', zapato: 'tenis'},
  tia2: {skin: '#eac4a0', hair: '#5a3a2a', hairStyle: 'long', top: P.leaf, topStyle: 'tee', bottom: '#6b8fb5', bottomStyle: 'jeans', zapato: 'tenis'},
  nino: {skin: SK.nino, hair: '#4a2e20', hairStyle: 'curly', top: P.goldSoft, topStyle: 'tee', bottom: '#6b8fb5', bottomStyle: 'jeans', zapato: 'tenis', mochila: P.coral, kid: true},
};
export const MAMA = {playa: {skin: SK.mama, dress: P.coral, dressLight: '#f6b9a3', hat: true}, viaje: {skin: SK.mama, dress: '#8fc1a4', dressLight: '#c3e0cf', hat: false}};

const Sombrero: React.FC<{tipo: NonNullable<Ropa['gorro']>; color?: string}> = ({tipo, color}) => {
  if (tipo === 'vueltiao')
    return (
      <g>
        <ellipse cx={0} cy={-38} rx={90} ry={16} fill="#f3d38a" {...ln} />
        <path d="M-45 -40 Q-40 -95 0 -95 Q40 -95 45 -40 Z" fill="#f3d38a" {...ln} />
        <path d="M-44 -52 Q0 -46 44 -52" stroke={P.purple} strokeWidth={9} fill="none" />
      </g>
    );
  if (tipo === 'gorra')
    return (
      <g>
        <path d="M-54 -26 Q-52 -92 0 -92 Q52 -92 54 -26 Z" fill="#fffaf2" {...ln} />
        <path d="M-52 -42 Q0 -34 52 -42" stroke={P.gold} strokeWidth={9} fill="none" />
        <ellipse cx={14} cy={-26} rx={68} ry={13} fill="#fffaf2" {...ln} />
      </g>
    );
  return (
    <g>
      <path d="M-48 -34 Q-46 -92 0 -92 Q46 -92 48 -34 Z" fill={color ?? P.sea} {...ln} />
      <ellipse cx={0} cy={-34} rx={84} ry={15} fill={color ?? P.sea} {...ln} />
      <path d="M-46 -52 Q0 -46 46 -52" stroke={P.white} strokeWidth={8} fill="none" />
    </g>
  );
};

/* A cut-out person. (x,y) = feet. aL/aR = arm angle in degrees: 0 hangs, 90 sideways, 150 up.
   holdL/holdR = something in the hand (kept upright). look = -1..1 turns the head side to side. */
export const Pers: React.FC<{
  r: Ropa; x: number; y: number; s?: number; walk?: number; aL?: number; aR?: number; wave?: boolean; jump?: number;
  smile?: 'open' | 'soft'; look?: number; holdL?: React.ReactNode; holdR?: React.ReactNode; face?: 1 | -1;
}> = ({r, x, y, s = 1, walk = 0, aL, aR, wave, jump = 0, smile = 'soft', look = 0, holdL, holdR, face = 1}) => {
  const frame = useCurrentFrame();
  const k = r.kid ? 0.66 : 1;
  const sw = walk ? Math.sin(walk * 0.35) * 28 : 0;
  const bob = walk ? Math.abs(Math.sin(walk * 0.35)) * 8 : 0;
  const aLeft = aL ?? (wave ? 120 + Math.sin(frame * 0.4) * 25 : sw);
  const aRight = aR ?? -sw;
  const tee = r.topStyle === 'tee';
  const armLine = (ang: number, side: 1 | -1, hold?: React.ReactNode) => {
    const rot = side === -1 ? ang : -ang;
    return (
      <g transform={`translate(${side * 62} -285) rotate(${rot + (side === -1 ? 8 : -8)})`}>
        <line x1={0} y1={0} x2={0} y2={110} stroke={P.ink} strokeWidth={34} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={110} stroke={r.skin} strokeWidth={25} strokeLinecap="round" />
        {tee && <line x1={0} y1={0} x2={0} y2={58} stroke={r.top} strokeWidth={25} strokeLinecap="round" />}
        {hold && <g transform={`translate(0 112) rotate(${-(rot + (side === -1 ? 8 : -8))})`}>{hold}</g>}
      </g>
    );
  };
  const legColor = r.bottomStyle === 'jeans' ? r.bottom : r.skin;
  return (
    <g transform={`translate(${x} ${y - bob - jump}) scale(${s * k * face} ${s * k})`}>
      {r.mochila && <rect x={-78} y={-292} width={156} height={140} rx={34} fill={r.mochila} {...ln} />}
      {[sw, -sw].map((a, i) => (
        <g key={i} transform={`translate(${i ? 14 : -14} -150) rotate(${a})`}>
          <line x1={0} y1={0} x2={0} y2={140} stroke={P.ink} strokeWidth={40} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={140} stroke={legColor} strokeWidth={30} strokeLinecap="round" />
          {r.bottomStyle === 'trunks' && (
            <>
              <line x1={0} y1={0} x2={0} y2={74} stroke={P.ink} strokeWidth={42} strokeLinecap="round" />
              <line x1={0} y1={0} x2={0} y2={74} stroke={r.bottom} strokeWidth={32} strokeLinecap="round" />
              <line x1={0} y1={6} x2={0} y2={66} stroke={P.white} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
            </>
          )}
          {r.zapato === 'tenis' ? (
            <>
              <ellipse cx={12} cy={150} rx={30} ry={15} fill={P.white} {...ln} strokeWidth={4} />
              <path d="M-14 152 Q12 166 40 152" stroke={r.top} strokeWidth={6} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx={12} cy={152} rx={28} ry={11} fill={r.zapatoColor ?? P.gold} {...ln} strokeWidth={4} />
              <path d="M2 146 Q14 130 28 146" stroke={P.ink} strokeWidth={4} fill="none" />
            </>
          )}
        </g>
      ))}
      {armLine(aLeft, -1, holdL)}
      {/* torso */}
      <path d="M-62 -305 Q0 -325 62 -305 Q78 -220 70 -140 Q0 -125 -70 -140 Q-78 -220 -62 -305 Z" fill={tee ? r.top : r.skin} {...ln} />
      {r.topStyle === 'suit' && (
        <>
          <path d="M-52 -296 Q0 -312 52 -296 Q64 -230 70 -142 Q0 -128 -70 -142 Q-64 -230 -52 -296 Z" fill={r.top} {...ln} />
          <path d="M-28 -308 Q0 -262 28 -308 Z" fill={r.skin} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
        </>
      )}
      {tee && <path d="M-26 -312 Q0 -284 26 -312" stroke={P.ink} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.55} />}
      {r.bottomStyle === 'trunks' && (
        <>
          <path d="M-72 -188 Q0 -172 72 -188 L71 -140 Q0 -124 -71 -140 Z" fill={r.bottom} {...ln} />
          <path d="M-68 -176 Q0 -160 68 -176" stroke={P.white} strokeWidth={6} fill="none" opacity={0.85} />
        </>
      )}
      {r.bottomStyle === 'jeans' && <path d="M-72 -176 Q0 -162 72 -176 L71 -140 Q0 -124 -71 -140 Z" fill={r.bottom} {...ln} />}
      {r.bottomStyle === 'pareo' && (
        <g>
          <path d="M-86 -92 Q-100 -150 -70 -200 Q0 -184 70 -200 Q100 -150 86 -92 Q0 -74 -86 -92 Z" fill={P.white} {...ln} />
          {[-48, -16, 16, 48].map((px) => <path key={px} d={`M${px} -190 Q${px * 1.25} -140 ${px * 1.4} -86`} stroke={r.top} strokeWidth={9} fill="none" opacity={0.7} />)}
          <path d="M-72 -200 Q0 -184 72 -200" stroke={r.top} strokeWidth={10} fill="none" />
        </g>
      )}
      {r.mochila && (
        <>
          <path d="M-44 -304 L-48 -196 M44 -304 L48 -196" stroke={r.mochila} strokeWidth={13} strokeLinecap="round" />
          <path d="M-44 -304 L-48 -196 M44 -304 L48 -196" stroke={P.ink} strokeWidth={3} strokeLinecap="round" opacity={0.5} fill="none" />
        </>
      )}
      {armLine(aRight, 1, holdR)}
      <g transform={`rotate(${look * 10} 0 -300) translate(${look * 11} 0)`}>
        <Head look={{skin: r.skin, shirt: r.top, pants: r.bottom, hair: r.hair, hairStyle: r.hairStyle, kid: r.kid}} y={-360} smile={smile} />
        <g transform="translate(0 -360)">
          {r.gafas && !r.gorro && null}
          {r.gorro && <Sombrero tipo={r.gorro} color={r.gorroColor} />}
          {r.gafas && (
            <g transform={`translate(0 ${r.gorro === 'vueltiao' ? -52 : -56})`}>
              <rect x={-34} y={-12} width={30} height={19} rx={9} fill={P.ink} />
              <rect x={4} y={-12} width={30} height={19} rx={9} fill={P.ink} />
              <path d="M-4 -4 H4" stroke={P.ink} strokeWidth={4} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};

/* the baby in mom's arms: swaddled, face always clear, a little waving hand, mom's hand underneath */
export const BabyHeld: React.FC<{handSkin?: string}> = ({handSkin = SK.mama}) => {
  const f = useCurrentFrame();
  const blink = (f + 21) % 110 < 4;
  const wv = Math.sin(f * 0.33) * 24;
  return (
    <g transform="translate(34 -230)">
      <path d="M-32 0 Q-36 64 0 74 Q36 64 32 0 Q0 -14 -32 0 Z" fill="#fff6e0" {...ln} strokeWidth={4} />
      <path d="M-28 26 Q0 40 28 26" stroke={P.coral} strokeWidth={8} fill="none" strokeLinecap="round" />
      <g transform={`translate(30 4) rotate(${-95 + wv})`}>
        <line x1={0} y1={0} x2={0} y2={32} stroke={P.ink} strokeWidth={17} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={32} stroke={SK.bebe} strokeWidth={10} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={-34} r={31} fill={SK.bebe} {...ln} strokeWidth={4} />
      <path d="M-30 -42 Q-24 -72 0 -70 Q24 -72 30 -42 Q12 -56 0 -52 Q-14 -56 -30 -42 Z" fill="#4a2e20" {...ln} strokeWidth={3} />
      {blink ? (
        <path d="M-17 -30 q6 4 12 0 M5 -30 q6 4 12 0" stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={-11} cy={-31} rx={4.5} ry={6} fill={P.ink} />
          <ellipse cx={11} cy={-31} rx={4.5} ry={6} fill={P.ink} />
        </>
      )}
      <circle cx={-20} cy={-20} r={6.5} fill={P.coral} opacity={0.5} />
      <circle cx={20} cy={-20} r={6.5} fill={P.coral} opacity={0.5} />
      <path d="M-8 -17 q8 9 16 0" stroke="#a8403f" strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={-6} cy={66} r={15} fill={handSkin} {...ln} strokeWidth={4} />
    </g>
  );
};

/* the stroller, seen from the side, facing +x; the baby sits inside under the hood. (x,y) = ground under it */
export const Cochecito: React.FC<{x: number; y: number; s?: number; roll?: number}> = ({x, y, s = 1, roll = 0}) => {
  const f = useCurrentFrame();
  const blink = (f + 40) % 120 < 4;
  const wheel = (cx: number, cy: number, rad: number) => (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={rad} fill={P.ink} />
      <circle r={rad - 9} fill={P.white} />
      <g transform={`rotate(${roll * 9})`}>{[0, 60, 120].map((a) => <line key={a} x1={0} y1={-(rad - 9)} x2={0} y2={rad - 9} stroke={P.ink} strokeWidth={4} transform={`rotate(${a})`} />)}</g>
      <circle r={7} fill={P.gold} stroke={P.ink} strokeWidth={3} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-62 -40 L-118 -220 M70 -36 L30 -120" stroke={P.ink} strokeWidth={13} strokeLinecap="round" />
      <path d="M-118 -220 L-176 -228" stroke={P.ink} strokeWidth={16} strokeLinecap="round" />
      <path d="M-118 -220 L-176 -228" stroke={P.gold} strokeWidth={8} strokeLinecap="round" />
      {wheel(-62, -38, 38)}
      {wheel(76, -32, 30)}
      <path d="M-112 -70 L-112 -158 Q-70 -184 40 -142 L96 -100 Q88 -72 38 -66 Z" fill={P.sea} {...ln} />
      <path d="M-112 -158 Q-124 -278 -16 -270 Q34 -258 46 -146 Z" fill={P.purple} {...ln} />
      <path d="M-102 -176 Q-20 -238 40 -158" stroke={P.gold} strokeWidth={9} fill="none" />
      <rect x={-52} y={-150} width={74} height={68} rx={26} fill="#fff6e0" {...ln} strokeWidth={4} />
      <circle cx={14} cy={-170} r={31} fill={SK.bebe} {...ln} strokeWidth={4} />
      <path d="M-14 -178 Q-8 -206 14 -204 Q36 -206 44 -178 Q26 -192 14 -188 Q0 -192 -14 -178 Z" fill="#4a2e20" {...ln} strokeWidth={3} />
      {blink ? (
        <path d="M10 -166 q6 4 12 0 M-6 -166 q5 4 10 0" stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={6} cy={-167} rx={4.5} ry={6} fill={P.ink} />
          <ellipse cx={26} cy={-167} rx={4.5} ry={6} fill={P.ink} />
        </>
      )}
      <circle cx={-2} cy={-156} r={6.5} fill={P.coral} opacity={0.5} />
      <circle cx={38} cy={-156} r={6.5} fill={P.coral} opacity={0.5} />
      <path d="M8 -153 q8 9 16 0" stroke="#a8403f" strokeWidth={4} fill="none" strokeLinecap="round" />
      <g transform={`translate(50 -134) rotate(${-40 + Math.sin(f * 0.33) * 22})`}>
        <line x1={0} y1={0} x2={0} y2={30} stroke={P.ink} strokeWidth={15} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={30} stroke={SK.bebe} strokeWidth={9} strokeLinecap="round" />
      </g>
      <path d="M-114 -92 Q-14 -64 98 -104 L96 -100 Q88 -72 38 -66 L-112 -70 Z" fill="#2f8a9b" {...ln} strokeWidth={4} />
    </g>
  );
};

/* mom pushing the stroller: she reaches forward to the handle */
export const MamaCoche: React.FC<{x: number; y: number; s?: number; walk?: number; dress?: string; dressLight?: string; skin?: string; smile?: 'open' | 'soft'}> = ({x, y, s = 1, walk = 0, dress, dressLight, skin, smile}) => (
  <g>
    <Mom x={x} y={y} s={s} walk={walk} reach hat={false} smile={smile} dress={dress} dressLight={dressLight} skin={skin} />
    <Cochecito x={x + 344 * s} y={y - 12 * s} s={1.2 * s} roll={walk} />
  </g>
);
