# TaxflowOS — Physical Restructure Plan ("de-scaffold + one folder per concern")

*Status: proposal / actionable plan. Companion to `docs/kernel-migration-spec.md`.*
*Date: 2026-07-19. Grounded in a 57-agent source audit (subsystem liveness maps, god-file split analysis, and adversarial delete-safety verification of 42 candidates).*

---

## 0. What this document is (and how it relates to the other docs)

`kernel-migration-spec.md` is the **semantic** plan — one workflow/run/node model, one action gateway. It tells you the *fate* of each file (Keep / Adapter / Fold / Replace / Isolate) but not where files physically live.

**This is the physical companion.** It answers the two things you actually asked for:

1. **"Make it look less like a vibe-coded app."** → delete the dead Vercel-template scaffolding, strip the template chrome that renders on the product Builder page, and split the god-files.
2. **"Put the different blocks into different folders."** → one target folder tree for the whole app, with a sequenced, behavior-preserving migration.

The two plans are aligned: every folder target here matches the kernel spec's fate table, so doing this restructure *accelerates* the kernel migration rather than fighting it.

### Why it currently reads as vibe-coded (the honest diagnosis)

- **It is still literally the template.** `package.json name` is `ai-workflow-builder-template`. The **Deploy-to-Vercel** button and **GitHub-stars** button render on the live `/builder` toolbar (`workflow-toolbar.tsx:3103-3104`). That is the single biggest "this is a scaffold" tell.
- **Five competing "source roots"** for the same concepts: `src/`, `backend/`, `lib/`, `components/`, and a whole **separate `tax-ui/` app** (its own `wouter` router shim, *excluded from `tsconfig`* so 5 shipped worksheet pages are never type-checked).
- **God-files.** Nine files carry ~19,000 lines between them; the two largest (`local-tool-registry.ts`, `local-fiscal-workflow.ts`) are ~5,900 lines each and mix 8–11 responsibilities apiece.
- **Duplicated systems.** Two inspector implementations, two run engines, two AI stacks, three app shells, three sidebars, the FAPI worksheet built twice.
- **Dead code that reads as architecture.** `lib/kernel/` (10 files, ~600 lines) that nothing imports; a dead 1,426-line `workflow-studio-shell.tsx`; ~25 orphaned files.

### The good news

You already have the antidote in-repo: **`lib/assistant-runtime/`** is exactly what "not vibe-coded" looks like — domain-grouped subfolders (`routing/`, `memory/`, `agents/`, `evals/`), an `index.ts` barrel, colocated tests. **This plan generalizes that pattern to the rest of the codebase.**

---

## 1. Guiding principles

1. **Strangler-fig, not rewrite.** Every move is behavior-preserving. Systems keep running; only their *location* and *size* change.
2. **Barrels preserve imports.** High-fan-in files (`local-fiscal-workflow.ts` = 54 importers, `workflow-store.ts` = 55) become thin re-export barrels at their old path so no import site breaks on day one. Codemod the imports later, as a separate low-risk pass.
3. **Commit before moving.** A large amount of current work is *untracked* in git (`lib/assistant-runtime/`, `lib/kernel/`, `components/assistant/`, new routes). Commit first so moves are reviewable and reversible.
4. **Green after every phase.** `pnpm type-check` (and the FAPI parity numbers) must pass at the end of each phase before starting the next.
5. **Move atoms first.** Jotai atoms that live inside components-to-be-split (e.g. `sidebarCollapsedAtom` inside `neumorphic-sidebar.tsx`) move to `lib/state/` *before* the component is split, so wiring doesn't break mid-move.

---

## 2. Target folder structure (whole app)

The goal is to collapse **five source roots → three** (`app/`, `components/`, `lib/`), each with one obvious home per concern.

