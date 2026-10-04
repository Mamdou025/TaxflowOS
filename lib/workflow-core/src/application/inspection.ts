import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import { getSavedVersion, WorkflowCommandError } from './commands';
import { sessionContext, sessionDefinition } from './sessions';

/** A detached evidence view. Never execute, select a fallback run, or mutate the draft. */
export function inspectWorkflowRun(entry: PersonalWorkflow, runId: string) {
  const session = entry.sessions?.find((item) => item.id === runId);
  const record = entry.runs.find((item) => item.result.record.execution.id === runId);
  if (!session && !record)
    throw new WorkflowCommandError(
      'NOT_FOUND',
      'This exact run is unavailable. No other run was selected.',
    );
  const version = session?.version ?? record!.version;
  const saved = getSavedVersion(entry, version);
  const snapshot = session ?? record?.sessionSnapshot;
  const definition = snapshot ? sessionDefinition(entry, snapshot) : saved.definition;
  const results = session
    ? session.results
    : Object.fromEntries(record!.result.result.results.map((item) => [item.blockId, item]));
  const steps = snapshot
    ? sessionContext(entry, snapshot).steps
    : definition.blocks.map((block) => ({
        id: block.id,
        label: block.label,
        family: block.family,
        status: results[block.id]?.status ?? 'pending',
        dependencies: definition.edges
          .filter((edge) => edge.status === 'active' && edge.targetBlockId === block.id)
          .map((edge) => edge.sourceBlockId),
      }));
  return structuredClone({
    workflowId: entry.id,
    runId,
    version,
    definition,
    results,
    steps,
    sources: snapshot?.sources ?? [],
    documentReviews: session?.documentReviews ?? record?.documentReviews ?? [],
    attempts: snapshot?.attempts ?? [],
    revision: session?.revision,
    paused: session?.paused,
    approvedAt: snapshot?.approvedAt,
    kind: session ? ('session' as const) : ('record' as const),
  });
}
export { inspectDocumentEvidence, inspectCapturedDocuments } from './document-inspection';
export {
  prepareDocumentReview,
  makeDocumentReview,
  documentReviewSummaries,
  currentDocumentSourceIds,
} from './document-review';
