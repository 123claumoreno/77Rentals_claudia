import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, Easing} from 'remotion';
import {Banner, Cloud, Dog, Fly, Head, LOOKS, P, Palm, Sketch, W, ln} from './kit';

/* Big side-view plane with the family in the windows */
const Plane: React.FC<{x: number; y: number; s?: number; rot?: number; people?: boolean}> = ({x, y, s = 1, rot = 0, people = true}) => {
  const wins = [-200, -80, 40, 160, 280];
  const who = [LOOKS.dad, LOOKS.mom, LOOKS.girl, LOOKS.boy];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        {wins.map((wx, i) => (
          <clipPath key={i} id={`win${i}`}><circle cx={wx} cy={-10} r={42} /></clipPath>
        ))}
      </defs>
      {/* tail */}
      <path d="M-380 -30 L-460 -200 L-380 -200 L-300 -40 Z" fill={P.purple} {...ln} />
      <text x={-418} y={-150} fontFamily="Caveat" fontWeight={700} fontSize={56} fill={P.gold} transform="rotate(-8 -418 -150)">77</text>
      {/* back wing */}
      <path d="M-40 -40 L80 -150 L150 -150 L90 -40 Z" fill="#e9c35e" {...ln} />
      {/* fuselage */}
      <path d="M-420 -60 Q-420 -95 -360 -95 L380 -95 Q520 -90 540 10 Q520 80 380 85 L-360 85 Q-430 80 -420 -60 Z" fill={P.white} {...ln} />
      <path d="M-420 30 L530 30 Q520 80 380 85 L-360 85 Q-430 80 -420 30Z" fill={P.purple} opacity={0.9} />
      <path d="M-415 18 L535 18" stroke={P.gold} strokeWidth={10} />
      {/* cockpit */}
      <path d="M430 -60 Q500 -50 515 -10 L440 -10 Z" fill={P.sky} {...ln} strokeWidth={4} />
      {/* windows + passengers */}
      {wins.map((wx, i) => (
        <g key={i}>
          <circle cx={wx} cy={-10} r={42} fill="#d8eef3" />
          {people && (
            <g clipPath={`url(#win${i})`}>
              {i < 4 ? (
                <g transform={`translate(${wx - 12} ${14 + (who[i].kid ? 10 : 0)})`}><Head look={who[i]} r={who[i].kid ? 28 : 32} smile="open" /></g>
              ) : (
                <Dog x={wx - 8} y={18} s={0.7} headOnly />
              )}
            </g>
          )}
          <circle cx={wx} cy={-10} r={42} fill="none" {...ln} />
          <path d={`M${wx - 24} -30 q10 -10 22 -8`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
      {/* front wing */}
      <path d="M-60 40 L120 210 L200 210 L110 40 Z" fill={P.gold} {...ln} />
      <ellipse cx={120} cy={140} rx={40} ry={24} fill="#cfd6db" {...ln} />
    </g>
  );
};

/* Part A: cruising above the clouds */
const Cruise: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 14) * 12;
  const cloudsFar = [[-100, 420, 0.8], [500, 600, 0.6], [900, 330, 0.7], [1300, 520, 0.9]];
  const cloudsNear = [[200, 1500, 1.5], [900, 1650, 1.8], [1500, 1450, 1.4]];
  const px = interpolate(f, [0, 150], [470, 610]);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky} 0%, #d9eef0 45%, ${P.skyWarm} 100%)`}}>
      <Sketch wash>
        <circle cx={880} cy={330} r={110} fill="#fbe08a" />
        <circle cx={880} cy={330} r={160} fill="#fbe08a" opacity={0.3} />
      </Sketch>
      <Sketch>
        {cloudsFar.map(([x, y, s], i) => <Cloud key={i} x={((x - f * 2 + 2000) % 1600) - 200} y={y} s={s} />)}
        <Plane x={px - 20} y={1000 + bob} s={0.9} rot={-3 + Math.sin(f / 20) * 1.5} />
        <Fly x={px + 420 + Math.sin(f / 7) * 30} y={820 + bob + Math.cos(f / 9) * 30} s={1.1} rot={10} />
        {cloudsNear.map(([x, y, s], i) => <Cloud key={i} x={((x - f * 6 + 3000) % 2000) - 300} y={y} s={s} />)}
      </Sketch>
      <Banner delay={12} size={88} sub="Rumbo al Caribe colombiano">Destino: Santa Marta ✈️</Banner>
    </AbsoluteFill>
  );
};

