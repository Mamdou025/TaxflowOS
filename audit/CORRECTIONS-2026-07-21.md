# Documentation Corrections — 2026-07-21 (errata)

*Doc-vs-code inconsistencies found by the deep audit and verified against source. The highest-value items are already corrected in-place in the audit files; this file is the complete record. See [`DEEP-AUDIT-2026-07-21.md`](./DEEP-AUDIT-2026-07-21.md).*

---

# Audit / README Corrections Checklist

Grouped by file. Each item quotes the current wrong text (with line number) and gives the correct value. All corrections are backed by the dimension findings and verification verdicts; verified directly against code (`next` = 16.0.10, `WORKFLOW_CONFIGS` = 4, `app/page.tsx` renders `ChatWorkspace`, the 6 chat‑agent files are deleted, editor page = 760 lines).

---

## `audit/INDEX.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 4 | `*Last updated: 2026-06-07*` | Bump to the newest content date (file has entries through **2026‑07‑20**; today is 2026‑07‑21). |
| 22 | `## App State Summary (2026-05-17)` | Update heading date to current (≥ 2026‑07‑20). |
| 28 | `Next.js 15 (App Router) · React 19 …` | **Next.js 16** (App Router). `package.json` pins `next 16.0.10`. |
| 34 | `**7 block families:** Trigger · Source · Logic · Review/Validation · Field · Output · AI/Agent` | Palette count of 7 is correct, but add a note: **`Protected` is an internal 8th `BlockFamily`** (governed values, not in the public palette) per `src/domain/workflow/block-types.ts:16-19`. |
| 42 | `**2 starter templates** (FAPI Calculation, Roulement fiscal art. 85)` | **4 workflow templates** (FAPI, Roulement art. 85, Employee Expense, Marketing Campaign). `lib/workflow-runs/index.ts` registers `{fapi, roulement, expense, campaign}`; contradicted by INDEX.md:91/96. |
| 50 | `**Homepage:** `/` → `OrbitalStage` (neumorphic orbs + AI chat)` | `app/page.tsx` → **`ChatWorkspace`** (`components/workspace/copilot-workspace-panel.tsx`). `OrbitalStage` survives only in the dead tax‑ui island. |
| 52 | `**Builder:** `/builder` → `WorkflowStudioShell` + `NodeConfigPanel` overlaid on `PersistentCanvas`` | `/builder` uses **`inline-builder.tsx` / `RightPanelShell` + `BuilderCopilot`**. `workflow-studio-shell.tsx` is dead (0 importers) and does not back `/builder`. |
| 69 | `runFapiLoop(state)` (`lib/fapi-run.ts`) runs the real engine …` (described as the live run loop) | `lib/fapi-run.ts` is **deleted**; the live run loop is `lib/workflow-runs/` (`runTemplateLoop` in `engine.ts`). (Self‑contradicted by INDEX.md:99.) |
| 134 | `### Active development areas (branch: Sampledata)` | Current branch is **Neumorphic** (theme work); update or drop the stale branch label + file list. |
| 146 | `components/workflow/workflow-studio-shell.tsx — shell restructuring` (listed as active dev) | File is **dead code** (1426 lines, 0 importers), not active. Remove or mark dead. |
| 186 | `| Main shell component | `components/workflow/workflow-studio-shell.tsx` |` | Wrong — this file is dead/superseded. The landing shell is `ChatWorkspace` (`copilot-workspace-panel.tsx`); the builder shell is `inline-builder.tsx` / `right-panel-shell.tsx`. |

---

## `audit/ARCHITECTURE.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 3 | `*Last updated: 2026-07-17*` | Bump to newest content date (file has 2026‑07‑19 sections at lines 415, 421). |
| 9 | `A fiscal workflow automation platform built on Next.js 15, …` | **Next.js 16**. |
| 17 | `| Framework | Next.js 15 (App Router) |` | **Next.js 16 (App Router)**. |
| 271 | `| `/` | `app/page.tsx` | Home — loads local workflow or demo |` | `app/page.tsx` renders **`ChatWorkspace`** (the assistant/chat), not a workflow/demo loader. |
| 273 | `| … `app/workflows/[workflowId]/page.tsx` | Full workflow editor (750 lines) |` | **760 lines** (or drop the hard line count). Optionally add `/builder` and `/run/[workflowId]` rows to the route table. |
| 283 | `| POST /api/chat-workspace | `app/api/chat-workspace/route.ts` | Legacy custom agent (superseded by CopilotKit; still present) |` | Route file is **deleted** — remove the row. Live chat runtime is `app/api/copilotkit/route.ts`. |
| 293–336 | `## Chat Workspace Agent (server-side LLM tool-calling)` section describing `callChatAgent` [`lib/chat-agent.ts`] (299), `resolveModel()` (310), `runFapiLoop` [`lib/fapi-run.ts`] (312), `runFapiCore` (324) | **All three files deleted** (`lib/chat-agent.ts`, `lib/fapi-run.ts`, `app/api/chat-workspace/route.ts`). Rewrite/remove this whole section; the live path is `app/api/copilotkit/route.ts` + `lib/workflow-runs/engine.ts` (`runTemplateLoop`). |
| 516 | `**Now server-side:** the chat workspace agent (`/api/chat-workspace`) — …` | Point at **`/api/copilotkit`** (`app/api/copilotkit/route.ts`), the current server-side chat runtime. |

---

