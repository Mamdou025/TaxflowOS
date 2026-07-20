'use client';

// ─────────────────────────────────────────────────────────────────────────────
// CoworkerAvatar — the one avatar chip for a coworker, shared by the live-activity
// indicator, the agent roster, the @-mention palette, and per-message attribution.
// Initials on the coworker's accent; round for agents/humans, rounded-square for the
// machine actors (Workflow Engine / UI Concierge / UI Composer). Optional working pulse.
// ─────────────────────────────────────────────────────────────────────────────

import type { Coworker } from '@/lib/coworkers';

export function CoworkerAvatar({
  coworker,
  size = 26,
  pulse = false,
  dim = false,
}: {
  coworker: Coworker;
  size?: number;
  pulse?: boolean;
  dim?: boolean;
}) {
  const round = coworker.kind === 'agent' || coworker.kind === 'human';
  const radius = round ? '50%' : Math.round(size * 0.28);
  return (
    <span style={{ position: 'relative', flexShrink: 0, display: 'inline-flex', opacity: dim ? 0.45 : 1 }}>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: coworker.accent,
          border: '1px solid rgba(255,255,255,0.16)',
          color: '#fff',
          fontSize: coworker.initials.length > 2 ? Math.round(size * 0.34) : Math.round(size * 0.42),
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '0.02em',
        }}
      >
        {coworker.initials}
      </span>
      {pulse ? (
        <span className="cwp-run-halo" style={{ position: 'absolute', inset: -2, borderRadius: round ? '50%' : Math.round(size * 0.36) }} />
      ) : null}
    </span>
  );
}
