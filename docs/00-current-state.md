# Workflow Studio Current State

Date: 2026-05-04

This snapshot describes the current Workflow Studio codebase as it exists today, with the intended product model as the reference point:

`Source -> Logic -> Review / Validation -> Protected -> Output`

The studio is currently a hybrid of the original Vercel workflow-builder template and a local fiscal Workflow Studio prototype. The app has a working canvas, inspector, local runner, local persistence, import/export/publish flows, source/rulebook viewers, and local AI proposal behavior. It also still contains several large files and some product rules embedded directly in UI components.

## Main Entry Points

- `app/layout.tsx` wraps the app with `ReactFlowProvider`, Jotai, theme/auth/overlay providers, and `PersistentCanvas`.
- `app/page.tsx` is the local studio entry point. It loads a local workflow snapshot or creates the Working Source + Rulebooks demo, converts the workflow definition into canvas nodes/edges, and renders `WorkflowStudioShell` plus `NodeConfigPanel`.
- `app/workflows/[workflowId]/page.tsx` is the persisted workflow editor. It loads workflow data through the API client, restores canvas state, handles sidebar layout state, and supports AI prompt handoff from session storage.
- `app/workflows/page.tsx` is the workflow-list/loading route.
- `components/workflow/persistent-canvas.tsx` decides when the persistent canvas shell appears.
- API routes under `app/api/workflows/*`, `app/api/workflow/[workflowId]/execute`, `app/api/ai/generate`, and `app/api/ai-gateway/*` provide template workflow CRUD, execution, and AI-related behavior.

## Main Workflow Studio Components

- `components/workflow/workflow-studio-shell.tsx` owns the main studio shell, central layout, and bottom generated worksheet/runtime preview.
- `components/workflow/workflow-canvas.tsx` is the React Flow canvas implementation.
- `components/workflow/workflow-toolbar.tsx` owns primary toolbar actions such as upload, add blocks/rulebooks, save, export, import, publish, and run.
- `components/overlays/configuration-overlay.tsx` is the modal workspace shell for selected blocks and edges.
- `components/workflow/node-config-panel.tsx` is the side inspector shell for selected nodes and edges.
- `components/workflow/inspector/block-inspector.tsx` renders much of the Properties, Code, and Runs inspector content.
- `components/workflow/edge-inspector.tsx` renders edge and binding details.
- `components/workflow/workspace/block-data-flow-pane.tsx` provides n8n-style Input/Output panes with Schema, Table, JSON, and Trace views.
- `components/workflow/source-viewers/*` contains Excel source, keyword rulebook, aggregation rulebook, and rule source editors/viewers.
- `components/workflow/logic-viewers/hierarchy-aggregator-panel.tsx` presents hierarchy aggregation behavior.
- `components/workflow/inspector/code-preview/*` contains block-specific code previews.

## Canvas Logic

Canvas behavior primarily lives in:

- `components/workflow/workflow-canvas.tsx`: React Flow setup, node types, edge types, connection creation, connect-start/connect-end behavior, selection, fitView, context menu, and configuration overlay opening.
- `components/ai-elements/canvas.tsx`: thin wrapper around React Flow and background styling.
- `components/ai-elements/edge.tsx`: custom edge rendering and edge status visuals.
- `components/ai-elements/node.tsx`: shared node handles and base node layout.
- `lib/workflow-store.ts`: Jotai atoms and canvas operations for nodes, edges, selection, history, workflow metadata, execution status, and autosave.
- `lib/local-fiscal-workflow.ts`: conversion between typed local workflow definitions and canvas nodes/edges.

## Inspector Logic

Inspector behavior is split across several large UI files:

- `components/overlays/configuration-overlay.tsx` handles modal workspace routing, block/edge tabs, source setup, rulebook editors, data panes, and run controls.
- `components/workflow/node-config-panel.tsx` handles the side inspector, tab state, draft apply/discard behavior, source version actions, and delete actions.
- `components/workflow/inspector/block-inspector.tsx` renders block-specific Properties, Code, and Runs detail.
- `components/workflow/inspector/source-setup-panel.tsx` chooses source-specific setup views such as Excel upload, Keyword Rulebook, and Aggregation Rulebook.
- `components/workflow/inspector/code-preview/*` renders block-specific Code tab previews.
- `components/workflow/edge-inspector.tsx` inspects edge relationships and binding metadata.
- `components/workflow/inspector/local-ai-panel.tsx` shows local AI Ask/Act proposals and applies them only after explicit user action.

## Block And Node Type Definitions

