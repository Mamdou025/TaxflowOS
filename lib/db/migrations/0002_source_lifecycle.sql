ALTER TABLE "documents" ALTER COLUMN "storage_bucket" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "storage_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "source_revision" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "content_hash" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "lifecycle_status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "purged_at" timestamp;--> statement-breakpoint
CREATE INDEX "documents_workspace_lifecycle_idx" ON "documents" USING btree ("workspace_id","lifecycle_status","updated_at");--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_source_revision_positive" CHECK ("documents"."source_revision" > 0);--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_lifecycle_status" CHECK ("documents"."lifecycle_status" in ('active', 'archived', 'deleted', 'purged'));