```
app/
  (product routes)      page.tsx · builder · fapi · dashboard · surplus · t1134 · bu-overview · client · run · viewer
  api/
    (product)           copilotkit · assistant/* · google/* · genui · fx-rate · auth · user · api-keys
    (template → quarantine) workflows/* · workflow/[id]/execute · integrations/* · ai/generate · ai-gateway/*

components/
  shell/                app-shell · global-top-nav · global-client-switcher · global-modals · worksheet-shell
                        theme-provider · scope-orb · neumorphic-sidebar
  workflow/
    shell/              persistent-canvas · right-panel-shell · two-panel-tool-shell · inline-builder · builder-page-menu
    canvas/             workflow-canvas · workflow-context-menu · nodes/* · (fold ai-elements canvas primitives)
    palette/            workflow-toolbar (split) · config/action-grid · config/action-config*
    inspector/          node-config-panel · block-inspector · edge-inspector · config/* · inspector/*  ← ONE inspector
    sources-panel/      source-viewers/*   (excel-utils.ts → lib/parsing/)
    logic-panel/        logic-viewers/*
    outputs-panel/      block-data-flow-pane (split) · latest-local-run · workspace-pane-sizing
    runs-panel/         workflow-runs · mock-runs
    structure-sheet/    worksheet-page-view · (structure preview salvaged from the dead studio shell)
    data-viewer/        data-viewer/*   (already correct)
  assistant/            keep as-is (the reference layer)
  workspace/            copilot-workspace-panel · workflow-run-flow · document-viewer · google-source-picker · aside-thread · inline-field-card
  worksheet/            fapi-worksheet
  tax/                  ← tax-ui/pages/* + tax-ui/components/* folded in and TYPED
  overlays/ settings/ auth/ ui/   keep (feature-cohesive / reusable)

lib/
  kernel/               canonical vocabulary (see §5 — finish or demote, a product decision)
  workflow/
    domain/             ← promote src/domain/workflow/* ; + BLOCK_CATALOG etc. from local-fiscal-workflow
    runtime/            ← backend/runtime + backend/blocks ; local-tool-runner ; run engines converge here
    tools/              ← local-tool-registry split (types · engines · local-tools · backend-adapter · registry)
    persistence/        ← snapshot/publish/normalize from local-fiscal-workflow
    audit/              ← run-records ; workflow-logging
    fixtures/           ← sample-workflows/* ; demo builders ; sample datasets
    ai/                 ← local-ai-workflow-assistant split (ask · proposal-builders · graph-queries)
    validation/         ← pre-run-issues
    execution/          ← run-toolbar-workflow
    legacy-devkit/      ← workflow-executor.workflow · steps · condition-validator (Vercel devkit; quarantine)
  assistant-runtime/    KEEP — the reference pattern; nothing moves
  state/                ← workflow-store · chat-store · nav-store · workspace-store · page-*-store · work-store · keyword-rulebook-store
  parsing/              ← excel-utils.ts (moved out of a UI folder)
  tax/                  ← tax-ui/lib/{data,t1134Data}.ts
  google/ genui/ db/ ai-gateway/ worksheet-intel/   keep
  (root, cross-cutting) utils · fonts · constants · auth · api-client · resource-registry · agents · coworkers

DELETE (fully): src/ (contents promoted to lib/workflow/domain) · backend/ (folded into lib/workflow/runtime) ·
                tax-ui/ (folded into components/tax + lib/tax) · plugins/ (after template quarantine)
```

After this, a new engineer sees `app/` (routes), `components/` (UI, grouped by surface), `lib/` (logic, grouped by concern) — and nothing else at the root pretending to be a fourth architecture.

---

## 3. Phased roadmap

Each phase is independently shippable and leaves the app green. **Phase 0 is the high-value quick win** — it's what makes the app stop *looking* scaffolded, with near-zero risk.

### Phase 0 — De-vibe (verified-safe deletes + strip template chrome) · ~½ day · LOW risk

Two moves, both grep-verified against the whole repo (tracked + untracked + dynamic/string refs):

