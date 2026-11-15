import React from 'react';
import {AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Banner, Cloud, Dog, Fly, H, hand, LOOKS, P, Palm, Person, Sketch, W, ln} from './kit';
import {outfit} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ───────── shared bits ───────── */
const Suitcase: React.FC<{x: number; y: number; color: string; s?: number}> = ({x, y, color, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 -120 L-10 -150 L30 -150 L30 -120" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={-40} y={-120} width={100} height={110} rx={16} fill={color} {...ln} />
    <line x1={-10} y1={-110} x2={-10} y2={-20} stroke={P.ink} strokeWidth={4} opacity={0.5} />
    <line x1={30} y1={-110} x2={30} y2={-20} stroke={P.ink} strokeWidth={4} opacity={0.5} />
    <circle cx={-22} cy={-4} r={9} fill={P.ink} />
    <circle cx={42} cy={-4} r={9} fill={P.ink} />
  </g>
);

/* Swarm of drawn butterflies sweeping up over a cut */
export const FlyWipe: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const p = f / dur;
  const veil = interpolate(p, [0, 0.42, 0.58, 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${P.goldSoft}, ${P.paper} 70%)`, opacity: veil}} />
      <Sketch>
        {new Array(40).fill(0).map((_, i) => {
          const lag = random(`fw${i}`) * 0.3;
          const y = interpolate(p - lag, [0, 0.7], [H + 150, -200], clamp);
          const x = random(`fx${i}`) * W + Math.sin(f / 6 + i) * 40;
          return <Fly key={i} x={x} y={y} s={0.9 + random(`fs${i}`) * 1.3} phase={i * 5} rot={Math.sin(f / 8 + i) * 20} />;
        })}
      </Sketch>
    </AbsoluteFill>
  );
};

/* ───────── Scene 2 · Llegada a Delventto ───────── */
const Taxi: React.FC<{x: number; y: number; spin: number}> = ({x, y, spin}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-190 -60 L-160 -60 L-110 -140 L90 -140 L140 -60 L200 -55 Q215 -50 215 -20 L215 10 L-200 10 L-200 -40 Q-200 -58 -190 -60 Z" fill="#f5c400" {...ln} />
    <path d="M-95 -128 L-10 -128 L-10 -66 L-140 -66 Z" fill="#cfeaf1" {...ln} strokeWidth={4} />
    <path d="M5 -128 L82 -128 L124 -66 L5 -66 Z" fill="#cfeaf1" {...ln} strokeWidth={4} />
    <rect x={-40} y={-172} width={70} height={30} rx={6} fill={P.white} {...ln} strokeWidth={4} />
    <text x={-5} y={-150} textAnchor="middle" fontFamily={outfit} fontWeight={700} fontSize={20} fill={P.ink}>TAXI</text>
    <path d="M-200 -20 L215 -20" stroke={P.ink} strokeWidth={4} />
    {[-110, 120].map((wx) => (
      <g key={wx} transform={`translate(${wx} 12) rotate(${spin})`}>
        <circle r={40} fill={P.ink} />
        <circle r={18} fill="#ccc" />
        <line x1={-18} y1={0} x2={18} y2={0} stroke={P.ink} strokeWidth={4} />
      </g>
    ))}
  </g>
);

const Tower: React.FC = () => {
  const floors = new Array(13).fill(0);
  return (
    <g>
      <path d="M520 1600 L520 260 Q520 230 550 230 L1010 230 Q1040 230 1040 260 L1040 1600 Z" fill="#f6efe2" {...ln} />
      <rect x={560} y={200} width={440} height={40} rx={8} fill={P.purple} {...ln} />
      {floors.map((_, i) => (
        <g key={i}>
          <rect x={550} y={290 + i * 80} width={460} height={46} rx={6} fill="#bfe0ea" stroke={P.ink} strokeWidth={3} />
          <line x1={550} y1={336 + i * 80} x2={1010} y2={336 + i * 80} stroke={P.ink} strokeWidth={5} />
          <line x1={780} y1={290 + i * 80} x2={780} y2={336 + i * 80} stroke={P.ink} strokeWidth={3} opacity={0.6} />
        </g>
      ))}
      {/* entrance */}
      <rect x={560} y={1340} width={440} height={50} rx={10} fill={P.purpleDeep} {...ln} />
      <text x={780} y={1378} textAnchor="middle" fontFamily={outfit} fontWeight={600} fontSize={34} letterSpacing={8} fill={P.goldSoft}>DELVENTTO</text>
      <rect x={660} y={1410} width={240} height={190} rx={8} fill="#d8eef3" {...ln} />
      <line x1={780} y1={1410} x2={780} y2={1600} stroke={P.ink} strokeWidth={5} />
      <rect x={430} y={1590} width={640} height={24} rx={6} fill="#e5d3b3" {...ln} />
    </g>
  );
};

const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const taxiX = interpolate(f, [0, 55], [-300, 250], {...clamp, easing: Easing.out(Easing.cubic)});
  const walkT = interpolate(f, [65, 185], [0, 1], clamp);
  const walking = f > 65 && f < 185;
  const baseX = interpolate(walkT, [0, 1], [180, 560]);
  const wp = walking ? f : 0;
  const receptionWave = f > 160;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky}, #e3f1ee 55%, ${P.skyWarm})`}}>
      <Sketch wash>
        <path d="M-50 1300 Q200 1000 420 1120 Q520 1060 620 1150 L620 1600 L-50 1600 Z" fill={P.mountainFar} />
        <rect x={-50} y={1600} width={1200} height={400} fill="#d9c49a" />
      </Sketch>
      <Sketch>
        <Cloud x={200 + f * 0.3} y={380} s={0.8} />
        <Cloud x={420 + f * 0.2} y={620} s={0.5} />
        <Tower />
        {/* receptionist in the glass door */}
        <g transform="translate(720 1600)">
          <Person look={{skin: '#c98d68', shirt: P.purple, pants: P.purpleDark, hair: '#2c1c18', hairStyle: 'bun'}} x={0} y={0} s={0.5} face={-1} wave={receptionWave} />
        </g>
        <Palm x={470} y={1610} s={1.05} phase={4} />
        <Palm x={1050} y={1620} s={0.9} phase={17} />
        <Taxi x={taxiX} y={1700} spin={taxiX * 0.9} />
        {f > 58 && (
          <g opacity={interpolate(f, [58, 70], [0, 1], clamp)}>
            <Suitcase x={baseX + 75} y={1840} color={P.coral} />
            <Person look={LOOKS.dad} x={baseX} y={1840} s={0.95} walk={wp} />
            <Person look={LOOKS.mom} x={baseX - 150} y={1835} s={0.9} walk={wp && wp + 5} wave={f > 190} />
            <Suitcase x={baseX - 60} y={1840} color={P.purple} s={0.8} />
            <Person look={LOOKS.girl} x={baseX - 250} y={1840} s={0.95} walk={wp && wp + 9} smile="open" />
            <Person look={LOOKS.boy} x={baseX - 340} y={1840} s={0.95} walk={wp && wp + 2} smile="open" jump={f > 190 ? Math.abs(Math.sin(f / 5)) * 30 : 0} />
            <Dog x={baseX + 200} y={1850} s={0.75} walk={walking ? f : 0} />
          </g>
        )}
      </Sketch>
      <Banner delay={150} y={160} size={92} sub="Recepción Edificio Delventto">Check-in desde las 3:00 PM</Banner>
    </AbsoluteFill>
  );
};

