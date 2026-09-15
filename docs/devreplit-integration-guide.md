# Bringing DevBranch changes into DevReplit

Use a reviewed merge into DevReplit so its Replit-specific commits stay in history. Do not replace DevReplit with DevBranch or force-push it.

## Prepared integration

- Source: DevBranch at db34014.
- Target before integration: DevReplit at 1811610.
- Review branch: codex/devbranch-to-devreplit-20260909.
- Git merged both branches without conflicts.
- Replit configuration, managed AI gateway changes, Sentry source-map support, and production smoke tests are retained.
- The source adds personal_workflow_libraries. It does not remove existing schema definitions.
- Untracked reports and screenshots in the original local checkout are not part of this merge.

## Validate in the development Replit before merging the pull request

First stop development test servers so checks cannot accidentally reuse an older app. In the Replit Shell, inspect `git status --short --branch`. Commit any intended local changes to a separate backup branch before switching; do not discard them. Then, with a clean working tree:

```bash
git fetch origin
git switch codex/devbranch-to-devreplit-20260909
pnpm install --frozen-lockfile
pnpm run typecheck
PORT=5173 BASE_PATH=/ pnpm run build
pnpm --filter @workspace/ai-workflow-builder test:prod-freshness
PROD_SMOKE_SKIP_BUILD=0 pnpm --filter @workspace/ai-workflow-builder test:prod
pnpm exec playwright test --config=playwright.config.ts --tsconfig=e2e/tsconfig.json
```

Run each command separately and stop on any failure. These are Linux/Replit commands. Keep the Replit development environment's existing secrets and database configuration. If Sentry upload credentials are configured, the existing build config also requires VITE_RELEASE; use the normal release setup for this Replit. The build may upload source maps when those credentials are configured.

Test login, an AI request, document upload, an individual calculation block, a complete workflow, and saving/reloading a personal workflow. Browser-only smoke tests do not prove live AI or database access works.

The existing scripts/post-merge.sh installs dependencies and runs a Drizzle schema push. Back up the development database before applying it, inspect any schema prompts, and stop if it proposes deleting data. Do not use push-force. The workflow library route also lazily creates its new table when first accessed.

## After validation passes

Merge the pull request into DevReplit using a merge commit to preserve branch history. With a clean Replit working tree:

```bash
git fetch origin
git switch DevReplit
git merge --ff-only origin/DevReplit
pnpm install --frozen-lockfile
```

If fast-forward fails, inspect local commits before continuing; do not reset or force-push. Restart the development app and repeat the live checks. Updating a Git branch does not prove the running app or a published deployment has been updated. Publish only after validating the development app.

## Rollback

Before changing DevReplit, keep its previous commit recorded (1811610 for this preparation). If the integration must be undone, revert the PR's merge commit with `git revert -m 1 <merge-commit>` on a separate branch and review it before merging the rollback. Reinstall dependencies and restart/redeploy the appropriate environment. A code revert does not undo database writes; retain the additive workflow library table and its data unless a separate database rollback is explicitly required.

## Local validation of merge 8f18189 (2026-09-10)

Passed:
- Frozen-lockfile dependency installation (lifecycle scripts skipped locally).
- Full workspace typecheck.
- Frontend production build and API build.
- Six production bundle freshness unit tests.
- Four browser tests against the freshly built frontend: home, dashboard, workflows, and the production individual-block input/output scenario. The individual-block test recorded no page errors.

The repository intentionally excludes Windows native build packages. Matching Rollup, esbuild, Tailwind oxide, and Lightning CSS binaries were installed in a separate local tools directory and supplied through NODE_PATH, without changing tracked manifests or the lockfile. A local-only Playwright configuration starts the preview port itself to accommodate Windows shell differences.

The browser preview had no API server attached, and emitted connection-refused messages for backend requests. Live Replit authentication, managed AI, database persistence, database schema application, Sentry upload, and deployment were not verified. The production build emitted source-map, browser externalization, and chunk-size warnings but completed successfully. The Windows preview server required explicit shutdown after the four browser assertions passed.

Keep the PR in draft until the Replit development checks above pass. No database or deployed application was changed during local validation.

## Replit development validation (2026-09-10)

Validated d0bbfd5 in the actual Replit development workspace. Dependency installation with the frozen lockfile, full workspace typecheck, API build, frontend production build, six freshness tests, and three production browser startup tests passed. The production browser tests overlapped the API restart and logged connection-refused messages; separate API health, AI, and storage checks passed.

Restarting the API workflow was necessary: the old process returned HTML for the new workflow-library route. After restart, health returned HTTP 200 and the UI showed Ready to save to server. A synthetic one-megabyte workflow-library payload saved and loaded identically with HTTP 200; its isolated test record was deleted successfully. A neutral AI smoke prompt returned READY, and its chat remained available after browser reload. No fresh sign-in flow was tested.

The live Document Calculator individual-block test produced RESULT 251 from item_total 125.5. No saved workflow template was edited. The original Replit test-output changes were preserved in a stash named Before DevBranch integration validation 2026-09-10; they are not application code and are intentionally left stashed. Logs are in /tmp/devreplit-*.log in Replit. The production deployment was not republished.
