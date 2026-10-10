CREATE TABLE chatgpt_source_captures (
  id text PRIMARY KEY,
  actor_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id text NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  workflow_id text NOT NULL,
  run_id text NOT NULL,
  block_id text NOT NULL,
  session_revision integer NOT NULL CHECK (session_revision >= 0),
  file_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 20971520),
  uploaded_bytes integer NOT NULL DEFAULT 0 CHECK (uploaded_bytes >= 0),
  content_base64 text NOT NULL DEFAULT '',
  extraction jsonb,
  selection jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CHECK (uploaded_bytes <= size_bytes),
  CHECK (expires_at > created_at)
);
CREATE INDEX chatgpt_source_capture_expiry_idx ON chatgpt_source_captures(expires_at);
CREATE INDEX chatgpt_source_capture_actor_idx ON chatgpt_source_captures(actor_id, workspace_id);
