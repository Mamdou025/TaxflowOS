# UI Components

*Last updated: 2026-06-06*

---

## Layout Overview

```
Root Layout (app/layout.tsx)
└── Providers: Auth, Overlay, Theme, Jotai, ReactFlow
    └── Route: /workflows/[workflowId]
        └── workflow-studio-shell.tsx          ← main shell
            ├── workflow-toolbar.tsx            ← top bar
            ├── workflow-canvas.tsx             ← center canvas
            │   ├── family-node-shape.tsx       ← fiscal block nodes
            │   ├── action-node.tsx             ← action/logic nodes
            │   ├── trigger-node.tsx            ← trigger/source nodes
            │   ├── add-node.tsx                ← add block placeholder
            │   ├── edge.tsx                    ← edge component
            │   └── prompt.tsx                  ← AI prompt panel (Cmd+K)
            ├── block-inspector.tsx             ← right panel
            │   ├── data-preview-card.tsx
            │   └── source-viewers/ & logic-viewers/
            └── edge-inspector.tsx              ← right panel (edge selected)
```

---

## Shell & Layout

### `workflow-studio-shell.tsx`
- **Location:** `components/workflow/workflow-studio-shell.tsx`
- **Role:** Top-level orchestrator that wires together the canvas, inspector, toolbar, and data viewers
- **Contains:**
  - Stage/structure view showing workflow columns (Source → Logic → Field → Output)
  - Protected and Field block display sections
  - Block selection state routing (selected block → opens inspector)
  - Multiple viewer panel integrations
- **State consumed:** `selectedNodeAtom`, `selectedEdgeAtom`, `nodesAtom`, `edgesAtom`

### `two-panel-tool-shell.tsx`
- **Location:** `components/workflow/two-panel-tool-shell.tsx`
- **Role:** Resizable two-panel layout used inside logic/source viewers (left = workspace, right = rules editor)
- **Pattern:** Used by keyword mapper, calculation engine, hierarchy aggregator viewers

### `worksheet-page-view.tsx`
- **Location:** `components/workflow/worksheet-page-view.tsx`
- **Status:** `[PARTIAL]` — exists, not fully wired

### `worksheet-page-menu.tsx`
- **Location:** `components/workflow/worksheet-page-menu.tsx`
- **Status:** `[PARTIAL]` — exists, not fully wired

---

## Toolbar

### `workflow-toolbar.tsx`
- **Location:** `components/workflow/workflow-toolbar.tsx`
- **Buttons:** Run · Save · Undo · Redo · Clear · Settings
- **Controls:** Workflow name (inline edit) · Visibility selector (private/public)
- **State consumed:** `hasUnsavedChangesAtom`, `isSavingAtom`, `isExecutingAtom`, `canUndoAtom`, `canRedoAtom`, `currentWorkflowNameAtom`, `currentWorkflowVisibilityAtom`
- **Triggers:** `triggerExecuteAtom`, `autosaveAtom`, `undoAtom`, `redoAtom`, `showClearDialogAtom`
- **Also contains:** Export button, minimap toggle (`showMinimapAtom`)
- **Design:** `neu-surface` neumorphic style applied to `LocalStudioTopBar` panel and `WorkflowMenuComponent` nav pill — soft raised shadow, no border; height reduced to `h-10`
- **Layout (LocalStudioTopBar):** `[⬡ name• status]` | File▾ · Edit▾ · Add▾ | `flex-1` | Pages · Settings▾ | divider | Save• · Run
- **Bar:** `h-11 rounded-xl w-[72%] min-w-[620px]` — taller pill, floats centered above canvas
- **Identity:** workflow icon + inline-editable name (click → `<input>`, Enter/Escape/blur commits) + clickable status badge (click = publish)
- **Save button:** amber dot `•` appears when `hasUnsavedChanges && !isSaving`
- **Run button:** shows `<Loader2> Running…` text while `isExecuting`
- **`.neu-action`:** CSS class for ghost buttons inside `.neu-surface`; hover and `data-state=open` get inset pressed shadow
- **Settings ▾ menu:** Canvas section (minimap toggle, fit to screen) + Dev tools section (demo loaders)
- **Auto-open removed:** `setActiveTab("runs")` no longer fires on workflow execution; AI tab no longer defaults open on local workflows

---

## Canvas

### `workflow-canvas.tsx`
- **Location:** `components/ai-elements/canvas.tsx` (initialized here) + `components/workflow/` (usage)
- **Technology:** `@xyflow/react` v12
- **Features:**
  - Drag/drop block placement
  - Handle-based connection drawing
  - Right-click context menu (`workflow-context-menu.tsx`)
  - Pending connection state
  - AI prompt panel integration (`prompt.tsx`)
  - Undo/redo keyboard hooks
  - Minimap (conditional on `showMinimapAtom`)
  - Viewport fit on workflow load
  - Animated edge transitions

### `persistent-canvas.tsx`
- **Location:** `components/workflow/` area
- **Role:** Saves and restores canvas viewport (zoom + pan position) to localStorage on each change

---

## Node Components

