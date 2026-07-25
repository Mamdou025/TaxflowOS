

import { LC } from '@/lib/librechat-theme';

// InScope mark — the animated "Scope orb": two concentric rings of small dots
// (mostly light slate, with a few larger orange + purple accents) that orbit the
// centre continuously (outer ring one way, inner the other) — the original dot-orb
// look. `label` renders text (e.g. "Scope") in the middle; only the composer orb
// uses it (elsewhere the mark pairs with a separate wordmark).
const LIGHT = '#AEB7C6';
const ORANGE = '#F5822A';
const PURPLE = '#7C3AED';

type Dot = { x: number; y: number; r: number; fill: string; key: string };
function dotRing(count: number, radius: number, sizeSeed: number, colorSeed: number): Dot[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const accent = (i + colorSeed) % 6 === 0;
    const fill = accent ? (Math.floor((i + colorSeed) / 6) % 2 === 0 ? ORANGE : PURPLE) : LIGHT;
    const r = accent ? 4 : (i + sizeSeed) % 3 === 0 ? 3 : 1.9;
    return { x: radius * Math.cos(a), y: radius * Math.sin(a), r, fill, key: `${radius}-${i}` };
  });
}
const OUTER = dotRing(26, 84, 0, 1);
const INNER = dotRing(18, 62, 1, 4);

export function ScopeGlyph({ size, active = false, label }: { size: number; active?: boolean; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
      {/* Rings orbit continuously (outer CW, inner CCW); the orange/purple accents
          make the rotation read. Rotates around the viewBox centre (0,0). */}
      <style>{`
        .orb-cw, .orb-ccw { transform-box: view-box; transform-origin: center; }
        .orb-cw  { animation: orb-cw 16s linear infinite; }
        .orb-ccw { animation: orb-ccw 12s linear infinite; }
        @keyframes orb-cw  { to { transform: rotate(360deg); } }
        @keyframes orb-ccw { to { transform: rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) { .orb-cw, .orb-ccw { animation: none; } }
      `}</style>
      <g className="orb-cw">
        {OUTER.map((d) => <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />)}
      </g>
      <g className="orb-ccw">
        {INNER.map((d) => <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />)}
      </g>
      {label && (
        <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fontSize="35" fontWeight="750" style={{ letterSpacing: '0.3px', fill: active ? 'var(--sx-accent-strong)' : 'var(--sx-body)' }}>{label}</text>
      )}
    </svg>
  );
}

// Compact shared Scope orb on a small raised convex badge (the design's cool
// neumorphic panel). Pass `label` to show text (e.g. "Scope") inside — the composer
// orb does; the sidebar/nav/header keep their own wordmarks alongside.
export function ScopeMark({ size = 22, active = false, label }: { size?: number; active?: boolean; label?: string }) {
  return (
    <span
      className="scope-mark"
      style={{
        position: 'relative', width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--sx-orb-badge)',
        boxShadow: 'var(--sx-orb-badge-shadow)',
      }}
    >
      <ScopeGlyph size={size} active={active} label={label} />
    </span>
  );
}

// The Scope "keystone" — a raised pedestal, the SAME colour as the nav bar, that
// the bar bulges up into (it overlaps the bar's top-center, so bar + pedestal read
// as one continuous silhouette). It houses the orb + "Scope" label and is the
// dominant, central element. Meant to be placed absolutely in the (relative) bar,
// anchored to overlap its top-center.
const BAR_BG = 'var(--sx-nav-bar)';
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
        boxShadow: active ? 'var(--sx-keystone-shadow-active)' : 'var(--sx-keystone-shadow)',
        transition: 'box-shadow 220ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <span
        className="scope-mark group-hover:scale-[1.04]!"
        style={{
          position: 'relative', width: ORB, height: ORB, borderRadius: '50%', overflow: 'hidden',
          background: 'var(--sx-orb-badge)',
          boxShadow: active ? 'var(--sx-orb-disc-shadow-active)' : 'var(--sx-orb-disc-shadow)',
          transition: 'box-shadow 220ms, transform 220ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <ScopeGlyph size={ORB} active={active} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 750, letterSpacing: '0.04em', color: active ? 'var(--sx-accent-strong)' : 'var(--sx-muted)', lineHeight: 1, textTransform: 'uppercase' }}>Scope</span>
    </button>
  );
}

