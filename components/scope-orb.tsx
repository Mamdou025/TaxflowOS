'use client';

// Scope orb — the animated dot-orb that represents Scope (the product that
// encompasses everything). Rendered as a raised "crown" in the center of the top
// nav; clicking it takes you into Scope. OrbDots is the same ring animation the
// old ActionOrb used.

const PURPLE = '#6B21A8';
const ORANGE = '#C2410C';

export function OrbDots({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * (57 / 170);
  const innerR = size * (43 / 170);
  return (
    <>
      <style>{`
        @keyframes navorb-cw  { to { transform: rotate(360deg);  } }
        @keyframes navorb-ccw { to { transform: rotate(-360deg); } }
        .navorb-cw  { animation: navorb-cw  9s linear infinite; transform-origin: ${cx}px ${cy}px; }
        .navorb-ccw { animation: navorb-ccw 6s linear infinite; transform-origin: ${cx}px ${cy}px; }
      `}</style>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <g className="navorb-cw">
          {Array.from({ length: 40 }, (_, i) => {
            const a = (i / 40) * Math.PI * 2;
            const dur = 22;
            const begin = -(i / 40) * dur;
            const kt = '0;0.02;0.07;0.93;0.98;1';
            const ks = '0 0 1 1;0.42 0 1 1;0 0 1 1;0 0 0.58 1;0 0 1 1';
            return (
              <circle key={i} cx={cx + outerR * Math.cos(a)} cy={cy + outerR * Math.sin(a)} r={0} fill={PURPLE}>
                <animate attributeName="r" values="0;0;0.15;1.9;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
                <animate attributeName="opacity" values="0;0;0.85;0.85;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
              </circle>
            );
          })}
        </g>
        <g className="navorb-ccw">
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * Math.PI * 2;
            const dur = 15;
            const begin = -((26 - i) / 26) * dur;
            const kt = '0;0.02;0.07;0.93;0.98;1';
            const ks = '0 0 1 1;0.42 0 1 1;0 0 1 1;0 0 0.58 1;0 0 1 1';
            return (
              <circle key={i} cx={cx + innerR * Math.cos(a)} cy={cy + innerR * Math.sin(a)} r={0} fill={ORANGE}>
                <animate attributeName="r" values="0;0;0.15;1.6;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
                <animate attributeName="opacity" values="0;0;0.85;0.85;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
              </circle>
            );
          })}
        </g>
      </svg>
    </>
  );
}

// The Scope "keystone" — a raised pedestal, the SAME colour as the nav bar, that
// the bar bulges up into (it overlaps the bar's top-center, so bar + pedestal read
// as one continuous silhouette). It houses the orb + "Scope" label and is the
// dominant, central element. Meant to be placed absolutely in the (relative) bar,
// anchored to overlap its top-center.
const BAR_BG = '#eaeaef';
export function ScopeKeystone({ active, onClick }: { active: boolean; onClick: () => void }) {
  const ORB = 44;
  return (
    <button
      onClick={onClick}
      title="Scope — your workspace"
      aria-label="Open Scope"
      className="group"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        width: 150, paddingTop: 12, paddingBottom: 10, border: 'none', cursor: 'pointer',
        background: BAR_BG,
        borderRadius: '36px 36px 14px 14px',
        // Raised: a soft, diffuse elevation (no tight groove at the base) + a top
        // rim highlight; the bottom sits inside the bar (same colour) so bar and
        // pedestal read as one continuous silhouette bulging upward.
        boxShadow: active
          ? '0 7px 20px rgba(107,33,168,0.18), inset 0 1.5px 0 rgba(255,255,255,0.92)'
          : '0 8px 20px rgba(158,158,178,0.42), inset 0 1.5px 0 rgba(255,255,255,0.92)',
        transition: 'box-shadow 220ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <span
        className="group-hover:scale-[1.04]!"
        style={{
          position: 'relative', width: ORB, height: ORB, borderRadius: '50%', overflow: 'hidden',
          background: '#eef0f4',
          boxShadow: active
            ? '0 0 0 2px rgba(107,33,168,0.5), 0 3px 9px rgba(107,33,168,0.28)'
            : 'inset 0 1px 3px rgba(158,158,178,0.45), 0 1px 0 rgba(255,255,255,0.8)',
          transition: 'box-shadow 220ms, transform 220ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <OrbDots size={ORB} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 750, letterSpacing: '0.04em', color: active ? '#6B21A8' : '#4b5563', lineHeight: 1, textTransform: 'uppercase' }}>Scope</span>
    </button>
  );
}
