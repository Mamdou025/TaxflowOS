import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { WorkflowSessionReadModel } from './workflow-session-read-model';

export type WorkflowStep = WorkflowSessionReadModel['context']['steps'][number];

const tones: Record<WorkflowBlock['family'], string> = {
  Trigger: '#d5a171',
  Source: '#7fb2d9',
  Logic: '#7cc3a6',
  'AI / Agent': '#c894d6',
  'Review / Validation': '#dab06c',
  Field: '#a892d6',
  Output: '#8b9bdd',
  Protected: '#cf8f9f',
};

export function workflowStepTone(family: WorkflowBlock['family']) {
  return tones[family];
}

export function workflowStepStatus(
  steps: WorkflowStep[],
  running = false,
  awaitingApproval = false,
) {
  if (!steps.length) return 'No steps';
  if (steps.some((step) => step.status === 'error')) return 'Needs attention';
  if (steps.some((step) => step.status === 'outdated')) return 'Outdated';
  if (steps.some((step) => step.inputRequired)) return 'Needs your input';
  if (steps.some((step) => step.status === 'needs_review')) return 'Needs review';
  if (steps.every((step) => ['success', 'warning', 'reviewed'].includes(step.status)))
    return awaitingApproval
      ? 'Awaiting approval'
      : steps.some((step) => step.status === 'warning')
        ? 'Completed with warnings'
        : 'Complete';
  if (steps.some((step) => step.status === 'skipped')) return 'Skipped';
  return running && steps.some((step) => step.ready) ? 'Running' : 'Pending';
}

/** Visual grouping recognizes the saved graph, independently of its worksheet units. */
export function supportsFapiStages(definition: WorkflowDefinition) {
  const expected = [
    ['fapi-source-trial-balance', 'Source'],
    ['fapi-source-inputs', 'Source'],
    ['fapi-logic-keyword-mapper', 'Logic'],
    ['fapi-logic-category-rollup', 'Logic'],
    ['fapi-logic-lines-engine', 'Logic'],
    ['fapi-logic-summary-engine', 'Logic'],
  ];
  return (
    expected.every(([id, family]) =>
      definition.blocks.some((block) => block.id === id && block.family === family),
    ) &&
    definition.edges.some(
      (edge) =>
        edge.status === 'active' &&
        edge.sourceBlockId === 'fapi-logic-lines-engine' &&
        edge.targetBlockId === 'fapi-logic-summary-engine',
    )
  );
}
