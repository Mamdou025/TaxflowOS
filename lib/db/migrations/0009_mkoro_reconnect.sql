ALTER TABLE "mkoro_pairings" ADD COLUMN "reconnect_worker_id" text REFERENCES "mkoro_workers"("id");
--> statement-breakpoint
ALTER TABLE "mkoro_pairings" ADD COLUMN "reconnect_token_hash" text;
