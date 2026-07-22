'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AgentRoster — a compact avatar row of the persona agents, shown in the composer's
// options strip so you can see who's available and click one to TALK TO them: the
// agent greets in the thread and the composer is addressed to them, so you can type
// instructions before sending (the run, if any, comes from their reply). Live agents
// are solid; not-yet-live (Rémy) is dimmed. Also @-mentionable (composerCommands).
// ─────────────────────────────────────────────────────────────────────────────

import { AGENTS } from '@/lib/agents';
import { coworkerForAgent } from '@/lib/coworkers';
import { CoworkerAvatar } from './coworker-avatar';
import { LC } from '@/lib/librechat-theme';

export function AgentRoster({ onAssign }: { onAssign: (agentId: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
      <span style={{ fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.faint, marginRight: 2, flexShrink: 0 }}>
        Agents
      </span>
      {AGENTS.map((a) => (
        <button
          key={a.id}
          onClick={() => { if (a.live) onAssign(a.id); }}
          disabled={!a.live}
          title={a.live ? `${a.name} · ${a.role} — click to talk to them (or @${a.name} in the composer)` : `${a.name} · ${a.role} — coming soon`}
          className={a.live ? 'hover:brightness-110' : undefined}
          style={{ display: 'inline-flex', padding: 0, border: 'none', background: 'none', cursor: a.live ? 'pointer' : 'default', borderRadius: '50%', transition: 'transform 120ms ease' }}
        >
          <CoworkerAvatar coworker={coworkerForAgent(a)} size={24} dim={!a.live} />
        </button>
      ))}
    </div>
  );
}
