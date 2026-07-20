// Chat palette — LIGHT NEUMORPHIC. The chat (Scope focus mode + the docked
// AssistantPanel) is a light neumorphic surface, matching the sidebar and the nav
// pill; the OTHER pages keep their dark grid background (that bg is NOT driven by
// this palette). One place to swap the chat's look. Aligned to the NEU tokens
// (components/neumorphic-sidebar.tsx).
export const LC = {
  bg: '#F4F5F8',          // chat canvas — the neumorphic ground (same as the sidebar rail)
  sidebar: '#F4F5F8',     // left nav ground (the rail styles itself neumorphic)
  panel: '#F1F2F6',       // inline page panel backdrop
  surface: '#F8F9FB',     // composer, user bubble, hover targets — raised elements
  surfaceHover: '#E9ECF2',
  border: 'rgba(150,156,172,0.22)',
  borderSubtle: 'rgba(150,156,172,0.13)',
  title: '#202735',       // dark ink
  text: '#202735',
  body: '#3A4150',        // softer body text
  muted: '#7C8493',
  faint: '#A8AEBA',
  accent: '#6B21A8',      // purple accent (active / send)
  // Neumorphic depth (dual light/dark soft shadows) — for raised chat elements.
  shadowOut: '6px 6px 15px rgba(158,158,178,0.32), -6px -6px 15px rgba(255,255,255,0.85)',
  shadowSm: '3px 3px 8px rgba(158,158,178,0.26), -3px -3px 8px rgba(255,255,255,0.80)',
  shadowIn: 'inset 3px 3px 7px rgba(158,158,178,0.26), inset -3px -3px 7px rgba(255,255,255,0.78)',
} as const;