- `lib/local-fiscal-workflow.ts` defines the main local workflow model: block families, subtypes, stages, workflow blocks, workflow edges, relationship rules, catalog entries, source state, governance state, and runtime defaults.
- `lib/workflow-store.ts` defines canvas node and edge data types, including `WorkflowNodeType`, `WorkflowNodeData`, and `WorkflowEdgeData`.
- `components/workflow/nodes/family-node-shape.tsx` maps block families and subtypes to visual shapes, icons, and family treatment.
- `components/workflow/nodes/visual-level.tsx` still contains legacy visual-level styling concepts. These should remain internal only and should not surface as generic Level 1 / Level 2 / Level 3 product vocabulary.
- `lib/local-tool-registry.ts` defines local tool metadata and adapts backend-style block modules into the local runner.
- `backend/blocks/**/definition.ts` defines backend-style block/tool metadata for source and logic blocks.

Current model drift: the code still contains an `AI / Agent` block family in places. The target public model remains `Source -> Logic -> Review / Validation -> Protected -> Output`; AI should be treated as an assistant/proposal layer, not a public block family unless deliberately redesigned later.

## State Storage

State is stored in several places:

- `lib/workflow-store.ts` stores the main canvas state in Jotai atoms: nodes, edges, selected node/edge, workflow metadata, panel state, minimap state, execution logs, loading/generating/saving/executing flags, revision, and undo/redo history.
- `lib/atoms/overlay.ts` stores overlay state.
- `lib/integrations-store.ts` stores integration-related UI state.
- `lib/ai-gateway/state.ts` stores AI gateway settings/state.
- Component-local state is extensive in `workflow-canvas.tsx`, `configuration-overlay.tsx`, `node-config-panel.tsx`, `workflow-toolbar.tsx`, and the source/rulebook viewers.
- Browser storage is used for local workflow snapshots, run records, publish status, pane widths, and sidebar/session handoff state.

## Persistence

- `lib/local-fiscal-workflow.ts` owns local workflow snapshot persistence through localStorage keys such as `workflow-studio.local-workflow` and `workflow-studio.local-runs`.
- `lib/workflow-store.ts` contains `autosaveAtom`, which saves local workflows to localStorage and persisted workflows through `api.workflow.update`.
- `lib/api-client.ts` is the type-safe API client used by the app.
- `app/api/workflows/*` contains persisted workflow CRUD routes.
- `app/api/workflow/[workflowId]/execute` handles template workflow execution.
- `lib/db/schema.ts` defines database schema, with generated migrations under `drizzle/`.
- `components/workflow/workflow-toolbar.tsx` and related routes handle import, export, publish, and download flows.
- Workspace pane widths, sidebar widths, and selected UI modes are persisted in cookies or localStorage in their respective components.

Important persistence rule: uploaded Source evidence should persist parsed metadata and selected evidence slices, not raw `File` objects. Sources should remain immutable after use/publish; corrections should be represented downstream in Logic.

## AI Behavior

There are two AI behavior paths today:

- Template AI generation in `app/api/ai/generate/route.ts` streams direct workflow operations such as add/update/remove node and add edge. Client code in `components/ai-elements/prompt.tsx` applies these operations.
- Local Workflow Studio AI behavior in `lib/local-ai-workflow-assistant.ts` and `components/workflow/inspector/local-ai-panel.tsx` creates proposals and applies them only after explicit user approval.

The target product rule is: AI proposes; it does not silently mutate workflows. The local AI panel follows this rule more closely than the template generation route.

## Backend-Style Local Runner

- `backend/runtime/*` contains runtime types, registry, runner, lineage, validation, and events.
- `backend/blocks/source/manual-table/*`, `backend/blocks/source/keyword-rules/*`, and `backend/blocks/source/aggregation-rules/*` define source/rulebook-style modules.
- `backend/blocks/logic/keyword-mapper/*` and `backend/blocks/logic/hierarchy-aggregator/*` define logic modules.
- `lib/local-tool-runner.ts`, `lib/local-tool-registry.ts`, and `lib/local-fiscal-workflow.ts` connect these backend-style definitions to the local canvas runtime.

## Large Or Overloaded Files

Current largest files by line count:

| File | Lines | Concern |
| --- | ---: | --- |
| `lib/local-fiscal-workflow.ts` | 5596 | Core domain model, catalog, demos, conversion, persistence, execution helpers, and product defaults are concentrated together. |
| `lib/local-tool-registry.ts` | 3947 | Tool metadata, code previews, mock runtime behavior, and adapted backend modules are mixed. |
| `components/workflow/inspector/block-inspector.tsx` | 2454 | Inspector UI, product rules, source immutability, runs, code, and block-specific rendering are concentrated. |
| `components/workflow/workflow-toolbar.tsx` | 2338 | Toolbar actions, upload/import/export/publish/run/demo behavior, and local persistence are mixed. |
| `components/workflow/node-config-panel.tsx` | 2129 | Side inspector orchestration, editing state, source versioning, and block-specific behavior are mixed. |
| `components/workflow/workflow-studio-shell.tsx` | 1698 | Shell layout, generated worksheet/runtime preview, and product-specific presentation are mixed. |
| `components/overlays/configuration-overlay.tsx` | 1405 | Modal workspace routing, source/rulebook/logic panes, tabs, and run controls are mixed. |
| `lib/local-ai-workflow-assistant.ts` | 1397 | AI proposal model, heuristics, and product assumptions live together. |
| `components/workflow/workspace/block-data-flow-pane.tsx` | 1376 | Data view rendering, source output behavior, table/schema/json/trace views, and product-specific display are mixed. |
| `components/workflow/source-viewers/rule-source-editor.tsx` | 1169 | Rule source editing covers multiple rulebook behaviors in one component. |

These files are the first candidates for focused extraction once behavior is stable.

## Product Rules Embedded In UI Components

Several product rules currently live directly in UI code:

- Source immutability and version messages appear in `block-inspector.tsx`, `configuration-overlay.tsx`, `node-config-panel.tsx`, and source viewer components.
- Source artifact versus rulebook workspace routing is handled inside `configuration-overlay.tsx` and `source-setup-panel.tsx`.
- Rulebook behavior and keyword/aggregation editing rules are embedded in `keyword-rulebook-editor.tsx`, `aggregation-rulebook-editor.tsx`, `aggregation-rulebook-cascade.tsx`, and `rule-source-editor.tsx`.
- Relationship and binding assumptions are partly centralized in `lib/local-fiscal-workflow.ts`, but UI components also make display and routing assumptions.
- Runtime preview and output packaging expectations live in `workflow-studio-shell.tsx`, `local-tool-registry.ts`, and `local-fiscal-workflow.ts`.
- Public product family vocabulary is mostly centralized, but legacy/fiscal naming and visual-level concepts still appear in component files.

## Top 10 Maintainability Risks

1. `lib/local-fiscal-workflow.ts` is doing too many jobs: model definitions, catalog, demos, conversion, persistence, run records, and product defaults.
2. `lib/local-tool-registry.ts` mixes tool definitions, code previews, mock execution behavior, and backend-adapted modules.
3. Inspector behavior is split between the modal overlay, side panel, block inspector, source setup panel, and specialized viewers, which makes duplicated UI likely.
4. The canvas/runtime model and product model are coupled through UI-specific data structures and conversion helpers.
5. AI behavior is inconsistent: local AI is proposal-based, while the template AI generation route can stream direct mutations.
6. Rulebook concepts are still partially represented as Source-like blocks, creating confusion between immutable evidence and editable governance workspaces.
7. Legacy fiscal/FAPI naming remains in generic workflow files, increasing the risk that generic UI decisions inherit FAPI-specific assumptions.
8. Product rules such as source immutability, relationship constraints, and output packaging are not fully centralized.
9. LocalStorage, cookies, sessionStorage, Jotai atoms, API persistence, and DB persistence all coexist without a single persistence boundary.
10. Very large UI components increase regression risk because small visual changes can affect unrelated toolbar, inspector, or workspace behavior.

## Current Alignment With Target Model

Aligned:

- The app has visible block families that map broadly to `Source -> Logic -> Review / Validation -> Protected -> Output`.
- Excel Source, Keyword Mapper, Hierarchy Aggregator, Protected Result, Evidence Preview, and Canonical JSON now form a practical local workflow path.
- Inspector tabs keep Properties, Code, and Runs as the main editing/review surfaces.
- Runtime preview exists as a generated worksheet-style output area.
- Local AI panel is proposal-based and requires explicit user action.

Needs continued cleanup:

- Rulebooks should feel like editable governance workspaces, not ordinary immutable source artifacts.
- Source immutability should be centralized in the model/runtime layer and reflected by the UI.
- AI direct mutation routes should be reconciled with the proposal-only product rule.
- Legacy FAPI-specific language and visual-level vocabulary should remain internal or be removed from generic UI surfaces.
- Large files should be split only after behavior is stable, with compatibility exports preserved where needed.
