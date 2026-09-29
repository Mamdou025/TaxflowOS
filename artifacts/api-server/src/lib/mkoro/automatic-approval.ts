import { randomUUID } from 'node:crypto';
import { MkoroPermissionOptionSchema } from '@workspace/api-zod/mkoro';
import type { Client, WorkerScope } from './common';

/** Uses existing one-action decisions; never gives Goose a permanent tool grant. */
export async function approvePendingTools(client: Client, scope: WorkerScope) {
  const { rows } = await client.query(
    `SELECT p.task_id,p.request_id,p.options FROM mkoro_permissions p
     JOIN mkoro_tasks t ON t.id=p.task_id
     WHERE t.worker_id=$1 AND t.status='waiting_permission' AND NOT t.cancel_requested
     AND p.decision IS NULL ORDER BY t.id,p.request_id FOR UPDATE OF t,p`,
    [scope.workerId],
  );
  if (!rows.length) return;
  // Match the task-before-worker lock order used by event recording.
  const setting = await client.query(
    `SELECT auto_approve FROM mkoro_workers WHERE id=$1 AND actor_id=$2
     AND workspace_id=$3 AND revoked_at IS NULL FOR UPDATE`,
    [scope.workerId, scope.actorId, scope.workspaceId],
  );
  if (!setting.rows[0]?.auto_approve) return;
  for (const permission of rows) {
    const option = MkoroPermissionOptionSchema.array()
      .parse(permission.options)
      .find((item) => item.kind === 'allow_once');
    if (!option) continue;
    await client.query(
      `UPDATE mkoro_permissions SET decision=$3,decision_source='automatic',decided_at=now()
       WHERE task_id=$1 AND request_id=$2`,
      [permission.task_id, permission.request_id, option.optionId],
    );
    await client.query(
      `INSERT INTO mkoro_commands(id,worker_id,task_id,type,payload) VALUES($1,$2,$3,'permission',$4)`,
      [
        randomUUID(),
        scope.workerId,
        permission.task_id,
        JSON.stringify({ requestId: permission.request_id, optionId: option.optionId }),
      ],
    );
    await client.query(
      `UPDATE mkoro_tasks SET status=CASE WHEN EXISTS(
       SELECT 1 FROM mkoro_permissions WHERE task_id=$1 AND decision IS NULL
       ) THEN 'waiting_permission' ELSE 'running' END,updated_at=now() WHERE id=$1`,
      [permission.task_id],
    );
  }
}
