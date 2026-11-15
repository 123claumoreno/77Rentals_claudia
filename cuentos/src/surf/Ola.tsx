/* Transition for the surf story: a turquoise wave with a foam crest sweeps up the screen. Covers the cut at its middle. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {P, W, H, ln} from '../story/kit';

export const OlaWipe: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const p = f / dur;
  const top = H + 120 - p * (H + 120 + 2500);            // y of the crest
  const crest = (y: number, amp: number, ph: number) => {
    let d = `M-60 ${y}`;
    for (let i = 0; i <= 12; i++) d += ` Q${i * 100 - 10} ${y + (i % 2 ? amp : -amp) + Math.sin(f / 5 + ph + i) * 6} ${i * 100 + 40} ${y}`;
    return d;
  };
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <path d={`${crest(top + 40, 34, 0)} L${W + 60} ${top + 2500} L-60 ${top + 2500} Z`} fill={P.seaDeep} />
        <path d={`${crest(top + 90, 30, 2)} L${W + 60} ${top + 2500} L-60 ${top + 2500} Z`} fill={P.sea} />
        <path d={`${crest(top + 150, 24, 4)} L${W + 60} ${top + 2500} L-60 ${top + 2500} Z`} fill="#8fd0d6" />
        <path d={crest(top + 34, 36, 1)} stroke="#fffaf2" strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d={crest(top + 34, 36, 1)} stroke={P.ink} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.35} />
        {new Array(16).fill(0).map((_, i) => (
          <circle key={i} cx={(i * 137) % W} cy={top + 20 + ((i * 53) % 200)} r={6 + (i % 4) * 3} fill="#fffaf2" opacity={0.8} {...{}} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
