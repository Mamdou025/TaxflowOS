'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AssistantPanel — the ambient, follow-you-everywhere assistant. A docked card
// on the right edge that overlays whatever page you're on (chat-as-layer). The
// ActionOrb toggles it via assistantOpenAtom.
//
// It reuses the SAME useAssistant() brain + AssistantThread as the full-screen
// focus mode (ChatWorkspace on "/"). To keep only ONE registration of the
// CopilotKit tools, this panel renders null on "/" — focus mode owns the
// assistant there. On every other route the panel stays MOUNTED even while
// closed (it just slides off-screen), so the tools stay registered, the page
// context keeps flowing to the model, and reopening is instant.
// ─────────────────────────────────────────────────────────────────────────────

import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { X, Maximize2, Sparkles } from 'lucide-react';
import { assistantOpenAtom } from '@/lib/chat-store';
import { useAssistant } from './use-assistant';
import { AssistantThread } from './assistant-thread';
import { LC } from '@/lib/librechat-theme';

const PANEL_W = 420;

export function AssistantPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useAtom(assistantOpenAtom);

  // Focus mode owns the assistant on "/", so don't double-mount there (it would
  // register the CopilotKit tools twice). Hooks must run unconditionally, so the
  // early return happens before useAssistant is called — this component simply
  // isn't rendered by the shell logic on "/", but guard anyway for safety.
  if (pathname === '/') return null;

  return <AssistantPanelInner open={open} onClose={() => setOpen(false)} onExpand={() => router.push('/')} panelW={PANEL_W} />;
}

function AssistantPanelInner({ open, onClose, onExpand, panelW }: { open: boolean; onClose: () => void; onExpand: () => void; panelW: number }) {
  // Registers tools + context on every page the panel lives on (even closed).
  const a = useAssistant();

  return (
    <div
      className="fixed"
      style={{
        top: 64, bottom: 16, right: 16, width: `min(${panelW}px, 94vw)`,
        zIndex: 45,
        transform: open ? 'translateX(0)' : `translateX(calc(100% + 24px))`,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'transform 320ms cubic-bezier(0.23,1,0.32,1), opacity 240ms ease',
        display: 'flex', flexDirection: 'column',
        background: LC.bg,
        borderRadius: 16,
        border: `1px solid ${LC.border}`,
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        overflow: 'hidden',
      }}
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2" style={{ height: 46, padding: '0 8px 0 14px', borderBottom: `1px solid ${LC.borderSubtle}` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #a78bfa, #6B21A8 70%)', color: '#fff', flexShrink: 0 }}>
          <Sparkles size={12} />
        </span>
        <span style={{ fontSize: 13, fontWeight: 650, color: LC.text }}>Scope</span>
        <div style={{ flex: 1 }} />
        <button onClick={onExpand} title="Open full-screen focus mode" className="hover:bg-white/10" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 9, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}>
          <Maximize2 size={15} />
        </button>
        <button onClick={onClose} title="Close" className="hover:bg-white/10" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 9, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}>
          <X size={16} />
        </button>
      </div>

      {/* Body — the shared thread */}
      <div className="flex-1 min-h-0">
        <AssistantThread assistant={a} variant="docked" />
      </div>
    </div>
  );
}
