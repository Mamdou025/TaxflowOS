import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import { pool } from '@workspace/db';
import { extractWorkflowDocumentReferences } from './extract';

/**
 * Replaces every indexed edge for this workspace with exactly the ones derivable from
 * the library it just saved. The library payload is always a full snapshot, so the
 * index is too — this never partially patches stale rows. Best-effort: a failure here
 * must never fail the caller's library save, since this index is strictly derived and
 * can always be rebuilt later from the same payload.
 */
export async function reindexWorkflowDocumentReferences(
  workspaceId: string,
  library: WorkflowLibrary,
): Promise<void> {
  const edges = extractWorkflowDocumentReferences(library);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `DELETE FROM entity_references WHERE workspace_id=$1 AND from_type='workflow'`,
      [workspaceId],
    );
    for (const edge of edges) {
      const context = JSON.stringify(edge.context);
      await client.query(
        `INSERT INTO entity_references (workspace_id,from_type,from_id,to_type,to_id,context)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (workspace_id,from_type,from_id,to_type,to_id) DO UPDATE SET context=$6`,
        [workspaceId, edge.fromType, edge.fromId, edge.toType, edge.toId, context],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