## `audit/BLOCKS.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 3 | `*Last updated: 2026-05-18*` | Stale — bump to current app state. |
| 11 | `**Families (7):** Trigger · Source · Logic · Review/Validation · Field · Output · AI/Agent` | Correct for the public palette, but add a one‑line note: **`Protected` is an internal 8th family** (governed values) used by the tool registry (`lib/local-tool-registry.ts:5875-5878`) and the BLOCKS.md edge table (Logic→Protected, Protected→Output, lines 441‑443), so its appearance there isn't orphaned. |
| 13 | `**Registered tool modules (11):**` | **Accurate — no change** (11 = 7 source + 4 logic backend `run.ts`). Listed here only to confirm it was checked. |

---

## `audit/FEATURES.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 3 | `*Last updated: 2026-07-17*` | Bump — file has 2026‑07‑20 rows (lines 143‑145). |
| 142 | `Large agentic chat panel (de-modalized) | `[LIVE]` | `chat-workspace-panel.tsx`; opened via `ActionOrb`…` | File **deleted** — mark `[REMOVED]`; behavior now in `copilot-workspace-panel.tsx`. |
| 163 | `Run → resolve → resume loop | `[LIVE]` | `runFapiLoop()` (`lib/fapi-run.ts`) + `BlockerCard`…` | `lib/fapi-run.ts` **deleted**; the loop is now `lib/workflow-runs/engine.ts` (`runTemplateLoop`) + `WorkflowRunFlow`. |
| 177 | `Legacy custom chat agent (AI SDK route) | `[SUPERSEDED]` | `app/api/chat-workspace/route.ts` + old `chat-workspace-panel.tsx` — … retained as reference…` | Both files **deleted**, not "retained" — mark `[REMOVED]`. |
| 183 | `Real FAPI computation behind the run | `[LIVE]` | `lib/fapi-run.ts` — `runFapiCore()`…` | `lib/fapi-run.ts` **deleted** — retarget to `lib/workflow-runs/` (`runTemplateCore` / `runLocalWorkflowTools`). |

---

## `audit/UI.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 3 | `*Last updated: 2026-07-17*` | Bump — file has 2026‑07‑20 / 2026‑07‑21 sections (lines 28, 42‑43). |
| 13 | `└── workflow-studio-shell.tsx          ← main shell` (layout diagram) | `workflow-studio-shell.tsx` is **dead** (0 importers). Remove from the layout diagram; the `/workflows/[workflowId]` route mounts `NodeConfigPanel`, not this shell. |
| 91 | `**Orb** (`action-orb.tsx`) now calls `setAssistantOpen(v => !v)` …` | `action-orb.tsx` **deleted** — reword to past tense (already noted deleted at UI.md:51). |
| 247 | `**ActionOrb repurposed** (`action-orb.tsx`): … it's now a **single-tap chat-opener**…` | `action-orb.tsx` **deleted** — past‑tense. |
| 291 | `… `action-orb.tsx` now returns null while `chatWorkspaceOpenAtom` is open…` | `action-orb.tsx` **deleted** — past‑tense. |
| 298 | `### `components/workspace/chat-workspace-panel.tsx` [SUPERSEDED — 2026-07-13, retained for Phase-3 reference]` (+ section 298‑314) | File **deleted**, not "retained" — mark `[REMOVED]` / fold the section; behavior now in `copilot-workspace-panel.tsx`. |
| 323 | `### `components/workspace/entity-text.tsx` [LIVE — 2026-07-10]` | File **deleted** — remove/fold heading; chip rendering now via `resource-registry.tsx`. |
| 354–362 | `### `workflow-studio-shell.tsx` … **Role:** Top-level orchestrator that wires together the canvas, inspector, toolbar…` | File is **dead code** (superseded; 0 importers). Mark `[REMOVED]`/dead — it no longer orchestrates the app. |

Note (no change required now): UI.md:40 and UI.md:269 already correctly describe `tax-ui/pages/FapiWorksheet.tsx` as dead/replaced — accurate today; only drop those mentions **if/when** that file is deleted.

---

## `audit/TYPES.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 3 | `*Last updated: 2026-07-17*` | Bump — file has 2026‑07‑18 content (line 29+). |

(Note: TYPES.md:7 correctly documents the 7‑public / 8‑internal `Protected` family split — no change; it's the model BLOCKS.md/INDEX.md should mirror.)

---

## `README.md`

| Line | Current (wrong) text | Correct value |
|---|---|---|
| 1 | `# AI Workflow Builder Template` | Describes the upstream boilerplate, not **TaxflowOS** (fiscal workflow automation studio). Rewrite the title/intro, or add an explicit note that this documents the upstream template scaffolding. |
| 3 / 19‑30 | Boilerplate description + generic "What's Included" (Workflow DevKit, Resend/Linear/Slack integrations, `"use workflow"` code‑gen) | Reframe to the current app (fiscal studio, tax worksheets, CopilotKit assistant, GenUI, plugins) or clearly label as upstream‑template scaffolding. |
| 275 | `**Framework**: Next.js 16 with React 19` | **Correct — no change** (matches `package.json`). Listed to confirm it was checked. |
| 283 | `**AI**: OpenAI GPT-5` | Wrong — chat default is **`gpt-4o` / AI Gateway** per ARCHITECTURE.md (e.g. `OPENAI_CHAT_MODEL` default `gpt-4o`); GenUI uses `gpt-4.1`. Align the model claim. |

---

### Explicitly NOT corrections (verified accurate — do not "fix")
- "11 registered tool modules" (ARCHITECTURE.md:53‑54, BLOCKS.md:13, INDEX.md:35, 182) — matches 11 backend `run.ts` (7 source + 4 logic).
- "7 public block families" — matches `PUBLIC_BLOCK_FAMILIES`.
- README.md:275 "Next.js 16", React 19.2.1, `@xyflow/react` v12, Jotai v2, AI SDK v5 — all correct.
- UI.md:40 / :269 `tax-ui/pages/FapiWorksheet.tsx` described as dead/duplicate — already accurate.