import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cloud, Dog, Fly, H, Head, LOOKS, P, Palm, Person, Sketch, W, hand, ln} from '../story/kit';
import {Suitcase, Taxi, Tower} from '../story/Scenes';
import {Plane} from '../story/Scene1';
import {outfit} from '../theme';
import {DAD_NO_HAT, Mom, MomHead, useCast} from './people';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};

const FadeIn: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, dur], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

const Plant: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-58, -30, -6, 22, 50].map((a, i) => (
        <path key={i} transform={`translate(0 -90) rotate(${a + Math.sin(f / 24 + i) * 2})`} d="M0 0 Q-34 -90 0 -190 Q34 -90 0 0 Z" fill={i % 2 ? P.leaf : P.leafDark} {...ln} strokeWidth={4} />
      ))}
      <path d="M-56 -100 L56 -100 L42 0 L-42 0 Z" fill={P.coral} {...ln} />
      <rect x={-62} y={-112} width={124} height={22} rx={8} fill="#d9765b" {...ln} strokeWidth={4} />
    </g>
  );
};

/* ───────── The apartment door (number from the cast; default 717) and its hallway ───────── */
const Door717: React.FC<{open?: number; glow?: number}> = ({open = 1, glow = 0}) => {
  const num = useCast().puerta ?? '717';
  return (
  <g>
    <rect x={250} y={520} width={580} height={1080} rx={16} fill="#fbe7a6" {...ln} />
    <rect x={270} y={540} width={540} height={1060} fill={P.goldSoft} />
    {glow > 0 && <circle cx={540} cy={1050} r={glow * 620} fill="#fff4c4" opacity={0.9} />}
    <g transform={`translate(270 0) scale(${open} 1)`}>
      <rect x={0} y={540} width={540} height={1060} fill={P.purple} {...ln} />
      <rect x={60} y={620} width={420} height={400} rx={14} fill="none" stroke={P.purpleDark} strokeWidth={6} />
      <rect x={60} y={1090} width={420} height={430} rx={14} fill="none" stroke={P.purpleDark} strokeWidth={6} />
      {num !== '' && <rect x={170} y={730} width={200} height={110} rx={18} fill={P.gold} {...ln} />}
      <text x={270} y={812} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={90} fill={P.purpleDark}>{num}</text>
      <rect x={450} y={1080} width={40} height={90} rx={8} fill="#222" {...ln} strokeWidth={4} />
      <circle cx={470} cy={1206} r={16} fill={P.gold} {...ln} strokeWidth={4} />
    </g>
  </g>
  );
};

const HallBack: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-20} y={1440} width={1120} height={160} fill="#e4d3b4" />
      <line x1={-20} y1={1440} x2={1100} y2={1440} stroke={P.ink} strokeWidth={4} opacity={0.5} />
      {/* wall lamp */}
      <circle cx={950} cy={800} r={90 + Math.sin(f / 10) * 6} fill="#fff1a8" opacity={0.45} />
      <path d="M915 760 L985 760 L970 850 L930 850 Z" fill={P.goldSoft} {...ln} strokeWidth={4} />
      <rect x={942} y={850} width={16} height={36} fill={P.gold} {...ln} strokeWidth={4} />
    </g>
  );
};

const HallFront: React.FC = () => (
  <g>
    <rect x={-20} y={1600} width={1120} height={360} fill="#c9a77a" {...ln} />
    <path d="M330 1640 L750 1640 L790 1730 L290 1730 Z" fill={P.purpleDeep} {...ln} />
    <text x={540} y={1705} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={58} fill={P.goldSoft}>Bienvenidos</text>
    <Plant x={125} y={1640} s={1.15} />
  </g>
);

