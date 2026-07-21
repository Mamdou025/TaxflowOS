// Chat palette — LIGHT NEUMORPHIC. The chat (Scope focus mode + the docked
// AssistantPanel) is a light neumorphic surface, matching the sidebar and the nav
// pill; the OTHER pages keep their dark grid background (that bg is NOT driven by
// this palette). One place to swap the chat's look. Aligned to the NEU tokens
// (components/neumorphic-sidebar.tsx).
// Theme-aware: every key maps to a --sx-* token (globals.css) whose :root value
// is the original light value and whose .dark value is the dark counterpart, so
// the chat re-skins with the `.dark` class (these are used in inline style).
export const LC = {
  bg: 'var(--sx-surface)',          // chat canvas — the neumorphic ground (same as the sidebar rail)
  sidebar: 'var(--sx-surface)',     // left nav ground (the rail styles itself neumorphic)
  panel: 'var(--sx-panel)',         // inline page panel backdrop
  surface: 'var(--sx-raised)',      // composer, user bubble, hover targets — raised elements
  surfaceHover: 'var(--sx-raised-hover)',
  border: 'var(--sx-hairline)',
  borderSubtle: 'var(--sx-hairline-subtle)',
  title: 'var(--sx-ink)',           // primary ink
  text: 'var(--sx-ink)',
  body: 'var(--sx-body)',           // softer body text
  muted: 'var(--sx-muted)',
  faint: 'var(--sx-faint)',
  accent: 'var(--sx-accent)',       // purple accent (active / send)
  // Neumorphic depth (dual light/dark soft shadows) — for raised chat elements.
  shadowOut: 'var(--sx-chat-shadow-out)',
  shadowSm: 'var(--sx-chat-shadow-sm)',
  shadowIn: 'var(--sx-chat-shadow-in)',
} as const;
