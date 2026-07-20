// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Action Gateway (contract only)
//
// EVERY assistant, agent, and page mutation flows through one choke point:
//   validate → authorize → (approval?) → execute → persist → audit.
// Today there is none — `useCopilotAction` handlers mutate jotai atoms directly.
// The generalization of `commandPage` into `dispatch` is migration Step 4; this file
// freezes only the request/result contract (kernel-migration-spec §4).
//
// NB: distinct from `lib/ai-gateway/*`, which is LLM billing/credits — NOT this.
// ─────────────────────────────────────────────────────────────────────────────

import type { Actor, Scope } from './scope';

/** A proposed mutation awaiting the gateway. */
export type ActionRequest = {
  id: string;
  /** Stable capability id, e.g. "workflow.addBlock". */
  action: string;
  args: unknown;
  actor: Actor;
  scope: Scope;
};

export type ActionResult = {
  ok: boolean;
  value?: unknown;
  error?: string;
  /** True when the action is governed and opened a Checkpoint instead of executing. */
  requiresApproval?: boolean;
  /** The checkpoint opened when `requiresApproval` is true. */
  checkpointId?: string;
  /** The AuditEvent recorded for this dispatch (always present — nothing is silent). */
  auditEventId: string;
};

/**
 * The gateway's single entry point. An implementation:
 *   1. validates `args` against the action's schema,
 *   2. authorizes the `actor` for `action` in `scope` (agent allow-list / user role),
 *   3. if governed → opens a Checkpoint and returns `requiresApproval`,
 *   4. executes (jotai setter now, server endpoint later),
 *   5. persists + appends an AuditEvent.
 * An agent can never approve its own proposal.
 */
export type Dispatch = (request: ActionRequest) => Promise<ActionResult>;
