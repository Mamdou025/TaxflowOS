'use client';

// AgentBuilder — placeholder page for the coming "build your own agent" surface.
// Opens inline in the Scope right panel like any other page; wired now, designed
// later. Lists the existing specialists (Sofi, Théo) + a disabled "New agent".

import { Bot, Plus, MoreHorizontal } from 'lucide-react';
import { AGENTS } from '@/lib/agents';
import { usePageMenu } from '@/lib/page-menu-store';
import { NEU } from '@/components/neumorphic-sidebar';

export function AgentBuilder() {
  // Demo consumer of the page-menu contract: publishes this page's actions into
  // the shared panel header (see lib/page-menu-store.ts + PageMenuBar).
  usePageMenu('agent-builder', {
    right: [
      { kind: 'button', id: 'new', label: 'New agent', icon: <Plus size={14} />, onClick: () => {}, disabled: true, title: 'Coming soon' },
      { kind: 'dropdown', id: 'more', icon: <MoreHorizontal size={16} />, title: 'More', items: [
        { id: 'about', label: 'About agents', onClick: () => {} },
        { id: 'refresh', label: 'Refresh list', onClick: () => {} },
      ] },
    ],
  }, []);

  return (
    <div className="h-full overflow-auto" style={{ background: 'transparent' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 28px 48px', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--sx-accent-soft)', color: 'var(--sx-accent)' }}><Bot size={18} /></span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: NEU.text, letterSpacing: '-0.02em' }}>Agent Builder</h1>
        </div>
        <p style={{ margin: '0 0 24px', fontSize: 13.5, color: NEU.muted }}>
          Compose specialists that run your fiscal workflows and pause for your judgment. Scaffolding is wired; the editor is coming.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AGENTS.map((a) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 14, background: NEU.surface, border: 'none', boxShadow: NEU.shadowSm }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: a.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 650 }}>{a.initials}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 650, color: NEU.text }}>{a.name}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: a.live ? '#2E7D32' : NEU.faint, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{a.live ? 'Live' : 'Soon'}</span>
                </div>
                <div style={{ fontSize: 12, color: NEU.muted, marginTop: 2 }}>{a.role}</div>
                <div style={{ fontSize: 12, color: NEU.faint, marginTop: 6, lineHeight: 1.45 }}>{a.tagline}</div>
              </div>
            </div>
          ))}

          <button
            disabled
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 16px', borderRadius: 14, background: 'transparent', border: '1px dashed rgba(158,158,178,0.5)', color: NEU.muted, fontSize: 13, fontWeight: 600, cursor: 'not-allowed' }}
          >
            <Plus size={15} /> New agent — coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
