# Mkoro automatic approval and desktop-view recovery — 2026-09-29

## Outcome and scope

The user requested automatic approval of Mkoro tools and a fix for the missing
desktop view. The owning modules are the Mkoro API, computer settings and the
Windows companion distribution. The saved setting is personal to one computer;
new connections default to manual approval. Existing pending one-action requests
are included when automatic approval is enabled. Browser, file and shell actions
within delegated tasks are covered. Stop and current membership checks remain.
No new task is started by changing the setting.

The server logs showed viewer reads/leases but no authenticated screenshot uploads.
The relay's old downloadable bundle lacked capture.mjs, capture-windows.ps1 and
delegation.mjs. The Surface's actual installed files were not accessible from this
Asus session, so that finding is not proof of the precise remote failure. The
complete replacement bundle and a local capture diagnostic are now available.

## Git scope and file meanings

At the start, six files already carried the earlier connection-menu changes.
Those changes were preserved. No commit, push or merge was performed.

Paths below are relative to the repository root. Each row describes this task's
change, rather than attributing the whole mixed diff to this task.

| File                                                                        | Purpose and before/after behavior                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| artifacts/api-server/src/lib/mkoro/automatic-approval.ts                    | New server policy handler. Before: every offered tool decision waited for a click. After: opted-in computers receive offered allow_once decisions during authenticated polling, recorded once under locks; stopped tasks and permanent-only choices are excluded. |
| artifacts/api-server/src/lib/mkoro/workers.ts                               | Personal computer listing/settings and command polling. Adds saved approval mode to reads and invokes the policy handler before delivering commands.                                                                                                              |
| artifacts/api-server/src/routes/mkoro.ts                                    | Adds PATCH /workers/:id/approval as an execution-authorized write. Only the current actor's non-revoked computer can be changed.                                                                                                                                  |
| lib/api-zod/src/mkoro.ts                                                    | Adds strict settings input and an optional worker response field for compatibility. Older responses remain readable as manual mode.                                                                                                                               |
| lib/db/src/schema/mkoro.ts                                                  | Describes the worker setting and manual/automatic decision provenance. Existing decisions remain manual.                                                                                                                                                          |
| lib/db/migrations/0008_mkoro_automatic_approval.sql                         | Adds the two columns and decision-source constraint. Existing rows are preserved and existing computers default to manual mode.                                                                                                                                   |
| lib/db/migrations/meta/_journal.json                                        | Registers the new migration after 0007. Applied migration files were not changed.                                                                                                                                                                                 |
| artifacts/ai-workflow-builder/src/features/assistant/mkoro/use-mkoro.ts     | Adds the settings write using the existing authenticated API and refresh/error handling.                                                                                                                                                                          |
| artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-panel.tsx  | Earlier reconnect changes preserved. Adds the saved automatic-approval checkbox with explicit scope, pending-request behavior and Stop guidance.                                                                                                                  |
| artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-screen.tsx | After 15 seconds without a frame, the viewer gives companion/relay diagnostic guidance instead of continuing a generic waiting message. It never substitutes an image.                                                                                            |
| scripts/mkoro/check-screen.mjs                                              | New local capture diagnostic. Prints only dimensions/success or a failure message, then discards pixels. No saved or uploaded screenshot.                                                                                                                         |
| tests/integration/mkoro.test.mjs                                            | Adds real-session/disposable-database coverage for opt-in, owner isolation, Viewer denials and path variants, invalid input, concurrent poll deduplication, audit provenance, disable, Stop and revoked workers. No product behavior change intended by tests.    |
| e2e/mkoro-chat.spec.ts                                                      | Earlier reconnect tests preserved. Adds saved-mode toggle/reload and missing-frame guidance tests. No product behavior change intended by tests.                                                                                                                  |
| docs/product/decisions.md                                                   | Records the user's approval-policy change and its bounded implementation. Documentation only.                                                                                                                                                                     |
| docs/ARCHITECTURE.md                                                        | Records server ownership, locking and migration. Documentation only.                                                                                                                                                                                              |
| docs/FUNCTIONALITY.md                                                       | Updates the capability summary and capture-diagnostic limits. Documentation only.                                                                                                                                                                                 |
| docs/mkoro-connection.md                                                    | Adds mode usage, screenshot recovery and complete-bundle instructions. Documentation only.                                                                                                                                                                        |
| scripts/mkoro/README.md                                                     | Explains server-managed one-action approvals and local capture checks. Documentation only.                                                                                                                                                                        |
| test-results/mkoro-automatic-approval-review.md                             | This plain-language change and verification record. No runtime behavior change.                                                                                                                                                                                   |

The previously modified mkoro.css and new mkoro-pairing.tsx are unchanged in this
task; they still implement the earlier reconnect menu and pairing instructions.

## Local operations outside Git

- Saved a database backup at .cache/mkoro-before-0008-20260929.dump; applied
  migration 0008 through the committed migrator. All nine migrations are applied.
- Rebuilt/restarted the local API through its existing Compose development command.
- Enabled auto_approve only for the uniquely matched online Mkoro-MAMADOU row with
  current Owner/Editor membership. The older offline row remains manual.
- Updated the distribution under C:/Users/Mamad/Mkoro/connection-20260928/laptop
  with the complete current runtime: companion.mjs, worker.mjs, acp-client.mjs,
  delegation.mjs, capture.mjs, capture-windows.ps1, check-screen.mjs and README.md.
- Updated start-mkoro.ps1 to check capture/delegation files and explain pairing reuse;
  added Check-MkoroScreen.cmd to run the diagnostic using bundled Node. Rewrote
  README.txt with Surface update steps that preserve existing pairing and startup options.
- Rebuilt mkoro-laptop.zip. Verified required files and Node are included; the
  public download returns 200. The old bundle and launcher are backed up in .cache.
- The public relay URL and its endpoint restrictions remain unchanged.

## Verification and remaining limits

- pnpm run verify: passed, including 89 unit, 34 companion and 23 workflow-core tests.
- Focused Mkoro integration suite: 13 passed with disposable data and real sessions.
- Database migration suite: 4 passed (fresh, repeatable/checksummed upgrades and
  legacy baseline preservation).
- Mkoro browser checks: 14 passed in the main run; one toggle test initially failed
  because it expected an immediate checkbox update before the server saved it.
  Changed the test interaction to click and await the same saved-state assertions.
  The focused retest passed, including reload and disabling. All 15 cases passed
  across these runs; the missing-screenshot guidance test passed in the main run.
- Workflow storage-recovery browser suite: 2 passed with disposable data.
- Pinned-toolchain doctor, document link checks and git diff --check: passed.
- Local API health: 200. Unauthenticated screenshot uploads: 401 JSON as expected.
- One Windows computer-use discovery attempt timed out; no UI inputs were sent.
- The Surface went offline during this work. Its saved setting is enabled, but
  it needs the complete updated companion installed/restarted. Real screenshot
  capture and a live Goose task remain unverified until that happens.

Disabling automatic approval cannot undo an action already approved. Automatic
approval does not make generic Goose browser/shell tools an OS sandbox. Existing
history, task binding and desktop opt-in behavior remain unchanged.
