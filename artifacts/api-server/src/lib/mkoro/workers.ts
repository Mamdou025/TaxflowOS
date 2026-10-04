import { createHash } from 'node:crypto';
import { pool } from '@workspace/db';
import { MKORO_OFFLINE_MS, MkoroWorkerSchema, MkoroCommandSchema } from '@workspace/api-zod/mkoro';
import { permits, WorkspaceRoleSchema } from '@workspace/api-zod/access';
import { iso, MkoroError, transaction, type Scope, type WorkerScope } from './common';
import { approvePendingTools } from './automatic-approval';

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

export async function authenticateWorker(token: string): Promise<WorkerScope> {
  const { rows } = await pool.query(
    `SELECT w.id,w.actor_id,w.workspace_id,m.role FROM mkoro_workers w JOIN workspace_members m
     ON m.workspace_id=w.workspace_id AND m.user_id=w.actor_id
     WHERE w.token_hash=$1 AND w.revoked_at IS NULL`,
    [hash(token)],
  );
  const worker = rows[0];
  const role = WorkspaceRoleSchema.safeParse(worker?.role);
  if (!worker || !role.success || !permits(role.data, 'execute'))
    throw new MkoroError(401, 'Companion authorization was revoked or is unavailable.');
  return {
    workerId: worker.id,
    actorId: worker.actor_id,
    workspaceId: worker.workspace_id,
    credentialHash: hash(token),
  };
}

export async function listWorkers(scope: Scope) {
  const { rows } = await pool.query(
    'SELECT * FROM mkoro_workers WHERE actor_id=$1 AND workspace_id=$2 ORDER BY created_at DESC LIMIT 100',
    [scope.actorId, scope.workspaceId],
  );
  return rows.map((row) =>
    MkoroWorkerSchema.parse({
      id: row.id,
      name: row.name,
      autoApprove: row.auto_approve,
      capabilities: row.capabilities,
      status: row.revoked_at
        ? 'revoked'
        : row.last_seen_at && Date.now() - new Date(row.last_seen_at).getTime() < MKORO_OFFLINE_MS
          ? 'online'
          : 'offline',
      lastSeenAt: row.last_seen_at ? iso(row.last_seen_at) : null,
      createdAt: iso(row.created_at),
    }),
  );
}

export async function setAutomaticApproval(scope: Scope, id: string, autoApprove: boolean) {
  const result = await pool.query(
    `UPDATE mkoro_workers SET auto_approve=$4
     WHERE id=$1 AND actor_id=$2 AND workspace_id=$3 AND revoked_at IS NULL RETURNING id`,
    [id, scope.actorId, scope.workspaceId, autoApprove],
  );
  if (!result.rowCount) throw new MkoroError(404, 'Active companion not found.');
  return { ok: true };
}

export async function revokeWorker(scope: Scope, id: string) {
  const result = await pool.query(
    'UPDATE mkoro_workers SET revoked_at=COALESCE(revoked_at,now()) WHERE id=$1 AND actor_id=$2 AND workspace_id=$3 RETURNING id',
    [id, scope.actorId, scope.workspaceId],
  );
  if (!result.rowCount) throw new MkoroError(404, 'Companion not found.');
}

// Claim once. An interrupted response is an unknown outcome, never permission to replay a prompt.
export async function pollCommands(scope: WorkerScope, capabilities?: string[]) {
  return transaction(async (client) => {
    await approvePendingTools(client, scope);
    const worker = await client.query(
      `UPDATE mkoro_workers SET last_seen_at=now(),capabilities=COALESCE($2::jsonb,capabilities)
       WHERE id=$1 AND token_hash=$3 AND revoked_at IS NULL RETURNING id`,
      [scope.workerId, capabilities ? JSON.stringify(capabilities) : null, scope.credentialHash],
    );
    // Roll back any approval made above if authentication raced credential rotation.
    if (!worker.rowCount) throw new MkoroError(401, 'Companion authorization changed. Reconnect.');
    const { rows } = await client.query(
      `UPDATE mkoro_commands SET delivered_at=now() WHERE id IN (
        SELECT c.id FROM mkoro_commands c JOIN mkoro_tasks t ON t.id=c.task_id
        WHERE c.worker_id=$1 AND c.delivered_at IS NULL
        AND t.status IN ('queued','running','waiting_permission')
        ORDER BY c.created_at FOR UPDATE OF c SKIP LOCKED LIMIT 20
       ) RETURNING id,type,task_id,payload`,
      [scope.workerId],
    );
    return rows.map((row) =>
      MkoroCommandSchema.parse({
        id: row.id,
        type: row.type,
        taskId: row.task_id,
        payload: row.payload,
      }),
    );
  });
}