/* Scene 1 · the closed door, butterflies slipping out underneath */
export const S1Door: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 220], [1, 1.12], clamp);
  const pulse = 0.5 + 0.5 * Math.sin(f / 8);
  return (
    <AbsoluteFill style={{background: '#efe3cf'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 64%'}}>
        <Sketch>
          <HallBack />
          <Door717 />
          <HallFront />
          <ellipse cx={540} cy={1604} rx={250 + pulse * 40} ry={13 + pulse * 6} fill="#fff1a8" opacity={0.9} />
          {new Array(18).fill(0).map((_, i) => {
            const t = (f - (8 + i * 6 + random(`h${i}`) * 8)) / 100;
            if (t < 0) return null;
            const dir = random(`hd${i}`) - 0.5;
            const x = 320 + random(`hx${i}`) * 440 + dir * 700 * t + Math.sin(f / 7 + i) * 34;
            const y = 1596 - t * 1500 - Math.sin(t * 4 + i) * 50;
            const sc = interpolate(t, [0, 0.12], [0.2, 0.7 + random(`hs${i}`) * 0.7], clamp);
            return <Fly key={i} x={x} y={y} s={sc} phase={i * 7} rot={dir * 50 + Math.sin(f / 9 + i) * 15} />;
          })}
        </Sketch>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── Scene 2 · plane in, then the taxi with the dog at the window ───────── */
const PlaneIn: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 88], [0, 1], ease);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #f6c9a0 0%, ${P.skyWarm} 35%, ${P.sky} 60%)`}}>
      <Sketch wash>
        <path d="M-50 1000 L180 560 L300 700 L470 430 L620 640 L780 480 L1130 1000 Z" fill={P.mountainFar} />
        <path d="M440 480 L470 430 L505 480 Q470 470 440 480 Z" fill="#fff" />
        <path d="M755 520 L780 480 L810 520 Q780 512 755 520 Z" fill="#fff" />
        <path d="M-50 1150 Q150 780 380 900 Q560 740 760 880 Q950 760 1130 900 L1130 1250 L-50 1250 Z" fill={P.mountain} />
        <path d="M-50 1180 Q300 1150 600 1190 Q850 1220 1130 1180 L1130 1920 L-50 1920 Z" fill={P.sea} />
        <path d="M-50 1500 Q400 1470 1130 1520 L1130 1920 L-50 1920 Z" fill={P.seaDeep} opacity={0.5} />
      </Sketch>
      <Sketch>
        <path d="M300 1330 Q600 1290 1130 1300 L1130 1520 Q700 1500 300 1520 Z" fill={P.sand} {...ln} />
        {[[420, 1470], [620, 1450], [980, 1480]].map(([x, y], i) => <Palm key={i} x={x} y={y} s={0.7} phase={i * 13} />)}
        {[[200, 1700], [700, 1780], [420, 1640]].map(([x, y], i) => (
          <path key={i} d={`M${x - (f % 60)} ${y} q25 -12 50 0 t50 0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
        ))}
        <Cloud x={820 - f * 0.6} y={560} s={0.7} />
        <Cloud x={220 - f * 0.4} y={700} s={0.5} />
        <Plane x={interpolate(t, [0, 1], [-260, 880])} y={interpolate(t, [0, 1], [700, 1180])} s={0.5} rot={9} people={false} />
      </Sketch>
    </AbsoluteFill>
  );
};

const TaxiFamily: React.FC<{x: number; y: number; s?: number; spin: number}> = ({x, y, s = 1, spin}) => {
  const f = useCurrentFrame();
  const {kids, dog} = useCast();
  const kidX = kids.length === 1 ? [52] : [28, 70];
  const w1 = 'M-95 -128 L-10 -128 L-10 -66 L-140 -66 Z';
  const w3 = 'M115 -128 L192 -128 L234 -66 L115 -66 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="tw1"><path d={w1} /></clipPath>
        <clipPath id="tw2"><rect x={5} y={-128} width={95} height={62} /></clipPath>
      </defs>
      {/* luggage on the roof */}
      <Suitcase x={-78} y={-136} color={P.coral} s={0.5} />
      <Suitcase x={-14} y={-136} color={P.purple} s={0.44} />
      <path d="M-190 -60 L-160 -60 L-110 -140 L200 -140 L250 -60 L310 -55 Q325 -50 325 -20 L325 10 L-200 10 L-200 -40 Q-200 -58 -190 -60 Z" fill="#f5c400" {...ln} />
      <path d={w1} fill="#cfeaf1" />
      <rect x={5} y={-128} width={95} height={62} fill="#cfeaf1" />
      <path d={w3} fill="#cfeaf1" />
      <g clipPath="url(#tw1)">
        <g transform="translate(-92 -84)"><Head look={LOOKS.dad} r={21} smile="open" /></g>
        <g transform="translate(-42 -86)"><MomHead r={21} smile="open" /></g>
      </g>
      <g clipPath="url(#tw2)">
        {kids.map((k, i) => (
          <g key={i} transform={`translate(${kidX[i]} ${-80 + (1 - k.s) * 12})`}><Head look={k.look} r={16 * k.s} smile="open" /></g>
        ))}
      </g>
      <path d={w1} fill="none" {...ln} strokeWidth={4} />
      <rect x={5} y={-128} width={95} height={62} fill="none" {...ln} strokeWidth={4} />
      <path d={w3} fill="none" {...ln} strokeWidth={4} />
      <rect x={62} y={-172} width={70} height={30} rx={6} fill={P.white} {...ln} strokeWidth={4} />
      <text x={97} y={-150} textAnchor="middle" fontFamily={outfit} fontWeight={600} fontSize={20} fill={P.ink}>TAXI</text>
      <path d="M-200 -20 L325 -20" stroke={P.ink} strokeWidth={4} />
      {/* the dog, head out of the front window */}
      {dog && (
        <>
          <Dog x={196} y={-106} s={0.66} headOnly />
          <path d={`M216 -90 q-8 ${12 + Math.sin(f / 2) * 5} -22 ${8 + Math.sin(f / 2) * 3}`} stroke="#e87a7a" strokeWidth={7} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <line key={i} x1={150 - ((f * 6 + i * 30) % 70)} y1={-150 + i * 14} x2={120 - ((f * 6 + i * 30) % 70)} y2={-150 + i * 14} stroke={P.ink} strokeWidth={3} strokeLinecap="round" opacity={0.35} />
          ))}
        </>
      )}
      {[-110, 235].map((wx) => (
        <g key={wx} transform={`translate(${wx} 12) rotate(${spin})`}>
          <circle r={40} fill={P.ink} />
          <circle r={18} fill="#ccc" />
          <line x1={-18} y1={0} x2={18} y2={0} stroke={P.ink} strokeWidth={4} />
        </g>
      ))}
    </g>
  );
};

const TaxiRide: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 3) * 3;
  const loop = (v: number, n: number) => ((v % n) + n) % n;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky}, #e3f1ee 50%, ${P.skyWarm})`}}>
      <Sketch wash>
        <circle cx={860} cy={640} r={150} fill="#fbe08a" opacity={0.3} />
        <circle cx={860} cy={640} r={100} fill="#fbe08a" />
        <path d="M-50 1060 L160 760 L260 860 L420 660 L560 860 L700 780 L900 1060 Z" fill={P.mountainFar} />
        <path d="M394 694 L420 660 L448 694 Q420 686 394 694 Z" fill="#fff" />
        <rect x={-50} y={1040} width={1200} height={300} fill={P.sea} />
        <rect x={-50} y={1040} width={1200} height={70} fill={P.seaDeep} opacity={0.45} />
        <path d="M-50 1300 Q540 1260 1130 1300 L1130 1500 L-50 1500 Z" fill={P.sand} />
      </Sketch>
      <Sketch>
        <Cloud x={loop(260 - f * 1.2, 1500) - 200} y={560} s={0.8} />
        <Cloud x={loop(900 - f * 0.8, 1500) - 200} y={760} s={0.5} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${loop(i * 300 - f * 3, 1300) - 100} ${1130 + (i % 2) * 70} q25 -12 50 0 t50 0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
        ))}
        {[0, 1, 2, 3].map((i) => <Palm key={i} x={loop(i * 460 - f * 16, 1840) - 380} y={1500} s={1.1} phase={i * 11} />)}
        <rect x={-20} y={1480} width={1120} height={480} fill="#8c8a93" {...ln} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={loop(i * 260 - f * 30, 1560) - 240} y={1832} width={150} height={14} rx={6} fill="#fff" opacity={0.85} />)}
        {[0, 1, 2].map((i) => (
          <line key={i} x1={40 - loop(f * 9 + i * 40, 90)} y1={1560 + i * 50} x2={-40 - loop(f * 9 + i * 40, 90)} y2={1560 + i * 50} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
        ))}
        <TaxiFamily x={440} y={1700 + bob} s={1.75} spin={f * 22} />
        <Fly x={900 + Math.sin(f / 9) * 40} y={1240 + Math.cos(f / 7) * 40} s={1} rot={12} />
      </Sketch>
    </AbsoluteFill>
  );
};

