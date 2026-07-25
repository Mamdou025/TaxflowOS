

// ─────────────────────────────────────────────────────────────────────────────
// ThemeToggle — the Light/Dark switch that lives in the app sidebars.
// Neumorphic segmented control (Sun | Moon). Self-theming via the --sx-* tokens
// (globals.css), so it looks right in whichever theme is active. Drives
// next-themes; the chosen class ('' | 'dark') is applied to <html> and every
// --sx-* / .dark-aware surface flips with it.
//
// Two layouts:
//   • expanded  → a two-segment pill, the active mode pressed-in + accent-tinted
//   • collapsed → a single square button showing the CURRENT mode's icon,
//                 click toggles to the other (with a tooltip)
// ─────────────────────────────────────────────────────────────────────────────

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const seg = (active: boolean): CSSProperties => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '6px 8px',
  borderRadius: 9,
  border: 'none',
  cursor: 'pointer',
  fontSize: 11.5,
  fontWeight: active ? 700 : 550,
  fontFamily: 'inherit',
  color: active ? 'var(--sx-accent)' : 'var(--sx-muted)',
  background: active ? 'var(--sx-surface)' : 'transparent',
  boxShadow: active ? 'var(--sx-shadow-in)' : 'none',
  transition: 'color 160ms ease-out',
});

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Theme is only known on the client — render a stable placeholder until mount
  // so SSR and the first client paint match (no hydration warning).
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          border: 'none',
          background: 'var(--sx-raised)',
          boxShadow: 'var(--sx-shadow-sm)',
          color: 'var(--sx-muted)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto',
        }}
      >
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        borderRadius: 12,
        background: 'var(--sx-surface)',
        boxShadow: 'var(--sx-shadow-in)',
      }}
    >
      <button type="button" onClick={() => setTheme('light')} style={seg(mounted && !isDark)} aria-pressed={mounted && !isDark}>
        <Sun size={14} /> Light
      </button>
      <button type="button" onClick={() => setTheme('dark')} style={seg(isDark)} aria-pressed={isDark}>
        <Moon size={14} /> Dark
      </button>
    </div>
  );
}
