import type {
  WorkflowEdge as CanvasWorkflowEdge,
  WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';
import {
  type WorkflowBlock,
  type LocalRunRecord,
  BLOCK_FAMILY_STAGE,
  LOCAL_WORKFLOW_ID,
} from './contracts';
import { LOCAL_SAMPLE_DATASET } from './sample-data';
import { getFiscalStageLabel } from './visuals';

function getFiscalOutputForStage(
  stage: string | undefined,
  nodeLabel: string,
  block?: WorkflowBlock,
): Record<string, unknown> {
  if (block?.source) {
    return {
      block: block.label,
      family: block.family,
      subtype: block.subtype,
      immutable: block.source.immutable,
      treatedAsEvidence: block.source.treatedAsEvidence,
      locator: block.source.locator,
      valuesLocked: block.source.valuesLocked,
    };
  }

  if (block?.governance) {
    return {
      block: block.label,
      family: block.family,
      protectedKind: block.governance.protectedKind,
      lockedInRuntime: block.governance.lockedInRuntime,
      requiresUnlockToEdit: block.governance.requiresUnlockToEdit,
      outputKey: block.runtime.outputKey,
    };
  }

  switch (stage) {
    case 'source':
      return {
        dataset: LOCAL_SAMPLE_DATASET.entity,
        period: LOCAL_SAMPLE_DATASET.period,
        immutable: true,
        sourceDocuments: LOCAL_SAMPLE_DATASET.sourceDocuments,
        rowCount: LOCAL_SAMPLE_DATASET.rows.length,
      };
    case 'logic':
      return {
        derivedFields: ['jurisdictionClassification', 'provisionalTaxBase', 'protectedInputFlag'],
        provisionalTaxBase: LOCAL_SAMPLE_DATASET.rows.reduce(
          (total, row) => total + row.revenue - row.deductibleExpenses,
          0,
        ),
        method: 'local mock calculation',
      };
    case 'review':
    case 'validation':
      return {
        checksPassed: 5,
        checksWarned: 1,
        warnings: ['UK withholding reserve requires reviewer signoff'],
        trustworthy: true,
      };
    case 'output':
      return {
        artifacts: ['review_packet.json', 'taxprep_bridge.csv'],
        handoffReady: true,
        destination: 'download/export only',
      };
    case 'ai-agent':
      return {
        proposalOnly: true,
        directMutation: false,
        status: 'proposal retained for approval',
      };
    default:
      return {
        block: nodeLabel,
        status: 'completed by local mock runner',
      };
  }
}

export function createLocalRunRecord(
  nodes: WorkflowNode[],
  edges: CanvasWorkflowEdge[],
): LocalRunRecord {
  const startedAt = new Date();
  const completedAt = new Date(startedAt.getTime() + 640);
  const executionId = `local-run-${startedAt.getTime()}`;
  const orderedNodes = nodes.filter((node) => node.type !== 'add');

  const logs = orderedNodes.map((node, index) => {
    const block = node.data.block;
    const stage =
      (node.data.config?.fiscalStage as string | undefined) ||
      (block ? BLOCK_FAMILY_STAGE[block.family] : undefined) ||
      node.data.visualRole ||
      node.data.type;
    const stepStartedAt = new Date(startedAt.getTime() + index * 110);
    const stepCompletedAt = new Date(stepStartedAt.getTime() + 95);
    const nodeLabel = node.data.label || getFiscalStageLabel(stage);

    return {
      id: `${executionId}-${node.id}`,
      executionId,
      nodeId: node.id,
      nodeName: nodeLabel,
      nodeType: block ? `${block.family} / ${block.subtype}` : getFiscalStageLabel(stage),
      status: 'success' as const,
      startedAt: stepStartedAt,
      completedAt: stepCompletedAt,
      duration: '95',
      input: {
        upstreamEdges: edges.filter((edge) => edge.target === node.id).length,
        stage,
      },
      output: getFiscalOutputForStage(stage, nodeLabel, block),
      error: null,
    };
  });

  return {
    execution: {
      id: executionId,
      workflowId: LOCAL_WORKFLOW_ID,
      status: 'success',
      startedAt,
      completedAt,
      duration: String(completedAt.getTime() - startedAt.getTime()),
      error: null,
    },
    logs,
  };
}
