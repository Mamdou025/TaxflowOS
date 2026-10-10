CREATE TABLE "chatgpt_oauth_requests" (
  "request_hash" text PRIMARY KEY,
  "client_id" text NOT NULL,
  "redirect_uri" text NOT NULL,
  "code_challenge" text NOT NULL,
  "resource" text NOT NULL,
  "scope" text NOT NULL,
  "client_state" text,
  "bound_user_id" text REFERENCES "users"("id") ON DELETE CASCADE,
  "bound_session_id" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at" timestamp with time zone NOT NULL,
  "consumed_at" timestamp with time zone,
  CONSTRAINT "chatgpt_oauth_request_scope" CHECK ("scope" = 'inscope.workflows:read'),
  CONSTRAINT "chatgpt_oauth_request_binding" CHECK (("bound_user_id" IS NULL) = ("bound_session_id" IS NULL)),
  CONSTRAINT "chatgpt_oauth_request_expiry" CHECK ("expires_at" > "created_at")
);
--> statement-breakpoint
CREATE INDEX "chatgpt_oauth_request_expiry_idx" ON "chatgpt_oauth_requests"("expires_at");
--> statement-breakpoint
CREATE TABLE "chatgpt_oauth_grants" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "workspace_id" text NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "client_id" text NOT NULL,
  "resource" text NOT NULL,
  "scope" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at" timestamp with time zone NOT NULL,
  "last_used_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  CONSTRAINT "chatgpt_oauth_grant_scope" CHECK ("scope" = 'inscope.workflows:read'),
  CONSTRAINT "chatgpt_oauth_grant_expiry" CHECK ("expires_at" > "created_at")
);
--> statement-breakpoint
CREATE INDEX "chatgpt_oauth_grant_user_idx" ON "chatgpt_oauth_grants"("user_id", "created_at");
--> statement-breakpoint
CREATE TABLE "chatgpt_oauth_codes" (
  "code_hash" text PRIMARY KEY,
  "grant_id" text NOT NULL REFERENCES "chatgpt_oauth_grants"("id") ON DELETE CASCADE,
  "redirect_uri" text NOT NULL,
  "code_challenge" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at" timestamp with time zone NOT NULL,
  "consumed_at" timestamp with time zone,
  CONSTRAINT "chatgpt_oauth_code_expiry" CHECK ("expires_at" > "created_at")
);
--> statement-breakpoint
CREATE INDEX "chatgpt_oauth_code_grant_idx" ON "chatgpt_oauth_codes"("grant_id");
--> statement-breakpoint
CREATE TABLE "chatgpt_oauth_tokens" (
  "token_hash" text PRIMARY KEY,
  "grant_id" text NOT NULL REFERENCES "chatgpt_oauth_grants"("id") ON DELETE CASCADE,
  "kind" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at" timestamp with time zone NOT NULL,
  "used_at" timestamp with time zone,
  CONSTRAINT "chatgpt_oauth_token_kind" CHECK ("kind" IN ('access','refresh')),
  CONSTRAINT "chatgpt_oauth_token_expiry" CHECK ("expires_at" > "created_at")
);
--> statement-breakpoint
CREATE INDEX "chatgpt_oauth_token_grant_idx" ON "chatgpt_oauth_tokens"("grant_id");
--> statement-breakpoint
CREATE INDEX "chatgpt_oauth_token_expiry_idx" ON "chatgpt_oauth_tokens"("expires_at");
