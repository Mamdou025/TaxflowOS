import type { WorkflowView } from './view-contract';

const labels = {
  pending: 'Not run',
  success: 'Succeeded',
  warning: 'Succeeded with warnings',
  error: 'Failed',
  skipped: 'Skipped',
  needs_review: 'Needs review',
  outdated: 'Outdated result',
  reviewed: 'Reviewed checkpoint',
};

/** Display projection only: execution, review and approval remain distinct facts. */
export function workflowSteps(view: WorkflowView) {
  const recorded = view.inspection?.steps;
  const order = recorded?.map((step) => step.id) ?? [
    ...view.definition.structure.blockOrder,
    ...view.definition.blocks.map((block) => block.id),
  ];
  const ids = [...new Set(order)].filter((id) =>
    view.definition.blocks.some((block) => block.id === id),
  );
  return ids.map((id) => {
    const block = view.definition.blocks.find((item) => item.id === id)!;
    const step = recorded?.find((item) => item.id === id);
    const result = view.inspection?.results[id];
    const status = step?.status ?? view.statuses[id] ?? result?.status ?? 'pending';
    const hasRun = view.kind === 'workflow-run';
    const outdated = hasRun && status === 'outdated';
    const successful =
      hasRun && !outdated && !!result && ['success', 'warning'].includes(result.status);
    return {
      block,
      result,
      status,
      label: !hasRun ? 'No recorded execution' : labels[status],
      successful,
      ready: step?.ready,
      inputRequired: step?.inputRequired,
      dependencies:
        step?.dependencies ??
        view.definition.edges
          .filter((edge) => edge.status === 'active' && edge.targetBlockId === id)
          .map((edge) => edge.sourceBlockId),
      attention:
        hasRun &&
        (outdated ||
          step?.inputRequired === true ||
          ['error', 'needs_review', 'warning'].includes(status)),
    };
  });
}

export function workflowProgress(view: WorkflowView) {
  const steps = workflowSteps(view);
  const readinessKnown =
    view.kind === 'workflow-run' &&
    steps.length > 0 &&
    steps.every((step) => step.ready !== undefined && step.inputRequired !== undefined);
  return {
    total: steps.length,
    successful:
      view.kind === 'workflow-run' ? steps.filter((step) => step.successful).length : null,
    ready: readinessKnown ? steps.filter((step) => step.ready).length : null,
    needsInput: readinessKnown ? steps.filter((step) => step.inputRequired).length : null,
    attention: view.kind === 'workflow-run' ? steps.filter((step) => step.attention).length : null,
    reviewed:
      view.kind === 'workflow-run'
        ? steps.filter((step) => step.status === 'reviewed').length
        : null,
  };
}

export type WorkflowStep = ReturnType<typeof workflowSteps>[number];
