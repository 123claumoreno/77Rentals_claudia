/* Surf-style apartment 1204 and its surroundings, drawn with the same hand-made ingredients as Macondo. */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Cloud, P, Palm, ln, hand} from '../story/kit';

export const clampE = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const MADERA = '#ecd9b4';

export const Tablones: React.FC<{h?: number}> = ({h = 1380}) => (
  <g>
    {Array.from({length: 13}).map((_, i) => (
      <g key={i}>
        <rect x={i * 88 - 10} y={-20} width={88} height={h + 20} fill={i % 2 ? '#e9d4ab' : '#f0ddba'} />
        <line x1={i * 88 - 10} y1={0} x2={i * 88 - 10} y2={h} stroke={P.ink} strokeWidth={3} opacity={0.15} />
      </g>
    ))}
  </g>
);
export const Piso: React.FC<{y?: number}> = ({y = 1380}) => (
  <g>
    <rect x={-20} y={y} width={1120} height={620} fill="#d7b583" {...ln} />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-20} y1={y + 70 + i * 100} x2={1100} y2={y + 70 + i * 100} stroke={P.ink} strokeWidth={3} opacity={0.17} />)}
  </g>
);

/* surfboard: pointed nose, centre stripe, fin. label is painted near the tail */
export const Tabla: React.FC<{x: number; y: number; s?: number; rot?: number; c1?: string; c2?: string; label?: string}> = ({x, y, s = 1, rot = 0, c1 = P.sea, c2 = P.coral, label}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -300 Q74 -190 66 40 Q54 240 0 304 Q-54 240 -66 40 Q-74 -190 0 -300 Z" fill={c1} {...ln} />
    <path d="M0 -270 Q16 0 0 280" stroke={c2} strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M-52 120 Q0 150 52 120" stroke={P.white} strokeWidth={10} fill="none" opacity={0.8} />
    {label && (
      <text x={0} y={198} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={64} fill={P.white} stroke={P.ink} strokeWidth={2.5}>{label}</text>
    )}
  </g>
);

export const Maleta: React.FC<{x: number; y: number; color: string; s?: number}> = ({x, y, color, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 -120 L-10 -150 L30 -150 L30 -120" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={-40} y={-120} width={100} height={110} rx={16} fill={color} {...ln} />
    <line x1={-10} y1={-110} x2={-10} y2={-20} stroke={P.ink} strokeWidth={4} opacity={0.5} />
    <line x1={30} y1={-110} x2={30} y2={-20} stroke={P.ink} strokeWidth={4} opacity={0.5} />
    <circle cx={-22} cy={-4} r={9} fill={P.ink} />
    <circle cx={42} cy={-4} r={9} fill={P.ink} />
  </g>
);

export const Cama: React.FC<{x: number; y?: number}> = ({x, y = 1380}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-290} width={250} height={130} rx={18} fill="#b98a5a" {...ln} />
    <rect x={22} y={-190} width={86} height={44} rx={20} fill={P.white} {...ln} strokeWidth={4} />
    <rect x={142} y={-190} width={86} height={44} rx={20} fill={P.white} {...ln} strokeWidth={4} />
    <rect x={-10} y={-170} width={270} height={150} rx={20} fill={P.white} {...ln} />
    <rect x={-8} y={-110} width={266} height={26} fill={P.sea} opacity={0.9} />
    <rect x={-10} y={-30} width={270} height={40} rx={10} fill="#8a5a3a" {...ln} />
  </g>
);

