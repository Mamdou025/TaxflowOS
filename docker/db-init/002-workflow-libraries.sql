CREATE TABLE IF NOT EXISTS personal_workflow_libraries (
  workspace_hash text PRIMARY KEY,
  owner_id text NOT NULL,
  payload text NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);
