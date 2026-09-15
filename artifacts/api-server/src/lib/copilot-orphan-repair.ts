// ─────────────────────────────────────────────────────────────────────────────
// Server-side orphaned-tool-call repair for the CopilotKit runtime (api-server).
//
// Why this exists (the "can't send a follow-up after the AI replied" bug):
// CopilotKit's React client persists the WHOLE thread and replays it on every turn.
// When a run is aborted after the assistant emitted a tool call but before its result
// was sent back (Stop, route navigation, unmount/hot-reload, or a frontend
// useCopilotAction whose handler never resolved), the persisted thread keeps the tool
// call with NO matching result. On the next turn the runtime hands that thread to the
// AI SDK's convertToLanguageModelPrompt, which THROWS
//   MissingToolResultsError: "Tool result is missing for tool call <id>."
// (surfaced to the client as a RUN_ERROR event). One orphan then poisons EVERY later
// message — exactly the symptom the user hit.
//
// This is the SAME shape and logic as the web app's lib/copilot-orphan-repair.ts and
// mirrors what the Next.js route (app/api/copilotkit/route.ts) does. The LIVE runtime
// in the 3-service dev stack is THIS Express api-server (Vite proxies /api/copilotkit
// here) — so the repair has to run here, wired as a BuiltInAgent middleware in
// routes/copilotkit.ts. It operates on the AG-UI message shape the BuiltInAgent hands
// to the AI SDK (role + toolCalls[] + toolCallId), NOT the GraphQL wire shape — that is
// why an HTTP-body/GraphQL repair never fires. Keep this in sync with the web app copy.
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
  role: "tool";
  toolCallId: string;
  content: string;
} {
  return {
    id: `synthetic-tool-${toolCallId}`,
    role: "tool",
    toolCallId,
    content: JSON.stringify({
      status: "unavailable",
      note: "This tool call was not completed (the run was aborted or the user navigated away). See the run panel in the chat.",
    }),
  };
}

/**
 * Return a thread in which every assistant tool-call is answered by a tool result
 * before the next user/system boundary (and before end-of-thread), injecting a
 * synthetic result for any that is missing. Positional (not a global answered-set), so
 * a real result that appears out of order after a later boundary cannot mask an earlier
 * unpaired boundary — matching exactly what the AI SDK validates. Reference-stable:
 * returns the SAME array when nothing needed repair, so callers can cheaply detect a
 * no-op.
 */
export function repairOrphanToolCalls<T extends RepairableMessage>(
  messages: readonly T[] | null | undefined,
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
    // ('developer' maps to a system message downstream, so treat it as a boundary too.)
    if (role === "user" || role === "system" || role === "developer") {
      flushBoundary();
      out.push(m);
      continue;
    }
    out.push(m);
    if (role === "assistant" && Array.isArray(m.toolCalls)) {
      for (const tc of m.toolCalls) {
        const id = tc?.id;
        if (typeof id === "string" && id) pending.add(id);
      }
    } else if (role === "tool") {
      const id = m.toolCallId;
      if (typeof id === "string") pending.delete(id);
    }
  }
  flushBoundary();

  return changed ? out : (src as T[]);
}
