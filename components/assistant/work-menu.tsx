'use client';

// ─────────────────────────────────────────────────────────────────────────────
// WorkMenu — the "current work" switcher in the RIGHT zone of the thread header.
//
// It plays two roles that used to be split between the old "Work" dropdown and the
// separate CoworkerActivity strip (now consolidated here):
//  1. TRIGGER — shows the work you're on RIGHT NOW: the live workflow + the coworker
//     running it (avatar + name) + a status ("Running / Needs you / Done"). When idle
//     it falls back to the most recent work item, or a plain "Work" label when empty.
//  2. DROPDOWN — every workflow run, worksheet, source review, and generated view the
//     assistant has produced, in strict reverse-chronological order (current on top,
//     previous below). Click a row to SWITCH to that work (reopen its current state);
//     "Jump" scrolls back to where it first appeared. The current item is marked.
//
// Reads the durable Work registry (lib/work-store) + the live run/coworker atoms
// (lib/workspace-store). Light neumorphic language (LC.* tokens).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, type CSSProperties } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { LayoutGrid, Workflow, FileSpreadsheet, FileSearch, Sparkles, File as FileIcon, CornerUpLeft, ChevronDown } from 'lucide-react';
import {
  workItemsChronoAtom,
  clearWorkItemsAtom,
  reconcileStaleWorkAtom,
  jumpToWork,
  workIdFor,
  type WorkItem,
  type WorkItemType,
  type WorkItemStatus,
} from '@/lib/work-store';
import { activeCoworkerAtom, activeRunAtom } from '@/lib/workspace-store';
import { CoworkerAvatar } from './coworker-avatar';
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

// Trigger-only status styling (the header "current work" bar) — a running workflow
// reads as "Active"; each state gets a tinted pill so the state is legible at a glance.
const ST_TRIGGER: Record<WorkItemStatus, { label: string; color: string; tint: string }> = {
  running: { label: 'Active', color: LC.accent, tint: 'rgba(167,139,250,0.14)' },
  awaiting: { label: 'Needs you', color: '#c68a3e', tint: 'rgba(218,176,108,0.18)' },
  done: { label: 'Done', color: '#5f9173', tint: 'rgba(107,155,122,0.16)' },
  open: { label: 'Open', color: LC.muted, tint: LC.surfaceHover },
};

