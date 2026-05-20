# Features

*Last updated: 2026-05-18*

Status markers: `[LIVE]` fully working · `[PARTIAL]` works but incomplete · `[STUB]` UI exists, logic missing · `[PLANNED]` domain defined, no UI/logic yet

---

## Core Workflow Editing

| Feature | Status | Notes |
|---|---|---|
| Visual node-based canvas (React Flow) | `[LIVE]` | Full drag/drop, zoom, pan |
| Add blocks from catalog | `[LIVE]` | Via right-click or add-node button |
| Connect blocks with edges | `[LIVE]` | Handles on nodes, validation on connect |
| Delete blocks and edges | `[LIVE]` | Delete key, context menu |
| Undo / redo | `[LIVE]` | Jotai history/future atom stacks |
| Insert block between two connected blocks | `[LIVE]` | `insertBlockBetweenEdgeAtom` |
| Keyboard shortcuts | `[LIVE]` | Cmd+S (save), Cmd+Enter (run), Cmd+Z (undo), Cmd+Shift+Z (redo) |
| Minimap | `[LIVE]` | Toggle via toolbar |
| Viewport fit on load | `[LIVE]` | `fitView` on workflow load |
| Canvas viewport persistence | `[LIVE]` | Saved to localStorage via `persistent-canvas.tsx` |
| Right-click context menu | `[LIVE]` | Block creation shortcuts, edge manipulation |
| Workflow name editing | `[LIVE]` | Inline edit in toolbar |
| Workflow visibility (private/public) | `[PARTIAL]` | UI exists; sharing backend TBD |
| Multi-select and batch delete | `[LIVE]` | `deleteSelectedItemsAtom` |

---

## Block Execution (Local Runner)

