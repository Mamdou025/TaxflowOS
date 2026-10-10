# assistant-ui conversation foundation

This change replaces the hand-maintained conversation and composer rendering with
assistant-ui primitives while retaining the application's workflow, source, agent
and persistence owners. It implements the user's authorized frontend integration
after restoration of the [FAPI reference presentation](fapi-reference-restoration.md).
It is a local implementation record, not a deployment or live-provider certificate.

## Ownership and behavior

`useExternalStoreRuntime` reads the existing CopilotKit agent messages. The
adapter projects text, stable IDs and exact tool-call/result pairs for display;
CopilotKit remains the only tool executor. Existing action renderers still supply
approval forms, recorded tool receipts, workflow links and generated views.
Instructions and readable context continue to reach the model even though the
`CopilotChat` visual component no longer mounts.

assistant-ui provides the composer draft/attachment state, message primitives,
Markdown, scrolling and message-copy controls. Application controls retain the
current branding, Scope cluster, modes, menus, source/workflow choices and
Sina/MicroSina selection. Stop uses the existing remote stop/detach operation; sending a
follow-up waits for that operation. Retry is offered only for a failed text turn
without a subsequent tool call or result. It preserves earlier completed exchanges
and the original user message. This restriction is important because replaying a
tool-containing turn could repeat a change or external action.

Below 768px, the workspace sidebar starts as its existing icon rail. Expanding it
opens a temporary overlay that closes through the fold control, Escape, an outside
click or selecting navigation/history. The chat keeps its width and mounted state;
mobile expansion does not overwrite the saved desktop sidebar preference. The
existing page/chat split remains unchanged: simultaneous page and chat layouts are
still constrained on narrow screens and need a separate mobile navigation design.

The application still owns conversation navigation and `/api/chat/threads`
persistence. No assistant-ui Cloud service, database migration or replacement
memory system is introduced. A stable view-only workflow row preserves the
shared panel at its opening receipt through follow-up messages. It never enters
the provider request or persisted chat rows. Calculation rules, source revisions,
input validation, historical runs and approval gates remain with their existing
workflow owners.

Files remain in the composer until Send, then pass through the existing source
and document adapters. A conversation epoch guards asynchronous attachment work
against navigation to another chat. Changing the UI foundation does not bypass
workbook mapping or create alternative calculation inputs. A nonblocking
connecting/unavailable notice describes the agent connection. File preparation
still runs when chat is unavailable; model submission requires the current ready
agent and preserves the draft/files on failure. Actual import status is reported
separately from successful model submission. Known user image parts
can be projected into display parts, but the existing persisted message codec is
still text/tool oriented: image attachment delivery, rendering and restored-history
behavior require separate end-to-end verification before being claimed as supported.

The OpenUI-backed `generateUI` tool is retained. Replacing its generation model or
renderer, changing stored workflow schemas, adopting a different model runtime and
altering access policy are outside this increment.

## Changed-file record

The starting workspace already contained FAPI, calculation-variable, worksheet,
startup-shell and ChatGPT-plugin changes. The inventory below records only this
assistant-ui task, compared with the local checkpoint
`taxflow-assistant-ui-baseline-18d9536155bb4e8983d29ff25ed70f83` under the task's
temporary directory. A file also modified earlier retains those earlier changes;
the descriptions here apply only to the additional migration delta.

Paths are repository-relative. Every row identifies the file's purpose and its
before/after behavior; test and documentation changes do not alter runtime policy.

