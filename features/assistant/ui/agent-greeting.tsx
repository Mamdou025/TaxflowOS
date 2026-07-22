'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AgentGreeting — the opener shown when you click an agent (e.g. Sofi) BEFORE you
// type anything. Clicking an agent no longer starts their workflow; it addresses
// them: this greeting drops into the top of the thread (as the conversation's
// first turn) and the composer below is addressed to them, so you can type
// instructions and send when ready. Styled like an assistant message row so it
// reads as the agent speaking, with a soft entrance.
// ─────────────────────────────────────────────────────────────────────────────

import type { Agent } from '@/lib/agents';
import { agentGreeting } from '@/lib/agents';
import { coworkerForAgent } from '@/lib/coworkers';
import { LC } from '@/lib/librechat-theme';
import { CoworkerAvatar } from './coworker-avatar';

export function AgentGreeting({ agent }: { agent: Agent }) {
  return (
    <div className="lc-row" data-agent-greeting style={{ marginBottom: 6 }}>
      <style>{`
        @keyframes ag-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        [data-agent-greeting] { animation: ag-in 360ms cubic-bezier(0.23,1,0.32,1) both; }
        @media (prefers-reduced-motion: reduce) { [data-agent-greeting] { animation: none; } }
      `}</style>
      <div className="lc-avatar"><CoworkerAvatar coworker={coworkerForAgent(agent)} size={26} /></div>
      <div style={{ minWidth: 0, flex: 1, paddingTop: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13.5, fontWeight: 650, color: LC.title }}>{agent.name}</span>
          <span style={{ fontSize: 11.5, color: LC.muted }}>{agent.role}</span>
        </div>
        <div style={{ fontSize: 14.5, color: LC.body, lineHeight: 1.6, maxWidth: 620 }}>{agentGreeting(agent)}</div>
      </div>
    </div>
  );
}
