# TaxflowOS Folder Reorganization Plan

*Reorg architect synthesis. Grounded in the zone maps, the six dimension findings, and direct reads of `tsconfig.json`, `next.config.ts`, `package.json`, `scripts/discover-plugins.ts:30-44`, and `app/api/workflows/[workflowId]/download/route.ts:13-16`.*

---

## 0. Guiding principles (read first)

1. **Relocate ≠ decompose.** The two ~5,900-line god files and the six >1,700-line UI god files are moved *whole* first (pure `git mv`, history-preserving, near-zero risk), and split *later* as isolated refactors once the folder boundary exists. Never do both in one commit — you lose the ability to bisect.
2. **`@/*` maps to repo root** (`tsconfig.json:25`), so *any* new top-level dir still resolves through `@/`. Moving a file only changes its import *specifier* (`@/components/workflow/x` → `@/features/workflow-builder/ui/x`), never its resolvability. A scripted codemod handles specifiers per move.
3. **`app/` is pinned.** App Router routes must physically stay under `app/`. Every mini-app's routes become *thin adapter* `page.tsx` files under `app/` that import the real surface from `features/<app>/`. This is already the de-facto pattern (`app/surplus/page.tsx` is 11 lines).
4. **Type-check is the gate — but it is half-blind.** `tsc --noEmit` is green *only over the typed subset*; `tax-ui/**` is excluded (`tsconfig.json:43`) yet dynamically imported into the shipped bundle in 6 places. Any step touching tax-ui needs a *second* loose tsconfig as its gate (see §5).
5. **Delete before you move.** ~5,173 LOC is provably dead (0 importers). Deleting first shrinks everything you subsequently relocate.

---

## 1. Target top-level structure

```
app/                      # Next.js routes ONLY — thin adapters that import from features/*  (HARD constraint)
  api/                    # 36 handlers stay here; thinned into adapters calling platform/*

features/                 # the UI-bearing mini-apps
  workflow-builder/
    ui/                   # <- components/workflow/** , builder-specific components/overlays/** , components/ai-elements/**
    engine/  ............ # (see note) OR promoted to shared/workflow-engine
    execution/            # <- backend/blocks/** + backend/runtime/**
  worksheets/
    components/           # <- components/worksheet/** + the ported tax-ui worksheet pages
    intel/                # <- lib/worksheet-intel/** + assistant/worksheet-copilot (one home for the feature)
    primitives/           # extracted money/rate/editable-cell helpers
  assistant/
    runtime/              # <- lib/assistant-runtime/**  (pure, server-only, tested 118/118)
    ui/                   # <- components/assistant/** + chat-rendering files pulled OUT of components/workspace/**
  genui/                  # <- lib/genui/** + components/assistant/genui-render.tsx + scripts/gen-genui-prompt.cjs

shared/                   # cross-cutting, non-route code every mini-app imports
  workflow-engine/        # <- workflow-engine zone: src/domain, src/state, lib/workflow-store, lib/workflow-runs, lib/steps, codegen, samples
  kernel/                 # <- lib/kernel/**  (frozen canonical vocabulary; quarantined until wired)
  ui/                     # <- components/ui/** (shadcn primitives) + app/globals.css split + scope-orb + theme-toggle
  app-shell/              # <- app/layout providers, app-shell, global-top-nav, neumorphic-sidebar, client-switcher
  stores/                 # <- nav-store, workspace-store, page-menu-store, chat-store, inline-page-context, resource-registry

platform/                 # back-of-house server spine
  db/                     # <- lib/db/** + drizzle/**  (migrations)
  auth/                   # <- lib/auth.ts + components/auth/**
  integrations/           # <- lib/google, lib/ai-gateway, credential encryption extracted from lib/db/integrations.ts
  api-client.ts           # <- lib/api-client.ts

integrations/             # the plugin system — KEEP AT plugins/ or rename with care (discover-plugins has hardcoded paths)
services/                 # standalone services
  mapping-agent/          # <- services/mapping-agent/** (already standalone: own tsconfig, zero repo deps)
templates/
  next-project/           # <- lib/next-boilerplate/** (runtime file-copy template for the download route)
```

