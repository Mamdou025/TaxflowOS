import { createWorkflowEdgeRecord } from '@workspace/workflow-core/edges';
export {
  createWorkflowEdgeRecord,
  updateWorkflowEdgeRecord,
  createSplitWorkflowEdgeRecords,
} from '@workspace/workflow-core/edges';
import { getAllowedRelationshipTypesForFamilies } from '@/shared/workflow-engine/domain/workflow/workflow-rules';
import type { WorkflowEdge as CanvasWorkflowEdge } from '@/shared/workflow-engine/state/workflow-store';
import {
  type PendingWorkflowConnection,
  type WorkflowRelationshipType,
  WORKFLOW_RELATIONSHIP_TYPES,
  type EdgeStatus,
  EDGE_STATUS_VALUES,
  type EdgeBindingStatus,
  EDGE_BINDING_STATUS_VALUES,
  type AiProposalStatus,
  AI_PROPOSAL_STATUS_VALUES,
  type BlockFamily,
  type WorkflowBlock,
  WORKFLOW_RELATIONSHIP_LABELS,
  SYSTEM_USER,
  type WorkflowEdgeHistoryEntry,
  type WorkflowEdge,
} from './contracts';

export function createPendingWorkflowConnection({
  sourceBlockId,
  sourceHandle,
  targetBlockId,
  targetHandle,
}: Omit<PendingWorkflowConnection, 'createdAt'>): PendingWorkflowConnection {
  return {
    sourceBlockId,
    targetBlockId,
    sourceHandle,
    targetHandle,
    createdAt: new Date().toISOString(),
  };
}

export function getPendingWorkflowConnection(value: unknown): PendingWorkflowConnection | null {
  if (!(typeof value === 'object' && value !== null)) {
    return null;
  }

  const pending = value as Partial<PendingWorkflowConnection>;
  if (
    typeof pending.sourceBlockId !== 'string' ||
    typeof pending.targetBlockId !== 'string' ||
    typeof pending.createdAt !== 'string'
  ) {
    return null;
  }

  return {
    sourceBlockId: pending.sourceBlockId,
    targetBlockId: pending.targetBlockId,
    sourceHandle: typeof pending.sourceHandle === 'string' ? pending.sourceHandle : null,
    targetHandle: typeof pending.targetHandle === 'string' ? pending.targetHandle : null,
    createdAt: pending.createdAt,
  };
}

function isWorkflowRelationshipType(value: unknown): value is WorkflowRelationshipType {
  return (
    typeof value === 'string' &&
    WORKFLOW_RELATIONSHIP_TYPES.includes(value as WorkflowRelationshipType)
  );
}

export function getEdgeStatusFromValue(value: unknown): EdgeStatus {
  return EDGE_STATUS_VALUES.includes(value as EdgeStatus) ? (value as EdgeStatus) : 'active';
}

export function getEdgeBindingStatusFromValue(value: unknown): EdgeBindingStatus {
  return EDGE_BINDING_STATUS_VALUES.includes(value as EdgeBindingStatus)
    ? (value as EdgeBindingStatus)
    : 'missing';
}

export function getAiProposalStatusFromValue(value: unknown): AiProposalStatus {
  return AI_PROPOSAL_STATUS_VALUES.includes(value as AiProposalStatus)
    ? (value as AiProposalStatus)
    : 'proposed';
}

export function getAllowedWorkflowRelationshipTypes(
  sourceFamily: BlockFamily,
  targetFamily: BlockFamily,
): WorkflowRelationshipType[] {
  return getAllowedRelationshipTypesForFamilies(sourceFamily, targetFamily);
}

function getDefaultLogicRelationshipType(
  targetBlock: WorkflowBlock,
): WorkflowRelationshipType | null {
  if (targetBlock.family === 'Logic') {
    if (targetBlock.subtype === 'Aggregation' || targetBlock.subtype === 'Hierarchy Aggregator') {
      return 'aggregates_into';
    }
    if (targetBlock.subtype === 'Condition') {
      return 'branches_to';
    }
    return 'transforms_into';
  }

  if (targetBlock.family === 'Field') {
    return 'provides_data_to';
  }

  return targetBlock.family === 'Output' ? 'feeds_output_input' : null;
}

export function getDefaultWorkflowRelationshipType({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock: WorkflowBlock;
  targetBlock: WorkflowBlock;
}): WorkflowRelationshipType | null {
  if (sourceBlock.family === 'AI / Agent') {
    return 'proposes';
  }

  if (targetBlock.family === 'AI / Agent') {
    return sourceBlock.family === 'Logic' ? 'feeds_ai_context' : 'provides_context_to_ai';
  }

  if (sourceBlock.family === 'Logic') {
    return (
      getDefaultLogicRelationshipType(targetBlock) ||
      getAllowedWorkflowRelationshipTypes(sourceBlock.family, targetBlock.family)[0] ||
      null
    );
  }

  return getAllowedWorkflowRelationshipTypes(sourceBlock.family, targetBlock.family)[0] || null;
}