| File                                                                                            | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/ai-workflow-builder/package.json`                                                    | Declares frontend dependencies. Adds pinned assistant-ui React and Markdown packages to the existing agent stack; CopilotKit remains installed for the runtime and existing consumers.                                                                                                                                                                                                                                                                    |
| `pnpm-lock.yaml`                                                                                | Records the resolved packages for that dependency addition so installation is reproducible. No independent product behavior change is intended.                                                                                                                                                                                                                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/assistant-ui-messages.ts`    | New display adapter. Previously the old transcript consumed raw agent messages directly; now a pure projection joins tool receipts by call ID and retains source message identity without executing or persisting additional messages.                                                                                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-assistant-ui-runtime.ts` | New external-store bridge. Connects the existing agent to assistant-ui, registers headless instructions, adapts attachment submission and cancellation, limits retries to safe failed text turns and inserts one stable view-only workflow row. Connection notices preserve workspace access; offline file preparation remains available while model submission requires a ready agent.                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-ui-composer.tsx`             | New composer presentation. Replaces locally managed draft/file state with assistant-ui primitives while retaining application menus, Scope styling and agent/computer controls. Stop stays available with an unsent draft; attachments can be removed before submission. Reduces outer horizontal padding below the desktop breakpoint to give phone text entry more room; desktop spacing is unchanged.                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-ui-transcript.tsx`           | New message/viewport presentation. Replaces custom message iteration and scroll management with assistant-ui primitives, Markdown and Copy; retains authorship, registered tool views, exact workflow position and application styling.                                                                                                                                                                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/composer-context.ts`            | Extracts the shared composer control/status contract from the old renderer. Allows existing application controls to connect to the new composer; no separate workflow or access policy is introduced.                                                                                                                                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`                  | Conversation composition. Replaces the `CopilotChat` visual component and custom render slots with the new runtime provider, transcript and composer, retaining the hero, Scope cluster, modes, recovery UI and pinned application work. Reduces hero padding on narrow screens for usable phone text entry while retaining desktop spacing.                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx`                     | Existing application chat actions and file ingestion. Adds explicit conversation identities/epochs so autosave does not reset the composer and asynchronous attachment work cannot submit into a newly selected chat. Existing parsing and agent command ownership are retained.                                                                                                                                                                          |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/aside-thread.tsx`               | Shared visual tokens and compatibility exports. Removes the old message/composer implementation and CopilotChat-specific layout overrides; keeps reusable branding, workflow colors and reduced-motion styling.                                                                                                                                                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/thread-messages.tsx`                   | Removed obsolete custom transcript and scrolling implementation after its active caller moved to assistant-ui. Workflow placement remains in the new runtime/transcript; no second message store is retained.                                                                                                                                                                                                                                             |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/message-specialists.tsx`               | Removed obsolete context/helper used by the retired transcript. Existing author metadata and coworker presentation continue through the new transcript.                                                                                                                                                                                                                                                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/tool-receipt.tsx`               | Updates its explanatory ownership comment for the new transcript. No runtime behavior change is intended.                                                                                                                                                                                                                                                                                                                                                 |
| `tests/unit/assistant-ui-messages.test.ts`                                                      | New regression coverage for IDs, stream updates, call/result pairing, pending/error states, supplied image shapes and read-only projection. No application behavior change is intended.                                                                                                                                                                                                                                                                   |
| `e2e/assistant-ui-chat.spec.ts`                                                                 | New synthetic browser coverage for Stop, safe retry, conversation switching and exact saved-version FAPI integration with retained forms, prescribed results, recalculation, CSV and history. Reuses the established synthetic FAPI records and independent expected values. No application behavior change is intended.                                                                                                                                  |
| `e2e/mkoro-delegation.spec.ts`                                                                  | Updates only the native FAPI case to the already-restored four stages/initial Start action and semantic conversation ordering. Existing delegation, permission and no-reexecution expectations are preserved; no application behavior change is intended.                                                                                                                                                                                                 |
| `e2e/microsina-chat.spec.ts`                                                                    | Synchronizes the existing first case's three reloads with the exact saved-chat GET and requires HTTP 200 before checking restored authorship and agent selection. Previously cold module loading consumed most of the UI assertion window; all existing content assertions and timeouts remain unchanged. No application behavior change is intended.                                                                                                     |
| `playwright.reliability.config.mjs`                                                             | Registers the new browser spec in the existing isolated suite. No application behavior change is intended.                                                                                                                                                                                                                                                                                                                                                |
| `scripts/maintained-paths.mjs`                                                                  | Adds the new maintained adapter/UI/spec paths to the existing verification registry. No application behavior change or architecture-baseline increase is intended.                                                                                                                                                                                                                                                                                        |
| `scripts/testing/vite-server.mjs`                                                               | Corrects the isolated browser harness cache location from each run's `vite-cache` to that same run's `node_modules/.vite`, so the React plugin excludes optimized dependencies from repeated transformation. Sets `optimizeDeps.holdUntilCrawlEnd: false` to release completed bundles during the cold import crawl instead of waiting for it to settle. Each run still owns its cache; no application behavior, assertion or timeout change is intended. |
| `docs/ARCHITECTURE.md`                                                                          | Updates current presentation/runtime ownership, headless context, persistence, workflow and retry boundaries. Documentation only; no runtime behavior change is intended.                                                                                                                                                                                                                                                                                 |
| `docs/FUNCTIONALITY.md`                                                                         | Describes current visible chat controls and retained application behavior, with explicit multimodal and generator limits. Documentation only; no runtime behavior change is intended.                                                                                                                                                                                                                                                                     |
| `docs/unified-workflow-execution.md`                                                            | Replaces the retired transcript file reference with the new bridge/transcript ownership. Shared workflow rules remain accurate; no runtime behavior change is intended.                                                                                                                                                                                                                                                                                   |
| `docs/product/decisions.md`                                                                     | Records the user's subsequent assistant-ui foundation choice, replacing the stale implication that all chat-library work is deferred. Current modes, Scope, pages, engine and history remain; later redesign and full generative UI remain future work. Documentation only; no runtime behavior change is intended.                                                                                                                                       |
| `docs/assistant-ui-migration.md`                                                                | Adds this scope, per-file change and verification record. Documentation only; no runtime behavior change is intended.                                                                                                                                                                                                                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/copilot-workspace-panel.tsx`    | Owns workspace navigation and layout. Previously the expanded desktop sidebar squeezed phone chat to an unusable width; narrow screens now use the existing icon rail and a temporary expanded overlay. Desktop preference, branding, pages and live conversation state are preserved; mobile split-page navigation is unchanged.                                                                                                                         |

The existing product blueprint, access design and workflow contracts remain
accurate: this increment changes the chat presentation and its adapter, while
their ownership and intended behavior remain unchanged. The historical FAPI
restoration record describes its earlier checkpoint and is not rewritten to claim
assistant-ui verification.

The existing [testing guide](../TEST.md) remains accurate: each browser run owns
its cache, server and report directory. The cache's internal path changes; no
existing server or another run's cache is reused.

## Verification status

All 14 distinct targeted browser cases passed across the recorded runs: five new
assistant-ui cases, two MicroSina cases, two source cases, two workflow-session
cases and three Computer/native-workflow cases. Earlier failing assertions were
corrected and rerun; there are no unresolved failures among these selected cases.
This is targeted coverage, not a claim that the entire browser suite ran.

- `pnpm run verify` passed with exit code 0 after the connection/file-import
  refinements and mobile sidebar correction. Its repository checks and 309 tests
  passed: 222 unit, 37 worker and 50 workflow-core tests. This run preceded the
  two responsive padding class changes and final harness startup option described
  below.
- The final `pnpm install --frozen-lockfile` passed. Existing dependency records
  were preserved while adding the pinned assistant-ui packages; an unrelated
  peer-resolution change was removed before the final frozen installation.
- The first browser attempt reached its 300,000 ms cold-warmup limit before any
  test cases ran. This was a setup failure, not an assertion result. Inspection
  of the installed React plugin and logs showed optimized dependencies being
  transformed again because the per-run cache was outside `node_modules`; the
  harness now retains isolation under the conventional excluded path.
- The [first browser run that reached assertions](../test-results/phase2/04a727d1-e9e7816e-a2d4-4842-849b-cab16590b15b/playwright.log)
  completed with 6 passing and 5 failing cases. Three held-stream cases exposed an incomplete fixture: the
  installed SDK sends `agent/stop`, so the mock must close the exact remote
  agent/thread stream instead of merely returning HTTP 200. That fixture now
  implements and checks the stop request. The FAPI case had an ambiguous header
  locator, now restricted to the workflow header. The MicroSina reload case now
  waits for its exact saved-chat GET before applying unchanged UI assertions.
  A read-only fixture audit also corrected the visible-text projection to exclude
  persisted system metadata while keeping full-history equality checks.
- Screenshot review exposed the narrow-screen sidebar problem described above.
  The Stop case now verifies mobile composer/control bounds, overlay expansion,
  Escape closure, preserved draft and restored desktop width before capture.
- A later browser attempt also reached the 300,000 ms warmup limit before any
  cases ran. Its dependency optimizer was still preparing a temporary cache;
  inspection found no application/module HTTP errors. That attempt overlapped
  repository verification, so resource contention is possible but unproven. The
  next browser attempt ran after verification completed.
- The [isolated nine-case run](../test-results/phase2/04a727d1-eeb5a4a1-7131-4f12-9868-2e463fc00b0c/playwright.log)
  completed with 8 passing and 1 failing case. It
  verified safe text retry, new/saved conversation switching, exact FAPI version
  binding, retained form drafts, recorded 945-to-810 CAD recalculation, CSV export,
  reload restoration, Sina/MicroSina authorship and all three Computer/native
  workflow cases. The successful FAPI [workflow](../test-results/phase2/04a727d1-eeb5a4a1-7131-4f12-9868-2e463fc00b0c/artifacts/assistant-ui-chat-assistan-c88d3-orksheet-through-follow-ups/assistant-ui-fapi-restored-workflow.png)
  and [results](../test-results/phase2/04a727d1-eeb5a4a1-7131-4f12-9868-2e463fc00b0c/artifacts/assistant-ui-chat-assistan-c88d3-orksheet-through-follow-ups/assistant-ui-fapi-restored-results.png)
  screenshots were visually reviewed.
- The remaining Stop case failed before streaming at its unchanged mobile
  usability assertion: the textbox measured 178px against a minimum of 180px.
  Two responsive padding classes in the hero and composer now provide 32px more
  phone width without changing desktop spacing. Selected formatting checks
  passed. The earlier 309-test verification does not certify these final CSS
  changes; the subsequent production build does include them.
- The frontend production build passed with exit code 0 in 5m 52s. It reports
  sourcemap, browser-externalized dependency and chunk-size warnings; the previous
  FAPI build also contained warnings. This is a successful build, not a claim
  that those warnings have been resolved.
- The next focused Stop/mobile attempt again timed out during warmup before
  assertions, without concurrent repository verification. Its trace showed
  dependency metadata committing only three seconds after the navigation limit.
  The harness now sets `optimizeDeps.holdUntilCrawlEnd: false`: installed Vite
  7.3.6 otherwise holds completed bundles until the request crawl settles. This
  changes cold-start scheduling while preserving isolated caches, assertions and
  timeouts. Syntax and selected formatting checks passed.
- The [final focused Stop/mobile rerun](../test-results/phase2/04a727d1-4d36ef88-081d-402e-8e24-839826c87b0a/playwright.log)
  passed with exit code 0: one case passed in 32.0s, with 27.1s spent in the case.
  It passed the unchanged usable-width bound, sidebar overlay/Escape behavior,
  preserved draft and desktop width, exact remote stop, stream closure and
  subsequent reply assertions. The [desktop](../test-results/phase2/04a727d1-4d36ef88-081d-402e-8e24-839826c87b0a/artifacts/assistant-ui-chat-assistan-f516b-aft-and-rejects-late-tokens/assistant-ui-home-desktop.png)
  and [mobile](../test-results/phase2/04a727d1-4d36ef88-081d-402e-8e24-839826c87b0a/artifacts/assistant-ui-chat-assistan-f516b-aft-and-rejects-late-tokens/assistant-ui-home-mobile.png)
  captures were visually reviewed: the phone input and Computer control are
  usable, with the existing branding preserved. This successful cold run verifies
  the harness change for this run; repeated cold-start reliability was not measured.

The final Git reconciliation identifies 26 task files: 18 modified/deleted and
8 new files, matching the inventory above. Documentation checks resolved the
affected relative links and passed formatting and scoped whitespace checks.
Browser artifacts are local verification outputs and are not committed documents.

The new browser tests use synthetic authenticated workspaces, mocked chat/library
APIs and a local held SSE stream. The FAPI case imports two saved versions and uses
the same synthetic source rows as the existing reference-display test; expected
945 CAD initially and 810 CAD after changing inclusion rate are independently
specified. These checks cannot establish parity with the user's unseen document,
live Sina/MicroSina services or a deployed session. No deployment is part of this
record.

## Docker dependency repair — October 9, 2026

The user subsequently reported a Vite import error for `@assistant-ui/react` in
the local Docker app. The previous native Windows installation and build did not
refresh Docker's separate Linux dependency volumes. Both assistant-ui packages
were absent there. The API also failed to build because its dependency volumes
lacked packages already declared by other work in the checkout.

Following the existing [development recovery instructions](DEVELOPMENT.md), the
local `taxflowos` API and web services were stopped, the dependency service ran
`pnpm install --frozen-lockfile` with the existing store, and API/web were recreated
using the existing Node 24.21.0 / pnpm 10.26.1 image. The database stayed running;
no volumes were removed and no migrations were run for this repair.

- Native and Docker `pnpm run doctor` checks passed.
- The Docker frozen installation passed, adding 77 packages from the existing
  lockfile. No dependency declarations, versions or install policy changed.
- Both `@assistant-ui/react` and `@assistant-ui/react-markdown` now resolve from
  the frontend package inside Docker.
- The API build completed successfully and `http://localhost:5050/api/healthz`
  returned HTTP 200 with `{"status":"ok"}` after recreation.