**Note on `workflow-builder/engine` vs `shared/workflow-engine`:** the workflow engine is imported by three *different* mini-apps without going through the builder UI (`workflow-store` has 46 importers; worksheets use `lib/workflow-runs` `runTemplateCore`; the assistant uses `workflow-runs` + `local-fiscal-workflow`). **Promote it to `shared/workflow-engine/`**, not `features/workflow-builder/engine/` — otherwise worksheets and assistant would depend on the builder feature folder, recreating the coupling you are trying to break. This is the single most important structural call in the plan.

---

## 2. Mapping table

### 2a. Zone-level moves

| # | Current path / glob | Files / LOC | Proposed location | Mechanic |
|---|---|---|---|---|
| 1 | `lib/genui/**` + `components/assistant/genui-render.tsx` + `scripts/gen-genui-prompt.cjs` | 3 + 2 / ~500 | `features/genui/` | `git mv`; keep thin shim at `app/api/genui/route.ts` + `app/genui-lab/page.tsx` |
| 2 | `services/mapping-agent/**` | 20 / ~1,300 | `services/mapping-agent/` (rename only if desired) | already isolated (own `tsconfig.json`, zero repo deps) — near-noop |
| 3 | `components/ui/**` (primitives only) + `app/globals.css` + `scope-orb.tsx` + `theme-toggle.tsx` | ~25 / ~2.5k | `shared/ui/` | `git mv`; **split domain widgets out first** (see 2c row A) |
| 4 | `app/layout.tsx` providers + `app-shell.tsx` + `global-top-nav.tsx` + `neumorphic-sidebar.tsx` + `global-client-switcher.tsx` | ~10 / ~1k | `shared/app-shell/` (`layout.tsx` re-exports from here) | `git mv` |
| 5 | `lib/nav-store`, `workspace-store`, `page-menu-store`, `chat-store`, `inline-page-context`, `resource-registry.tsx` | 6 / ~1k | `shared/stores/` | `git mv` + codemod |
| 6 | `src/domain/**`, `src/state/**`, `src/audit/**`, `src/runtime/**` | ~20 | `shared/workflow-engine/{domain,state,audit,runtime}/` | `git mv` — **make `src/domain` the single source of truth** |
| 7 | `lib/workflow-store.ts`, `lib/workflow-runs/**`, `lib/steps/**`, `lib/workflow-executor.workflow.ts`, `lib/workflow-logging.ts` | ~20 | `shared/workflow-engine/{state,runtime}/` | `git mv` + codemod (46 importers of workflow-store) |
| 8 | `lib/workflow-codegen*.ts`, `lib/workflow-codegen-shared.ts`, `lib/codegen-templates/**`, `lib/codegen-registry.ts` | ~8 | `shared/workflow-engine/codegen/` | `git mv`; **update `download/route.ts:16` `CODEGEN_TEMPLATES_PATH`** |
| 9 | `lib/workflow/sample-workflows/**` + demo factories extracted from god file | 6 + | `shared/workflow-engine/templates/` | `git mv` |
| 10 | `backend/blocks/**` + `backend/runtime/**` | 11 modules / ~7k | `features/workflow-builder/execution/{blocks,runtime}/` | `git mv`; update `scripts/smoke-fapi-*.ts` + `lib/local-tool-registry` importer |
| 11 | `plugins/**` (14 plugins + registry) | 103 / ~9.8k | **keep at `plugins/`** (or `integrations/` only if you update all hardcoded paths — see §4) | leave in place; move `registry.ts` *types* to `shared/kernel/types` |
| 12 | `components/workflow/**`, `components/ai-elements/**`, builder-specific `components/overlays/**` | ~100 / ~40k | `features/workflow-builder/ui/{canvas,inspector,config,viewers,toolbar,nodes}/` | `git mv` + codemod |
| 13 | generic `components/overlays/{overlay-provider,overlay-container,overlay,types,header,footer,sync}` | 7 | `shared/ui/overlays/` (app-wide infra, not builder-specific) | `git mv` |
| 14 | `components/worksheet/**` + `lib/worksheet-intel/**` | 11 / ~1.2k | `features/worksheets/{components,intel}/` | `git mv` + move `worksheet-copilot` here |
| 15 | `tax-ui/**` (island) | 27 / 10,412 | `features/worksheets/legacy/` → then port to typed `features/worksheets/components/` | **special sequence — see §3 & §6 step 8** |
| 16 | `lib/assistant-runtime/**` | 18 / ~2.3k | `features/assistant/runtime/` | `git mv` + update `app/api/copilotkit/route.ts`, `assistant:evals` script |
| 17 | `components/assistant/**` + chat-rendering from `components/workspace/**` | ~29 / ~6.2k | `features/assistant/ui/{thread,instruments,panels}/` | `git mv`; **split the workspace/assistant boundary** (see zone smells) |
| 18 | `lib/db/**`, `drizzle/**`, `lib/auth.ts`, `components/auth/**`, `lib/api-client.ts`, `lib/google/**`, `lib/ai-gateway/**` | ~40 | `platform/{db,auth,integrations}/` + `platform/api-client.ts` | `git mv`; thin the 36 `app/api/**` handlers into adapters |
| 19 | `lib/kernel/**` | 12 / 596 | `shared/kernel/` | `git mv`; add to knip ignore (1 real importer: `lib/coworkers.ts`) |
| 20 | `lib/next-boilerplate/**` | 18 | `templates/next-project/` | `git mv`; **update `download/route.ts:13` `BOILERPLATE_PATH`** + `tsconfig` exclude |

