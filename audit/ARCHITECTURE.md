# Architecture

*Last updated: 2026-07-21*

---

## Overview

A fiscal workflow automation platform built on Next.js 16, React Flow, and Jotai. The app lets users build node-based data transformation workflows with strong emphasis on evidence tracking, data governance, and audit compliance. All execution currently runs locally in-browser (no server-side compute for block runs).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS, Radix UI |
| Canvas | @xyflow/react (React Flow) v12 |
| State | Jotai v2 (atom-based) |
| Code editor | Monaco Editor |
| Database ORM | Drizzle ORM + postgres |
| Auth | better-auth |
| AI | Vercel AI SDK v5 + OpenAI |
| Spreadsheet | xlsx |
| ID generation | nanoid |

---

## Layer Model

The app has four distinct layers. Data moves down (canvas → domain → backend → runtime) and results flow back up.

```
┌──────────────────────────────────────────────────┐
│  Canvas Layer (React Flow)                        │
│  WorkflowNode[], WorkflowEdge[] — UI positions   │
│  Managed by workflow-store.ts Jotai atoms         │
└──────────────────┬───────────────────────────────┘
                   │ serialize / deserialize
                   │ createWorkflowDefinitionFromCanvas()
                   │ workflowDefinitionToCanvas()
┌──────────────────▼───────────────────────────────┐
│  Domain Layer (src/domain/workflow/)              │
│  WorkflowDefinition, WorkflowBlock, WorkflowEdge  │
│  Typed schema, rules, validation                  │
└──────────────────┬───────────────────────────────┘
                   │ block.config.toolId lookup
                   │ getToolForBlock()
┌──────────────────▼───────────────────────────────┐
│  Tool Registry (lib/local-tool-registry.ts)       │
│  LOCAL_TOOL_REGISTRY: Record<toolId, ToolDef>     │
│  11 registered tool modules                       │
└──────────────────┬───────────────────────────────┘
                   │ executeTool()
┌──────────────────▼───────────────────────────────┐
│  Backend Runtime (backend/runtime/ + blocks/)     │
│  Per-block run.ts functions                       │
│  Evidence refs, source trace, lineage             │
└──────────────────────────────────────────────────┘
```

---

## Execution Model

**Entry point:** `lib/local-tool-runner.ts` → `runLocalWorkflowTools()`

**Execution modes:**
| Mode | What runs |
|---|---|
| `"workflow"` | All blocks in topological order |
| `"selected"` | Selected block + all ancestors |
| `"downstream"` | Selected block + ancestors + descendants |

