# Workflow Studio Folder Map And Ownership

Date: 2026-05-04

This document maps the current repository and proposes target folder ownership so developers know where to change each part of Workflow Studio.

Target product model:

`Source -> Logic -> Review / Validation -> Protected -> Output`

No code has been refactored as part of this document. The target folders below are proposed ownership boundaries for gradual cleanup.

## Current Top-Level Map

| Path | Current role |
| --- | --- |
| `app/` | Next.js routes, layouts, API routes, workflow pages, auth pages, and AI/workflow endpoints. |
| `backend/` | Backend-style runtime and block modules used by the local runner/prototype. |
| `components/` | React UI components, including canvas, toolbar, inspector, overlays, source viewers, logic viewers, nodes, and shared UI. |
| `lib/` | Workflow store, local workflow model, local runner/registry, API client, DB helpers, integrations, AI helpers, and utilities. |
| `plugins/` | Template plugin definitions and plugin step implementations. |
| `scripts/` | Plugin discovery and project scripts. |
| `docs/` | Project audit and product/context documentation. |
| `drizzle/` | Generated database migrations and migration metadata. |
| `e2e/` | Playwright end-to-end tests. |
| `hooks/` | Shared React hooks. |
| `public/` | Static assets. |

Approximate current counts:

| Path | Directories | Files |
| --- | ---: | ---: |
| `app/` | 44 | 41 |
| `components/` | 18 | 129 |
| `lib/` | 14 | 67 |
| `backend/` | 9 | 31 |
| `plugins/` | 31 | 103 |
| `scripts/` | 0 | 3 |
| `docs/` | 0 | 4 |
| `drizzle/` | 1 | 11 |
| `e2e/` | 0 | 1 |
| `hooks/` | 0 | 2 |
| `public/` | 0 | 5 |

## Current Workflow Studio Locations

| Concern | Current primary files |
| --- | --- |
| App shell and routes | `app/layout.tsx`, `app/page.tsx`, `app/workflows/[workflowId]/page.tsx`, `components/workflow/persistent-canvas.tsx`, `components/workflow/workflow-studio-shell.tsx` |
| Canvas | `components/workflow/workflow-canvas.tsx`, `components/workflow/nodes/*`, `components/ai-elements/canvas.tsx`, `components/ai-elements/edge.tsx`, `components/ai-elements/node.tsx` |
| Palette | `components/workflow/workflow-toolbar.tsx`, `components/workflow/config/action-grid.tsx`, `components/workflow/config/action-config-renderer.tsx`, block catalog entries in `lib/local-fiscal-workflow.ts` |
| Inspector | `components/overlays/configuration-overlay.tsx`, `components/workflow/node-config-panel.tsx`, `components/workflow/inspector/block-inspector.tsx`, `components/workflow/edge-inspector.tsx` |
| Structure sheet | Bottom runtime preview inside `components/workflow/workflow-studio-shell.tsx` |
| Sources panel | `components/workflow/inspector/source-setup-panel.tsx`, `components/workflow/source-viewers/*` |
| Outputs panel | `components/workflow/workspace/block-data-flow-pane.tsx`, `components/workflow/data-viewer/*`, `components/workflow/source-viewers/source-outputs-panel.tsx` if restored |
| Runs/logs panel | `components/workflow/workflow-runs.tsx`, `components/workflow/workflow-run-results.tsx`, `lib/workflow/run-history.ts`, `lib/workflow-logging.ts` |
| AI panel | `components/workflow/inspector/local-ai-panel.tsx`, `lib/local-ai-workflow-assistant.ts`, `components/ai-elements/prompt.tsx`, `app/api/ai/generate/route.ts` |
| Workflow domain model | `lib/local-fiscal-workflow.ts`, `lib/workflow-store.ts`, `components/workflow/nodes/family-node-shape.tsx` |
| Runtime/evaluation | `backend/runtime/*`, `backend/blocks/**`, `lib/local-tool-registry.ts`, `lib/local-tool-runner.ts` |
| Persistence | `lib/local-fiscal-workflow.ts`, `lib/workflow-store.ts`, `lib/api-client.ts`, `app/api/workflows/*`, `lib/db/*` |
| Audit/history | `lib/workflow/run-history.ts`, `lib/workflow-logging.ts`, source/version helpers in `lib/local-fiscal-workflow.ts`, runtime lineage in `backend/runtime/lineage.ts` |
| Reusable UI | `components/ui/*`, `components/workflow/data-viewer/*`, `hooks/*` |

