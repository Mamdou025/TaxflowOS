# Features

*Last updated: 2026-05-18*

Status markers: `[LIVE]` fully working · `[PARTIAL]` works but incomplete · `[STUB]` UI exists, logic missing · `[PLANNED]` domain defined, no UI/logic yet · `[DISPLAY]` interactive UI backed by scripted/mock data (not real execution)

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
| Excel workbook upload | `[LIVE]` | `excel-upload-panel.tsx` parses .xlsx/.xls via `parseExcelWorkbookFile` → `buildExcelSourceConfigPatch` (SheetJS) with header/column auto-detection |
| Trial-balance (debit/credit) ingestion | `[LIVE]` | `excel-utils.ts` [2026-07-14] — real accounting trial balances now parse correctly. **(a)** Header detection tolerates currency-suffixed headers (`"Debit (USD)"` matches `debit`) via `headerMatchesAlias`, so the signed `amount = credit − debit` path fires (income +, expense −) instead of falling back to reading one column and dropping credit-only revenue rows. **(b)** Balance-sheet rows (Asset/Liability/Equity) are dropped via the `Account Type` column (`BALANCE_SHEET_TYPE_REGEX`); totals-row guard now also catches `"TOTALS"` (plural). Verified: Platform's demo `TrialBalance_USD_2025-09-28.xlsx` uploaded end-to-end went from a broken **GROSS −6,150** (all income dropped, assets + totals ingested) to **GROSS 538,100 · DEDUCTIONS 12,700** — matching the by-hand figure (~6% off Platform's 572,950, the residual being expense/inclusion judgment) |
| Chat run uses the real uploaded file | `[LIVE]` | Chat upload now runs through the **same** parser (`lib/workflow-runs/parse-upload.ts`) → `SourceRow[]`; the run computes on those rows, not the sample. Same file in chat or builder → same numbers |
| Shared uploaded-rows store (chat ↔ builder) | `[LIVE]` | `uploadedRowsAtom` (persisted, keyed by workflow id) in `lib/workspace-store.ts`. Chat upload writes it; chat run reads it; builder hydrates its source block from it on a chat deep-link. "Use sample workbook" clears it |
| Sheet / range selection | `[STUB]` | UI exists; not wired to real parsing |
| PDF / Document evidence | `[STUB]` | Catalog entry exists; no parsing logic |
| API / HTTP Request evidence | `[PARTIAL]` | Catalog entry; distinct `Cloud` icon. Real HTTP call wired for the BoC FX case via `GET /api/fx-rate`; generic API blocks still don't fetch |
| Bank of Canada Valet API block | `[LIVE]` | `fapi-api-boc-fx` in FAPI template — audit-visible API source feeding the Currency Rate block; real fetch via `/api/fx-rate` → `fetchAnnualAverageExchangeRate` |
| Database Query rows | `[STUB]` | Uses `source.manual_table`; no DB connection |
| Web / URL reference | `[STUB]` | Catalog entry; no fetch |
| AI Search Result | `[STUB]` | Catalog entry; no AI search |
| Currency Rate (Bank of Canada) | `[LIVE]` | `source.currency_rate` tool; **prefers live `liveRate` (BoC Valet) over `overrideRate`**; run-flow FX input has "↻ fetch live rate" |
| Keyword Rules editor | `[LIVE]` | `keyword-rulebook-editor.tsx` — inline CRUD |
| Aggregation Rules editor | `[LIVE]` | `aggregation-rulebook-editor.tsx` |
| Rollup Rules editor | `[PARTIAL]` | `rollup-rulebook-editor.tsx` exists |
| Calculation Rules editor | `[PARTIAL]` | `calculation-engine-editor.tsx` exists |
| FAPI Inputs | `[LIVE]` | `source.fapi_inputs` emits inclusion/RTF/FAT **plus** the line-driving assumptions (P-coefficient, 95(2), A1/A2/C–H); RTF snapped to {1.9,4}; surfaced as editable inputs in the run |
| Full FAPI line set (A, EXP, 95(2), A1–H) | `[LIVE]` | Lines engine computes the whole Platform skeleton in one engine; A = `P×(income−expense)+95(2)` via `formulaExpression`. Verified by probe |
| FAPI Worksheet (main app, real engine) | `[LIVE]` | `components/worksheet/fapi-worksheet.tsx` — monochrome + pastel-toned-dot worksheet over `runTemplateCore` + shared uploaded rows; full line structure, dual-currency summary, inline-editable manual lines, expandable AI-mapped sub-rows, per-line builder trace, workbook Import. Drives `/fapi` + the chat worksheet tab |
| Worksheet docked Sources file-viewer | `[LIVE]` | `SourcesPanel` — right-docked raw trial-balance grid; click a row → provenance (classified category, matched keyword, confidence) or "unmatched", + trace to the mapper block |
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

