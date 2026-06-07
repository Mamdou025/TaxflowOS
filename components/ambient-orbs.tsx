"use client";

const PURPLE = '#6B21A8';
const ORANGE = '#C2410C';

export function AmbientOrbs() {
  const SIZE = 560;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const OUTER_R = 196;
  const INNER_R = 148;
  const outerDots = 40;
  const innerDots = 26;

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ opacity: 0.09 }}
      >
        <style>{`
          @keyframes ambcw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
          @keyframes ambccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
          .ambcw  { animation: ambcw  9s linear infinite; transform-origin: ${CX}px ${CY}px; }
          .ambccw { animation: ambccw 6s linear infinite; transform-origin: ${CX}px ${CY}px; }
        `}</style>
        <g className="ambcw">
          {Array.from({ length: outerDots }, (_, i) => {
            const a = (i / outerDots) * Math.PI * 2;
            const dur = 22;
            const begin = -(i / outerDots) * dur;
            const kt = "0;0.02;0.07;0.93;0.98;1";
            const ks = "0 0 1 1;0.42 0 1 1;0 0 1 1;0 0 0.58 1;0 0 1 1";
            return (
              <circle key={i} cx={CX + OUTER_R * Math.cos(a)} cy={CY + OUTER_R * Math.sin(a)} r={0} fill={PURPLE}>
                <animate attributeName="r" values="0;0;0.4;4.5;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
                <animate attributeName="opacity" values="0;0;0.85;0.85;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
              </circle>
            );
          })}
        </g>
        <g className="ambccw">
          {Array.from({ length: innerDots }, (_, i) => {
            const a = (i / innerDots) * Math.PI * 2;
            const dur = 15;
            const begin = -((innerDots - i) / innerDots) * dur;
            const kt = "0;0.02;0.07;0.93;0.98;1";
            const ks = "0 0 1 1;0.42 0 1 1;0 0 1 1;0 0 0.58 1;0 0 1 1";
            return (
              <circle key={i} cx={CX + INNER_R * Math.cos(a)} cy={CY + INNER_R * Math.sin(a)} r={0} fill={ORANGE}>
                <animate attributeName="r" values="0;0;0.4;3.8;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
                <animate attributeName="opacity" values="0;0;0.85;0.85;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
              </circle>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