## Target Folder Structure

The target structure should move Workflow Studio toward feature-owned folders without breaking the Vercel template connector-pull, default block, configuration menu, and Properties/Code/Runs pattern.

```text
app/
components/
  workflow/
    shell/
    canvas/
    palette/
    inspector/
    structure-sheet/
    sources-panel/
    outputs-panel/
    runs-panel/
    ai-panel/
    data-viewer/
  ui/
lib/
  workflow/
    domain/
    runtime/
    persistence/
    audit/
    fixtures/
backend/
  runtime/
  blocks/
```

The current code does not need to move all at once. New code should prefer these ownership boundaries, and large files should be split into these areas only when a focused change makes it safe.

## Ownership Rules

Each section defines what belongs there, what does not, examples, product responsibility, allowed imports, and forbidden imports.

### App Shell And Routes

Target folder: `app/` plus `components/workflow/shell/`

- Belongs there: Next.js layouts, route entry points, route-level loading/hydration, providers, page composition, and shell-level placement of canvas, toolbar, inspector, and structure sheet.
- Must not belong there: block execution logic, rule evaluation, source parsing, large inspector forms, tool definitions, persistence implementation details, or product-specific calculations.
- Current examples: `app/layout.tsx`, `app/page.tsx`, `app/workflows/[workflowId]/page.tsx`, `components/workflow/persistent-canvas.tsx`, `components/workflow/workflow-studio-shell.tsx`.
- Product responsibility: compose the app experience and preserve the main studio pattern.
- May import from: `components/workflow/*`, `components/ui/*`, `lib/workflow/domain/*`, `lib/workflow/persistence/*`, `lib/workflow-store.ts`, `lib/api-client.ts`.
- Forbidden imports: `backend/blocks/**/run.ts`, source parser internals, tool execution internals, low-level DB schema except inside API routes.

### Canvas

Target folder: `components/workflow/canvas/`

- Belongs there: React Flow canvas, nodes, edges, handles, connection behavior, context menu, viewport controls, selection behavior, and canvas-only visual helpers.
- Must not belong there: inspector tab logic, source upload parsing, rulebook editing, runtime execution, persistence writes, AI proposal generation, or output packaging.
- Current examples: `components/workflow/workflow-canvas.tsx`, `components/workflow/nodes/action-node.tsx`, `components/workflow/nodes/trigger-node.tsx`, `components/workflow/nodes/add-node.tsx`, `components/workflow/nodes/family-node-shape.tsx`, `components/ai-elements/edge.tsx`.
- Product responsibility: let users view, arrange, connect, and select workflow blocks.
- May import from: `components/ui/*`, `lib/workflow/domain/*`, `lib/workflow-store.ts`, `lib/atoms/overlay.ts`, canvas-specific utilities.
- Forbidden imports: `backend/blocks/**`, `lib/workflow/runtime/*`, `lib/workflow/persistence/*`, `app/api/*`, source upload/parsing modules, inspector-only components.

### Palette

Target folder: `components/workflow/palette/`

- Belongs there: block catalog display, add-block menus, search/filtering, toolbar add actions, visible grouping of Source, Logic, Review / Validation, Protected, and Output blocks.
- Must not belong there: canonical block catalog definitions, runtime behavior, source/rulebook editor forms, direct localStorage writes, or demo workflow construction.
- Current examples: `components/workflow/workflow-toolbar.tsx`, `components/workflow/config/action-grid.tsx`, `components/workflow/config/action-config-renderer.tsx`.
- Product responsibility: help users add blocks without owning what those blocks mean.
- May import from: `components/ui/*`, `lib/workflow/domain/*`, `lib/workflow-store.ts`, route/shell actions passed as props.
- Forbidden imports: `backend/blocks/**/run.ts`, persistence implementations, source parsers, AI proposal engines, DB modules.

### Inspector

Target folder: `components/workflow/inspector/`