### 2b. Cross-zone fixes folded into the move (layer inversions)

| Problem | Current | Fix during move |
|---|---|---|
| `lib/workflow-runs/parse-upload.ts` imports UI leaf `components/workflow/source-viewers/excel-utils.ts` (1,765 LOC) | UI depends-on inversion | Move `excel-utils.ts` → `shared/workflow-engine/parsing/excel/` (it is pure logic); builder UI imports it *from* engine |
| Assistant reaches workflow types via `lib/local-fiscal-workflow` re-export shim (0 files import `src/domain` directly) | laundered types | Repoint `builder-copilot.tsx` etc. to `@/shared/workflow-engine/domain` |
| `components/ui/` holds ~2,060 LOC of workflow/integration widgets | design-system pollution | Row A below |

### 2c. Notable god-file / mis-filed splits (do AFTER the folder move lands)

| Row | Source god-file | LOC | Split into |
|---|---|---|---|
| A | `components/ui/{template-badge-input,template-badge-textarea,template-autocomplete,workflow-icon}` + `integration-selector` + `integration-icon` | ~2,060 | domain widgets → `features/workflow-builder/ui/inputs/`; integration widgets + `components/settings/integrations-manager` → `plugins/` UI or `platform/integrations/ui/` |
| B | `lib/local-tool-registry.ts` | 5,906 | `shared/workflow-engine/registry/{types, helpers/*, roles, evidence/{z,expanded,generic}, backend-adapter, tools/*}` + thin index (collapse 3 near-duplicate evidence builders to one strategy) |
| C | `lib/local-fiscal-workflow.ts` | 5,854 | `shared/workflow-engine/{block-catalog, edges, canvas-mapping, persistence}` + `templates/*`; **delete the domain re-export barrel** (import `src/domain` directly at ~54 call sites) |
| D | `components/workflow/workflow-toolbar.tsx` | 3,119 | executor → `engine/runtime`; validators → `engine/validation`; 3 hooks → `hooks/`; 12 buttons → `ui/toolbar/*` |
| E | `components/workflow/node-config-panel.tsx` (PanelInner ~1,850-line fn) | 2,225 | `ui/config/sections/*.tsx` dispatched by block subtype; **or delete if `/workflows/[workflowId]` route is deprecated in favor of `configuration-overlay`** |
| F | `components/overlays/configuration-overlay.tsx` + `inspector/block-inspector.tsx` + `workspace/block-data-flow-pane.tsx` | ~5.9k | shared `ui/lib/{block-kinds,block-outputs}.ts` (removes ~500+ duplicated helper LOC across the trio) |
| G | `backend/.../hierarchy-aggregator/run.ts` + `calculation-engine/run.ts` | 2,210 | extract `execution/runtime/formula-expression.ts` (tokenizer/RPN/evaluator duplicated verbatim) |
| H | `lib/local-ai-workflow-assistant.ts` | 1,496 | `shared/workflow-engine/assistant/{ask/*, proposals/*}` |