/* Part B: descending over the Sierra and the sea, landing */
const Descent: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 110], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const px = interpolate(t, [0, 1], [-150, 700]);
  const py = interpolate(t, [0, 1], [700, 1395]);
  const rot = interpolate(t, [0, 0.85, 1], [10, 8, 0]);
  const roll = interpolate(f, [110, 160], [0, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #f6c9a0 0%, ${P.skyWarm} 35%, ${P.sky} 60%)`}}>
      <Sketch wash>
        {/* Sierra Nevada, far + snow */}
        <path d="M-50 1000 L180 560 L300 700 L470 430 L620 640 L780 480 L1130 1000 Z" fill={P.mountainFar} />
        <path d="M440 480 L470 430 L505 480 Q470 470 440 480 Z" fill="#fff" />
        <path d="M755 520 L780 480 L810 520 Q780 512 755 520 Z" fill="#fff" />
        {/* green hills */}
        <path d="M-50 1150 Q150 780 380 900 Q560 740 760 880 Q950 760 1130 900 L1130 1250 L-50 1250 Z" fill={P.mountain} />
        {/* sea */}
        <path d="M-50 1180 Q300 1150 600 1190 Q850 1220 1130 1180 L1130 1920 L-50 1920 Z" fill={P.sea} />
        <path d="M-50 1500 Q400 1470 1130 1520 L1130 1920 L-50 1920 Z" fill={P.seaDeep} opacity={0.5} />
      </Sketch>
      <Sketch>
        {/* coast + runway */}
        <path d="M300 1330 Q600 1290 1130 1300 L1130 1520 Q700 1500 300 1520 Z" fill={P.sand} {...ln} />
        <path d="M340 1390 L1130 1370 L1130 1450 L340 1470 Z" fill="#8c8a93" {...ln} strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={400 + i * 130} y1={1428 - i * 2} x2={460 + i * 130} y2={1426 - i * 2} stroke="#fff" strokeWidth={6} />)}
        {[[180, 1560], [110, 1600], [980, 1560]].map(([x, y], i) => <Palm key={i} x={x} y={y} s={0.75} phase={i * 13} />)}
        {[[200, 1700], [700, 1780], [420, 1640]].map(([x, y], i) => (
          <path key={i} d={`M${x - (f % 60)} ${y} q25 -12 50 0 t50 0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
        ))}
        <Cloud x={800 - f * 0.6} y={330} s={0.7} />
        <Cloud x={200 - f * 0.4} y={470} s={0.5} />
        <Plane x={px + roll} y={py} s={0.34} rot={rot} people={false} />
      </Sketch>
      <Banner delay={100} y={200} sub="Del aeropuerto a Delventto: solo 10 min">¡Bienvenidos!</Banner>
    </AbsoluteFill>
  );
};

/* Soft cloud wipe between parts */
const CloudWipe: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [1400, -1600]);
  return (
    <Sketch>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Cloud key={i} x={x + (i % 3) * 260} y={i * 280 + 40} s={4.6} />
      ))}
    </Sketch>
  );
};

export const SCENE1 = 300;
export const Scene1: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={150}><Cruise /></Sequence>
    <Sequence from={150}><Descent /></Sequence>
    <Sequence from={126} durationInFrames={48}><CloudWipe dur={48} /></Sequence>
  </AbsoluteFill>
);

export {W, Plane};
