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

### Global App Shell (updated 2026-06-07)
- **`AppShell`** (`components/app-shell.tsx`) wraps every route via `layout.tsx`; now includes `ChatCenterOverlay`
- **`GlobalTopNav`** (`components/global-top-nav.tsx`) — 52px `#eaeaef` top bar persists across all pages; logo click navigates home; on non-canvas pages shows client selector + nav actions; on canvas pages shows workflow toolbar slot (portaled)
- **`ChatDrawer`** (`components/chat-drawer.tsx`) — always-visible floating pill at bottom center (real input, no side drawer); sending a message sets `chatTakeoverAtom = true`
- **`ChatCenterOverlay`** (`components/chat-center-overlay.tsx`) — center-screen takeover panel; fades in when `chatTakeoverAtom = true`, X to dismiss
- **`OrbitalStage`** dissolves on `chatTakeoverAtom` (blur + saturate + scale + opacity, 480ms); restores on dismiss
- **`PersistentCanvas`** fades on `chatTakeoverAtom` (opacity 0.35, 480ms); restores on dismiss; bg transitions `#eaeaef` → `#18181c` (900ms) at z-0
- **`CanvasEnterOverlay`** (inline in `app-shell.tsx`) — `fixed inset-0 z-[15]` overlay; renders `#eaeaef` → transparent (900ms) on every canvas page entry, covering the z-10 content layer so the transition is always visible to the user
- **Workflow canvas background:** dark `#18181c` with subtle white line grid (`BackgroundVariant.Lines`); fades from `#eaeaef` on mount; `AmbientOrbs` removed
- **Node design:** all 7 family shapes use dark `#25252f` cards on `#18181c` canvas — unified `rgba(255,255,255,0.09)` border, elevation shadow only (no white glow); only icon color unique per family (-400 shade Tailwind)
- **`GlobalClientSwitcher`** (`components/global-client-switcher.tsx`) — global overlay replacing OrbitalStage-local ClientSwitcher
- **`WorkflowToolbar` / `LocalStudioTopBar`** — content portaled into `GlobalTopNav` slot via `createPortal`
- **New stores:** `lib/nav-store.ts` (client + nav actions) · `lib/chat-store.ts` (chat state, `chatTakeoverAtom`, page context)

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
