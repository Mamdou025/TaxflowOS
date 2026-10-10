# Unified Scope and saved-chat recovery

The user approved one centered orb-led Scope menu and requested repair of the
intermittent plain “Opening your saved chat…” screen. Chat presentation and its
restoration adapter own this increment; workflow rules, approvals, access boundaries
and stored schemas remain with their existing owners.

## Acceptance and behavior

- One visible Scope entry combines company/year labels, exact current workflow or
  draft reference and unique selected sources. A fresh chat says General chat.
- Its panel retains source add/remove/retry/readiness, deliberate Sources navigation,
  exact workflow return/details, collapsed retrieved evidence and work history.
- The original orb remains centered over the chat column; Tools remains separate
  and the composer retains Sina/MicroSina and Computer controls.
- Loading/error recovery retains the branded shell and unsent composer state.
  Outgoing forms stay mounted but concealed/inactive, avoiding mixed-conversation
  content or mutation while a different history is being loaded.
- Retry targets the requested saved chat. New chat cancels superseded reads; it
  cannot bypass an unsettled previous response or a failed outgoing-history save.

## Findings and limits

Code inspection identified an unbounded SDK detach before the existing HTTP timeout,
an initial-readiness path that did not clear loading when messages were already
available, and a Retry action that could address the outgoing conversation. The
transition now bounds the whole navigation at the existing 20-second limit and
retains its requested identity. Focused tests simulate the failing conditions;
this is not a trace proving which path occurred in the user's screenshot.

The application still needs its API/session and a ready model connection to resume
a saved model conversation. Failure remains visible and recoverable; the change
does not fabricate history or silently start a different conversation. Context
remains explicit company/year labels and selected sources; no company dataset is
loaded automatically. No saved workflow, version, source or history is deleted.

## Task boundary and changed files

The checkout already contained extensive unrelated and earlier task changes. This
inventory compares Git-listed files to the before-edit snapshot
`taxflow-scope-restore-start-1791610764549`, not to HEAD. Earlier deletions of
`message-specialists.tsx` and `thread-messages.tsx` are not this task's changes.
No commit, push, merge or deployment was performed.

