'use client';

// Presentational worksheets gallery — a card per worksheet. Shared by the
// standalone /worksheets route (opens each via router.push) and the Scope
// sidebar's inline "Worksheets" hub (opens each as an inline page). The caller
// owns what "open" means via onOpen.

import { ArrowRight } from 'lucide-react';
import { WORKSHEETS, type WorksheetMeta } from '@/components/worksheet-shell';
import { NEU } from '@/components/neumorphic-sidebar';

export function WorksheetsGallery({ subtitle, onOpen }: {
  subtitle?: string;
  onOpen: (ws: WorksheetMeta) => void;
}) {
  return (
    <div style={{ background: NEU.bg, minHeight: '100%', padding: '32px 36px' }}>
      <style>{`.ws-card:hover { transform: translateY(-2px); box-shadow: ${NEU.shadowOut}; }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 22, fontWeight: 750, color: NEU.text, letterSpacing: '-0.02em' }}>Worksheets</div>
        {subtitle && (
          <div style={{ margin: '6px 0 26px', fontSize: 13, color: NEU.muted }}>{subtitle}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {WORKSHEETS.map((ws) => (
            <button
              key={ws.href}
              onClick={() => onOpen(ws)}
              className="ws-card"
              style={{
                textAlign: 'left', border: 'none', cursor: 'pointer',
                background: NEU.surface, borderRadius: 16, padding: 18,
                boxShadow: NEU.shadowSm, display: 'flex', flexDirection: 'column', gap: 11,
                transition: 'transform 160ms ease, box-shadow 160ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: NEU.bg, boxShadow: NEU.shadowSm, display: 'grid', placeItems: 'center', color: NEU.accent }}>
                  <ws.Icon size={19} />
                </span>
                <ArrowRight size={16} style={{ color: NEU.faint }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: NEU.text, letterSpacing: '-0.01em' }}>{ws.label}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: NEU.muted }}>{ws.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
