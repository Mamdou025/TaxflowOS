'use client';

// ─────────────────────────────────────────────────────────────────────────────
// WorkMenu — the persistent "Work" menu in the thread header.
//
// Reads the durable Work registry (lib/work-store) and lists every workflow run,
// worksheet, source review, and generated view the assistant has produced — each
// with its type, title, status, responsible coworker, and latest update. Two actions
// per item: "Open" (reopen its current state) and "Jump" (scroll back to where it
// first appeared in the conversation). The thread becomes an audit trail + workspace.
// Dark grayscale language (LC.* tokens); restrained status colors.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, type CSSProperties } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { LayoutGrid, Workflow, FileSpreadsheet, FileSearch, Sparkles, File as FileIcon, ExternalLink, CornerUpLeft } from 'lucide-react';
import {
  workItemsListAtom,
  activeWorkCountAtom,
  clearWorkItemsAtom,
  reconcileStaleWorkAtom,
  jumpToWork,
  type WorkItem,
  type WorkItemType,
  type WorkItemStatus,
} from '@/lib/work-store';
import { LC } from '@/lib/librechat-theme';

const TYPE_ICON: Record<WorkItemType, typeof Workflow> = {
  'workflow-run': Workflow,
  worksheet: FileSpreadsheet,
  'source-review': FileSearch,
  'generated-view': Sparkles,
  page: FileIcon,
};
const TYPE_LABEL: Record<WorkItemType, string> = {
  'workflow-run': 'Workflow',
  worksheet: 'Worksheet',
  'source-review': 'Source',
  'generated-view': 'View',
  page: 'Page',
};
const STATUS: Record<WorkItemStatus, { label: string; color: string }> = {
  running: { label: 'Running', color: LC.accent },
  awaiting: { label: 'Needs you', color: '#dab06c' },
  done: { label: 'Done', color: '#6b9b7a' },
  open: { label: 'Open', color: LC.muted },
};

// Run the stale-status reconcile exactly once per app session (the first WorkMenu mount
// = app load), so re-mounting the menu mid-run can't wipe a live run's status.
let didReconcileStaleWork = false;

export function WorkMenu({ onOpen }: { onOpen: (item: WorkItem) => void }) {
  const items = useAtomValue(workItemsListAtom);
  const activeCount = useAtomValue(activeWorkCountAtom);
  const clear = useSetAtom(clearWorkItemsAtom);
  const reconcile = useSetAtom(reconcileStaleWorkAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (didReconcileStaleWork) return;
    didReconcileStaleWork = true;
    reconcile();
  }, [reconcile]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        data-testid="work-menu"
        onClick={() => setOpen((o) => !o)}
        className="hover:bg-black/5"
        title="Work — everything the assistant has done"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, height: 28, padding: '0 10px',
          borderRadius: 8, border: `1px solid ${open ? LC.border : LC.borderSubtle}`,
          background: open ? LC.surface : 'transparent', color: LC.body, cursor: 'pointer',
          fontSize: 12.5, fontWeight: 550,
        }}
      >
        <LayoutGrid size={14} style={{ color: LC.muted }} />
        Work
        {items.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, color: LC.muted }}>{items.length}</span>
        )}
        {activeCount > 0 && (
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: LC.accent }} />
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            data-testid="work-menu-panel"
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 41, width: 360, maxHeight: 440,
              overflowY: 'auto', background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 14,
              boxShadow: LC.shadowOut,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 6px' }}>
              <span style={{ fontSize: 11, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.muted }}>
                Work {items.length > 0 && <span style={{ color: LC.faint }}>· {items.length}</span>}
              </span>
              {items.length > 0 && (
                <button onClick={() => clear()} className="hover:brightness-125" style={{ fontSize: 11, color: LC.faint, background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              )}
            </div>

            {items.length === 0 ? (
              <div style={{ padding: '18px 14px 22px', fontSize: 12.5, color: LC.muted, lineHeight: 1.5 }}>
                Nothing yet. Runs, worksheets, source reviews, and generated views will collect here as the assistant works.
              </div>
            ) : (
              <div style={{ padding: '0 6px 6px' }}>
                {items.map((item) => (
                  <WorkRow key={item.id} item={item} onOpen={() => { setOpen(false); onOpen(item); }} onJump={() => { setOpen(false); if (!jumpToWork(item.id)) onOpen(item); }} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WorkRow({ item, onOpen, onJump }: { item: WorkItem; onOpen: () => void; onJump: () => void }) {
  const Icon = TYPE_ICON[item.type];
  const status = STATUS[item.status];
  const by = item.by;
  return (
    <div
      className="lc-workrow"
      data-testid="work-row"
      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 10px', borderRadius: 10 }}
    >
      {/* responsible coworker avatar (or type icon fallback) */}
      {by ? (
        <span
          style={{
            width: 26, height: 26, flexShrink: 0, borderRadius: by.kind === 'agent' || by.kind === 'human' ? '50%' : 7,
            background: by.accent, border: '1px solid rgba(255,255,255,0.16)', color: '#fff',
            fontSize: by.initials.length > 2 ? 8.5 : 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title={`${by.name}${by.role ? ` · ${by.role}` : ''}`}
        >
          {by.initials}
        </span>
      ) : (
        <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: 7, background: LC.surfaceHover, color: LC.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={13} />
        </span>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={12} style={{ color: LC.faint, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 550, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
          <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: LC.faint }}>{TYPE_LABEL[item.type]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 550, color: status.color }}>{status.label}</span>
          {item.detail && (
            <span style={{ fontSize: 11, color: LC.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {item.detail}</span>
          )}
        </div>
      </div>

      <div className="lc-workrow-actions" style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <button onClick={onJump} className="hover:bg-black/5" title="Jump to where it appeared" style={rowBtn}><CornerUpLeft size={14} /></button>
        <button onClick={onOpen} className="hover:bg-black/5" title="Open current state" style={rowBtn}><ExternalLink size={14} /></button>
      </div>
    </div>
  );
}

const rowBtn: CSSProperties = {
  display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: 7,
  border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer',
};

export function WorkMenuStyles() {
  return (
    <style>{`
      .lc-workrow:hover { background: ${LC.surfaceHover}; }
      /* Jump-to-origin highlight — also defined by the workspace, redeclared here so
         it works in the docked panel (where ChatWorkspace isn't mounted). */
      @keyframes cwp-anchor-flash { 0% { background: rgba(107,33,168,0.12);} 100% { background: transparent;} }
      .cwp-anchor-flash { animation: cwp-anchor-flash 1.7s ease-out; border-radius: 8px; }
    `}</style>
  );
}
