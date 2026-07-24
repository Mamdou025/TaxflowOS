# Features

*Last updated: 2026-07-21*

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

## Agent page (Sina) — live-agent surface (2026-07-24)

| Feature | Status | Notes |
|---|---|---|
| Agent page (`/agent`) | `[LIVE]` | A workspace surface for the ONE live agent, **Sina** — mirrors the Workflows hub (header tabs via `usePageMenu('agent')`, opened as a workspace window by `app/agent/page.tsx`, registered as `RESOURCES` id `agent`, **Agent** nav pill). `features/agent-hub/` (`agent-page.tsx`, `agent-hub.tsx`, `agent-hub-store.ts`). Distinct from the Agent Lab sandbox — this configures the REAL chat |
| Overview tab (see everything) | `[LIVE]` | Read-only introspection of the live agent: identity + the 4 absorbed domains (FAPI/rollover/expense/campaign); the system-prompt layers; **every tool it can call** (runWorkflow, editField, openPage, focusAnchor, generateUI, explain/why, rememberFact, builder actions…); **all context it sees each turn** (route, active run + live figures, attached docs, editable fields, workflow snapshots, blueprints, remembered facts); models & routing; the active **fiscal guardrails** with a live preview of the injected preamble |
| Build tab (configure live Sina) | `[LIVE]` | Writes `agentConfigAtom` (`features/assistant/runtime/agent-config.ts`): **fiscal mode + pinned context** and **operator instructions** take effect in the live chat immediately (via `applyLiveConfig` in `INSTRUCTIONS()`); **model + effort** stored/surfaced (live-model override is a flagged follow-up); **Reset to defaults**. Closed loop: Build writes → live chat reads → Overview reflects |
| Lab tab (embedded Agent Lab) | `[LIVE]` | The full **Agent Lab** embedded as a third tab (`<AgentLabPage embedded />`) — all features/sections intact (model lanes, prompt folders, tools, docs, fiscal, context-scope, effort, provenance, Sina auto-routing). **Isolated from the live agent** by construction: it runs on its OWN `/api/agent-lab` runtime, so it's a safe sandbox to configure + compare models without touching the real chat. `embedded` drops the standalone "← Back to main" header so it fits the panel |

## Agent Lab (2026-07-23)

