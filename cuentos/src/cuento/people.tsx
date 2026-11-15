import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {LOOKS, P, ln, type PersonLook} from '../story/kit';
import {BabyHeld} from '../surf/gente';

export const MOM = {skin: '#c98d68', dress: '#e8866a', dressLight: '#f6b9a3', hair: '#2c1c18', hat: '#fff1cf'};
export const DAD_NO_HAT = {...LOOKS.dad, hat: false};

/* Who is in the story. Scenes read this, so a guest welcome can swap in its own family. */
export type Kid = {look: PersonLook; s: number};
/** puerta: number painted on the door in the 'puerta' scene (default '717'; '' hides it). */
export type Cast = {kids: Kid[]; dog: boolean; toddler?: boolean; title: string; checkin?: string; puerta?: string};
export const CUENTO_CAST: Cast = {kids: [{look: LOOKS.girl, s: 1}, {look: LOOKS.boy, s: 1}], dog: true, title: 'Macondo en Delventto'};
export const CastCtx = createContext<Cast>(CUENTO_CAST);
export const useCast = () => useContext(CastCtx);

/* Mom's head: wavy shoulder-length hair, lashes, earring, optional sun hat. Looks toward +x. */
export const MomHead: React.FC<{
  y?: number; r?: number; smile?: 'open' | 'soft'; asleep?: boolean; hat?: boolean; breeze?: number; skin?: string; band?: string;
}> = ({y = 0, r = 58, smile = 'soft', asleep, hat, breeze = 0, skin = MOM.skin, band = MOM.dress}) => {
  const frame = useCurrentFrame();
  const blink = asleep || (frame + 37) % 96 < 4;
  const sway = -breeze * (9 + Math.sin(frame / 6) * 5);
  return (
    <g transform={`translate(0 ${y}) scale(${r / 58})`}>
      {/* hair falling behind the shoulders */}
      <g transform={`skewX(${sway})`}>
        <path
          d="M22 -60 C-40 -80 -80 -42 -73 8 C-70 40 -86 62 -72 92 C-62 108 -46 104 -42 94 C-32 110 -12 104 -10 88 C-4 62 -14 30 -8 0 Z"
          fill={MOM.hair}
          {...ln}
        />
        <path d="M-56 30 Q-62 60 -52 84" stroke="#4a3128" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M-34 44 Q-38 70 -28 90" stroke="#4a3128" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      <circle cx={0} cy={0} r={56} fill={skin} {...ln} />
      {/* side-swept fringe */}
      <path d="M-57 -6 Q-60 -66 0 -63 Q52 -62 57 -12 Q42 -42 14 -38 Q-22 -34 -38 -4 Q-48 8 -57 -6 Z" fill={MOM.hair} {...ln} />
      {/* earring */}
      <circle cx={-27} cy={31} r={7} fill={P.gold} stroke={P.ink} strokeWidth={3} />
      {hat && (
        <g transform="rotate(-5)">
          <ellipse cx={-2} cy={-36} rx={108} ry={21} fill={MOM.hat} {...ln} />
          <path d="M-48 -40 Q-44 -100 0 -100 Q44 -100 48 -40 Z" fill={MOM.hat} {...ln} />
          <path d="M-47 -54 Q0 -46 47 -54" stroke={band} strokeWidth={11} fill="none" />
          <path d="M-46 -52 q-22 -6 -26 10 q14 2 26 -10 Z" fill={MOM.dress} stroke={P.ink} strokeWidth={3} />
        </g>
      )}
      {/* brows */}
      <path d="M4 -10 q9 -6 17 -2" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M29 -10 q9 -5 16 0" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
      {blink ? (
        <>
          <path d="M4 8 q8 5 17 0" stroke={P.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M28 8 q8 5 17 0" stroke={P.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M19 10 l5 4 M43 10 l5 4" stroke={P.ink} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={12} cy={6} rx={6} ry={8} fill={P.ink} />
          <ellipse cx={36} cy={6} rx={6} ry={8} fill={P.ink} />
          {/* lashes */}
          <path d="M16 -2 l6 -6 M19 2 l7 -3 M40 -2 l6 -6 M43 2 l7 -3" stroke={P.ink} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      <circle cx={0} cy={26} r={10} fill={P.coral} opacity={0.5} />
      <circle cx={48} cy={26} r={8} fill={P.coral} opacity={0.5} />
      {smile === 'open' ? (
        <path d="M14 30 Q26 50 40 30 Z" fill="#a8403f" stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
      ) : (
        <path d="M15 32 Q27 43 39 32" stroke="#a8403f" strokeWidth={5.5} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

/* Mom: her own silhouette — summer dress, slimmer limbs, sandals. (x,y) = feet. */
export const Mom: React.FC<{
  x: number; y: number; s?: number; walk?: number; face?: 1 | -1; wave?: boolean; armsUp?: boolean;
  reach?: boolean; jump?: number; smile?: 'open' | 'soft'; hat?: boolean; breeze?: number;
  skin?: string; dress?: string; dressLight?: string; baby?: boolean; waveBack?: boolean;
}> = ({x, y, s = 1, walk = 0, face = 1, wave, armsUp, reach, jump = 0, smile = 'soft', hat, breeze = 0, skin = MOM.skin, dress = MOM.dress, dressLight = MOM.dressLight, baby, waveBack}) => {
  const frame = useCurrentFrame();
  const sw = walk ? Math.sin(walk * 0.35) * 24 : 0;
  const bob = walk ? Math.abs(Math.sin(walk * 0.35)) * 8 : 0;
  const armBack = waveBack ? 150 + Math.sin(frame * 0.4) * 20 : armsUp ? 152 : -sw;
  const armFront = armsUp ? -152 : wave ? -150 + Math.sin(frame * 0.4) * 22 : reach ? -78 : sw;
  const hem = sw * 0.3 - breeze * (12 + Math.sin(frame / 5) * 7);
  const arm = (
    <>
      <line x1={0} y1={0} x2={0} y2={108} stroke={P.ink} strokeWidth={27} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={108} stroke={skin} strokeWidth={18} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={26} stroke={dress} strokeWidth={19} strokeLinecap="round" />
    </>
  );
  return (
    <g transform={`translate(${x} ${y - bob - jump}) scale(${s * face} ${s})`}>
      {[sw * 0.7, -sw * 0.7].map((a, i) => (
        <g key={i} transform={`translate(${i ? 14 : -14} -150) rotate(${a})`}>
          <line x1={0} y1={0} x2={0} y2={138} stroke={P.ink} strokeWidth={29} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={138} stroke={skin} strokeWidth={20} strokeLinecap="round" />
          <ellipse cx={10} cy={148} rx={23} ry={11} fill={P.gold} stroke={P.ink} strokeWidth={4} />
        </g>
      ))}
      <g transform={`translate(-44 -290) rotate(${armBack + 8})`}>{arm}</g>
      {/* dress: narrow shoulders, waist, flared skirt */}
      <path
        d={`M-46 -306 Q0 -322 46 -306 Q56 -262 40 -228 Q72 -170 ${90 + hem} -112 Q${46 + hem} -98 ${hem * 0.6} -108 Q${-46 + hem} -98 ${-90 + hem} -112 Q-72 -170 -40 -228 Q-56 -262 -46 -306 Z`}
        fill={dress}
        {...ln}
      />
      <path d={`M${-80 + hem} -124 Q${-40 + hem} -112 ${hem * 0.6} -122 Q${42 + hem} -112 ${80 + hem} -124`} stroke={dressLight} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-41 -234 Q0 -224 41 -234 L40 -217 Q0 -207 -40 -217 Z" fill={P.gold} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-20 -314 Q0 -290 20 -314 Z" fill={skin} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
      <g transform={`translate(44 -290) rotate(${armFront - 8})`}>{arm}</g>
      <MomHead y={-364} smile={smile} hat={hat} breeze={breeze} skin={skin} band={dress} />
      {baby && <BabyHeld handSkin={skin} />}
    </g>
  );
};