**0a. Delete the ~25 confirmed-dead files** (full list in Appendix A — all have **0 live importers**). Highlights:
- `lib/integrations/` (Vercel deploy REST client, 620 lines, 0 importers) → also lets you drop `@vercel/sdk` from `package.json`.
- `components/workflow/workflow-studio-shell.tsx` (**1,426 lines, dead** — superseded by `persistent-canvas`).
- Dead shells/orbs/sidebars: `ambient-orbs.tsx`, `inscope-home.tsx` + `inscope-sidebar.tsx`, `canvas-page-wrapper.tsx`, `action-orb.tsx` (already gone in working tree).
- Dead one-offs: `worksheet-page-menu.tsx`, `workspace/field-editor.tsx`, `assistant/scope-launchpad.tsx`, `worksheet/expense-worksheet.tsx`.
- `app/copilot-test/page.tsx` (its own header says *"Throwaway smoke-test page. Delete after."*).
- Dead `tax-ui/` leaves: `Map.tsx`, `const.ts`, `ManusDialog.tsx`, `ThemeContext.tsx`, `useMobile.tsx`, `useComposition.ts`, `OrbitalStage.tsx`, `pages/{Home,Workbench,NotFound,FapiWorksheet}.tsx` — **deleting `Map.tsx` + `const.ts` also erases ~12 of the legacy `tsc` errors for free** (the `google.maps` namespace and `import.meta.env` ones).
- Data cruft: `example-workflow.json`, `plugins/AGENTS.md`.
- `backend/runtime/runner.ts` (orphan wrapper); `backend/runtime/validation.ts` (verify no CI ref first).

**0b. Strip the visible template chrome** (2 render-site edits, then delete 4 files):
- Remove `DeployButton` + `GitHubStarsButton` from `workflow-toolbar.tsx:3103-3104` and the GitHub-stars provider from `layout.tsx`.
- Delete `components/deploy-button.tsx`, `components/github-stars-{button,loader,provider}.tsx`, `components/icons/github-icon.tsx`, `components/workflows/user-menu.tsx` (verify Settings is reachable another way — `user-menu` transitively opens the settings overlay).
- Rename the package in `package.json` from `ai-workflow-builder-template` to `taxflow-os`.

> ⚠️ **Do NOT delete `plugins/` or `scripts/discover-plugins.ts` here.** `discover-plugins` runs on every `pnpm dev`/`build` and *generates* `plugins/index.ts`, `lib/step-registry.ts`, `lib/codegen-registry.ts`, `lib/types/integration.ts`, which the live toolbar/canvas import. Removing them breaks the build. The plugin system is *inert-but-load-bearing* — it's quarantined in Phase 4, not here.

**Acceptance:** app builds & runs; Builder toolbar no longer shows Deploy/GitHub buttons; `tsc` error count drops by ~12; ~25 files and one dependency gone.

### Phase 1 — Stabilize vocabulary (kernel spec Step 1) · LOW–MED risk

Do the kernel spec's **Step 1** now if not already done: remove `"Protected"` as a family literal, drop `Field` from the workflow domain, reconcile subtypes, fix the `initiates` edge label. This gets `tsc` to **0 errors** and is the prerequisite for type-safe file moves. *(Per `MEMORY/kernel-migration`, Step 1 largely landed 2026-07-17 — confirm `pnpm type-check` is 0 and close any remainder.)*

### Phase 2 — Split the god-files · MED risk (well-scoped)

Split the 9 god-files into the modules mapped in **Appendix B**, each behind a **thin re-export barrel** at the original path so importers don't break. Order by leverage & safety:

1. `lib/local-ai-workflow-assistant.ts` (1,496 → 5 modules under `lib/workflow/ai/`) — **easy**, 1 importer.
2. `components/workflow/inspector/block-inspector.tsx` (1,798 → 9 modules) — **medium**, 1 importer.
3. `components/workflow/workspace/block-data-flow-pane.tsx` (2,090 → 10 modules under `outputs-panel/`) — **medium**.
4. `components/workflow/source-viewers/rule-source-editor.tsx` (2,352 → 10 modules) — **medium**.
5. `components/workflow/node-config-panel.tsx` (2,226 → inspector/* + ai-panel/*) — **hard**, 1 importer.
6. `components/overlays/configuration-overlay.tsx` (2,030 → inspector/* + runs/outputs panels) — **hard**; this is also where you **collapse the two inspector systems into one**.
7. `components/workflow/workflow-toolbar.tsx` (3,120 → palette/ + shell/ hooks) — **hard**; move `sidebarCollapsedAtom` to `lib/state/` first.
8. `lib/local-fiscal-workflow.ts` (5,855 → domain/persistence/audit/fixtures) — **hard**, 54 importers → barrel is mandatory.
9. `lib/local-tool-registry.ts` (5,907 → tools/ engines + registry) — **hard**, 7 importers → barrel.

**Acceptance after each file:** `tsc` 0; FAPI parity numbers unchanged (GROSS 25,000 sample / 147,322 real @ FX 1.3978); the file's barrel exports the same public surface.

### Phase 3 — Fold `tax-ui/` into the main tree and TYPE it · MED risk

After Phase 0 deletes the 13 dead `tax-ui` files, only 5 live pages + 5 live components remain (Surplus, T1134, ClientWorkspace, ExecutiveOverview, Dashboard — these have **no `components/` equivalent**, so tax-ui is their sole home).
- Move pages → `components/tax/pages/`, components → `components/tax/`, `lib/{data,t1134Data}.ts` → `lib/tax/`.
- Replace the ~6 `wouter` imports with `next/navigation` directly; delete `wouter-shim.tsx` and the `next.config` `wouter` alias and the `wouter` dependency.
- **Un-exclude from `tsconfig`.** The live files are clean (0 `any`, no `import.meta`); expect a *moderate* count of `strictNullChecks`/implicit-any fixes across ~3k lines, plus one `topojson` typing — tractable, not a rewrite.
- Repoint the `app/*` route wrappers and `resource-registry.tsx` `lazyPage()` entries atomically.

**Acceptance:** `tax-ui/` directory gone; all 5 worksheet routes render (verify Dashboard specifically — it already reaches into `neumorphic-sidebar` + `nav-store`); the 5 pages now type-check.

### Phase 4 — Collapse source roots & quarantine the template runtime · HIGH risk (do last, incrementally)

- **`src/` → `lib/workflow/domain/`:** promote `src/domain/workflow/*` to the single domain home; drop the ~40-line re-export shim in `local-fiscal-workflow.ts`; move `src/state/workflow-commands.ts` + `src/audit/*` alongside (they're wired into `workflow-store.ts`).
- **`backend/` → `lib/workflow/runtime/`:** keep it as the one deterministic engine but **fix the inverted layering** — make `backend/runtime/types.ts` import `WorkflowBlock/WorkflowDefinition` from the domain (not from `lib/local-fiscal-workflow`), and make `local-tool-registry` import `EvidenceRef/ToolRunResult/ToolDefinition` *from* runtime instead of re-declaring them. Target one direction: `domain ← runtime ← tools`.
- **Unify the two run engines:** the newer `lib/workflow-runs/` engine *wraps* the old `runLocalWorkflowTools` (`engine.ts:232`), so both must stay green; converge their types onto the kernel `WorkflowRun`/`NodeRun` (kernel spec Step 3), don't delete either.
- **Quarantine the Vercel template runtime:** move `workflow-executor.workflow.ts`, `lib/steps/`, `condition-validator.ts`, `workflow-codegen*`, `codegen-templates/`, `next-boilerplate/`, and the template `app/api/{workflows,integrations,ai,ai-gateway}/*` routes into `lib/workflow/legacy-devkit/` (or delete once you confirm no product UI calls those endpoints). Then refactor the ~25 `@/plugins` consumers off the plugin barrel and drop `discover-plugins` from `package.json` — at which point `plugins/` (103 files) can finally be deleted.

**Acceptance:** root has only `app/ components/ lib/` (+ config/docs/drizzle/e2e/public); one dependency direction; FAPI/Roulement parity intact.

---

## 4. Risk register & invariants

**Invariants that must not regress** (all currently proven):
- One parser, one engine → identical numbers across chat / builder / worksheet (`uploadedRowsAtom` + `runEditsAtom` + `runTemplateCore`).
- FAPI / Roulement Platform-math parity (`audit/FEATURES.md`).
- Evidence immutability + lineage propagation.
- localStorage key strings (`workflow-studio.local-workflow`, `workflow-studio.local-runs`, `taxflow:run-edits`, `inscope.fapi.values`) and the snapshot schema version are **user-data contracts** — rename modules freely, never rename the keys.

| Risk | Mitigation |
|---|---|
| High-fan-in moves (`local-fiscal-workflow` 54, `workflow-store` 55) touch ~100 sites | Barrel re-export at the old path; codemod imports in a later, separate pass |
| Two run engines share the old runner at runtime | Keep both green; converge *types* first, storage later (kernel Step 3) |
| Deleting the wrong "integrations" | `lib/integrations/` (dead Vercel client) ≠ `lib/integrations-store.ts` (LIVE) — different files; don't let a name-match cause collateral deletion |
| Collapsing the two inspectors | Behavior-parity check between overlay path and docked path before merging, not a blind move |
| Un-excluding `tax-ui` from `tsc` | Delete the dead `Map.tsx`/`const.ts` first (removes the hard legacy errors); fix the residual nullchecks incrementally |
| Uncommitted work clobbered by moves | Commit the untracked layers (`assistant-runtime/`, `kernel/`, `assistant/`) before Phase 2 |
| `lib/kernel/` decision | Product-direction call (§5) — don't silently delete a sanctioned plan; don't leave inert code masquerading as architecture |

---

## 5. The one open decision: `lib/kernel/`

`lib/kernel/` is 10 files of well-written canonical types that **nothing imports** (only `coworkers.ts` uses `ActorKind`). Two honest options:

- **(A) Finish the strangler-fig** — write the kernel-spec Step 3 adapters so `WorkflowRun`/`NodeRun` actually wrap `runLocalWorkflowTools` output, and something real imports `lib/kernel/`. This is the sanctioned direction (`kernel-migration-spec.md`).
- **(B) Demote it to `docs/`** as a design note until you're ready to execute Step 3, so the code tree contains only code that runs.

Recommended: **(A)**, because the kernel *is* the thing that makes the folder targets above stable — but decide explicitly rather than leaving it in limbo.

---

## Appendix A — Verified delete list (Phase 0)

All grep-verified with **0 live importers** across tracked + untracked + dynamic/string references. Update the stale `audit/*.md` mentions when you delete (per the repo's audit-maintenance rule).

| Path | Notes |
|---|---|
| `lib/integrations/` (`vercel.ts`) | Vercel deploy client; also drop `@vercel/sdk` dep |
| `components/workflow/workflow-studio-shell.tsx` | **1,426 lines, dead**; salvage the structure-preview into `structure-sheet/` first |
| `components/ambient-orbs.tsx` | dead orb |
| `components/inscope-home.tsx` + `components/inscope-sidebar.tsx` | delete together (home is sidebar's only importer) |
| `components/canvas-page-wrapper.tsx` | dead wrapper |
| `components/action-orb.tsx` | already removed in working tree |
| `components/workflow/worksheet-page-menu.tsx` | `[PARTIAL]`, never wired |
| `components/workspace/field-editor.tsx` | superseded by `InlineFieldCard` |
| `components/assistant/scope-launchpad.tsx` | parked dead (keep only if reviving a launchpad) |
| `components/worksheet/expense-worksheet.tsx` | verify against `resource-registry` `expense` page first |
| `app/copilot-test/page.tsx` | self-labeled throwaway |
| `backend/runtime/runner.ts` | orphan wrapper |
| `backend/runtime/validation.ts` | orphan smoke harness (confirm no CI ref) |
| `tax-ui/pages/{FapiWorksheet,Home,Workbench,NotFound}.tsx` | dead; FAPI dup superseded by `components/worksheet/fapi-worksheet.tsx` |
| `tax-ui/components/{Map,ManusDialog,OrbitalStage}.tsx` | dead; `Map.tsx` deletion also clears legacy `tsc` errors |
| `tax-ui/contexts/ThemeContext.tsx` | dead (app uses `next-themes`) |
| `tax-ui/hooks/{useMobile,useComposition}.tsx?` | `useMobile` dups root `hooks/use-mobile.ts` |
| `tax-ui/const.ts` | Vite-era `import.meta.env` login code; deletion clears `tsc` errors |
| `example-workflow.json`, `plugins/AGENTS.md` | template data/doc cruft |

**Template chrome to unwire then delete:** `components/deploy-button.tsx`, `components/github-stars-{button,loader,provider}.tsx`, `components/icons/github-icon.tsx`, `components/workflows/user-menu.tsx`.

**Verify-before-deleting (defaulted to KEEP):** `vercel-template.json` (may be a Vercel *platform* config, not code), `tax-ui/components/ErrorBoundary.tsx`, `app/genui-lab/page.tsx` + `app/api/genui` (only if GenUI is fully folded into the assistant — the render bridge still uses `/api/genui`).

## Appendix B — God-file split map (Phase 2)

Each original path becomes a thin barrel (except `block-inspector.tsx`, which stays as its own orchestrator).

| God-file | Lines | Imp. | Split into (target folder → # modules) |
|---|--:|--:|---|
| `lib/local-tool-registry.ts` | 5,907 | 7 | `lib/workflow/tools/` → 11 (types · sample-data · runtime-helpers · keyword-mapper-engine · numeric-engine · finality-engine · preview-builders · io-roles · local-tools · backend-adapter · registry) |
| `lib/local-fiscal-workflow.ts` | 5,855 | 54 | `lib/workflow/{domain,persistence,audit,fixtures}/` → 10 (block-catalog-runtime · fiscal-presets · block-factory · edge-model · canvas-conversion · runtime-ui · normalize · local-snapshot · run-records · fixtures) |
| `components/workflow/workflow-toolbar.tsx` | 3,120 | 1 | `palette/` + `shell/` + `lib/workflow/{validation,execution}/` → 9 (pre-run-issues · workbook-import-patch · run-toolbar-workflow · use-workflow-state · use-workflow-actions · template-loaders · toolbar-buttons · local-studio-top-bar · source-catalog-defaults) |
| `source-viewers/rule-source-editor.tsx` | 2,352 | 6 | `sources-panel/` → 10 (rule-config-accessors · aggregation-operands · aggregation-draft · keyword-rule-draft · rule-tables · rulebook-shared-ui · keyword/aggregation editors · calculator-builder · viewer dispatcher) |
| `node-config-panel.tsx` | 2,226 | 1 | `inspector/*` + `ai-panel/*` → 13 (inspector-panel · multi-selection · edge/workspace/node-identity/block panels · 4 hooks · utils · RightAiContextPanel) |
| `overlays/configuration-overlay.tsx` | 2,030 | 6 | `inspector/*` + `runs/outputs/sources panels` → 10; **merge with the docked inspector here** |
| `inspector/block-inspector.tsx` | 1,798 | 1 | stays orchestrator + 8 modules (output-helpers · primitives · configure/connections/advanced sections · 2 family-editors · last-run-section) |
| `workspace/block-data-flow-pane.tsx` | 2,090 | 5 | `outputs-panel/` → 10 (types · config-preview · run-status · source-artifact-groups · flow-groups · calculation-terms · output-role-card · large-viewer · calc-input-panels · column orchestrator) |
| `lib/local-ai-workflow-assistant.ts` | 1,496 | 1 | `lib/workflow/ai/` → 5 (actions · graph-queries · ask · proposal-builders · proposal-assembler) |

---

*Total immediate win (Phase 0): ~25 files + 1 dependency deleted, template chrome gone, ~12 `tsc` errors cleared — the app stops looking scaffolded in under a day. The remaining phases convert five competing roots into three clean ones without a rewrite.*