| Feature | Status | Notes |
|---|---|---|
| Agent Lab page (`/agent-lab`) | `[LIVE]` | Configure + evaluate an AI-SDK agent in the browser; isolated from the CopilotKit chat. Component **moved to `features/agent-lab/agent-lab-page.tsx`** (2026-07-24); `app/agent-lab/page.tsx` re-exports it for the standalone route. Takes an `embedded?` prop (drops the standalone header) so it also renders as the **Agent page's "Lab" tab** |
| Configurable fields | `[LIVE]` | Model (dropdown + free-text), system prompt, tool checkboxes (5 categories), temperature, max steps, **effort** (Anthropic thinking-depth dial) |
| Model router (provider knobs) | `[LIVE]` | `features/agent-lab/model-router.ts` — pure `planForModel(id, {effort})` decides per-model provider options: **omits temperature** for the 4.7+/5-era Anthropic family (Opus 4.7/4.8, Sonnet 5, Fable 5 — they 400 on non-default sampling); sends **`effort`** only where accepted (not Haiku 4.5 / Sonnet 4.5); **prompt-caches** the system/doc block on Anthropic (`cacheControl: ephemeral`) so repeated runs read it at ~10% price. Applied plan + cached-token count shown in the provenance panel. Non-Anthropic models keep prior behavior |
| **Sina auto-routing** (pick model per question) | `[LIVE]` | Selecting **"Sina" (`AUTO_MODEL_ID = 'sina-auto'`)** in the model dropdown routes each question instead of pinning a model: `routeAuto()` (deterministic keyword heuristic) classifies the latest user message → **quick** (Haiku 4.5, lookups/extraction), **balanced** (Sonnet 5, general Q&A), **reasoning** (Sonnet 5 + effort high, compare/why), **deep** (Opus 4.8 + effort high, tax calculations / statutory reasoning). A concrete pick is used literally; a manual effort still overrides. Provenance shows the picked model + tier + one-line reason. Heuristic is transparent + tunable (swap for an LLM classifier later) |
| **Golden-case eval harness** (non-negotiable #4) | `[LIVE]` | `features/agent-lab/evals/` + `pnpm agent-lab:evals` (`--model <id>`, `--verbose`). Runs each case through the real agent with **fiscal mode forced on**, then scores the answer against the non-negotiables via pure heuristic scorers (`score.ts`): **cite** (statute/CRA/RQ or a grounding tool), **defer** (elections/positions), **flag-out-of-scope** (year/jurisdiction mismatch), **no-bare-figures**, **mention/not-mention**, **figure-match**. `cases.ts` ships 4 **behavioral** example cases (domain-safe — assert *behavior*, need no known tax figure) + a commented **figure-case template** to fill with real known-correct data. Exits non-zero on any fail → can gate changes. Loads `.env.local`; makes real model calls (manual, not in build). Heuristic scorers = same lexical blind spot as the rest (upgrade: LLM judge) |
| **Fiscal mode** (tax non-negotiables) | `[LIVE]` | `features/agent-lab/fiscal.ts` + a config-panel toggle. When on, `fiscalPreamble(ctx)` is **prepended (un-prunable) to the top of the system prompt**: a pinned **fiscal context** (tax year · province/jurisdiction · entity type · residency · currency; Canadian/Québec defaults — CRA + Revenu Québec) plus **5 non-negotiable rules** — (1) cite the authority or say you can't verify it, (2) never self-compute figures (use a tool/engine), (3) currency-of-law (verify rates/thresholds against current CRA/RQ), (4) defer on elections/positions, (5) flag uncertainty. Prepended after context-scoping so it's always present. Provenance shows the fiscal stamp; settings persist (`agent-lab-fiscal`). Implements non-negotiables #1–#3 as testable guardrails; graduation path = the live assistant runtime |
| **Context scope** (per-turn folder + tool selection) | `[LIVE]` | `features/agent-lab/context-router.ts` — an Advanced-panel toggle **Send all ↔ Auto (relevant only)**. In `auto`, `selectContext()` runs a per-turn intent step (deterministic keyword match over the question) that keeps only the prompt **folders** + **tools** relevant to it, instead of sending every enabled one each turn — smaller/sharper context. Safe by construction: always keeps the identity folder; falls back to "everything" when nothing confidently matches (never starves the turn). Client-side (question + folders + tools are all on the page); the route just receives a scoped `system` + `enabledTools`. Provenance shows folders N/M · tools K/L + the match reason. Same keyword blind spot as the doc search (upgrade path: LLM/embedding intent router); also lowers prompt-cache reuse since the prefix varies per question |
| System-prompt sections (folders) | `[LIVE]` | The single agent's system prompt is authored as toggleable, reorderable named sections; enabled sections are joined (each as `## name` + content) into one prompt; add/remove/rename/move; auto-persisted (`agent-lab-sections`, survives refresh) + a named **saved-prompts library** (save/load/delete named section sets, `agent-lab-saved-prompts`); starters Role / Tool use / Style |
| Side-by-side model compare | `[LIVE]` | Up to 3 chat columns ("lanes"), each on its **own model** (dropdown + custom id) but sharing one system prompt + tools + docs; a single composer fans the same message to every column → compare answers + provenance side by side |
| Models reference | `[LIVE]` | Left-panel list of the dropdown models, each with a one-line "particularity" (`blurb`) + Gateway/Direct badge + link to the gateway catalog for exact context/pricing. Anthropic tiers: Haiku 4.5 (fast/cheap reads), Sonnet 5 (default), Opus 4.8 (tax logic), Fable 5 (premium) |
| Observability panel | `[LIVE]` | Prints every tool call + input + output + token usage under each answer — the "see what the agent is doing" goal. Also shows the **model-router readout** (provider · effort · cache hit/tokens · temperature sent/dropped) + cached-input tokens in the token summary |
| Document & Excel memory | `[LIVE]` | Attach PDF / Word / **Excel (.xlsx/.xls)** / text → extracted to text (`extractFile()`; Excel parsed in-browser via `xlsx` → CSV, the rest via `/api/assistant/extract`) → injected into context; per-doc enable/remove; removable doc chips above the composer; live context-size meter |
| Document retrieval (RAG) + mode toggle | `[LIVE]` | A **document-mode toggle** (Full text in context ↔ Retrieve on demand). In retrieval mode the file is NOT injected; the agent calls `searchDocuments` (keyword "RAG lite" — chunks docs, returns only matching passages, built per-request with the docs) so it can read files too big to load whole. Context-size meter drops doc chars in retrieval mode so the trade-off is visible |
| Model switching (no new deps) | `[LIVE]` | Bare id → direct OpenAI (`OPENAI_API_KEY`); `provider/model` → Vercel AI Gateway (`AI_GATEWAY_API_KEY`) |
| Starter tools (13) | `[LIVE]` | `features/agent-lab/tools.ts` — *template* (date/time, calculator, weather-demo, in-memory notes), *real* (`getFxRate` = live Bank-of-Canada FX, `fetchWebPage` ~15k chars, `searchCanadianTax`), *retrieval* (`searchDocuments`), *workflow-template* (`estimateForeignIncomeTax`), *workflow-action* demos (focusBlock/addBlock/editBlockConfig) |
| Canadian tax lookup (CRA / canada.ca) | `[LIVE]` | `searchCanadianTax` — Firecrawl `/v1/search` scoped (`site:`) **and** hard-filtered by hostname to `canada.ca` + `cra-arc.gc.ca`; returns citable title/url/snippet; needs `FIRECRAWL_API_KEY`. Gives the agent current/authoritative CA tax info instead of frozen training data |
| Template workflow (3 inputs → result) | `[LIVE]` | `estimateForeignIncomeTax` — give income + currency + year (typed or from an attached file); converts to CAD via live FX and estimates combined corporate tax with a $500k small-business threshold; returns a full breakdown + assumptions. A one-click example seeds the composer on the empty chat |
| Backend route | `[LIVE]` | `POST /api/agent-lab` (`runAgent`), auth-gated in production, open in local dev |

### Notes
- Deliberately additive: does **not** modify `/api/copilotkit` or the assistant runtime — fully reversible.
- Not yet wired into the nav — reachable at `/agent-lab` directly.
- In-memory notes reset on restart/cold start; workflow-action tools are echo-only here (they act for real on the builder canvas).

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
| Import trial balance from Google Drive / Gmail | `[LIVE]` (needs Google OAuth creds to go live) [2026-07-15] | `GoogleSourcePicker` in the run's upload step — pull the workbook from a Drive spreadsheet (native `.xlsx` or a Google Sheet exported to xlsx) or an `.xlsx`/`.xls` **Gmail attachment**. Server routes `app/api/google/*` read the Google OAuth token better-auth stores in the `accounts` table (`lib/google/client.ts`, read-only Drive+Gmail scopes, auto-refresh) and return **raw bytes**; the client wraps them in a `File` and runs the SAME `parseUploadToRows`, funneling into the same `applyRows` path as a disk upload → identical rows/numbers. Connect via `authClient.linkSocial` (works for anonymous sessions). Degrades gracefully when unconfigured. Needs `GOOGLE_CLIENT_ID/SECRET` + Drive/Gmail APIs enabled to test live |
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
| Assistant knows ANY template worksheet (retrieval, not paste) | `[LIVE, 2026-07-16]` | `WorksheetCopilot` + `lib/worksheet-intel/` (`createTemplateIntel` over any `TemplateConfig`). One ambient readable per open worksheet = compact computed snapshot; the chat answers "what is line X" directly. Backed by the SAME `runTemplateCore` the sheet renders, so numbers match. Generic: FAPI + Roulement + any future template, zero per-worksheet code |
| Explain a worksheet line (value + formula + operands + source rows) | `[LIVE, 2026-07-16]` | Global action `explainWorksheetLine(query, worksheet?)` → registry → `intel.explainLine`; resolves each operand to its live value (input/classified-bucket/line/summary/param) + returns classified source rows via the config's optional `worksheetProvenance` hook. `resolveLine` maps free-text ("95(2)", "gain en capital brut") → the line |
| Trace how a figure was derived | `[LIVE, 2026-07-16]` | Global action `whyWorksheetValue(query, worksheet?)` → `intel.why`; recursive depth-2 expansion down to lines / classified buckets / inputs / params. Works for `formulaExpression` rules (FAPI) and `operands`/`computeExtra` rules (Roulement) |
| Search worksheet lines/formulas by concept | `[LIVE, 2026-07-16]` | Global action `searchWorksheet(query, worksheet?)` → `intel.search`; lexical scan over codes/labels/formulas, no deps ("capital gains" → line B; "montant élu" → 4 roulement lines) |
| Multiple worksheets answerable at once | `[LIVE, 2026-07-16]` | Registry (`worksheetIntelRegistryAtom`) keyed by worksheet id; global actions dispatch by the optional `worksheet` arg (read at call time via `useStore()`), so N open worksheets keep unique action names |
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
| Large agentic chat panel (de-modalized) | `[REMOVED]` | ~~`chat-workspace-panel.tsx`~~ deleted 2026-07-13; behavior now in `components/workspace/copilot-workspace-panel.tsx` (`ChatWorkspace`) |
| Client selector on the composer orb | `[LIVE, 2026-07-20c]` | Big 64px InScope orb to the LEFT of the composer (`.lc-orb-select`, `aside-thread.tsx`) shows + switches the active client (name + chevron → `GlobalClientSwitcher`). Replaces the old right-side context chip. Attach uses the paperclip icon |
| Sidebar folder tree — clients & chat history | `[LIVE, 2026-07-20e]` | `components/workspace/client-folders.tsx` + `lib/folder-tree.ts` (persisted `folderTreeAtom`). "CLIENTS & CHATS" section: client/company folders → arbitrary subfolders → chats (the history). Expand/collapse, **create** folder·subfolder·chat, **rename** (double-click, inline), **delete** (hover). Clicking a top-level folder sets the **active client** (`selectedClientAtom`); the active client folder highlights. Chats are seed/display (no transcript backend yet — selecting highlights via `selectedChatAtom`) |
| Intent-aware composer ("Scope Console") | `[LIVE, 2026-07-20; Sina 2026-07-24]` | `AsideInput` (`aside-thread.tsx`) — neumorphic console: input · **intent ribbon** · capability bar · labelled send. As you type, `lib/composer-intent.ts` previews the action (**Run/Open/Build/Send**); a Run preview now names **Sina** (the one agent, `SINA`) instead of a per-workflow persona. **Advisory preview only** — never executes; honours the ask-vs-act gate (mention ≠ command). Unit 12/12; live-verified (run→Sina, open→Scope) |
| Starter option cards on empty chat | `[LIVE]` | FAPI agent demo · Workflow Builder (route) · Dashboard / T1134 (in-chat pages) |
| Open real pages as tabs inside the chat | `[LIVE]` | Chat tab + one tab per page; closing a page returns to Chat |
| Open/close events as clickable thread cards | `[LIVE]` | `PageEventCard` — click re-opens the page from the thread (`ChatMessage.pageEvent`) |
| Entity chips (tools/integrations/workflows/agents/values) | `[LIVE]` | `EntityText` + `lib/resource-registry.tsx` (`splitMentions`); clickable chips; resource `open` facet drives `{as:'page'}` (in-chat tab) or `{as:'route'}` (navigate) |
| Invoke WORKFLOW-BUILDER | `[LIVE]` | Entity + starter + input ("open the builder") → navigates to `/builder` (canvas is a fixed layer, can't embed in a tab) |
| Inline activity trail (vertical, semantic colored dots) | `[LIVE]` | `ActivityTrail` in the thread; `TrailTone` dots — approval/suggestion/calculation/navigation/info; `pushTrailAtom`. Events now carry an optional `actor` (Human/Agent/Workflow/Tool/System) for attribution `[2026-07-17]` |
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
| Run → resolve → resume loop | `[LIVE]` | *(engine relocated: `lib/fapi-run.ts` deleted → now `lib/workflow-runs/engine.ts` `runTemplateLoop` + `WorkflowRunFlow`)* + `BlockerCard`. Agent runs the real FAPI workflow; on each **blocker** it surfaces a card and pauses: **upload** (needs the trial balance), **categorize** (a row matched no keyword rule — user picks a category, which is injected as a keyword rule and re-run), **approval** (final sign-off with the computed preview). Resolving a blocker accumulates into `FapiLoopState` and re-runs until done, then shows the result + an inline editable field. Verified: categorizing the ambiguous row lifts GROSS 25,000 → 29,500 |
| FAPI classifier — word-order match + full line routing | `[LIVE]` | Two fixes closing a large GROSS gap vs Platform (was 225,800 vs 572,950 on Platform's demo trial balance). **(1) `all_words` matching** — the keyword mapper now matches phrase keywords by word-set (order-independent, plural-tolerant), so `"Investment Income - Interest"` / `"- Dividends"` classify instead of dropping (recovered 112,700 of income). **(2) Input-line routing** — supplemental mapping rules (`fapi-mapping.ts`) + `sum_abs` rollup rules (`fapi-template.ts` `FAPI_ROLLUP_RULES`) route CFA income→C, debt forgiveness→A1, business losses→D, foreign accrual capital losses→E; the four are no longer defaulted in `fapi-inputs` (would clobber the classified value). Verified on Platform's demo TB: **DEDUCTIONS = 12,700 exact**, all lines populate (A1 30,000 · B 78,150 · C 89,400 · D 8,500 · E 4,200), GROSS 225,800 → **538,100** (~6% off 572,950; residual is expense/inclusion judgment). Default 8-row sample unchanged (GROSS 25,000) |
| Unmatched rows are non-blocking (default-route) | `[LIVE]` | `lib/workflow-runs/engine.ts` — with `TemplateConfig.defaultRouteUnmatched` (on for FAPI), rows the mapper can't classify no longer hard-block the run one-by-one. They're left OUT of the calc and surfaced as a non-blocking amber "N rows were left out" banner (`workflow-run-flow.tsx`) with a **Review** button that opens the classify step; categorizing is optional and re-runs. The run computes a figure + reaches approval immediately. Verified: FAPI sample → straight to approval, GROSS 25,000, `needsReview=1 [Management fees from CFA]`; categorizing it lifts GROSS → 29,500. Legacy per-row blocking remains for templates without the flag |
| "Review N" banner button actually opens the review | `[LIVE, 2026-07-16 · fix]` | The banner sits below the steps; its Review button expanded the classify step **off-screen above** (esp. once the run is `done`), reading as "nothing happens". Now `reviewUnmatched()` sets `expanded=1` **and** `scrollIntoView`s the classify step (`classifyStepRef`, double-rAF so the expanded body is committed first); `ClassifyReview` also lists **unmatched rows first** so the actionable ones are at the top after scroll (`workflow-run-flow.tsx`) |
| Human-in-the-loop checkpoint / approval | `[PARTIAL]` | The loop's **approval blocker** is a real interactive gate (run pauses until "Approve & finalize"). Not yet routed through `GovernanceMetadata.approvalState` domain enforcement — that's Step 2 |
| Inline generative-UI result cards (dismissible) | `[DISPLAY]` | `ResultView` — found-email card + GROSS FAPI value/breakdown/sources; ×-dismiss + re-expand (`ChatMessage.result`) |
| Natural-language navigation ("open the dashboard") | `[LIVE]` | LLM tool-call (`openPage`/`closePage`/`closeAll`); deterministic keyword resolver as offline fallback (no AI key needed) |
| CopilotKit chat (streaming + actions) | `[LIVE]` | `components/workspace/copilot-workspace-panel.tsx` + `app/api/copilotkit/route.ts` (CopilotRuntime + OpenAIAdapter, `OPENAI_API_KEY`). Streams the model's text (conversational-first) and runs `useCopilotAction` tools. Monochrome Attio-style theme. Verified on Next 16 / React 19 |
| Chat commands + builds the Workflow Builder | `[LIVE]` [2026-07-17] | `BuilderCopilot` (`components/assistant/builder-copilot.tsx`) exposes a full build verb set so the chat is the builder's command surface (the removed Inspector/Preview panels' replacement): **actions** `focusBlock` · `editBlockConfig` · `addBlock` · `connectBlocks` · `deleteBlock` (Source-protected) · `renameWorkflow` · `loadWorkflow` · `saveWorkflow` · `runBuilderWorkflow` (renamed from `runWorkflow` [2026-07-17] so it doesn't collide with the chat's named-workflow `runWorkflow` on `/builder`) — wired to the workflow-store command atoms (undo/redo-safe) + `builderBridgeAtom`. **Grounding readables:** the block catalog (valid `addBlock` types), the built workflows (valid `loadWorkflow` targets), and a live health check (missing Source/Output, blocks not wired in / feeding nothing) so the chat proposes only valid moves and flags gaps. Type-checked; live dispatch needs the running app + model |
| Page ⇄ Chat contract (command + summon any page) | `[LIVE]` [2026-07-17] | The general pattern: `lib/page-chat-store.ts` `usePageChat(surface, deps)` lets any open page publish a **surface** — `context` (live snapshot), `commands` (named verbs), `Embed` (compact inline view) — into `pageChatSurfacesAtom` (sibling of `usePageMenu`). `use-assistant.tsx` exposes two GENERIC actions over the registry: **`commandPage(commandId, pageKey?, argsJson?)`** runs a command on the page the user is looking at (pageKey defaults to the active tab → the only open surface), and **`bringIntoChat(pageKey)`** renders a page inline via `components/assistant/surface-embed.tsx` (`SurfaceEmbed`: the page's `Embed`, else the registered page `Component` bounded+scrollable, inside an error boundary). A "commandable surfaces" readable lists each open page's context + commands so the model knows what it can do. **Adopted by:** the Workflow Builder (`BuilderCopilot` publishes context + `checkHealth`/`listBlocks` commands + a `WorkflowGlance` Embed). Any registered page is summonable via the resource-registry fallback. Type-checked; `/` serves clean; live dispatch needs the running app + model |
| FAPI run as generative UI (step timeline + HITL) | `[LIVE]` | `runWorkflow` action → **non-blocking** `handler` + `render` → `<RunWorkflowRender>` → `<WorkflowRunFlow>`: Claude-Code-style step timeline; pauses in-chat for **upload → categorize → approve**, re-running the real engine loop each step. Does not open the worksheet. **[2026-07-15]** switched off `renderAndWaitForResponse` — the open tool call broke follow-ups typed mid-run (`Tool result is missing for tool call …`); the handler now resolves immediately and run state/result reach the LLM via the `activeRun` readable + trail. **[2026-07-17]** `RunWorkflowRender` is now **exported** and also mounted deterministically by `assistant-thread.tsx` for launcher-initiated runs (`pinnedRuns`) — a composer click no longer depends on the model routing a `say()` phrase (which silently failed for `expense`/`campaign`); typed "run X" still routes inline via the action, and INSTRUCTIONS now enumerate all four ids (`fapi`·`roulement`·`expense`·`campaign`) |
| Inline editable field in chat | `[LIVE]` | `editField` action → `render` → `<InlineFieldCard>`: brings a field into the chat bound to `fieldValuesAtom` (syncs to the worksheet); no page navigation |
| `@`-command menu (capability discoverability) | `[LIVE]` [2026-07-16] | Typing `@` in the composer opens a filterable menu of the assistant's "build functions" so a capability can be picked by name without knowing the tool vocabulary. Catalog = `use-assistant`'s `composerCommands` (families: open worksheet · edit-fx inline · show FAPI source/output · run FAPI/roulement · generate-UI presets); each runs the most reliable path (launcher direct / `say()` canned phrase — GenUI presets `say('Generate this view: …')` → the in-chat `generateUI` action). `aside-thread.tsx` `AsideInput` switches the existing suggestion palette to command-mode on `text.startsWith('@')` |
| Open-ended generative UI (OpenUI spike) | `[WIP]` [2026-07-15] | **Free-form "prompt → live UI"**, distinct from CopilotKit's fixed-action renders. `app/genui-lab/page.tsx` (demo) → `app/api/genui/route.ts` streams OpenUI Lang from OpenAI → `<Renderer library={genuiLibrary}>` mounts real components as tokens arrive. Library = OpenUI's 54 built-ins (BarChart/Table/Card/Input/…) + our custom `TaxMetric` tile via `defineComponent` (`lib/genui/library.tsx`). Model composes ANY layout from the registered vocabulary — no per-request code. **Constraint:** `@openuidev/react-lang` calls `React.createContext` at import, so it CANNOT be imported in an App Router route (RSC react-server build has no `createContext`); the system prompt is pre-generated to `lib/genui/system-prompt.txt` by `scripts/gen-genui-prompt.cjs` (`pnpm genui:prompt`) and the route reads the file. Deps: `@openuidev/{react-lang,react-ui,react-headless}` + `zustand@^4.5.5` (v5 breaks OpenUI's headless store). Verified end-to-end on Next 16 / React 19: "3 KPI tiles + a dividends bar chart" renders live (custom TaxMetric + built-in BarChart together). **Steering:** the route runs `temperature: 0` + a hard `STEER` system message (one-shot example, "first chars must be `root =`") because gpt-4o otherwise narrates in prose for short prompts instead of emitting OpenUI Lang → Renderer gets nothing. **Reliability pass [2026-07-16]:** default model bumped to **`gpt-4.1`** (`GENUI_MODEL` override; separate from CopilotKit's model) which follows the DSL far more reliably; plus a **first-line sniff + one hard-steer retry** (`looksLikeLang` → non-streaming `HARD_STEER` re-request) so a prose answer self-heals instead of rendering a Markdown table / nothing. **In-chat bridge (`renderUI`) [LIVE 2026-07-16]:** a **`generateUI`** CopilotKit action (`use-assistant.tsx`) renders OpenUI **inside the chat** — its `render` mounts `components/assistant/genui-render.tsx` (`GenUIRender`: POST `/api/genui` → stream → `<Renderer>` in a light card), lazy `next/dynamic({ssr:false})`, non-blocking, gated on `status==='complete'` so the fetch uses the full prompt. Routed by an INSTRUCTIONS rule + the `@`-menu GenUI commands (now `say('Generate this view: …')`). `/genui-lab` remains the standalone lab. Still open: no writeback (generated forms are display-only), data still sample |
| Legacy custom chat agent (AI SDK route) | `[REMOVED]` | ~~`app/api/chat-workspace/route.ts` + `chat-workspace-panel.tsx`~~ — **deleted 2026-07-13** (not retained). Replaced by CopilotKit (`/api/copilotkit`). |
| Event trail (open/close/focus) | `[LIVE]` | `workspaceTrailAtom`; "Trail" dropdown in header |
| Registered pages | `[LIVE]` | Dashboard, Executive Overview, FAPI, Surplus, T1134, Client Workspace (`lib/resource-registry.tsx`, resources with a `page` facet) |
| Unified resource registry (chips + pages + anchors + fields in one spine) | `[LIVE]` | `lib/resource-registry.tsx` — replaced `chat-entities` + `workspace-registry` + `workspace-targets` + `fapi-model` (2026-07-10) |
| LLM-driven tool-calls (navigation/edit) | `[LIVE]` | Resource ids/anchors/fields are the tool enums (`buildAgentCatalog`); `resolveIntent`/`resolveTarget`/`resolveFieldEdit` now serve as the offline fallback only |
| LLM triggers the run (`runFapiDemo` tool) | `[LIVE]` | The model can start the loop; each blocker pauses for the user |
| Real FAPI computation behind the run | `[LIVE]` | *(`lib/fapi-run.ts` deleted → now `lib/workflow-runs/` `runTemplateCore`)* runs the FAPI template through `runLocalWorkflowTools` (Excel source → keyword mapper → category rollup → two-stage calculation engine) and extracts GROSS / Net FAPI / Net FAPI (CAD) + the mapper's unmatched rows. Injects a sample trial balance (stands in for the parsed email attachment) since the template is upload-first. Verified end-to-end via the loop |
| Real *integration* ingestion behind the run (Drive/Gmail) | `[PARTIAL]` [2026-07-15] | The trial balance can now be pulled from **real** Google Drive / Gmail (see "Import trial balance from Google Drive / Gmail" above) — real OAuth, real file bytes, real parse. What's still not automated: the agent doesn't yet *search* email and auto-select which attachment is the trial balance (the user picks it); needs `GOOGLE_CLIENT_ID/SECRET` configured to run live |
| In-chat mutations via approval gate | `[PLANNED]` | The checkpoint UI exists; governed mutations must route through `approvalState` enforcement |
| Preserve page state across tab switches | `[PLANNED]` | Only the active window's page is mounted today (switching remounts) |
| Standalone run surface (no AI) | `[LIVE]` [2026-07-15] | `app/run/[workflowId]/page.tsx` renders `WorkflowRunFlow` on a plain route — the full upload → categorize → [elect] → approve loop with **no AI in the loop**. Makes runs reachable without the chat |
| Scope launchpad (home folded into the assistant) | `[LIVE]` [2026-07-15] | Scope's empty state shows the chat composer **+** `scope-launchpad.tsx`: Build/Dashboard tiles (direct nav), Run FAPI/Roulement (launch **in chat**), Recent Activity + Needs you cards (direct nav to worksheets/`/run`). One page, chat-first, still not AI-only. The separate `/home` page was removed (redirects to `/`) |
| Assistant sees the real value of every editable field | `[LIVE]` [2026-07-17] | `use-assistant.tsx` publishes an **editable-field-values** readable (each field + current value + `isDefault`; bound fields resolve to the engine input). The model answers "what is the FX rate?" from the real number and says "not set" on `isDefault` — no more inventing "1" |
| Assistant sees live workflow data with no worksheet open | `[LIVE]` [2026-07-17] | **live-workflow-data** readable: for any workflow with an uploaded source / edited input / active run, the same `createTemplateIntel(cfg).describe()` snapshot the sheet renders (lines, summary+CAD, FX, classification). Generic across `WORKFLOW_CONFIGS` |
| Inline chat field edits the real engine input | `[LIVE]` [2026-07-17] | `ResourceField.binding` (`fx → fapi/fxRate`) makes `InlineFieldCard` read/write `runEditsAtom[wf].inputs[key]` — one value across chat/sheet/run (was a dead parallel `fieldValuesAtom`) |
| Field-id guesses resolve instead of failing | `[LIVE]` [2026-07-17] | `resolveFieldId()` maps `FX_RATE`/`fx rate`/`fxRate` → `fx`; `editField` uses it + returns the field list on a true miss (fixes "No editable field FX_RATE") |
| explain/why/search answer from the bare chat | `[LIVE]` [2026-07-17] | `resolveIntelFor()` builds intel from a workflow's live/sample data when no worksheet is mounted |
| Inspect what the model receives (trace) | `[LIVE]` [2026-07-17] | `COPILOT_TRACE=1` → `lib/copilot-trace.ts` dumps the exact input (system + readables + tools + messages) to `.copilot-trace/`. Preview without the LLM: `pnpm tsx scripts/preview-copilot-context.ts` |
| FX / rate kept accurate through the computation | `[LIVE]` [2026-07-18] | The calc engine rounded EVERY result to cents, flattening `FX_RATE` 1.3978 → 1.40 and corrupting every `*_CAD` conversion. New `roundResult(value, resultKey)` — rate keys (`/_RATE$\|^FX/i`) flow at full precision, money still rounds to 2dp; display rounds at the surface. Verified: 1.3978 → FX_RATE 1.3978, GROSS_CAD 34,945.00; no regression at FX 1.35 (NET_FAPI_CAD 33,493.50). Generic across FAPI/Roulement/expense/demo |
| Same run → same numbers on every surface | `[LIVE]` [2026-07-18] | The summoned "· OUTPUT" chat card (`WorkflowElementCard`) recomputed from static sample data (25k @ 1.35) while the run/worksheet used the uploaded file (147,322 @ 1.3978). Now it reads `uploadedRowsAtom`+`runEditsAtom` and runs the same `runTemplateCore` call as the worksheet. Rates display at full precision (`fig`/`numRate`, was 2dp → "1.40"); the `activeRun` readable no longer integer-rounds (FX was "1"). Chat card ≡ worksheet ≡ run result |
| Attached documents are actually read (PDF / text) | `[LIVE]` [2026-07-19] | **Fix:** the composer's file attach used to drop only a `[Attached name.pdf]` filename tag into the message — the model never received the content, so it kept (correctly) saying "I can only see the filename". Now `onAttach` (`components/assistant/use-assistant.tsx`) extracts the file: workbooks → rows (as before); **PDF / plain-text → text** via `POST /api/assistant/extract` (`unpdf` for PDFs, UTF-8 decode for txt/md/csv/json/yaml/xml/html, Node runtime, capped at 120k chars with a `truncated` flag; a scanned/image-only PDF returns a clean 422 "needs OCR"). Extracted text lands in `attachedDocsAtom` (`lib/workspace-store.ts`, in-memory) and reaches the model via an **attached-documents** `useCopilotReadable`; the chat message carries only a short note (full text rides in context, not the bubble). Verified end-to-end through the running dev server: `codedutravail.pdf` (78-page Senegal Labour Code) → `pages:78, chars:120000, truncated:true` with correctly-accented French text. No OCR needed for text-layer PDFs |

---

## AI / Agent Features

| Feature | Status | Notes |
|---|---|---|
| AI prompt panel (Cmd+K) | `[LIVE]` | Streaming generation, keyboard shortcut |
| AI block/edge generation from prompt | `[LIVE]` | Generates nodes and edges incrementally |
| Existing workflow context for AI | `[LIVE]` | Current blocks/edges passed as context |
| AI proposal lifecycle (proposed→approved→rejected) | `[PARTIAL]` | Types defined; approval UI TBD |
| Live coworker-activity indicator | `[LIVE]` | `CoworkerActivity` names who's working in the chat — **Sina · Reviewing…** (`SINA` in `lib/coworkers.ts`, set by `specialist-presence.tsx`) while a reply streams, **Workflow Engine · Deterministic** while computing — via `activeCoworkerAtom`. Actor taxonomy Human/Agent/Workflow/Tool/System; the engine is never mislabeled as an agent. `[2026-07-17; unified to Sina 2026-07-24]` |
| Work menu + registry (conversation-first console, increment 1) | `[LIVE]` | `WorkMenu` (`components/assistant/work-menu.tsx`) over a persisted `lib/work-store.ts` registry — every choke point upserts a WorkItem (type/title/status/coworker/latest-update); **Open** reopens its current state, **Jump** scrolls to the `data-work-id` card. Additive; the conversation-first layout flip + scrollbar markers are deferred increments. Verified live: `e2e/deep-chat.spec.ts` 3/3 (render, run+coworker+Jump, LLM message+follow-up no orphan error). `[2026-07-17]` |
| Per-message coworker avatars | `[LIVE]` | `AsideAssistantMessage` shows the responsible coworker's avatar via `coworkerForMessage()` — the message's tool call → UI Composer (generateUI) / UI Concierge (page ops); **plain replies + workflow proposals → Sina** (the one unified agent, `[2026-07-24]`). Per-message specialist map retired. Shared `CoworkerAvatar`. `[2026-07-17]` |
| ~~Agent roster + @-mention to assign work~~ → **Task quick-starts** | `[LIVE]` | **[REPLACED 2026-07-24]** The four-specialist roster / `@`-mention / 👥 agents popover / "Talk to an agent" hero are removed (one unified agent, Sina). The empty-state hero now shows **task quick-start cards** (Calculate FAPI · Roulement art.85 · Expense · Campaign) that launch the workflow directly (`launchStartWorkflow`, deterministic, no LLM routing). `[2026-07-17 → 2026-07-24]` |
| **Ask/Propose/Execute intent gate** | `[LIVE]` | Deterministic intent layer in the CopilotKit runtime (`lib/assistant-runtime/`, wired in `app/api/copilotkit/route.ts`) — a workflow **mention/question/negation** now withholds `runWorkflow` (can no longer trigger a run) while an explicit **command** keeps it and is steered to the right workflow via an `[assistant-routing]` directive. Bilingual EN/FR, fail-open, `ASSISTANT_INTENT_GATE` off/shadow/**enforce**(default). Evals: `pnpm assistant:evals` → 118/118, 0 false executions, 0 missed commands. See `docs/assistant-routing-policy.md`. `[2026-07-18]` |
| Structured LLM intent router (optional) | `[PARTIAL]` | `classifyWithLLM` (`lib/assistant-runtime/routing/intent-router.ts`) produces the same `AssistantRoute` via OpenAI structured output — built + type-safe but **not in the hot path** (reserved for shadow comparison / inspector / future pre-flight endpoint). `[2026-07-18]` |
| **Per-turn model tiering (smarter answers)** | `[LIVE]` | `lib/assistant-runtime/model-policy.ts` picks the model from the route the gate already computes — **deep** model for hard tax/analysis questions, **fast** for navigation, standard otherwise — via `BuiltInAgent` `overridableProperties` + `forwardedProps.model` in `app/api/copilotkit/route.ts`. **No-op until `ASSISTANT_MODEL_FAST`/`DEEP` are set to distinct models** (every tier defaults to `OPENAI_CHAT_MODEL`). Rollback `ASSISTANT_MODEL_TIERING=off`. Offline checks in `pnpm assistant:evals`. See `docs/assistant-model-policy.md`. `[2026-07-18]` |
| **One agent, Sina — per-turn domain focus** | `[LIVE]` | There is ONE assistant, **Sina** (the former Sofi/Théo/Mira/Nova personas are fully collapsed as of 2026-07-24). Each turn about a resolved workflow surfaces that workflow's DOMAIN FOCUS (expertise text) — no identity swap. Server injects it as a context item from the route the gate computed (`features/assistant/runtime/agents/sina.ts` `sinaTurnDirective` → `specialists.ts` `selectDomain`/`WORKFLOW_DOMAINS`); `SpecialistPresence` (`features/assistant/ui/specialist-presence.tsx`) shows **Sina** answering (cosmetic, yields to runs). Flag `ASSISTANT_SPECIALISTS` (default on). `[2026-07-18 → unified 2026-07-24]` |
| **Durable assistant memory (facts/preferences)** | `[LIVE]` (needs `pnpm db:migrate`) | The chat can durably remember facts/preferences the user explicitly asks it to save ("remember Acme's 2025 FX is 1.3978", "always CAD") — Postgres `assistant_memories`, per-user, scoped per client with **no cross-client bleed** (`lib/assistant-runtime/memory/`). `MemoryCopilot` (`components/assistant/memory-copilot.tsx`, mounted once in app-shell) publishes remembered facts as grounding + registers `rememberFact`/`forgetFact`; `GET/POST/DELETE /api/assistant/memory` (better-auth scoped, fail-soft). Explicit opt-in only (never auto-saved). Live-DB round-trip pending migration. See `docs/assistant-memory-policy.md`. `[2026-07-18]` |
| AI-assisted logic code mode | `[STUB]` | Mode selector exists; not functional |
| AI Search Result source block | `[STUB]` | Catalog entry; no AI search execution |

---

## Document Viewer (2026-07-19)

A first-class platform page for opening and reading documents in-app, alongside the Workflow Builder / worksheets / Dashboard.

| Feature | Status | Notes |
|---|---|---|
| Document Viewer page | `[LIVE]` | `components/workspace/document-viewer.tsx` — registered as resource `viewer` (`lib/resource-registry.tsx`, page facet "Documents"), routed at **`/viewer`** (`app/viewer/page.tsx`, neumorphic sidebar for nav parity), and openable as an in-chat tab. Reachable from **three** nav surfaces: the **Scope shell sidebar** WORKSPACE section (`copilot-workspace-panel.tsx` `WORKSPACE_ITEMS` — the primary one users see, opens inline), the **top-nav pill** (`global-top-nav.tsx`, alongside Dashboard/Builder → `/viewer`), and the assistant's `openPage` |
| Multi-file tabs | `[LIVE]` | Each opened file is a closable tab, kept in memory; blob URLs revoked on close/unmount |
| Local upload + drag-and-drop | `[LIVE]` | File picker + drop-anywhere overlay; `accept` covers pdf/xlsx/xls/csv/docx + text types |
| PDF render | `[LIVE]` | Native browser viewer via `<iframe>` on a blob URL (text-layer + scanned both display) |
| Excel render | `[LIVE]` | `xlsx` `sheet_to_html` grid with a sheet-tab switcher; sticky header row, scrollable |
| Word (.docx) render | `[LIVE]` | `mammoth` (client) `convertToHtml` → styled document prose. Legacy `.doc` not supported (unsupported card + download) |
| Text render | `[LIVE]` | txt/md/csv/json/yaml/xml/html → wrapped `<pre>` |
| Auto-context for Scope | `[LIVE]` | Opening a doc automatically extracts its text (PDF/Word/text → `POST /api/assistant/extract`; Excel → client-side CSV of all sheets) into `attachedDocsAtom` — so the chat next to the viewer can answer about it with **no click**. One attempt per doc (ref-guarded); the action bar shows a status chip and closing a tab pulls the doc back out of context. Extraction failures leave a clickable "Add to Scope" retry (which also surfaces the assistant). Replaces the old manual "Discuss with Scope" button; reuses the chat-attachment extraction pipeline |
| Load Excel as workflow source | `[LIVE]` | Per-doc action on .xlsx/.xls: `parseUploadToRows` → `uploadedRowsAtom['fapi']` (the same rows the FAPI run + builder read) |
| Verified in-browser | `[LIVE]` | Playwright smoke (throwaway) drove `/viewer`: uploaded PDF+Word+Excel → all three renderers mount (iframe / mammoth `.doc-prose` with real text / xlsx grid), no page errors, hand-off→toast. Server extraction (PDF 78pp, docx 10.5k chars) confirmed via the running dev server. _(Predates the auto-context change; the manual Discuss button is now an auto-attach + status chip.)_ |
| Google Drive / Gmail as a source | `[PLANNED]` | The existing `GoogleSourcePicker` is .xlsx-only today; widening it to PDF/Word would let the viewer open cloud files |

### Notes
- New dependency: **`mammoth`** (Word → HTML/text). `unpdf` (already added for chat attachments) powers PDF text extraction; `xlsx` (already present) powers the Excel grid.
- The extract route (`app/api/assistant/extract`) gained a **`.docx`** branch (mammoth `extractRawText`), so the chat's own file-attach now also reads Word docs, not just PDF/text.

## Inspector Panel Features

> **[2026-07-17]** The **Workflow Builder** (inline in Scope) no longer exposes the Inspector or Preview slide-over panels — both toggles were removed from `builder-page-menu.tsx` and their branches from `right-panel-shell.tsx`. Block inspect/edit now runs through the **chat** (`BuilderCopilot` → `focusBlock` / `editBlockConfig`) and the node-click `ConfigurationOverlay`; a new **Workflows** panel (`WorkflowsListContent`) took the slot and lists the built workflows as a canvas switcher. The inspector components below (`block-inspector.tsx`, `NodeConfigPanel`, `RuntimePreviewContent`) are still `[LIVE]` on the legacy `/workflows/[id]` route and the node-click overlay.

| Feature | Status | Notes |
|---|---|---|
| Builder → Workflows switcher panel | `[LIVE]` | Lists built run-configs (fapi · roulement · expense · campaign); click loads snapshot onto canvas, highlights the open one |
| Block inspector (Properties tab) | `[LIVE]` | Config editing per block (overlay / legacy route) |
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
| Worksheets hub + menu | `[LIVE]` [2026-07-19] | A "Worksheets" destination reachable from the **Scope sidebar WORKSPACE section** (→ inline hub page, picks open worksheets inline) **and** the `GlobalTopNav` pill (→ `/worksheets` route). Both render the shared `WorksheetsGallery` (`components/worksheet/worksheets-gallery.tsx`) of cards (FAPI · T1134 · Surplus · Executive Overview). Inline hub `components/workspace/worksheets-hub.tsx` = resource `worksheets`; catalog exported as `WORKSHEETS` from `worksheet-shell.tsx`. The old per-worksheet quick-link section was removed; a scaffolded **Chat history** section (empty state, no persistence yet) took its place |
| Contextual Run (follows open tab) | `[LIVE]` [2026-07-19] | The permanent global RUN list was removed. `PAGE_WORKFLOWS` + `runsForPage()` (`copilot-workspace-panel.tsx`) render a `Run · <page>` group with only the workflow(s) the active inline page can run (fapi/expense/surplus); nothing when no page is open. Page-less workflows (roulement, campaign) stay reachable via the chat launcher / agents |
| Collapsible sidebar sections | `[LIVE]` [2026-07-19] | `SideSection` (chevron header, local `useState`) makes the Scope sidebar's WORKSPACE and CHAT HISTORY groups expand/collapse |
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
| Employee Expense Reimbursement | `[LIVE, 2026-07-17]` | **Non-fiscal demo.** `expense-reimbursement-template.ts` + `lib/workflow-runs/expense.ts` (`EXPENSE_CONFIG`; run by **Sina**). 4 source types (Excel · Manual policy · Currency rate · BoC API), keyword classifier → category totals → per-category policy caps → net payable + CAD. **HAS its own worksheet** (`components/worksheet/expense-worksheet.tsx`, page key `expense`). Standard flow (upload → approve). Verified: net payable 2,325 USD / 3,138.75 CAD @1.35 on the sample; meal cap 250→100 drops net to 2,175 |
| Marketing Campaign Budget Allocation | `[LIVE, 2026-07-17]` | **Non-fiscal demo with a human ELECTION.** `campaign-budget-template.ts` + `lib/workflow-runs/campaign.ts` (`CAMPAIGN_CONFIG`; run by **Sina**). Excel + Manual sources, channel classifier → channel totals → **elect approved budget between committed floor and cap** → proportional allocation + projected revenue. **NO worksheet** (`resultPage` omitted). Elect flow (upload → elect → approve). Verified: floor 150k / ceiling 300k; projected revenue 525k @floor vs 1,050k @cap |

### Sinaxe Portfolio Blueprints (2026-07-22)

**15 builder-native workflow blueprints** covering the *Sinaxe Canadian Corporate Tax Workflow Portfolio* (§2.1–2.11) + the *Platform Services Addendum*, defined declaratively in `shared/workflow-engine/templates/portfolio/portfolio-workflows.ts` (`PORTFOLIO_WORKFLOWS`) and built by one generic `createPortfolioWorkflow(def)` in `local-fiscal-workflow.ts`. Each maps the doc's numbered steps → nodes over the existing `BLOCK_CATALOG`: **Trigger → Sources → AI/Agent (proposal-only extraction/classification) → Logic (normalize/classify/aggregate/calculate/reconcile) → professional-judgment checkpoints (Manual-Entry sources) → Field displays → Output deliverables + write-back**. Loadable/editable/**saveable** from **two surfaces**: the builder page's **Workflows panel** (`right-panel-shell.tsx` — a "Sinaxe portfolio" section grouped Platform services · Foundation · Tier 1, opened via the header **Workflows** button; this is the entry point on `/builder`) **and** the toolbar's **New from template → "Sinaxe portfolio"** submenu (hidden on the embedded `/builder` rail).

**Workflows hub — run + review in one page, no builder (2026-07-22):** a first-class **Workflows** destination that displays each workflow as a consumable page, separate from the builder. `features/workflows-hub/` — `WorkflowsGallery` (15 cards grouped Platform · Foundation · Tier 1), `WorkflowPage` (one page per workflow with a **[Overview | Build | Run | Results]** mode switch), `WorkflowOverview` (spec-driven process view — inputs · steps · professional-judgment checkpoints · manager views · deliverables — **live for all 15** from the `PortfolioWorkflowDef`). **Opens INLINE in the Scope workspace** as its own tab (pageKey `workflow:<id>`, rendered by the panel's `PageBody` + `titleFor`) — from the **Scope sidebar → WORKSPACE → Workflows** (resource `workflows` → `workflows-hub.tsx` → `openWorkspaceWindow`) AND the **GlobalTopNav "Workflows" pill** (`/workflows-hub` route opens the window then routes to `/`). So it keeps the workspace chrome + chat, not a bare route. Direct-link route `/w/[workflowId]` also renders `WorkflowPage`. **Run + Results are IN-PAGE:** the **Run** tab embeds `WorkflowRunFlow` (upload → classify → checkpoints → approve, the real loop) for any workflow with a deterministic engine (pf-fapi → fapi via `def.id.replace(/^pf-/,'')`) and flips to Results on completion — **no detour to the builder to run**; the **Results** tab embeds the worksheet (`getPage(resultPage).Component`, reads the same shared run state). Blueprints without an engine show an honest "engine not built yet" (authors can open the graph in the builder). **The engine — not the page — gates Run/Results; Overview is free.** **Build mode (2026-07-22, step A):** a **Build** tab embeds the full builder canvas for *this* workflow (`InlineBuilder` gained an optional `workflowId` prop → loads the blueprint/config graph transiently, no clobber of the saved local workflow) + a slim Save/Run/Undo/Redo/Fit bar wired to `builderBridgeAtom` (the builder's own header chrome publishes under the builder page-key, which a workflow tab doesn't render). So **build · run · review live on one page**. Caveats: the builder is a single global-canvas tool → edit one workflow at a time (mounted only while Build is active; opening the standalone builder tab AND a workflow Build tab at once can collide — mitigated by demoting the standalone builder); and Build (the blueprint graph) and Run (the runnable config) aren't yet unified — editing the graph doesn't change the run result (that's step B). Concept: **for the fiscalist there's ONE surface — the workflow page (Overview·Build·Run·Results); Worksheets = the *results* (Results tab + cross-portfolio library).**

**Unified into one Workflows surface + nav consolidation (2026-07-22):** `WorkflowPage` is now a **two-pane page** — a **workflow list (left)** grouped Platform · Foundation · Tier 1 + a "New workflow" button (→ blank builder), and the **[Overview · Build · Run · Results] tabs (right)** over the selected workflow (empty-state until one is picked). This replaced the separate hub-gallery + page (`workflows-gallery.tsx` deleted; `workflows-hub.tsx` + `/workflows-hub` + `/w/[id]` all render `WorkflowPage`). **Nav consolidated to 2 destinations:** the standalone **Workflow Builder** and **Worksheets** were **removed from the GlobalTopNav pills AND the Scope sidebar WORKSPACE items** — they're now MODES of the Workflows surface (Build tab / Results tab). **Their code + routes are untouched** (`/builder`, `/worksheets`, the `worksheets` resource, `InlineBuilder`, the worksheet components) — Build reuses `InlineBuilder`, Results embeds the worksheet, "New workflow" reaches `/builder`, and the chat can still `openPage('worksheets')`. Top nav = Dashboard · Workflows · Documents; sidebar WORKSPACE = Workflows · Agent Builder · Dashboard · Documents.

**Representative runs for the calc blueprints (2026-07-23):** the calculation-type portfolio workflows now **run end-to-end** so the full Run→Results flow is visible. `shared/workflow-engine/runtime/workflow-runs/blueprint-runs.ts` — a `makeConfig` factory builds a runnable `TemplateConfig` for **T1134 · surplus · T106 · EIFEL · T2 suite · tax provision · Part XIII** (keyed by the `pf-`-stripped id, spread into `WORKFLOW_CONFIGS`), using the SAME generic engine as the FAPI/expense demos: real classify (income/expense keyword rules) → category rollup → `computeExtra` nets income vs expense into a headline (+ CAD). **Figures are REPRESENTATIVE (a demo income/expense pipeline), not authoritative tax math** — a real per-workflow engine is a separate domain build; the Run banner + worksheet say so. Verified each computes a positive headline (T1134 247k · EIFEL 321k · … distinct per workflow via a scale factor). **`GenericWorksheet`** (`features/workflows-hub/generic-worksheet.tsx`) renders Results for any runnable workflow without a bespoke worksheet — `runTemplateCore` over the shared uploaded rows + run edits (same numbers as the run), headline emphasized, "representative" banner. Wired into `WorkflowDetail` Results (`resultPage` → bespoke worksheet; else runnable → `GenericWorksheet`; else stub). **Foundation (ownership graph, attribute ledgers, portfolio ops) + the 4 Platform Services stay structural** (not calculations — Run shows "engine not built yet"). `tsc` clean.

**Canvas-maximizing layout (2026-07-23):** to free the whole page body for the canvas, the Workflows surface no longer draws its own list/title/tabs in the body: (1) the **workflow list** is published into the **Scope left sidebar** as a **contextual section** below Clients & Chats — a new general **`usePageSidebar(pageKey, Component)`** hook (`shared/stores/page-sidebar-store.ts`, mirrors `usePageMenu`) that the panel renders for the active page; (2) the **workflow name + mode tabs + Build controls (Undo/Redo/Fit/Save/Run)** are published into the **panel header** via `usePageMenu` (added a `label` `PageMenuItem` kind for the name; tabs are `button` items with `active`; Build controls wired to `builderBridgeAtom`). The body is now **just the mode content** — Overview / the builder **canvas full-bleed** / run / worksheet. Selection + active tab live in shared atoms (`selectedWorkflowIdAtom`, `workflowTabAtom`, `features/workflows-hub/workflows-store.ts`) so the sidebar list, header, and body stay in sync. The `/workflows-hub` + `/w/[id]` routes now **redirect into the workspace** (open the `workflows` window + `router.replace('/')`) since the surface depends on the panel's sidebar/header. `tsc` clean. `tsc` clean. Next: generalize the worksheet via `createTemplateIntel` (config-driven Results for all runnable ones), add the scope/instances rail, build engines for the other deterministic workflows.

**Assistant-aware (2026-07-22):** the chat now knows all 15 blueprints — a `useCopilotReadable` in `use-assistant.tsx` publishes them (labeled **blueprints = open in builder; NOT runnable via `runWorkflow`**, distinct from the 4 runnable configs), `searchWorkspace()` surfaces them as `blueprint` hits (`@`-mention → opens in builder via `launchOpenBuilder`), `openWorkflowBuilder(workflowId?)` + `BuilderCopilot.loadWorkflow` accept `pf-*` ids (`createPortfolioWorkflowById`), and `app/builder/page.tsx`'s focus resolver loads `pf-*` on navigation. The intent gate / `runWorkflow` enum are unchanged, so the chat offers to *open* a blueprint, never to *run* it. These are **structural blueprints** (they depict the standardized workflow; not wired to the interactive run engine — only FAPI/Roulement/Expense/Campaign run). Verified: `scripts/verify-portfolio.ts` (spec integrity — unique ids, valid catalogIds, 1 trigger + source + output each, all edges resolve, every block wired) + a build smoke (all 15 → real snapshots → canvas, node/edge counts exact) + `tsc --noEmit` clean.

| Blueprint | Group | Status | Notes |
|---|---|---|---|
| Platform Services · Universal Execution Sequence | `platform` | `[LIVE]` | `pf-platform-sequence` — the 8-phase / 10-step reference spine (Scope → Tax Position → Readiness → Plan → Execute → Review → Deliverables → Persist) |
| Platform Services · Scope Service | `platform` | `[LIVE]` | `pf-scope-service` — clients/years/entities/affiliates → validated Scope object |
| Platform Services · Tax Position Summary Service | `platform` | `[LIVE]` | `pf-tax-position-summary` — manager briefing from prior-year evidence, with citations |
| Platform Services · Data Readiness Service | `platform` | `[LIVE]` | `pf-data-readiness` — TB/FS/FX/TP/responses received-vs-required → readiness score |
| Foreign Affiliate Ownership & Entity Graph | `foundation` | `[LIVE]` | `pf-ownership-graph` — shared entity graph for T1134/FAPI/surplus/CbCR/Pillar Two |
| Tax Attribute & Continuity Ledgers | `foundation` | `[LIVE]` | `pf-attribute-ledgers` — persistent reusable tax data layer |
| Portfolio Tax Calendar, Client Requests & Review | `foundation` | `[LIVE]` | `pf-portfolio-ops` — schedule trigger; portfolio-wide execution & exception management |
| T1134 Foreign Affiliate Reporting | `tier1` | `[LIVE]` | `pf-t1134` |
| FAPI Calculation (portfolio) | `tier1` | `[LIVE]` | `pf-fapi` — manager-level blueprint (distinct from the runnable `fapi` calc template) |
| Foreign Affiliate Surplus | `tier1` | `[LIVE]` | `pf-surplus` |
| T106 Related-Party Transaction Reporting | `tier1` | `[LIVE]` | `pf-t106` |
| EIFEL | `tier1` | `[LIVE]` | `pf-eifel` |
| T2 Corporate Income Tax Compliance Suite | `tier1` | `[LIVE]` | `pf-t2-suite` |
| Corporate Tax Provision | `tier1` | `[LIVE]` | `pf-tax-provision` |
| Part XIII Withholding Tax | `tier1` | `[LIVE]` | `pf-part-xiii` |

---

## Authentication

| Feature | Status | Notes |
|---|---|---|
| Auth provider (better-auth) | `[LIVE]` | Wrapped in root layout |
| Workflow ownership flag | `[LIVE]` | `isWorkflowOwnerAtom` |
| Per-workflow visibility | `[PARTIAL]` | Flag exists; enforcement TBD |
