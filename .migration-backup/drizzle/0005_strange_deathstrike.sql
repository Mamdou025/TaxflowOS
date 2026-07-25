CREATE TABLE "assistant_memories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" text,
	"fiscal_year" integer,
	"workflow_id" text,
	"kind" text DEFAULT 'fact' NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"source" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assistant_memories" ADD CONSTRAINT "assistant_memories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;