---

## 3. Special hazards — explicit handling

**H1 — `tax-ui/**` is an untyped, bidirectionally-coupled island.**
- Excluded from `tsconfig.json:43`; aliased via `@tax/*` (`tsconfig.json:26`); `wouter` webpack-aliased to `tax-ui/wouter-shim.tsx` (`next.config.ts:15`).
- **Real import cycle:** `lib/resource-registry.tsx` lazy-imports `@tax/pages/*` **and** `tax-ui/pages/FapiWorksheet.tsx:11` imports `@/lib/resource-registry`. All 14 seam edges are untyped.
- **Handling (in order):** (a) delete the dead island first — `FapiWorksheet.tsx` (1,076, dead duplicate), `Workbench/Home/NotFound/OrbitalStage/Map/…` (~2,751 LOC total) — which *also breaks the cycle* (the cycle runs through the now-deleted `FapiWorksheet`). (b) Extract the atoms tax-ui legitimately needs (`fieldValuesAtom`, `isEditableField`, `nav-store`, `chat-store`) into a **typed one-way contract module** in `shared/stores/`. (c) Move the island to `features/worksheets/legacy/`, updating the `@tax/*` alias target and the `next.config.ts:15` wouter path. (d) Port the 5 live pages (`Surplus`, `T1134`, `Dashboard`, `ExecutiveOverview`, `ClientWorkspace`) to typed components and **retire `@tax/*` + the wouter shim** as the last step. Until (d), gate tax-ui with a loose `tsconfig.tax-ui.json` (§5).

**H2 — `plugins/**` is load-bearing via codegen with hardcoded paths.**
- `scripts/discover-plugins.ts` scans `plugins/` (`:30`) and *writes* to hardcoded paths: `plugins/index.ts` (`:31`, committed), `lib/step-registry.ts` (`:33`), `lib/codegen-registry.ts` (`:39`), `lib/output-display-configs.ts` (`:34-38`), `lib/types/integration.ts` (`:32`), `README.md` (`:40`) — the last three gitignored/regenerated. It runs before every `dev`/`build` (`package.json:8-9`).
- **Handling:** **Keep `plugins/` at repo root** through the entire migration — it is the lowest-value / highest-blast-radius folder to move (30+ importers + 6 hardcoded string paths + generated-file coupling). Only its *shared types* move (`registry.ts` types → `shared/kernel/types`) so UI consumers stop importing the registry runtime. If you later rename to `integrations/`, it is a *dedicated* step that updates all 6 `join(process.cwd(), …)` constants, the generated output paths, and the `require("../plugins/…")` specifiers together, gated by a full `discover-plugins && type-check` run.

**H3 — `components/ui/` is the shared design system, polluted with domain widgets.**
- ~2,060 LOC (`template-badge-*`, `template-autocomplete`, `integration-selector`, `integration-icon`, `workflow-icon`) import `lib/workflow-store`, `@/plugins`, `components/overlays` — so the "design system" depends on two mini-apps.
- **Handling:** split *before* moving `ui/` to `shared/ui/` (row A). Primitives (button ×39, input ×26, dialog, select…) go to `shared/ui/`; domain widgets go to their owning feature. This makes `shared/ui/` genuinely portable and dependency-free. Also delete the 5 unused primitives (`collapsible, context-menu, drawer, resizable, sheet`) + their radix deps.

