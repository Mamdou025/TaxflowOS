CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" text,
	"file_name" text NOT NULL,
	"mime_type" text,
	"size_bytes" integer,
	"storage_bucket" text NOT NULL,
	"storage_key" text NOT NULL,
	"status" text DEFAULT 'uploading' NOT NULL,
	"extracted_chars" integer,
	"page_count" integer,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documents_user_created_idx" ON "documents" USING btree ("user_id","created_at");