- The frontend proxy health check also returned HTTP 200. The previously failing
  `assistant-thread.tsx` request returned HTTP 200 with its assistant-ui import
  resolved by Vite.
- A fresh browser rendered the branded startup shell with no Vite overlay or
  uncaught browser errors. A subsequent read-only browser visit reached the normal
  sign-in screen in 25.7 seconds, again with no overlay or uncaught errors. Its
  only HTTP error was the expected anonymous `/api/session` 401. This verifies
  frontend startup and the API connection, not an authenticated chat or live
  provider calculation. The first development load required dependency warmup.
- This record passed formatting and its added development-guide link resolves.
  No source tests were rerun because this repair changed no application code.

This repair updates only this record; all other existing source and lockfile
changes belong to earlier work. There is no new application behavior change:
the running Docker environment now has the dependencies the application already
requires. The architecture and product summaries remain accurate. The earlier
native browser-suite results above are not evidence of Docker runtime health.

## Workflow choices and connection recovery — October 9, 2026

The next report identified two distinct problems: a background access-verification
timeout blocked the workspace even though an answer could still arrive, and the
workflow-list tools returned plain metadata without selectable controls.
This increment belongs to the Chat presentation/runtime adapters and the existing
authentication UI. Workflow calculations, versions, permissions and source rules
continue to belong to their existing owners (product R-03/R-06 and J3-01/J4).

