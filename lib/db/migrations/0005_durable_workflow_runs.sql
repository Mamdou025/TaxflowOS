CREATE TABLE "workflow_run_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"workflow_version" integer NOT NULL,
	"definition" jsonb NOT NULL,
	"requested_by" text NOT NULL,
	"request_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	"claimed_at" timestamp with time zone,
	"cancel_requested_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"result" jsonb,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_run_jobs" ADD CONSTRAINT "workflow_run_jobs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_run_jobs" ADD CONSTRAINT "workflow_run_jobs_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_run_jobs_request_idx" ON "workflow_run_jobs" USING btree ("workspace_id","request_id");--> statement-breakpoint
CREATE INDEX "workflow_run_jobs_claim_idx" ON "workflow_run_jobs" USING btree ("status","run_after");--> statement-breakpoint
CREATE INDEX "workflow_run_jobs_workflow_idx" ON "workflow_run_jobs" USING btree ("workspace_id","workflow_id","created_at");