/* the balcony door with the sea beyond; sailboat, palms, glass railing */
export const Balcon: React.FC<{x0?: number; y0?: number; w?: number; h?: number; id?: string}> = ({x0 = 640, y0 = 470, w = 390, h = 910, id = 'balcS'}) => {
  const f = useCurrentFrame();
  const seaY = y0 + h * 0.46;
  return (
    <g>
      <clipPath id={id}><rect x={x0} y={y0} width={w} height={h} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.sky} />
          <stop offset="1" stopColor={P.skyWarm} />
        </linearGradient>
        <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}g)`} />
        <circle cx={x0 + w * 0.72} cy={y0 + 150} r={58} fill="#fbe08a" />
        <Cloud x={x0 + 120 + f * 0.2} y={y0 + 120} s={0.4} />
        <rect x={x0} y={seaY} width={w} height={h} fill={P.sea} />
        <rect x={x0} y={seaY} width={w} height={36} fill={P.seaDeep} opacity={0.4} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${x0 - 60 + ((i * 130 + f * (1.4 + i * 0.3)) % (w + 80))} ${seaY + 60 + i * 44} q16 -10 32 0 t32 0`} stroke="#e6fbff" strokeWidth={4} fill="none" opacity={0.85} />
        ))}
        <g transform={`translate(${x0 + 120 + f * 0.3} ${seaY + 34 + Math.sin(f / 12) * 3})`}>
          <path d="M-24 0 L24 0 L16 12 L-16 12 Z" fill={P.white} {...ln} strokeWidth={3} />
          <path d="M0 -4 L0 -52 L24 -4 Z" fill={P.coral} {...ln} strokeWidth={3} />
        </g>
        <path d={`M${x0} ${seaY + 250} Q${x0 + w * 0.5} ${seaY + 205} ${x0 + w} ${seaY + 235} L${x0 + w} ${y0 + h} L${x0} ${y0 + h} Z`} fill={P.sand} />
        <Palm x={x0 + 40} y={seaY + 250} s={0.5} phase={5} />
        <Palm x={x0 + w - 50} y={seaY + 246} s={0.42} phase={17} />
        <rect x={x0} y={y0 + h - 150} width={w} height={150} fill="#d8b678" />
        <rect x={x0} y={y0 + h - 250} width={w} height={100} fill="#fff" opacity={0.18} />
        <line x1={x0} y1={y0 + h - 252} x2={x0 + w} y2={y0 + h - 252} stroke={P.ink} strokeWidth={7} />
        {Array.from({length: Math.floor(w / 78) + 1}).map((_, i) => <line key={i} x1={x0 + i * 78} y1={y0 + h - 252} x2={x0 + i * 78} y2={y0 + h - 150} stroke={P.ink} strokeWidth={4} />)}
      </g>
      <line x1={x0 + w / 2} y1={y0} x2={x0 + w / 2} y2={y0 + h} stroke={P.ink} strokeWidth={9} />
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={P.ink} strokeWidth={10} />
    </g>
  );
};

/* bedroom with two double beds, surfboard on the wall, balcony and the sea */
export const Habitacion: React.FC<{reloj?: boolean; cartel?: boolean; tic?: number}> = ({reloj, cartel, tic = 0}) => (
  <g>
    <Tablones />
    <Tabla x={285} y={800} s={0.92} rot={-5} label="1204" />
    <Cama x={40} />
    <Cama x={330} />
    <Balcon />
    <Piso />
    <ellipse cx={420} cy={1650} rx={420} ry={74} fill={P.sea} opacity={0.3} />
    <ellipse cx={420} cy={1650} rx={290} ry={46} fill={P.white} opacity={0.35} />
    {reloj && <Reloj x={500} y={640} tic={tic} />}
    {cartel && (
      <g transform="translate(300 450) rotate(-2)">
        <rect x={-170} y={-44} width={340} height={88} rx={14} fill="#b98a5a" {...ln} />
        <line x1={-120} y1={-44} x2={-120} y2={-96} stroke={P.ink} strokeWidth={4} />
        <line x1={120} y1={-44} x2={120} y2={-96} stroke={P.ink} strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={50} fill={P.white} stroke={P.ink} strokeWidth={2}>Apartamento 1204</text>
      </g>
    )}
  </g>
);

export const Reloj: React.FC<{x: number; y: number; tic: number}> = ({x, y, tic}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={104} fill="#b98a5a" {...ln} />
    <circle r={86} fill={P.white} {...ln} strokeWidth={4} />
    {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-70} x2={0} y2={i % 3 ? -62 : -54} stroke={P.ink} strokeWidth={i % 3 ? 4 : 7} transform={`rotate(${i * 30})`} strokeLinecap="round" />)}
    <line x1={0} y1={0} x2={0} y2={-48} stroke={P.ink} strokeWidth={9} strokeLinecap="round" />
    <line x1={0} y1={0} x2={0} y2={-68} stroke={P.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={8} x2={0} y2={-70} stroke={P.coral} strokeWidth={3} strokeLinecap="round" transform={`rotate(${tic * 6})`} />
    <circle r={8} fill={P.ink} />
  </g>
);

