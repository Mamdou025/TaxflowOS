// ─────────────────────────────────────────────────────────────────────────────
// Copilot trace — "what does the AI actually see?"
//
// When COPILOT_TRACE is set (e.g. `COPILOT_TRACE=1 pnpm dev`), every request that
// reaches the CopilotKit runtime dumps the EXACT input handed to the model — the
// full message thread, which carries the system instructions, the useCopilotReadable
// context (the grounding: field values, live workflow snapshots, active run, open
// pages), and the tool calls/results — to a timestamped file under `.copilot-trace/`,
// plus a one-line console summary. This is the ground-truth answer to "where did the
// AI get that value?": open the newest file and read what was in context that turn.
//
// Off by default and a no-op unless the env var is set — zero overhead in normal runs.
// ─────────────────────────────────────────────────────────────────────────────

import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/** JSON.stringify that survives circular refs + functions (agent inputs have both). */
function safeStringify(value: unknown, space = 2): string {
  const seen = new WeakSet<object>();
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === 'function') return '[Function]';
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    },
    space,
  );
}

type TraceableInput = { messages?: unknown[] } & Record<string, unknown>;

/** Dump the model input for one runtime request. No-op unless COPILOT_TRACE is set. */
export function traceCopilotInput(input: unknown): void {
  if (!process.env.COPILOT_TRACE) return;
  try {
    const dir = join(process.cwd(), '.copilot-trace');
    mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = join(dir, `${stamp}.json`);

    const typed = (input ?? {}) as TraceableInput;
    const messages = Array.isArray(typed.messages) ? typed.messages : [];
    const payload = {
      capturedAt: new Date().toISOString(),
      inputKeys: input && typeof input === 'object' ? Object.keys(input as object) : [],
      messageCount: messages.length,
      input,
    };
    appendFileSync(file, safeStringify(payload));

    const roles = messages
      .map((m) => {
        const rec = m as Record<string, unknown> | null;
        return String(rec?.role ?? rec?.type ?? '?');
      })
      .join(', ');
    // eslint-disable-next-line no-console
    console.log(`[copilot-trace] captured ${messages.length} messages (${roles}) → ${file}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[copilot-trace] failed to write trace', err);
  }
}
