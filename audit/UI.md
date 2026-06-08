# UI Components

*Last updated: 2026-06-07*

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

## Global App Shell [LIVE — 2026-06-07]

The following components form the persistent shell that wraps every page in the app.

### `components/app-shell.tsx` [LIVE]
- **Role:** Root layout wrapper — renders on every route via `app/layout.tsx`
- **Contains:** `GlobalTopNav` (top bar) · `PersistentCanvas` (fixed canvas layer) · `ChatDrawer` + bottom pill · `GlobalClientSwitcher` overlay
- **Pointer-events:** Content area gets `pointer-events-none` on `/builder` and `/workflows/*` (canvas is interactive beneath)
- **Height:** `100dvh` split as `52px nav + flex-1 content`

### `components/global-top-nav.tsx` [LIVE]
- **Role:** Persistent top bar visible on every page — single unified bar (no per-page second nav)
- **Left:** Sinaxe InScope™ logo (links to `/`)
- **Center (non-canvas pages):** Client selector pill (opens `GlobalClientSwitcher`) + page nav actions from `navActionsAtom`
- **Center (canvas/slot pages):** `<div id="global-nav-workflow-slot">` — empty slot that pages portal their toolbar content into
- **Height:** 52px · neumorphic `#eaeaef` background matching OrbitalStage
- **Canvas/slot detection:** `usePathname()` — slot mode activates on `/builder`, `/workflows/*`, `/t1134`, and `/dashboard`
- **Note:** AI chat toggle button removed (2026-06-07) — chat entry point is the always-visible bottom pill

### `components/chat-drawer.tsx` [LIVE]
- **Role:** Always-visible floating chat pill at bottom center — the single entry point for AI chat
- **Pill:** Fixed bottom-center, 480px max width, neumorphic raised surface; contains a real input at all times
- **On send:** Sets `chatTakeoverAtom = true`, adds message to `chatMessagesAtom`, triggers center overlay; AI stub responds after 700ms
- **Note:** Right-side drawer removed (2026-06-07) — replaced by `ChatCenterOverlay`

### `components/chat-center-overlay.tsx` [LIVE]
- **Role:** Center-screen takeover that appears when the user sends a chat message
- **Trigger:** `chatTakeoverAtom = true` (set by `ChatDrawer` on send)
- **Animation:** Fades in with scale + translate (380ms, 80ms delay after orbs start dissolving); fades out on dismiss (260ms)
- **Content:** Conversation thread (user right-aligned dark, AI left-aligned white card) + header with context label
- **Dismiss:** X button sets `chatTakeoverAtom = false` — orbs/canvas fade back in
- **Position:** Fixed, below nav (52px), above pill (80px bottom clearance), centered, max-width 672px

### `components/global-client-switcher.tsx` [LIVE]
- **Role:** Global client selection overlay (previously local to OrbitalStage)
- **Trigger:** `showClientSwitcherAtom = true` — called from nav bar or orbital center tap
- **Reads/writes:** `selectedClientAtom`, `showClientSwitcherAtom`
- **Client list:** Defined in `lib/nav-store.ts` (`CLIENTS` constant)

---

## State Atoms for Shell

| Atom | File | Drives |
|---|---|---|
| `selectedClientAtom` | `lib/nav-store.ts` | Client pill in top nav + orbital logo center |
| `showClientSwitcherAtom` | `lib/nav-store.ts` | GlobalClientSwitcher overlay |
| `navActionsAtom` | `lib/nav-store.ts` | Right-side page action buttons in top nav (non-canvas pages only) |
| `chatOpenAtom` | `lib/chat-store.ts` | Legacy (unused by new pill design — kept for backward compat) |
| `chatTakeoverAtom` | `lib/chat-store.ts` | Center overlay shown/hidden; triggers orb/canvas dissolve |
| `chatMessagesAtom` | `lib/chat-store.ts` | Conversation thread |
| `chatPageContextAtom` | `lib/chat-store.ts` | Context label in overlay header + AI prompt |

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
- **Rendering:** `LocalStudioTopBar` uses `createPortal` to inject its content into `#global-nav-workflow-slot` inside `GlobalTopNav` — **no separate floating pill bar**
- **Layout (fused into GlobalTopNav):** `[⬡ name• status]` | File▾ · Edit▾ · Add▾ | `flex-1` | Runtime Preview · AI Panel · Pages · Settings · Dev▾ | divider | Save• · Run
- **Identity:** workflow icon + inline-editable name + clickable status badge (click = publish). Home button removed (logo in GlobalTopNav handles navigation)
- **Hidden inputs:** Excel and JSON file inputs stay in the React component tree (not portaled); refs still work despite `pointer-events-none` parent
- **Panel toggles:** All 4 right-side buttons (ListTree, PanelRight, Layers, Settings2) toggle `activeRightPanelAtom`; same panel = close, different = switch; all default closed
- **Dev Tools ▾:** Small `ChevronDown` dropdown with demo loaders (Load Z Demo, Load Expanded Demo, Reset FAPI Sample)
- **Save button:** amber dot `•` appears when `hasUnsavedChanges && !isSaving`
- **Run button:** shows `<Loader2> Running…` text while `isExecuting`
- **`.neu-action`:** CSS class for ghost buttons; renders flat inside nav bar (no `neu-surface` wrapper needed)
- **Mount guard:** Portal fires only after client-side mount (`useState(false)` + `useEffect`) to avoid SSR mismatch

---