**Algorithm (Kahn's topological sort):**
1. Convert canvas nodes/edges to a `WorkflowDefinition`
2. Filter only `active` edges
3. Build an in-degree map from active edges
4. Kahn's algorithm produces ordered block list
5. Each block is executed sequentially
6. Upstream outputs are injected into the next block's `ToolExecutionContext`
7. Evidence refs and source trace refs are accumulated and deduped
8. Final `WorkflowRunResult` aggregates all `ToolRunResult`s

**Status priority (highest wins):** `error > warning > skipped > success`

**Result shape:**
```typescript
{
  blockStatuses: Record<blockId, "error" | "success">,
  edgeStatuses: Record<edgeId, "error" | "success" | "warning">,
  record: LocalRunRecord,
  result: WorkflowRunResult
}
```

---

## State Management

**Technology:** Jotai v2 atoms — decoupled reactive state, no Redux/Context tree.

**Atom groups:**

### Canvas State
| Atom | Type | Purpose |
|---|---|---|
| `nodesAtom` | `WorkflowNode[]` | All canvas nodes |
| `edgesAtom` | `WorkflowEdge[]` | All canvas edges |
| `selectedNodeAtom` | `string \| null` | Currently selected block ID |
| `selectedEdgeAtom` | `string \| null` | Currently selected edge ID |
| `currentWorkflowIdAtom` | `string \| null` | Active workflow ID |
| `currentWorkflowNameAtom` | `string` | Active workflow name |
| `currentWorkflowVisibilityAtom` | `"private" \| "public"` | Sharing state |
| `isWorkflowOwnerAtom` | `boolean` | Ownership flag |

### Execution State
| Atom | Type | Purpose |
|---|---|---|
| `isExecutingAtom` | `boolean` | Block run in progress |
| `isLoadingAtom` | `boolean` | Workflow loading |
| `isGeneratingAtom` | `boolean` | AI generation in progress |
| `selectedExecutionIdAtom` | `string \| null` | Active run ID |
| `executionLogsAtom` | `Record<string, ExecutionLogEntry>` | Per-block logs |
| `triggerExecuteAtom` | `boolean` | Triggers a run cycle |

### UI State
| Atom | Type | Purpose |
|---|---|---|
| `propertiesPanelActiveTabAtom` | `string` | Active inspector tab |
| `showMinimapAtom` | `boolean` | Minimap toggle |
| `rightPanelWidthAtom` | `string \| null` | Inspector panel width |
| `isPanelAnimatingAtom` | `boolean` | Animation in progress |
| `hasSidebarBeenShownAtom` | `boolean` | Sidebar shown once |
| `isSidebarCollapsedAtom` | `boolean` | Sidebar collapsed |
| `isTransitioningFromHomepageAtom` | `boolean` | Homepage nav state |
| `pendingIntegrationNodesAtom` | `Set<string>` | Nodes awaiting integration |
| `newlyCreatedNodeIdAtom` | `string \| null` | ID of just-added block |

### Save State
| Atom | Type | Purpose |
|---|---|---|
| `hasUnsavedChangesAtom` | `boolean` | Dirty flag |
| `isSavingAtom` | `boolean` | Save in progress |
| `workflowNotFoundAtom` | `boolean` | 404 state |
| `showClearDialogAtom` | `boolean` | Clear confirmation dialog |
| `showDeleteDialogAtom` | `boolean` | Delete confirmation dialog |

### History (Undo/Redo)
| Atom | Purpose |
|---|---|
| `historyAtom` | Past workflow states (undo stack) |
| `futureAtom` | Future workflow states (redo stack) |
| `undoAtom` | Write atom: pop history, push to future |
| `redoAtom` | Write atom: pop future, push to history |
| `canUndoAtom` | Derived: `history.length > 0` |
| `canRedoAtom` | Derived: `future.length > 0` |

### Event Tracking
| Atom | Purpose |
|---|---|
| `workflowChangeEventsAtom` | Structural workflow changes |
| `workflowAuditEventsAtom` | Governance audit events |

### Write Atoms (workflow commands — command pattern)
| Atom | What it does |
|---|---|
| `onNodesChangeAtom` | Applies React Flow node change events |
| `onEdgesChangeAtom` | Applies React Flow edge change events |
| `addNodeAtom` | Adds a new block to canvas |
| `connectBlocksAtom` | Creates an edge between two blocks |
| `updateNodeDataAtom` | Updates block data/config |
| `deleteNodeAtom` | Removes a block |
| `deleteEdgeAtom` | Removes an edge |
| `updateEdgeDataAtom` | Updates edge metadata |
| `insertBlockBetweenEdgeAtom` | Splits an edge by inserting a block |
| `deleteSelectedItemsAtom` | Batch delete selection |
| `clearWorkflowAtom` | Wipes entire workflow |

### Async Write Atoms
| Atom | Behavior |
|---|---|
| `autosaveAtom` | Debounced 1s save; immediate for structural changes |
| `loadWorkflowAtom` | Loads from database |
| `saveWorkflowAsAtom` | Save with new name |

---

## Data Flow (End to End)

```
User places block on canvas
        ↓
addNodeAtom → nodesAtom updated
        ↓
User connects two blocks
        ↓
connectBlocksAtom → edgesAtom updated
        ↓
User clicks Run
        ↓
triggerExecuteAtom = true → runLocalWorkflowTools() called
        ↓
Canvas nodes/edges → WorkflowDefinition (serialization)
        ↓
Topological sort of blocks
        ↓
For each block in order:
  getToolForBlock() → ToolDefinition
  executeTool(toolId, context) → ToolRunResult
  Accumulate evidenceRefs, sourceTrace
        ↓
WorkflowRunResult assembled
        ↓
blockStatuses / edgeStatuses written to atoms
        ↓
React Flow node styles update (color = status)
        ↓
Inspector panel shows run logs + output
```

---

## Serialization

**Canvas → Domain:** `createWorkflowDefinitionFromCanvas(edges, nodes, name, status)` in `lib/local-fiscal-workflow.ts`

**Domain → Canvas:** `workflowDefinitionToCanvas(definition)` in same file

**Local persistence:**
- `LOCAL_WORKFLOW_STORAGE_KEY = "workflow-studio.local-workflow"` → localStorage
- `LOCAL_RUNS_STORAGE_KEY = "workflow-studio.local-runs"` → localStorage
- `saveLocalWorkflowSnapshot()` / `loadLocalWorkflowSnapshot()`

---

## Evidence & Governance System

This is the core domain concept. Every data value that flows through the workflow carries lineage.

**`EvidenceRef`** — a pointer to a source value:
```
evidenceId, sourceBlockId, sourceLabel, immutable, label?, locator?, rowId?, valuePreview?
```

**`SourceTraceRef`** — the ancestry chain for a derived value:
```
sourceBlockId, sourceLabel, evidenceRefId?, relationshipPath[], rowId?, valuePreview?
```

**`SourceMetadata`** (on a block) — marks blocks as immutable truth:
- `sourceType`, `locator`, `valuePreview`
- `immutable` — cannot be overwritten
- `treatedAsEvidence` — participates in audit trail
- `labelLocked`, `locatorLocked`, `valuesLocked`

**`GovernanceMetadata`** (on a block) — marks blocks as protected:
- `protected` — value is governed
- `protectedKind` — `input | result | official-line | locked-rate | final-reviewed-amount | summary-result`
- `steward` — owner of this value
- `lockedInRuntime`, `requiresUnlockToEdit`
- `approvalState` — `draft | review-required | approved`

---

## Route Structure (Next.js App Router)

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — renders `ChatWorkspace` (`copilot-workspace-panel.tsx`), the assistant/chat surface |
| `/workflows` | `app/workflows/page.tsx` | Redirects to most recent |
| `/workflows/[workflowId]` | `app/workflows/[workflowId]/page.tsx` | Full workflow editor (~760 lines) — legacy `NodeConfigPanel` surface |
| `/builder` | `app/builder/page.tsx` | Current workflow builder (canvas + `configuration-overlay`) |
| `/run/[workflowId]` | `app/run/[workflowId]/page.tsx` | Inline run view (`WorkflowRunFlow`) |
| `/viewer` | `app/viewer/page.tsx` | **Document Viewer** — open/read PDF · Excel · Word in-app (`components/workspace/document-viewer.tsx`). Sidebar + bounded panel; top-nav "Documents" |

**AI API routes:**
| Route | File | Purpose |
|---|---|---|
| `POST /api/ai/generate` | `app/api/ai/generate/route.ts` | Builder: NL → workflow (JSONL op stream) |
| `POST /api/copilotkit` | `app/api/copilotkit/route.ts` | **CopilotKit runtime** (CopilotRuntime + OpenAIAdapter) — powers the chat panel. Uses `OPENAI_API_KEY`. Middleware runs the intent gate + per-turn model tiering + orphan repair |
| `GET/POST/DELETE /api/assistant/memory` | `app/api/assistant/memory/route.ts` | **Durable assistant memory** — list/save/forget the session user's remembered facts (`assistant_memories`). better-auth scoped, fail-soft |
| `POST /api/assistant/extract` | `app/api/assistant/extract/route.ts` | **Attachment/document text extraction** (Node runtime) — file → text: PDF via `unpdf`, Word `.docx` via `mammoth`, plain-text UTF-8. Capped 120k chars + `truncated`; scanned PDF → 422 "needs OCR". Shared by the chat's `onAttach` and the Document Viewer's auto-context (a doc opened in the viewer auto-attaches to `attachedDocsAtom`) |
| ~~`POST /api/chat-workspace`~~ | *(deleted)* | **[REMOVED]** — the custom agent route + `lib/chat-agent.ts` + `lib/fapi-run.ts` were deleted 2026-07-13. Live chat runtime is `/api/copilotkit` + `lib/workflow-runs/engine.ts` (`runTemplateLoop`). |
| `GET /api/fx-rate` | `app/api/fx-rate/route.ts` | **Live Bank of Canada Valet FX fetch** (`?from=USD&to=CAD&year=2025` → `fetchAnnualAverageExchangeRate`). Real source behind the FAPI `fapi-api-boc-fx` API block; server-side (avoids CORS); `ok:false` + reason on failure so callers fall back to the override rate |
| `GET /api/google/status` | `app/api/google/status/route.ts` | Whether the session user has Google connected with Drive+Gmail scopes. Never 500s (returns `connected:false`) so the picker degrades gracefully when unconfigured |
| `GET /api/google/drive/files` | `app/api/google/drive/files/route.ts` | List the user's Drive spreadsheets (native `.xlsx` + Google Sheets); optional `?q=` name filter |
| `GET /api/google/drive/files/[fileId]/content` | `.../content/route.ts` | Stream a Drive workbook's **raw bytes** (Google Sheets exported to xlsx) for client-side parse |
| `GET /api/google/gmail/messages` | `app/api/google/gmail/messages/route.ts` | Recent emails carrying `.xlsx`/`.xls` attachments + each attachment's id; optional `?q=` |
| `GET /api/google/gmail/messages/[messageId]/attachments/[attachmentId]` | `.../route.ts` | Stream a Gmail attachment's **raw bytes** for client-side parse |

---

## Chat Workspace Agent (server-side LLM tool-calling) — ⚠️ [SUPERSEDED / files deleted]

> **This section describes a subsystem that no longer exists.** `lib/chat-agent.ts`, `lib/fapi-run.ts`, and `app/api/chat-workspace/route.ts` were all **deleted 2026-07-13** (see INDEX.md log). The live server-side chat path is now `app/api/copilotkit/route.ts` (CopilotKit `BuiltInAgent` + intent-gate/model-tiering/orphan-repair middleware) with the run loop in `lib/workflow-runs/engine.ts` (`runTemplateLoop`). The flow below is retained only as historical reference and should not be treated as current architecture.

The first real server compute in the chat path. Flow:

```
Panel send() (client)
   → callChatAgent({ message, context, history, catalog }) [lib/chat-agent.ts]
     catalog = buildAgentCatalog() from the resource registry (pages/anchors/fields/routes)
   → POST /api/chat-workspace  (better-auth session required)
     → generateText({ model: 'openai/gpt-5.1-instant', system, messages, tools, toolChoice:'auto' })
       tools built from the catalog; NO execute → model emits tool-calls as data and stops
   → { text, toolCalls[] } back to client
   → executeAgent() runs each tool-call against the workspace atoms
     openPage · focusAnchor · editField · closePage · closeAll · openWorkflowBuilder · runFapiDemo
   → on any failure (no key / signed-out / offline): runDeterministic() keyword fallback
```

Model resolution (`resolveModel()` in the route): `OPENAI_API_KEY` → `@ai-sdk/openai` provider directly (`OPENAI_CHAT_MODEL`, default `gpt-4o`); else `AI_GATEWAY_API_KEY` → the gateway string model (`openai/gpt-5.1-instant`, same as `/api/ai/generate`); else 500 → client falls back to the deterministic resolvers. Keys live in `.env.local` (gitignored). The registry is the single source of truth for the tool enums, so the model can never target a page/anchor/field that doesn't exist.

**Run → resolve → resume loop (`lib/fapi-run.ts` `runFapiLoop`).** The FAPI run is interactive. `runFapiLoop(state: FapiLoopState)` runs the real engine against the accumulated resolutions and returns the next blocker (or `done`):

```
runFapiLoop(state):
  !state.uploaded            → blocker 'upload'      (needs the trial balance)
  run with rows + overrides  → mapper unmatchedRows  → blocker 'categorize' (assign a category → injected as a keyword rule, re-run)
  all classified, !approved  → blocker 'approval'    (final sign-off, with the computed preview)
  else                       → { done: true, result }
```

The panel accumulates each resolution into `FapiLoopState` (uploaded / overrides / approved) and re-runs until done. The `categorize` resolution appends a keyword rule to the mapper's `config.keywordRules`; verified that resolving the ambiguous row lifts GROSS 25,000 → 29,500. Approval is currently a UI gate (Step 2 will route it through `GovernanceMetadata.approvalState`).

**Real FAPI computation (`runFapiCore`).** Underneath the loop, each run is the actual engine, entirely client-side and without touching the user's saved workflow:

```
createFapiTemplateWorkflow()                    // fresh FAPI template snapshot
  → inject SAMPLE_TRIAL_BALANCE into the trial-balance source (template is upload-first)
  → workflowDefinitionToCanvas(snapshot)        // domain → canvas nodes/edges
  → runLocalWorkflowTools({ nodes, edges })     // the same deterministic runner the studio uses
  → read result.results[].output.calculatedResults
      lines engine  (fapi-logic-lines-engine)   → A, EXPENSES, 95(2), A1, A2, B, C, D, E, F, F1, G, H
      summary engine(fapi-logic-summary-engine) → GROSS, DEDUCTIONS, FAPI_BRUT, FAT_DEDUCTION, NET_FAPI, FX_RATE, NET_FAPI_CAD
```

The pipeline is Excel source → keyword mapper → category rollup → two-stage calculation engine. Verified end-to-end: GROSS 25,000 USD → Net FAPI 24,810 USD → 33,493.50 CAD at 1.35 FX. The injected trial balance stands in for the parsed email attachment; wiring a real Gmail/Drive attachment is the remaining `[PLANNED]` piece.

**Full FAPI line set (2026-07-13):** the lines engine now computes the whole Platform skeleton — `A = P × (income_bucket − expense_bucket) + 95(2)`, plus display lines `EXPENSES` (`P × expense_bucket`) and `COMPUTATION_95_4` (the 95(2) amount, which also flows into A), and `A1 (=2×debtForgiveness), A2, B, C, D, E, F, F1, G, H`. The A1/A2/C–H amounts, the **P-coefficient**, and the **95(2)** amount are workbook assumptions fed by the extended **FAPI Inputs** block (`fapi-source-inputs`, `source.fapi_inputs`) and exposed as **editable inputs** in the run. No new engine operation was needed — line A uses the calc engine's `formulaExpression` grammar (`+ − * /`, parens, `max/min/…`), and `getNamedValues` already merges `fapi_inputs` keys as operands. RTF is snapped to `{1.9, 4}` in the inputs block. This keeps ONE engine (`runLocalWorkflowTools`) as the single source of truth — the FAPI worksheet (Phase 2) will read these lines directly, so worksheet/chat/canvas stay identical. `lib/fapi/calculation-engine.ts` (the parity port) is deliberately **not** wired, to avoid a second calc path.

**Classification-fed inputs — worksheet/chat parity fix (2026-07-16):** lines **C, A.1, D, E** (`cfaIncome`, `debtForgiveness`, `businessLosses`, `faclCarryforward`) are produced by *classifying* trial-balance rows — the rollup emits them as named values, and in the calc engine **`fapi_inputs` config wins over the rollup**. They're also exposed as editable inputs, so injecting their default (`0`) into `fapi-source-inputs` **clobbers the classified value to 0**. The worksheet seeded *every* editable input with its default on mount, so it zeroed C/A.1/D/E; the chat run seeds none until edited, so classification flowed through — the two paths disagreed for any uploaded row hitting those lines (e.g. a 4,500 CFA-income row: chat GROSS 33,500 / worksheet 25,000). Fix is two-layer: `EditableInput.classificationFed` (marked on those four in `fapi.ts`) makes `runTemplateCore` **skip injection while the value equals its default** (`engine.ts`), and the worksheet no longer seeds classification-fed keys (`fapi-worksheet.tsx`) — until edited, those lines read the classified figure via `val()`. Result: worksheet ≡ chat on identical rows; editing a line to a non-default value still overrides as before. Verified against sample + synthetic CFA/debt-forgiveness rows.

**Worksheet retrieval layer — `lib/worksheet-intel/` (Worksheet-intelligence, 2026-07-16; Phase 1 FAPI-only → Phase 2 generalized over `TemplateConfig`):** the assistant answers questions about a worksheet by **reusing the run engine as a retrieval primitive**, not by indexing documents. The key design call: the worksheet's data splits into *computed* figures (recompute — never embed; they change every run) and *static* explanatory text (formula descriptions — small enough to feed/lexically search). **Generalization via inversion of control** — the four worksheet families share no internal data model (FAPI/Roulement use `TemplateConfig`+`runTemplateCore`; T1134/Surplus/Exec-Overview are bespoke static React; builder worksheets are `WorksheetPageView` over canvas nodes), so instead of one service reaching into each, there's one **`WorksheetIntel` contract** (`types.ts`) and a generic adapter. `createTemplateIntel(config, {rows, inputs})` (`template-adapter.ts`) builds a full intel for ANY `TemplateConfig`: it calls the SAME `runTemplateCore(config, { rows, overrides:[], inputs })` the sheet renders (UI parity), derives the line catalog from `CoreResult.detail.lines/summary` (the unified `{key,label,value,formula}` that works for both the rules path and `computeExtra`), and resolves each operand to its live value via `summaryValues → lineValues → detail.buckets → mergedInputs → params`. It handles **both** rule shapes — FAPI's `formulaExpression` (parse identifiers) and Roulement's `operands`+`operation` (use the operands list). Per-line provenance is opt-in via `TemplateConfig.worksheetProvenance` (FAPI maps A/EXP/B → classified income/expense/capgains rows). Each open worksheet mounts the generic headless **`WorksheetCopilot`** (one snapshot readable + registers its live intel in `worksheetIntelRegistryAtom`); the three actions (`explainWorksheetLine`/`whyWorksheetValue`/`searchWorksheet`) are registered **once** in `use-assistant.tsx` and dispatch through the registry by an optional `worksheet` id (read at call time via jotai `useStore()` — no re-render), so any number of worksheets are answerable with unique action names. **Same parity invariant as the two fixes below** — both the sheet and the intel resolve rows as `uploadedRowsAtom[id]?.rows ?? sampleRows` and run the identical engine, so the assistant can never quote a number the sheet doesn't show. Verified on FAPI + Roulement. A semantic index (Orama in-process, or pgvector on the existing Drizzle/Postgres) remains a later add only if a fuzzy-language corpus appears; bespoke worksheets can join by implementing `WorksheetIntel` over their static data.

**Stale source rows — worksheet/chat parity fix #2 (2026-07-16):** a *separate* break in the same invariant, on the **rows** dimension. `uploadedRowsAtom` (persisted, `taxflow:uploaded-source-rows`) is meant to be the single source of truth; the **worksheet reads it live**, but `WorkflowRunFlow` only hydrated it **once at mount** (a `hydratedRef` snapshot) and its "Use sample workbook" path left stale imported rows in the store. So a workbook imported via the worksheet's **Import** button — or imported after the run had mounted — never reached the run: the run computed on `sampleRows` (GROSS 25,000) while the worksheet showed the imported file (e.g. 213,922). Fix (`components/workspace/workflow-run-flow.tsx`): the run reads the store **live** and derives `effectiveState = storeRows ? { ...state, rows: storeRows, uploaded: true } : state` (the upload step is auto-satisfied when a document already exists); "Use sample workbook" now **deletes** the store entry so both surfaces fall back to the sample together. Both surfaces now resolve rows identically as `uploadedRowsAtom[id]?.rows ?? sampleRows`. Verified: same stored rows → worksheet GROSS 216,000 ≡ run headline 216,000 (Net FAPI 215,810). *(Known follow-up: `runToCompletion` — used by the summoned `WorkflowElementCard` "output" — still always uses `sampleRows`, so that card can differ from the run/worksheet; the interactive run + worksheet are aligned.)*

**Unshared run edits — worksheet/chat parity fix #3 (2026-07-16):** the *third and last* dimension of the same invariant — the run's **edited inputs** and **category overrides**. A run computes on three decision surfaces: rows, inputs (rates/assumptions/line overrides), and per-row category overrides. Only **rows** were shared (`uploadedRowsAtom`); `inputs` and `overrides` lived in `WorkflowRunFlow`'s local `useState`, and the worksheet recomputed with `overrides: []` and its own default-seeded inputs. So **any** in-run adjustment — a live-fetched FX rate, a changed inclusion rate / 95(2) / FAT, or re-categorizing a row — moved the chat's figures but was dropped when the worksheet mounted (baseline with zero edits already matched, via fix #1). The chat's "final result" is read from `activeRunAtom` (run-local state) while the worksheet + its `WorksheetCopilot` intel recompute independently, so the two AI surfaces disagreed too. Fix: a new shared, persisted **`runEditsAtom`** (`taxflow:run-edits`, keyed by workflow id → `{ inputs, overrides }`) in `lib/workspace-store.ts` — the companion to `uploadedRowsAtom`. `WorkflowRunFlow` keeps only the flow gates (`uploaded/elected/approved/rows`) local and sources `inputs`/`overrides` from the atom (writes via `setRunInputAtom`/`setRunOverrideAtom`/`setRunEditsAtom`); the worksheet seeds `inputs` as `{ ...defaults, ...edits.inputs }` and passes overrides through the new exported **`buildOverrideRules(config, rows, overrides)`** helper (`engine.ts`, extracted from `runTemplateLoop` so the `rowId → OverrideRule` conversion is shared by the loop AND the worksheet's direct `runTemplateCore` call). All three decision surfaces now flow through one source of truth, live in both directions. The classification-fed guard (fix #1) is unchanged and still protects C/A.1/D/E when those inputs sit at their default.

## Chat runtime: specialists — "one assistant, many hats" (2026-07-18)

Multiple agents done the right way: ONE conductor + ONE conversation, but each turn the assistant adopts the domain specialist that fits (Sofi=FAPI, Théo=roulement art.85, Mira=expense, Nova=campaign). Only the persona + domain expertise (and the already route-scoped tools) change — no independent competing agents.

- **Selection** (`lib/assistant-runtime/agents/specialists.ts`, pure/isomorphic): `selectSpecialist(route)` maps a resolved workflow target → its specialist (from `lib/agents.ts`); general/navigation → null. Each specialist carries concise real domain `expertise`.
- **Brain (server):** the `/api/copilotkit` middleware (same one as the gate + tiering) injects the persona as a **context item** (`SPECIALIST FOR THIS TURN — You are Sofi …`) using the route the gate already computed — reaches the model without touching the thread. `INSTRUCTIONS()` gained a SPECIALISTS section. Flag `ASSISTANT_SPECIALISTS` (default on); specialist name added to the `[assistant-route]` log.
- **Face (client):** `components/assistant/specialist-presence.tsx` (`SpecialistPresence`, headless, mounted once in app-shell) reuses the SAME pure classifier client-side to set the live `CoworkerActivity` indicator to the specialist while a reply streams. Purely COSMETIC (writes only the presence atom, never the thread/model → a mis-read just shows no hat), and yields to a live run (which owns the indicator); only clears a hat it set. Complements the existing `coworkerForMessage` tool-call attribution.
- **Per-message avatars:** `components/assistant/message-specialists.tsx` builds a `{ assistantMessageId → specialist }` map (classifying each turn's *preceding user message*), provided by `ThreadMessages` via `MessageSpecialistContext`; `AsideAssistantMessage` shows the specialist avatar on a PAST plain reply (e.g. a FAPI answer → Sofi), keeping any specific tool attribution (`runWorkflow`/`generateUI`/page ops). Memoized on the message id/role signature; purely visual.
- **Why not the Agents SDK:** this is the "many hats" shape; the SDK is only needed for true handoffs/sub-delegation + resumable approvals — a later, deliberate step that sits on this same foundation. See `docs/assistant-specialists.md`.

## Chat runtime: durable assistant memory (2026-07-18)

The chat previously kept everything in jotai + localStorage — it never truly "remembered" facts across sessions/devices. New **`lib/assistant-runtime/memory/`** adds durable, per-user memory in Postgres for facts/preferences the user EXPLICITLY asks it to save.

- **Table `assistant_memories`** (`lib/db/schema.ts`, migration `drizzle/0005_strange_deathstrike.sql`): `user_id` (tenant boundary, FK users), `client_id`/`fiscal_year`/`workflow_id` (optional scope filters), `kind`/`subject`/`content`/`source`, timestamps. **Run `pnpm db:migrate` (or `db:push`) to create it** — until then everything fails soft (empty reads, "storage unavailable" on save).
- **Retrieval policy** (`memory/retrieval.ts`, pure + unit-tested): global memories always eligible; a client-specific memory surfaces ONLY for its client; when the active client is unknown, only globals surface → **no cross-client bleed**. Ranked client-match → keyword overlap → recency, cap 20.
- **API** `app/api/assistant/memory/route.ts` — `GET` (relevant for user+scope), `POST` (save), `DELETE` (forget). Authenticates via better-auth (`auth.api.getSession`); scoped to the session user; **fail-soft** (no session/DB → empty / structured error, chat unaffected). Repository (`memory/repository.ts`) is `server-only` and try/catches every query.
- **Client** `components/assistant/memory-copilot.tsx` (`MemoryCopilot`, headless, mounted ONCE in `app-shell` inside the CopilotKit provider): reads the active client (`selectedClientAtom`), fetches relevant memories → publishes them as a `useCopilotReadable` grounding block, and registers **`rememberFact`** / **`forgetFact`** actions. `INSTRUCTIONS()` gained a MEMORY section (use remembered facts; save only when explicitly asked; never auto-save).
- **Policy:** explicit, opt-in only — memory is never auto-inferred from messages; deletion is supported. See `docs/assistant-memory-policy.md`.

## Chat runtime: Ask/Propose/Execute intent gate (2026-07-18)

The chat handed the model **every** `useCopilotAction` tool on every turn with no intent layer, so a workflow **mention** could trigger `runWorkflow` and an explicit **command** could be missed. A deterministic intent gate now runs inside the SAME `app/api/copilotkit/route.ts` `agent.use(...)` middleware, composed **before** orphan-repair: `traceCopilotInput → computeGateDecision → applyGateDecision → repairOrphanToolCalls → next.run`.

- **Module:** `lib/assistant-runtime/` (server-only, no React/jotai). `routing/classify.ts` classifies the current user turn into an `AssistantRoute` (`mode: ask|propose|execute`) using bilingual EN/FR verb/question/negation/hypothetical banks (`command-parser.ts`) and a **separate** workflow-target resolver (`workflow-targets.ts`, ids `fapi|roulement|expense|campaign`) — encoding the rule *a workflow name is a target, never a command*. `route-policy.ts` can only downgrade (execute→propose/ask) on low confidence / ambiguous target / negation.
- **Enforcement** (`routing/gate.ts`, pure + synchronous — the AG-UI middleware must return an Observable synchronously): on `ask`/`propose` turns it withholds the `execute` + `builder_mutate` tool groups (chiefly `runWorkflow`) from `input.tools`; on `execute` turns it keeps them and appends a short `[assistant-routing]` directive naming the resolved workflow. **Fail-open**: any doubt/error → input unchanged. Never strips the whole tool set.
- **Modes** via `ASSISTANT_INTENT_GATE` = `off` | `shadow` | `enforce` (default **enforce**); `ASSISTANT_INTENT_DIRECTIVES=off` disables only the directive. A single log-safe `[assistant-route] {mode,intent,target,withheld,…}` line per turn (no content, no chain-of-thought).
- **Belt-and-suspenders:** `INSTRUCTIONS()` (`assistant-thread.tsx`) gained an INTENT section (mention ≠ command; hypotheticals/negations never act; honor `[assistant-routing]` notes).
- **Evals:** `pnpm assistant:evals` runs the deterministic classifier + policy over **118 bilingual cases** + 4 gate smoke checks, offline. Current: 118/118, **0 false executions, 0 missed commands**, 16/16 negation/injection.
- **Optional LLM router** (`routing/intent-router.ts`, `classifyWithLLM`) produces the same `AssistantRoute` via structured output — NOT in the hot path (shadow/inspector/future pre-flight only).
- **Rollback:** `ASSISTANT_INTENT_GATE=off`. See `docs/assistant-routing-policy.md` and `docs/assistant-runtime-baseline.md`.

## Chat runtime: per-turn model tiering (2026-07-18)

"Smarter answers" — the chat used ONE fixed model (`OPENAI_CHAT_MODEL`, default `gpt-4o`) for a hard tax question and a "open the dashboard" alike. `lib/assistant-runtime/model-policy.ts` now picks the model **per turn** from the SAME `AssistantRoute` the gate computes: **deep** (explain/inspect-calc/run-calc/search-evidence/answer/protected/find) → strong model; **fast** (open/focus/edit-field/general/status) → cheap model; **standard** (start/continue/pause/cancel) → the chat model.

- **Override mechanism:** `BuiltInAgent` honors per-run `input.forwardedProps.model` / `providerOptions` only when built with `overridableProperties` — `app/api/copilotkit/route.ts` now passes `overridableProperties: ['model','providerOptions']`, and the middleware sets `forwardedProps.model` from the tier. The runtime's `resolveModel` needs a **provider-prefixed** spec, so bare ids are normalized (`gpt-4o → openai/gpt-4o`, `o3 → openai/o3`, `claude-… → anthropic/…`).
- **Safe by default:** every tier defaults to `OPENAI_CHAT_MODEL`, so when a tier equals the baseline the policy returns `modelSpec=null` (no override) — **zero behavior change until `ASSISTANT_MODEL_FAST`/`ASSISTANT_MODEL_DEEP` are set to distinct models.** The route is reused from the gate (no double classify); the tier shows in the `[assistant-route]` log.
- **Reasoning effort:** `providerOptions.reasoningEffort` is attached only when `ASSISTANT_REASONING_ENABLED=on` AND the deep tier actually overrides (o-series/gpt-5 style models). Off by default.
- **Flags/rollback:** `ASSISTANT_MODEL_TIERING` (default on, no-op until distinct models set) → `off` reverts. See `docs/assistant-model-policy.md`.

## Chat runtime: server-side orphan repair (2026-07-17)

The CopilotKit runtime endpoint (`app/api/copilotkit/route.ts`) registers an **explicit default `BuiltInAgent`** (imported from `@copilotkit/runtime/v2`; model = `serviceAdapter.getLanguageModel()` — the same driver CopilotKit would create implicitly) and attaches a `.use()` middleware that repairs orphaned tool calls on every run, immediately before the thread is converted for the AI SDK: `agent.use((input, next) => next.run({ ...input, messages: repairOrphanToolCalls(input.messages) }))`, then `new CopilotRuntime({ agents: { default: agent } })`.

**Why.** Without an explicit agent, the runtime hands the whole persisted thread to its bundled **ai@6.0.225** `convertToLanguageModelPrompt`, which throws `MissingToolResultsError` at any user/system message (or end-of-thread) while an assistant tool-call has no matching `{role:'tool', toolCallId}`. Such an orphan appears whenever the stream emitting a tool call is aborted before the client handler returns its result (Stop / route navigation / unmount) — common right after a workflow run, where the user navigates away to inspect results. One orphan then poisons every later message ("can't chat after a workflow").

**The repair** (`lib/copilot-orphan-repair.ts` — pure, unit-tested against a faithful mirror of the SDK's check): walk the AG-UI messages tracking pending assistant tool-call ids; at each `user`/`system`/`developer` boundary and at end-of-thread, inject a synthetic `{role:'tool', toolCallId, content}` for each still-pending id — mirroring the SDK's pairing walk but injecting instead of throwing. It runs at the runtime boundary, so it is deterministic and covers orphans from **any** source with no client race. Frontend `useCopilotAction` tools are untouched (they arrive as `input.tools`; the middleware rewrites only `input.messages`), and synthetics live only in the array handed to the model — never written back to the persisted client thread.

**Supersedes** the former client-side heal (`lib/copilot-recovery.ts` / `<CopilotRecovery/>`), which silently failed for workflows because `agent.setMessages()` deep-clones via `structuredClone` and throws `DataCloneError` on the `generativeUI` render closure a workflow's assistant message carries. That band-aid has since been **removed** — both files deleted and all wiring (the provider `onError`, the `<CopilotChat onSubmitMessage>` guard, and `say()`'s pre-send call) unwired — so the server-side repair is the sole orphan-safety mechanism.

**Build note (required config).** Importing `BuiltInAgent` from `@copilotkit/runtime/v2` pulls in that barrel's Express/Hono endpoint adapters, and Express's dynamic `require(mod).__express` (view-engine loader) can't be statically bundled by Turbopack ("Module not found: Can't resolve (<dynamic>)"). `next.config.ts` therefore lists `serverExternalPackages: ['@copilotkit/runtime', 'express']` so they're `require()`d at runtime instead of bundled — safe because this route runs in the Node runtime. **Do not remove that config** without also changing the import strategy. Verified: `next build --turbopack` → "✓ Compiled successfully".

## Assistant grounding — what the model sees, for any workflow (2026-07-17)

The chat used to answer with values it didn't have (reported: FX "1" while the sheet showed 1.3978). What the model sees is decided entirely on the client: the **system prompt** (`INSTRUCTIONS()` in `assistant-thread.tsx`) + the **`useCopilotReadable` context** + the **`useCopilotAction` tools** — the runtime route (`app/api/copilotkit/route.ts`) only relays to OpenAI. The gap: field values and per-workflow computed figures were only in context when a worksheet page happened to be mounted. Fixed generically (any workflow in `WORKFLOW_CONFIGS`, no per-sheet code):

- **One value across chat / sheet / run (`ResourceField.binding`).** The chat's inline field wrote a standalone `fieldValuesAtom` that the engine/worksheet/run never read (they read `runEditsAtom[wf].inputs[key]`), so a chat edit changed nothing and the model saw a value nothing computed with. A field may now declare `binding: { workflowId, inputKey }` (set `fx → { fapi, fxRate }`); `InlineFieldCard` reads/writes that engine input instead — the inline card, the worksheet, the run, and the engine share ONE number.
- **Two always-on readables** (`components/assistant/use-assistant.tsx`):
  - *editable-field-values* — every field from `buildAgentCatalog().fields` with its CURRENT value + `isDefault` (bound fields resolve to the engine input / its default; unbound fall back to `fieldValuesAtom`). The model answers value questions from here and says "not set" when `isDefault`.
  - *live-workflow-data* — for every workflow with live data (uploaded rows, edited inputs/overrides, or the active run), the SAME `createTemplateIntel(cfg, {rows,inputs,overrides}).describe()` snapshot the worksheet renders (lines, summary+CAD, FX, classification). So the real numbers are in context **even with no worksheet page open**. Memoized on `[uploaded, runEdits, activeRun.workflowId]`.
- **Fuzzy field resolution (`resolveFieldId` in `resource-registry.tsx`).** The model guesses ids (`FX_RATE`, `fx rate`, the line key) instead of copying the registry id. `resolveFieldId` maps those to the real id (exact → case-insensitive → normalized id/tag/bound-input-key → label/keyword contains); `editField` uses it in both handler and render and returns the field list on a genuine miss.
- **Retrieval actions work from the bare chat.** `explainWorksheetLine` / `whyWorksheetValue` / `searchWorksheet` now go through `resolveIntelFor(worksheet?)` — prefer a mounted live worksheet's intel, else BUILD intel from the workflow's live data (or its sample data when named) — so they answer even when no sheet is mounted.
- **INSTRUCTIONS gained a GROUNDING section** — answer values from the two readables, never invent, say "not set" on `isDefault`, use exact `fieldId`s.

**Trace instrumentation (`lib/copilot-trace.ts`).** `traceCopilotInput(input)` is called from the route's `.use()` middleware; when `COPILOT_TRACE=1` it dumps the exact model input for each request (system + readable context + tools + messages) to `.copilot-trace/<ts>.json` (git-ignored) + a console summary. No-op otherwise. This is the ground-truth answer to "where did the AI get that value?". A deterministic preview of the two readables for a scenario: `pnpm tsx scripts/preview-copilot-context.ts`.

## Chat attachments — document text reaches the model (2026-07-19)

Attaching a file in the composer used to be inert for anything but a workbook: `onAttach` (`components/assistant/use-assistant.tsx`) parsed `.xlsx/.xls` into rows but, for every other file, pushed only a `[Attached <name>]` string into the message. That string is the *only* thing the model received — so a PDF question ("what is this document about?") was answered from the **filename alone**, and the assistant honestly reported it couldn't see the content. This is a data-flow gap, not an OCR gap.

The attachment path now mirrors the workbook path — extract the content, publish it as readable context, keep the message short:

1. **Extraction route (`app/api/assistant/extract/route.ts`, Node runtime).** `POST` multipart `file` → text. **PDF** via `unpdf` (`getDocumentProxy` + `extractText({mergePages:true})`, pdf.js under the hood — the *embedded text layer*, no OCR); **Word `.docx`** via `mammoth` `extractRawText` (added 2026-07-19); **plain-text** (txt/md/csv/tsv/json/yaml/xml/html/rtf or `text/*`) decoded as UTF-8. Output is normalized and **capped at `MAX_CHARS` (120k ≈ 30k tokens)** with a `truncated` flag, since the text is sent to the model every turn. A PDF whose extraction is empty = scanned/image-only → clean **422 "needs OCR"** (the one case OCR would help). Unsupported types → 415. This route is shared: the chat composer's `onAttach` and the **Document Viewer** page's "Discuss with Scope" both POST to it.
2. **Client store + note (`onAttach`).** Non-workbook files are `fetch`ed to the route; the result becomes an `AttachedDoc` in `attachedDocsAtom` (`lib/workspace-store.ts`, in-memory — the text can be large and is session-scoped; re-attaching the same file replaces it by `id = name-size`). The message gets only a short note (`[Attached … — 78 pages of text extracted; full text available to the assistant]`), so the chat bubble never balloons with the raw document.
3. **Grounding readable.** An **attached-documents** `useCopilotReadable` exposes each doc's `{fileName, kind, pages, truncated, text}`; INSTRUCTIONS-style guidance tells the model to answer "this document / the attachment / the PDF" questions from that `text` and to note when `truncated`. Workbooks keep their own row-parse + `uploadedRows`/`live-workflow-data` path.

Verified end-to-end against the running dev server: `codedutravail.pdf` (78-page Senegal Labour Code) → `{kind:'pdf', pages:78, chars:120000, truncated:true}` with correctly-accented French text.

## FX / rate precision — accurate until the final results (2026-07-18)

The calc engine (`backend/blocks/logic/calculation-engine/run.ts`) rounded **every** rule result to money cents via `roundMoney` — including `FX_RATE`, which is a `pass_through(fxRate)` rule. So a rate like 1.3978 became **1.40**, and because the CAD lines are `*_CAD = <line> × FX_RATE` rules that reference the *already-rounded* `FX_RATE`, every conversion used 1.40 (GROSS_CAD = 25000 × 1.40 = 35,000). Rounding **money** to cents is correct; rounding a **rate** is not — it destroys precision and propagates the error into everything multiplied by it.

**Fix (generic, minimal):** a new `roundResult(value, resultKey)` replaces the direct `roundMoney` calls in `evaluateRule` / `evaluateFormulaExpression`. Rate results — keys matching `/_RATE$|^FX/i`, the same `isRateKey` convention `lib/worksheet-intel/template-adapter.ts` uses — flow through at **full precision**; money results still round to 2dp at each step. Final DISPLAY rounding is unchanged (the worksheet/snapshot format rates with `fmtRate`, 4–6dp). So the rate stays exact through the whole pipeline and is only *presented* rounded — "don't round until the last results."

Only `FX_RATE` matches the rate pattern across all templates (checked every `resultKey` in `lib/workflow/sample-workflows/*`); `RTF` (a {1.9, 4} factor) is exact at 2dp so it's unaffected either way. **No regression** on documented figures: at the default FX 1.35 (exact at 2dp) every number is identical (NET_FAPI_CAD 33,493.50). At 1.3978: FX_RATE **1.3978**, GROSS_CAD **34,945.00**, NET_FAPI_CAD **34,679.42** — accurate to the cent. This makes the assistant's editable-field value and the live-workflow snapshot FX **agree** (both 1.3978), closing the divergence noted with the grounding work. Applies to FAPI, Roulement, expense, and the demo (all have `FX_RATE` + `*_CAD`). `tsc` 0.

**Surfacing the value consistently (2026-07-18).** The engine keeps the rate precise; the *surfaces* must not re-flatten it. Three followed suit (`components/workspace/workflow-run-flow.tsx`): (a) the summoned `WorkflowElementCard` output now computes from the live `uploadedRowsAtom`+`runEditsAtom` via the same `runTemplateCore` call as the worksheet (it previously ran `runToCompletion` on static sample data → a *different dataset*, e.g. 25k @ 1.35 vs the real 147,322 @ 1.3978); (b) rate keys render through `numRate`/`fig` (full precision) instead of the 2dp `num()` that displayed "1.40"; (c) the `activeRun.data` readable stopped `Math.round`-ing lines/summary (which had shown `FX_RATE` as "1" to the model). Net: the chat output card, the worksheet, the run-result card, and the AI's readable all show one number for one run.

## Non-fiscal workflows — the run framework is domain-agnostic (2026-07-17)

Two non-tax `TemplateConfig`s (**Employee Expense Reimbursement** `expense`, **Marketing Campaign Budget Allocation** `campaign`) were added to prove "a new workflow = one config" holds outside the fiscal domain. Each is registered in `lib/workflow-runs/index.ts` (→ runnable in the chat via `runWorkflow` / summonable via `showWorkflowElement`, since `workflowEnum` = `Object.keys(WORKFLOW_CONFIGS)`), has a `createX…Workflow()` builder in `local-fiscal-workflow.ts` reading block/edge specs from `lib/workflow/sample-workflows/*` (→ opens in the visual builder), and appears in the launcher (`lib/agents.ts` `WORKFLOWS` + agents Mira/Nova).

Key design constraint discovered + worked around: the **`source.fapi_inputs` block emits a FIXED whitelist** of keys (`backend/blocks/source/fapi-inputs/run.ts`), so arbitrary non-fiscal scalar params (a meal cap, a budget ceiling, a target ROAS) can't flow through the block into the calc engine. The robust path — already used by Roulement — is **`TemplateConfig.computeExtra`**: the real engine still does source → **classify → rollup** (the meaningful, live part), and `computeExtra({ rollup, params, elected })` does the deterministic domain math from the rollup buckets + `config.params` (overridden by editable inputs whose `block` is omitted). Its `lines`/`summary` **override** the decorative calc-engine blocks' output; those blocks stay on the canvas for a faithful shape and run harmlessly (the same "warning on unresolved param operands" Roulement has). Two small generalizations enabled clean reuse:
- **Config-driven election wording** — `ElectConfig` gained optional `ceilingWord` / `floorLabel` / `ceilingLabel` / `floorNote` / `ceilingNote` / `promptSuffix` (`engine.ts`). Defaults reproduce Roulement's copy **verbatim** (so Roulement is byte-identical); `campaign` sets budget-flavoured copy. The elected value + option ids (floor/mid/ceiling from `computeExtra`'s `boundsMin/boundsMax`) are unchanged.
- **Generic builder resolution** — `app/builder/page.tsx` now loads a chat-deep-linked workflow via `getWorkflowConfig(focus.workflowId)?.buildSnapshot()` (was a hardcoded `fapi`/`roulement` ternary), so any registered workflow opens focused on a block. Source-block hydration from `uploadedRowsAtom` already keyed off `sourceKind`, so it works unchanged.

`expense` has `resultPage: 'expense'` → a dedicated worksheet (`components/worksheet/expense-worksheet.tsx`, registered page in `resource-registry.tsx`) + `worksheetProvenance`; `campaign` omits `resultPage` → no worksheet (the run's "Open worksheet" button is conditional). Both verified through the real engine (expense net 2,325 USD / 3,138.75 CAD; campaign projected revenue 525k @floor / 1,050k @cap), FAPI/Roulement unchanged.

## Google Drive / Gmail Ingestion (2026-07-15)

Real Drive + Gmail ingestion for a workflow's source workbook, built on the OAuth tokens **better-auth already stores** — no separate OAuth stack.

```
lib/auth.ts  socialProviders.google
   scope += drive.readonly, gmail.readonly · accessType offline · prompt consent
   → better-auth stores access/refresh token + granted scope in the `accounts` table
        ↓
GoogleSourcePicker (client)  →  GET /api/google/status        (connected? scopes?)
   not connected → authClient.linkSocial({ provider:'google', scopes:[…] })  (links to the
                   current session — incl. anonymous — then Google redirect + callback)
        ↓
   Drive tab  → GET /api/google/drive/files?q=…      → pick → GET …/[fileId]/content  (bytes)
   Gmail tab  → GET /api/google/gmail/messages?q=…   → pick → GET …/attachments/[id]  (bytes)
        ↓
   new File([bytes], name)  →  parseUploadToRows()   ← THE SAME parser as a disk upload
        ↓
   run-flow applyRows(name, rows, origin)  →  uploadedRowsAtom + RunState.rows  →  real engine
```

**Server token layer — `lib/google/client.ts` (`server-only`).** `getGoogleAccessToken(userId)` reads the `accounts` row for provider `google` and returns the access token, **refreshing** via `https://oauth2.googleapis.com/token` (with `GOOGLE_CLIENT_ID/SECRET` + stored refresh token) when it's within 60s of expiry, persisting the new token. `getConnectedGoogle(userId)` reports connected/missing scopes from `accounts.scope`. Thin `driveListSpreadsheets` / `driveDownloadWorkbook` / `gmailListAttachmentMessages` / `gmailDownloadAttachment` wrap the REST APIs with plain `fetch` (no `googleapis` dep). Google Sheets are exported to xlsx; downloaded filenames are normalized to a `.xlsx`/`.xls` extension so the parser accepts them.

**Security.** Every route requires a better-auth session (`requireUserId` in `lib/google/require-user.ts`) and acts **only as the session user** — never a client-supplied id — so one user can't reach another's tokens. Downloads return raw bytes; no server-side parsing (keeps the single-parser invariant → chat/builder/worksheet numbers stay identical).

**Config to go live:** `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Web OAuth client, redirect `<BETTER_AUTH_URL>/api/auth/callback/google`), Drive API + Gmail API enabled, consent-screen scopes added. Unconfigured → `/api/google/status` returns `configured:false` and the picker shows a graceful "not configured" state; disk upload is unaffected.

**Root layout** (`app/layout.tsx`) wraps everything in:
- Auth provider (better-auth)
- Overlay provider (modal stack)
- Theme provider
- Jotai store
- React Flow global styles

---

## Sample Data

Default dataset loaded on demo/new workflow:

| Account | Amount | Label |
|---|---|---|
| 4000 | 12,000 | Interest income |
| 4100 | 8,000 | Rental income |
| 5000 | -600 | Bank charges |
| 5200 | -1,200 | Professional fees |
| 5999 | 3,000 | Other income |

---

## Key Constants

| Constant | Value | Location |
|---|---|---|
| `LOCAL_WORKFLOW_ID` | `"local-fiscal-studio"` | lib/local-fiscal-workflow.ts |
| `LOCAL_WORKFLOW_STORAGE_KEY` | `"workflow-studio.local-workflow"` | lib/local-fiscal-workflow.ts |
| `LOCAL_RUNS_STORAGE_KEY` | `"workflow-studio.local-runs"` | lib/local-fiscal-workflow.ts |
| `LOGIC_OUTPUT_GOVERNANCE_WARNING` | Governance draft warning text | src/domain/workflow/workflow-rules.ts |

---

## What Is Not Yet Server-Side

- Block execution (all local in-browser)
- Workflow persistence (localStorage only for local mode)
- AI block code execution (stubbed)
- External API calls from blocks (stubbed)
- Real integration execution (stubbed)

**Now server-side:** the chat workspace agent (`/api/chat-workspace`) — LLM tool-selection runs on the server; tool *execution* stays on the client (against Jotai atoms).
