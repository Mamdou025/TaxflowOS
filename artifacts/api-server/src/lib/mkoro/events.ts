import { type MkoroWorkerEvent } from '@workspace/api-zod/mkoro';
import { transaction, MkoroError, activeStatuses, type WorkerScope } from './common';

export async function recordEvents(scope: WorkerScope, events: MkoroWorkerEvent[]) {
  return transaction(async (client) => {
    for (const event of events) {
      const { rows } = await client.query(
        'SELECT * FROM mkoro_tasks WHERE id=$1 AND worker_id=$2 FOR UPDATE',
        [event.taskId, scope.workerId],
      );
      const task = rows[0];
      if (!task) throw new MkoroError(404, 'Task not assigned to this companion.');
      const previous = await client.query(
        `SELECT id,task_id,seq,type,payload FROM mkoro_events WHERE id=$1 OR (task_id=$2 AND seq=$3)`,
        [event.id, event.taskId, event.seq],
      );
      if (previous.rows.length) {
        const same =
          previous.rows.length === 1 &&
          previous.rows[0].id === event.id &&
          previous.rows[0].task_id === event.taskId &&
          previous.rows[0].seq === event.seq &&
          previous.rows[0].type === event.type;
        // PostgreSQL compares JSONB structurally, independent of object key order.
        const payload =
          same &&
          (await client.query('SELECT payload=$2::jsonb AS same FROM mkoro_events WHERE id=$1', [
            event.id,
            JSON.stringify(event.payload),
          ]));
        if (!payload || !payload.rows[0]?.same)
          throw new MkoroError(409, 'An event identity was reused for different data.');
        continue;
      }
      if (!activeStatuses.includes(task.status))
        throw new MkoroError(409, 'The task is already terminal.');
      const count = await client.query(
        'SELECT count(*)::int AS count,max(seq) AS last FROM mkoro_events WHERE task_id=$1',
        [event.taskId],
      );
      if (count.rows[0].count >= 10_000) throw new MkoroError(413, 'Task event limit reached.');
      if (count.rows[0].last !== null && event.seq <= count.rows[0].last)
        throw new MkoroError(409, 'Events must arrive in increasing task sequence.');
      const delivered = await client.query(
        "SELECT id FROM mkoro_commands WHERE task_id=$1 AND type='message' AND delivered_at IS NOT NULL",
        [event.taskId],
      );
      if (!delivered.rowCount)
        throw new MkoroError(409, 'The task has not been delivered to the companion.');
      if (event.type === 'permission_required') {
        // This may have been buffered before Stop. Record the fact so a later cancellation
        // acknowledgement can drain; decisions remain blocked by cancel_requested.
        const permission = await client.query(
          'INSERT INTO mkoro_permissions(task_id,request_id,options,tool_call) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING request_id',
          [
            event.taskId,
            event.payload.requestId,
            JSON.stringify(event.payload.options),
            JSON.stringify(event.payload.toolCall ?? null),
          ],
        );
        if (!permission.rowCount) throw new MkoroError(409, 'Permission request already exists.');
      }
      await client.query(
        'INSERT INTO mkoro_events(id,task_id,seq,type,payload) VALUES($1,$2,$3,$4,$5)',
        [event.id, event.taskId, event.seq, event.type, JSON.stringify(event.payload)],
      );
      const status =
        event.type === 'task_completed'
          ? 'completed'
          : event.type === 'task_failed'
            ? 'failed'
            : event.type === 'task_cancelled'
              ? 'cancelled'
              : event.type === 'permission_required'
                ? 'waiting_permission'
                : event.type === 'task_started'
                  ? 'running'
                  : task.status;
      await client.query('UPDATE mkoro_tasks SET status=$2,error=$3,updated_at=now() WHERE id=$1', [
        event.taskId,
        status,
        event.type === 'task_failed' ? event.payload.message : task.error,
      ]);
      await client.query('UPDATE mkoro_conversations SET updated_at=now() WHERE id=$1', [
        task.conversation_id,
      ]);
    }
    await client.query('UPDATE mkoro_workers SET last_seen_at=now() WHERE id=$1', [scope.workerId]);
    return events.length; // Idempotent retries acknowledge the complete, atomically accepted batch.
  });
}