/* ───────── Scene 3 · La suite ───────── */
const Door: React.FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [18, 45], [1, 0.08], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: '#efe3cf'}}>
      <Sketch>
        <rect x={250} y={420} width={580} height={1180} rx={16} fill="#fbe7a6" {...ln} />
        <rect x={270} y={440} width={540} height={1160} fill={P.goldSoft} />
        {/* glow behind the door */}
        <circle cx={540} cy={1000} r={interpolate(f, [18, 60], [0, 600], clamp)} fill="#fff4c4" opacity={0.9} />
        <g transform={`translate(270 0) scale(${open} 1)`}>
          <rect x={0} y={440} width={540} height={1160} fill={P.purple} {...ln} />
          <rect x={60} y={520} width={420} height={420} rx={14} fill="none" stroke={P.purpleDark} strokeWidth={6} />
          <rect x={60} y={1010} width={420} height={500} rx={14} fill="none" stroke={P.purpleDark} strokeWidth={6} />
          <rect x={170} y={640} width={200} height={110} rx={18} fill={P.gold} {...ln} />
          <text x={270} y={722} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={90} fill={P.purpleDark}>717</text>
          <rect x={450} y={1010} width={40} height={90} rx={8} fill="#222" {...ln} strokeWidth={4} />
        </g>
        <rect x={-20} y={1600} width={1120} height={340} fill="#c9a77a" {...ln} />
        {f > 30 &&
          new Array(22).fill(0).map((_, i) => {
            const t = (f - 30 - random(`d${i}`) * 12) / 60;
            if (t < 0) return null;
            const a = random(`a${i}`) * Math.PI * 2;
            const r = t * (700 + random(`r${i}`) * 500);
            return <Fly key={i} x={540 + Math.cos(a) * r} y={1000 + Math.sin(a) * r * 0.9 - t * 200} s={0.8 + random(`s${i}`)} phase={i * 7} rot={(a * 180) / Math.PI + 90} />;
          })}
      </Sketch>
    </AbsoluteFill>
  );
};

