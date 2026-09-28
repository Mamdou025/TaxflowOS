# Local startup conflict repair

The local Vite server failed because an unfinished Git merge left conflict markers
in six files. `<<<<<<< HEAD` is a Git separator, not TypeScript. Removing only the
first reported marker would have exposed the next affected module.

The repair is in `C:\Users\Mamad\Sinaxe\TaxflowOS`, branch `DevBranch`. At the start
of this turn, HEAD was `1c249c1` (the existing Mkoro checkpoint) and the pending
merge target was `4d615024`. Both Git stages were inspected before resolving
content. The existing staged changes, asset updates/deletions, configuration and
other work were preserved. A pre-repair copy of the conflicted files, Git status,
index listing and diffs is at
`C:\Users\Mamad\AppData\Local\Temp\inscope-conflict-fix-n208v57d`.

## Files changed by this repair

| File                                                                                                                 | Purpose and before/after behavior                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [workflow-session-store.ts](../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-store.ts)   | Owns the browser's selected session and inspection context. Before: conflict separators prevented compilation. After: valid TypeScript retains existing session execution and the incoming inspection atom. No calculation or permission-rule change is intended.                                       |
| [workflow-session-panel.tsx](../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx) | Renders the guided workflow controls. Before: unresolved import, handler and button conflicts prevented compilation. After: existing run controls coexist with the incoming exact-run/block navigation to Build. No inspection-triggered execution is introduced.                                       |
| [use-session-tools.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx)            | Adapts session commands and inspection to Sina. Before: unresolved imports and render branches prevented compilation. After: existing execution grants/revision checks remain, with the incoming read-only historical-inspection branch. The repair preserves both behaviors rather than replacing one. |
| [playwright.reliability.config.mjs](../playwright.reliability.config.mjs)                                            | Selects reliability browser tests. Before: conflicting lists made the config invalid. After: Mkoro, workflow-session and workflow-traceability tests are all selected, with the other existing cases retained. No application behavior change is intended.                                              |
| [workflow-sessions.test.ts](../tests/core/workflow-sessions.test.ts)                                                 | Verifies session and inspection invariants. Before: Git markers made the test file invalid. After: existing session tests and the incoming immutable historical-inspection test remain executable, with unchanged assertions. No application behavior change is intended.                               |
| [unified-workflow-execution.md](../docs/unified-workflow-execution.md)                                               | Describes workflow execution and exact-run inspection. Before: the incoming inspection section was enclosed in conflict markers. After: both execution and inspection descriptions remain readable and accurate. No product-policy or runtime behavior change is intended.                              |
| [This report](./merge-conflict-startup-review.md)                                                                    | Records scope, evidence and limitations. New documentation only; no application behavior change.                                                                                                                                                                                                        |

The incoming inspection feature itself, toolchain changes, authentication changes,
Docker configuration and earlier Mkoro implementation were already present in the
pending merge. They are not newly authored by this repair. The product blueprint
and architecture ownership remain accurate; their intended rules were not changed.

## Runtime findings

Docker's web and API containers mount this repository at `/app`. The local
frontend is `http://localhost:5173`, API `http://localhost:5050`, and database
`localhost:5433`. They were already running. Docker must be running and the
containers started before those endpoints work. Replit has its own environment,
credentials, database and deployed source; `localhost` does not address Replit.

The pending merge pins pnpm 10.26.1, while the existing Docker image still contains
10.33.2. The initial native doctor attempt was rejected for that mismatch. An
isolated pnpm 10.26.1 launcher using the existing Node 24.21.0 was prepared outside
the repository, and doctor then passed. No global runtime or repository dependency
installation was changed. Existing Docker containers were not rebuilt or restarted
by this repair; a future rebuild is needed to adopt the merged image version.

## Verification

- The three formerly broken frontend modules returned HTTP 200 through the actual
  Docker Vite server after repair, with no conflict markers.
- A fresh headless browser reached the actual local sign-in screen with no Vite
  error overlay and no page JavaScript errors. The first probe checked before
  sign-in had rendered; a second probe waited for the visible Try demo button and
  confirmed the sign-in screen. No account was created and no real task executed.
- Conflict-marker scanning and `git diff --check` passed. Formatting of the six
  repaired files passed.
- `pnpm run verify` passed with Node 24.21.0 and pnpm 10.26.1: toolchain,
  contracts, architecture, formatting, all application/test type checks,
  **70 unit tests**, **22 Mkoro companion tests**, and **23 workflow-core tests**.
- An independent review against both Git stages found no lost execution behavior
  or test coverage. The reliability configuration contains ten unique specs,
  including Mkoro, session execution and traceability exactly once each.
- Focused browser checks passed **7/7**: the five Mkoro cases, guided session
  continuity/source history, and exact paused-run/historical-attempt inspection
  in Build. The browser run uses synthetic sources and mocked workflow writes;
  it does not verify a paid model, Google account or production persistence.
  Logs are [verify](./merge-conflict-verify.log) and
  [browser](./merge-conflict-browser.log); they are evidence only. No production
  build, deployment or live-provider test is claimed for this source-conflict
  repair.

No staging, merge completion, commit, push or deployment was performed. Git's
index still marks the six paths unmerged even though their working-file content
is repaired. Finishing that Git operation remains separate from running the app.