The user's exact error was **Connection interrupted — The app service is taking
too long to respond**. That text comes from `AuthProvider`'s 30-second combined
session/membership check. It hides and makes the verified workspace inert while
keeping the mounted chat/drafts alive; a reply can therefore finish underneath.
Recent sanitized local API logs showed session checks completing in 5–83 ms,
demo-workspace checks in 10–66 ms, and chat requests in 16–11,980 ms. Some gaps
between the two access requests exceeded ten seconds. Those observations do not
establish database or provider slowness. Multiple legacy chat-hook consumers each
registered their own connection effect; consolidating that ownership removes
unnecessary streams and reconnect side effects. In particular, the Files panel
mounted on the first reply and its legacy hook called `detachActiveRun()` before
connecting again. It now observes the same agent without opening a stream. The
original browser's exact queueing delay has not been captured.

Another confirmed defect was instruction delivery: the installed CopilotKit
1.63.2 bundle stores legacy `chatInstructions` without consuming it in `runAgent`.
The bridge now registers host instructions through v2 `useAgentContext`; the
server's existing BuiltInAgent includes registered context in its system prompt.
MicroSina also previously returned before Sina's workflow interaction guidance.
Both providers now receive shared name/choice/result-format instructions, while
Foundry retains MicroSina's base agent definition and model.