**H4 — the two ~5,900-line god files.**
- `local-tool-registry.ts` (5,906; 98% inline catalog data) and `local-fiscal-workflow.ts` (5,854; 4 fused jobs, ~54 importers).
- **Handling:** move whole into `shared/workflow-engine/` (rows in 2a). Split *after* (rows B/C). The highest-leverage sub-step is deleting `local-fiscal-workflow`'s domain re-export barrel and repointing ~54 importers to `src/domain` — this alone removes the "two sources of truth for the same types" defect and shrinks the most-imported file's blast radius.

---

## 4. tsconfig / config changes required

| File | Change |
|---|---|
| `tsconfig.json:24-27` | Add readable per-area aliases so future moves change *one line*, not every import: `"@engine/*": ["./shared/workflow-engine/*"]`, `"@shared/*": ["./shared/*"]`, `"@platform/*": ["./platform/*"]`, `"@wb/*": ["./features/workflow-builder/*"]`, `"@assistant/*"`, `"@worksheets/*"`. Keep `@/*` as the fallback. |
| `tsconfig.json:26` | Update `@tax/*` target when the island moves (`./features/worksheets/legacy/*`); **remove entirely** after the port (H1-d). |
| `tsconfig.json:40-43` | Update excludes: `lib/next-boilerplate` → `templates/next-project`; `tax-ui/**` → new legacy path. |
| **new `tsconfig.tax-ui.json`** | `{ extends, strict:false, noImplicitAny:false, include:["<island path>/**/*"] }` + `agent:type-check`-style script — gives the untyped island a *loose* gate so its moves don't silently break the shipped bundle. |
| `next.config.ts:15` | Update the `wouter` alias path when tax-ui moves; delete the alias after the wouter shim is retired. |
| `app/api/workflows/[workflowId]/download/route.ts:13,16` | Update `BOILERPLATE_PATH` → `templates/next-project` and `CODEGEN_TEMPLATES_PATH` → `shared/workflow-engine/codegen/templates` when those move. |
| `.gitattributes` (**new**) | `* text=auto eol=lf` — deterministic line endings (`core.autocrlf=true`, no `.gitattributes` today) so `pnpm check`/`fix` and the codemods don't churn CRLF across every moved file. Renormalize with `git add --renormalize .` **before** starting moves. |
| `biome.jsonc` | Demote noisy stylistic rules (`useSortedClasses`, `useSortedAttributes`, `useBlockStatements`, `useNumericSeparators`) to warnings **or** bulk-`fix` to zero — the `check` gate currently fails with ~3,500 AST-level errors, so the CI gate between steps is meaningless until fixed. |
| `knip.json` (**new**) | Declare entry points (`app/**/route.ts`, plugin steps, `scripts/*`), `ignoreDependencies` (postcss), `ignore` (`shared/kernel/**`, `templates/next-project/**`) so knip becomes an actionable dead-code gate for the cleanup step. |

---

## 5. Incremental migration sequence (ordered by value ÷ risk)

Each step ends with the **gate**: `pnpm type-check` **must** stay green (0 errors), plus `pnpm discover-plugins` for any plugin-adjacent step, plus the e2e smoke (`test:e2e`, 16 tests) at phase boundaries. One mini-app per step; commit per `git mv`+codemod pair.

**Phase 0 — Make the ground safe (no moves).**
0a. Add `.gitattributes` + `git add --renormalize .`. 0b. Fix the `check` gate (`biome.jsonc` demote/fix) so it is green. 0c. Wire `knip.json`. 0d. **Delete ~5,173 LOC of confirmed dead code** (`workflow-studio-shell.tsx` 1,426; the 9-file orphan cluster; the 3 dead island pages; dead assistant-runtime barrels; `lib/utils/template.ts`; `lib/integrations/vercel.ts` 671; 5 unused ui primitives + deps). Gate: type-check + knip clean + e2e.
*Value: highest. Risk: low. Every later step now moves less code against a trustworthy gate.*

