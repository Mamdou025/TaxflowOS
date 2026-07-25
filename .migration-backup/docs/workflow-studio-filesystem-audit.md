# Workflow Studio Filesystem Audit

Date: 2026-04-29

## A. Largest Relevant Files

Current audit counts after the workspace, data-viewer, and code-preview extractions:

| Lines | File | Risk |
| ---: | --- | --- |
| 5188 | `lib/local-fiscal-workflow.ts` | should extract |
| 3040 | `lib/local-tool-registry.ts` | should extract |
| 2327 | `components/workflow/inspector/block-inspector.tsx` | should extract |
| 2095 | `components/workflow/node-config-panel.tsx` | too large |
| 1972 | `components/workflow/workflow-toolbar.tsx` | too large |
| 1698 | `components/workflow/workflow-studio-shell.tsx` | too large |
| 1397 | `lib/local-ai-workflow-assistant.ts` | watch |
| 1222 | `components/overlays/configuration-overlay.tsx` | too large |
| 877 | `components/workflow/workspace/block-data-flow-pane.tsx` | watch |
| 647 | `components/workflow/workflow-canvas.tsx` | watch |
| 460 | `lib/local-tool-runner.ts` | OK |
| 388 | `components/workflow/edge-inspector.tsx` | OK |
| 233 | `components/workflow/inspector/data-preview-card.tsx` | OK |

Current largest backend-style files:

| Lines | File | Risk |
| ---: | --- | --- |
| 354 | `backend/blocks/logic/keyword-mapper/run.ts` | OK |
| 243 | `backend/blocks/logic/keyword-mapper/schema.ts` | OK |
| 120 | `backend/runtime/types.ts` | OK |
| 117 | `backend/runtime/validation.ts` | OK |
| 109 | `backend/blocks/source/keyword-rules/schema.ts` | OK |
| 87 | `backend/blocks/logic/keyword-mapper/definition.ts` | OK |
| 79 | `backend/blocks/source/keyword-rules/run.ts` | OK |
| 78 | `backend/blocks/source/manual-table/schema.ts` | OK |
| 76 | `backend/runtime/lineage.ts` | OK |
| 67 | `backend/blocks/source/manual-table/run.ts` | OK |

After the safe extractions, `components/workflow/inspector/block-inspector.tsx` is 2327 lines, `components/workflow/workspace/block-data-flow-pane.tsx` is 877 lines, `components/workflow/inspector/data-preview-card.tsx` is 233 lines, and the pane sizing/resize behavior lives in `components/workflow/workspace/workspace-pane-sizing.tsx` at 169 lines.

New focused frontend modules:

| Lines | File | Risk |
| ---: | --- | --- |
| 325 | `components/workflow/data-viewer/data-preview-utils.ts` | watch |
| 167 | `components/workflow/data-viewer/table-view.tsx` | OK |
| 41 | `components/workflow/data-viewer/data-viewer.tsx` | OK |
| 42 | `components/workflow/data-viewer/data-view-tabs.tsx` | OK |
| 27 | `components/workflow/data-viewer/schema-view.tsx` | OK |
| 26 | `components/workflow/data-viewer/trace-view.tsx` | OK |
| 20 | `components/workflow/data-viewer/json-view.tsx` | OK |
| 15 | `components/workflow/data-viewer/data-preview-summary.tsx` | OK |
| 7 | `components/workflow/data-viewer/types.ts` | OK |
| 101 | `components/workflow/inspector/code-preview/keyword-mapper-code-preview.ts` | OK |
| 87 | `components/workflow/inspector/code-preview/aggregation-code-preview.ts` | OK |
| 73 | `components/workflow/inspector/code-preview/output-code-preview.ts` | OK |
| 58 | `components/workflow/inspector/code-preview/preview-utils.ts` | OK |
| 50 | `components/workflow/inspector/code-preview/generate-code-preview.ts` | OK |

## B. Responsibility Map

`lib/local-fiscal-workflow.ts`
- Owns core local workflow types, block families/subtypes, relationship types, sample workflow construction, local persistence/import/export helpers, publish snapshot helpers, local run seed data, runtime preview helpers, catalog defaults, and sample run generation.
- This is the highest-risk file because it mixes model contracts, samples, migrations, persistence, and demo fixtures.

`lib/local-tool-registry.ts`
- Owns local tool definitions, tool groups, input/output roles, parser stubs, review/protected/output tools, and adapters for backend-style modules.
- It should eventually become an adapter layer over isolated backend-style block modules.

`lib/local-tool-runner.ts`
- Owns the local deterministic graph runner, dependency ordering, binding resolution, tool execution, and workflow run result/log assembly.
- Cohesive enough for v1.

`lib/local-ai-workflow-assistant.ts`
- Owns deterministic local Ask/Act behavior, proposal generation, and proposal approval/rejection logic.
- Large but cohesive; defer until proposal behavior stabilizes.

`components/workflow/workflow-studio-shell.tsx`
- Owns main studio layout, selection context, bottom runtime preview panels, and workflow-level actions.
- Still too large, but broad extraction risks selection/runtime preview regressions.

`components/workflow/node-config-panel.tsx`
- Owns right-side block/edge configuration behavior and inspector orchestration.
- Large and should later split by Properties/Code/Runs sections.

`components/workflow/inspector/block-inspector.tsx`
- Owns selected block inspector content, properties controls, code preview display, run proof display, bindings, source immutability messaging, and block-specific summaries.
- The input/output data-flow pane, data viewer internals, and code preview generation have been extracted.