- Belongs there: Properties, Code, and Runs tabs; block and edge detail shells; inspector draft editing state; configuration forms; code preview display; block-specific settings panels.
- Must not belong there: canvas layout, block catalog source of truth, runtime execution algorithms, localStorage persistence primitives, AI proposal generation, or source parsing internals.
- Current examples: `components/overlays/configuration-overlay.tsx`, `components/workflow/node-config-panel.tsx`, `components/workflow/inspector/block-inspector.tsx`, `components/workflow/inspector/source-setup-panel.tsx`, `components/workflow/edge-inspector.tsx`, `components/workflow/inspector/code-preview/*`.
- Product responsibility: expose editable and inspectable block behavior while keeping formula/code editing inside inspector tabs.
- May import from: `components/ui/*`, `components/workflow/data-viewer/*`, `components/workflow/sources-panel/*`, `components/workflow/outputs-panel/*`, `components/workflow/runs-panel/*`, `components/workflow/ai-panel/*`, `lib/workflow/domain/*`, `lib/workflow-store.ts`.
- Forbidden imports: runtime `run.ts` implementations, DB modules, API route files, direct parser libraries unless wrapped by a sources-panel component.

### Structure Sheet

Target folder: `components/workflow/structure-sheet/`

- Belongs there: generated worksheet/runtime preview, read-only structure views, final result summaries, trace summaries, and preview navigation.
- Must not belong there: source editing, formula editing, direct workflow mutation, runtime execution, or block catalog management.
- Current examples: bottom runtime preview inside `components/workflow/workflow-studio-shell.tsx`.
- Product responsibility: show the generated worksheet/runtime preview, not become a separate Calculation Sheet.
- May import from: `components/ui/*`, `components/workflow/data-viewer/*`, `lib/workflow/domain/*`, `lib/workflow/audit/*`.
- Forbidden imports: inspector edit forms, source upload panels, runtime runners, persistence writers, palette actions.

### Sources Panel

Target folder: `components/workflow/sources-panel/`

- Belongs there: source artifact viewers, source setup panels, Excel upload UI, workbook viewers, manual evidence viewers, source metadata display, source output selection, and rulebook-facing editors until a separate governance folder exists.
- Must not belong there: keyword mapping execution, hierarchy aggregation execution, final result calculation, protected result locking, output packaging, or canvas layout.
- Current examples: `components/workflow/inspector/source-setup-panel.tsx`, `components/workflow/source-viewers/excel-upload-panel.tsx`, `components/workflow/source-viewers/excel-workbook-viewer.tsx`, `components/workflow/source-viewers/excel-utils.ts`, `components/workflow/source-viewers/keyword-rulebook-editor.tsx`, `components/workflow/source-viewers/aggregation-rules-overview.tsx`, `components/workflow/source-viewers/rule-source-editor.tsx`.
- Product responsibility: help users view immutable evidence artifacts and edit draft rulebook inputs that feed Logic.
- May import from: `components/ui/*`, `components/workflow/data-viewer/*`, `lib/workflow/domain/*`, source parsing helpers owned by this folder.
- Forbidden imports: `backend/blocks/logic/**/run.ts`, workflow runtime runners, protected result logic, output assembly logic, DB modules, API route files.

### Outputs Panel

Target folder: `components/workflow/outputs-panel/`

- Belongs there: block output role cards, output data previews, source output lists, computed output lists, Schema/Table/JSON/Trace display wiring, and "used by" display.
- Must not belong there: source upload controls, rulebook editing, runtime calculations, relationship validation source of truth, or persistence.
- Current examples: `components/workflow/workspace/block-data-flow-pane.tsx`, `components/workflow/data-viewer/*`.
- Product responsibility: make explicit block outputs visible and traceable.
- May import from: `components/ui/*`, `components/workflow/data-viewer/*`, `lib/workflow/domain/*`, `lib/workflow/audit/*`.
- Forbidden imports: source parser libraries, backend run implementations, localStorage writers, DB modules, AI proposal engines.

### Runs/Logs Panel

Target folder: `components/workflow/runs-panel/`

- Belongs there: run history UI, execution log UI, run detail panels, warning/error display, runtime result comparison, and run trace presentation.
- Must not belong there: runtime evaluation algorithms, workflow persistence implementation, source/rulebook editing, or canvas connection behavior.
- Current examples: `components/workflow/workflow-runs.tsx`, `components/workflow/workflow-run-results.tsx`, `components/workflow/inspector/mock-runs.ts`.
- Product responsibility: explain what happened in a run and what needs review.
- May import from: `components/ui/*`, `components/workflow/data-viewer/*`, `lib/workflow/domain/*`, `lib/workflow/audit/*`, `lib/workflow/run-history.ts`.
- Forbidden imports: backend block `run.ts` files, source upload components, inspector mutation controls, DB schema.

### AI Panel

Target folder: `components/workflow/ai-panel/`