**Phase 1 — Establish the pattern on the two safest zones. ✅ DONE 2026-07-21.**
1. **genui** (row 1): ✅ `git mv`'d `lib/genui/{library.tsx,system-prompt.txt}` + `components/assistant/genui-render.tsx` + `scripts/gen-genui-prompt.cjs` → `features/genui/`. Repointed 6 references (`app/genui-lab/page.tsx`, `use-assistant.tsx`, `genui-render.tsx`, the route's `readFileSync` path, the generator's output path, `package.json` `genui:prompt`). Regenerated `system-prompt.txt` from the new location (byte-identical) to prove the build step still works. Routes stayed in `app/`, importing `@/features/genui/*`.
2. **mapping-agent** (row 2): ✅ verified already at its target `services/mapping-agent/` with **0 `@/` repo imports** and its own tsconfig — no move needed.
*Gates passed: `tsc --noEmit` 0 source errors; `tsc -p services/mapping-agent/tsconfig.json` 0 errors; `pnpm genui:prompt` reproduces the prompt.*

**Phase 2 — Stand up the shared foundation (everything depends on it). 🟡 IN PROGRESS.**
3. **`shared/ui/`** — ✅ **DONE 2026-07-21.** `git mv components/ui → shared/ui` (31 files). Codemod repointed **59 files / 153 `@/components/ui/` occurrences** → `@/shared/ui/`, plus 3 relative `../ui/` imports, plus the 2 untyped `tax-ui/` seam imports (`AppShell` tooltip, `ClientWorkspace` tabs). Updated `components.json` `ui` alias → `@/shared/ui` and `biome.jsonc` exclude `!components/ui` → `!shared/ui`. Gate: `tsc --noEmit` exit 0, 0 errors. **Deferred within this step:** the row-A domain-widget split (5 polluted files: `integration-icon/-selector`, `template-badge-input/-textarea`, `template-autocomplete`) — they moved *with* the primitives and remain in `shared/ui/` to be split into their feature homes in Phase 4; the `globals.css` split, `scope-orb`, `theme-toggle`, and generic overlays were **not** moved (they collide with the active Neumorphic redesign).
4. **`shared/stores/`** (row 5) — ✅ **DONE 2026-07-21.** `git mv` `lib/{nav-store,workspace-store,page-menu-store,chat-store,inline-page-context,resource-registry}` → `shared/stores/` (6 files). Codemod repointed **29 files / 42 `@/lib/<store>` occurrences** → `@/shared/stores/<store>`, plus 2 relative imports inside `workspace-store.ts` (`./workflow-runs/engine`, `./coworkers` → `@/lib/...`), plus the 2 untyped `tax-ui/` seam imports (`Dashboard.tsx`: nav-store + inline-page-context). The Phase-0 `FapiWorksheet.tsx` deletion had already broken the old `tax-ui ↔ resource-registry` cycle, so resource-registry moved cleanly (its `@tax/pages/*` lazy imports are unaffected — `@tax` alias unchanged). Gate: `tsc --noEmit` exit 0, 0 errors.
4b. **`shared/app-shell/`** (row 4) — ⏸️ **DEFERRED.** `app-shell.tsx`/`neumorphic-sidebar.tsx`/`global-top-nav.tsx`/`globals.css` are the live Neumorphic redesign surface (collision risk). Do this once the redesign settles.
*Gate: type-check. This is broad but mechanical; do it before the mini-apps so their imports land on stable shared paths.*

**Phase 3 — Extract the headless engine (the real core). 🟡 IN PROGRESS (step 1 of ~5 done).**
5. Move `src/**` + `lib/workflow-*` + `lib/steps` + `lib/workflow-runs` + codegen + samples → **`shared/workflow-engine/`** (rows 6–9). Fix the `excel-utils` inversion (2b) in the same phase. Update `download/route.ts:16`.

