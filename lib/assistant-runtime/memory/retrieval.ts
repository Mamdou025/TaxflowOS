// ─────────────────────────────────────────────────────────────────────────────
// Memory retrieval policy — PURE, offline-testable.
//
// Given all of a user's memories and the current scope, pick the ones relevant to
// this turn. The key safety rule (principle: no cross-client bleed): when the active
// client is UNKNOWN, only global (client-less) memories are surfaced — a memory tied
// to a specific client is never shown for a different client.
// ─────────────────────────────────────────────────────────────────────────────

import type { MemoryView } from './types';

export type MemoryScope = {
  /** Active client id/name, if known. Null/undefined → only global memories surface. */
  clientId?: string | null;
  /** Active fiscal year, if known. */
  fiscalYear?: number | null;
  /** Optional current message text, used only to lightly boost keyword-overlapping memories. */
  query?: string;
};

function toMillis(v: string | number | Date): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'number') return v;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
}

function keywordOverlap(query: string, m: MemoryView): number {
  const q = query.toLowerCase();
  const hay = `${m.subject ?? ''} ${m.content}`.toLowerCase();
  let score = 0;
  for (const tok of q.split(/[^a-z0-9]+/).filter((t) => t.length >= 4)) {
    if (hay.includes(tok)) score += 1;
  }
  return score;
}

/**
 * Select the memories relevant to the current scope, most-relevant first.
 *
 * - A memory with `clientId === null` is global → always eligible.
 * - A memory with a `clientId` is eligible ONLY when it equals the active client.
 *   If the active client is unknown, client-specific memories are excluded entirely.
 * - A memory with a `fiscalYear` is excluded only when the active year is known and differs.
 * - Ranking: client-specific matches first, then query overlap, then recency.
 */
export function selectRelevantMemories<T extends MemoryView>(
  rows: readonly T[],
  scope: MemoryScope,
  limit = 20
): T[] {
  const activeClient = scope.clientId ?? null;
  const activeYear = scope.fiscalYear ?? null;

  const eligible = rows.filter((m) => {
    const clientOk = m.clientId === null || (activeClient !== null && m.clientId === activeClient);
    if (!clientOk) return false;
    const yearOk = m.fiscalYear === null || activeYear === null || m.fiscalYear === activeYear;
    return yearOk;
  });

  const scored = eligible.map((m) => ({
    m,
    clientMatch: m.clientId !== null && m.clientId === activeClient ? 1 : 0,
    overlap: scope.query ? keywordOverlap(scope.query, m) : 0,
    recency: toMillis(m.createdAt),
  }));

  scored.sort(
    (a, b) => b.clientMatch - a.clientMatch || b.overlap - a.overlap || b.recency - a.recency
  );

  return scored.slice(0, limit).map((s) => s.m);
}