- Belongs there: local Ask/Act UI, proposal lists, proposal diff views, explicit apply/reject actions, and AI trace display.
- Must not belong there: silent workflow mutation, runtime execution, source parsing, block catalog definitions, or persistence primitives.
- Current examples: `components/workflow/inspector/local-ai-panel.tsx`, `components/ai-elements/prompt.tsx`, `lib/local-ai-workflow-assistant.ts`, `app/api/ai/generate/route.ts`.
- Product responsibility: AI proposes changes; the user approves before workflow mutation.
- May import from: `components/ui/*`, `lib/workflow/domain/*`, `lib/workflow/audit/*`, AI service helpers, store actions passed through explicit apply functions.
- Forbidden imports: direct DB writes, source parser internals, backend block runners, protected result locking internals, silent autosave mutations without user approval.

### Workflow Domain Model

Target folder: `lib/workflow/domain/`

- Belongs there: pure TypeScript workflow types, block families, subtypes, relationships, edge binding metadata, source/version types, rulebook types, validation result types, catalog definitions, and conversion helpers that are UI-agnostic.
- Must not belong there: React components, Jotai atoms, localStorage, API client calls, DB queries, runtime execution, browser File objects, or CSS/className decisions.
- Current examples: much of `lib/local-fiscal-workflow.ts`, parts of `lib/workflow-store.ts`, `components/workflow/nodes/family-node-shape.tsx` mappings that should eventually become display metadata.
- Product responsibility: define what a workflow is.
- May import from: generic utilities in `lib/utils/*` and type-only helpers.
- Forbidden imports: `components/*`, `app/*`, `backend/blocks/**/run.ts`, `lib/db/*`, `lib/api-client.ts`, Jotai, React, localStorage.

### Workflow Runtime/Evaluation

Target folder: `lib/workflow/runtime/` with backend-style modules in `backend/runtime/` and `backend/blocks/`

- Belongs there: local runner orchestration, block execution adapters, evaluation order, input resolution, output creation, validation of runtime contracts, formula trace generation, and backend-style block definitions/runners.
- Must not belong there: React UI, inspector forms, canvas positioning, toolbar actions, API route handlers, DB persistence, or localStorage.
- Current examples: `backend/runtime/*`, `backend/blocks/logic/keyword-mapper/*`, `backend/blocks/logic/hierarchy-aggregator/*`, `backend/blocks/source/*`, `lib/local-tool-runner.ts`, runtime portions of `lib/local-tool-registry.ts`.
- Product responsibility: evaluate workflows from explicit inputs to explicit outputs.
- May import from: `lib/workflow/domain/*`, `lib/workflow/audit/*`, pure utilities.
- Forbidden imports: `components/*`, `app/*`, `lib/db/*`, `lib/api-client.ts`, Jotai, React, browser-only APIs.

### Persistence

Target folder: `lib/workflow/persistence/` plus API routes under `app/api/workflows/`

- Belongs there: localStorage snapshot adapters, import/export serialization, publish snapshot storage, API persistence clients, DB repository helpers, migration-safe persistence mapping, and autosave adapters.
- Must not belong there: UI rendering, source parsing, runtime algorithms, AI proposal generation, canvas visuals, or block catalog definitions.
- Current examples: persistence portions of `lib/local-fiscal-workflow.ts`, `lib/workflow-store.ts` autosave behavior, `lib/api-client.ts`, `app/api/workflows/*`, `lib/db/*`.
- Product responsibility: save, load, import, export, and publish workflow state without changing workflow meaning.
- May import from: `lib/workflow/domain/*`, `lib/workflow/audit/*`, `lib/db/*`, `lib/api-client.ts` where appropriate.
- Forbidden imports: `components/*`, `backend/blocks/**/run.ts`, source viewer components, React, Jotai in persistence primitives.

### Audit/History

Target folder: `lib/workflow/audit/`

- Belongs there: run history types, audit events, lineage records, source/rulebook version history, trace helpers, publish history, and immutable evidence references.
- Must not belong there: UI components, source upload controls, runtime calculators, block catalog definitions, or DB route handlers.
- Current examples: `lib/workflow/run-history.ts`, `lib/workflow-logging.ts`, `backend/runtime/lineage.ts`, run record helpers in `lib/local-fiscal-workflow.ts`.
- Product responsibility: preserve explainability, traceability, and historical accountability.
- May import from: `lib/workflow/domain/*` and pure utilities.
- Forbidden imports: `components/*`, `app/*`, Jotai, React, parser libraries, runtime block runners.

