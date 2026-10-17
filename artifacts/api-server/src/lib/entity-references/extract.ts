import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';

/**
 * Deliberately has no dependency on @workspace/db (or anything else with a module-level
 * side effect) — it's pure, so it can be unit-tested without a database, and reused by any
 * future caller that just wants the edges without writing them anywhere.
 */
export type EntityReferenceEdge = {
  fromType: string;
  fromId: string;
  toType: string;
  toId: string;
  context: unknown;
};

/**
 * Pure read of relationships the workflow library already encodes. Not the source of
 * truth for anything — a workflow's saved `sessionSnapshot.sources[].extraction` already
 * records which document it read; this just lifts that into a flat, queryable edge list.
 * Extend this (not the caller) when another already-known relationship is worth indexing.
 */
export function extractWorkflowDocumentReferences(library: WorkflowLibrary): EntityReferenceEdge[] {
  const edges: EntityReferenceEdge[] = [];
  for (const [workflowId, personalWorkflow] of Object.entries(library)) {
    for (const run of personalWorkflow.runs ?? []) {
      for (const source of run.sessionSnapshot?.sources ?? []) {
        const extraction = source.extraction;
        if (!extraction?.originalDocumentId) continue;
        edges.push({
          fromType: 'workflow',
          fromId: workflowId,
          toType: 'document',
          toId: extraction.originalDocumentId,
          context: {
            via: 'extraction',
            runAt: run.at,
            sourceId: source.id,
            extractionId: extraction.id,
            revision: extraction.revision,
          },
        });
      }
    }
  }
  return edges;
}
