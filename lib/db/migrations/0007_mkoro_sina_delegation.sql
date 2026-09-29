ALTER TABLE mkoro_conversations ADD COLUMN sina_thread_id text;
--> statement-breakpoint
CREATE UNIQUE INDEX mkoro_sina_thread_worker
  ON mkoro_conversations(workspace_id,actor_id,sina_thread_id,worker_id)
  WHERE sina_thread_id IS NOT NULL;
--> statement-breakpoint
ALTER TABLE mkoro_tasks ADD COLUMN delegation jsonb;