/* living room: sofa, TV, AC, switch */
export const Sala: React.FC<{tv: boolean; ledRojo: boolean; interruptor: boolean}> = ({tv, ledRojo, interruptor}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Tablones />
      <rect x={110} y={470} width={420} height={96} rx={26} fill={P.white} {...ln} />
      {[0, 1, 2].map((i) => <line key={i} x1={150} y1={510 + i * 16} x2={490} y2={510 + i * 16} stroke={P.ink} strokeWidth={3} opacity={0.3} />)}
      <circle cx={470} cy={528} r={9} fill={ledRojo ? '#d9443f' : '#4ec27a'} {...ln} strokeWidth={3} />
      <rect x={640} y={560} width={360} height={236} rx={14} fill={P.ink} />
      <rect x={652} y={572} width={336} height={212} rx={8} fill={tv ? P.sea : '#2a2030'} />
      {tv && (
        <g>
          <circle cx={900} cy={640} r={34} fill="#fbe08a" />
          <path d="M652 724 q50 -34 100 0 t100 0 t100 0 t36 0 V784 H652 Z" fill={P.coral} />
        </g>
      )}
      <rect x={740} y={796} width={180} height={24} fill="#b98a5a" {...ln} strokeWidth={4} />
      <rect x={600} y={820} width={440} height={30} rx={8} fill="#b98a5a" {...ln} />
      <g transform="translate(360 840)">
        <rect x={-110} y={-80} width={220} height={150} rx={10} fill="#b98a5a" {...ln} />
        <rect x={-92} y={-62} width={184} height={114} fill={P.sea} />
        <path d="M-92 20 q30 -40 60 0 t60 0 t64 0 V52 H-92 Z" fill={P.white} opacity={0.9} />
      </g>
      <rect x={40} y={1290} width={78} height={100} rx={12} fill={P.white} {...ln} />
      <rect x={62} y={interruptor ? 1306 : 1342} width={34} height={34} rx={8} fill={interruptor ? '#4ec27a' : '#b9aec5'} {...ln} strokeWidth={3} />
      <Piso />
      <g transform="translate(555 1380)">
        <rect x={0} y={-250} width={470} height={170} rx={44} fill="#d6b583" {...ln} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={30 + i * 80} y1={-240} x2={30 + i * 80} y2={-90} stroke={P.ink} strokeWidth={3} opacity={0.2} />)}
        <rect x={-24} y={-160} width={64} height={160} rx={24} fill="#c9a36f" {...ln} />
        <rect x={430} y={-160} width={64} height={160} rx={24} fill="#c9a36f" {...ln} />
        <rect x={22} y={-124} width={426} height={110} rx={26} fill="#e8cf9f" {...ln} />
        <rect x={70} y={-230} width={110} height={90} rx={20} fill={P.sea} {...ln} />
        <rect x={300} y={-230} width={110} height={90} rx={20} fill={P.coral} {...ln} />
      </g>
      <ellipse cx={500} cy={1740} rx={440} ry={74} fill={P.sea} opacity={0.3} />
    </g>
  );
};

