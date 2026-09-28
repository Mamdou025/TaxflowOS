# Mkoro companion connection: review record

Mkoro now has its own chat inside Inscope, alongside Sina. A separately started
companion on the user's computer runs Goose, receives messages from Inscope, and
returns text, tool activity and permission requests. This is an attended first
version: the computer and companion must remain running. It does not require the
Goose desktop window, but does require a compatible, configured Goose CLI.

This report describes the Mkoro changes only. No commit, push, merge or deployment
is part of this work. A deployed site will not acquire the feature until these
changes and the new database migration are deployed through the normal process.

## What was already present

The working tree was already substantially changed before Mkoro implementation.
The starting Git status, diff and copies of shared files were saved in
`C:\Users\Mamad\AppData\Local\Temp\codex-mkoro-baseline-di8_5386`.
The file inventory below was checked against the current Git status and that
baseline. For shared files, descriptions cover the additional Mkoro changes,
not the complete difference from the last Git commit.

Existing workflow-session execution, workbook import/parsing, source selection,
agent request-size handling, workflow storage/access tests and their documentation
were preserved. In particular, the existing changes to workflow-core,
workflow-contracts, assistant workflow tools, authentication provider, workbook
parsing and the earlier workflow browser tests are not Mkoro implementation.
Previously generated release archives, patches, logs and downloaded inspection
files in `test-results` are also unrelated to this feature.

Some shared files were already modified: `artifacts/api-server/src/app.ts`,
`lib/api-zod/package.json`, `docs/ARCHITECTURE.md`, `docs/FUNCTIONALITY.md`, and
`playwright.reliability.config.mjs`. Their earlier work remains in place. For
example, the existing `agent-requests` export and `workflow-session.spec.ts`
selection were not introduced by Mkoro.

## User-visible behavior and acceptance boundaries

- Chat offers Sina and Mkoro tabs. Switching preserves each assistant's draft;
  New chat acts on the selected assistant. Sina's existing agent implementation
  continues to own Sina conversations and tools.
- An Owner or Editor can create a ten-minute, one-use pairing code. The companion
  exchanges it for its own revocable credential. Computers and conversations
  belong to one account in one workspace; another member cannot use them by
  supplying their IDs.
- Mkoro displays saved conversations, streamed text, bounded tool details,
  separate pending permission requests, offline/error states and Stop requests.
  Only offered one-time permission decisions are accepted.
- One prompt can be active per companion. Commands are delivered once. A lost
  response does not automatically replay a prompt or repeat an external action.
  Progress delivery can retry because repeated event IDs are checked and
  deduplicated.
- Stop remains a request until the worker acknowledges it, except for a queued
  prompt that the server can prove was never delivered. Already performed actions
  are not undone. An ended Goose turn does not independently prove that an
  external workflow succeeded.
- Workflow definitions, calculation, version selection, validation and review
  rules remain with the existing workflow modules. Mkoro does not add another
  implementation of those rules.

## Frontend files

| File                                                                                                                                    | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [chat-agents.tsx](../artifacts/ai-workflow-builder/src/features/assistant/mkoro/chat-agents.tsx) — new                                  | Provides the assistant tabs and accessible keyboard selection. Before: no Mkoro chat adapter existed. After: the existing Sina panel stays mounted, Mkoro loads when first selected, and both panels preserve their local state when hidden.                                                                                                                                   |
| [mkoro-panel.tsx](../artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-panel.tsx) — new                                  | Provides computer selection, pairing instructions, saved chats, message composer, Stop and history controls. Before: the frontend could not connect or message a local companion. After: it exposes those actions, disables sending when connection status is unverified/offline or a turn is active, and shows setup and error information.                                   |
| [use-mkoro.ts](../artifacts/ai-workflow-builder/src/features/assistant/mkoro/use-mkoro.ts) — new                                        | Owns validated API requests, polling and the selected Mkoro conversation. Before: no Mkoro browser state or transport existed. After: it polls status, uses account/workspace-scoped selection, retains request IDs for ambiguous send retries, merges earlier event pages, and reloads a contiguous recent page when a long disconnection would otherwise leave a silent gap. |
| [mkoro-turn.tsx](../artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-turn.tsx) — new                                    | Renders one user prompt and its observable results. Before: there was no Mkoro turn view. After: messages, tools, errors, cancellation and each pending approval are shown separately. Tool/model text is rendered as text; completion wording does not certify external success.                                                                                              |
| [mkoro-transcript.ts](../artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-transcript.ts) — new                          | Converts ordered events into transcript items. Before: no Mkoro event projection existed. After: message fragments combine in order, updates amend the corresponding tool card, failures remain visible, and reported artifact paths remain display text rather than executable HTML or automatic navigation.                                                                  |
| [mkoro.css](../artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro.css) — new                                              | Styles the tabs, connection status, transcript, approval cards and composer. Before: Mkoro had no presentation styles. After: the new controls fit the chat layout. This file changes presentation; it does not change permissions or execution rules.                                                                                                                         |
| [copilot-workspace-panel.tsx](../artifacts/ai-workflow-builder/src/features/assistant/workspace/copilot-workspace-panel.tsx) — modified | Integrates the new tabs into the existing chat workspace. Before: the chat body and New chat action addressed Sina only. After: the selected assistant is remembered within the existing account/workspace storage boundary, New chat targets that assistant, and opening Sina history selects Sina. The existing Sina thread is passed through the new wrapper.               |

