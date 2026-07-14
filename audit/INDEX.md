# Workflow Builder — Audit Index

*Entry point for the living audit. All other files are linked below.*
*Last updated: 2026-06-07*

---

## Files in This Audit

| File | Covers |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, layer model, execution model, state atoms, serialization, evidence/governance system |
| [BLOCKS.md](./BLOCKS.md) | Every block type — family, subtype, tool ID, config, inputs/outputs, allowed edges |
| [FEATURES.md](./FEATURES.md) | Full feature inventory with `[LIVE]` / `[PARTIAL]` / `[STUB]` / `[PLANNED]` status |
| [UI.md](./UI.md) | Every UI component — shell, canvas, nodes, inspector, viewers, overlays, AI elements |
| [TYPES.md](./TYPES.md) | All TypeScript types and domain model — blocks, edges, execution, evidence, lineage |

---

## App State Summary (2026-05-17)

### What this app is
A **fiscal workflow automation studio** — a visual, node-based editor for building data transformation and classification pipelines with evidence tracking, data lineage, and governance compliance. Domain-specific to fiscal/tax work (FAPI, FX rates, keyword-based income/expense classification).

### Stack at a glance
Next.js 15 (App Router) · React 19 · @xyflow/react v12 · Jotai v2 · Monaco Editor · Drizzle ORM · better-auth · Vercel AI SDK v5

### Architecture summary
Four layers: **Canvas** (React Flow UI) → **Domain** (typed workflow schema) → **Tool Registry** (block toolId lookup) → **Backend Runtime** (per-block `run.ts` functions). Execution runs fully in-browser (no server compute for block runs). State is managed via Jotai atoms. Persistence is localStorage for the local mode; Drizzle/Postgres for database mode (partially wired).

### Block system summary
- **7 block families:** Trigger · Source · Logic · Review/Validation · Field · Output · AI/Agent
- **11 registered tool modules** — only Source and Logic families have live execution
- **Source blocks** carry immutable evidence anchors (`SourceMetadata`)
- **Logic blocks** transform, classify, or aggregate — never overwrite source truth
- **Review/Validation, Field, Output** families are domain-defined but largely unimplemented
- **AI/Agent** blocks propose changes via the prompt panel — approval flow partially wired

### Features summary
- **[LIVE]:** Visual canvas editing, undo/redo, local workflow execution (Keyword Mapper, Calculation Engine, Hierarchy Aggregator, Currency Rate, Keyword Rules), evidence tracking, source trace, inspector panel, AI prompt generation, keyboard shortcuts, autosave, **2 starter templates** (FAPI Calculation, Roulement fiscal art. 85)
- **[PARTIAL]:** Excel upload (UI done, parsing WIP), Rollup/Calculation rule editors, workflow versioning types (no save logic), output mapping preview, publish flow
- **[STUB]:** PDF, API, DB, Web, AI Search source blocks, all Output block subtypes, Review/Validation blocks, AI gateway, integrations
- **[PLANNED]:** Full Review/Validation family, Field block live binding, Output handoff generation, version history UI

### Navigation architecture (2026-06-07)
- **Homepage:** `/` → `OrbitalStage` (neumorphic orbs + AI chat)
- **Builder:** `/builder` → `WorkflowStudioShell` + `NodeConfigPanel` overlaid on `PersistentCanvas`
- **Legacy:** `/workflows` + `/workflows/[id]` → DB-backed workflow pages
- **ReactFlowProvider** moved from layout root → inside `PersistentCanvas` only; soft navigation (router.push) now works from all pages
- **CSS View Transitions** enabled via `@view-transition { navigation: auto }` — 180ms crossfade in Chrome/Safari