export const Pasillo: React.FC<{flap?: number}> = ({flap = 0}) => (
  <g>
    <rect x={-20} y={-20} width={1120} height={1400} fill="#efe3cf" />
    {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={i * 200 - 20} y1={-20} x2={i * 200 - 20} y2={1380} stroke={P.ink} strokeWidth={3} opacity={0.1} />)}
    <rect x={690} y={480} width={330} height={900} rx={10} fill="#a8b6c0" {...ln} />
    <rect x={702} y={492} width={150} height={888} fill="#cdd8de" stroke={P.ink} strokeWidth={4} />
    <rect x={858} y={492} width={150} height={888} fill="#cdd8de" stroke={P.ink} strokeWidth={4} />
    <rect x={770} y={400} width={170} height={64} rx={14} fill={P.ink} />
    <circle cx={808} cy={432} r={9} fill="#4ec27a" />
    <text x={880} y={448} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={50} fill="#4ec27a">12</text>
    <rect x={1050} y={900} width={20} height={70} rx={9} fill={P.ink} />
    <g transform="translate(490 1290)">
      <rect x={-68} y={-120} width={136} height={170} rx={14} fill="#b98a5a" {...ln} />
      <rect x={-52} y={-104} width={104} height={138} rx={8} fill="#2a2030" />
      <g transform={`translate(-52 -104) scale(${1 - flap * 0.85} 1)`}>
        <rect x={0} y={0} width={104} height={138} rx={8} fill={P.white} {...ln} strokeWidth={4} />
        <circle cx={86} cy={70} r={7} fill={P.gold} />
      </g>
      <circle cx={0} cy={-170} r={42} fill={P.sea} {...ln} />
      <path d="M-14 -184 h28 l-3 28 h-22 z M-18 -188 h36 M-6 -192 h12" stroke={P.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <Piso y={1380} />
  </g>
);

export const Lobby: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-20} y={-20} width={1120} height={1400} fill="#efe3cf" />
      {Array.from({length: 22}).map((_, i) => <rect key={i} x={i * 52 - 6} y={420} width={34} height={960} rx={6} fill={i % 2 ? '#c79a63' : '#d6ad76'} {...ln} strokeWidth={3} />)}
      {[170, 540, 910].map((x, i) => (
        <g key={x} transform={`translate(${x} 420)`}>
          <line x1={0} y1={-30} x2={0} y2={20} stroke={P.ink} strokeWidth={4} />
          <path d="M-52 80 Q0 -10 52 80 Z" fill="#e2c28a" {...ln} />
          {[-30, -10, 10, 30].map((k) => <path key={k} d={`M${k} 76 Q${k * 0.4} 20 0 6`} stroke={P.ink} strokeWidth={2.5} fill="none" opacity={0.4} />)}
          <circle cx={0} cy={96} r={46 + Math.sin(f / 10 + i) * 3} fill="#fff1a8" opacity={0.35} />
        </g>
      ))}
      <rect x={560} y={1120} width={520} height={260} rx={12} fill="#341d3f" opacity={0} />
      <rect x={560} y={1130} width={520} height={250} fill={P.purpleDeep} {...ln} />
      <rect x={544} y={1100} width={560} height={40} rx={10} fill="#b98a5a" {...ln} />
      <rect x={640} y={760} width={250} height={76} rx={14} fill={P.purpleDeep} {...ln} />
      <text x={765} y={812} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={52} fill={P.goldSoft}>Recepción</text>
      <Piso y={1380} />
      <g transform="translate(60 1380)">
        {[-60, -30, -6, 22, 50].map((a, i) => <path key={i} transform={`translate(0 -110) rotate(${a + Math.sin(f / 24 + i) * 2})`} d="M0 0 Q-34 -100 0 -210 Q34 -100 0 0 Z" fill={i % 2 ? P.leaf : P.leafDark} {...ln} strokeWidth={4} />)}
        <path d="M-60 -120 L60 -120 L46 0 L-46 0 Z" fill={P.coral} {...ln} />
      </g>
    </g>
  );
};

export const PuertaMadera: React.FC = () => (
  <g>
    <Tablones h={1380} />
    <Tabla x={200} y={860} s={0.9} rot={4} c1={P.coral} c2={P.sea} />
    <rect x={640} y={450} width={340} height={930} rx={8} fill="#c79a63" {...ln} />
    <rect x={664} y={480} width={292} height={420} rx={8} fill="#d6ad76" {...ln} strokeWidth={4} />
    <rect x={664} y={930} width={292} height={420} rx={8} fill="#d6ad76" {...ln} strokeWidth={4} />
    <rect x={910} y={900} width={20} height={80} rx={9} fill={P.ink} />
    <rect x={760} y={402} width={100} height={38} rx={8} fill={P.gold} {...ln} />
    <text x={810} y={433} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={36} fill={P.ink}>1204</text>
    <Piso />
  </g>
);

