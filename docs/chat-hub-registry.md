# Chat-hub element registry

This registry exists because TaxflowOS is developed by two different AI agents
(Codex and Claude) plus the user, and small UI edits have repeatedly drifted
from the agreed design without anyone noticing until later. It is a
companion to [ARCHITECTURE.md](ARCHITECTURE.md) and
[FUNCTIONALITY.md](FUNCTIONALITY.md), not a replacement: those describe
current implementation and capability; this doc states, per element, the
**contract** — what must not change without a deliberate decision — so a
change can be checked against intent before it ships.

The product priority this registry protects: **Chat is the hub.** A user
should be able to do everything — see scope, discover and run workflows,
see what each step needs, get results — without leaving the conversation,
and it must keep feeling like a chat, not a dashboard embedded in a chat
panel. See the "Known smells" section at the bottom for where that's
currently at risk.

## How to use this doc

Before changing a file listed below: read its contract, then either (a)
confirm the change stays inside it, or (b) if the change would alter the
contract, that's a design decision — surface it and get explicit
confirmation rather than assuming. This is automated by the
`ui-element-guard` skill at `.claude/skills/ui-element-guard/`.

If you touch a chat-hub/workflow-block file that isn't listed here yet, add
an entry (purpose + contract) once you understand it — don't leave it
undocumented. Keep entries short; this is a map, not a tutorial.

All paths are relative to `artifacts/ai-workflow-builder/src/` unless noted.

## Core chat runtime

| Element | File(s) | Purpose | Contract |
| --- | --- | --- | --- |
| Connection/action owner | `features/assistant/ui/use-assistant.tsx` (~950 lines) | Registers every CopilotKit action/readable (runWorkflow, generateUI, computer delegation, etc.), composer handlers, `@`-command catalog. Both docked and focus-mode chat consume this one hook so actions register exactly once. | Don't duplicate action registration elsewhere. New chat capabilities get added here or to `assistant-thread.tsx` — see smell #5 below before adding more. |
| Runtime adapter | `features/assistant/runtime/chat/use-assistant-ui-runtime.ts` (~285) | Converts CopilotKit's raw agent messages into assistant-ui's `useExternalStoreRuntime` shape; splices in the workflow card and selection card. | assistant-ui owns *visible conversation rendering only*. Tool execution, history, and persistence stay with the existing CopilotKit/agent engine — never let assistant-ui primitives re-implement either. |
| Message projection | `features/assistant/runtime/chat/assistant-ui-messages.ts` (~115) | Pure function: AG-UI messages → `ThreadMessageLike[]`, threading tool results onto their calls. | Display projection only, no side effects. If this file starts doing anything stateful, that's scope creep — push it back to the runtime adapter or the agent layer. |
| Composer | `features/assistant/ui/assistant-ui-composer.tsx` (~590), `composer-menus.tsx` (~148), `chat-source-picker.tsx` (~99), `tools-menu.tsx` (~610) | Input box, attachment chips, send/stop, agent picker, Computer control, explicit source-attach dialog, and (moved here 2026-10-12, user request — was a standalone header button) the Tools capability catalogue. | `chat-source-picker.tsx` is explicit workflow-input selection — independent of semantic retrieval. Don't merge the two attachment paths without a decision. `ToolsMenu` is rendered `compact` with `panelSide="top"` here (vs. the old header's `bottom`-anchored panel) since the composer sits near the viewport bottom — its callbacks (`onRunResult`/`onAsk`/`onArm`) now route through `AsideComposerContext` rather than direct props; keep that context the single wiring point rather than threading new props through `assistant-thread.tsx` again. |
| Saved-chat switch | `runtime/chat/use-chat-persistence.ts` (~535), `chat-switch.ts` (~60), `chat-transition.ts` (~40) | Autosaves the outgoing conversation, stops the active agent run, then loads a saved thread's messages; bounds the whole navigation under one deadline so a stuck step surfaces `saved-chat-recovery.tsx`'s Retry/New-chat UI instead of hanging silently. | A thread switch must not replace history with a run still writing to it. `chat-switch.ts`'s wait on the SDK's `detachActiveRun()` is deliberately bounded (`DETACH_SETTLE_TIMEOUT_MS`, 2026-10-12 fix) separately from the outer navigation deadline — the SDK's own cancellation signal fires synchronously before that promise settles, so a stall in its bookkeeping tail is safe to stop waiting on; a genuine detach *rejection* must still propagate. Don't remove that inner bound without re-confirming that invariant still holds. |

