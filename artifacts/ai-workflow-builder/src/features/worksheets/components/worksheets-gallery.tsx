

// Presentational worksheets gallery — a card per worksheet. Shared by the
// standalone /worksheets route (paints its own light bg, inside WorksheetShell)
// and the Scope inline "Worksheets" hub (transparent — it sits on the portal's
// light gray ground so the chat stays the prominent surface). The caller owns
// "open" via onOpen and whether the gallery is transparent via `dark`.

import { ArrowRight } from 'lucide-react';
import { WORKSHEETS, type WorksheetMeta } from '@/components/worksheet-shell';
import { NEU } from '@/components/neumorphic-sidebar';

export function WorksheetsGallery({ subtitle, onOpen, dark = false }: {
  subtitle?: string;
  onOpen: (ws: WorksheetMeta) => void;
  dark?: boolean;
}) {
  // `dark` now means only that the gallery is TRANSPARENT so the host portal's
  // gray ground shows through (the portal is a light neumorphic gray, no longer a
  // dark canvas). Text + cards render the same light neumorphic way in both modes;
  // the sole difference is whether the gallery paints its own light bg (standalone
  // /worksheets) or lets the portal ground show (inline hub).
  const t = dark
    ? { outer: 'transparent', title: NEU.text, sub: NEU.muted,
        card: NEU.surface, cardBorder: 'none', cardShadow: NEU.shadowSm, cardHover: NEU.shadowOut,
        iconBg: NEU.bg, iconColor: NEU.accent, label: NEU.text, desc: NEU.muted, arrow: NEU.faint }
    : { outer: NEU.bg, title: NEU.text, sub: NEU.muted,
        card: NEU.surface, cardBorder: 'none', cardShadow: NEU.shadowSm, cardHover: NEU.shadowOut,
        iconBg: NEU.bg, iconColor: NEU.accent, label: NEU.text, desc: NEU.muted, arrow: NEU.faint };

  return (
    <div style={{ background: t.outer, minHeight: '100%', padding: '32px 36px' }}>
      <style>{`.ws-card:hover { transform: translateY(-2px); box-shadow: ${t.cardHover}; }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 22, fontWeight: 750, color: t.title, letterSpacing: '-0.02em' }}>Worksheets</div>
        {subtitle && (
          <div style={{ margin: '6px 0 26px', fontSize: 13, color: t.sub }}>{subtitle}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {WORKSHEETS.map((ws) => (
            <button
              key={ws.href}
              onClick={() => onOpen(ws)}
              className="ws-card"
              style={{
                textAlign: 'left', border: t.cardBorder, cursor: 'pointer',
                background: t.card, borderRadius: 16, padding: 18,
                boxShadow: t.cardShadow, display: 'flex', flexDirection: 'column', gap: 11,
                transition: 'transform 160ms ease, box-shadow 160ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: t.iconBg, boxShadow: NEU.shadowSm, display: 'grid', placeItems: 'center', color: t.iconColor }}>
                  <ws.Icon size={19} />
                </span>
                <ArrowRight size={16} style={{ color: t.arrow }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.label, letterSpacing: '-0.01em' }}>{ws.label}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: t.desc }}>{ws.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