### `family-node-shape.tsx`
- **Location:** `components/workflow/nodes/family-node-shape.tsx`
- **Role:** Visual shell for fiscal domain blocks — handles color coding, icons, and shape per family
- **Families styled:** Source · Logic · Review/Validation · Field · Output · AI/Agent
- **Features:** Status indicator overlay, governance badge, run status color

### `action-node.tsx`
- **Location:** (root `components/workflow/nodes/` or `components/ai-elements/`)
- **Role:** Renders action/logic-type blocks on canvas
- **Shows:** Block label, subtype, status badge, provider logo, integration status warning
- **Handles:** Base64 image output rendering, visual level hierarchy

### `trigger-node.tsx`
- **Location:** Same node folder
- **Role:** Renders trigger-type blocks (in fiscal context: Source blocks)
- **Shows:** Label, subtype, status, visual level hierarchy
- **Uses:** `family-node-shape.tsx` for styling

### `add-node.tsx`
- **Role:** Placeholder node for adding a new block
- **Behavior:** Opens catalog browser on click

---

## Inspector Panel

### `block-inspector.tsx`
- **Location:** `components/workflow/inspector/block-inspector.tsx`
- **Role:** Right-side panel shown when a block is selected
- **Tabs:**
  - **Properties** — block config editing (default for non-Logic blocks)
  - **Code** — logic mode editor + code preview (default for Logic blocks)
  - **Runs** — execution history for this block
- **Per-family sections:**
  - Source: evidence display, source locator, lock state
  - Logic: mode selector, config for keyword mapper / calculation engine / hierarchy aggregator
  - Review: TBD
  - Field: TBD
  - Output: TBD
- **State consumed:** `selectedNodeAtom`, `nodesAtom`, `propertiesPanelActiveTabAtom`

### `edge-inspector.tsx`
- **Location:** `components/workflow/edge-inspector.tsx`
- **Role:** Right-side panel shown when an edge is selected
- **Shows:** Relationship type picker, binding status, notes, confidence
- **Editable fields:** `relationshipType`, `bindingLabel`, `reason`, `notes`
- **State consumed:** `selectedEdgeAtom`, `edgesAtom`

### `local-ai-panel.tsx`
- **Location:** `components/workflow/inspector/local-ai-panel.tsx`
- **Role:** AI assistant panel within the inspector for block-level AI suggestions

### `data-preview-card.tsx`
- **Role:** Shows block output in the inspector after a run
- **Views:** Table · JSON · Schema · Trace
- **Expandable sections** per output role

---

## Source Viewers

Located in `components/workflow/source-viewers/`

### `keyword-rulebook-editor.tsx`
- **Role:** Inline CRUD editor for Keyword Rules source blocks
- **Features:** Add rule · Remove rule · Edit keywords/confidence/category · Rule validation
- **Data shape:** `{ ruleId, categoryId, categoryLabel, keywords[], confidence, suggestedLine }`

### `rollup-rulebook-editor.tsx`
- **Status:** `[PARTIAL]`
- **Role:** Editor for Rollup Rules source blocks

### `aggregation-rulebook-editor.tsx`
- **Role:** Tree-structure editor for Aggregation Rules
- **Features:** Add group · Set operation (sum/subtract) · Nested rule children

### `excel-upload-panel.tsx`
- **Role:** File upload UI for Excel/Workbook source blocks
- **Features:** Drag/drop upload · Sheet selection · Range selection · Data preview table
- **Status:** `[PARTIAL]` — UI complete; actual parsing WIP

### `currency-rate-source-panel.tsx`
- **Role:** Configuration UI for Currency Rate source block
- **Fields:** Document currency · Reporting currency · FAPI year · Rate provider · Rate type · Override rate

### `split-rule-source-editors.tsx`
- **Role:** Multi-rule batch editing UI

---

## Logic Viewers

Located in `components/workflow/logic-viewers/`

### `keyword-mapper-workspace.tsx`
- **Role:** Visualization of keyword mapping results
- **Shows:** Confidence threshold · Match summary stats · Mapped/unmatched row counts
- **Uses:** `two-panel-tool-shell.tsx` (left = results, right = rules)

### `calculation-engine-workspace.tsx`
- **Role:** Formula visualization and named value mapping for Calculation Engine
- **Shows:** Formula definitions · Named value inputs · Calculated results

### `calculation-engine-editor.tsx`
- **Role:** Formula editor component for inline calculation definitions

### `aggregator-workspace.tsx`
- **Role:** Aggregation rule visualization
- **Status:** `[WIP]`

### `field-block-workspace.tsx`
- **Role:** Display output for Field blocks
- **Status:** `[STUB]` — renders but not live-bound to upstream data

---

## Data Viewers

### `data-viewer.tsx`
- **Role:** Unified data display router — picks the right view based on data type

### `table-view.tsx`
- **Role:** Tabular data display with sorting
- **Shows:** Row data · Source trace column · Evidence reference indicators

### `json-view.tsx`
- **Role:** JSON tree view with syntax highlighting and expand/collapse

### `schema-view.tsx`
- **Role:** Data schema display — shows field names, types, structure

