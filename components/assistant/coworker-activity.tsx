'use client';

// ─────────────────────────────────────────────────────────────────────────────
// CoworkerActivity — the live "who's working" presence indicator in the chat.
//
// Reads `activeCoworkerAtom` (set by the run flow / assistant) and renders the
// named coworker currently working: avatar + name·role + an honest actor tag
// (Agent / Workflow · Deterministic / Tool / …) + their status + a working pulse.
// Self-hides when nobody is active. Clicking jumps to the running workflow.
// ─────────────────────────────────────────────────────────────────────────────

import { useAtomValue } from 'jotai';
import { activeCoworkerAtom, activeRunAtom } from '@/lib/workspace-store';
import { coworkerKindLabel } from '@/lib/coworkers';
import { LC } from '@/lib/librechat-theme';

export function CoworkerActivity({ onJump }: { onJump?: () => void }) {
  const active = useAtomValue(activeCoworkerAtom);
  const run = useAtomValue(activeRunAtom);

  if (!active) return null;
  const { coworker, status } = active;

  const isAgent = coworker.kind === 'agent';
  const stepDetail =
    run && run.phase !== 'done'
      ? `Step ${Math.min(run.stepIndex + 1, run.totalSteps)}/${run.totalSteps}`
      : null;
  const jumpable = Boolean(onJump && run && run.phase !== 'done');

  return (
    <div className="shrink-0" style={{ padding: '10px 14px 0' }}>
      <button
        onClick={jumpable ? onJump : undefined}
        className={jumpable ? 'hover:brightness-110' : undefined}
        title={jumpable ? 'Jump to the running workflow' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          textAlign: 'left',
          padding: '8px 12px',
          background: LC.surface,
          border: `1px solid ${LC.border}`,
          borderRadius: 12,
          cursor: jumpable ? 'pointer' : 'default',
        }}
      >
        {/* Avatar + working pulse */}
        <span style={{ position: 'relative', flexShrink: 0, display: 'inline-flex' }}>
          <span
            style={{
              width: 30,
              height: 30,
              // round for agents/humans, rounded-square for the machine actors
              borderRadius: isAgent || coworker.kind === 'human' ? '50%' : 8,
              background: coworker.accent,
              border: '1px solid rgba(255,255,255,0.16)',
              color: '#fff',
              fontSize: coworker.initials.length > 2 ? 9 : 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.02em',
            }}
          >
            {coworker.initials}
          </span>
          <span
            className="cwp-run-halo"
            style={{
              position: 'absolute',
              inset: -2,
              borderRadius: isAgent || coworker.kind === 'human' ? '50%' : 10,
            }}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 650,
                color: LC.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {coworker.name}
              {coworker.role && !coworker.role.startsWith('Deterministic') ? (
                <span style={{ color: LC.muted, fontWeight: 500 }}> · {coworker.role}</span>
              ) : null}
            </span>
            <span
              style={{
                flexShrink: 0,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: LC.accent,
                background: 'rgba(167,139,250,0.12)',
                border: `1px solid ${LC.borderSubtle}`,
                borderRadius: 5,
                padding: '1px 5px',
              }}
            >
              {coworkerKindLabel(coworker)}
            </span>
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 11,
              color: LC.muted,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {status}
            {stepDetail ? ` · ${stepDetail}` : ''}
          </span>
        </span>

        {jumpable ? (
          <span style={{ fontSize: 10.5, fontWeight: 600, color: LC.muted, flexShrink: 0 }}>Jump ↓</span>
        ) : null}
      </button>
    </div>
  );
}
