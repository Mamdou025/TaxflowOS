// ─────────────────────────────────────────────────────────────────────────────
// Server-side orphaned-tool-call repair for the CopilotKit runtime.
//
// Why: with an explicit default BuiltInAgent, CopilotKit converts the WHOLE persisted
// thread and hands it to the Vercel AI SDK (ai@6, the copy @copilotkit/runtime pulls),
// whose `convertToLanguageModelPrompt` walks the messages and THROWS
// MissingToolResultsError ("Tool result is missing for tool call …") at any user/system
// message — or the end of the thread — while an assistant tool-call id has no matching
// tool result. Such an orphan is created whenever the stream that emitted a tool call
// is aborted before the client handler emits its result (Stop, route navigation,
// unmount/hot-reload) — very common right AFTER a workflow run, where the user navigates
// away to inspect results while the run is still mounted. One orphan then poisons EVERY
// later message.
//
// This mirrors the AI SDK's own pairing walk but, instead of throwing, INJECTS a
// synthetic tool result for each still-pending call right before the boundary — so the
// thread the server sends is always valid, deterministically, for orphans from ANY
// source. It runs as a runtime middleware (app/api/copilotkit/route.ts) on every run,
// replacing the former client-side heal (removed), which failed because agent.setMessages()
// deep-clones via structuredClone and throws DataCloneError on the render closure that a
// workflow's assistant message always carries.
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal structural shape of an AG-UI chat message (only the pairing fields matter). */
export type RepairableMessage = {
  id?: unknown;
  role?: unknown;
  toolCalls?: ReadonlyArray<{ id?: unknown } | null | undefined>;
  toolCallId?: unknown;
};

/** The synthetic tool result injected for a tool call that was never completed. */
export function syntheticToolResult(toolCallId: string): {
  id: string;
  role: 'tool';
  toolCallId: string;
  content: string;
} {
  return {
    id: `synthetic-tool-${toolCallId}`,
    role: 'tool',
    toolCallId,
    content: JSON.stringify({
      status: 'unavailable',
      note: 'This tool call was not completed (the run was aborted or the user navigated away). See the run panel in the chat.',
    }),
  };
}

/**
 * Return a thread in which every assistant tool-call is answered by a tool result
 * before the next user/system boundary (and before end-of-thread), injecting a synthetic
 * result for any that is missing. Positional (not a global answered-set), so a real
 * result that appears out of order after a later boundary cannot mask an earlier
 * unpaired boundary — matching exactly what the AI SDK validates. Reference-stable:
 * returns the SAME array when nothing needed repair.
 */
export function repairOrphanToolCalls<T extends RepairableMessage>(
  messages: readonly T[] | null | undefined
): T[] {
  const src = messages ?? [];
  const out: T[] = [];
  const pending = new Set<string>();
  let changed = false;

  const flushBoundary = () => {
    if (pending.size === 0) return;
    for (const id of pending) {
      out.push(syntheticToolResult(id) as unknown as T);
    }
    pending.clear();
    changed = true;
  };

  for (const m of src) {
    const role = m?.role;
    // The AI SDK checks its pending-tool-call set at each user/system message and at
    // end-of-array — close out any unanswered calls right before this boundary.
    // ('developer' maps to a system message downstream when forwardDeveloperMessages
    // is enabled, so treat it as a boundary too.)
    if (role === 'user' || role === 'system' || role === 'developer') {
      flushBoundary();
      out.push(m);
      continue;
    }
    out.push(m);
    if (role === 'assistant' && Array.isArray(m.toolCalls)) {
      for (const tc of m.toolCalls) {
        const id = tc?.id;
        if (typeof id === 'string' && id) pending.add(id);
      }
    } else if (role === 'tool') {
      const id = m.toolCallId;
      if (typeof id === 'string') pending.delete(id);
    }
  }
  flushBoundary();

  return changed ? out : (src as T[]);
}