## Backend and shared contract files

| File                                                                                   | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [common.ts](../artifacts/api-server/src/lib/mkoro/common.ts) — new                     | Supplies Mkoro transaction handling, error types and scope/status helpers. Before: no companion persistence helpers existed. After: related database changes can commit together or roll back, and errors have explicit API status codes.                                                                                                                                                                                        |
| [workers.ts](../artifacts/api-server/src/lib/mkoro/workers.ts) — new                   | Owns pairing, worker authentication, connection status, revocation and command delivery. Before: the API had no local-companion identity. After: high-entropy pairing/bearer credentials are hashed on the server, pairing is single-use, current membership is checked on worker requests, and pending commands are claimed once.                                                                                               |
| [tasks.ts](../artifacts/api-server/src/lib/mkoro/tasks.ts) — new                       | Owns personal conversations, prompt turns, history and decisions. Before: no durable Mkoro task model existed. After: messages have idempotency keys, one active turn per computer is enforced, event history is paged, multiple approvals stay distinct, and Stop/approval transitions lock and recheck the task before changing it.                                                                                            |
| [events.ts](../artifacts/api-server/src/lib/mkoro/events.ts) — new                     | Accepts worker progress and applies task state transitions. Before: no authenticated Mkoro event ingestion existed. After: task ownership, event ordering, payload limits and duplicate identity are checked before atomically storing a batch. A permission event buffered just before Stop is still recorded, allowing the later cancellation acknowledgement through; it cannot be approved after cancellation was requested. |
| [mkoro.ts route](../artifacts/api-server/src/routes/mkoro.ts) — new                    | Exposes browser-facing companion and chat operations under `/api/mkoro`. Before: those endpoints were absent. After: authenticated users can read their own history and permitted users can pair, send, stop, decide permissions and revoke. Responses are marked non-cacheable.                                                                                                                                                 |
| [mkoro-worker.ts route](../artifacts/api-server/src/routes/mkoro-worker.ts) — new      | Exposes pairing, polling and event delivery for the local process. Before: a computer had no supported outbound transport. After: it exchanges a pairing capability and then authenticates with a bearer token; remote requests cannot supply a shell launch command or select a local executable/working directory.                                                                                                             |
| [app.ts](../artifacts/api-server/src/app.ts) — modified, shared with prior work        | Mounts the worker router before cookie-only authentication because the companion uses its own token. Before this addition: every relevant application route required the browser session path. After: only the worker route uses its separate authentication and bounded JSON body; the browser API keeps its existing session and origin checks. Existing request-body and other prior edits were preserved.                    |
| [routes/index.ts](../artifacts/api-server/src/routes/index.ts) — modified              | Registers the browser Mkoro router with the existing application router. Before: `/api/mkoro` was unavailable. After: it participates in the normal authenticated workspace API.                                                                                                                                                                                                                                                 |
| [security/access.ts](../artifacts/api-server/src/security/access.ts) — modified        | Declares non-read Mkoro browser routes to be execution operations. Before: no Mkoro-specific operation classification existed. After: Viewer mutation/execute requests are denied, including case and trailing-slash variants handled by existing path normalization.                                                                                                                                                            |
| [mkoro.ts contract](../lib/api-zod/src/mkoro.ts) — new                                 | Defines validated commands, events, workers, conversations, tasks and pending permissions shared by API and UI. Before: no common Mkoro interface existed. After: both sides enforce the same status names, IDs and bounded payload shapes. It includes explicit history truncation and connection-loss fields.                                                                                                                  |
| [api-zod/package.json](../lib/api-zod/package.json) — modified, shared with prior work | Adds the `@workspace/api-zod/mkoro` export so API and frontend can import those contracts. Before: the subpath did not resolve. After: it resolves to the new contract file. No separate user behavior or dependency/version change is intended by the export itself; the prior `agent-requests` export is preserved.                                                                                                            |