// ── The Scope Console orb ─────────────────────────────────────────────────────
// A faithful port of the tax-workspace-UI reference composer orb (`ScopeButton`):
// a large raised neumorphic disc holding two concentric rings of dots that ROTATE
// while individually BREATHING (fade/scale in and out as they travel) — outer
// purple ring clockwise, inner orange ring counter-clockwise — with "Scope" set in
// the centre. This is the chat composer's logo (the reference uses it only there;
// the nav/sidebar/header keep the compact ScopeMark). Doubles as the client
// switcher, so it takes an onClick.
const NEU_PURPLE = '#6B21A8';
const NEU_ORANGE = '#C2410C';
const ACCENT_RING = 'rgba(124,110,174,0.28)'; // reference --is-accent-ring

export function ScopeConsoleOrb({
  size = 80,
  onClick,
  title = 'Choose client — Scope reads their worksheets & documents',
}: { size?: number; onClick?: () => void; title?: string }) {
  const CX = 40; const CY = 40; // normalised 0 0 80 80 viewBox (matches the reference math)
  return (
    <button
      onClick={onClick}
      aria-label="Open Scope"
      title={title}
      style={{
        width: size, height: size, borderRadius: '50%', padding: 0, flexShrink: 0,
        background: LC.surface, boxShadow: LC.shadowOut, border: 'none',
        cursor: onClick ? 'pointer' : 'default', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'box-shadow 180ms cubic-bezier(0.23,1,0.32,1)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `${LC.shadowOut}, 0 0 0 2px ${ACCENT_RING}`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = LC.shadowOut; }}
    >
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        {/* The rings rotate (CSS on the groups); each dot independently breathes
            (CSS opacity+scale, staggered by index) — the reference's living orb, but
            driven by CSS so it renders reliably (SMIL was dropped by the pipeline). */}
        <style>{`
          @keyframes sb-cw  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes sb-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes sb-breathe { 0%, 100% { opacity: 0.12; transform: scale(0.45); } 50% { opacity: 0.85; transform: scale(1); } }
          .sb-cw  { animation: sb-cw  14s linear infinite; transform-box: view-box; transform-origin: center; }
          .sb-ccw { animation: sb-ccw  9s linear infinite; transform-box: view-box; transform-origin: center; }
          .sb-dot { transform-box: fill-box; transform-origin: center; animation: sb-breathe linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .sb-cw, .sb-ccw, .sb-dot { animation: none; }
            .sb-dot { opacity: 0.5; }
          }
        `}</style>
        {/* Outer purple dots — breathing + rotating clockwise */}
        <g className="sb-cw">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <circle
                key={i} className="sb-dot"
                cx={CX + 34 * Math.cos(a)} cy={CY + 34 * Math.sin(a)} r={1.7} fill={NEU_PURPLE}
                style={{ animationDuration: '3.6s', animationDelay: `${-(i / 24) * 3.6}s` }}
              />
            );
          })}
        </g>
        {/* Inner orange dots — breathing + counter-rotating */}
        <g className="sb-ccw">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <circle
                key={i} className="sb-dot"
                cx={CX + 24 * Math.cos(a)} cy={CY + 24 * Math.sin(a)} r={1.5} fill={NEU_ORANGE}
                style={{ animationDuration: '3s', animationDelay: `${-(i / 16) * 3}s` }}
              />
            );
          })}
        </g>
      </svg>
      <span style={{ position: 'relative', zIndex: 1, fontSize: Math.round(size * 0.1375), fontWeight: 700, color: LC.text, letterSpacing: '0.02em' }}>
        Scope
      </span>
    </button>
  );
}