`components/workflow/data-viewer/*`
- Owns reusable Table, JSON, Schema, and Trace rendering, compact preview summaries, schema inference, trace extraction, and data kind detection.
- Used by the block workspace pane and the legacy `DataPreviewCard` surfaces.

`components/workflow/inspector/code-preview/*`
- Owns generated read-only code previews by block/tool type: Source, Keyword Mapper, Aggregation, Formula, Validation, Approval Gate, Protected Result, Output, and generic config fallback.

`components/workflow/workspace/block-data-flow-pane.tsx`
- Owns the n8n-style global Input/Output views, search, group selection, group expansion, and large data viewer dialog.

`components/workflow/workspace/workspace-pane-sizing.tsx`
- Owns resizable block workspace pane widths, local layout persistence, drag handles, and the grid column sizing helper.

`components/overlays/configuration-overlay.tsx`
- Owns the modal shell for selected blocks/edges, action grid routing, properties/code/runs tab content, local run controls, and wiring the block workspace panes together.
- Still too large, but the resize mechanics are now extracted to the workspace folder.

`components/workflow/edge-inspector.tsx`
- Owns first-class edge metadata editing, relationship/binding details, status, notes, and insert-between behavior.
- Cohesive enough for v1.

`components/workflow/workflow-toolbar.tsx`
- Owns top toolbar actions, sample/demo controls, save/export/import/publish/run buttons, and status controls.
- Too large and should split by action clusters later.

`components/workflow/workflow-canvas.tsx`
- Owns React Flow canvas, node rendering registration, connector behavior, edge selection, and canvas event handling.
- Watch, but not urgent.

`backend/runtime/*`
- Owns backend-style runtime contracts, local registry, runner placeholder, lineage, events, and validation helpers.
- Healthy and isolated from React.

`backend/blocks/**/*`
- Owns isolated source/manual-table, source/keyword-rules, and logic/keyword-mapper modules with definitions, schemas, fixtures, and run functions.
- Healthy direction for future tools.

## C. Risk Assessment

OK:
- `lib/local-tool-runner.ts`
- `components/workflow/edge-inspector.tsx`
- `backend/runtime/*`
- `backend/blocks/source/manual-table/*`
- `backend/blocks/source/keyword-rules/*`
- `backend/blocks/logic/keyword-mapper/*`

Watch:
- `lib/local-ai-workflow-assistant.ts`
- `components/workflow/workflow-canvas.tsx`
- `components/workflow/workspace/block-data-flow-pane.tsx`
- `components/workflow/data-viewer/data-preview-utils.ts`
- `components/workflow/workspace/workspace-pane-sizing.tsx`

Too large:
- `components/overlays/configuration-overlay.tsx`
- `components/workflow/node-config-panel.tsx`
- `components/workflow/workflow-toolbar.tsx`
- `components/workflow/workflow-studio-shell.tsx`

Should extract:
- `lib/local-fiscal-workflow.ts`
- `lib/local-tool-registry.ts`
- remaining block-specific sections inside `components/workflow/inspector/block-inspector.tsx`

## D. Recommended Extraction Plan

Safe extractions completed in this pass:
- Extracted the block workspace Input/Output data-flow pane from `components/workflow/inspector/block-inspector.tsx` to `components/workflow/workspace/block-data-flow-pane.tsx`.
- Updated the configuration overlay to import the workspace pane from the new workspace module.
- Extracted resizable three-pane workspace sizing, local width persistence, and drag handles from `components/overlays/configuration-overlay.tsx` to `components/workflow/workspace/workspace-pane-sizing.tsx`.
- Extracted reusable data viewer modules under `components/workflow/data-viewer/`.
- Extracted block-specific generated Code tab preview modules under `components/workflow/inspector/code-preview/`.
- Preserved code preview, inspector tabs, runner behavior, local samples, AI Ask/Act, and runtime preview behavior.

Safe next extractions:
- Move data-flow helper functions shared by `block-inspector.tsx` and `block-data-flow-pane.tsx` into `components/workflow/workspace/workspace-data-flow-utils.ts`.
- Split remaining block workspace center panel sections out of `components/overlays/configuration-overlay.tsx` only after the current tab behavior is covered by a UI smoke test.
- Split `components/workflow/data-viewer/data-preview-utils.ts` if data kind detection grows beyond current local payloads.
- Extract `components/workflow/workspace/block-data-flow-pane.tsx` group construction helpers into a pure utility file.
- Split toolbar action clusters into focused components without changing atoms or workflow actions.

Risky extractions to defer:
- Splitting `lib/local-fiscal-workflow.ts` into types, catalog, samples, persistence, publish, and runtime preview modules. It is the right architecture, but many imports depend on this compatibility surface.
- Moving FAPI-inspired sample and Single Item Pipeline Demo into separate sample workflow files. This should be done with compatibility re-exports and a dedicated smoke test.
- Migrating all registry-only tools into backend-style modules. Only the first three backend-style modules are isolated today.
- Reworking `workflow-studio-shell.tsx` bottom panel ownership. The runtime preview and selection behavior should be covered by UI smoke tests first.

## E. Current Filesystem Health

The backend-style block module direction is healthy, and the runner/tool contracts are good enough for the prototype. The frontend is workable but needs cleanup before adding many more blocks. The biggest concern is `lib/local-fiscal-workflow.ts`, which should be split before real backend integration or a large expansion of workflow samples. The new workspace extraction is a good first cut, but the extracted pane itself should be split once behavior is covered by tests.
