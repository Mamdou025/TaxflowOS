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
