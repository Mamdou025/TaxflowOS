

// ─────────────────────────────────────────────────────────────────────────────
// Sina's identity mark — a real face for the one unified assistant instead of flat
// "Si" initials. Sina is a coworker, so the mark is a friendly person (head +
// shoulders, the universal 👤 silhouette) in the brand violet. Two forms:
//   • SinaGlyph    — a NEUMORPHIC avatar built in the InScope dial's vocabulary
//                    (inscope-neu-mark.tsx): a soft raised disc with a debossed inner
//                    well cradling the softly-lit figure. Reuses the shared `isneu-*`
//                    classes so its highlights/shadows flip with the light↔dark theme
//                    (globals.css). `overflow: visible` so the neu shadow isn't clipped.
//   • SinaMarkIcon — a monochrome (currentColor) person for the Scope sidebar "Agent"
//                    row, so it matches the avatar and sits beside the lucide icons.
// Rendered inline so it scales cleanly, needs no asset pipeline, reads at 16–26px.
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react';

// The "bust" silhouette (head + rounded shoulders) in the 0 0 200 200 viewBox — the
// coworker figure that sits inside the avatar's well.
const HEAD = { cx: 100, cy: 80, r: 26 };
const SHOULDERS = 'M54,152 Q54,112 100,112 Q146,112 146,152 Z';

/** Neumorphic Sina avatar: a raised soft disc with a debossed inner well holding a
 *  softly-lit coworker figure. Theme-aware via the shared `isneu-*` classes. */
export function SinaGlyph({ size = 26 }: { size?: number }) {
  // Namespace every gradient/filter id so multiple avatars on one page don't
  // collide (duplicate ids make browsers reference the first def). useId() can
  // contain ':' which is awkward in url(#…), so strip it.
  const raw = useId().replace(/:/g, '');
  const u = (id: string) => `${id}-${raw}`;
  const ref = (id: string) => `url(#${u(id)})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      // Match the dial's proportions + let the soft neumorphic shadow bleed out.
      style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        {/* Disc gradients carry the LIGHT values as attributes; the `isneu-*` classes
            let a `.dark` rule (globals.css) swap them to the dark neu palette, so the
            mark flips with the theme. Shared with inscope-neu-mark.tsx. */}
        <linearGradient id={u('disc')} x1="0" y1="0" x2="1" y2="1">
          <stop className="isneu-disc-0" offset="0" stopColor="#fbfcff" />
          <stop className="isneu-disc-1" offset="1" stopColor="#e4e7f2" />
        </linearGradient>
        <linearGradient id={u('discInner')} x1="0" y1="0" x2="1" y2="1">
          <stop className="isneu-inner-0" offset="0" stopColor="#f3f5fb" />
          <stop className="isneu-inner-1" offset="1" stopColor="#fafbfe" />
        </linearGradient>
        {/* The figure — brand violet, lit from the top-left (fixed accent, like the
            dial's dots it reads on both light and dark discs). */}
        <linearGradient id={u('figure')} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#C4A6FF" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>

        {/* Raised (highlight top-left / shadow bottom-right) + debossed (inset band)
            neu filters — ported from inscope-neu-mark.tsx; the isneu-* classes flip
            their flood colours in dark mode. */}
        <filter id={u('neuMid')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow className="isneu-nm-hl" dx="-4" dy="-4" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.9" />
          <feDropShadow className="isneu-nm-sh" dx="4.5" dy="6" stdDeviation="8" floodColor="#a8adc9" floodOpacity="0.45" />
        </filter>
        <filter id={u('insetBand')} x="-40%" y="-40%" width="180%" height="180%">
          <feOffset dx="1.4" dy="1.7" />
          <feGaussianBlur stdDeviation="1.6" result="ob" />
          <feComposite in="SourceGraphic" in2="ob" operator="out" result="cut" />
          <feFlood className="isneu-in-sh" floodColor="#979cba" floodOpacity="0.42" />
          <feComposite in2="cut" operator="in" result="innersh" />
          <feOffset in="SourceGraphic" dx="-1.1" dy="-1.4" />
          <feGaussianBlur stdDeviation="1.3" result="ob2" />
          <feComposite in="SourceGraphic" in2="ob2" operator="out" result="cut2" />
          <feFlood className="isneu-in-hl" floodColor="#ffffff" floodOpacity="1" />
          <feComposite in2="cut2" operator="in" result="innerhl" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innersh" />
            <feMergeNode in="innerhl" />
          </feMerge>
        </filter>
        {/* Soft violet halo so the figure reads as lit, not pasted on. */}
        <filter id={u('glow')} x="-120%" y="-120%" width="340%" height="340%">
          <feDropShadow className="isneu-glow-p" dx="0" dy="0" stdDeviation="3.5" floodColor="#7c3aed" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* Raised outer disc → debossed inner well (the concentric neu depth). */}
      <circle cx="100" cy="100" r="92" fill={ref('disc')} filter={ref('neuMid')} />
      <circle cx="100" cy="100" r="74" fill={ref('discInner')} filter={ref('insetBand')} />

      {/* The coworker figure, softly lit, clipped to the round well so the shoulders
          meet the well's edge cleanly. */}
      <clipPath id={u('well')}>
        <circle cx="100" cy="100" r="70" />
      </clipPath>
      <g filter={ref('glow')} clipPath={ref('well')}>
        <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} fill={ref('figure')} />
        <path d={SHOULDERS} fill={ref('figure')} />
        {/* A soft sheen on the head for dimension (light from the top-left). */}
        <ellipse cx="91" cy="71" rx="9" ry="7" fill="#ffffff" opacity="0.26" />
      </g>
    </svg>
  );
}

/** Sina coworker glyph for the sidebar "Agent" row. An OUTLINE person drawn in
 *  lucide's exact style (24 viewBox, stroke `currentColor`, width 2, round caps) so
 *  it sits at the same visual weight as the lucide line icons beside it — NOT filled.
 *  lucide-compatible ({ size } prop). */
export function SinaMarkIcon({ size = 16 }: { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}
