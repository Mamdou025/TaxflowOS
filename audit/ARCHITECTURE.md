# Architecture

*Last updated: 2026-05-17*

---

## Overview

A fiscal workflow automation platform built on Next.js 15, React Flow, and Jotai. The app lets users build node-based data transformation workflows with strong emphasis on evidence tracking, data governance, and audit compliance. All execution currently runs locally in-browser (no server-side compute for block runs).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
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
| `/` | `app/page.tsx` | Home — loads local workflow or demo |
| `/workflows` | `app/workflows/page.tsx` | Redirects to most recent |
| `/workflows/[workflowId]` | `app/workflows/[workflowId]/page.tsx` | Full workflow editor (750 lines) |

**AI API routes:**
| Route | File | Purpose |
|---|---|---|
| `POST /api/ai/generate` | `app/api/ai/generate/route.ts` | Builder: NL → workflow (JSONL op stream) |
| `POST /api/copilotkit` | `app/api/copilotkit/route.ts` | **CopilotKit runtime** (CopilotRuntime + OpenAIAdapter) — powers the chat panel. Uses `OPENAI_API_KEY` |
| `POST /api/chat-workspace` | `app/api/chat-workspace/route.ts` | Legacy custom agent (superseded by CopilotKit; still present) |
| `GET /api/fx-rate` | `app/api/fx-rate/route.ts` | **Live Bank of Canada Valet FX fetch** (`?from=USD&to=CAD&year=2025` → `fetchAnnualAverageExchangeRate`). Real source behind the FAPI `fapi-api-boc-fx` API block; server-side (avoids CORS); `ok:false` + reason on failure so callers fall back to the override rate |

---

## Chat Workspace Agent (server-side LLM tool-calling)

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