### `trace-view.tsx`
- **Role:** Source lineage display — hierarchical evidence ancestry chain

---

## Overlays / Modals

All overlays use the `overlay-provider.tsx` push/pop navigation stack.

### Base: `overlay.tsx`
- **Structure:** Header (title + description) · Content · Footer (actions)
- **40 lines** — lightweight base component

### `overlay-provider.tsx`
- **Role:** Global overlay stack manager
- **API:** push overlay · pop overlay · clear all

### `configuration-overlay.tsx`
- **Role:** Dynamic block configuration UI
- **Used for:** Trigger config · Action config · Condition editing · Integration selector

### `export-workflow-overlay.tsx`
- **Role:** Export workflow to JSON or YAML
- **Status:** `[PARTIAL]`

### `integrations-overlay.tsx`
- **Role:** Add/remove integrations from workflow
- **Status:** `[STUB]`

### `api-keys-overlay.tsx`
- **Role:** API key management
- **Status:** `[STUB]`

### `settings-overlay.tsx`
- **Role:** Workflow-level settings, visibility controls
- **Status:** `[PARTIAL]`

### `ai-gateway-consent-overlay.tsx`
- **Role:** AI gateway authorization/consent flow
- **Status:** `[STUB]`

### `make-public-overlay.tsx`
- **Role:** Publish workflow to public sharing
- **Status:** `[STUB]`

### `workflow-issues-overlay.tsx`
- **Role:** Display workflow validation warnings and errors
- **Status:** `[LIVE]`

---

## AI Elements

Located in `components/ai-elements/`

### `prompt.tsx`
- **Role:** AI generation input panel (activated by Cmd+K)
- **Features:**
  - Streaming API integration with incremental UI updates
  - Existing workflow context passed automatically
  - Single trigger node validation
  - Prompt history (sessionStorage)
  - Animated edge feedback during generation
- **~300 lines**

### `edge.tsx`
- **Role:** Edge component with animation types
- **Types:** Animated · Temporary (during AI generation)

### `node.tsx`
- **Role:** Base card component for AI-generated blocks
- **Features:** Handles · Status indicators · Animated borders

### `panel.tsx`
- **Role:** Right panel container that wraps node config UI

### `canvas.tsx`
- **Role:** React Flow canvas initialization and global config

### `connection.tsx`
- **Role:** Custom connection line rendering (during edge drag)

### `controls.tsx`
- **Role:** Zoom in · Zoom out · Fit view · Lock controls

---

## Workflow Config Components

Located in `components/workflow/config/`

### `action-grid.tsx`
- **Role:** Grid selector for block actions/subtypes in configuration overlay

### `fiscal-block-config.tsx`
- **Role:** Configuration form specifically for fiscal domain blocks

---

## Inspector Sub-Components

Located in `components/workflow/inspector/`

### `local-ai-panel.tsx`
- **Role:** AI assistant sub-panel in the inspector, for block-level suggestions

---

## Page Components

### `app/page.tsx` (Home)
- Loads local workflow from localStorage or initializes demo
- Handles right panel toggle UI
- Routes to workflow editor

### `app/workflows/[workflowId]/page.tsx` (Editor)
- **~750 lines** — main editor page
- Loads workflow from database (or AI-generates from prompt)
- Keyboard shortcuts registration (Cmd+S, Cmd+Enter)
- Execution polling
- Sidebar width persistence
- Panel resize support
- Integration auto-fix handling

---

## Design System Notes

### Neumorphic Theme (`app/globals.css`)
- CSS variables `--neu-bg` (oklch 0.89 light / 0.14 dark), `--neu-text`, `--neu-text-muted`, `--neu-shadow-up`, `--neu-shadow-menu`, `--neu-shadow-press` defined for light and dark modes — tighter 3–4px offsets, moderate opacity (no glow)
- `.neu-surface` — raised panel (navbar, nav pill): solid bg + dual soft shadow, no border
- `.neu-menu` — floating dropdown/context menu: same bg with smaller shadow offsets, no border
- `[data-highlighted]` inside `.neu-menu` gets an inset pressed shadow for keyboard/pointer focus
- Applied to: `workflow-toolbar.tsx` panels, `dropdown-menu.tsx`, `context-menu.tsx`

---

## UI State Summary (atoms that drive UI)

| Atom | Drives |
|---|---|
| `selectedNodeAtom` | Inspector panel block view |
| `selectedEdgeAtom` | Inspector panel edge view |
| `propertiesPanelActiveTabAtom` | Active inspector tab |
| `showMinimapAtom` | Minimap visibility |
| `rightPanelWidthAtom` | Inspector panel width |
| `isSidebarCollapsedAtom` | Left sidebar state |
| `isPanelAnimatingAtom` | Panel slide animation |
| `isExecutingAtom` | Run button loading state |
| `isGeneratingAtom` | AI prompt loading state |
| `hasUnsavedChangesAtom` | Save button state |
| `showClearDialogAtom` | Clear confirmation dialog |
| `showDeleteDialogAtom` | Delete confirmation dialog |
