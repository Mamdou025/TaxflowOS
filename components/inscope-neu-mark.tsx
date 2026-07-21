'use client';

import { useId } from 'react';

// InScope neumorphic dial mark (icon v13-neu) — three concentric raised/debossed
// neumorphic rings on a cool panel, ringed by two counter-orbiting comet trails of
// dots: an ORANGE spiral (outer, 26 dots, large→small) and a PURPLE spiral (inner,
// 20 dots), each glowing. Faithful port of `inscope-icon-v13-neu.svg`, rendered
// inline so it scales cleanly and needs no asset pipeline.
//
// The disc + shadows are self-contained, so by default the mark is TRANSPARENT
// behind the disc (blends into any light surface as a round logo). Pass
// `background` to paint the SVG's own light-gradient square behind it.

// [x, y, r] in the 0 0 200 200 viewBox (centre 100,100).
const ORANGE_DOTS: [number, number, number][] = [
  [172.0, 100.0, 7.6], [170.1, 83.56, 7.25], [164.49, 67.99, 6.9], [155.48, 54.11, 6.55],
  [143.53, 42.65, 6.22], [129.29, 34.22, 5.88], [113.49, 29.28, 5.56], [96.98, 28.06, 5.24],
  [80.64, 30.65, 4.92], [65.31, 36.91, 4.61], [51.82, 46.49, 4.31], [40.88, 58.91, 4.02],
  [33.06, 73.5, 3.73], [28.77, 89.48, 3.45], [28.25, 106.02, 3.18], [31.52, 122.25, 2.92],
  [38.41, 137.3, 2.66], [48.56, 150.38, 2.42], [61.42, 160.79, 2.18], [76.32, 168.0, 1.96],
  [92.47, 171.61, 1.75], [109.02, 171.43, 1.56], [125.1, 167.48, 1.38], [139.84, 159.97, 1.22],
  [152.49, 149.29, 1.09], [162.35, 136.0, 1.0],
];
const PURPLE_DOTS: [number, number, number][] = [
  [51.0, 100.0, 5.9], [53.23, 114.63, 5.55], [59.73, 127.92, 5.2], [69.9, 138.67, 4.86],
  [82.82, 145.89, 4.53], [97.3, 148.93, 4.21], [112.03, 147.5, 3.9], [125.66, 141.74, 3.59],
  [136.95, 132.18, 3.29], [144.87, 119.68, 3.0], [148.7, 105.39, 2.72], [148.09, 90.61, 2.46],
  [143.09, 76.68, 2.2], [134.17, 64.88, 1.95], [122.13, 56.28, 1.72], [108.07, 51.67, 1.51],
  [93.27, 51.46, 1.31], [79.09, 55.69, 1.14], [66.81, 63.95, 0.99], [57.56, 75.5, 0.9],
];