### Files changed in this increment

This inventory describes changes relative to the working-tree snapshot at the
start of this report, not the repository's already mixed Git diff. Earlier FAPI,
assistant-ui, ChatGPT integration and calculation-editor changes are preserved.

| File                                                          | Purpose and before/after behavior                                                                                                                                                                                                                                                |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/assistant/ui/use-agent-workflow-tools.tsx`          | Workflow discovery adapters. Plain list receipts now render clickable choices and accept optional name queries; returned metadata identifies saved versions and dates. IDs remain internal tool arguments.                                                                       |
| `features/assistant/ui/workflow-choice-model.ts`              | New receipt projection and selection validation. Exact full names take precedence over near names, duplicate records remain separate, and renamed drafts retain both current and saved titles. A click retains the listed version; missing identities never select a substitute. |
| `features/assistant/ui/workflow-choice-list.tsx`              | New reusable chat list. A title opens the shared workflow panel; a draft action opens Build without saving or calculating. Saved cards expose the version/date and optional identity details. Rendering itself does not start a session.                                         |
| `features/assistant/runtime/workflow-chat-instructions.ts`    | New shared host guidance for ordinary names, clickable ambiguity resolution and prescribed workflow output. It introduces no calculation or authorization rules.                                                                                                                 |
| `features/assistant/ui/assistant-thread.tsx`                  | Supplies shared workflow guidance to both providers. MicroSina previously received only page/field catalogs from this host instruction function.                                                                                                                                 |
| `features/assistant/runtime/chat/use-assistant-ui-runtime.ts` | Delivers combined host/additional instructions through the active SDK context registration instead of unused legacy state. Ordinary sends, retries and tool follow-ups use the same registration.                                                                                |
| `features/assistant/ui/use-assistant.tsx`                     | Retains one existing SDK connection owner and shares its chat methods with consumers instead of opening duplicate connections. Sending, stopping, tool execution and history retain their existing owners.                                                                       |
| `features/assistant/runtime/chat/use-chat-persistence.ts`     | Receives messages/writers from that owner instead of opening another stream. No persisted format or save/restore behavior change is intended.                                                                                                                                    |
| `features/assistant/ui/use-mkoro-delegation.tsx`              | Reuses the owner's append method and passively observes agent messages. Computer delegation, approvals and completion behavior are intended to remain unchanged.                                                                                                                 |
| `features/assistant/ui/specialist-presence.tsx`               | Passively reads the agent's running status instead of opening a connection for a cosmetic indicator. No visible behavior change is intended.                                                                                                                                     |
| `features/assistant/ui/data-files-panel.tsx`                  | Passively reads typed agent messages for cited documents/web sources. No source-library behavior change is intended.                                                                                                                                                             |
| `platform/auth/ui/provider.tsx`                               | Keeps verification timeouts and access denial handling, with prompt bounded recovery after a transient background failure. The workspace remains blocked until session and membership both verify.                                                                               |
| `tests/unit/workflow-choice-model.test.ts`                    | Adds independent name, duplicate, renamed-draft, version, missing-data and anchoring regressions. No application behavior change.                                                                                                                                                |
| `e2e/assistant-ui-chat.spec.ts`                               | Adds real tool-renderer selection cases using synthetic responses, including both providers' outgoing host context, exact saved identity/version, follow-up/reload, draft review and stale selection. Existing cases remain. No application behavior change.                     |
| `e2e/chat-response-lifecycle.spec.ts`                         | Adds isolated connection/access-recovery coverage with held responses. No application behavior change.                                                                                                                                                                           |
| `playwright.reliability.config.mjs`                           | Includes the lifecycle regression file in the normal reliability suite. No application behavior change.                                                                                                                                                                          |
| `scripts/maintained-paths.mjs`                                | Includes new maintained modules/tests in formatting checks. No application behavior change.                                                                                                                                                                                      |
| `docs/ARCHITECTURE.md`                                        | Corrects instruction transport ownership and documents choice adapters. Documentation only.                                                                                                                                                                                      |
| `docs/FUNCTIONALITY.md`                                       | Describes selectable discovery and shared name guidance. Documentation only.                                                                                                                                                                                                     |
| `docs/microsina-foundry/tools.json`                           | Updates the two exported workflow-list declarations to match their optional name-query argument and clickable output. Empty arguments still list all records; all other 45 tools remain unchanged. This file does not update a deployed Foundry agent.                           |
| `docs/microsina-foundry/README.md`                            | Explains name filtering, clickable selection and the separate remote registration step. Documentation only; no agent version is published.                                                                                                                                       |
| `docs/assistant-ui-migration.md`                              | Records this correction, evidence, file inventory and verification limits. Documentation only.                                                                                                                                                                                   |

Frontend paths in this table are relative to
`artifacts/ai-workflow-builder/src`. Product requirements and workflow contracts
remain accurate; no pending product-policy decision is treated as approved.

### Verification for this increment

- `pnpm run verify` passed: doctor, contract-schema consistency, architecture across
  1,127 source files, maintained formatting, all configured type checks, 229 unit
  tests, 37 Computer-worker tests and 50 workflow-core tests (316 total, no failures
  or skips). The existing Foundry adapter unit file took several minutes loading
  its runtime dependencies; it completed successfully with synthetic transport.
- The focused workflow-choice unit run also passed all seven cases.
- Local Docker API and frontend proxy health requests returned HTTP 200. Vite
  served the updated chat module and new workflow-choice component with HTTP 200.
  No dependency declarations, database, migrations or volumes changed.
- The first production-build invocation stopped before compilation because the task
  shell omitted the required `PORT` setting. The configured invocation uses
  `PORT=5173`, `BASE_PATH=/` and `NODE_ENV=production`, with source-map upload
  credentials cleared only in that task shell to keep verification local.
  That frontend build passed with exit code 0 in 9m 36s, transforming 17,040 modules.
  It reports source-map, browser-externalized Node-module and large-chunk warnings;
  no warning thresholds or dependency versions were changed.

- The first focused browser run completed with 13 passed and three failed cases.
  Both real-time delayed replies passed: Sina and MicroSina each waited at least
  35 seconds with one connection, responsive access checks, no error overlay,
  one saved reply and a retained draft. Stop, retry, chat navigation, exact FAPI
  selection/results/recalculation, name/duplicate choice rendering, pinned versions,
  agent approval binding and all three Computer delegation cases passed.
- The new draft-opening test reached the correct Build title, but its default
  five-second canvas assertion expired with 18 lazy module requests still pending
  and no browser errors. It now uses the existing workflow tests' 30-second initial
  canvas readiness bound, retaining all identity and no-write assertions.
- The new access-recovery test tried to inspect a deliberately hidden input through
  a role locator that excludes hidden elements. The locator now includes hidden
  nodes, and this accelerated-clock case freezes startup time so the regular minute
  poll cannot drift into its prompt-retry assertions. Denial and preservation checks
  remain unchanged; the two real-time delayed-reply cases still use real timers.
- The existing MicroSina contract check caught a real downstream mismatch: the local
  Foundry tool export lacked the new optional `query` arguments. Both declarations
  now match the frontend, with the other 45 definitions unchanged. Empty arguments
  remain valid. The parity assertion was not changed; the saved remote Azure agent
  and configured version were not published or changed.
- The selectable-choice and restored FAPI-result screenshots were visually reviewed:
  cards fit the existing branded conversation and the worksheet retains its declared
  USD/CAD layout and the independently expected recalculated value of 810 CAD.
- The [initial focused browser run](../test-results/phase2/04a727d1-6f4f2064-cb5b-49e5-9387-ff497286dc05/playwright.log)
  recorded the 13 passes and three failures above. The
  [three-case rerun](../test-results/phase2/04a727d1-078f5223-dd4e-43d4-ade2-6b7ab320c9db/playwright.log)
  passed all three in 2.8 minutes with exit code 0. All 16 selected scenarios now
  have passing results. Actual held-response timings were 35,339 ms for Sina and
  35,274 ms for MicroSina, each with one connection and one run. The recovery case
  verifies the original 30-second timeout, preserved hidden state, one prompt
  retry, no repeated immediate retries on service failure, manual recovery and
  removal of private content after a genuine membership denial.
- Final reconciliation identified 22 current-increment files: 17 modified and five
  added, with every path in the table above and no new deletions. Targeted formatting,
  generated tool-schema parity, relative-file references and scoped whitespace
  checks passed. All functional assertions and independently specified calculation
  values were retained.

Synthetic model responses test transport and UI; they do not establish live model
name-resolution quality or reproduce the user's unseen source document. A previously
registered Foundry agent
can still call the lists without `query`; using that optional argument requires its
tool definition to be registered separately as documented in its setup guide.
No commit, push, migration, remote-agent publication or deployment was performed.
