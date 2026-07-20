// LibreChat-style dark palette — one place to swap while we converge on the look.
// (Values approximate the LibreChat / ChatGPT dark theme.)
export const LC = {
  bg: '#212121',          // main chat area
  sidebar: '#171717',     // left nav
  panel: '#1a1a1a',       // inline page panel backdrop
  surface: '#2f2f2f',     // composer, user bubble, hover targets
  surfaceHover: '#3a3a3a',
  border: 'rgba(255,255,255,0.12)',
  borderSubtle: 'rgba(255,255,255,0.07)',
  title: '#ffffff',
  text: '#ececec',
  body: '#d6d6d6',
  muted: '#9a9a9a',
  faint: '#6f6f6f',
  accent: '#a78bfa',      // soft violet for accents/active
} as const;