## Database files

| File                                                                            | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [0006_mkoro_companion.sql](../lib/db/migrations/0006_mkoro_companion.sql) — new | Adds durable tables for workers, pairing codes, conversations, tasks, commands, events and permission decisions. Before: these records had no database representation. After normal migration: they survive API restarts, enforce ownership references and uniqueness, and restrict each worker to one active task. No applied migration was rewritten, and no runtime table creation was added. |
| [migration journal](../lib/db/migrations/meta/_journal.json) — modified         | Registers migration 0006 after the existing migrations. Before: the normal runner did not know about the new tables. After: normal migration execution includes them. Existing migration entries remain intact; the registration adds no separate product policy.                                                                                                                                |
| [schema/mkoro.ts](../lib/db/src/schema/mkoro.ts) — new                          | Describes the companion tables to the typed database layer. Before: those tables had no schema declarations. After: their columns and relationships are represented alongside the existing schema. The declaration itself does not perform database changes; the migration does.                                                                                                                 |
| [schema/index.ts](../lib/db/src/schema/index.ts) — modified                     | Exports the new schema. Before: database consumers could not import it from the normal package entry point. After: they can. No independent user-visible behavior change is intended.                                                                                                                                                                                                            |

## Local companion files

All seven files below are new. No prior Goose/local-companion implementation was
replaced, and no new package dependency was introduced for the companion.

| File                                                        | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [companion.mjs](../scripts/mkoro/companion.mjs)             | Provides the local command-line entry point. Before: there was no process to pair a computer with Inscope. After: it validates local startup options, prepares an isolated Goose profile, privately prompts for pairing, saves local credentials/session mappings, prevents two processes sharing one state file, polls the server and stops on sustained connection/authentication failure.                                                                                                            |
| [acp-client.mjs](../scripts/mkoro/acp-client.mjs)           | Starts Goose directly and speaks ACP over standard input/output. Before: no Goose protocol bridge existed. After: requests and responses are correlated, input is bounded, process/protocol failures are explicit, permission requests are forwarded rather than approved automatically, and raw Goose stderr is not forwarded to Inscope. The executable and folder come from local configuration, with no shell interpolation.                                                                        |
| [worker.mjs](../scripts/mkoro/worker.mjs)                   | Maps delivered tasks to Goose sessions and converts observable progress into API events. Before: Inscope could not drive a Goose conversation. After: it enforces approval mode before prompts, handles independent one-time permissions and cancellation, retains stable event IDs on transport retry, and never automatically replays a prompt. It filters private thoughts/images, bounds previews, and reserves the last allowed event for an explicit failure if a turn exhausts its event budget. |
| [acp-client.test.mjs](../scripts/mkoro/acp-client.test.mjs) | Adds protocol tests for process startup, split UTF-8, concurrent response IDs, manual permission handling and failures. Before: this bridge had no tests. After: those transport guarantees are checked using synthetic streams. No application behavior change is intended by the test file.                                                                                                                                                                                                           |
| [companion.test.mjs](../scripts/mkoro/companion.test.mjs)   | Adds startup/state tests, including rejecting command-line tokens, preserving configuration without inherited permanent grants, atomic state writes and process locks. Before: these local setup cases were unchecked. After: they are exercised with temporary local fixtures. No application behavior change is intended by the test file.                                                                                                                                                            |
| [worker.test.mjs](../scripts/mkoro/worker.test.mjs)         | Adds execution-bridge tests for manual approval, parallel requests, cancellation, duplicate commands, event retry, event limits, exact session restoration, rejected mode changes and restricted transport. Before: these semantics had no regression tests. After: fake ACP/HTTP transports exercise them without a paid model or external action. No application behavior change is intended by the test file.                                                                                        |
| [README.md](../scripts/mkoro/README.md)                     | Documents installation, local credentials/profile copies, permissions, working-directory limits, compatibility, recovery and unsupported features. Before: no companion reference existed. After: an operator can configure and inspect the bridge with its limitations stated. Documentation only; no runtime behavior change is intended.                                                                                                                                                             |