export const Terraza: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <linearGradient id="terSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.sky} /><stop offset="1" stopColor={P.skyWarm} /></linearGradient>
      <rect x={-20} y={-20} width={1120} height={1100} fill="url(#terSky)" />
      <circle cx={850} cy={620} r={110} fill="#fbe08a" opacity={0.4} />
      <circle cx={850} cy={620} r={66} fill="#fbe08a" />
      <Cloud x={300 + f * 0.25} y={560} s={0.5} />
      <Cloud x={700 + f * 0.15} y={500} s={0.36} />
      <rect x={-20} y={760} width={1120} height={330} fill={P.sea} />
      <rect x={-20} y={760} width={1120} height={50} fill={P.seaDeep} opacity={0.4} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-60 + ((i * 220 + f * (1.5 + i * 0.4)) % 1240)} ${830 + i * 44} q22 -11 44 0 t44 0`} stroke="#e6fbff" strokeWidth={4} fill="none" opacity={0.85} />)}
      <rect x={-20} y={1000} width={1120} height={110} fill="#fff" opacity={0.16} />
      <line x1={-20} y1={998} x2={1100} y2={998} stroke={P.ink} strokeWidth={8} />
      {Array.from({length: 15}).map((_, i) => <line key={i} x1={i * 80} y1={998} x2={i * 80} y2={1110} stroke={P.ink} strokeWidth={4} />)}
      <rect x={60} y={1150} width={960} height={190} rx={50} fill="#8fd6d9" {...ln} />
      {[0, 1].map((i) => <path key={i} d={`M${80 + ((f * 2 + i * 60) % 60) - 60} ${1210 + i * 50} q15 -8 30 0 t30 0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.9} />)}
      <rect x={-20} y={1330} width={1120} height={620} fill="#d8b678" {...ln} />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-20} y1={1400 + i * 100} x2={1100} y2={1400 + i * 100} stroke={P.ink} strokeWidth={3} opacity={0.17} />)}
      <Palm x={60} y={1350} s={0.9} phase={4} />
      <Palm x={1030} y={1356} s={0.8} phase={15} />
      <g transform="translate(900 1330)">
        <line x1={0} y1={0} x2={0} y2={-360} stroke={P.ink} strokeWidth={9} />
        <path d="M-130 -300 Q0 -420 130 -300 Z" fill={P.coral} {...ln} />
        <path d="M-60 -300 Q0 -390 60 -300 Z" fill={P.white} opacity={0.9} />
      </g>
    </g>
  );
};