## Scope bar (company / year / sources / active workflow)

| Element | File(s) | Purpose | Contract |
| --- | --- | --- | --- |
| Scope bar UI | `features/assistant/ui/chat-scope-menu.tsx` (~330) + `.css` (~550) | An "active status bar," not a foldable menu: a pill with one segment per field (company avatar+name, year, source count, workflow name+status badge+headline result when available), each showing a muted placeholder when unset rather than disappearing. Expands to a popover anchored below the trigger. | Rendering never selects or executes a workflow by itself — confirmed design decision (2026-10-10, "Scope bar correction"): no modal, no backdrop, horizontal bar only. Redesigned 2026-10-10: the expanded panel floats (`position: absolute`, closes on outside click) instead of pushing the conversation down — still no backdrop/modal, just an anchored popover. The workflow segment's headline figure (e.g. "Gross 213,923 CAD") is read-only, sourced from `fapi-session-result.ts`'s already-recorded FAPI worksheet — never computed in the bar, and only shown when that value is currently recorded. |
| Scope state/model | `chat-context-model.ts` (~222), `chat-context-store.ts` (~139), `chat-context-sources.ts` (~268), `chat-context-projection.ts` (~33) | Persisted/restorable `ChatContext` shape, jotai atoms, source attach/remove, display projection. | This is explicit, per-conversation context only (company/year/chosen sources/selected workflow) — not an ambient company-document system. Don't let this silently widen scope. |

## Workflow surfaces rendered inline in chat

