// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Workflow, Run, Node & Checkpoint
//
// ONE workflow-definition and ONE run model, replacing the three parallel run types
// today (System A `RunState`, System B `LocalWorkflowExecution`, System C
// `WorkflowExecution`). Adapters over the existing runtimes come in migration Step 3;
// this file only freezes the target vocabulary (kernel-migration-spec §2.2 + §3).
//
// The WorkflowDefinition itself is NOT redefined — the domain type in
// `src/domain/workflow` is the canonical basis and is re-exported here unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import type { Scope } from './scope';
import type { EvidenceReference, SourceTraceRef } from './evidence';
import type { ApprovalState } from './audit';

// ── The definition (re-exported from the domain — canonical basis, unchanged) ────
export type {
  WorkflowDefinition,
  WorkflowBlock,
  WorkflowEdge,
  WorkflowVersionSnapshot,
} from '@/shared/workflow-engine/domain/workflow/workflow-types';

// ── Canonical node model (freeze this first — §2.2) ──────────────────────────────
// Public palette keeps friendly family names; INTERNALLY there are five node kinds.
// Mapping from the current `BlockFamily`/`visualRole`/`ToolGroup` taxonomies happens
// in the Step-3 adapters — this is the target these derive to.
export type NodeKind =
  | 'source' // immutable evidence in (was: Trigger + Source families)
  | 'task' // the only executable node; binds one Executor
  | 'review-gate' // human checkpoint (was: Review / Validation family)
  | 'governed-value' // non-executable protected value (was: "Protected" family)
  | 'output'; // durable artifact / handoff out

/** The four ways a `task` node executes. */
export type ExecutorKind =
  | 'deterministic-tool' // ToolDefinition, backend/runtime
  | 'calculation-engine' // lines/summary calculation
  | 'integration-action' // lib/google/*, lib/steps/*
  | 'agent-task'; // a bounded agent call (input/output schema, allowed tools, approval)

export type Executor = {
  kind: ExecutorKind;
  /** Stable capability id the gateway authorizes against (see ./capability). */
  capabilityId: string;
  config?: Record<string, unknown>;
};

// ── Versions ─────────────────────────────────────────────────────────────────────
export type WorkflowVersion = {
  id: string;
  workflowId: string;
  versionNumber: number;
  label: string;
  status: 'draft' | 'published';
  createdBy: string;
  createdAt: string;
  /** Immutable snapshot of the definition at publish time. */
  snapshotId: string;
};

// ── Runs ─────────────────────────────────────────────────────────────────────────
export type RunStatus =
  | 'pending'
  | 'running'
  | 'blocked'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export type NodeRunStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'warning'
  | 'error'
  | 'skipped';

/** Per-node result within a run — unifies ToolRunResult (B) / ExecutionResult (C) /
 *  BlockRun (domain) / RunDetail.lines (A). */
export type NodeRun = {
  nodeId: string;
  kind: NodeKind;
  status: NodeRunStatus;
  output?: unknown;
  /** For calculation nodes: the human-readable formula that produced `output`. */
  formula?: string;
  trace?: SourceTraceRef[];
  evidence?: EvidenceReference[];
  startedAt?: string;
  endedAt?: string;
  error?: { message: string };
};

export type CheckpointKind = 'upload' | 'choice' | 'approval';
export type CheckpointState = 'open' | 'resolved' | 'rejected';

/** A human-in-the-loop gate. Promotes today's UI-only `RunBlocker` to a kernel entity
 *  that ENFORCES `approvalState` — a governed mutation cannot be silently applied, and
 *  an agent cannot approve its own work. */
export type Checkpoint = {
  id: string;
  kind: CheckpointKind;
  nodeId?: string;
  state: CheckpointState;
  /** Who resolved it (never the same actor that proposed it, for governed gates). */
  resolvedBy?: string;
  approvalState?: ApprovalState;
  /** Free-form prompt shown to the human (e.g. "6 accounts need confirmation"). */
  prompt?: string;
};

/** One execution instance of a workflow. */
export type WorkflowRun = {
  id: string;
  workflowId: string;
  /** null = unpublished / draft run. */
  versionId: string | null;
  scope: Scope;
  status: RunStatus;
  nodeRuns: Record<string, NodeRun>;
  checkpoints: Checkpoint[];
  evidence: EvidenceReference[];
  /** Artifact ids produced by this run (see ./artifact). */
  artifacts: string[];
  /** AuditEvent ids appended over the run's life (see ./audit). */
  events: string[];
  startedAt: string;
  endedAt?: string;
};

export type RunInput = {
  scope: Scope;
  /** Seed values keyed by node/input id (uploaded rows, elected amounts, edited rates). */
  inputs?: Record<string, unknown>;
};

/**
 * One runner interface, two implementations (kept from the two existing execution
 * styles): `LocalRunner` wraps System B (sync, browser, deterministic tools) and
 * `ServerRunner` wraps System C (async, Postgres, plugin steps). Implementations land
 * in Step 3; this is only the contract.
 */
export interface Runner {
  run(definitionId: string, input: RunInput): Promise<WorkflowRun>;
}
