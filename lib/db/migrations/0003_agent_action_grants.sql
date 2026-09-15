CREATE TABLE "agent_action_grants" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"agent_id" text NOT NULL,
	"capability" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"kind" text NOT NULL,
	"operation_id" text,
	"resource_revision" text,
	"request_fingerprint" text,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"used_at" timestamp with time zone,
	"used_by_operation_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agent_grants_kind" CHECK ("agent_action_grants"."kind" in ('one-time', 'reusable'))
);
--> statement-breakpoint
CREATE TABLE "agent_action_operations" (
	"workspace_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"operation_id" text NOT NULL,
	"agent_id" text NOT NULL,
	"capability" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"resource_revision" text,
	"request_fingerprint" text,
	"request_signature" text NOT NULL,
	"grant_id" text,
	"status" text NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agent_action_operations_workspace_id_actor_id_operation_id_pk" PRIMARY KEY("workspace_id","actor_id","operation_id"),
	CONSTRAINT "agent_operations_status" CHECK ("agent_action_operations"."status" in ('allowed', 'denied', 'succeeded', 'failed', 'conflict'))
);
--> statement-breakpoint
ALTER TABLE "agent_action_grants" ADD CONSTRAINT "agent_action_grants_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_action_grants" ADD CONSTRAINT "agent_action_grants_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_action_operations" ADD CONSTRAINT "agent_action_operations_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_action_operations" ADD CONSTRAINT "agent_action_operations_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_action_operations" ADD CONSTRAINT "agent_action_operations_grant_id_agent_action_grants_id_fk" FOREIGN KEY ("grant_id") REFERENCES "public"."agent_action_grants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_grants_scope_idx" ON "agent_action_grants" USING btree ("workspace_id","actor_id","agent_id","capability","resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "agent_operations_resource_idx" ON "agent_action_operations" USING btree ("workspace_id","resource_type","resource_id","created_at");