| File                                                                                                                            | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [assistant-thread.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx)                         | Owns the chat column. Replaces separate orb/company/year, Work and Context surfaces with one centered Scope; retains normal shell during recovery, conceals/inerts the retained outgoing transcript, and blocks tool/history dispatch until ready. Formerly recovery replaced the entire UI with plain text.                                  |
| [chat-scope-menu.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/chat-scope-menu.tsx)                           | New composition for current-chat Scope. Uses existing orb, exact current workflow and selected-source count; one keyboard-accessible dialog contains selection, evidence and history. Company/year and source controls formerly occupied separate surfaces.                                                                                   |
| [chat-scope-menu.css](../artifacts/ai-workflow-builder/src/features/assistant/ui/chat-scope-menu.css)                           | New responsive presentation for Scope and its dialog, using existing light/dark brand tokens. Orb and summary center within the chat column; narrow dialogs scroll within the viewport. No calculation or storage behavior.                                                                                                                   |
| [chat-context-strip.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/chat-context-strip.tsx)                     | Owns explicit label/source controls inside Scope instead of a permanent duplicate summary. Preserves readiness, exact revision, error/retry/removal and add-text controls; adds direct upload and Browse Sources, with epoch/lock checks for asynchronous attachment.                                                                         |
| [data-files-panel.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/data-files-panel.tsx)                         | Now provides historical evidence within Scope instead of a second Context drawer and embedded Library manager. Selected sources are counted separately; historical source revisions remain distinguishable and missing/changed downloads report errors. Sources retains Library ownership.                                                    |
| [work-menu.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/work-menu.tsx)                                       | Adds nested history presentation without treating the latest global work item as this chat’s active workflow. Preserves Open/Jump/Clear, disables history actions while locked, and exposes startup history reconciliation for the always-mounted Scope owner. Existing standalone menu compatibility remains.                                |
| [assistant-ui-composer.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-ui-composer.tsx)               | Keeps the composer, agent and Computer controls. Moves the duplicate selected-draft display/removal into Scope; disables the input, Send and action menu during recovery, including when an unsent draft remains. Attachment shortcuts remain.                                                                                                |
| [saved-chat-recovery.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/saved-chat-recovery.tsx)                   | New in-shell recovery notice. Shows loading/error, Retry for the exact requested chat and New chat; retains access to bound Computer tasks while the outgoing transcript is unavailable. Previously recovery was an unstyled replacement page.                                                                                                |
| [use-chat-persistence.ts](../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-chat-persistence.ts)         | Owns restoration/autosave coordination. Bounds navigation including pre-fetch waits, cancels superseded reads, rejects late completion, settles initial loading correctly and retains requested retry identity. Retries save eligible outgoing history; unhydrated history cannot overwrite a saved conversation. No persisted schema change. |
| [chat-transition.ts](../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-transition.ts)                   | New shared 20-second deadline/cancellation helper for navigation waits. An unresolved SDK detach or response body previously could outlive the HTTP-only timeout. Late operations cannot advance navigation after cancellation.                                                                                                               |
| [chat-switch.ts](../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-switch.ts)                           | Shares an in-flight agent detach promise across retries. A second SDK detach previously could return early after its internal handle was cleared; replacement history must now wait for actual completion.                                                                                                                                    |
| [use-assistant-ui-runtime.ts](../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-assistant-ui-runtime.ts) | Disables failed-reply replay while saved-chat restoration is pending/failed, matching the existing send lock. This matters because the normal shell now stays mounted.                                                                                                                                                                        |
| [use-assistant.tsx](../artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx)                               | Exposes requested restoreThreadId to presentation. No change to workflow calculation, transport or storage formats is intended.                                                                                                                                                                                                               |
| [chat-transition.test.ts](../tests/unit/chat-transition.test.ts)                                                                | Six new regressions for hung detach, retry waiting on the same detach, superseded reads, late failures, response-body deadline and stale work. Test-only; no application behavior change.                                                                                                                                                     |
| [assistant-ui-chat.spec.ts](../e2e/assistant-ui-chat.spec.ts)                                                                   | Adds delayed/failed/timed-out restoration scenarios, exact retry/history preservation, locked Scope/composer and recovery via New chat. Updates selected-source inspection to Scope. Test-only; business values and deadlines remain unchanged.                                                                                               |
| [chat-context.spec.ts](../e2e/chat-context.spec.ts)                                                                             | Adapts explicit-context journeys to one dialog and checks centered desktop/mobile controls, bounds, label values, selected sources, restoration/reset, Sources navigation and direct Scope upload. Distinguishes selected sources from collapsed historical evidence and produces actual UI screenshots. Test-only.                           |
| [source-library.spec.ts](../e2e/source-library.spec.ts)                                                                         | Uses Scope to inspect selected sources and closes it before other interactions. Existing workbook values, revision and failure expectations remain. Test-only.                                                                                                                                                                                |
| [mkoro-delegation.spec.ts](../e2e/mkoro-delegation.spec.ts)                                                                     | Opens current FAPI workflow controls through Scope instead of the retired top-level Work menu. Native workflow/Computer delegation assertions remain. Test-only.                                                                                                                                                                              |
| [phase-7-navigation.spec.ts](../e2e/phase-7-navigation.spec.ts)                                                                 | Checks the single Scope entry and draft-reference removal there, preserving no-execution and unsent-draft checks. Test-only.                                                                                                                                                                                                                  |
| [maintained-paths.mjs](../scripts/maintained-paths.mjs)                                                                         | Adds the new helper and presentation files to existing formatting/architecture coverage. No runtime behavior change; no baseline or test budget raised.                                                                                                                                                                                       |
| [ARCHITECTURE.md](../docs/ARCHITECTURE.md)                                                                                      | Updates current ownership and restoration mechanics. Replaces the obsolete permanent-strip description; no application behavior change.                                                                                                                                                                                                       |
| [FUNCTIONALITY.md](../docs/FUNCTIONALITY.md)                                                                                    | Describes one Scope surface and recoverable saved-chat loading with their real limits. No application behavior change.                                                                                                                                                                                                                        |
| [navigation.md](../docs/product/navigation.md)                                                                                  | Updates the intended interaction sketch to the user-approved centered Scope. Keeps selection and historical evidence distinct. No application behavior change.                                                                                                                                                                                |
| [decisions.md](../docs/product/decisions.md)                                                                                    | Records the user’s approval for unified centered Scope and visible saved-chat recovery. Does not resolve unrelated pending product decisions. No application behavior change.                                                                                                                                                                 |
| [chat-scope-recovery.md](../docs/chat-scope-recovery.md)                                                                        | This task’s per-file semantic review and verification record. No application behavior change.                                                                                                                                                                                                                                                 |

