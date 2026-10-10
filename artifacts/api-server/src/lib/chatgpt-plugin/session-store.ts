import { pool } from '@workspace/db';
import { decodeBackup, validateBackup } from '../../storage/validate-backup';
import { SessionCommandError, type SessionOperation, type SessionStore } from './session-types';

type OperationRow = {
  operation_key: string;
  actor_id: string;
  workspace_id: string;
  workflow_id: string;
  run_id: string | null;
  kind: SessionOperation['kind'];
  request_hash: string;
  action: SessionOperation['action'];
  preview: SessionOperation['preview'];
  receipt: SessionOperation['receipt'];
  created_at: Date;
  expires_at: Date;
};
function operation(row: OperationRow): SessionOperation {
  return {
    key: row.operation_key,
    actorId: row.actor_id,
    workspaceId: row.workspace_id,
    workflowId: row.workflow_id,
    runId: row.run_id,
    kind: row.kind,
    requestHash: row.request_hash,
    action: row.action,
    preview: row.preview,
    receipt: row.receipt,
    createdAt: row.created_at.toISOString(),
    expiresAt: row.expires_at.toISOString(),
  };
}

/** Shares the existing workspace library CAS boundary; no alternate session store. */
export function createPostgresSessionStore(): SessionStore {
  return {
    async transaction(actor, permission, work) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const membership = await client.query<{ role: string }>(
          'SELECT role FROM workspace_members WHERE workspace_id=$1 AND user_id=$2 FOR SHARE',
          [actor.workspaceId, actor.userId],
        );
        const role = membership.rows[0]?.role;
        if (!role || (permission !== 'read' && !['owner', 'editor'].includes(role)))
          throw new SessionCommandError(
            'FORBIDDEN',
            'Current workspace membership does not allow this operation.',
          );
        const saved = await client.query<{ payload: string; revision: number }>(
          'SELECT payload,revision FROM workspace_libraries WHERE workspace_id=$1 FOR UPDATE',
          [actor.workspaceId],
        );
        if (!saved.rows[0])
          throw new SessionCommandError(
            'NOT_FOUND',
            'This workspace has no saved workflow library.',
          );
        let libraryRevision = saved.rows[0].revision;
        const result = await work({
          library: decodeBackup(saved.rows[0].payload),
          libraryRevision,
          async getOperation(key) {
            const rows = await client.query<OperationRow>(
              'SELECT * FROM chatgpt_session_operations WHERE operation_key=$1 AND actor_id=$2 AND workspace_id=$3 FOR UPDATE',
              [key, actor.userId, actor.workspaceId],
            );
            return rows.rows[0] ? operation(rows.rows[0]) : undefined;
          },
          async putOperation(value) {
            if (value.actorId !== actor.userId || value.workspaceId !== actor.workspaceId)
              throw new SessionCommandError(
                'FORBIDDEN',
                'Operation identity does not match the current account.',
              );
            await client.query(
              `INSERT INTO chatgpt_session_operations (operation_key,actor_id,workspace_id,workflow_id,run_id,kind,request_hash,action,preview,receipt,created_at,expires_at)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12)
              ON CONFLICT (operation_key) DO UPDATE SET receipt=EXCLUDED.receipt
              WHERE chatgpt_session_operations.actor_id=EXCLUDED.actor_id AND chatgpt_session_operations.workspace_id=EXCLUDED.workspace_id AND chatgpt_session_operations.request_hash=EXCLUDED.request_hash`,
              [
                value.key,
                value.actorId,
                value.workspaceId,
                value.workflowId,
                value.runId,
                value.kind,
                value.requestHash,
                JSON.stringify(value.action),
                JSON.stringify(value.preview),
                JSON.stringify(value.receipt),
                value.createdAt,
                value.expiresAt,
              ],
            );
          },
          async saveLibrary(library, expectedRevision) {
            if (permission === 'read')
              throw new SessionCommandError(
                'FORBIDDEN',
                'A read operation cannot update workflows.',
              );
            if (libraryRevision !== expectedRevision)
              throw new SessionCommandError('CONFLICT', 'The workspace library changed.');
            const payload = JSON.stringify({ format: 'taxflow-workflow-backup-v1', library });
            validateBackup(payload);
            const updated = await client.query<{ revision: number }>(
              'UPDATE workspace_libraries SET payload=$3,revision=revision+1,updated_at=now(),updated_by=$2 WHERE workspace_id=$1 AND revision=$4 RETURNING revision',
              [actor.workspaceId, actor.userId, payload, expectedRevision],
            );
            if (!updated.rows[0])
              throw new SessionCommandError('CONFLICT', 'The workspace library changed.');
            libraryRevision = updated.rows[0].revision;
            return libraryRevision;
          },
          async listOperations(workflowId, runId) {
            const rows = await client.query<OperationRow>(
              'SELECT * FROM chatgpt_session_operations WHERE workspace_id=$1 AND workflow_id=$2 AND run_id=$3 AND receipt IS NOT NULL ORDER BY created_at,operation_key',
              [actor.workspaceId, workflowId, runId],
            );
            return rows.rows.map(operation);
          },
        });
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
