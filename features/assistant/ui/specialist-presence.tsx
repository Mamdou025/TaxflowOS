'use client';

// ─────────────────────────────────────────────────────────────────────────────
// SpecialistPresence — shows WHICH specialist is answering (the "face" of the
// many-hats brain). Headless; mounted once in app-shell.
//
// It reuses the SAME pure intent classifier on the client to read the latest user
// turn, and while a reply is streaming it sets the live coworker indicator to that
// domain's specialist (Sofi for FAPI, Théo for a rollover, …). Purely COSMETIC: it
// only writes the presence atom the CoworkerActivity chip reads — it never touches
// the message thread or the model, so a mis-read simply shows no hat (never breaks
// the chat). It yields entirely to a live workflow run, which owns the indicator.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCopilotChat } from '@copilotkit/react-core';
import { activeCoworkerAtom, activeRunAtom, setActiveCoworkerAtom } from '@/shared/stores/workspace-store';
import { classifyDeterministic } from '@/features/assistant/runtime/routing/classify';
import { applyRoutePolicy } from '@/features/assistant/runtime/routing/route-policy';
import { selectSpecialist, SPECIALISTS } from '@/features/assistant/runtime/agents/specialists';
import { getAgent } from '@/lib/agents';
import { coworkerForAgent } from '@/lib/coworkers';

const SPECIALIST_IDS = new Set(SPECIALISTS.map((s) => s.id));

function lastUserText(messages: unknown): string | null {
  if (!Array.isArray(messages)) return null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i] as { role?: unknown; content?: unknown } | null | undefined;
    if (m?.role === 'user') {
      const c = m.content;
      if (typeof c === 'string' && c.trim()) return c;
      return null; // found the latest user turn but no plain text → give up (benign)
    }
  }
  return null;
}

export function SpecialistPresence() {
  const { visibleMessages, isLoading } = useCopilotChat();
  const run = useAtomValue(activeRunAtom);
  const active = useAtomValue(activeCoworkerAtom);
  const setCoworker = useSetAtom(setActiveCoworkerAtom);

  useEffect(() => {
    // A live run owns the presence indicator — never fight it.
    if (run && run.phase !== 'done') return;

    // Only ever touch a specialist hat WE set — never clear the engine/other actors.
    const mine = active && SPECIALIST_IDS.has(active.coworker.id) ? active.coworker.id : null;

    if (isLoading) {
      const text = lastUserText(visibleMessages);
      const specialist = text ? selectSpecialist(applyRoutePolicy(classifyDeterministic({ text }))) : null;
      const want = specialist?.id ?? null;
      if (want === mine) return; // already showing the right hat → avoid a set loop
      if (specialist) {
        const agent = getAgent(specialist.id);
        setCoworker(agent ? { coworker: coworkerForAgent(agent), status: 'Reviewing your question…' } : null);
      } else if (mine) {
        setCoworker(null); // this turn is general → drop the previous hat
      }
    } else if (mine) {
      setCoworker(null); // reply finished → clear our hat
    }
  }, [isLoading, visibleMessages, run, active, setCoworker]);

  return null;
}
