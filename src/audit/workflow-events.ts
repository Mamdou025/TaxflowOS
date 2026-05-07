import type { WorkflowEdge, WorkflowNode } from "@/lib/workflow-store";

export const WORKFLOW_AUDIT_EVENT_TYPES = [
  "ai_proposal_approved",
  "ai_proposal_created",
  "ai_proposal_rejected",
  "block_created",
  "block_deleted",
  "block_duplicated",
  "block_updated",
  "edge_created",
  "edge_deleted",
  "edge_split",
  "edge_updated",
  "protected_block_unlocked",
  "protected_block_updated",
  "source_derived_logic_created",
  "workflow_exported",
  "workflow_imported",
  "workflow_published",
] as const;

export type WorkflowAuditEventType =
  (typeof WORKFLOW_AUDIT_EVENT_TYPES)[number];

export type WorkflowAuditTargetType =
  | "ai_proposal"
  | "block"
  | "edge"
  | "protected_block"
  | "source"
  | "workflow";

export type WorkflowAuditSummary = Record<string, unknown>;

export type WorkflowAuditEvent = {
  id: string;
  type: WorkflowAuditEventType;
  workflowId: string;
  actor?: string;
  timestamp: string;
  targetObjectId?: string;
  targetObjectType?: WorkflowAuditTargetType;
  before?: WorkflowAuditSummary;
  after?: WorkflowAuditSummary;
  reason?: string;
  sourceId?: string;
  proposalId?: string;
  metadata?: Record<string, unknown>;
};

export type CreateWorkflowAuditEventInput = Omit<
  WorkflowAuditEvent,
  "id" | "timestamp"
> & {
  id?: string;
  timestamp?: string;
};

function createAuditEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `audit-${crypto.randomUUID()}`;
  }

  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createWorkflowAuditEvent({
  id,
  timestamp,
  ...input
}: CreateWorkflowAuditEventInput): WorkflowAuditEvent {
  return {
    ...input,
    id: id || createAuditEventId(),
    timestamp: timestamp || new Date().toISOString(),
  };
}

export function summarizeBlockForAudit(
  node: Pick<WorkflowNode, "data" | "id" | "position"> | null | undefined
): WorkflowAuditSummary | undefined {
  if (!node) {
    return;
  }

  const block = node.data.block;
  const config = node.data.config || block?.config || {};

  return {
    configKeys: Object.keys(config).sort(),
    family: block?.family,
    id: node.id,
    immutableSource: block?.source?.immutable || undefined,
    label: node.data.label,
    protected: block?.family === "Protected" || undefined,
    status: block?.status,
    subtype: block?.subtype,
    x: Math.round(node.position.x),
    y: Math.round(node.position.y),
  };
}

export function summarizeEdgeForAudit(
  edge:
    | Pick<WorkflowEdge, "data" | "id" | "source" | "target">
    | null
    | undefined
): WorkflowAuditSummary | undefined {
  if (!edge) {
    return;
  }

  const workflowEdge = edge.data?.workflowEdge;

  return {
    bindingLabel: edge.data?.bindingLabel || workflowEdge?.bindingLabel,
    bindingStatus: edge.data?.bindingStatus || workflowEdge?.bindingStatus,
    id: edge.id,
    relationshipType:
      edge.data?.relationshipType || workflowEdge?.relationshipType,
    source: edge.source,
    sourceOutputRole:
      edge.data?.sourceOutputRole || workflowEdge?.sourceOutputRole,
    status: edge.data?.status || workflowEdge?.status,
    target: edge.target,
    targetInputRole:
      edge.data?.targetInputRole || workflowEdge?.targetInputRole,
  };
}

export function summarizeWorkflowForAudit({
  edgeCount,
  name,
  nodeCount,
  status,
}: {
  edgeCount: number;
  name?: string;
  nodeCount: number;
  status?: string;
}): WorkflowAuditSummary {
  return {
    edgeCount,
    name,
    nodeCount,
    status,
  };
}
