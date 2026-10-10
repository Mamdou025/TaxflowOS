ALTER TABLE "chatgpt_oauth_requests" DROP CONSTRAINT "chatgpt_oauth_request_scope";
--> statement-breakpoint
ALTER TABLE "chatgpt_oauth_requests" ADD CONSTRAINT "chatgpt_oauth_request_scope" CHECK (
  "scope" IN (
    'inscope.workflows:read',
    'inscope.workflows:read inscope.workflows:write',
    'inscope.workflows:read inscope.workflows:execute',
    'inscope.workflows:read inscope.workflows:write inscope.workflows:execute'
  )
);
--> statement-breakpoint
ALTER TABLE "chatgpt_oauth_grants" DROP CONSTRAINT "chatgpt_oauth_grant_scope";
--> statement-breakpoint
ALTER TABLE "chatgpt_oauth_grants" ADD CONSTRAINT "chatgpt_oauth_grant_scope" CHECK (
  "scope" IN (
    'inscope.workflows:read',
    'inscope.workflows:read inscope.workflows:write',
    'inscope.workflows:read inscope.workflows:execute',
    'inscope.workflows:read inscope.workflows:write inscope.workflows:execute'
  )
);