### Chat Workspace — Agentic Chat (added 2026-07-09)
The "bring all pages into the chatbot" direction: a **large de-modalized chat panel** (`components/workspace/chat-workspace-panel.tsx`) that unifies the conversation, the pages opened inside it, and scripted agent runs. The `ActionOrb` "AI Chat" radial item opens it. No click-outside-close — the conversation persists; only × minimizes it.
- **Thread is rich:** text bubbles with **entity chips** (EMAIL / FAPI-WORKFLOW / GROSS FAPI / SOPHIA), **`pageEvent`** cards (re-open a page), **`run`** timelines (agent runs), and **`result`** cards (inline generative UI, dismissible).
- **Agent run demo `[DISPLAY]`:** the FAPI flow — connect EMAIL → search → **checkpoint/approve** → run FAPI-WORKFLOW → compute GROSS FAPI. Steps reveal progressively, are expandable, and each can **Open** its page (e.g. FAPI-WORKFLOW → FAPI tab). Human-in-the-loop: the run pauses until the user approves. This is where the real governance gate will live.
- **Store:** `lib/workspace-store.ts` (windows + trail). `lib/chat-store.ts` adds `chatWorkspaceOpenAtom`, and `run` / `result` / `pageEvent` variants on `ChatMessage`. `components/workspace/entity-text.tsx` renders the chips.
- **Unified resource registry (2026-07-10):** `lib/resource-registry.tsx` is now the **single spine** — one `Resource` per named thing (integration/tool/workflow/value/agent/worksheet), each carrying every facet: chip (`token`/`mentions`), `open` behavior, `page` (lazy component/title/icon), `anchors` (deep-link targets), and `field` (inline-editable anchors). It replaces the four former registries — `chat-entities.ts`, `workspace-registry.tsx`, `workspace-targets.ts`, `fapi-model.ts` (all deleted). Resolvers: `splitMentions` (chips), `resolveIntent` (open/close/closeAll), `resolveTarget` (anchor focus), `resolveFieldEdit` (inline edit), plus `getPage`/`getFieldContext`. `fieldValuesAtom` (storage key `inscope.fapi.values`, unchanged) is the shared page↔chat value store.
- **Registered pages:** Dashboard · Executive Overview · FAPI · Surplus · T1134 · Client Workspace.
- **`ActionOrb`** slimmed to a launcher orb + radial nav (old inline chat bar removed).
- **Addressability (deep-link + focus):** the chat can bring a *specific piece* of a screen forward — `data-anchor="<page>:<id>"` on rows (data-derived) + a resource's `anchors[]`/`resolveTarget` (`lib/resource-registry.tsx`) + a rAF scroll-and-flash runner. Wired on **FAPI worksheet** (rows) and **Dashboard** (sections + client rows).
- **wouter SSR fix (2026-07-10):** the tax-ui route pages (`app/fapi`, `/dashboard`, `/t1134`, `/surplus`, `/bu-overview`, `/client/[id]`) now load via `dynamic(..., { ssr:false })` — previously `/fapi` and `/dashboard` 500'd on `location is not defined` from wouter's browser-only hooks. All routes now return 200.
- **Everything past the checkpoint is scripted/mock** (`[DISPLAY]`) — EMAIL and FAPI-WORKFLOW don't really execute yet.
- **LLM agent wired (2026-07-13):** `app/api/chat-workspace/route.ts` runs AI SDK v5 `generateText` with tools built from `buildAgentCatalog()` (the registry *is* the tool surface). The model returns tool-calls (`openPage`/`focusAnchor`/`editField`/`closePage`/`closeAll`/`openWorkflowBuilder`/`runFapiDemo`); the client (`lib/chat-agent.ts` → panel `executeAgent`) runs them. **LLM-first with a deterministic fallback** (`runDeterministic`) so the workspace still works with no key. Reuses the gateway model `openai/gpt-5.1-instant` + `AI_GATEWAY_API_KEY` (same as `/api/ai/generate`).
- **Run → resolve → resume loop wired (2026-07-13):** the scripted EMAIL timeline is **removed**; the FAPI run is now an interactive loop. `runFapiLoop(state)` (`lib/fapi-run.ts`) runs the real engine and returns the next **blocker** — `upload` (needs trial balance), `categorize` (a row matched no keyword rule → user assigns a category, injected as a keyword rule + re-run), or `approval` (final sign-off). The panel renders each as a `BlockerCard`; resolving accumulates into `FapiLoopState` and re-runs until done, then shows the result card + an inline editable FX field. Model key: `OPENAI_API_KEY` in `.env.local` (via `@ai-sdk/openai`).
- **Next steps:** route the approval blocker through `GovernanceMetadata.approvalState` (Step 2); wire real EMAIL/Drive integration to feed the trial balance (Gmail/Drive MCP available); make `upload` a real file picker; preserve page state across tab switches.