## Chat Workspace (Pages-in-Chat)

| Feature | Status | Notes |
|---|---|---|
| Large agentic chat panel (de-modalized) | `[LIVE]` | `chat-workspace-panel.tsx`; opened via `ActionOrb` "AI Chat"; no click-outside-close; conversation persists |
| Starter option cards on empty chat | `[LIVE]` | FAPI agent demo · Workflow Builder (route) · Dashboard / T1134 (in-chat pages) |
| Open real pages as tabs inside the chat | `[LIVE]` | Chat tab + one tab per page; closing a page returns to Chat |
| Open/close events as clickable thread cards | `[LIVE]` | `PageEventCard` — click re-opens the page from the thread (`ChatMessage.pageEvent`) |
| Entity chips (tools/integrations/workflows/agents/values) | `[LIVE]` | `EntityText` + `lib/resource-registry.tsx` (`splitMentions`); clickable chips; resource `open` facet drives `{as:'page'}` (in-chat tab) or `{as:'route'}` (navigate) |
| Invoke WORKFLOW-BUILDER | `[LIVE]` | Entity + starter + input ("open the builder") → navigates to `/builder` (canvas is a fixed layer, can't embed in a tab) |
| Inline activity trail (vertical, semantic colored dots) | `[LIVE]` | `ActivityTrail` in the thread; `TrailTone` dots — approval/suggestion/calculation/navigation/info; `pushTrailAtom` |
| Bring a specific piece of a screen forward (deep-link + focus) | `[LIVE]` | `resolveTarget` (`lib/resource-registry.tsx`, resource `anchors[]`) → `openPage(pageKey,{focusAnchor})` → scroll + `.cwp-anchor-flash`; wired on FAPI worksheet |
| Inline editable field fragment (edit without opening the page) | `[LIVE]` | `FieldEditor` + `resolveFieldEdit`/`getFieldContext` (`lib/resource-registry.tsx`); "edit the FX rate" / "set the dividend to 5000" renders the field in the thread, bound to `fieldValuesAtom` (persisted) — the real page reads the same atom, so edits sync both ways |
| Shared/persisted field data across page + chat | `[LIVE]` | `fieldValuesAtom` (`atomWithStorage`, key `inscope.fapi.values`); FAPI worksheet rows (`fx`, `a-div`) render as inputs bound to it |
| Data-derived anchors on a screen | `[LIVE]` | Rows/sections emit `data-anchor` from their own ids across FAPI, Dashboard, Surplus, T1134, Executive Overview |
| Addressability — FAPI worksheet | `[LIVE]` | Every calc row/section (`fapi:fx`, `fapi:a`, `fapi:b`, `fapi:95-2`…) |
| Addressability — Dashboard | `[LIVE]` | 7 sections (`dashboard:portfolio`, `:review-queue`, `:work-items`, `:kpis`, `:deadlines`, `:activity`, `:ai-summary`) + per-client `dashboard:client:<id>` |
| Addressability — Surplus worksheet | `[LIVE]` | Every calc row/section (`surplus:opening`, `:reg-5907`, `:taxes`, `:dividends`…) — same `renderRow` pattern as FAPI |
| Addressability — T1134 | `[LIVE]` | Part I + key Part II/III/IV sections (`t1134:part1`, `:part2-s1/2/3a`, `:part3-fapi`, `:part4`) via `SectionAccordion anchor` prop |
| Addressability — Executive Overview | `[LIVE]` | 3 sections (`bu:kpis`, `bu:revenue`, `bu:lines-of-service`) |
| LLM-resolved targets (free-form phrasing) | `[LIVE]` | The agent's `focusAnchor` tool enum is the resource anchor list — free phrasing resolves to a specific part. Falls back to `resolveTarget` keywords offline |
| FAPI Platform-math parity (verified) | `[LIVE]` | The `fapi-run` template (`FAPI_LINES_CALC_RULES` / `FAPI_SUMMARY_CALC_RULES` in `lib/workflow/sample-workflows/fapi-template.ts`) reproduces the old Platform `fapiCalculationEngine.js` math. Verified end-to-end through the real engine (`backend/blocks/logic/calculation-engine/run.ts`): `A = pCoefficient*(income−expense)+95(2)` **unfloored** (via `formulaExpression`), `A1 = 2×debtForgiveness`, `B = capGains×inclusionRate`, `GROSS = A+A1+A2+B+C`, `DEDUCTIONS = D+E+F+F1+G+H`, `FAPI_BRUT = max(GROSS−DEDUCTIONS,0)`, `FAT_DEDUCTION = min_multiply_cap(FAT_PAID,RTF,FAPI_BRUT)`, `NET_FAPI = max(FAPI_BRUT−FAT_DEDUCTION,0)`. RTF snapped to {1.9,4} (fed 2 → 1.9). Documented example reproduced: USD income 572,950 / ded 12,700 → FAPI_BRUT 560,250. **CAD column now per-line** (`GROSS_CAD/DEDUCTIONS_CAD/FAPI_BRUT_CAD/FAT_DEDUCTION_CAD/NET_FAPI_CAD` = line×FX_RATE) matching the parcours dual-currency view. Remaining minor divergence: global `pCoefficient` vs Platform's per-item `applyP` (only matters with mixed per-item P). Reference source of truth: github.com/Mamdou025/Platform `backend/services/fapi` |
| Run → resolve → resume loop | `[LIVE]` | `runFapiLoop()` (`lib/fapi-run.ts`) + `BlockerCard` (panel). Agent runs the real FAPI workflow; on each **blocker** it surfaces a card and pauses: **upload** (needs the trial balance), **categorize** (a row matched no keyword rule — user picks a category, which is injected as a keyword rule and re-run), **approval** (final sign-off with the computed preview). Resolving a blocker accumulates into `FapiLoopState` and re-runs until done, then shows the result + an inline editable field. Verified: categorizing the ambiguous row lifts GROSS 25,000 → 29,500 |
| FAPI classifier — word-order match + full line routing | `[LIVE]` | Two fixes closing a large GROSS gap vs Platform (was 225,800 vs 572,950 on Platform's demo trial balance). **(1) `all_words` matching** — the keyword mapper now matches phrase keywords by word-set (order-independent, plural-tolerant), so `"Investment Income - Interest"` / `"- Dividends"` classify instead of dropping (recovered 112,700 of income). **(2) Input-line routing** — supplemental mapping rules (`fapi-mapping.ts`) + `sum_abs` rollup rules (`fapi-template.ts` `FAPI_ROLLUP_RULES`) route CFA income→C, debt forgiveness→A1, business losses→D, foreign accrual capital losses→E; the four are no longer defaulted in `fapi-inputs` (would clobber the classified value). Verified on Platform's demo TB: **DEDUCTIONS = 12,700 exact**, all lines populate (A1 30,000 · B 78,150 · C 89,400 · D 8,500 · E 4,200), GROSS 225,800 → **538,100** (~6% off 572,950; residual is expense/inclusion judgment). Default 8-row sample unchanged (GROSS 25,000) |
| Unmatched rows are non-blocking (default-route) | `[LIVE]` | `lib/workflow-runs/engine.ts` — with `TemplateConfig.defaultRouteUnmatched` (on for FAPI), rows the mapper can't classify no longer hard-block the run one-by-one. They're left OUT of the calc and surfaced as a non-blocking amber "N rows were left out" banner (`workflow-run-flow.tsx`) with a **Review** button that opens the classify step; categorizing is optional and re-runs. The run computes a figure + reaches approval immediately. Verified: FAPI sample → straight to approval, GROSS 25,000, `needsReview=1 [Management fees from CFA]`; categorizing it lifts GROSS → 29,500. Legacy per-row blocking remains for templates without the flag |
| Human-in-the-loop checkpoint / approval | `[PARTIAL]` | The loop's **approval blocker** is a real interactive gate (run pauses until "Approve & finalize"). Not yet routed through `GovernanceMetadata.approvalState` domain enforcement — that's Step 2 |
| Inline generative-UI result cards (dismissible) | `[DISPLAY]` | `ResultView` — found-email card + GROSS FAPI value/breakdown/sources; ×-dismiss + re-expand (`ChatMessage.result`) |
| Natural-language navigation ("open the dashboard") | `[LIVE]` | LLM tool-call (`openPage`/`closePage`/`closeAll`); deterministic keyword resolver as offline fallback (no AI key needed) |
| CopilotKit chat (streaming + actions) | `[LIVE]` | `components/workspace/copilot-workspace-panel.tsx` + `app/api/copilotkit/route.ts` (CopilotRuntime + OpenAIAdapter, `OPENAI_API_KEY`). Streams the model's text (conversational-first) and runs `useCopilotAction` tools. Monochrome Attio-style theme. Verified on Next 16 / React 19 |
| FAPI run as generative UI (step timeline + HITL) | `[LIVE]` | `runFapiWorkflow` action → `renderAndWaitForResponse` → `<FapiRunFlow>` (`fapi-run-flow.tsx`): Claude-Code-style step timeline; pauses in-chat for **upload → categorize → approve**, re-running the real `runFapiLoop` engine each step, then `respond()`s to the LLM. Does not open the worksheet |
| Inline editable field in chat | `[LIVE]` | `editField` action → `render` → `<InlineFieldCard>`: brings a field into the chat bound to `fieldValuesAtom` (syncs to the worksheet); no page navigation |
| Legacy custom chat agent (AI SDK route) | `[SUPERSEDED]` | `app/api/chat-workspace/route.ts` + old `chat-workspace-panel.tsx` — replaced by CopilotKit; retained as reference for the FAPI loop/blocker generative UI (Phase 3) |
| Event trail (open/close/focus) | `[LIVE]` | `workspaceTrailAtom`; "Trail" dropdown in header |
| Registered pages | `[LIVE]` | Dashboard, Executive Overview, FAPI, Surplus, T1134, Client Workspace (`lib/resource-registry.tsx`, resources with a `page` facet) |
| Unified resource registry (chips + pages + anchors + fields in one spine) | `[LIVE]` | `lib/resource-registry.tsx` — replaced `chat-entities` + `workspace-registry` + `workspace-targets` + `fapi-model` (2026-07-10) |
| LLM-driven tool-calls (navigation/edit) | `[LIVE]` | Resource ids/anchors/fields are the tool enums (`buildAgentCatalog`); `resolveIntent`/`resolveTarget`/`resolveFieldEdit` now serve as the offline fallback only |
| LLM triggers the run (`runFapiDemo` tool) | `[LIVE]` | The model can start the loop; each blocker pauses for the user |
| Real FAPI computation behind the run | `[LIVE]` | `lib/fapi-run.ts` — `runFapiCore()` runs the FAPI template through `runLocalWorkflowTools` (Excel source → keyword mapper → category rollup → two-stage calculation engine) and extracts GROSS / Net FAPI / Net FAPI (CAD) + the mapper's unmatched rows. Injects a sample trial balance (stands in for the parsed email attachment) since the template is upload-first. Verified end-to-end via the loop |
| Real *integration* execution behind the run (EMAIL) | `[PLANNED]` | The EMAIL connect/search steps are still scripted; wire real integrations (Gmail/Drive MCP available). Trial-balance rows are injected rather than parsed from a real attachment |
| In-chat mutations via approval gate | `[PLANNED]` | The checkpoint UI exists; governed mutations must route through `approvalState` enforcement |
| Preserve page state across tab switches | `[PLANNED]` | Only the active window's page is mounted today (switching remounts) |

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
