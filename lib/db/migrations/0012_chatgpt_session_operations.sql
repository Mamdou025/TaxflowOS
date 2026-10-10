CREATE TABLE chatgpt_session_operations (
  operation_key text PRIMARY KEY,
  actor_id text NOT NULL REFERENCES users(id),
  workspace_id text NOT NULL REFERENCES workspaces(id),
  workflow_id text NOT NULL,
  run_id text,
  kind text NOT NULL CHECK (kind IN ('start', 'change', 'recalculate')),
  request_hash text NOT NULL,
  action jsonb NOT NULL,
  preview jsonb,
  receipt jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX chatgpt_session_operations_history_idx
  ON chatgpt_session_operations (workspace_id, workflow_id, run_id, created_at);