- ✅ **Step 1 DONE 2026-07-21 — `src/** → shared/workflow-engine/`** (the canonical domain model; establishes the `{domain,state,audit,runtime}` structure the rest drops into). 13 files moved; codemod `@/src/` → `@/shared/workflow-engine/` (14 files/25 occ) + relative `../src/` in the 3 god files (3 files/11 occ). Gate: `tsc --noEmit` exit 0. **⚠️ Windows/dev-server lock hazard:** `git mv src` failed mid-operation because the running Turbopack dev server held handles on the hot `src/domain` files — recovered by moving subdirs/files individually with retry. **The remaining (larger) sub-steps below MUST be run with the dev server stopped.**
- ✅ **Step 2 DONE 2026-07-21 (dev server stopped)** — `lib/workflow-store` → `engine/state/`; `lib/workflow-runs/`, `lib/workflow-executor.workflow.ts`, `lib/workflow-logging.ts` → `engine/runtime/`. Codemod + fixed 30 cross-boundary relative imports (surfaced by tsc). *(`lib/steps` NOT moved — see Step 3 deferral.)* `parse-upload → excel-utils` inversion **not yet fixed** (excel-utils moves in Phase 4). tsc exit 0.
- ✅ **Step 4 DONE 2026-07-21** — `lib/workflow/sample-workflows/**` → `shared/workflow-engine/templates/sample-workflows/`. tsc exit 0.
- ✅ **Step 5 DONE 2026-07-21** — the 4 god files moved WHOLE (`local-fiscal-workflow`, `local-tool-registry`, `local-tool-runner`, `local-ai-workflow-assistant`) → `shared/workflow-engine/` root (intact; decomposed in Phase 9). tsc exit 0. **`discover-plugins` re-verified** (regenerates `lib/codegen-registry.ts` — 36 templates — and `lib/step-registry.ts` fine; those reference `@/plugins/*/steps`, not moved code).
- ✅ **Step 3 DONE 2026-07-21 (dev server stopped)** — `lib/steps` → `engine/runtime/steps/` (7 files, 37 importers incl. ~40 plugin steps); `lib/workflow-codegen{,-shared,-sdk}` → `engine/codegen/`; `lib/codegen-templates/` → `engine/codegen/codegen-templates/`. Codemod (42 files/48 occ) + fixed 4 relative imports in the moved steps files (`../utils`, `../credential-fetcher`, `../../plugins/*` → aliases). **Updated `download/route.ts:16` `CODEGEN_TEMPLATES_PATH`** → new path. Confirmed the **generated** `lib/step-registry.ts`/`lib/codegen-registry.ts` import only `@/plugins/*/steps` (never `lib/steps`/`codegen-templates`), so they stay at `lib/` and regenerate cleanly (`discover-plugins` re-verified, 36 templates). tsc exit 0. `lib/` is now free of all engine pieces.
- **Engine now COMPLETE:** `shared/workflow-engine/{domain(9),state(2),audit(2),runtime(steps 7 + workflow-runs 9 + 3),codegen(6),templates(6)}` + 4 god files = **48 files**. *(Runtime verification of the workflow-download feature still pending — its codegen-templates path is read at request time, not type-checked.)*
*Highest-blast-radius phase. Gate each step: type-check (+ e2e when the app runs).*

**Phase 4 — Move the builder UI + execution onto the engine.**
6. `components/workflow/**` + `ai-elements` + builder overlays → **`features/workflow-builder/ui/`** (row 12).
7. `backend/**` → **`features/workflow-builder/execution/`** (row 10); update smoke scripts + `local-tool-registry` importer.
*Gate: type-check + `workflow.spec.ts`.*

**Phase 5 — Worksheets consolidation (the risky untyped seam).**
8. (a) delete dead island files (breaks the cycle); (b) extract the typed contract module; (c) move in-app worksheets + `worksheet-intel` + `worksheet-copilot` → `features/worksheets/` (row 14); (d) move the island → `features/worksheets/legacy/`, updating `@tax/*` + `next.config.ts:15`; (e) *follow-up increment:* port the 5 live island pages to typed components, retire `@tax/*` + wouter shim.
*Gate: type-check **+ `tsconfig.tax-ui.json` loose check** (the main gate is blind here) + e2e. Do steps a–d before touching the harder port (e).*

**Phase 6 — Assistant.**
9. `lib/assistant-runtime/**` → `features/assistant/runtime/`; `components/assistant/**` + chat-rendering pulled out of `components/workspace/**` → `features/assistant/ui/`. Update `app/api/copilotkit/route.ts` + `assistant:evals` script path.
*Gate: type-check + `assistant:evals` (must stay 118/118) + `deep-chat.spec.ts`.*

