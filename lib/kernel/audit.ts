// ─────────────────────────────────────────────────────────────────────────────
// Kernel · AuditEvent (the event trail, typed)
//
// Replaces narration with typed, durable, linkable events. Today's
// `workspaceTrailAtom`/`pushTrail` (in-memory) and `WorkflowExecutionLog` (Postgres)
// become a VIEW and the persistence backing over this stream, respectively
// (kernel-migration-spec §8). Every event carries a scope + an attributed actor + the
// ids of the records it touched, so the chat's trail can render real audit cards.
// ─────────────────────────────────────────────────────────────────────────────

import type { Actor, Scope } from './scope';

/** Governance approval state — shared with Checkpoint (./workflow) and AgentDefinition. */
export type ApprovalState = 'draft' | 'review-required' | 'approved';

export type AuditEventType =
  | 'source.uploaded'
  | 'extraction.completed'
  | 'mapping.proposed'
  | 'mapping.accepted'
  | 'run.started'
  | 'run.resumed'
  | 'calculation.executed'
  | 'checkpoint.opened'
  | 'checkpoint.resolved'
  | 'agent.invoked'
  | 'action.dispatched'
  | 'artifact.created';

/** The ids an event links back to — the audit trail is navigable, not a transcript. */
export type AuditLinks = {
  sourceId?: string;
  runId?: string;
  nodeId?: string;
  checkpointId?: string;
  artifactId?: string;
  agentRunId?: string;
  actionRequestId?: string;
};

/** A factual, typed record of something that happened. */
export type AuditEvent = {
  id: string;
  at: string;
  scope: Scope;
  type: AuditEventType;
  actor: Actor;
  links: AuditLinks;
  summary: string;
};
