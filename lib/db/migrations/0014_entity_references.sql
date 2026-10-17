CREATE TABLE "entity_references" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"from_type" text NOT NULL,
	"from_id" text NOT NULL,
	"to_type" text NOT NULL,
	"to_id" text NOT NULL,
	"context" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entity_references" ADD CONSTRAINT "entity_references_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "entity_references_edge_idx" ON "entity_references" USING btree ("workspace_id","from_type","from_id","to_type","to_id");--> statement-breakpoint
CREATE INDEX "entity_references_from_idx" ON "entity_references" USING btree ("workspace_id","from_type","from_id");--> statement-breakpoint
CREATE INDEX "entity_references_to_idx" ON "entity_references" USING btree ("workspace_id","to_type","to_id");