### Reusable UI Components

Target folder: `components/ui/` and generic shared viewers under `components/workflow/data-viewer/`

- Belongs there: shadcn/ui primitives, generic buttons, tabs, dialogs, dropdowns, inputs, cards, resizable primitives, data table/view components, JSON/schema/trace viewers with no Workflow Studio product decisions.
- Must not belong there: workflow family rules, source immutability messages, rulebook semantics, execution behavior, persistence, or AI workflow proposals.
- Current examples: `components/ui/*`, `components/workflow/data-viewer/data-viewer.tsx`, `components/workflow/data-viewer/table-view.tsx`, `components/workflow/data-viewer/json-view.tsx`, `components/workflow/data-viewer/schema-view.tsx`, `components/workflow/data-viewer/trace-view.tsx`.
- Product responsibility: provide reusable presentation primitives only.
- May import from: other `components/ui/*`, generic hooks, generic utilities.
- Forbidden imports: `lib/local-fiscal-workflow.ts`, `lib/workflow-store.ts`, `backend/*`, `app/api/*`, source/rulebook editors, runtime/persistence modules.

## Proposed Import Direction

Preferred direction:

```text
app routes
  -> workflow shell
    -> canvas / palette / inspector / structure sheet
      -> sources panel / outputs panel / runs panel / AI panel / data viewer
        -> workflow domain
        -> workflow audit
        -> reusable UI

persistence
  -> workflow domain
  -> workflow audit

runtime/evaluation
  -> workflow domain
  -> workflow audit

reusable UI
  -> generic utilities only
```

Forbidden direction:

```text
workflow domain -> React UI
workflow domain -> persistence
workflow runtime -> React UI
workflow runtime -> API routes
reusable UI -> workflow product model
canvas -> runtime block runners
palette -> persistence implementation
structure sheet -> workflow mutation/editing
AI panel -> silent workflow mutation
```

## Current Files To Split Gradually

| Current file | Target owners |
| --- | --- |
| `lib/local-fiscal-workflow.ts` | `lib/workflow/domain/`, `lib/workflow/persistence/`, `lib/workflow/audit/`, `lib/workflow/fixtures/` |
| `lib/local-tool-registry.ts` | `lib/workflow/runtime/`, `backend/blocks/**`, inspector code preview helpers |
| `components/workflow/workflow-toolbar.tsx` | `components/workflow/palette/`, `components/workflow/shell/`, `lib/workflow/persistence/` adapters |
| `components/workflow/workflow-studio-shell.tsx` | `components/workflow/shell/`, `components/workflow/structure-sheet/` |
| `components/overlays/configuration-overlay.tsx` | `components/workflow/inspector/`, `components/workflow/outputs-panel/`, `components/workflow/sources-panel/` |
| `components/workflow/node-config-panel.tsx` | `components/workflow/inspector/`, `components/workflow/runs-panel/`, `components/workflow/ai-panel/` |
| `components/workflow/inspector/block-inspector.tsx` | `components/workflow/inspector/`, `components/workflow/runs-panel/`, `components/workflow/sources-panel/`, `components/workflow/outputs-panel/` |
| `components/workflow/workspace/block-data-flow-pane.tsx` | `components/workflow/outputs-panel/`, `components/workflow/data-viewer/` |
| `lib/local-ai-workflow-assistant.ts` | `lib/workflow/ai/` or `components/workflow/ai-panel/` service helpers, with proposal-only contracts |

## Product Responsibility Boundaries

- Sources panel owns viewing/selecting evidence and draft rulebook inputs, but not executing transformations.
- Logic execution belongs in runtime/evaluation, not UI components.
- Inspector owns editing surfaces and Code/Runs tabs, but not runtime algorithms.
- Structure sheet is read-only generated output, not a separate calculation editor.
- AI panel owns proposals and review UI, not silent mutation.
- Persistence owns storage and serialization, not product decisions.
- Audit/history owns traceability, not display layout.
- Reusable UI owns generic primitives, not Workflow Studio rules.

## Maintenance Notes

- New code should prefer the target folders above even before old files are split.
- Moving code should be incremental and behavior-preserving.
- Keep compatibility exports during migration if existing imports depend on old file paths.
- Keep the public product model generic. Fiscal/FAPI-specific behavior should live in fixtures, adapters, or domain examples, not in reusable UI.
- `.next/`, `.swc/`, `node_modules/`, and generated plugin registry outputs are not architecture source-of-truth.