export function InScopeNeuMark({
  size = 28,
  background = false,
  animate = false,
  label,
  className,
  style,
}: {
  size?: number;
  background?: boolean;
  /** Orbit the orange + purple comet spirals (outer CW, inner CCW). Off by default
   *  so the many static instances (sidebar, header, pill) stay still. */
  animate?: boolean;
  /** Text set in the centre (e.g. "Scope"). When present the inner (purple) ring is
   *  pulled out toward the orange ring, freeing the middle for the label. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Namespace every gradient/filter id so multiple instances on one page don't
  // collide (duplicate ids make browsers reference the first def). useId() can
  // contain ':' which is awkward in url(#…) refs, so strip it.
  const raw = useId().replace(/:/g, '');
  const u = (id: string) => `${id}-${raw}`;
  const ref = (id: string) => `url(#${u(id)})`;

  // With a centre label, pull the inner (purple) ring out toward the orange ring so
  // the two sit close together and the middle is free for the text; the dots also
  // shrink for a lighter, more delicate look in that (composer) variant.
  const innerScale = label ? 1.3 : 1;
  const dotScale = label ? 0.7 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      // overflow visible so the soft neumorphic shadow fades out instead of being
      // clipped to the square viewport (which read as a grey square around the disc).
      style={{ flexShrink: 0, display: 'block', overflow: 'visible', ...style }}
      aria-hidden
    >
      <defs>
        {/* Colors carry the LIGHT values as attributes; the `isneu-*` classes let a
            `.dark` rule (globals.css) swap them to the dark dial palette. stop-color /
            flood-color resolve when set via CSS, so the mark flips with the theme. */}
        <linearGradient id={u('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop className="isneu-bg-0" offset="0" stopColor="#f3f5fb" />
          <stop className="isneu-bg-1" offset="1" stopColor="#e3e6f1" />
        </linearGradient>
        <linearGradient id={u('disc')} x1="0" y1="0" x2="1" y2="1">
          <stop className="isneu-disc-0" offset="0" stopColor="#fbfcff" />
          <stop className="isneu-disc-1" offset="1" stopColor="#e4e7f2" />
        </linearGradient>
        <linearGradient id={u('discInner')} x1="0" y1="0" x2="1" y2="1">
          <stop className="isneu-inner-0" offset="0" stopColor="#f3f5fb" />
          <stop className="isneu-inner-1" offset="1" stopColor="#fafbfe" />
        </linearGradient>
        <filter id={u('neuBig')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow className="isneu-nb-hl" dx="-7" dy="-7" stdDeviation="10" floodColor="#ffffff" floodOpacity="0.95" />
          <feDropShadow className="isneu-nb-sh" dx="8" dy="10" stdDeviation="14" floodColor="#a3a8c6" floodOpacity="0.5" />
        </filter>
        <filter id={u('neuMid')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow className="isneu-nm-hl" dx="-4" dy="-4" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.9" />
          <feDropShadow className="isneu-nm-sh" dx="4.5" dy="6" stdDeviation="8" floodColor="#a8adc9" floodOpacity="0.45" />
        </filter>
        <filter id={u('neuSmall')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow className="isneu-ns-hl" dx="-2.5" dy="-2.5" stdDeviation="3.5" floodColor="#ffffff" floodOpacity="0.9" />
          <feDropShadow className="isneu-ns-sh" dx="3" dy="4" stdDeviation="5" floodColor="#a8adc9" floodOpacity="0.4" />
        </filter>
        <filter id={u('insetBand')} x="-40%" y="-40%" width="180%" height="180%">
          <feOffset dx="1.2" dy="1.5" />
          <feGaussianBlur stdDeviation="1.4" result="ob" />
          <feComposite in="SourceGraphic" in2="ob" operator="out" result="cut" />
          <feFlood className="isneu-in-sh" floodColor="#979cba" floodOpacity="0.4" />
          <feComposite in2="cut" operator="in" result="innersh" />
          <feOffset in="SourceGraphic" dx="-1" dy="-1.3" />
          <feGaussianBlur stdDeviation="1.2" result="ob2" />
          <feComposite in="SourceGraphic" in2="ob2" operator="out" result="cut2" />
          <feFlood className="isneu-in-hl" floodColor="#ffffff" floodOpacity="1" />
          <feComposite in2="cut2" operator="in" result="innerhl" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innersh" />
            <feMergeNode in="innerhl" />
          </feMerge>
        </filter>
        <filter id={u('glowO')} x="-120%" y="-120%" width="340%" height="340%">
          <feDropShadow className="isneu-glow-o" dx="0" dy="0" stdDeviation="2.2" floodColor="#f97316" floodOpacity="0.55" />
        </filter>
        <filter id={u('glowP')} x="-120%" y="-120%" width="340%" height="340%">
          <feDropShadow className="isneu-glow-p" dx="0" dy="0" stdDeviation="2.2" floodColor="#7c3aed" floodOpacity="0.55" />
        </filter>
      </defs>

      {background && <rect x="0" y="0" width="200" height="200" fill={ref('bg')} />}

      <circle cx="100" cy="100" r="92" fill={ref('disc')} filter={ref('neuBig')} />
      <circle cx="100" cy="100" r="82" fill={ref('discInner')} filter={ref('insetBand')} />
      <circle cx="100" cy="100" r="62" fill={ref('disc')} filter={ref('neuMid')} />
      <circle cx="100" cy="100" r="58" fill={ref('discInner')} filter={ref('insetBand')} />
      <circle cx="100" cy="100" r="37" fill={ref('disc')} filter={ref('neuSmall')} />
      <circle cx="100" cy="100" r="27" fill={ref('discInner')} filter={ref('insetBand')} />

      {animate && (
        <style>{`
          .insneu-cw  { animation: insneu-cw 18s linear infinite; transform-box: view-box; transform-origin: center; }
          .insneu-ccw { animation: insneu-ccw 14s linear infinite; transform-box: view-box; transform-origin: center; }
          @keyframes insneu-cw  { to { transform: rotate(360deg); } }
          @keyframes insneu-ccw { to { transform: rotate(-360deg); } }
          @media (prefers-reduced-motion: reduce) { .insneu-cw, .insneu-ccw { animation: none; } }
        `}</style>
      )}
      {/* Orange spiral orbits CW, purple spiral CCW (the comet trails) when animated. */}
      <g filter={ref('glowO')} className={animate ? 'insneu-cw' : undefined}>
        {ORANGE_DOTS.map(([cx, cy, r], i) => (
          <circle key={`o${i}`} cx={cx} cy={cy} r={r * dotScale} fill="#f97316" />
        ))}
      </g>
      <g filter={ref('glowP')} className={animate ? 'insneu-ccw' : undefined}>
        {PURPLE_DOTS.map(([cx, cy, r], i) => (
          <circle key={`p${i}`} cx={100 + (cx - 100) * innerScale} cy={100 + (cy - 100) * innerScale} r={r * dotScale} fill="#7c3aed" />
        ))}
      </g>

      {label && (
        // Engraved into the raised disc: a soft white highlight peeking below-right
        // (light source is top-left, matching the neumorphic shadows) + the darker
        // face on top — so "Scope" reads as pressed into the surface, and legibly.
        <g style={{ pointerEvents: 'none' }}>
          <text className="isneu-lbl-hi" x="100.6" y="101.5" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fillOpacity="0.8" fontSize="30" fontWeight="550" style={{ letterSpacing: '0.4px', fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>{label}</text>
          <text className="isneu-lbl-face" x="100" y="100" textAnchor="middle" dominantBaseline="central" fill="#3E4657" fontSize="30" fontWeight="550" style={{ letterSpacing: '0.4px', fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>{label}</text>
        </g>
      )}
    </svg>
  );
}