| Element | File(s) | Purpose | Contract |
| --- | --- | --- | --- |
| Shared session panel | `features/workflows-hub/workflow-session-panel.tsx` (~414) | **The same component** renders the full workflow session both standalone (`/run/[workflowId]`) and inline in chat (`presentation="chat"`, mounted via `ChatWorkflowThread`/`assistant-ui-transcript.tsx` when a message carries `metadata.custom.workflow === true`). | Intentional one-component-two-themes design — don't fork it into a separate "chat-lite" copy without a decision; that reintroduces the duplication Phase 4/8 removed. But see smell #2: it is genuinely page-sized, themed rather than trimmed. |
| Workflow discovery | `workflow-choice-model.ts` (~137), `workflow-choice-list.tsx` (~230) | Parses tool results into clickable workflow choices; re-resolves against the live library at click time, never a stale snapshot. | Never trust a cached choice as still valid — always re-check at click. |
| FAPI step timeline | `workflow-step-timeline.tsx` (~147, generic accordion), `fapi-workflow-steps.tsx` (~120, FAPI's 4 colored stages), `workflow-step-model.ts` (~65), `fapi-session-worksheet.tsx` (~245) | FAPI-specific 4-stage (Collect/Classify/Compute/Review) presentation layered on the generic accordion. | FAPI-only. `supportsFapiStages` must keep gating this — don't let FAPI's bespoke presentation leak onto other workflow types without a decision. |

## Generative + predefined UI

| Element | File(s) | Purpose | Contract |
| --- | --- | --- | --- |
| Generative UI (`generateUI`) | `features/genui/genui-render.tsx` (~116), `library.tsx` (~49) | OpenUI-backed: streams a prompt to `/api/genui`, renders via `@openuidev/react-lang` constrained to a shared component library (~54 OpenUI built-ins + `TaxMetric`). | This is the *interim* generative-UI path (decisions.md, 2026-10-09) — kept until a replacement reaches feature parity. Don't build a second, competing generative-UI mechanism; extend this one or replace it wholesale. |
| Predefined result cards | `tool-result-card.tsx` (~312), `tool-receipt.tsx` (~307), plus `WorkflowChoiceList`, `AgentRunReview`, `WebSearchCard`, `InlineFieldCard` | Structured, predefined renderers for manual tool runs, provenance ("Tools used"), workflow choices, agent-run review, web search, field results. | These are the "predefined UI elements" half of the chat's UI story — keep them small, single-purpose, and chat-native (card, not page). New structured results should extend this family before reaching for GenUI or a full page embed. |
| Full-page fallback | `features/assistant/ui/surface-embed.tsx` (~98) | Mounts a feature's real full page component inline, bounded only by `maxHeight: 440px` + scroll, when no compact "Embed" variant exists for that feature. | **This is the mechanism most likely to cause the "website bolted into chat" feeling.** Before adding anything new that uses `SurfaceEmbed`'s fallback path, write a real compact Embed instead — see Known smells below. |

## Computer delegation (Mkoro)

| Element | File(s) | Purpose | Contract |
| --- | --- | --- | --- |
| Delegation logic | `features/assistant/runtime/computer-delegation.ts` (~102) | Pure: builds idempotent request IDs, validates responses match the current thread/worker, bounds context returned to the model. | Screenshots/raw permissions never enter model context — only bounded text. |
| Settings | `features/assistant/mkoro/mkoro-panel.tsx` (~382) | Pick/pair/revoke a worker; opened from the composer. | Settings/pairing UI — not a chat-inline surface. |
| Inline chat cards | `mkoro-turn.tsx` (~145), `mkoro-chat-tasks.tsx` (~233) | One compact `MkoroTurn` card per delegated task (objective, live events, pending permissions), mounted directly in `assistant-thread.tsx`. | This is the correct pattern — chat-native cards, not a separate screen. Use this as the template for any new delegated-task UI, not `mkoro-screen.tsx`. |
| Larger surface | `features/assistant/mkoro/mkoro-screen.tsx` (~195) | A bigger, more standalone-feeling Mkoro view. | Unverified whether this is a standalone route/modal (fine) or gets pulled into the chat column (would be a smell). Confirm before extending it. |

## Known smells vs. "chat is the hub, not a website in a chat"

Ranked by how directly they work against the priority:

1. **`SurfaceEmbed`'s full-page fallback** (`surface-embed.tsx`) — **confirmed live, not theoretical, 2026-10-10**: only `features/workflow-builder/ui/builder-copilot.tsx` registers a compact `Embed` (`WorkflowGlance`) via `usePageChat`. None of the other ~10 registered pages (Sources, Connections, Help, Viewer, Worksheets, Workflows, Agent, FAPI, Surplus, T1134) do, and `bringIntoChat`'s tool description explicitly tells the model it may target "any registered page key," not just open ones — so asking Sina to "bring sources into the chat" (or any of the other 9) always hits the bounded 440px full-page fallback. Building 10 real compact Embeds is its own project, out of scope for a sweep; as a first, systemic mitigation, the fallback now has an "Open page" escape hatch (reuses the same dock-beside-chat navigation `chat-scope-menu.tsx`'s Browse Sources already uses) so a cramped embed isn't a dead end. Typecheck clean; **verified live end-to-end**: asked Sina "Bring the Sources page into this chat," it called `bringIntoChat('sources')`, the bounded fallback rendered with the new "Open page" button, and clicking it correctly docked the real Sources page beside the still-mounted chat. The remaining 9 pages still have no compact Embed — each would need one authored to actually fix the cramped-fallback experience; this change only ensures there's always a way out of it.
2. **`WorkflowSessionPanel`** (414 lines) is the literal full session surface (uploads, step accordion, worksheet, approvals) themed to sit in chat — not a trimmed card. Intentional and documented, but it's the single biggest "page in chat" today.
3. ~~`workflow-run-flow.tsx`~~ — **Resolved 2026-10-10.** Confirmed via whole-app search that `WorkflowRunFlow` and `RunProposalCard` were never rendered anywhere (imported, never used in JSX) — only `WorkflowElementCard` is live (`use-assistant.tsx`'s pinned-work list). Removed the dead ~950 lines and their now-unused imports in both consumers; file is 1,059 → ~105 lines. Typecheck clean, app verified working live (Scope bar, chat, no new console errors).
4. **`document-viewer.tsx`** (~801 lines, same `workspace/` directory as the compact embed helpers) — confirmed registered as the `viewer` page (resource-registry.tsx), so it's covered by item 1's fix (the "Open page" escape hatch) but still has no compact `Embed` of its own, same as the other 9 pages. No further action taken.
5. **`assistant-thread.tsx`** (~651) and **`use-assistant.tsx`** (~949) — not page-bolt-ons, but complexity concentration: nearly every new chat capability (tool, pinned card, menu) gets added to one of these two files. Highest-risk files for silent drift simply because everything touches them.

## Design polish backlog

The user flagged (2026-10-10) that several UI elements are visually/behaviorally
unrefined beyond just the Known smells above — functionally correct but not
polished. Log items here as they're found; this list is expected to grow.

- [x] **Scope bar** — was a flat, dot-joined text line that collapsed to vague
  "General chat" text when empty, and its expanded panel pushed the whole
  conversation down (reported with a screenshot, 2026-10-10). Rebuilt as a
  pill of distinct icon-tagged field segments with placeholders, a real
  headline result on the workflow segment, and a floating (non-pushing)
  expanded panel. Done this session — see the Scope bar row above.
- [x] **Mkoro task card showing for non-Mkoro users** — `mkoro-chat-tasks.tsx`
  polls every chat thread every 1.5s regardless of Mkoro usage; a background
  poll timeout (`AbortSignal.timeout`, browser message literally `"signal
  timed out"`) was shown raw as a card even with zero known tasks. Fixed:
  the card only renders once a real conversation is confirmed
  (`BoundTasks`'s `if (!conversations.length) return null`) — a transient
  poll error with nothing behind it is now silent instead of surfacing a
  cryptic technical message. Reproduced live and verified fixed, 2026-10-10.
- [x] **Scope bar illegible when the chat panel is narrowed (e.g. Sources
  docked open beside Chat)** — the bar's 4-segment layout assumed viewport
  width via `@media (max-width: 560px)`, which never fires on a normal-width
  desktop viewport even when a docked side panel squeezes the chat column
  itself down to ~270px, shrinking every field (e.g. "Northstar Inc") to an
  unreadable ellipsis sliver. Fixed by switching to the `chat-panel` named
  CSS container already declared in `assistant-thread.tsx` (used elsewhere
  for the same header's own restacking) — `@container chat-panel (max-width:
  460px)` hides Sources first, `(max-width: 340px)` hides Year next, keeping
  Company + Workflow (the two most identifying fields) visible longest.
  Verified live: company name now renders in full once Sources is shed.
  2026-10-10.
- [x] **Dead code: `WorkflowRunFlow` / `RunProposalCard`** (known smell #3,
  `workflow-run-flow.tsx`) — confirmed via whole-app search that neither was
  ever rendered (only `WorkflowElementCard` from that file is live, in
  `use-assistant.tsx`'s pinned-work list). Removed ~950 dead lines and the
  now-unused imports in both consumers (`use-assistant.tsx`,
  `workflow-page.tsx`); file went from 1,059 to ~105 lines. Typecheck clean,
  verified live with no regressions. 2026-10-10.
- [x] **Loading states read as "stuck," not "working"** — flagged by the user
  (2026-10-11) asking for visual/animation polish generally; recommended and
  scoped down to this specific gap because it was the roughest spot directly
  hit repeatedly this session. `workspace-startup.tsx` ("Connecting to your
  workspace…"), `workflow-page.tsx`'s `loadingWorkflowView` ("Loading
  workflow view…") and `resource-registry.tsx`'s generic lazy-page `Loading`
  were all bare static text on a blank area — indistinguishable from a hang.
  Fixed: a spinning icon + pulsing status text on the startup screen (kept
  deliberately light — "Public first paint only" — no new deps), and real
  `Skeleton`-based ghost layouts (icon + title bar + two-column canvas/panel
  shape) on the other two, using the existing `shared/ui/skeleton.tsx`
  primitive that was built but barely used. Also made `Skeleton` itself
  respect `prefers-reduced-motion` (`motion-safe:animate-pulse`, it wasn't
  before) and added a brief pop-in to `WorkflowBlockCard`'s readiness badge
  (`key`-ed on the readiness value, `motion-safe:animate-in zoom-in-90`) so a
  block turning "Computed" after a run reads as something that just
  happened. Verified live: caught the workflow-view skeleton mid-load via
  screenshot (correct ghost shape, resolves cleanly into the real canvas),
  confirmed the startup spinner renders, confirmed the badge renders
  correctly in the new shell. Typecheck and `format:check` clean.
  **Follow-up 2026-10-11**, reported directly against a screenshot: the
  startup screen's small added spinner wasn't enough — the rest of the page
  was still a disabled, pixel-perfect copy of the real sidebar/composer with
  real label and placeholder text, which read as "loaded but broken," not
  "loading." Rebuilt: nav labels, the heading and the composer's contents are
  now genuine `Skeleton` placeholders (no real copy pretending to be
  interactive), and the large `InScopeNeuMark` got its existing-but-unused
  `animate` prop (orbiting dot spirals, already `prefers-reduced-motion`-safe,
  built for exactly this and simply never turned on) — the brand mark is now
  the page's one real "this is alive" signal instead of a static logo sitting
  next to a tiny generic spinner. Typecheck and `format:check` clean, caught
  the new skeleton live mid-load via screenshot before the app moved on.
- [x] **Status badges used raw Tailwind shade pairs instead of the app's own
  tokens** — the user asked (2026-10-11) to address "the design elements that
  make it look AI-generated." Traced to a concrete, checkable thing rather
  than a vibe: the readiness badge just built used
  `bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 ...` — the
  exact light/dark shade-pair pattern every shadcn/v0/AI-coding-tool default
  reaches for — while `index.css`'s own `:root`/`.dark` theme (also, on
  inspection, unmodified shadcn boilerplate: stock `oklch(1 0 0)` background,
  stock radius, stock chart palette) had no semantic status color to draw
  from instead. Fixed: added `--success`/`--warning` tokens (light+dark pairs,
  same hue family and the same "brighten in .dark" tuning already used for
  `--destructive`) alongside the existing `--destructive`, mapped through
  `@theme inline` so `bg-success`, `text-warning`, `border-destructive/25`
  etc. all work as ordinary Tailwind utilities. Re-skinned
  `WorkflowBlockCard`'s readiness badge onto `bg-{token}/10 text-{token}
  border-{token}/25` — one class list per state instead of a hand-maintained
  light/dark pair, and it now reads from the app's own design tokens instead
  of a generic default. Scope was deliberately the readiness badge only, not
  a full sweep — other spots (warning banners in
  `calculation-engine-run-sections.tsx`, `field-worksheet-view.tsx`, etc.)
  still use raw Tailwind ambers and are candidates for the same treatment
  later. Verified live: badge renders correctly as a tinted amber pill
  against the new `--warning` token. Typecheck, `format:check` and
  `check:architecture` all clean.

  Process note: `prettier --write` on `index.css` reformatted the whole file
  (quote style, brace layout, trailing-zero trimming) even though
  `prettier --check` reported it clean beforehand — same trap as
  `configuration-overlay.tsx` earlier. Reverted from `git show HEAD:...` and
  reapplied the 13-line addition by hand in the file's existing style rather
  than rerun `--write` on it.
- [ ] *(add the next item here when found — file, what's wrong, what "good"
  looks like)*

## Maintenance

Update this file when: a change deliberately alters a documented contract (update the Contract column same-change), or a new chat-hub/workflow-block element is built (add a row). Don't let it go stale — a wrong registry is worse than no registry.

Last verified against code: 2026-10-11.