### Global App Shell (updated 2026-07-10)
- **CopilotKit migration (2026-07-13):** the whole app is wrapped in `<CopilotKit runtimeUrl="/api/copilotkit">`; the chat is **`components/workspace/copilot-workspace-panel.tsx`** (CopilotKit `<CopilotChat>` themed monochrome/Attio-style + pages-in-tabs). Tools via `useCopilotAction` (openPage · focusAnchor · editField · closePage · closeAll · openWorkflowBuilder · **runWorkflow** · **showWorkflowElement**); `useCopilotReadable` exposes open pages **+ the active run** (see workflow section).
- **Superseded custom-chat cluster removed (2026-07-13):** the pre-CopilotKit implementation is deleted — `chat-workspace-panel.tsx`, `entity-text.tsx`, `lib/chat-agent.ts`, `app/api/chat-workspace/route.ts`, `lib/fapi-run.ts`, and the old `FapiRunFlow`/`fapi-run-flow.tsx` (its `InlineFieldCard` moved to `components/workspace/inline-field-card.tsx`). `lib/chat-store.ts` slimmed to `chatPageContextAtom` + `chatWorkspaceOpenAtom`. The FAPI/Roulement runs are the pluggable `lib/workflow-runs/` engine.
- **Chat launcher + agents (2026-07-13):** the CopilotKit chat has a **launcher** — **search** (worksheets/fields/workflows/agents; field pins inline, page opens a tab, workflow/agent starts it) plus **Workflow**/**Agent** suggestion chips (`lib/agents.ts`). **Sofi** (FAPI specialist) runs the FAPI flow.
- **Builder-side focus / chat→builder deep-link (2026-07-13):** "Open in builder" on a summoned element (or the LLM) sets `builderFocusTargetAtom = { workflowId, blockId }` then navigates to `/builder`. The builder page (`app/builder/page.tsx`) reads it at mount, loads *that* workflow's template (FAPI/Roulement) as a transient view (not persisted over the saved workflow), selects the target block, and sets `focusNodeIdAtom`. `WorkflowCanvas` watches `focusNodeIdAtom` and `fitView({ nodes:[{id}] })` to **scroll to + center + highlight** that exact block. Target cleared ~1.2s after mount (survives StrictMode). Element→block: source → `sourceBlockId`, output → `summaryBlockId`.
- **Workflow ↔ chat connection (2026-07-13):** the LLM is **run-aware** — `WorkflowRunFlow` publishes to `activeRunAtom` (workflow, document, step index/label, phase, what it's awaiting, headline) and the panel exposes it via `useCopilotReadable`, so the assistant can say where we are / which document / next step. You can **summon workflow elements** into the chat without opening the builder: launcher search ("<workflow> source/output") + the `showWorkflowElement(workflowId, element)` action render `<WorkflowElementCard>` (source = the document rows via `config.sampleRows`; output = `runToCompletion(config)` summary). Each element card has **Open worksheet** + **Open in builder**; the `openWorkflowBuilder` action still opens the full canvas.
- **FAPI mapping ported from Platform (2026-07-13):** Sofi's FAPI classification now uses Platform's authoritative vocabulary. `lib/workflow-runs/fapi-concept-cards.json` is a copy of Platform's `backend/config/fapi-concept-cards.json`; `fapi-mapping.ts` transforms each concept card → a keyword-mapper rule (positive+French indicators → `keywords`, negative+French → `excludeKeywords`, `lineId`/`fieldName` → targets). `TemplateConfig.mapperRules` (set on FAPI) replaces the template's 18 static demo rules at run time; user overrides still take priority. 10 categories, ~11 pos / ~11 neg indicators each. Verified the negative indicators disqualify (e.g. "interest expense" no longer maps to interest income). *(This ports the mapping stage; the calc engine parity swap to `lib/fapi/calculation-engine.ts` — RTF snapping, 95(2) P-coefficients, per-line CAD — is still a separate follow-up.)*
- **Pluggable workflow-run framework (2026-07-13):** `lib/workflow-runs/` — a generic config-driven engine. `runTemplateLoop(config, state)` runs any "classify → roll up → compute" template through the real `runLocalWorkflowTools`, extracts figures + traceability detail, and drives the `upload → categorize → [elect] → approve` loop. **Adding a workflow = one `TemplateConfig`** (`engine.ts` + registry `index.ts`). Live configs: **FAPI** (`fapi.ts`, agent **Sofi**, headline GROSS) and **Roulement fiscal art. 85** (`roulement.ts`, agent **Théo**, headline *Gain différé*). The generic `<WorkflowRunFlow>` (`components/workspace/workflow-run-flow.tsx`) renders any config; the chat `runWorkflow(workflowId)` action + the launcher both use it. Roulement adds an **elect** intervention (choose the art. 85 amount between the PBR floor and JVM ceiling) and a `computeExtra` hook (the template's params source is under-wired, so the deterministic election math is computed in-config from the engine's real PBR total). Verified: FAPI GROSS 29,500 USD · Roulement Gain différé 255,000 USD.
- **Reviewable decision ledger (2026-07-13):** the run is a review surface — **every step is clickable** (clear "Review AI mappings / calculations / result" affordance + hover). The **classify step is interactive** (`ClassifyReview`): it lists every row with the mapper's **AI-suggested category + confidence**, and clicking a category **overrides the AI** (writes `state.overrides` and re-runs the real engine — verified: re-mapping a row moves its amount between buckets and changes the figures). Unmatched rows are flagged amber. Compute step shows the **deterministic** buckets + each line's formula; result step shows every figure traced. Each step (and the FX input) has **"See … in the builder"** — opens `/builder` focused on the exact block that produced it (source → `sourceBlockId`, classify → `mapperBlockId`, aggregation → `rollupBlockId`, calculation → `linesBlockId`, result → `summaryBlockId`, FX input → its currency-rate block) via `builderFocusTargetAtom`/`focusNodeIdAtom`. Also **Open worksheet in a tab**. **Editable inputs** (`EditableInputs` + `config.editableInputs`): an inputs panel in the run lets you change assumptions and the engine recomputes in place (keeping your run position). Two injection paths: **block** (FAPI FX rate → `fapi-source-fx-rate.overrideRate`, inclusion → `fapi-source-inputs.inclusionRate`) and **params** (Roulement JVM / contrepartie / taux → `computeExtra`). Verified: FX 1.35→1.50 lifts NET_FAPI_CAD 33,493.50→34,965; Roulement JVM 500k→700k lifts Gain différé 270k→470k. When a workflow runs it fills the panel (full width, primary height) with a compact chat bar below.
- **FAPI Worksheet rebuilt over the real engine (2026-07-13, Phase 2 of the worksheet redo):** `components/worksheet/fapi-worksheet.tsx` — a new main-app worksheet (Platform's line structure in our monochrome + toned-dot language) that computes from `runTemplateCore(FAPI_CONFIG, { rows, inputs })` over the **shared uploaded rows**, so `/fapi`, the chat's worksheet tab (`resource-registry.tsx` now imports it), the chat run, and the builder canvas all show identical numbers. Sections FX · A · EXP · B · 95(2) · A.1/A.2/C · D–H · FAT + a dual-currency (source/CAD) results summary. Manual lines inline-editable; A/EXP/B expand to their AI-mapped source rows; per-line "trace" opens the builder on that block; Import parses via the shared parser. Dots are **small, pastel, no-glow** (same softened language applied to the run timeline). Verified live: A 22,000 · Gross 25,000 · Net FAPI 24,810 · CAD 33,493.50 at FX 1.35. Replaces the static `tax-ui` worksheet. **Phase 3 (2026-07-13):** a **docked Sources file-viewer** (`SourcesPanel`, toggled from the Sources toolbar) shows the raw trial-balance rows and, on click, each row's provenance (classified category · matched keyword · confidence, or "unmatched") + a trace to the mapper block.
- **Full FAPI line set in the builder engine (2026-07-13, Phase 1 of the worksheet redo):** the FAPI workflow now computes the whole Platform line skeleton from **one engine** (`runLocalWorkflowTools`), so the coming worksheet displays real values, not placeholders. Changes: line **A** = `P × (income_bucket − expense_bucket) + 95(2)` (calc engine `formulaExpression`); new display lines **EXPENSES** (`P × expense_bucket`) and **COMPUTATION_95_4** (the 95(2) amount, also flowed into A); **A1/A2/C–H** already had rules and now get fed. The **FAPI Inputs block** (`fapi-source-inputs`) was extended to emit the line-driving assumptions — `pCoefficient (1), canadianRules95_4, debtForgiveness, priorYearG, cfaIncome, businessLosses, faclCarryforward, prescribedAmount, prescribedAmountF1, dividendDeductions, partnershipDividends` — with **RTF snapped to {1.9, 4}**, and all are exposed as **editable inputs** in the run. **95(2) is not a derived formula** — per Platform it's a manual amount added into A; the "P-coefficient" is a scalar income multiplier — so **no new engine operation** was needed and `lib/fapi/calculation-engine.ts` stays unwired (no second calc path). Verified: defaults unchanged (GROSS 25,000 · NET_FAPI 24,810 · CAD 33,493.50); with 95(2)=5,000 + C=10,000 + D=2,000 + F=1,000 → GROSS 40,000 · NET_FAPI 36,810; P=0.5 → A 11,000. *(Phase 2 — the worksheet UI over this line set — is next.)*
- **One source of truth for uploaded data — chat run now uses the real file (2026-07-13):** previously the chat run **ignored the uploaded workbook** and always computed from the 8 built-in `config.sampleRows` (the upload UI even said "parsing not wired"), so the chat and the builder produced different numbers for the "same" file. Fixed: the chat upload now parses the workbook through the **same** parser the builder uses (`lib/workflow-runs/parse-upload.ts` → `parseExcelWorkbookFile` + `buildExcelSourceConfigPatch`), producing `SourceRow[]`. Those rows are stored in a shared, persisted `uploadedRowsAtom` (keyed by workflow id) and the engine (`RunState.rows`, `runTemplateLoop`) computes on them instead of the sample. The builder **hydrates its source block from the same store** when opened via a chat deep-link, so switching chat ↔ builder shows the exact same rows. Verified: sample rows → GROSS 25,000; a different uploaded trial balance → GROSS 21,000 (= A+B on the new rows). "Use sample workbook" clears the store and falls back to `sampleRows`. *(Boundary: a manual upload made **inside** the builder canvas isn't yet mirrored back into the shared store — the store is currently chat-authored.)*
- **Live Bank of Canada FX + API source block (2026-07-13):** the FAPI FX rate is no longer a bare hardcode. A new **API source block** `fapi-api-boc-fx` ("Bank of Canada Valet API", `source:api-http-request`, distinct `Cloud` icon) sits in the FAPI template feeding the Currency Rate block (`fapi-source-fx-rate`), so the **audit lineage shows the real origin** of the rate. The FX input in the run has a **"↻ fetch live rate"** action → `GET /api/fx-rate?from=USD&to=CAD&year=2025` → `fetchAnnualAverageExchangeRate` (real BoC Valet annual-average call, server-side to avoid CORS); the fetched value replaces the input and re-flows the engine, and falls back to the workbook override on any failure. The **currency-rate runner** (`backend/blocks/source/currency-rate/run.ts`) now **prefers `liveRate` over `overrideRate`** (`rate_source: "bank_of_canada_valet"` vs `"override"`; `rate_metadata.live` records which).
- **Inspectable run + chat-always-available (2026-07-13):** `FapiRunFlow` (`fapi-run-flow.tsx`) steps are **expandable** — click a stage to drill into the **source rows**, the **classification** (row → category, matched keyword + confidence), and the **derivations** (buckets + each FAPI line with its formula). The approval step lists **every summary figure with its formula** (`FapiDetail` from the enriched engine) so numbers are traceable before sign-off. **"Open in FAPI worksheet ↗"** opens a page tab (browser-like; the chat conversation persists). The run is **pinned above CopilotChat** (not a full takeover) so chat stays usable, with a **Stop** control to cancel mid-run. *(Sofi's math still uses the builder-block engine; parity swap to `lib/fapi/calculation-engine.ts` pending.)*
- **`AppShell`** (`components/app-shell.tsx`) wraps every route via `layout.tsx`; renders `GlobalTopNav` · `PersistentCanvas` · `CopilotWorkspacePanel` · `ActionOrb` · `GlobalClientSwitcher`
- **`GlobalTopNav`** (`components/global-top-nav.tsx`) — 52px `#eaeaef` top bar persists across all pages; logo click navigates home; on non-canvas pages shows client selector + nav actions; on canvas pages shows workflow toolbar slot (portaled)
- **Single chat surface:** `ChatWorkspacePanel` (`components/workspace/chat-workspace-panel.tsx`), opened via the `ActionOrb` "AI Chat" item (`chatWorkspaceOpenAtom`). **The old `ChatDrawer` + `ChatCenterOverlay` takeover path and its `chatTakeoverAtom` / `chatOpenAtom` atoms were removed (2026-07-10)** — they were unrendered dead code from the pre-workspace design. The `chatTakeoverAtom`-driven dissolve branches in `PersistentCanvas` and `OrbitalStage` were collapsed.
- **`CanvasEnterOverlay`** (inline in `app-shell.tsx`) — `fixed inset-0 z-[15]` overlay; renders `#eaeaef` → transparent (900ms) on every canvas page entry, covering the z-10 content layer so the transition is always visible to the user
- **`PersistentCanvas`** — fixed canvas layer at z-0; bg transitions `#eaeaef` → `#18181c` (900ms); active only on `/builder` and `/workflows/*`
- **Workflow canvas background:** dark `#18181c` with subtle white line grid (`BackgroundVariant.Lines`); fades from `#eaeaef` on mount; `AmbientOrbs` removed
- **Node design:** all 7 family shapes use dark `#25252f` cards on `#18181c` canvas — unified `rgba(255,255,255,0.09)` border, elevation shadow only (no white glow); only icon color unique per family (-400 shade Tailwind)
- **`GlobalClientSwitcher`** (`components/global-client-switcher.tsx`) — global overlay replacing OrbitalStage-local ClientSwitcher
- **`WorkflowToolbar` / `LocalStudioTopBar`** — content portaled into `GlobalTopNav` slot via `createPortal`
- **New stores:** `lib/nav-store.ts` (client + nav actions) · `lib/chat-store.ts` (chat state: `chatWorkspaceOpenAtom`, messages, page context)

### Active development areas (branch: Sampledata)
Based on modified files in current branch:
- `backend/blocks/logic/category-rollup-aggregator/run.ts` — rollup aggregator execution
- `backend/blocks/logic/keyword-mapper/run.ts` — keyword mapper execution updates
- `components/ai-elements/edge.tsx` — edge animation changes
- `components/overlays/configuration-overlay.tsx` — configuration overlay updates
- `components/workflow/config/action-grid.tsx` — action grid UI
- `components/workflow/config/fiscal-block-config.tsx` — fiscal block configuration
- `components/workflow/inspector/block-inspector.tsx` — inspector panel changes
- `components/workflow/inspector/local-ai-panel.tsx` — AI panel in inspector
- `components/workflow/nodes/family-node-shape.tsx` — node visual styling
- `components/workflow/source-viewers/keyword-rulebook-editor.tsx` — keyword rules editor
- `components/workflow/workflow-studio-shell.tsx` — shell restructuring
- `components/workflow/workflow-toolbar.tsx` — toolbar updates
- `components/workflow/workspace/block-data-flow-pane.tsx` — data flow pane
- `lib/local-fiscal-workflow.ts` — workflow serialization
- `lib/local-tool-registry.ts` — tool registry updates
- `lib/local-tool-runner.ts` — runner updates
- `lib/workflow-store.ts` — state atom changes
- `src/domain/workflow/block-catalog.ts` — catalog updates
- `src/domain/workflow/block-types.ts` — type additions
- `src/domain/workflow/workflow-rules.ts` — rule changes

**New untracked files:**
- `components/workflow/logic-viewers/aggregator-workspace.tsx`
- `components/workflow/logic-viewers/calculation-engine-editor.tsx`
- `components/workflow/logic-viewers/calculation-engine-workspace.tsx`
- `components/workflow/logic-viewers/field-block-workspace.tsx`
- `components/workflow/logic-viewers/keyword-mapper-workspace.tsx`
- `components/workflow/source-viewers/rollup-rulebook-editor.tsx`
- `components/workflow/two-panel-tool-shell.tsx`
- `components/workflow/worksheet-page-menu.tsx`
- `components/workflow/worksheet-page-view.tsx`
- `lib/workflow/sample-workflows/fapi-template.ts`

---

## Key File Locations

| What | Where |
|---|---|
| Block families + subtypes | `src/domain/workflow/block-types.ts` |
| Block catalog (10+ templates) | `src/domain/workflow/block-catalog.ts` (domain) + `lib/local-fiscal-workflow.ts` (runtime) |
| Family relationship rules | `src/domain/workflow/workflow-rules.ts` |
| All domain types | `src/domain/workflow/workflow-types.ts` |
| Evidence + governance rules | `src/domain/workflow/source-rules.ts`, `protected-rules.ts` |
| Global state atoms | `lib/workflow-store.ts` |
| Workflow serialization | `lib/local-fiscal-workflow.ts` |
| Tool registry (11 tools) | `lib/local-tool-registry.ts` |
| Workflow execution runner | `lib/local-tool-runner.ts` |
| Backend block `run.ts` files | `backend/blocks/{family}/{subtype}/run.ts` |
| Backend runtime framework | `backend/runtime/` |
| Main shell component | `components/workflow/workflow-studio-shell.tsx` |
| Inspector panel | `components/workflow/inspector/block-inspector.tsx` |
| AI prompt panel | `components/ai-elements/prompt.tsx` |
| Sample workflows | `lib/workflow/sample-workflows/` |
