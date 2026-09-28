CREATE TABLE mkoro_workers (
  id text PRIMARY KEY, workspace_id text NOT NULL REFERENCES workspaces(id),
  actor_id text NOT NULL REFERENCES users(id), name text NOT NULL,
  token_hash text NOT NULL UNIQUE, capabilities jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz,
  revoked_at timestamptz
);
--> statement-breakpoint
CREATE TABLE mkoro_pairings (
  token_hash text PRIMARY KEY, workspace_id text NOT NULL REFERENCES workspaces(id),
  actor_id text NOT NULL REFERENCES users(id), expires_at timestamptz NOT NULL,
  used_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE mkoro_conversations (
  id text PRIMARY KEY, workspace_id text NOT NULL REFERENCES workspaces(id),
  actor_id text NOT NULL REFERENCES users(id), worker_id text NOT NULL REFERENCES mkoro_workers(id),
  title text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE mkoro_tasks (
  id text PRIMARY KEY, conversation_id text NOT NULL REFERENCES mkoro_conversations(id),
  worker_id text NOT NULL REFERENCES mkoro_workers(id), request_id text NOT NULL,
  message text NOT NULL, status text NOT NULL DEFAULT 'queued', error text,
  cancel_requested boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, request_id),
  CONSTRAINT mkoro_task_status CHECK(status IN ('queued','running','waiting_permission','completed','failed','cancelled'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX mkoro_one_active_task ON mkoro_tasks(worker_id)
  WHERE status IN ('queued','running','waiting_permission');
--> statement-breakpoint
CREATE TABLE mkoro_commands (
  id text PRIMARY KEY, worker_id text NOT NULL REFERENCES mkoro_workers(id),
  task_id text NOT NULL REFERENCES mkoro_tasks(id), type text NOT NULL,
  payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), delivered_at timestamptz,
  CONSTRAINT mkoro_command_type CHECK(type IN ('message','cancel','permission'))
);
--> statement-breakpoint
CREATE INDEX mkoro_commands_pending ON mkoro_commands(worker_id, created_at) WHERE delivered_at IS NULL;
--> statement-breakpoint
CREATE TABLE mkoro_events (
  cursor bigserial PRIMARY KEY, id text NOT NULL UNIQUE,
  task_id text NOT NULL REFERENCES mkoro_tasks(id), seq integer NOT NULL,
  type text NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(task_id, seq)
);
--> statement-breakpoint
CREATE TABLE mkoro_permissions (
  task_id text NOT NULL REFERENCES mkoro_tasks(id), request_id text NOT NULL,
  options jsonb NOT NULL, tool_call jsonb, decision text, created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz, PRIMARY KEY(task_id, request_id)
);