| Feature | Status | Notes |
|---|---|---|
| Run full workflow | `[LIVE]` | `runLocalWorkflowTools("workflow")` |
| Run selected block + ancestors | `[LIVE]` | `runLocalWorkflowTools("selected")` |
| Run downstream from selection | `[LIVE]` | `runLocalWorkflowTools("downstream")` |
| Topological ordering (Kahn's algorithm) | `[LIVE]` | In `lib/local-tool-runner.ts` |
| Per-block status coloring on canvas | `[LIVE]` | Nodes update color after run |
| Execution logs per block | `[LIVE]` | `executionLogsAtom` |
| Block run history | `[LIVE]` | Stored in localStorage via `LOCAL_RUNS_STORAGE_KEY` |
| Upstream result injection | `[LIVE]` | `ToolExecutionContext.upstreamResults` |
| Evidence ref accumulation | `[LIVE]` | Deduped across run |
| Source trace ref propagation | `[LIVE]` | Lineage chain per derived value |

---

## Source Block Features

| Feature | Status | Notes |
|---|---|---|
| Manual Entry value input | `[LIVE]` | `source.manual_value` tool |
| Excel workbook upload | `[PARTIAL]` | UI exists (`excel-upload-panel.tsx`); actual file parsing WIP |
| Sheet / range selection | `[STUB]` | UI exists; not wired to real parsing |
| PDF / Document evidence | `[STUB]` | Catalog entry exists; no parsing logic |
| API / HTTP Request evidence | `[STUB]` | Catalog entry; no actual HTTP call |
| Database Query rows | `[STUB]` | Uses `source.manual_table`; no DB connection |
| Web / URL reference | `[STUB]` | Catalog entry; no fetch |
| AI Search Result | `[STUB]` | Catalog entry; no AI search |
| Currency Rate (Bank of Canada) | `[LIVE]` | `source.currency_rate` tool; uses override rate |
| Keyword Rules editor | `[LIVE]` | `keyword-rulebook-editor.tsx` — inline CRUD |
| Aggregation Rules editor | `[LIVE]` | `aggregation-rulebook-editor.tsx` |
| Rollup Rules editor | `[PARTIAL]` | `rollup-rulebook-editor.tsx` exists |
| Calculation Rules editor | `[PARTIAL]` | `calculation-engine-editor.tsx` exists |
| FAPI Inputs | `[STUB]` | Tool registered; no UI config |
| Source evidence immutability locking | `[LIVE]` | `source.immutable`, `source.treatedAsEvidence` flags |
| Evidence lock per field | `[LIVE]` | `labelLocked`, `locatorLocked`, `valuesLocked` |

---

## Logic Block Features

| Feature | Status | Notes |
|---|---|---|
| Keyword Mapper execution | `[LIVE]` | Full text normalization, confidence scoring, conflict resolution |
| Keyword Mapper workspace UI | `[LIVE]` | `keyword-mapper-workspace.tsx` |
| Calculation Engine inline formulas | `[LIVE]` | Parses and evaluates named-value formulas |
| Calculation Engine external rules | `[PARTIAL]` | Config exists; external rules loading WIP |
| Calculation Engine formula trace | `[LIVE]` | Per-formula resolution trace returned |
| Calculation Engine workspace UI | `[LIVE]` | `calculation-engine-workspace.tsx` |
| Hierarchy Aggregator execution | `[LIVE]` | Recursive aggregation |
| Category Rollup Aggregator | `[WIP]` | `run.ts` exists; full wiring in progress |
| Logic code modes (Formula/Script/etc.) | `[PARTIAL]` | Mode selector exists; only formula actually runs |

---

## Review / Validation Features

| Feature | Status | Notes |
|---|---|---|
| Review / Validation block family | `[PLANNED]` | Domain defined; no subtypes implemented |
| Approval gate | `[PLANNED]` | `approvalState` in `GovernanceMetadata`; no UI workflow |
| Readiness check | `[PLANNED]` | — |
| Trust review | `[PLANNED]` | — |
| Completeness check | `[PLANNED]` | — |

---

## Field Block Features

| Feature | Status | Notes |
|---|---|---|
| Field block family | `[PARTIAL]` | Domain defined; `field-block-workspace.tsx` exists |
| Display computed value | `[STUB]` | No live binding from upstream output |
| Category breakdown display | `[STUB]` | — |

---

## Output Block Features

| Feature | Status | Notes |
|---|---|---|
| Output block family | `[PLANNED]` | Domain defined; no tool modules |
| CSV Export | `[PLANNED]` | — |
| Excel Export | `[PLANNED]` | — |
| PDF Report | `[PLANNED]` | — |
| Evidence Pack | `[PLANNED]` | — |
| Canonical JSON | `[PLANNED]` | — |
| Taxprep Handoff | `[PLANNED]` | — |
| ONESOURCE Handoff | `[PLANNED]` | — |
| Output mapping preview | `[PARTIAL]` | `OutputMappingPreview` type exists; UI pending |
| Governance warning on Logic→Output edge | `[LIVE]` | Emits `LOGIC_OUTPUT_GOVERNANCE_WARNING` |

---

## AI / Agent Features

| Feature | Status | Notes |
|---|---|---|
| AI prompt panel (Cmd+K) | `[LIVE]` | Streaming generation, keyboard shortcut |
| AI block/edge generation from prompt | `[LIVE]` | Generates nodes and edges incrementally |
| Existing workflow context for AI | `[LIVE]` | Current blocks/edges passed as context |
| AI proposal lifecycle (proposed→approved→rejected) | `[PARTIAL]` | Types defined; approval UI TBD |
| AI-assisted logic code mode | `[STUB]` | Mode selector exists; not functional |
| AI Search Result source block | `[STUB]` | Catalog entry; no AI search execution |

---

## Inspector Panel Features

| Feature | Status | Notes |
|---|---|---|
| Block inspector (Properties tab) | `[LIVE]` | Config editing per block |
| Block inspector (Code tab) | `[PARTIAL]` | Mode selector; formula editing works |
| Block inspector (Runs tab) | `[LIVE]` | Run history per block |
| Edge inspector | `[LIVE]` | Relationship type, binding, notes |
| Logic mode selector | `[LIVE]` | Formula, Script, Condition, etc. |
| Data preview card | `[LIVE]` | Table, JSON, Schema, Trace views |
| Source evidence display | `[LIVE]` | Shows source locator and lock state |
| Run output display | `[LIVE]` | Output rendered in inspector after run |

---

## Persistence & Save Features

| Feature | Status | Notes |
|---|---|---|
| Autosave (debounced 1s) | `[LIVE]` | `autosaveAtom`; local mode uses localStorage |
| Immediate save on structural changes | `[LIVE]` | Bypass debounce for adds/deletes |
| Load workflow from localStorage | `[LIVE]` | `loadLocalWorkflowSnapshot()` |
| Save workflow as (with name) | `[LIVE]` | `saveWorkflowAsAtom` |
| Database persistence | `[STUB]` | Drizzle ORM configured; save/load endpoints TBD |
| Workflow versioning / snapshots | `[PARTIAL]` | `WorkflowVersionSnapshot` type fully defined; save logic TBD |
| Version history UI | `[PLANNED]` | — |
| Publish workflow | `[STUB]` | `make-public-overlay.tsx` exists; backend TBD |

---

## UI / UX Features

| Feature | Status | Notes |
|---|---|---|
| Resizable inspector panel | `[LIVE]` | `rightPanelWidthAtom`, drag-to-resize |
| Collapsible sidebar | `[LIVE]` | `isSidebarCollapsedAtom` |
| Panel animation | `[LIVE]` | `isPanelAnimatingAtom` |
| Two-panel tool shell | `[LIVE]` | `two-panel-tool-shell.tsx` — resizable left/right |
| Worksheet page view | `[PARTIAL]` | `worksheet-page-view.tsx` exists |
| Worksheet page menu | `[PARTIAL]` | `worksheet-page-menu.tsx` exists |
| Dark/light theme | `[LIVE]` | Theme provider in root layout |
| Toast notifications | `[LIVE]` | Global toaster in root layout |
| Overlay / modal stack | `[LIVE]` | `overlay-provider.tsx` push/pop navigation |
| Workflow validation warnings overlay | `[LIVE]` | `workflow-issues-overlay.tsx` |
| Export workflow to JSON/YAML | `[PARTIAL]` | `export-workflow-overlay.tsx` exists |
| API key management overlay | `[STUB]` | `api-keys-overlay.tsx` exists |
| Settings overlay | `[PARTIAL]` | `settings-overlay.tsx` exists |
| Integrations overlay | `[STUB]` | `integrations-overlay.tsx` exists |
| AI gateway consent overlay | `[STUB]` | `ai-gateway-consent-overlay.tsx` exists |

---

## Sample Workflows

| Workflow | Status | Notes |
|---|---|---|
| Working source rules demo | `[LIVE]` | 12+ keyword rules; default demo on home |
| Expanded mapping pipeline demo | `[LIVE]` | Full Source → Logic → Output example |
| FAPI template | `[LIVE]` | `fapi-template.ts`; loadable from Starter templates menu |
| Roulement fiscal (art. 85 LIR) | `[LIVE]` | `roulement-fiscal-template.ts`; loadable from Starter templates menu; classifies transferred property, aggregates PBR, computes election bounds/gain, produces T2057 data |

---

## Authentication

| Feature | Status | Notes |
|---|---|---|
| Auth provider (better-auth) | `[LIVE]` | Wrapped in root layout |
| Workflow ownership flag | `[LIVE]` | `isWorkflowOwnerAtom` |
| Per-workflow visibility | `[PARTIAL]` | Flag exists; enforcement TBD |