**Phase 7 — Platform spine + boilerplate template.**
10. `lib/db`, `lib/auth`, `components/auth`, `lib/api-client`, `lib/google`, `lib/ai-gateway` → `platform/**` (row 18); thin the 36 `app/api/**` handlers into adapters. Move `lib/next-boilerplate` → `templates/next-project`, updating `download/route.ts:13` + tsconfig exclude. Move `lib/kernel` → `shared/kernel` (row 19).
*Gate: type-check + full e2e + a manual workflow-download smoke (the boilerplate move is runtime-path, not type-checked).*

**Phase 8 — plugins (optional, last, dedicated).**
11. Only if renaming `plugins/` → `integrations/`: update all 6 hardcoded constants in `discover-plugins.ts:30-44`, the generated output paths, and the `require("../plugins/…")` specifiers atomically. Gate: `discover-plugins && type-check && build`.

**Phase 9 — Decompose the god files** (rows B–H) as independent refactors, now that boundaries exist. Not blocking; sequence by pain.

---

## 6. What breaks, and how each is de-risked

| Break | Trigger | De-risk |
|---|---|---|
| Thousands of `@/…` import specifiers | every move | scripted codemod (ts-morph or `rg`+`sed`) in the same commit as `git mv`; per-area tsconfig aliases (§4) shrink future churn |
| `discover-plugins.ts` writes to wrong paths / regenerated files drift | moving `plugins/` or the generated `lib/step-registry.ts` etc. | keep `plugins/` in place (Phase 8 is optional & isolated); run `discover-plugins` in every plugin-adjacent gate |
| Workflow **download** feature (copies `next-boilerplate` + `codegen-templates` as raw files) | moving those dirs | update `download/route.ts:13,16`; boilerplate is **not** type-checked → manual download smoke at Phase 7 |
| tax-ui runtime breakage invisible to `tsc` | any island move | `tsconfig.tax-ui.json` loose gate + e2e on `/surplus`,`/t1134`,`/dashboard` |
| wouter resolution | tax-ui move | update `next.config.ts:15` path; only remove the alias after the shim is retired (Phase 5e) |
| CopilotKit route / evals path | assistant move | update `app/api/copilotkit/route.ts` + `assistant:evals` script; evals must stay 118/118 |
| CRLF noise swamping codemod diffs | Windows `core.autocrlf=true`, no `.gitattributes` | Phase 0a normalization before any move |
| CI gate gives false signal between steps | `pnpm check` ~3,500 errors today | Phase 0b fixes the gate first — otherwise "type-check green" between steps is unverifiable |

---

## 7. Priority summary (value ÷ risk, descending)

1. **Phase 0** — delete dead code + fix gates + `.gitattributes`. Massive cleanup, near-zero risk, makes every later gate trustworthy.
2. **Phase 1–2** — genui, mapping-agent, shared foundation. Low risk, unblocks everything, sets the pattern.
3. **Phase 3** — `shared/workflow-engine/`. Highest structural value (kills the "two sources of truth" + the UI→lib inversion); highest blast radius → most careful codemod.
4. **Phase 4** — builder UI + execution onto the engine.
5. **Phase 6–7** — assistant + platform. Medium risk, well-typed, good tests.
6. **Phase 5** — worksheets/tax-ui. Deferred despite mid-list value because it is the only untyped, cyclic, dual-router seam; do it after the typed foundation is stable so the loose gate is the *only* unknown.
7. **Phase 8–9** — plugins rename (optional) + god-file decomposition. Pure follow-ups; no dependency blocks them.

**Files/paths a caller of this plan will need to touch first:** `tsconfig.json:24-27,40-43`, `next.config.ts:15`, `scripts/discover-plugins.ts:30-44`, `app/api/workflows/[workflowId]/download/route.ts:13,16`, and new `.gitattributes` / `tsconfig.tax-ui.json` / `knip.json`.