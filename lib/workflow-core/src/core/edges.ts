import type {
  WorkflowBlock,
  WorkflowEdge,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type {
  WorkflowEdgeHistoryEntry,
  WorkflowRelationshipType,
  EdgeStatus,
  EdgeBindingStatus,
} from '@workspace/workflow-contracts/domain/edge-types';
const SYSTEM_USER = 'workflow-studio';
export function createWorkflowEdgeRecord({
  bindingLabel,
  bindingStatus = 'valid',
  confidence = 1,
  createdAt = new Date().toISOString(),
  createdBy = SYSTEM_USER,
  id,
  history,
  notes = '',
  reason,
  relationshipType = 'provides_data_to',
  sourceOutputRole,
  sourceBlockId,
  status = 'active',
  targetInputRole,
  targetBlockId,
}: {
  id?: string;
  sourceBlockId: string;
  targetBlockId: string;
  relationshipType?: WorkflowRelationshipType;
  reason: string;
  sourceOutputRole?: string;
  targetInputRole?: string;
  bindingLabel?: string;
  bindingStatus?: EdgeBindingStatus;
  status?: EdgeStatus;
  createdBy?: string;
  createdAt?: string;
  confidence?: number;
  history?: WorkflowEdgeHistoryEntry[];
  notes?: string;
}): WorkflowEdge {
  const edgeId = id || `edge-${sourceBlockId}-${targetBlockId}`;
  return {
    id: edgeId,
    sourceBlockId,
    targetBlockId,
    relationshipType,
    reason,
    ...(sourceOutputRole ? { sourceOutputRole } : {}),
    ...(targetInputRole ? { targetInputRole } : {}),
    ...(bindingLabel ? { bindingLabel } : {}),
    bindingStatus,
    status,
    createdBy,
    createdAt,
    confidence,
    notes,
    history:
      history && history.length > 0
        ? history
        : [
            {
              id: `${edgeId}-created`,
              action: 'created',
              by: createdBy,
              at: createdAt,
              notes: reason,
            },
          ],
  };
}

export function updateWorkflowEdgeRecord(
  edge: WorkflowEdge,
  updates: Partial<
    Pick<
      WorkflowEdge,
      | 'bindingLabel'
      | 'bindingStatus'
      | 'confidence'
      | 'notes'
      | 'reason'
      | 'relationshipType'
      | 'sourceOutputRole'
      | 'status'
      | 'targetInputRole'
    >
  >,
  historyNote = 'Relationship metadata updated.',
): WorkflowEdge {
  const now = new Date().toISOString();
  const nextStatus = updates.status || edge.status;
  let historyAction: WorkflowEdgeHistoryEntry['action'] = 'updated';
  if (nextStatus === 'rejected') {
    historyAction = 'rejected';
  } else if (nextStatus === 'disabled') {
    historyAction = 'disabled';
  }

  return {
    ...edge,
    ...updates,
    history: [
      ...edge.history,
      {
        id: `${edge.id}-history-${Date.now()}`,
        action: historyAction,
        by: SYSTEM_USER,
        at: now,
        notes: historyNote,
      },
    ],
  };
}

export function createSplitWorkflowEdgeRecords({
  insertedBlock,
  originalEdge,
}: {
  insertedBlock: WorkflowBlock;
  originalEdge: WorkflowEdge;
}): [WorkflowEdge, WorkflowEdge] {
  const now = new Date().toISOString();
  const splitHistory: WorkflowEdgeHistoryEntry = {
    id: `${originalEdge.id}-split-${Date.now()}`,
    action: 'split',
    by: SYSTEM_USER,
    at: now,
    notes: `Split by inserting ${insertedBlock.label}. Original relationship: ${originalEdge.reason}`,
  };
  const sourceToInserted = createWorkflowEdgeRecord({
    id: `${originalEdge.id}-to-${insertedBlock.id}`,
    sourceBlockId: originalEdge.sourceBlockId,
    targetBlockId: insertedBlock.id,
    relationshipType: originalEdge.relationshipType,
    reason: originalEdge.reason,
    sourceOutputRole: originalEdge.sourceOutputRole,
    bindingLabel: originalEdge.bindingLabel,
    bindingStatus: originalEdge.bindingStatus,
    status: originalEdge.status,
    confidence: originalEdge.confidence,
    notes: originalEdge.notes,
    createdAt: now,
    history: [...originalEdge.history, splitHistory],
  });
  const insertedToTarget = createWorkflowEdgeRecord({
    id: `${insertedBlock.id}-to-${originalEdge.targetBlockId}`,
    sourceBlockId: insertedBlock.id,
    targetBlockId: originalEdge.targetBlockId,
    relationshipType: 'transforms_into',
    reason: `${insertedBlock.label} continues the split relationship into the original target.`,
    targetInputRole: originalEdge.targetInputRole,
    bindingLabel: originalEdge.bindingLabel,
    bindingStatus: originalEdge.bindingStatus,
    status: originalEdge.status,
    confidence: originalEdge.confidence,
    notes: originalEdge.notes,
    createdAt: now,
    history: [...originalEdge.history, splitHistory],
  });

  return [sourceToInserted, insertedToTarget];
}
