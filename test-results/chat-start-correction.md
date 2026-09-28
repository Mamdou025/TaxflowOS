# Chat workflow start correction

- Reported symptom: old Approve this run card. Not reproduced in a fresh page; clarification pending whether old or new conversation.
- Reproduced live: runWorkflow opened shared panel but requested pf-fapi version 1, yielding Requested workflow version unavailable. No saved template version 1 exists for that catalog ID.
- Corrected Chat instructions and tool description: opening shows steps without approval/execution; omit version unless explicitly requested for an exact saved workflow ID.
- Added read-only request validation using core getSavedVersion; invalid version errors remain visible, no fallback or execution.
- Added 3 regression tests. Full verify passed (67 unit + 22 core); frontend production build passed after supplying required PORT/BASE_PATH. Initial type-import error corrected before successful verify.
- Built-app Excel/Run/Chat/recompute/approval/reload smoke passed. Evidence: test-results/phase2/04a727d1-1fe56882-173e-4245-95f6-d4e8361a9021.
- Uploaded only four correction files to Replit, checked each against previous release content before writing. Backup /tmp/taxflow-chat-start-5oqj6eny.
- Replit build 5344e58d-526c-4dca-b37d-e041c185007f started 2026-09-17T03:28:51Z; promotion pending.
- Replit reported Deployment successful at 2026-09-17T03:34:32Z.
- Post-release live verification caught the model still supplying version 1. The first correction was insufficient; did not claim completion.
- Final interface change: runWorkflow exposes only workflowId. Exact saved versions use openSavedWorkflowVersion with required workflowId/version and the same read-only core validation. Legacy result/version handling remains compatible. New tool uses the existing execute routing group.
- Final verify passed (67 unit + 22 core) and production build passed. Logs chat-start-verify-v2.log and chat-start-build-v2.log.
- V2 transfer used a normalized checked Git patch through Replit Shell after the browser file chooser timed out. No files changed until git apply --check passed. Backup /tmp/taxflow-chat-v2-enlq7j4u.
- Final build d13d6ab3-bc78-4d74-86a1-0cf0336e5321 started 2026-09-17T03:58:30Z. Live promotion and Chat check pending.
- Final build d13d6ab3 reported Deployment successful at 2026-09-17T04:03:40Z.
- Final live verification PASS: fresh production Chat, exact message Start the FAPI workflow., renders FAPI Calculation Template with all 13 blocks and enabled Start guided workflow. Neither Approve this run nor Requested workflow version unavailable appeared. No financial calculation, source replacement or result approval performed. Verified tab retained for user.
- Original reported old approval card was not reproduced directly; do not attribute its cause conclusively to caching. Fresh live Chat routing is now verified.