/** Compact "how long ago" for the switcher timeline. */
function relTime(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 45) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Run the stale-status reconcile exactly once per app session (the first WorkMenu mount
// = app load), so re-mounting the menu mid-run can't wipe a live run's status.
let didReconcileStaleWork = false;

export function WorkMenu({ onOpen, compact = false, bare = false, align = 'right' }: { onOpen: (item: WorkItem) => void; compact?: boolean; bare?: boolean; align?: 'left' | 'right' }) {
  const items = useAtomValue(workItemsChronoAtom);
  const active = useAtomValue(activeCoworkerAtom);
  const run = useAtomValue(activeRunAtom);
  const clear = useSetAtom(clearWorkItemsAtom);
  const reconcile = useSetAtom(reconcileStaleWorkAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (didReconcileStaleWork) return;
    didReconcileStaleWork = true;
    reconcile();
  }, [reconcile]);

  // The work you're on now: the live run's item if there is one, else the most recent.
  const currentId = run ? workIdFor('workflow-run', run.workflowId) : null;
  const current = (currentId ? items.find((i) => i.id === currentId) : undefined) ?? items[0] ?? null;
  const hasCurrent = !!current || !!run;

  // Is a run live (someone actively working / not finished)? Drives the avatar pulse.
  const live = !!active || (!!run && run.phase !== 'done');

  // What / who / state of the current work. Prefer the work item's explicit status
  // (done ? done : blocker ? awaiting : running) — the honest active-vs-needs-you signal.
  const workflowName = run?.workflowName ?? current?.title ?? null;
  const who = active?.coworker?.name ?? current?.by?.name ?? null;
  const triggerCoworker = active?.coworker ?? current?.by ?? null;
  const status: WorkItemStatus | null =
    current?.status ??
    (run ? (run.phase === 'done' ? 'done' : run.awaiting ? 'awaiting' : 'running') : null);
  const st = status ? ST_TRIGGER[status] : null;

  // The state DETAIL line — WHAT is needed (+ which step) while awaiting, the current
  // step while active, or the headline figure once done.
  let detail: string | null = null;
  if (run) {
    if (run.phase === 'done') {
      detail = run.headline
        ? `${run.headline.label} ${Math.round(run.headline.value).toLocaleString()} ${run.headline.currency}`
        : 'Complete';
    } else {
      const step = `Step ${Math.min(run.stepIndex + 1, run.totalSteps)}/${run.totalSteps}`;
      const needed =
        run.phase === 'upload' ? `Upload the ${run.documentLabel}`
        : run.phase === 'categorize' ? 'Categorize a row'
        : run.phase === 'elect' ? 'Elect an amount'
        : run.phase === 'approve' ? 'Approve the figures'
        : 'Your input';
      detail = status === 'awaiting' ? `${needed} · ${step}` : `${run.stepLabel || 'Working'} · ${step}`;
    }
  } else if (current) {
    detail = current.detail ?? relTime(current.updatedAt);
  }

  const avatarSize = compact ? 22 : 26;

  return (
    <div style={{ position: 'relative', minWidth: 0, maxWidth: '100%' }}>
      {!hasCurrent ? (
        // Empty — nothing worked on yet: a plain "Work" button.
        <button
          data-testid="work-menu"
          onClick={() => setOpen((o) => !o)}
          className="hover:bg-black/5"
          title="Work — everything the assistant has done"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, height: compact ? 32 : 38, padding: '0 12px',
            borderRadius: 999, border: `1px solid ${open ? LC.border : LC.borderSubtle}`,
            background: open ? LC.surface : 'transparent', color: LC.body, cursor: 'pointer', fontSize: 12.5, fontWeight: 550,
          }}
        >
          <LayoutGrid size={14} style={{ color: LC.muted }} />
          Work
          <ChevronDown size={13} style={{ color: LC.muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }} />
        </button>
      ) : (
        // The current-work bar — WHAT you're on + who + state, and a second line saying
        // what's needed / which step / the result. Wider; truncates to fit its zone.
        <button
          data-testid="work-menu"
          onClick={() => setOpen((o) => !o)}
          className={bare ? 'hover:bg-black/5' : 'hover:brightness-[0.99]'}
          title="Current work — click to switch between what you're working on"
          style={{
            display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, maxWidth: '100%',
            height: compact ? 36 : 48, padding: '0 10px 0 7px', borderRadius: bare ? 10 : 14,
            background: bare ? 'transparent' : LC.surface,
            border: `1px solid ${bare ? 'transparent' : LC.border}`,
            boxShadow: bare ? 'none' : LC.shadowSm,
            cursor: 'pointer', transition: 'box-shadow 160ms',
          }}
        >
          {triggerCoworker ? (
            <CoworkerAvatar coworker={triggerCoworker} size={avatarSize} pulse={live} />
          ) : (
            <span style={{ width: avatarSize, height: avatarSize, borderRadius: 8, background: LC.surfaceHover, color: LC.muted, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Workflow size={14} />
            </span>
          )}

          <span style={{ minWidth: 0, flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, lineHeight: 1.15 }}>
            {/* line 1 — workflow · coworker + state pill */}
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, maxWidth: '100%' }}>
              <span style={{ flex: '0 1 auto', minWidth: 0, fontSize: compact ? 12.5 : 13.5, fontWeight: 650, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {workflowName ?? 'Work'}
              </span>
              {who && !compact && (
                <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, color: LC.muted, whiteSpace: 'nowrap' }}>· {who}</span>
              )}
              {st && (
                <span style={{ flexShrink: 0, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: st.color, background: st.tint, borderRadius: 6, padding: '1px 6px' }}>{st.label}</span>
              )}
            </span>
            {/* line 2 — what's needed / step / result */}
            {detail && (
              <span
                style={{
                  minWidth: 0, maxWidth: '100%',
                  fontSize: compact ? 11 : 12, fontWeight: status === 'awaiting' ? 600 : 500,
                  color: status === 'awaiting' ? '#b07d38' : LC.muted,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {detail}
              </span>
            )}
          </span>

          {items.length > 1 && (
            <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: LC.faint }} title={`${items.length} work items`}>{items.length}</span>
          )}
          <ChevronDown size={15} style={{ color: LC.muted, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }} />
        </button>
      )}

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            data-testid="work-menu-panel"
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', ...(align === 'left' ? { left: 0 } : { right: 0 }), zIndex: 41, width: 360, maxHeight: 440,
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
                  <WorkRow
                    key={item.id}
                    item={item}
                    isCurrent={item.id === current?.id}
                    onOpen={() => { setOpen(false); onOpen(item); }}
                    onJump={() => { setOpen(false); if (!jumpToWork(item.id)) onOpen(item); }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WorkRow({ item, isCurrent, onOpen, onJump }: { item: WorkItem; isCurrent: boolean; onOpen: () => void; onJump: () => void }) {
  const Icon = TYPE_ICON[item.type];
  const status = STATUS[item.status];
  const by = item.by;
  return (
    <div
      className="lc-workrow"
      data-testid="work-row"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 10px', borderRadius: 10,
        background: isCurrent ? LC.surfaceHover : undefined,
        boxShadow: isCurrent ? `inset 2px 0 0 ${LC.accent}` : undefined,
      }}
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

      {/* content = click to SWITCH to this work (spans only, so it's valid inside <button>) */}
      <button
        onClick={onOpen}
        title={isCurrent ? 'This is your current work' : 'Switch to this work'}
        style={{ minWidth: 0, flex: 1, textAlign: 'left', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={12} style={{ color: LC.faint, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 550, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
          <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: LC.faint }}>{TYPE_LABEL[item.type]}</span>
          {isCurrent && (
            <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: LC.accent, background: 'rgba(167,139,250,0.12)', borderRadius: 5, padding: '1px 5px' }}>Current</span>
          )}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 550, color: status.color }}>{status.label}</span>
          {item.detail && (
            <span style={{ fontSize: 11, color: LC.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {item.detail}</span>
          )}
          <span style={{ fontSize: 11, color: LC.faint, flexShrink: 0 }}>· {relTime(item.updatedAt)}</span>
        </span>
      </button>

      <div className="lc-workrow-actions" style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <button onClick={onJump} className="hover:bg-black/5" title="Jump to where it appeared" style={rowBtn}><CornerUpLeft size={14} /></button>
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