export const CiudadMar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <linearGradient id="ciuSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.sky} /><stop offset="1" stopColor={P.skyWarm} /></linearGradient>
      <rect x={-20} y={-20} width={1120} height={1500} fill="url(#ciuSky)" />
      <circle cx={820} cy={620} r={120} fill="#fbe08a" opacity={0.4} />
      <circle cx={820} cy={620} r={70} fill="#fbe08a" />
      <Cloud x={260 + f * 0.25} y={560} s={0.5} />
      <path d="M-20 900 Q180 780 380 850 T760 860 T1100 820 L1100 960 L-20 960 Z" fill={P.mountainFar} opacity={0.8} />
      {[70, 120, 90, 160, 110, 140, 84, 128, 100].map((h, i) => <rect key={i} x={30 + i * 44} y={930 - h} width={32} height={h + 30} rx={3} fill={i % 2 ? '#ece7f3' : '#fbf3e4'} {...ln} strokeWidth={3} />)}
      <rect x={-20} y={930} width={1120} height={430} fill={P.sea} />
      <rect x={-20} y={930} width={1120} height={52} fill={P.seaDeep} opacity={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-60 + ((i * 210 + f * (1.4 + i * 0.4)) % 1240)} ${1000 + i * 52} q22 -11 44 0 t44 0`} stroke="#e6fbff" strokeWidth={4} fill="none" opacity={0.85} />)}
      <g transform={`translate(${620 + Math.sin(f / 50) * 40} ${990 + Math.sin(f / 12) * 3})`}>
        <path d="M-34 0 L34 0 L22 16 L-22 16 Z" fill={P.white} {...ln} strokeWidth={3} />
        <path d="M0 -6 L0 -78 L36 -6 Z" fill={P.coral} {...ln} strokeWidth={3} />
      </g>
      <path d="M-20 1330 Q300 1260 1100 1310 V1400 H-20 Z" fill={P.sand} />
      <rect x={-20} y={1380} width={1120} height={560} fill="#e2c9a0" {...ln} />
      <line x1={-20} y1={1384} x2={1100} y2={1384} stroke="#fff" strokeWidth={10} opacity={0.7} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-20} y1={1470 + i * 100} x2={1100} y2={1470 + i * 100} stroke={P.ink} strokeWidth={3} opacity={0.15} />)}
      <Palm x={70} y={1390} s={0.85} phase={3} />
      <Palm x={1020} y={1394} s={0.78} phase={14} />
    </g>
  );
};

export const Cielo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <linearGradient id="cieSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8ccfe2" /><stop offset="1" stopColor={P.skyWarm} /></linearGradient>
      <rect x={-20} y={-20} width={1120} height={1960} fill="url(#cieSky)" />
      <circle cx={820} cy={600} r={110} fill="#fbe08a" opacity={0.45} />
      <circle cx={820} cy={600} r={66} fill="#fbe08a" />
      {[[200, 640, 0.7, 0.5], [760, 880, 0.6, 0.35], [420, 1100, 0.9, 0.7], [900, 1300, 0.7, 0.45], [150, 1480, 0.8, 0.6]].map(([cx, cy, sc, sp], i) => (
        <Cloud key={i} x={((cx as number) - f * (sp as number) * 2 + 1400) % 1400 - 160} y={cy as number} s={sc as number} />
      ))}
    </g>
  );
};

/* hallway with BOTH things: the apartment door on the left (key lockbox goes next to it), the trash chute and the elevator on the right */
export const PasilloLargo: React.FC<{flap?: number}> = ({flap = 0}) => (
  <g>
    <rect x={-20} y={-20} width={1120} height={1400} fill="#efe3cf" />
    {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={i * 200 - 20} y1={-20} x2={i * 200 - 20} y2={1380} stroke={P.ink} strokeWidth={3} opacity={0.1} />)}
    <rect x={20} y={450} width={230} height={930} rx={8} fill="#c79a63" {...ln} />
    <rect x={40} y={480} width={190} height={400} rx={6} fill="#d6ad76" {...ln} strokeWidth={4} />
    <rect x={40} y={910} width={190} height={430} rx={6} fill="#d6ad76" {...ln} strokeWidth={4} />
    <rect x={196} y={880} width={16} height={70} rx={8} fill={P.ink} />
    <rect x={80} y={404} width={110} height={38} rx={8} fill={P.gold} {...ln} />
    <text x={135} y={435} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={36} fill={P.ink}>1204</text>
    <rect x={770} y={480} width={290} height={900} rx={10} fill="#a8b6c0" {...ln} />
    <rect x={782} y={492} width={128} height={888} fill="#cdd8de" stroke={P.ink} strokeWidth={4} />
    <rect x={916} y={492} width={128} height={888} fill="#cdd8de" stroke={P.ink} strokeWidth={4} />
    <rect x={810} y={410} width={170} height={60} rx={14} fill={P.ink} />
    <circle cx={846} cy={440} r={9} fill="#4ec27a" />
    <text x={920} y={456} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={48} fill="#4ec27a">12</text>
    <g transform="translate(610 1290)">
      <rect x={-68} y={-120} width={136} height={170} rx={14} fill="#b98a5a" {...ln} />
      <rect x={-52} y={-104} width={104} height={138} rx={8} fill="#2a2030" />
      <g transform={`translate(-52 -104) scale(${1 - flap * 0.85} 1)`}>
        <rect x={0} y={0} width={104} height={138} rx={8} fill={P.white} {...ln} strokeWidth={4} />
        <circle cx={86} cy={70} r={7} fill={P.gold} />
      </g>
      <circle cx={0} cy={-170} r={42} fill={P.sea} {...ln} />
      <path d="M-14 -184 h28 l-3 28 h-22 z M-18 -188 h36 M-6 -192 h12" stroke={P.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <Piso y={1380} />
  </g>
);