const Room: React.FC = () => {
  const f = useCurrentFrame();
  const curtain = interpolate(f, [100, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const jumpB = Math.abs(Math.sin(f / 7)) * 110;
  const jumpG = Math.abs(Math.sin(f / 7 + 1.4)) * 90;
  return (
    <AbsoluteFill style={{background: '#f4ead8'}}>
      <Sketch wash>
        {/* view outside the window */}
        <rect x={560} y={420} width={470} height={760} fill={P.skyWarm} />
        <path d="M560 860 L680 700 L760 790 L870 640 L1030 820 L1030 960 L560 960 Z" fill={P.mountain} />
        <path d="M845 680 L870 640 L895 680 Z" fill="#fff" />
        <rect x={560} y={930} width={470} height={250} fill={P.sea} />
        <circle cx={700} cy={560} r={50} fill="#fbe08a" />
      </Sketch>
      <Sketch>
        {/* wall details */}
        <rect x={560} y={420} width={470} height={760} fill="none" {...ln} strokeWidth={8} />
        <line x1={795} y1={420} x2={795} y2={1180} stroke={P.ink} strokeWidth={5} />
        {/* balcony rail */}
        <line x1={560} y1={1060} x2={1030} y2={1060} stroke={P.ink} strokeWidth={5} />
        <rect x={40} y={560} width={300} height={200} rx={8} fill={P.sea} {...ln} />
        <path d="M60 720 Q120 620 170 700 Q230 600 320 700 L320 740 L60 740 Z" fill={P.gold} opacity={0.8} />
        <path d="M60 690 L140 610 L200 680" stroke={P.coral} strokeWidth={10} fill="none" />
        {/* curtains */}
        <path d={`M560 400 L${560 + 235 * (1 - curtain) + 30} 400 Q${560 + 235 * (1 - curtain) + 10} 800 ${560 + 235 * (1 - curtain) + 40} 1200 L540 1200 Z`} fill={P.purple} {...ln} />
        <path d={`M1050 400 L${1030 - 235 * (1 - curtain) - 30} 400 Q${1030 - 235 * (1 - curtain) - 10} 800 ${1030 - 235 * (1 - curtain) - 40} 1200 L1050 1200 Z`} fill={P.purple} {...ln} />
        {/* floor */}
        <rect x={-20} y={1300} width={1120} height={700} fill="#e2c9a0" {...ln} />
        {/* bed */}
        <rect x={40} y={1060} width={60} height={260} rx={10} fill="#b98a5a" {...ln} />
        <rect x={60} y={1200} width={620} height={150} rx={20} fill={P.white} {...ln} />
        <rect x={300} y={1200} width={110} height={150} fill={P.sea} opacity={0.9} />
        <rect x={60} y={1340} width={620} height={60} rx={10} fill="#b98a5a" {...ln} />
        <ellipse cx={170} cy={1190} rx={80} ry={36} fill="#fff" {...ln} />
        {/* kids jumping on bed */}
        <Person look={LOOKS.boy} x={480} y={1230} s={1.05} jump={jumpB} armsUp smile="open" />
        <Person look={LOOKS.girl} x={300} y={1230} s={1.05} jump={jumpG} armsUp={f % 40 < 20} smile="open" face={-1} />
        {/* mom at the window, dad with coffee */}
        <Person look={LOOKS.mom} x={930} y={1640} s={1.05} face={-1} armsUp={f > 100 && f < 150} />
        <Person look={LOOKS.dad} x={160} y={1780} s={1.1} />
        <g transform={`translate(245 ${1500 + Math.sin(f / 10) * 4})`}>
          <path d="M0 0 L40 0 L36 50 L4 50 Z" fill={P.white} {...ln} strokeWidth={4} />
          <path d="M40 12 q20 5 0 25" stroke={P.ink} strokeWidth={5} fill="none" />
          {[0, 1].map((i) => (
            <path key={i} d={`M${12 + i * 14} -10 q-8 -15 0 -30 q8 -15 0 -30`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />
          ))}
        </g>
        <Dog x={600} y={1790} s={1} />
        {new Array(4).fill(0).map((_, i) => (
          <Fly key={i} x={650 + i * 90 + Math.sin(f / 10 + i) * 40} y={600 + i * 110 + Math.cos(f / 12 + i) * 40} s={0.8} phase={i * 9} rot={15} />
        ))}
      </Sketch>
      <Banner delay={8} y={120} size={96}>Bienvenidos a Macondo 717</Banner>
      <Sequence from={130}>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Tag>Vista al mar y la Sierra</Tag>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Tag: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  return (
    <div style={{opacity: p, transform: `scale(${0.7 + 0.3 * p})`, background: P.gold, border: `4px solid ${P.ink}`, borderRadius: 999, padding: '12px 36px', fontFamily: outfit, fontWeight: 600, fontSize: 48, color: P.purpleDark}}>
      {children}
    </div>
  );
};

const Scene3: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={75}><Door /></Sequence>
    <Sequence from={60}>
      <AbsoluteFill style={{opacity: 1}}>
        <FadeIn dur={16}><Room /></FadeIn>
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

const FadeIn: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, dur], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

/* ───────── Scene 4 · Amenidades ───────── */
const PoolDay: React.FC = () => {
  const f = useCurrentFrame();
  // boy's cannonball arc
  const t = interpolate(f, [30, 70], [0, 1], clamp);
  const bx = interpolate(t, [0, 1], [180, 520]);
  const by = 1250 - Math.sin(t * Math.PI) * 360 + t * 160;
  const splash = f >= 70 ? interpolate(f, [70, 110], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.sky}, #e7f4f1 60%)`}}>
      <Sketch>
        <Cloud x={300 + f * 0.4} y={420} s={0.9} />
        <Cloud x={820 - f * 0.3} y={620} s={0.6} />
        <Palm x={120} y={1270} s={1.2} phase={3} />
        <Palm x={980} y={1280} s={1.1} phase={20} />
        {/* deck */}
        <rect x={-20} y={1260} width={1120} height={700} fill="#ecd9b4" {...ln} />
        {/* pool */}
        <path d="M60 1360 L1020 1360 L1020 1800 L60 1800 Z" fill={P.sea} {...ln} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${120 + ((i * 230 + f * 2) % 860)} ${1450 + (i % 2) * 180} q30 -14 60 0 t60 0`} stroke="#e6fbff" strokeWidth={5} fill="none" opacity={0.8} />
        ))}
        {/* girl floating in a ring */}
        <g transform={`translate(800 ${1560 + Math.sin(f / 10) * 8})`}>
          <Person look={LOOKS.girl} x={0} y={120} s={1} armsUp smile="open" face={-1} />
          <ellipse cx={0} cy={0} rx={100} ry={36} fill={P.coral} {...ln} />
          <ellipse cx={0} cy={-6} rx={56} ry={16} fill={P.sea} />
        </g>
        <rect x={60} y={1600} width={960} height={200} fill={P.sea} opacity={0.55} />
        {/* the cannonball */}
        {f < 74 && (
          <g transform={`rotate(${t * 60} ${bx} ${by - 100})`}>
            <Person look={LOOKS.boy} x={bx} y={by} s={1} armsUp={t > 0 && t < 0.8} smile="open" />
          </g>
        )}
        {splash > 0 && splash < 1 && (
          <g opacity={1 - splash * 0.8}>
            <ellipse cx={520} cy={1400} rx={60 + splash * 160} ry={16 + splash * 30} fill="#e6fbff" {...ln} strokeWidth={4} />
            {new Array(16).fill(0).map((_, i) => {
              const a = -Math.PI * (0.12 + 0.76 * random(`sa${i}`));
              const v = 300 + random(`sv${i}`) * 350;
              const t2 = splash * 1.1;
              const dx = Math.cos(a) * v * t2;
              const dy = Math.sin(a) * v * t2 + 520 * t2 * t2;
              const r = 10 + random(`sr${i}`) * 16;
              return <circle key={i} cx={520 + dx} cy={1400 + dy} r={r} fill="#e6fbff" {...ln} strokeWidth={3} />;
            })}
          </g>
        )}
        {f > 95 && (
          <g transform={`translate(520 ${1480 + Math.sin(f / 8) * 6})`}>
            <g transform="scale(0.6)"><Person look={LOOKS.boy} x={0} y={160} s={1.2} armsUp smile="open" /></g>
            <rect x={-80} y={20} width={160} height={120} fill={P.sea} />
          </g>
        )}
        {/* dog watching from the deck */}
        <Dog x={880} y={1330} s={0.9} face={-1} />
        <rect x={60} y={1800} width={960} height={140} fill="#ecd9b4" {...ln} />
      </Sketch>
      <Banner delay={10} y={160} size={100}>¡A la piscina!</Banner>
    </AbsoluteFill>
  );
};

const Sunset: React.FC = () => {
  const f = useCurrentFrame();
  const sunY = interpolate(f, [0, 150], [980, 1080]);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #4b2a6e 0%, #9b4f96 30%, #ef8f7a 58%, #f7c58a 72%)'}}>
      <Sketch wash>
        <circle cx={540} cy={sunY} r={130} fill="#ffd98a" />
        <rect x={-50} y={1080} width={1200} height={300} fill="#c0678f" />
        <path d="M-50 1080 L1130 1080 L1130 1140 L-50 1140 Z" fill="#e88f8a" opacity={0.7} />
        <path d="M720 1080 L840 980 L920 1030 L1130 900 L1130 1080 Z" fill="#6b3f6e" />
      </Sketch>
      <Sketch>
        {/* infinity pool reflecting the sky */}
        <path d="M-20 1300 L1100 1300 L1100 1700 L-20 1700 Z" fill="#b76aa0" />
        <path d="M-20 1300 L1100 1300" stroke={P.goldSoft} strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={440 + ((i * 37) % 100) - 50} y1={1340 + i * 60} x2={640 - ((i * 37) % 100) + 50} y2={1340 + i * 60} stroke="#ffd98a" strokeWidth={8} opacity={0.6 - i * 0.1} strokeLinecap="round" />
        ))}
        {/* parents in the water, from behind-ish */}
        <Person look={LOOKS.dad} x={430} y={1650} s={1.1} face={1} />
        <Person look={LOOKS.mom} x={600} y={1650} s={1.05} face={-1} />
        <rect x={-20} y={1500} width={1120} height={200} fill="#b76aa0" />
        <path d="M-20 1500 q60 -12 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" stroke="#f3c1d8" strokeWidth={5} fill="none" />
        {/* deck */}
        <rect x={-20} y={1700} width={1120} height={260} fill="#8a5a4a" {...ln} />
        {[0, 1, 2].map((i) => <line key={i} x1={-20} y1={1760 + i * 60} x2={1100} y2={1760 + i * 60} stroke={P.ink} strokeWidth={3} opacity={0.4} />)}
        {/* two drinks */}
        <g transform="translate(150 1700)">
          <path d="M0 -80 L50 -80 L40 0 L10 0 Z" fill="#f7a35c" {...ln} strokeWidth={4} />
          <path d="M80 -80 L130 -80 L120 0 L90 0 Z" fill="#f7a35c" {...ln} strokeWidth={4} />
          <circle cx={45} cy={-80} r={12} fill="#9bd36b" {...ln} strokeWidth={3} />
        </g>
        {new Array(6).fill(0).map((_, i) => (
          <Fly key={i} x={((i * 190 + f * (2 + (i % 3))) % 1300) - 100} y={500 + i * 90 + Math.sin(f / 9 + i) * 50} s={0.9} phase={i * 6} rot={20} />
        ))}
      </Sketch>
      <Banner delay={8} y={170} size={88} sub="Atardeceres mágicos 🌅">Piscina infinita en la terraza</Banner>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={150}><PoolDay /></Sequence>
    <Sequence from={140}><FadeIn dur={14}><Sunset /></FadeIn></Sequence>
  </AbsoluteFill>
);

/* ───────── Scene 5 · Cierre ───────── */
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gather = interpolate(f, [0, 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const logo = spring({frame: f - 34, fps, config: {damping: 13}});
  const line = (d: number) => interpolate(f - d, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${P.purple}, ${P.purpleDeep} 50%, ${P.purpleDark})`}}>
      <Sketch>
        {new Array(24).fill(0).map((_, i) => {
          const sx = random(`cx${i}`) * W;
          const sy = random(`cy${i}`) * H;
          const a = (i / 24) * Math.PI * 2 + f / 40;
          const tx = 540 + Math.cos(a) * 330;
          const ty = 650 + Math.sin(a) * 300;
          return <Fly key={i} x={sx + (tx - sx) * gather} y={sy + (ty - sy) * gather} s={0.9} phase={i * 4} rot={(a * 180) / Math.PI + 90} />;
        })}
        {/* family waving at the bottom */}
        <g opacity={line(50)}>
          <Person look={LOOKS.dad} x={330} y={1850} s={0.75} wave />
          <Person look={LOOKS.mom} x={470} y={1850} s={0.72} />
          <Person look={LOOKS.girl} x={590} y={1850} s={0.75} armsUp smile="open" />
          <Person look={LOOKS.boy} x={690} y={1850} s={0.75} wave smile="open" />
          <Dog x={800} y={1855} s={0.6} face={-1} />
        </g>
      </Sketch>
      <div style={{position: 'absolute', top: 460, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('img/logo.jpeg')} style={{width: 420, borderRadius: 36, border: `5px solid ${P.goldSoft}`, transform: `scale(${logo}) rotate(${(1 - logo) * -10}deg)`, boxShadow: '0 20px 60px rgba(0,0,0,.4)'}} />
      </div>
      <div style={{position: 'absolute', top: 1010, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{opacity: line(46), fontFamily: hand, fontWeight: 700, fontSize: 130, color: P.goldSoft, lineHeight: 1}}>Macondo 717</div>
        <div style={{opacity: line(56), marginTop: 30, fontFamily: outfit, fontWeight: 600, fontSize: 56, color: P.white, letterSpacing: '0.06em'}}>77rentals.com</div>
        <div style={{opacity: line(64), marginTop: 30, display: 'inline-block', background: P.gold, border: `4px solid ${P.ink}`, borderRadius: 999, padding: '14px 38px', fontFamily: outfit, fontWeight: 600, fontSize: 42, color: P.purpleDark}}>
          WhatsApp +57 304 673 6241
        </div>
        <div style={{opacity: line(70), marginTop: 18, fontFamily: hand, fontWeight: 600, fontSize: 54, color: P.goldSoft}}>Claudia · tu anfitriona</div>
      </div>
    </AbsoluteFill>
  );
};

export const S = {
  s2: [300, 540],
  s3: [540, 870],
  s4: [870, 1170],
  s5: [1170, 1350],
} as const;

export {Scene2, Scene3, Scene4, Scene5, Suitcase, Taxi, Tower};