export const S2Arrival: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={90}><PlaneIn /></Sequence>
    <Sequence from={70}><FadeIn dur={18}><TaxiRide /></FadeIn></Sequence>
  </AbsoluteFill>
);

/* ───────── Scene 3 · Edificio Delventto ───────── */
export const S3Delventto: React.FC = () => {
  const f = useCurrentFrame();
  const taxiX = interpolate(f, [0, 50], [-320, 230], {...clamp, easing: Easing.out(Easing.cubic)});
  const walkT = interpolate(f, [58, 165], [0, 1], clamp);
  const walking = f > 58 && f < 165;
  const baseX = interpolate(walkT, [0, 1], [240, 640]);
  const wp = walking ? f : 0;
  const arrived = f >= 165;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky}, #e3f1ee 55%, ${P.skyWarm})`}}>
      <Sketch wash>
        <path d="M-50 1300 Q200 1000 420 1120 Q520 1060 620 1150 L620 1600 L-50 1600 Z" fill={P.mountainFar} />
        <rect x={-50} y={1600} width={1200} height={400} fill="#d9c49a" />
      </Sketch>
      <Sketch>
        <Cloud x={200 + f * 0.3} y={620} s={0.8} />
        <Cloud x={380 + f * 0.2} y={860} s={0.5} />
        {/* scaled down from its base so the roof clears the caption card */}
        <g transform="translate(780 1600) scale(0.86) translate(-780 -1600)"><Tower /></g>
        <g transform="translate(730 1600)">
          <Person look={{skin: '#c98d68', shirt: P.purple, pants: P.purpleDark, hair: '#2c1c18', hairStyle: 'bun'}} x={0} y={0} s={0.5} face={-1} wave={f > 120} />
        </g>
        <Palm x={470} y={1610} s={1.05} phase={4} />
        <Palm x={1050} y={1620} s={0.9} phase={17} />
        <Taxi x={taxiX} y={1700} spin={taxiX * 0.9} />
        {f > 52 && (
          <g opacity={interpolate(f, [52, 64], [0, 1], clamp)}>
            <Suitcase x={baseX + 75} y={1840} color={P.coral} />
            <Person look={LOOKS.dad} x={baseX} y={1840} s={0.95} walk={wp} />
            <Mom x={baseX - 185} y={1836} s={0.92} walk={wp && wp + 5} wave={arrived} hat smile={arrived ? 'open' : 'soft'} />
            <Suitcase x={baseX - 78} y={1840} color={P.purple} s={0.8} />
            <Person look={LOOKS.girl} x={baseX - 305} y={1840} s={0.95} walk={wp && wp + 9} smile="open" />
            <Person look={LOOKS.boy} x={baseX - 395} y={1840} s={0.95} walk={wp && wp + 2} smile="open" jump={arrived ? Math.abs(Math.sin(f / 5)) * 30 : 0} />
            {useCast().dog && <Dog x={baseX + 210} y={1850} s={0.75} walk={walking ? f : 0} />}
          </g>
        )}
      </Sketch>
    </AbsoluteFill>
  );
};

/* ───────── Scene 4 · Mom opens the balcony ───────── */
const DoorOpen: React.FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [6, 36], [1, 0.08], ease);
  const glow = interpolate(f, [6, 46], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#efe3cf'}}>
      <Sketch>
        <HallBack />
        <Door717 open={open} glow={glow} />
        <HallFront />
        {f > 16 &&
          new Array(20).fill(0).map((_, i) => {
            const t = (f - 16 - random(`d${i}`) * 10) / 55;
            if (t < 0) return null;
            const a = random(`a${i}`) * Math.PI * 2;
            const r = t * (700 + random(`r${i}`) * 500);
            return <Fly key={i} x={540 + Math.cos(a) * r} y={1050 + Math.sin(a) * r * 0.9 - t * 200} s={0.8 + random(`s${i}`)} phase={i * 7} rot={(a * 180) / Math.PI + 90} />;
          })}
      </Sketch>
    </AbsoluteFill>
  );
};

const OX0 = 330;
const OX1 = 1010;
const OY0 = 560;
const OY1 = 1360;
const OMID = 670;

