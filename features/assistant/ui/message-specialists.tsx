'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Per-message specialist attribution — the avatar on each PAST assistant message.
//
// A plain assistant reply carries no tool call, so `coworkerForMessage` can only
// call it the generic Workspace Assistant. But we know which domain it was: the
// PRECEDING user turn. This builds a { assistantMessageId → specialist coworker }
// map by walking the thread and classifying each user turn with the same pure
// intent classifier, and shares it via context so `AsideAssistantMessage` can show
// e.g. Sofi's avatar on a past FAPI answer.
//
// Pure + cheap (regex classification over a handful of turns); memoized on message
// id/role so it does not recompute while a reply streams. Never affects the model.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext } from 'react';
import { classifyDeterministic } from '@/features/assistant/runtime/routing/classify';
import { applyRoutePolicy } from '@/features/assistant/runtime/routing/route-policy';
import { selectSpecialist } from '@/features/assistant/runtime/agents/specialists';
import { getAgent } from '@/lib/agents';
import { coworkerForAgent, type Coworker } from '@/lib/coworkers';

/** message id → the specialist coworker that owns that assistant turn's domain. */
export const MessageSpecialistContext = createContext<Record<string, Coworker>>({});

type MinimalMessage = { id?: string; role?: string; content?: unknown };

/**
 * Build the { assistantMessageId → specialist coworker } map for a thread. An
 * assistant message inherits the specialist of the most recent preceding user turn
 * (when that turn resolves to a workflow domain); non-domain turns get no entry.
 */
export function buildMessageSpecialistMap(messages: readonly MinimalMessage[]): Record<string, Coworker> {
  const map: Record<string, Coworker> = {};
  let lastUserText: string | null = null;
  for (const m of messages) {
    if (m?.role === 'user') {
      lastUserText = typeof m.content === 'string' ? m.content : null;
    } else if (m?.role === 'assistant' && m.id && lastUserText) {
      const specialist = selectSpecialist(applyRoutePolicy(classifyDeterministic({ text: lastUserText })));
      if (specialist) {
        const agent = getAgent(specialist.id);
        if (agent) map[m.id] = coworkerForAgent(agent);
      }
    }
  }
  return map;
}

/** A stable signature so the map only recomputes when the message SET changes. */
export function messageSignature(messages: readonly MinimalMessage[]): string {
  return messages.map((m) => `${m.id ?? ''}:${m.role ?? ''}`).join('|');
}
