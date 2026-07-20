'use client';

// InScope mark — the neumorphic engraved "ring + swoosh" (slate), from
// `scope-icon-neumorphic`. Static; the orbiting comet lights are a separate layer
// (see ScopeComets), so this stays a plain, cheap SVG.
const SLATE = '#8A97AE';
const SWOOSH = 'M -132 112 C -58 102, -54 14, 0 0 C 54 -14, 50 -102, 132 -112';

export function ScopeGlyph({ size, active = false }: { size: number; active?: boolean }) {
  const ring = active ? '#6D28D9' : SLATE;
  // Flat surface colour that cuts the ring where the swoosh crosses.
  const gap = '#E4EAF3';
  return (
    <svg
      width={size}
      height={size}
      viewBox="-188 -188 376 376"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden
    >
      <g fill="none">
        <circle r="156" stroke="#FFFFFF" strokeWidth="5" opacity="0.9" transform="translate(1.5 1.5)" />
        <circle r="156" stroke="#C6CFDE" strokeWidth="5" />
        <circle r="102" stroke="#FFFFFF" strokeWidth="21" opacity="0.85" transform="translate(2.5 2.5)" />
        <circle r="102" stroke={ring} strokeWidth="21" />
        <path d={SWOOSH} stroke={gap} strokeWidth="52" strokeLinecap="round" />
        <path d={SWOOSH} stroke="#FFFFFF" strokeWidth="21" strokeLinecap="round" opacity="0.85" transform="translate(2.5 2.5)" />
        <path d={SWOOSH} stroke={SLATE} strokeWidth="21" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ScopeComets — two counter-rotating comet lights over the mark: an ORANGE light
// orbits the outer circle clockwise, a PURPLE light the inner circle counter-
// clockwise, each trailing a tail that fades around the WHOLE circle (a conic
// gradient masked to a ring). Hidden/paused at rest; runs on hover, or PERMANENTLY
// when `always` (used by the big chat-page header logo). Honours reduced-motion.
export function ScopeComets({ size = 44, always = false }: { size?: number; always?: boolean }) {
  const blur = Math.max(0.6, size * 0.03);
  return (
    <span className={`lc-comets${always ? ' lc-comets-always' : ''}`} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '50%' }}>
      <style>{`
        .lc-comet { position: absolute; inset: 0; border-radius: 50%; will-change: transform; }
        .lc-comet-o {
          background: conic-gradient(from 0deg, rgba(245,130,42,0) 0deg, #F5822A 352deg, #FFCFA6 360deg);
          -webkit-mask: radial-gradient(circle closest-side, transparent 71%, #000 77%, #000 83%, transparent 89%);
                  mask: radial-gradient(circle closest-side, transparent 71%, #000 77%, #000 83%, transparent 89%);
          animation: lc-orbit-cw 2.6s linear infinite;
        }
        .lc-comet-p {
          /* Mirror of the orange stops so the head LEADS while rotating CCW (tail trails clockwise). */
          background: conic-gradient(from 0deg, #D3B9FF 0deg, #7C3AED 8deg, rgba(124,58,237,0) 360deg);
          -webkit-mask: radial-gradient(circle closest-side, transparent 54%, #000 60%, #000 66%, transparent 72%);
                  mask: radial-gradient(circle closest-side, transparent 54%, #000 60%, #000 66%, transparent 72%);
          animation: lc-orbit-ccw 3.1s linear infinite;
        }
        .lc-comet-o, .lc-comet-p { animation-play-state: paused; }
        .lc-comets { opacity: 0; transition: opacity 300ms ease; }
        .scope-mark:hover .lc-comets, .lc-comets-always { opacity: 1; }
        .scope-mark:hover .lc-comet-o, .scope-mark:hover .lc-comet-p,
        .lc-comets-always .lc-comet-o, .lc-comets-always .lc-comet-p { animation-play-state: running; }
        @keyframes lc-orbit-cw  { to { transform: rotate(360deg); } }
        @keyframes lc-orbit-ccw { to { transform: rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .lc-comet-o, .lc-comet-p { animation: none !important; }
          .lc-comets:not(.lc-comets-always) { opacity: 0 !important; }
        }
      `}</style>
      <span className="lc-comet lc-comet-o" style={{ filter: `blur(${blur}px)` }} />
      <span className="lc-comet lc-comet-p" style={{ filter: `blur(${blur}px)` }} />
    </span>
  );
}

// Compact shared InScope mark on a small raised convex badge (the design's cool
// neumorphic panel). The `scope-mark` class runs the hover comet lights; pass
// `animate="always"` to run them permanently (the big chat-page header logo does).
export function ScopeMark({ size = 22, active = false, animate = 'hover' }: { size?: number; active?: boolean; animate?: 'hover' | 'always' }) {
  return (
    <span
      className="scope-mark"
      style={{
        position: 'relative', width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F4FA 0%, #DCE3EE 100%)',
        boxShadow: '1.5px 1.5px 4px rgba(166,178,200,0.5), -1.5px -1.5px 4px rgba(255,255,255,0.95)',
      }}
    >
      <ScopeGlyph size={size} active={active} />
      <ScopeComets size={size} always={animate === 'always'} />
    </span>
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
          ? '0 7px 20px rgba(109,40,217,0.2), inset 0 1.5px 0 rgba(255,255,255,0.92)'
          : '0 8px 20px rgba(166,178,200,0.42), inset 0 1.5px 0 rgba(255,255,255,0.92)',
        transition: 'box-shadow 220ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <span
        className="scope-mark group-hover:scale-[1.04]!"
        style={{
          // A raised, convex badge (the design's cool neumorphic panel) holding the
          // InScope ring+swoosh mark; active adds a violet rim + glow.
          position: 'relative', width: ORB, height: ORB, borderRadius: '50%', overflow: 'hidden',
          background: 'linear-gradient(145deg, #F0F4FA 0%, #DCE3EE 100%)',
          boxShadow: active
            ? '0 0 0 2px rgba(109,40,217,0.5), 3px 3px 8px rgba(109,40,217,0.24), -2px -2px 6px rgba(255,255,255,0.95)'
            : '3px 3px 7px rgba(166,178,200,0.5), -2px -2px 6px rgba(255,255,255,0.95)',
          transition: 'box-shadow 220ms, transform 220ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <ScopeGlyph size={ORB} active={active} />
        <ScopeComets size={ORB} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 750, letterSpacing: '0.04em', color: active ? '#6D28D9' : '#4b5563', lineHeight: 1, textTransform: 'uppercase' }}>Scope</span>
    </button>
  );
}