## Application tests and verification configuration

| File                                                                                                         | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [mkoro.test.mjs](../tests/integration/mkoro.test.mjs) — new                                                  | Adds real-session/disposable-Postgres coverage of authentication, Viewer denials, ownership, pairing expiry/single use, hashed credentials, command delivery, idempotency, restart persistence, parallel permissions, history pages, offline state, cancellation and membership changes. Before: no companion API integration coverage existed. After: eight scenarios check these guarantees, including the buffered-permission cancellation race. No production behavior change is intended by the tests. |
| [mkoro-transcript.test.ts](../tests/unit/mkoro-transcript.test.ts) — new                                     | Checks text ordering, separation of tools and replies, partial/failed actions and treatment of untrusted HTML/navigation-like output as text. Before: the new projection had no focused regression tests. After: these rendering semantics are independently asserted. No application behavior change is intended by the test file.                                                                                                                                                                         |
| [mkoro-chat.spec.ts](../e2e/mkoro-chat.spec.ts) — new                                                        | Adds browser tests for tab/draft preservation, pairing UI, progress, permissions, Stop acknowledgement, failed/invalid status responses and saved-chat reload. Before: no Mkoro browser coverage existed. After: five synthetic-API cases check the UI without controlling a real computer. No production behavior change is intended by the tests.                                                                                                                                                         |
| [production-ui.mjs](../tests/smoke/production-ui.mjs) — modified                                             | Extends the production-bundle smoke check with lazy Mkoro opening, offline send prevention and Sina draft preservation, with empty synthetic worker/chat responses. Before: this check covered the existing deferred screens only. After: it also checks the new chat entry point. No production behavior change is intended by this test edit.                                                                                                                                                             |
| [package.json](../package.json) — modified                                                                   | Adds `test:mkoro-worker` and includes it in `verify`. Before: the standard verification command did not exercise the companion. After: companion tests participate in it. This changes the development check sequence; no application behavior, dependency upgrade or new dependency is intended.                                                                                                                                                                                                           |
| [maintained-paths.mjs](../scripts/maintained-paths.mjs) — modified                                           | Adds the new Mkoro source directories/contracts/routes to maintained formatting coverage. Before: these new paths were outside the explicit list. After: the normal formatting check includes them. No application behavior change is intended.                                                                                                                                                                                                                                                             |
| [playwright.reliability.config.mjs](../playwright.reliability.config.mjs) — modified, shared with prior work | Adds `mkoro-chat.spec.ts` to the reliability suite. Before this addition: the suite did not select the new browser test. After: it does. The already-present workflow-session selection remains. No application behavior change is intended.                                                                                                                                                                                                                                                                |

## Documentation and semantic summaries

| File                                                                            | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ARCHITECTURE.md](../docs/ARCHITECTURE.md) — modified, shared with prior work   | Adds the Mkoro ownership boundary: browser adapter, cookie API, bearer worker API, local Goose execution and personal workspace scope. Before: the current-implementation summary omitted this new path. After: it identifies the owners and points to the detailed guide while retaining existing workflow ownership. Documentation only; no runtime behavior change is intended. |
| [FUNCTIONALITY.md](../docs/FUNCTIONALITY.md) — modified, shared with prior work | Adds what the two chat tabs support and the limits of the first companion version. Before: the functionality inventory omitted Mkoro. After: it distinguishes visible chat/tool activity from desktop streaming, automatic file transfer and independently verified workflow success. Documentation only; no runtime behavior change is intended.                                  |
| [DEVELOPMENT.md](../docs/DEVELOPMENT.md) — modified                             | Adds the optional companion setup and migration dependency. Before: development instructions did not mention the separately running process. After: they explain that the normal application and mocked tests do not require Goose credentials, and link to setup. Documentation only; no runtime behavior change is intended.                                                     |
| [TEST.md](../TEST.md) — modified                                                | Lists companion, browser and integration commands and their real/synthetic boundaries. Before: the test guide did not describe Mkoro coverage. After: it identifies what is checked and what still needs a live test. Documentation only; no runtime behavior change is intended.                                                                                                  |
| [mkoro-connection.md](../docs/mkoro-connection.md) — new                        | Provides the user/developer setup guide, ownership map, permission model, recovery path, bounded history and manual acceptance steps. Before: no Inscope-side Mkoro guide existed. After: its setup and limits are reviewable in one place. Documentation only; no runtime behavior change is intended.                                                                            |
| [this review record](./mkoro-connection-review.md) — new                        | Records the task-owned file changes, preserved work, verification and practical limits. Before: there was no file-level Mkoro handoff. After: the implementation can be reviewed in plain language. Documentation only; no runtime behavior change is intended.                                                                                                                    |