const SeaView: React.FC = () => {
  const f = useCurrentFrame();
  const shore = 4 + Math.sin(f / 14) * 7;
  return (
    <g clipPath="url(#balc)">
      <defs>
        <linearGradient id="balcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.sky} />
          <stop offset="0.55" stopColor="#d6ece9" />
          <stop offset="1" stopColor={P.skyWarm} />
        </linearGradient>
      </defs>
      <rect x={OX0} y={OY0} width={680} height={345} fill="url(#balcSky)" />
      <circle cx={850} cy={720} r={125} fill="#fbe08a" opacity={0.35} />
      <circle cx={850} cy={720} r={74} fill="#fbe08a" />
      <Cloud x={470 + f * 0.25} y={650} s={0.45} />
      <Cloud x={700 + f * 0.15} y={600} s={0.3} />
      {/* gulls */}
      {[[480, 800], [560, 760]].map(([gx, gy], i) => (
        <path key={i} d={`M${gx + f * 0.5} ${gy + Math.sin(f / 9 + i) * 6} q12 -12 22 0 q10 -12 22 0`} stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      ))}
      <rect x={OX0} y={900} width={680} height={270} fill={P.sea} />
      <rect x={OX0} y={900} width={680} height={50} fill={P.seaDeep} opacity={0.45} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={810 + i * 9} y1={916 + i * 24} x2={890 - i * 9} y2={916 + i * 24} stroke="#fff6c4" strokeWidth={7} strokeLinecap="round" opacity={0.75 - i * 0.12} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${300 + ((i * 170 + f * (1.5 + i * 0.4)) % 760)} ${968 + i * 34} q20 -10 40 0 t40 0`} stroke="#e6fbff" strokeWidth={4} fill="none" opacity={0.85} />
      ))}
      {/* sailboat */}
      <g transform={`translate(${470 + f * 0.35} ${938 + Math.sin(f / 12) * 3})`}>
        <path d="M-26 0 L26 0 L18 14 L-18 14 Z" fill={P.white} {...ln} strokeWidth={3} />
        <path d="M0 -4 L0 -56 L26 -4 Z" fill={P.coral} {...ln} strokeWidth={3} />
      </g>
      {/* beach */}
      <path d="M330 1150 Q600 1105 1010 1135 L1010 1262 L330 1262 Z" fill={P.sand} />
      <path d={`M330 ${1150 + shore} Q600 ${1105 + shore} 1010 ${1135 + shore}`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.9} />
      <g transform="translate(800 1215)">
        <line x1={0} y1={0} x2={0} y2={-62} stroke={P.ink} strokeWidth={4} />
        <path d="M-46 -52 Q0 -100 46 -52 Z" fill={P.coral} {...ln} strokeWidth={3} />
      </g>
      <Palm x={362} y={1256} s={0.52} phase={6} />
      <Palm x={950} y={1252} s={0.44} phase={19} />
      {/* balcony floor and glass railing */}
      <rect x={OX0} y={1256} width={680} height={110} fill="#eadfca" stroke={P.ink} strokeWidth={4} />
      <rect x={OX0} y={1172} width={680} height={86} fill="#fff" opacity={0.16} />
      <line x1={OX0} y1={1170} x2={OX1} y2={1170} stroke={P.ink} strokeWidth={7} />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={OX0 + i * 170} y1={1170} x2={OX0 + i * 170} y2={1258} stroke={P.ink} strokeWidth={5} />)}
    </g>
  );
};

const GlassPanel: React.FC<{x: number; handle?: boolean}> = ({x, handle}) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={OY0} width={340} height={800} fill="#d8f0f5" opacity={0.26} />
    <path d="M40 660 L130 600 M56 720 L190 630" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.55} />
    <rect x={0} y={OY0} width={340} height={800} fill="none" stroke={P.ink} strokeWidth={7} />
    {handle && <rect x={18} y={1090} width={16} height={100} rx={7} fill={P.ink} />}
  </g>
);

const Sheer: React.FC<{xa: number; xb: number; bx: number; lift: number}> = ({xa, xb, bx, lift}) => {
  const my = (OY0 + OY1) / 2;
  return (
    <g>
      <path
        d={`M${xa} ${OY0 - 8} L${xb} ${OY0 - 8} Q${xb + bx * 0.4} ${my} ${xb + bx} ${OY1 - 12 - lift} L${xa + bx * 0.6} ${OY1 - 12 - lift * 0.5} Q${xa + bx * 0.2} ${my} ${xa} ${OY0 - 8} Z`}
        fill="#fffdf6"
        opacity={0.84}
        stroke={P.ink}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {[0.3, 0.62].map((k) => {
        const x = xa + (xb - xa) * k;
        return <path key={k} d={`M${x} ${OY0} Q${x + bx * 0.35} ${my} ${x + bx * 0.85} ${OY1 - 30 - lift * 0.8}`} stroke={P.ink} strokeWidth={2.5} fill="none" opacity={0.25} />;
      })}
    </g>
  );
};

const Room: React.FC = () => {
  const f = useCurrentFrame();
  const walking = f > 5 && f < 50;
  const momX = interpolate(f, [5, 50], [-130, 285], clamp);
  const part = interpolate(f, [45, 72], [0, 1], ease);
  const slide = interpolate(f, [66, 100], [0, 1], ease);
  const breeze = interpolate(f, [82, 122], [0, 1], clamp);
  const light = interpolate(f, [45, 112], [0, 1], clamp);
  const run = (delay: number) => interpolate(f, [106 + delay, 158 + delay], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const kid = (t: number, toX: number) => ({x: interpolate(t, [0, 1], [-140, toX]), y: interpolate(t, [0, 1], [1720, 1346]), s: interpolate(t, [0, 1], [1.25, 0.9])});
  const {kids, dog} = useCast();
  const targets = kids.length === 1 ? [500] : [462, 566];
  const dT = run(18);
  const dadX = interpolate(f, [124, 168], [-200, 85], clamp);
  return (
    <AbsoluteFill style={{background: '#f4ead8'}}>
      <Sketch>
        <defs>
          <clipPath id="balc"><rect x={OX0} y={OY0} width={OX1 - OX0} height={OY1 - OY0} /></clipPath>
        </defs>
        {/* picture on the wall */}
        <rect x={50} y={720} width={190} height={240} rx={8} fill={P.sea} {...ln} />
        <circle cx={185} cy={790} r={26} fill="#fbe08a" />
        <path d="M60 950 L60 900 Q110 850 150 890 Q190 850 230 900 L230 950 Z" fill={P.gold} opacity={0.85} />
        <SeaView />
        <GlassPanel x={OMID} />
        <GlassPanel x={OX0 + slide * 336} handle />
        <rect x={OX0} y={OY0} width={OX1 - OX0} height={OY1 - OY0} fill="none" stroke={P.ink} strokeWidth={10} />
        {/* drapes, then the sheers that billow over them, and the rod */}
        <path d="M246 520 L338 520 Q322 940 342 1362 L246 1362 Z" fill={P.purple} {...ln} />
        <path d="M1002 520 L1094 520 L1094 1362 L998 1362 Q1018 940 1002 520 Z" fill={P.purple} {...ln} />
        <Sheer xa={OX0} xb={OMID - part * 245} bx={breeze * (-70 + Math.sin(f / 8) * 48)} lift={breeze * (95 + Math.sin(f / 6) * 40)} />
        <Sheer xa={OMID + part * 265} xb={OX1} bx={breeze * Math.sin(f / 10) * 16} lift={breeze * 10} />
        <line x1={225} y1={520} x2={1100} y2={520} stroke={P.ink} strokeWidth={10} strokeLinecap="round" />
        <circle cx={225} cy={520} r={14} fill={P.gold} {...ln} strokeWidth={4} />
        {/* floor */}
        <rect x={-20} y={OY1} width={1120} height={600} fill="#e2c9a0" {...ln} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={-20} y1={1480 + i * 120} x2={1100} y2={1480 + i * 120} stroke={P.ink} strokeWidth={3} opacity={0.18} />)}
        <path d="M330 1362 L1010 1362 L1250 1920 L110 1920 Z" fill="#fff3c0" opacity={light * 0.5} />
        <ellipse cx={520} cy={1700} rx={330} ry={84} fill={P.purple} opacity={0.3} />
        <Plant x={130} y={1420} s={1.1} />
        {/* bed corner */}
        <rect x={700} y={1740} width={460} height={90} fill="#b98a5a" {...ln} />
        <rect x={690} y={1570} width={470} height={190} rx={28} fill={P.white} {...ln} />
        <rect x={760} y={1570} width={110} height={190} fill={P.purple} opacity={0.9} />
        <ellipse cx={1010} cy={1562} rx={92} ry={40} fill="#fff" {...ln} />
        <Mom x={momX} y={1432} s={0.98} walk={walking ? f : 0} reach={f >= 50 && f < 103} armsUp={f >= 106 && f < 152} breeze={breeze} smile={f > 100 ? 'open' : 'soft'} />
        {kids.map((k, i) => {
          const t = run(i * 9);
          if (f <= 106 + i * 9) return null;
          const p = kid(t, targets[i]);
          const there = t >= 1;
          return <Person key={i} look={k.look} x={p.x} y={p.y} s={p.s * k.s} walk={there ? 0 : f} armsUp={i % 2 === 0 && there} jump={i % 2 === 1 && there ? Math.abs(Math.sin(f / 5)) * 22 : 0} smile="open" />;
        })}
        {dog && f > 124 && <Dog x={interpolate(dT, [0, 1], [-140, 632])} y={interpolate(dT, [0, 1], [1740, 1350])} s={interpolate(dT, [0, 1], [1, 0.56])} walk={dT < 1 ? f : 0} />}
        {f > 124 && (
          <>
            <Suitcase x={dadX + 105} y={1822} color={P.coral} />
            <Person look={LOOKS.dad} x={dadX} y={1822} s={1.12} walk={f < 168 ? f : 0} smile="open" />
          </>
        )}
        {f > 96 &&
          [0, 1, 2, 3, 4].map((i) => {
            const t = interpolate(f, [96 + i * 9, 190 + i * 9], [0, 1], clamp);
            return <Fly key={i} x={480 + i * 30 + t * (60 + i * 90) + Math.sin(f / 9 + i) * 30} y={1120 - i * 70 + t * 220 + Math.cos(f / 11 + i) * 40} s={0.5 + t * 0.6} phase={i * 9} rot={20} />;
          })}
      </Sketch>
      <AbsoluteFill style={{background: P.purpleDark, opacity: (1 - light) * 0.24}} />
    </AbsoluteFill>
  );
};

export const ROOM_AT = 34;
export const S4Balcony: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={ROOM_AT + 20}><DoorOpen /></Sequence>
    <Sequence from={ROOM_AT}><FadeIn dur={16}><Room /></FadeIn></Sequence>
  </AbsoluteFill>
);

/* ───────── Scene 5 · pool afternoon ───────── */
/* Toddler version: floating in his ring with dad beside him, no cannonball */
const PoolToddler: React.FC = () => {
  const f = useCurrentFrame();
  const {kids} = useCast();
  const k = kids[0];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky}, #e7f4f1 60%)`}}>
      <Sketch wash>
        <circle cx={860} cy={640} r={140} fill="#fbe08a" opacity={0.3} />
        <circle cx={860} cy={640} r={92} fill="#fbe08a" />
      </Sketch>
      <Sketch>
        <Cloud x={300 + f * 0.4} y={640} s={0.9} />
        <Cloud x={700 - f * 0.3} y={840} s={0.6} />
        <Palm x={120} y={1270} s={1.2} phase={3} />
        <Palm x={980} y={1280} s={1.1} phase={20} />
        <rect x={-20} y={1260} width={1120} height={700} fill="#ecd9b4" {...ln} />
        <Mom x={760} y={1352} s={0.62} hat wave smile="open" />
        <path d="M60 1360 L1020 1360 L1020 1800 L60 1800 Z" fill={P.sea} {...ln} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${120 + ((i * 230 + f * 2) % 860)} ${1450 + (i % 2) * 180} q30 -14 60 0 t60 0`} stroke="#e6fbff" strokeWidth={5} fill="none" opacity={0.8} />
        ))}
        <g transform={`translate(${820 + Math.sin(f / 20) * 20} ${1690 + Math.sin(f / 9) * 6}) rotate(${f * 1.5})`}>
          <circle r={44} fill={P.white} {...ln} strokeWidth={4} />
          <path d="M0 -44 A44 44 0 0 1 38 22 L0 0 Z" fill={P.coral} />
          <path d="M0 -44 A44 44 0 0 0 -38 22 L0 0 Z" fill={P.gold} />
          <circle r={44} fill="none" {...ln} strokeWidth={4} />
        </g>
        <Person look={LOOKS.dad} x={370} y={1730} s={0.95} wave smile="open" />
        <g transform={`translate(560 ${1560 + Math.sin(f / 10) * 8})`}>
          <Person look={k.look} x={0} y={128} s={k.s} armsUp={Math.floor(f / 40) % 2 === 0} smile="open" face={-1} />
          <ellipse cx={0} cy={0} rx={96} ry={34} fill={P.gold} {...ln} />
          <ellipse cx={0} cy={-6} rx={52} ry={15} fill={P.sea} />
          {[-60, -20, 20, 60].map((sx, i) => {
            const p = ((f + i * 9) % 36) / 36;
            return <circle key={i} cx={sx + (sx < 0 ? -1 : 1) * p * 40} cy={30 - Math.sin(p * Math.PI) * 60} r={9} fill="#e6fbff" {...ln} strokeWidth={3} opacity={1 - p} />;
          })}
        </g>
        <rect x={60} y={1600} width={960} height={200} fill={P.sea} opacity={0.55} />
        <rect x={60} y={1800} width={960} height={140} fill="#ecd9b4" {...ln} />
        {[0, 1, 2].map((i) => (
          <Fly key={i} x={300 + i * 220 + Math.sin(f / 10 + i) * 40} y={1000 + i * 60 + Math.cos(f / 12 + i) * 40} s={0.9} phase={i * 9} rot={15} />
        ))}
      </Sketch>
    </AbsoluteFill>
  );
};

export const SPLASH_AT = 76;
export const S5Pool: React.FC = () => (useCast().toddler ? <PoolToddler /> : <PoolBig />);
const PoolBig: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [36, SPLASH_AT], [0, 1], clamp);
  const bx = interpolate(t, [0, 1], [180, 520]);
  const by = 1250 - Math.sin(t * Math.PI) * 360 + t * 160;
  const splash = f >= SPLASH_AT ? interpolate(f, [SPLASH_AT, SPLASH_AT + 40], [0, 1], clamp) : 0;
  const hop = f >= SPLASH_AT + 2 && f < SPLASH_AT + 34 ? Math.abs(Math.sin((f - SPLASH_AT - 2) / 5)) * 40 : 0;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky}, #e7f4f1 60%)`}}>
      <Sketch wash>
        <circle cx={860} cy={640} r={140} fill="#fbe08a" opacity={0.3} />
        <circle cx={860} cy={640} r={92} fill="#fbe08a" />
      </Sketch>
      <Sketch>
        <Cloud x={300 + f * 0.4} y={640} s={0.9} />
        <Cloud x={700 - f * 0.3} y={840} s={0.6} />
        <Palm x={120} y={1270} s={1.2} phase={3} />
        <Palm x={980} y={1280} s={1.1} phase={20} />
        <rect x={-20} y={1260} width={1120} height={700} fill="#ecd9b4" {...ln} />
        {/* parents and dog on the far deck */}
        <Person look={LOOKS.dad} x={345} y={1352} s={0.62} armsUp={splash > 0} smile="open" />
        <Mom x={735} y={1352} s={0.62} hat wave smile="open" />
        {useCast().dog && <Dog x={905} y={1340 - hop} s={0.85} face={-1} />}
        <path d="M60 1360 L1020 1360 L1020 1800 L60 1800 Z" fill={P.sea} {...ln} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${120 + ((i * 230 + f * 2) % 860)} ${1450 + (i % 2) * 180} q30 -14 60 0 t60 0`} stroke="#e6fbff" strokeWidth={5} fill="none" opacity={0.8} />
        ))}
        {/* beach ball */}
        <g transform={`translate(${250 + Math.sin(f / 20) * 20} ${1690 + Math.sin(f / 9) * 6}) rotate(${f * 1.5})`}>
          <circle r={44} fill={P.white} {...ln} strokeWidth={4} />
          <path d="M0 -44 A44 44 0 0 1 38 22 L0 0 Z" fill={P.coral} />
          <path d="M0 -44 A44 44 0 0 0 -38 22 L0 0 Z" fill={P.gold} />
          <circle r={44} fill="none" {...ln} strokeWidth={4} />
        </g>
        <g transform={`translate(800 ${1560 + Math.sin(f / 10) * 8})`}>
          <Person look={LOOKS.girl} x={0} y={120} s={1} armsUp smile="open" face={-1} />
          <ellipse cx={0} cy={0} rx={100} ry={36} fill={P.coral} {...ln} />
          <ellipse cx={0} cy={-6} rx={56} ry={16} fill={P.sea} />
        </g>
        <rect x={60} y={1600} width={960} height={200} fill={P.sea} opacity={0.55} />
        {f < SPLASH_AT + 4 && (
          <g transform={`rotate(${t * 60} ${bx} ${by - 100})`}>
            <Person look={LOOKS.boy} x={bx} y={by} s={1} armsUp={t > 0 && t < 0.8} smile="open" />
          </g>
        )}
        {splash > 0 && splash < 1 && (
          <g opacity={1 - splash * 0.8}>
            <ellipse cx={520} cy={1400} rx={60 + splash * 160} ry={16 + splash * 30} fill="#e6fbff" {...ln} strokeWidth={4} />
            {new Array(18).fill(0).map((_, i) => {
              const a = -Math.PI * (0.1 + 0.8 * random(`sa${i}`));
              const v = 320 + random(`sv${i}`) * 380;
              const t2 = splash * 1.1;
              return <circle key={i} cx={520 + Math.cos(a) * v * t2} cy={1400 + Math.sin(a) * v * t2 + 520 * t2 * t2} r={10 + random(`sr${i}`) * 16} fill="#e6fbff" {...ln} strokeWidth={3} />;
            })}
          </g>
        )}
        {f > SPLASH_AT + 25 && (
          <g transform={`translate(520 ${1480 + Math.sin(f / 8) * 6})`}>
            <g transform="scale(0.6)"><Person look={LOOKS.boy} x={0} y={160} s={1.2} armsUp smile="open" /></g>
            <rect x={-80} y={20} width={160} height={120} fill={P.sea} />
          </g>
        )}
        <rect x={60} y={1800} width={960} height={140} fill="#ecd9b4" {...ln} />
      </Sketch>
    </AbsoluteFill>
  );
};

/* ───────── Scene 6 · sunset in the infinity pool ───────── */
export const S6Sunset: React.FC = () => {
  const f = useCurrentFrame();
  const sunY = interpolate(f, [0, 180], [960, 1085], clamp);
  const dusk = interpolate(f, [0, 150], [0, 0.8], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #4b2a6e 0%, #9b4f96 30%, #ef8f7a 58%, #f7c58a 72%)'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #2b1650 0%, #6a2f86 40%, rgba(106,47,134,0) 62%)', opacity: dusk}} />
      <Sketch wash>
        <circle cx={540} cy={sunY} r={130} fill="#ffd98a" />
        <rect x={-50} y={1080} width={1200} height={300} fill="#c0678f" />
        <path d="M-50 1080 L1130 1080 L1130 1140 L-50 1140 Z" fill="#e88f8a" opacity={0.7} />
        <path d="M720 1080 L840 980 L920 1030 L1130 900 L1130 1080 Z" fill="#6b3f6e" />
      </Sketch>
      <Sketch>
        {new Array(9).fill(0).map((_, i) => (
          <circle key={i} cx={80 + random(`sx${i}`) * 920} cy={470 + random(`sy${i}`) * 300} r={4 + random(`sz${i}`) * 3} fill="#fff6c4" opacity={dusk * (0.5 + 0.5 * Math.sin(f / 6 + i * 2))} />
        ))}
        <path d="M-20 1300 L1100 1300 L1100 1700 L-20 1700 Z" fill="#b76aa0" />
        <path d="M-20 1300 L1100 1300" stroke={P.goldSoft} strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={440 + ((i * 37) % 100) - 50} y1={1340 + i * 60} x2={640 - ((i * 37) % 100) + 50} y2={1340 + i * 60} stroke="#ffd98a" strokeWidth={8} opacity={0.6 - i * 0.1} strokeLinecap="round" />
        ))}
        <Person look={LOOKS.dad} x={400} y={1650} s={1.1} face={1} />
        <Mom x={585} y={1650} s={1.05} face={-1} smile="open" />
        <Person look={LOOKS.girl} x={790} y={1692} s={1} smile="open" face={-1} />
        <Person look={LOOKS.boy} x={905} y={1692} s={1} smile="open" face={-1} />
        <rect x={-20} y={1500} width={1120} height={200} fill="#b76aa0" />
        <path d="M-20 1500 q60 -12 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" stroke="#f3c1d8" strokeWidth={5} fill="none" />
        <rect x={-20} y={1700} width={1120} height={260} fill="#8a5a4a" {...ln} />
        {[0, 1, 2].map((i) => <line key={i} x1={-20} y1={1760 + i * 60} x2={1100} y2={1760 + i * 60} stroke={P.ink} strokeWidth={3} opacity={0.4} />)}
        <g transform="translate(150 1700)">
          <path d="M0 -80 L50 -80 L40 0 L10 0 Z" fill="#f7a35c" {...ln} strokeWidth={4} />
          <path d="M80 -80 L130 -80 L120 0 L90 0 Z" fill="#f7a35c" {...ln} strokeWidth={4} />
          <circle cx={45} cy={-80} r={12} fill="#9bd36b" {...ln} strokeWidth={3} />
        </g>
        {useCast().dog && <Dog x={680} y={1716} s={0.7} face={-1} />}
        {new Array(6).fill(0).map((_, i) => (
          <Fly key={i} x={((i * 190 + f * (2 + (i % 3))) % 1300) - 100} y={640 + i * 80 + Math.sin(f / 9 + i) * 50} s={0.9} phase={i * 6} rot={20} />
        ))}
      </Sketch>
    </AbsoluteFill>
  );
};

/* ───────── Scene 7 · the best night's sleep ───────── */
const Zzz: React.FC<{x: number; y: number; phase?: number; size?: number}> = ({x, y, phase = 0, size = 54}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const p = ((f + phase + i * 26) % 78) / 78;
        return (
          <text key={i} x={x + i * 30 + p * 26} y={y - i * 52 - p * 46} fontFamily={hand} fontWeight={700} fontSize={size + i * 16} fill="#f6efc9" opacity={Math.sin(p * Math.PI) * 0.95}>
            z
          </text>
        );
      })}
    </g>
  );
};

const SleepDog: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 18) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-86 -30 q-44 14 -20 40 q50 16 96 -4" stroke={P.ink} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M-86 -30 q-44 14 -20 40 q50 16 96 -4" stroke="#e2b06a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-36 - b / 2} rx={98} ry={42 + b} fill="#e2b06a" {...ln} />
      <g transform="translate(84 -22)">
        <path d="M-18 -30 Q-44 -8 -28 24 Q-10 10 -8 -20 Z" fill="#b5793f" {...ln} />
        <circle cx={0} cy={0} r={34} fill="#e2b06a" {...ln} />
        <ellipse cx={28} cy={12} rx={20} ry={14} fill="#f4dcae" {...ln} />
        <ellipse cx={42} cy={7} rx={7} ry={6} fill={P.ink} />
        <path d="M2 -4 q8 6 16 0" stroke={P.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

export const S7Night: React.FC = () => {
  const f = useCurrentFrame();
  const br = Math.sin(f / 22) * 7;
  const sway = Math.sin(f / 26) * 16;
  return (
    <AbsoluteFill style={{background: '#2a2149'}}>
      <Sketch wash>
        <rect x={600} y={420} width={380} height={450} fill="#1b2a5c" />
        <circle cx={850} cy={545} r={96} fill="#f6efc9" opacity={0.22} />
        <circle cx={850} cy={545} r={58} fill="#f6efc9" />
        <rect x={600} y={750} width={380} height={120} fill="#27407a" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={800 + i * 8} y1={770 + i * 24} x2={900 - i * 8} y2={770 + i * 24} stroke="#f6efc9" strokeWidth={6} opacity={0.6 - i * 0.1} strokeLinecap="round" />
        ))}
        <path d="M600 870 L980 870 L900 1900 L140 1900 Z" fill="#cfe0ff" opacity={0.11} />
      </Sketch>
      <Sketch>
        {new Array(8).fill(0).map((_, i) => (
          <circle key={i} cx={620 + random(`nx${i}`) * 340} cy={440 + random(`ny${i}`) * 280} r={3 + random(`nz${i}`) * 3} fill="#f6efc9" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 9 + i * 1.7))} />
        ))}
        <rect x={600} y={420} width={380} height={450} fill="none" stroke={P.ink} strokeWidth={9} />
        <line x1={790} y1={420} x2={790} y2={870} stroke={P.ink} strokeWidth={6} />
        {/* sheer curtain moving in the night breeze */}
        <path d={`M560 400 L690 400 Q${700 + sway} 640 ${660 + sway * 1.6} 900 L${560 + sway * 0.6} 900 Q${548 + sway * 0.3} 640 560 400 Z`} fill="#e9e4f7" opacity={0.5} stroke={P.ink} strokeWidth={3} />
        <line x1={540} y1={400} x2={1040} y2={400} stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
        {/* framed butterfly */}
        <rect x={120} y={500} width={230} height={190} rx={8} fill="#3b2f63" {...ln} />
        <Fly x={235} y={596} s={1.3} phase={40} rot={-14} />
        {/* floor and rug */}
        <rect x={-20} y={1530} width={1120} height={430} fill="#211a3d" {...ln} />
        <ellipse cx={540} cy={1810} rx={440} ry={92} fill={P.purpleDeep} opacity={0.85} />
        {/* nightstand with a glass of water */}
        <rect x={30} y={1190} width={120} height={350} rx={8} fill="#4a3566" {...ln} />
        <line x1={30} y1={1300} x2={150} y2={1300} stroke={P.ink} strokeWidth={4} />
        <path d="M66 1130 L114 1130 L108 1190 L72 1190 Z" fill="#cfe0ff" opacity={0.75} {...ln} strokeWidth={3} />
        {/* bed */}
        <path d="M150 1560 L150 1010 Q150 905 260 905 L820 905 Q930 905 930 1010 L930 1560 Z" fill="#7d4a94" {...ln} />
        {[320, 540, 760].map((bx) => <circle key={bx} cx={bx} cy={975} r={9} fill={P.purpleDark} />)}
        <rect x={120} y={1120} width={840} height={520} rx={44} fill="#e2dcef" {...ln} />
        <ellipse cx={345} cy={1092} rx={190} ry={74} fill="#f7f4fb" {...ln} />
        <ellipse cx={735} cy={1092} rx={190} ry={74} fill="#f7f4fb" {...ln} />
        <g transform="translate(300 1078) rotate(-13)"><MomHead r={64} asleep /></g>
        <g transform="translate(470 1122) rotate(-8)"><Head look={LOOKS.girl} r={42} asleep /></g>
        <g transform="translate(612 1122) scale(-1 1) rotate(-8)"><Head look={LOOKS.boy} r={42} asleep /></g>
        <g transform="translate(782 1078) scale(-1 1) rotate(-13)"><Head look={DAD_NO_HAT} r={64} asleep /></g>
        {/* duvet, breathing */}
        <path
          d={`M112 ${1196 + br} Q200 ${1130 + br} 300 ${1154 + br} Q390 ${1180 + br} 470 ${1170 + br} Q540 ${1154 + br} 612 ${1170 + br} Q692 ${1180 + br} 782 ${1154 + br} Q882 ${1130 + br} 968 ${1196 + br} L982 1650 Q540 1712 98 1650 Z`}
          fill="#f3eef8"
          {...ln}
        />
        <path d={`M150 ${1300 + br} Q330 ${1262 + br} 540 ${1296 + br} Q750 ${1262 + br} 930 ${1300 + br}`} stroke={P.ink} strokeWidth={3} fill="none" opacity={0.2} />
        <path d="M104 1500 Q540 1556 976 1500 L981 1600 Q540 1660 99 1600 Z" fill={P.purple} opacity={0.92} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
        <rect x={130} y={1650} width={820} height={64} rx={12} fill="#3d2a55" {...ln} />
        <SleepDog x={330} y={1850} s={1.15} />
        <Zzz x={850} y={1010} phase={0} />
        <Zzz x={470} y={1760} phase={30} size={44} />
      </Sketch>
      <AbsoluteFill style={{background: '#1a1440', opacity: 0.2, mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

/* ───────── Scene 8 · closing card ───────── */
export const S8Close: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gather = interpolate(f, [0, 40], [0, 1], ease);
  const logo = spring({frame: f - 30, fps, config: {damping: 13}});
  const line = (d: number) => interpolate(f - d, [0, 14], [0, 1], clamp);
  const {kids, dog, title, checkin} = useCast();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${P.purple}, ${P.purpleDeep} 50%, ${P.purpleDark})`}}>
      <Sketch>
        {new Array(24).fill(0).map((_, i) => {
          const sx = random(`cx${i}`) * W;
          const sy = random(`cy${i}`) * H;
          const a = (i / 24) * Math.PI * 2 + f / 40;
          // smaller ring around the smaller logo when the card also carries a check-in date
          const tx = 540 + Math.cos(a) * (checkin ? 270 : 330);
          const ty = (checkin ? 615 : 700) + Math.sin(a) * (checkin ? 225 : 290);
          return <Fly key={i} x={sx + (tx - sx) * gather} y={sy + (ty - sy) * gather} s={0.9} phase={i * 4} rot={(a * 180) / Math.PI + 90} />;
        })}
        <g opacity={line(46)}>
          <Person look={LOOKS.dad} x={kids.length === 1 ? 360 : 310} y={1850} s={0.75} wave />
          <Mom x={kids.length === 1 ? 510 : 455} y={1850} s={0.74} wave hat smile="open" />
          {kids.map((k, i) => (
            <Person key={i} look={k.look} x={kids.length === 1 ? 650 : 590 + i * 100} y={1850} s={0.75 * k.s} armsUp={i % 2 === 0} wave={i % 2 === 1} smile="open" />
          ))}
          {dog && <Dog x={800} y={1855} s={0.6} face={-1} />}
        </g>
      </Sketch>
      <div style={{position: 'absolute', top: checkin ? 450 : 500, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('img/logo.jpeg')} style={{width: checkin ? 330 : 400, borderRadius: 36, border: `5px solid ${P.goldSoft}`, transform: `scale(${logo}) rotate(${(1 - logo) * -10}deg)`, boxShadow: '0 20px 60px rgba(0,0,0,.4)'}} />
      </div>
      <div style={{position: 'absolute', top: checkin ? 880 : 1030, left: 60, right: 60, textAlign: 'center'}}>
        <div style={{opacity: line(42), fontFamily: hand, fontWeight: 700, fontSize: checkin ? 96 : 112, color: P.goldSoft, lineHeight: 1}}>{title}</div>
        {checkin && (
          <div style={{opacity: line(48), marginTop: 26, display: 'inline-block', border: `3px solid ${P.goldSoft}`, borderRadius: 999, padding: '10px 34px', fontFamily: outfit, fontWeight: 500, fontSize: 42, color: P.white}}>
            {checkin}
          </div>
        )}
        <div style={{opacity: line(52), marginTop: 28, fontFamily: outfit, fontWeight: 600, fontSize: 56, color: P.white, letterSpacing: '0.06em'}}>77rentals.com</div>
        <div style={{opacity: line(60), marginTop: 28, display: 'inline-block', background: P.gold, border: `4px solid ${P.ink}`, borderRadius: 999, padding: '14px 38px', fontFamily: outfit, fontWeight: 600, fontSize: 42, color: P.purpleDark}}>
          WhatsApp +57 304 673 6241
        </div>
        <div style={{opacity: line(66), marginTop: 18, fontFamily: hand, fontWeight: 600, fontSize: 54, color: P.goldSoft}}>Claudia · tu anfitriona</div>
      </div>
    </AbsoluteFill>
  );
};
