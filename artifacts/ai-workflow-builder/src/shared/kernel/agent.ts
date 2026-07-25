// ─────────────────────────────────────────────────────────────────────────────
// Kernel · AgentDefinition & AgentRun
//
// Replaces the display-only `Agent` shell (lib/agents.ts) with a versioned definition
// carrying tools/workflows/permissions/memory/output-contract, and models one agent
// invocation as an `AgentRun` whose steps route through the Action Gateway
// (kernel-migration-spec §5). One assistant runtime drives MANY agent definitions —
// no separate "brains".
//
// ★ The `ToolInvocation` type below is the typed home for the "I still cannot ask
//   follow-up questions after a workflow" bug. Root cause (audit): with no explicit
//   `agents`, CopilotRuntime's BuiltInAgent throws MissingToolResultsError the moment
//   it walks the thread and finds an assistant tool-call whose result is missing — so
//   one orphaned call from a run poisons every later message. The INVARIANT this type
//   encodes: an AgentRun MUST NOT advance to the next user turn while any ToolInvocation
//   is still `pending`. The structural fix is passing explicit `agents` to the runtime
//   (Step 6), which retires the client-side fillOrphans band-aid (since removed).
// ─────────────────────────────────────────────────────────────────────────────

import type { Actor } from './scope';
import type { ApprovalState } from './audit';
import type { JsonSchema } from './capability';

export type AgentStatus = 'draft' | 'published';

export type MemoryScope = 'none' | 'run' | 'client' | 'global';

/** A single evaluation case for an agent (regression/behaviour test). */
export type AgentEvalCase = {
  id: string;
  input: string;
  expect: string;
};

/** A versioned specialist definition. */
export type AgentDefinition = {
  id: string;
  version: number;
  status: AgentStatus;
  purpose: string; // was: role
  instructions: string; // was: tagline (expanded)
  scopeOfKnowledge: string[];
  /** Capability ids the gateway enforces. */
  allowedTools: string[];
  /** Published workflow ids this agent may run (was: single `workflow?`). */
  allowedWorkflows: string[];
  permissions: { read: string[]; write: string[] };
  memory: { scope: MemoryScope; retention: string };
  /** Capability ids whose invocation needs human sign-off. */
  approvalRequired: string[];
  /** Structured-output contract, if any. */
  outputContract?: JsonSchema;
  tests: AgentEvalCase[];
  /** Cosmetics kept from the old Agent shell (name/accent/initials). */
  display: { name: string; accent: string; initials: string };
};

// ── One agent invocation ─────────────────────────────────────────────────────────

export type ToolInvocationStatus = 'pending' | 'succeeded' | 'failed';

/**
 * One tool call made during an agent run. ★ INVARIANT (see file header): every
 * ToolInvocation with status `pending` must be resolved (`result` set, status moved
 * off `pending`) before the run yields the turn back to the user — otherwise the next
 * message is rejected with "tool result is missing".
 */
export type ToolInvocation = {
  id: string;
  /** The provider-level tool-call id that a following tool-result message must pair with. */
  toolCallId: string;
  capabilityId: string;
  args: unknown;
  status: ToolInvocationStatus;
  result?: unknown;
  error?: string;
};

export type AgentRunStatus =
  | 'pending'
  | 'running'
  | 'awaiting-approval'
  | 'succeeded'
  | 'failed';

export type AgentRunStep = {
  id: string;
  /** Natural-language description of what the agent did/decided at this step. */
  summary: string;
  /** Tool calls issued at this step — each must be resolved before the next user turn. */
  invocations: ToolInvocation[];
};

/**
 * One invocation of an agent. An agent step's result is a PROPOSAL until validated /
 * accepted — the gateway (and human checkpoints) decide whether it takes effect.
 */
export type AgentRun = {
  id: string;
  agentId: string;
  agentVersion: number;
  actor: Actor;
  status: AgentRunStatus;
  steps: AgentRunStep[];
  /** Set when the run proposes a governed mutation awaiting sign-off. */
  approvalState?: ApprovalState;
  startedAt: string;
  endedAt?: string;
};

/** True when a run has no unresolved tool calls — safe to yield the turn to the user.
 *  Enforces the invariant that prevents the "can't follow up after a workflow" error. */
export function agentRunHasNoOrphanInvocations(run: AgentRun): boolean {
  return run.steps.every((step) =>
    step.invocations.every((inv) => inv.status !== 'pending')
  );
}