The affected current-implementation summaries were updated rather than changing
the product blueprint to match the code. The existing workflow ownership and
computation/review/persistence distinctions remain accurate. Pending product
decisions in the decision register were not converted into approved defaults.

## Sensitive changes, assumptions and downstream effects

The companion can use the tools configured in the local Goose installation.
The working folder is a starting directory, not an operating-system sandbox.
Goose tools retain the computer user's permissions. Pairing therefore connects
an account/workspace to a computer the user intentionally makes available.

The server stores conversation text, tool activity and approval previews. Its
pairing and worker credentials are stored as hashes. The companion must keep its
bearer credential locally to reconnect; that state is not encrypted by this
program. Its private Goose profile copies configured model/extension settings
and, when present, file-based provider credentials locally. Those provider
credential files are not sent to Inscope. Windows file protection also depends
on the user profile's existing ACLs.

The private profile starts without saved permanent permission grants, and each
turn requires acknowledged approval mode. Preview redaction is best effort,
not a guarantee that arbitrary output contains no secret. Permissions are
single-action choices; silence grants nothing. Membership and token revocation
are checked on subsequent requests, and cannot undo external side effects.

Deployment needs migration 0006 before this feature's API can operate. The
companion requires a Goose CLI with the ACP methods and approval mode used here,
plus a configured model and appropriate extensions. Pairing does not install
browser tools, transfer a Google login or import a desktop recipe. Browser/Drive
work and the Drive-to-FAPI workflow remain separate live acceptance checks.

This implementation deliberately keeps Sina and Mkoro as separate conversations;
there is no automatic agent-to-agent delegation or shared long-term memory added
in this change. It provides structured text/tool/permission cards, not arbitrary
generated application UI, embedded Goose Apps, desktop video or remote file
downloads. Reported file paths do not transfer the files.

History initially loads the latest 500 events and can retrieve earlier activity.
Only the latest 100 conversations and 100 turns per conversation are currently
exposed; older turns remain stored. Each turn has a 10,000-event cap and bounded
payloads. A companion crash can lose buffered progress and leave a delivered
turn's outcome uncertain. Automatic replay is prohibited. The setup guide
documents inspection and re-pairing when an interrupted turn cannot be reconciled.

## Verification recorded so far

Checks use the repository-pinned Node 24.21.0 and pnpm 10.33.2 through a task-local
PATH. Docker-backed tests use their own disposable databases and real sessions;
they were not run against shared or production data. Early focused-test invocation
issues involving toolchain context and Docker PATH were corrected in the task
shell, without changing the machine's global runtime.

| Check                                                     | Recorded result and boundary                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full integration suite                                    | **45 passed**, reported by the coordinating agent. This completed before the final buffered-permission cancellation adjustment.                                                                                                                                                                                                                            |
| Final focused Mkoro integration run                       | **8 passed, 0 failed** after that adjustment. Covers the final backend change, including refusal to approve a late permission after Stop and successful cancellation acknowledgement. Final run took about 210 seconds while other checks were active.                                                                                                     |
| Companion worker/protocol/startup tests                   | **22 passed**, reported by the companion implementation agent after aligning the event cap and terminal-event handling. Synthetic ACP/HTTP and temporary local files only.                                                                                                                                                                                 |
| Mkoro browser tests                                       | **5 passed**, reported by the coordinating agent. Uses synthetic API responses, not a live Goose/browser account.                                                                                                                                                                                                                                          |
| Final `verify`, production builds and production UI smoke | **Passed; see final verification addendum.** Initial verification encountered formatting while concurrent edits were in progress, then an unresolved root-test package type import. Formatting was corrected and the test now imports the same contract type by a relative path; no contract or assertion was weakened. The final verification run passed. |
| Workflow persistence regression                           | **6 passed, 2 failed. Both failures are pre-existing demo startup/resume wording mismatches.** The test expects “app service is not ready”, while the provider says “The app service is temporarily unavailable. Please retry.” All six other cases passed; neither failed assertion was weakened.                                                         |

