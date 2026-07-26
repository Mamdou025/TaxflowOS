

// ─────────────────────────────────────────────────────────────────────────────
// Per-message assistant attribution.
//
// RETIRED (2026-07-24): there used to be four specialist personas (Sofi/Théo/Mira/
// Nova), so a past plain reply was attributed to the domain specialist of its
// preceding user turn. There is now ONE unified agent — Sina — so every plain reply
// is simply Sina, which `coworkerForMessage` returns directly. This map is therefore
// always empty; the context + exports are kept so `AsideAssistantMessage` /
// `ThreadMessages` keep working (empty map → they fall back to `coworkerForMessage`).
// ─────────────────────────────────────────────────────────────────────────────

import { createContext } from 'react';
import type { Coworker } from '@/lib/coworkers';

/** message id → coworker override. Always empty now (one Sina; see file header). */
export const MessageSpecialistContext = createContext<Record<string, Coworker>>({});

type MinimalMessage = { id?: string; role?: string; content?: unknown };

/** No per-message overrides anymore — `coworkerForMessage` attributes every reply to Sina. */
export function buildMessageSpecialistMap(_messages: readonly MinimalMessage[]): Record<string, Coworker> {
  return {};
}

/** A stable signature so the map only recomputes when the message SET changes. */
export function messageSignature(messages: readonly MinimalMessage[]): string {
  return messages.map((m) => `${m.id ?? ''}:${m.role ?? ''}`).join('|');
}
