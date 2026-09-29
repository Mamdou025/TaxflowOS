ALTER TABLE mkoro_workers ADD COLUMN auto_approve boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE mkoro_permissions ADD COLUMN decision_source text NOT NULL DEFAULT 'manual';
--> statement-breakpoint
ALTER TABLE mkoro_permissions ADD CONSTRAINT mkoro_permission_decision_source CHECK (decision_source IN ('manual','automatic'));