The persistence wording mismatch predates Mkoro. The saved baseline
`git-diff.patch` already contains the provider wording change at lines 1747–1750.
That evidence was checked against the baseline; the unrelated provider and
existing test were not edited to make this check pass. The final persistence
result belongs in the addendum below.

The current Git status also includes these newly generated verification logs.
Each was absent from the Mkoro starting baseline and is evidence only, with no
intended application behavior change:

| Log                                                            | Purpose                                 |
| -------------------------------------------------------------- | --------------------------------------- |
| [mkoro-integration.log](./mkoro-integration.log)               | Full integration command output.        |
| [mkoro-browser.log](./mkoro-browser.log)                       | Mkoro browser suite output.             |
| [mkoro-browser-screenshot.log](./mkoro-browser-screenshot.log) | Browser capture/check output.           |
| [mkoro-verify.log](./mkoro-verify.log)                         | Standard verification command output.   |
| [mkoro-typecheck.log](./mkoro-typecheck.log)                   | Type-check command output.              |
| [mkoro-api-build.log](./mkoro-api-build.log)                   | API production-build output.            |
| [mkoro-frontend-build.log](./mkoro-frontend-build.log)         | Frontend production-build output.       |
| [mkoro-persistence.log](./mkoro-persistence.log)               | Workflow persistence regression output. |

No paid-model prompt, real Google account, real file-production task or real
Goose-driven browser workflow was exercised by the automated checks described
here. Their success verifies the bridge's tested contracts and UI behavior;
live model, extension, browser authentication and external-task outcomes still
require the harmless manual acceptance test in the setup guide.

## Final verification addendum

The final `pnpm run verify` passed (exit 0): pinned toolchain, contract generation
check, architecture check, maintained formatting, workspace and test types,
**70 unit tests**, **22 companion tests**, and **22 workflow-core tests**.
The earlier new-test import error and concurrent-format warnings were corrected;
no test assertions, role checks or performance budgets were weakened.

Both the API and frontend production builds passed. The frontend emitted
sourcemap-reporting, browser-externalization and large-chunk warnings in existing
modules. Its Mkoro bundle includes the final folder-creation setup instruction.

`pnpm run test:production-ui` passed, including Mkoro's actual lazy production
bundle, offline state, switching back to Sina with its draft intact, and the
existing navigation checks. [Production smoke log](./mkoro-production-ui.log).
The additional screenshot-focused Mkoro browser run passed **1/1**. The
[preview](./phase2/04a727d1-a6ec594c-65e2-4321-bdd9-ecf3575112be/artifacts/mkoro-chat-Mkoro-shows-too-52b45-waits-for-stop-confirmation/mkoro-online-permission.png)
was visually inspected at 1440 × 1000: transcript, tool output, permission buttons
and Stop fit without clipping. It uses synthetic data, not a real paired computer.

`pnpm run performance:check` **failed** the existing largest-bundle limits:
Mermaid is 3,417,342 raw bytes against 1,900,000 and 1,006,156 gzip bytes against
560,000. Initial JavaScript/CSS and canvas budgets passed. The pre-task
`chat-start-build-v2.log` already records a 3,417.33 kB Mermaid bundle; this is
not a new Mkoro bundle-size regression. The limits remain unchanged.
[Performance log](./mkoro-performance.log).

The two additional logs above and the screenshot/report artifacts are verification
evidence only; they introduce no application behavior. Documentation/report
formatting checks and `git diff --check` passed (Git additionally reported existing
CRLF normalization warnings in unrelated files).

The complete `pnpm run test:workflow-persistence` run finished with **6 passed,
2 failed**. Both failures expect the old startup error wording in
`e2e/demo-access.spec.ts` and `e2e/demo-resume.spec.ts`; the changed wording is
present in the pre-task baseline. The six passing cases cover direct demo
recovery, a real saved demo run, browser recovery/backups/conflicts, a one-megabyte
saved payload, membership/revocation and account/workspace isolation. This suite
is not claimed green. No unrelated product code or expected result was changed.

No real Goose pairing, paid model prompt, Google login or Drive-to-FAPI execution
was performed. No commit, push or deployment was made. The new migration was
exercised only in disposable test databases.