## Verification

- Actual desktop/mobile browser captures were visually checked: centered orb,
  one Scope panel, no duplicate controls or clipped content, and a retained
  recovery draft with Send disabled. See the
  [chat home](../test-results/phase2/04a727d1-74b06db6-fb2c-4cf3-b6e3-721277714cba/artifacts/assistant-ui-chat-assistan-f516b-aft-and-rejects-late-tokens/assistant-ui-home-desktop.png),
  [Scope panel](../test-results/phase2/04a727d1-74b06db6-fb2c-4cf3-b6e3-721277714cba/artifacts/chat-context-explicit-chat-f53cf-ct-sources-and-starts-clean/chat-context-sina.png)
  and [mobile Scope](../test-results/phase2/04a727d1-74b06db6-fb2c-4cf3-b6e3-721277714cba/artifacts/chat-context-explicit-chat-f53cf-ct-sources-and-starts-clean/chat-context-mobile.png).
- Pinned runtime doctor passed: Node 24.21.0 / pnpm 10.26.1.
- Final `pnpm run verify` passed: contracts, architecture (1,148 source files),
  formatting, application/test types, 255 unit tests, 37 worker tests and 50 core
  tests. Log: `test-results/scope-recovery-verify-final.log`.
- The first 24-case browser batch passed 16 cases and exposed two implementation
  defects across eight failing cases: Send could appear enabled with a retained
  draft during recovery, and shared sibling keys duplicated Scope sections after
  updates. Both defects were fixed; all 12 focused rerun cases passed with the
  original expectations and additional direct Scope upload/evidence checks. Across
  the initial passing cases and the rerun, all 24 distinct selected journeys have
  passing evidence. This includes exact FAPI version/worksheet restoration,
  workflow selection, navigation, both agents, sources, Stop/retry and recovery. Logs:
  `test-results/scope-recovery-browser.log` and
  `test-results/scope-recovery-browser-final.log`.
- Two targeted real API integration cases passed using a disposable database and
  real sessions: chat message ownership and workflow-binding workspace/role
  boundaries. The initial direct Node invocation was rejected by the harness's
  pnpm guard before setup; rerunning through `pnpm exec node --test` passed.
  Logs: `test-results/scope-recovery-api.log` and
  `test-results/scope-recovery-api-retry.log`.
- Two targeted real persistence browser cases passed: cross-browser workflow/result
  recovery with backups, offline retry and conflict protection; and account/workspace
  switching with sign-out/sign-in isolation. Log:
  `test-results/scope-recovery-persistence.log`.
- Scoped Git whitespace checking, report formatting and 77 local documentation
  links passed. The task inventory contains 25 source/test/documentation/check files.
- Browser reliability
  fixtures simulate provider responses and workflow-library writes; real API and
  persistence suites use disposable data. Live providers and production deployment
  are not verified by those tests.