### `right-panel-shell.tsx` [LIVE]
- **Location:** `components/workflow/right-panel-shell.tsx`
- **Role:** Unified right-side slide drawer; one panel open at a time; opening any closes the previous
- **Panels routed:** `ai-panel` → `<NodeConfigPanel />`; `runtime-preview` → `<RuntimePreviewContent />`; `pages` → inline field-block include/exclude list + "Preview Worksheet" button; `settings` → minimap toggle + fit canvas
- **State:** reads/writes `activeRightPanelAtom`; syncs `rightPanelWidthAtom` (34% when open, null when closed) and `isPanelAnimatingAtom` via `useEffect`
- **Transition:** `translateX(0/100%)` CSS transition 300ms ease-out
- **WorksheetPageView:** rendered as full-screen overlay (`fixed inset-0 z-50`) when "Preview Worksheet" clicked; closed by back button
- **`isMobile` prop:** panel is suppressed on mobile (`isOpen = false`)

---

## Canvas

### `workflow-canvas.tsx`
- **Location:** `components/ai-elements/canvas.tsx` (initialized here) + `components/workflow/` (usage)
- **Technology:** `@xyflow/react` v12
- **Background:** `bg-transparent` — background is owned by `PersistentCanvas` wrapper
- **Grid:** `BackgroundVariant.Lines`, `color: rgba(255,255,255,0.055)`, gap 28px, lineWidth 0.5 — subtle white lines on dark canvas
- **No AmbientOrbs:** removed (2026-06-07) — rotating orb circles removed from canvas background
- **Legend box:** Dark styling (`rgba(26,26,32,0.88)` bg, `rgba(255,255,255,0.08)` border, white/55 + white/35 text)
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
- **Location:** `components/workflow/persistent-canvas.tsx`
- **Role:** Fixed full-viewport canvas layer behind all page content; handles background color transition
- **Mount transition:** Background starts `#eaeaef` (matching homepage), fades to `#18181c` over 900ms after 60ms delay — seamless navigation from homepage to builder
- **Chat dissolve:** On `chatTakeoverAtom = true`, opacity fades to 0 (480ms ease-out); restores 560ms cubic-bezier
- **Only active on:** `/builder` and `/workflows/*` — renders `null` on all other routes

---

## Node Components

### `family-node-shape.tsx`
- **Location:** `components/workflow/nodes/family-node-shape.tsx`
- **Role:** Visual shell for fiscal domain blocks — handles shape, neumorphic surface, icon per family
- **Design (2026-06-07):** Option B — all nodes use `#eaeaef` neumorphic raised card on dark `#18181c` canvas
  - **Unified border:** `rgba(158,158,178,0.28)` for all families (no family-specific border colors)
  - **Unified background:** `#eaeaef` for all families (matches homepage orb surface)
  - **Neumorphic shadow (rectangular nodes):** `8px 8px 18px rgba(158,158,178,0.42), -8px -8px 18px rgba(255,255,255,0.86), 0 16px 32px rgba(0,0,0,0.50)`
  - **Neumorphic filter (clip-path nodes):** `drop-shadow` approximating the raised look
  - **Icon colors (only unique per family):** orange-600 · sky-600 · emerald-600 · amber-600 · violet-600 · indigo-600 · fuchsia-600
  - **Badge:** unified `border-white/15 bg-(--node-badge-bg)` with family text color for identification
- **Shapes:** Hexagon (Trigger) · Pill (Source) · Square (Logic) · Diamond (Review/Val) · Wide rect (Field) · Tall rect (Output) · Circle (AI/Agent)

### `visual-level.tsx`
- **Location:** `components/workflow/nodes/visual-level.tsx`
- **Role:** Style config and icon for visual-level nodes (L1 stage · L2 logic · L3 source)
- **Design (2026-06-07):** Updated to neumorphic `#eaeaef` bg + `border-neutral-400/30` + same box-shadow as family nodes
- **Icon colors:** orange-600 (L1) · emerald-600 (L2) · sky-600 (L3) — dark on light bg

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
- **Background:** `#eaeaef` neumorphic surface with 24px dot grid (transparent ReactFlow layer over parent div); `AmbientOrbs` rendered behind ReactFlow at 9% opacity

### `ambient-orbs.tsx` [LIVE]
- **Location:** `components/ambient-orbs.tsx`
- **Role:** Faint animated orbital dot rings (purple outer, orange inner) rendered as ambient texture behind the workflow canvas
- **Opacity:** 0.09 — non-interactive, purely decorative

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

### `app/dashboard/page.tsx` + `tax-ui/pages/Dashboard.tsx` [LIVE — 2026-06-07]
- **Role:** Practitioner Dashboard — KPI tiles, client portfolio, work items, review queue, activity feed
- **Shell:** No sidebar — sidebar removed 2026-06-07; content fills full width inside the root `AppShell`
- **Toolbar:** `DashboardToolbar` (inside `Dashboard.tsx`) portals horizontal nav tabs into `#global-nav-workflow-slot` via `createPortal`
  - Main tabs: Tax Overview · Dashboard (active) · Clients (badge 8) · Workflows (badge 2) · Builder
  - Util items (right-aligned): Analytics · Settings · Help (all `toast.info('coming soon')`)
  - Active item: highlighted with `rgba(15,32,68,0.09)` background + `#0F2044` text
- **Scroll:** Root div `h-full overflow-auto` — fills the content area and scrolls internally
- **Removed:** `tax-ui/components/AppShell.tsx` sidebar/layout wrapper is no longer rendered on `/dashboard`

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
| `activeRightPanelAtom` | Which right panel is open (null = closed) |
| `isSidebarCollapsedAtom` | Left sidebar state |
| `isPanelAnimatingAtom` | Panel slide animation (managed by RightPanelShell) |
| `isExecutingAtom` | Run button loading state |
| `isGeneratingAtom` | AI prompt loading state |
| `hasUnsavedChangesAtom` | Save button state |
| `showClearDialogAtom` | Clear confirmation dialog |
| `showDeleteDialogAtom` | Delete confirmation dialog |