export function getWorkflowRelationshipForValue({
  sourceBlock,
  targetBlock,
  value,
}: {
  sourceBlock?: WorkflowBlock;
  targetBlock?: WorkflowBlock;
  value: unknown;
}): WorkflowRelationshipType {
  if (isWorkflowRelationshipType(value)) {
    return value;
  }

  const defaultType =
    sourceBlock && targetBlock
      ? getDefaultWorkflowRelationshipType({ sourceBlock, targetBlock })
      : null;

  if (defaultType) {
    return defaultType;
  }

  switch (value) {
    case 'feeds':
      return 'provides_data_to';
    case 'supports':
      return 'referenced_by';
    case 'validates':
      return 'checked_by';
    case 'routes':
      return 'branches_to';
    case 'protects':
      return 'approves_for';
    case 'summarizes':
      return 'depends_on';
    case 'feeds_output':
    case 'output_preview':
      return 'feeds_output_input';
    case 'ai_context':
      return 'feeds_ai_context';
    case 'exports':
      return 'maps_to_output';
    case 'proposes':
      return 'proposes';
    default:
      return 'provides_data_to';
  }
}

type WorkflowEdgeDefaults = {
  reason: string;
  relationshipType: WorkflowRelationshipType;
  sourceOutputRole?: string;
  targetInputRole?: string;
  bindingLabel?: string;
  bindingStatus?: EdgeBindingStatus;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Binding defaults mirror the compact v1 workflow rulebook.
function getDefaultBindingRoles({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock: WorkflowBlock;
  targetBlock: WorkflowBlock;
}): Pick<
  WorkflowEdgeDefaults,
  'bindingLabel' | 'bindingStatus' | 'sourceOutputRole' | 'targetInputRole'
> {
  if (
    targetBlock.config.toolId === 'logic.keyword_mapper' ||
    targetBlock.subtype === 'Classification / Mapping'
  ) {
    if (sourceBlock.config.sourceKind === 'keyword_rules') {
      return {
        bindingLabel: 'Keyword rules',
        bindingStatus: 'valid',
        sourceOutputRole: 'keyword_rules',
        targetInputRole: 'keyword_rules',
      };
    }

    return {
      bindingLabel: 'Data rows',
      bindingStatus: 'valid',
      sourceOutputRole: sourceBlock.family === 'Logic' ? 'mapped_rows' : 'selected_rows',
      targetInputRole: 'data_rows',
    };
  }

  if (targetBlock.subtype === 'Aggregation') {
    return {
      bindingLabel: 'Mapped rows',
      bindingStatus: 'valid',
      sourceOutputRole: 'mapped_rows',
      targetInputRole: 'mapped_rows',
    };
  }

  if (
    targetBlock.subtype === 'Hierarchy Aggregator' ||
    targetBlock.config.toolId === 'logic.hierarchy_aggregator'
  ) {
    if (sourceBlock.config.sourceKind === 'aggregation_rules') {
      return {
        bindingLabel: 'Aggregation rules',
        bindingStatus: 'valid',
        sourceOutputRole: 'aggregation_rules',
        targetInputRole: 'aggregation_rules',
      };
    }

    return {
      bindingLabel: 'Mapped rows',
      bindingStatus: 'valid',
      sourceOutputRole: 'mapped_rows',
      targetInputRole: 'mapped_rows',
    };
  }

  if (
    targetBlock.subtype === 'Category Rollup Aggregator' ||
    targetBlock.config.toolId === 'logic.category_rollup_aggregator'
  ) {
    if (sourceBlock.config.sourceKind === 'rollup_rules') {
      return {
        bindingLabel: 'Rollup rules',
        bindingStatus: 'valid',
        sourceOutputRole: 'rollup_rules',
        targetInputRole: 'rollup_rules',
      };
    }

    return {
      bindingLabel: 'Mapped rows',
      bindingStatus: 'valid',
      sourceOutputRole: 'mapped_rows',
      targetInputRole: 'mapped_rows',
    };
  }

  if (
    targetBlock.subtype === 'Calculation Engine' ||
    targetBlock.config.toolId === 'logic.calculation_engine'
  ) {
    if (sourceBlock.config.sourceKind === 'calculation_rules') {
      return {
        bindingLabel: 'Calculation rules',
        bindingStatus: 'valid',
        sourceOutputRole: 'calculation_rules',
        targetInputRole: 'calculation_rules',
      };
    }

    if (
      sourceBlock.config.toolId === 'source.http_json' ||
      sourceBlock.config.sourceKind === 'http_json'
    ) {
      return {
        bindingLabel: 'API values',
        bindingStatus: 'valid',
        sourceOutputRole: 'raw_rows',
        targetInputRole: 'named_values',
      };
    }
    if (sourceBlock.config.toolId === 'source.manual_table') {
      return {
        bindingLabel: 'Table values',
        bindingStatus: 'valid',
        sourceOutputRole: 'rows',
        targetInputRole: 'named_values',
      };
    }
    if (sourceBlock.family === 'Field') {
      return {
        bindingLabel: 'Field values',
        bindingStatus: 'valid',
        sourceOutputRole: 'computed_values',
        targetInputRole: 'named_values',
      };
    }

    return {
      bindingLabel: 'Named values',
      bindingStatus: 'valid',
      sourceOutputRole: 'named_values',
      targetInputRole: 'named_values',
    };
  }

  if (targetBlock.subtype === 'Unmatched Rows Check') {
    return {
      bindingLabel: 'Unmatched rows',
      bindingStatus: 'valid',
      sourceOutputRole: 'unmatched_rows',
      targetInputRole: 'checked_items',
    };
  }

  if (targetBlock.subtype === 'Low Confidence Warning') {
    return {
      bindingLabel: 'Low-confidence rows',
      bindingStatus: 'valid',
      sourceOutputRole: 'low_confidence_rows',
      targetInputRole: 'checked_items',
    };
  }

  if (targetBlock.family === 'Field') {
    let sourceOutputRole = 'named_values';
    if (sourceBlock.subtype === 'Calculation Engine') {
      sourceOutputRole = 'calculated_results';
    } else if (sourceBlock.subtype === 'Hierarchy Aggregator') {
      sourceOutputRole = 'final_totals';
    } else if (sourceBlock.subtype === 'Category Rollup Aggregator') {
      sourceOutputRole = 'rollup_totals';
    }

    return {
      bindingLabel: 'Computed values',
      bindingStatus: 'valid',
      sourceOutputRole,
      targetInputRole: 'computed_values',
    };
  }

  if (targetBlock.family === 'Output') {
    let sourceOutputRole = 'mapped_rows';
    if (sourceBlock.family === 'Field') {
      sourceOutputRole = 'computed_values';
    } else if (sourceBlock.subtype === 'Hierarchy Aggregator') {
      sourceOutputRole = 'aggregation_summary';
    }

    return {
      bindingLabel: 'Field values',
      bindingStatus: 'valid',
      sourceOutputRole,
      targetInputRole: 'field_values',
    };
  }

  if (targetBlock.family === 'Review / Validation') {
    return {
      bindingLabel: 'Checked items',
      bindingStatus: 'warning',
      targetInputRole: 'checked_items',
    };
  }

  return { bindingStatus: 'missing' };
}

export function getWorkflowEdgeDefaults({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock: WorkflowBlock;
  targetBlock: WorkflowBlock;
}): WorkflowEdgeDefaults | null {
  const relationshipType = getDefaultWorkflowRelationshipType({
    sourceBlock,
    targetBlock,
  });

  if (!relationshipType) {
    return null;
  }

  return {
    ...getDefaultBindingRoles({ sourceBlock, targetBlock }),
    relationshipType,
    reason: `${sourceBlock.label} ${WORKFLOW_RELATIONSHIP_LABELS[
      relationshipType
    ].toLowerCase()} ${targetBlock.label}.`,
  };
}

export function getUnsupportedWorkflowRelationshipMessage({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock?: WorkflowBlock;
  targetBlock?: WorkflowBlock;
}): string {
  if (!(sourceBlock && targetBlock)) {
    return 'Both blocks need typed workflow metadata before a relationship can be created.';
  }

  if (sourceBlock.family === 'Source' && targetBlock.family !== 'Logic') {
    return 'Source evidence is immutable. Create downstream Logic to correct, reinterpret, or map it before connecting it to this block.';
  }

  if (targetBlock.family === 'Source') {
    return 'Source blocks are immutable evidence. Preserve lineage with Source to Logic relationships instead of writing relationships back into a Source.';
  }

  return `${sourceBlock.family} blocks cannot directly connect to ${targetBlock.family} blocks in the typed workflow model. Add a compatible downstream block first.`;
}

export function createCanvasEdgeFromWorkflowEdge(edge: WorkflowEdge): CanvasWorkflowEdge {
  return {
    id: edge.id,
    source: edge.sourceBlockId,
    target: edge.targetBlockId,
    type: 'animated',
    data: {
      workflowEdge: edge,
      relationshipType: edge.relationshipType,
      status: edge.status,
      confidence: edge.confidence,
      sourceOutputRole: edge.sourceOutputRole,
      targetInputRole: edge.targetInputRole,
      bindingLabel: edge.bindingLabel,
      bindingStatus: edge.bindingStatus,
      label: WORKFLOW_RELATIONSHIP_LABELS[edge.relationshipType],
    },
  };
}
