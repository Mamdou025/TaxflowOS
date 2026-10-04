import type { inspectWorkflowRun } from '@workspace/workflow-core/inspection';
import type {
  LocalRunRecord,
  WorkflowDefinition,
} from '@/shared/workflow-engine/workflow/contracts';

export type InspectedWorkflowRun = ReturnType<typeof inspectWorkflowRun>;

/** Adapt captured results to the existing builder viewers without executing or looking up another run. */
export function recordedRunProjection(
  evidence: InspectedWorkflowRun,
  attemptIndex: number | null,
  savedDefinition: WorkflowDefinition,
  savedRecord?: LocalRunRecord,
) {
  const attempt = attemptIndex === null ? undefined : evidence.attempts[attemptIndex];
  if (attemptIndex !== null && !attempt)
    throw new Error('This recorded attempt is unavailable. No other attempt was selected.');
  const results = attempt ? attempt.result.result.results : Object.values(evidence.results);
  const baseRecord =
    attempt?.result.record ?? savedRecord ?? evidence.attempts.at(-1)?.result.record;
  const record: LocalRunRecord | undefined = baseRecord && {
    execution: { ...baseRecord.execution },
    logs: results.map((result) => ({
      id: `${result.runId}:${result.blockId}`,
      executionId: result.runId,
      nodeId: result.blockId,
      nodeName:
        evidence.definition.blocks.find((block) => block.id === result.blockId)?.label ??
        result.blockId,
      nodeType:
        evidence.definition.blocks.find((block) => block.id === result.blockId)?.family ?? 'action',
      status:
        result.status === 'error' ? 'error' : result.status === 'skipped' ? 'pending' : 'success',
      startedAt: new Date(result.startedAt),
      completedAt: new Date(result.completedAt),
      duration: null,
      input: result.input,
      output: result,
      error: result.errors.join('\n') || null,
    })),
  };
  const definition = structuredClone(attempt ? savedDefinition : evidence.definition);
  const settingsUnavailable: string[] = [];
  // Config signatures were captured with each execution. In an older attempt,
  // use those settings rather than the session's subsequently edited inputs.
  if (attempt)
    for (const block of definition.blocks) {
      const signature = results.find((result) => result.blockId === block.id)?.configSignature;
      try {
        const config: unknown = signature ? JSON.parse(signature) : null;
        if (config && typeof config === 'object' && !Array.isArray(config)) {
          block.config = config as Record<string, unknown>;
        } else settingsUnavailable.push(block.id);
      } catch {
        settingsUnavailable.push(block.id);
      }
    }
  const statuses = Object.fromEntries(
    attempt
      ? results.map((result) => [result.blockId, result.status])
      : evidence.steps.map((step) => [step.id, step.status]),
  );
  return { definition, record, statuses, settingsUnavailable };
}
