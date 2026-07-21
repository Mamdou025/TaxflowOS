# Deep Maintainability Audit — 2026-07-21

*Branch: `Neumorphic`. Method: 47-agent fan-out (10 zone maps + 6 dimension audits + 28 adversarial verifications + 3 syntheses). Every "dead / safe-to-move" claim below was independently re-verified; 3 false-positives were caught and are recorded as **KEEP**.*

**Companion docs:** [`docs/REPO-MAP.md`](../docs/REPO-MAP.md) (where everything lives) · [`docs/reorg-plan.md`](../docs/reorg-plan.md) (folder reorganization) · [`audit/CORRECTIONS-2026-07-21.md`](./CORRECTIONS-2026-07-21.md) (doc-vs-code errata).

---

## 1. The one-paragraph diagnosis

TaxflowOS is **six overlapping mini-apps wearing one repo**, and the "vibecody" feeling comes from four concrete, measurable things — not vibes:

1. **Two ~5,900-line god-files** (`lib/local-tool-registry.ts` 5,906, `lib/local-fiscal-workflow.ts` 5,854) plus **~12 more files over 1,300 lines**. `local-fiscal-workflow.ts` alone is imported by **~54 files across every zone** — it is the de-facto spine, and it fuses a type re-export barrel, the block catalog data, 8 sample-workflow factories, edge logic, persistence, and ~1,500 lines of FAPI fixtures.
2. **~5,173 lines of provably-dead code** (0 importers each), the largest being a fully dead 1,426-line "shell."
3. **Folders lie about ownership.** There is no top-level map, the one folder map (`docs/01-folder-map.md`) is stale by ~2 months and describes folders that were never created, and the README still describes the upstream boilerplate template, not this app.
4. **The gates are half-blind.** `tax-ui/**` (25 files, a *shipped* worksheet island) is excluded from type-checking; the lint gate (`pnpm check`) fails with ~3,500 real errors so CI signal is effectively off; `knip` is installed but wired to nothing.

The good news: the **domain model is sound**. `src/domain/workflow/**` is a genuine single source of truth for block/edge/workflow types (one catalog, consumed everywhere), `tsc` is green over the typed subset, and the mini-app boundaries are real and separable. This is untangleable, not rewrite-bait.

---

## 2. The six mini-apps (+ 2 shared zones)

See [`docs/REPO-MAP.md`](../docs/REPO-MAP.md) for entry points and the full "where do I change X" table. In brief:

| Mini-app | Owns | Entry point |
|---|---|---|
| **Workflow Builder** | `components/workflow/**`, `components/overlays/**`, `components/ai-elements/**` (UI); `lib/local-*`, `lib/workflow-*`, `src/domain`, `src/state` (engine); `backend/**` (execution) | `components/workflow/workflow-canvas.tsx` |
| **Tax Worksheets** | `components/worksheet/**`, `lib/worksheet-intel/**` (typed) **+ `tax-ui/**` island** (untyped) | `lib/resource-registry.tsx` |
| **Assistant / Chat** | `lib/assistant-runtime/**`, `components/assistant/**`, `components/workspace/**` | `app/api/copilotkit/route.ts` · `components/assistant/use-assistant.tsx` |
| **GenUI / OpenUI** | `features/genui/**` *(relocated Phase 1, 2026-07-21)* | `features/genui/library.tsx` |
| **Integration Plugins** | `plugins/**` (14 plugins) | `plugins/registry.ts` (load-bearing via `scripts/discover-plugins.ts`) |
| **mapping-agent** | `services/mapping-agent/**` (standalone, own tsconfig) | `services/mapping-agent/src/engine.ts` |
| *Platform spine* | `lib/db`, `lib/auth`, `app/api/**`, `lib/api-client.ts` | `lib/db/schema.ts` |
| *App shell + design system* | `app/layout.tsx`, `components/app-shell.tsx`, `components/ui/**`, `app/globals.css` | `components/app-shell.tsx` |

---

## 3. Large-file register (danger zones)

Full table in [`docs/REPO-MAP.md` §4](../docs/REPO-MAP.md). The refactor-priority subset (mixed-responsibility, not just big):

| File | LOC | Problem | Split target |
|---|---:|---|---|
| `lib/local-tool-registry.ts` | 5,906 | ~200 helpers + 40 inline tool defs + 3 near-duplicate evidence builders in one module | `lib/tool-registry/{types,helpers/*,roles,evidence/*,tools/*}` |
| `lib/local-fiscal-workflow.ts` | 5,854 | domain barrel + catalog data + 8 factories + persistence + fixtures; **54 importers** | delete the re-export barrel (point 54 sites at `src/domain`), then split catalog/edges/persistence/templates |
| `components/workflow/workflow-toolbar.tsx` | 3,119 | embeds a **client-side execution engine** + validators + 12 buttons in a toolbar | executor → `lib/workflow-runs`, validators → `lib/workflow/validation.ts`, buttons → `toolbar/*` |
| `components/workflow/node-config-panel.tsx` | 2,225 | one ~1,850-line `PanelInner` React function | per-block-type sections under `node-config/sections/*` |
| `components/overlays/configuration-overlay.tsx` + `inspector/block-inspector.tsx` + `workspace/block-data-flow-pane.tsx` | ~5,900 | **~500 lines of helpers copy-pasted across all three** | shared `block-kinds.ts` + `block-outputs.ts` |
| `lib/workflow-codegen.ts` | 1,316 | one ~1,268-line `generateWorkflowCode` function | per-block-type emitters under `codegen/emitters/*` |
| `backend/blocks/logic/hierarchy-aggregator/run.ts` + `calculation-engine/run.ts` | 2,210 | **formula tokenizer/RPN/evaluator duplicated verbatim** across both | extract `backend/blocks/logic/shared/formula-expression.ts` |
| `lib/local-ai-workflow-assistant.ts` | 1,496 | 1 Ask responder + 17 Propose generators flat in one file | `lib/ai-assistant/{ask,proposals}/*` |

> **Two parallel block-config UIs** coexist (~6k LOC): legacy `node-config-panel → block-inspector` (route `/workflows/[id]`) vs current `configuration-overlay` (route `/builder`). They share leaf editors but drift independently. **Both are live** — deciding whether `/workflows/[id]` is deprecated is the highest-leverage single decision in the UI.

---

## 4. Dead-code register (verified — 0 importers each)

> **✅ EXECUTED 2026-07-21 (Phase 0).** 30 files / **6,866 LOC** deleted after a final working-tree importer + git-provenance re-check (all existed on `main`, so any is restorable via `git checkout main -- <path>`). `tsc --noEmit` is source-clean afterward. The rows below are the removed set. **Not deleted** (held): `app/genui-lab/` (intentional OpenUI spike), `app/viewer/` (live via top-nav "Documents"), and the KEEP list at the end of this section.

**~6,866 LOC removed.** All re-verified adversarially (grep for importers, dynamic imports, config/script refs, route conventions) *and* re-checked against the working tree at deletion time.

| File(s) | LOC | Note |
|---|---:|---|
| `components/workflow/workflow-studio-shell.tsx` | 1,426 | largest dead file; superseded by `ChatWorkspace` |
| `tax-ui/pages/FapiWorksheet.tsx` | 1,076 | dead duplicate of live `components/worksheet/fapi-worksheet.tsx` (432) |
| `lib/integrations/vercel.ts` | 671 | full Vercel SDK wrapper, zero importers |
| `tax-ui/components/OrbitalStage.tsx` | 658 | old skeuomorphic home surface |
| `lib/utils/template.ts` | 549 | `processTemplate` — 0 importers (live path is in codegen-sdk) |
| `tax-ui/pages/Workbench.tsx` | 455 | un-wired leftover page |
| 9-file orphan cluster (`inscope-home`+`inscope-sidebar` pair, `ambient-orbs`, `canvas-page-wrapper`, `coworker-activity`, `scope-launchpad`, `assistant/*`, `field-editor`, …) | ~1,066 | superseded home/sidebar + orphans |
| assistant-runtime dead barrels: `lib/assistant-runtime/{index,errors}.ts`, `routing/intent-router.ts` | ~211 | superseded by enforced `routing/classify.ts` |
| `backend/runtime/{runner,validation}.ts` | ~131 | unreferenced wrappers |
| `tax-ui/pages/{Home,NotFound}.tsx`, `tax-ui/components/{Map,ManusDialog,ErrorBoundary}.tsx`, `tax-ui/hooks/useComposition.ts` | ~450 | wouter-era island leftovers |
| `components/workflow/{worksheet-page-menu.tsx, inspector/mock-runs.ts, config/condition-config.tsx}`, `components/overlays/alert-overlay.tsx` | ~487 | orphaned builder pieces (`alert-overlay` is reusable — keep if wanted) |
| **3 orphaned demo routes**: `app/copilot-test/`, `app/genui-lab/`, `app/viewer/` | — | reachable only by typing the URL; `copilot-test` self-labels "Delete after." |

**Also:** knip reports **16 unused npm deps** and **5 unused shadcn primitives** (`collapsible, context-menu, drawer, resizable, sheet`) — but verify plugin-referenced deps (`@slack/web-api`, `resend`, `@linear/sdk`, `@vercel/sdk`, `firecrawl`) against `plugins/**` before removing.

**Remaining knip "unused files" candidates (10, NOT auto-deleted — review first, several are plausibly dynamic-loaded or intentional):** `e2e-deep.config.ts` (needs a `test:e2e:deep` script, not dead), the 5 shadcn primitives above, `lib/steps/{credentials,index.ts}` (steps are dynamic-imported via the generated registry — verify), `src/runtime/generate-structure-view.ts`, `backend/blocks/logic/keyword-mapper/fixtures.ts` (test fixture).

### ⚠️ KEEP — verification caught these false-positives
- **`lib/next-boilerplate/**`** — looks dead (excluded from tsc, knip-unused) but is **read from disk at runtime** by `app/api/workflows/[workflowId]/download/route.ts:13`. Deleting it breaks workflow export.
- **`lib/workflow-codegen.ts` + `lib/workflow-codegen-shared.ts`** — flagged as superseded but are **live**: they power the "Code" tab and the download route.
- **`components/workflow/node-config-panel.tsx`** — flagged dead but is the **live** config panel for the `/workflows/[workflowId]` route.
- **`lib/kernel/**`** — unreferenced but **intentional** migration scaffolding. Do not delete; add to knip ignore.
- **`plugins/index.ts`, `_template/*.txt`, `tax-ui/wouter-shim.tsx`, `features/genui/system-prompt.txt`** — inert-looking but generated/aliased/runtime-read.

---

## 5. Coupling & boundary defects

1. **`tax-ui/` is not a one-way island — it has a real import cycle.** It is excluded from tsc yet imports 7 `@/` app modules; `lib/resource-registry.tsx` lazy-imports `@tax/pages/*` **and** `tax-ui/pages/FapiWorksheet.tsx` imports `@/lib/resource-registry`. All 14 seam edges are untyped. (Deleting dead `FapiWorksheet.tsx` breaks the cycle for free.)
2. **`lib/kernel/**` is a dead parallel model.** 10 files, 1 real importer, defining a *second* `WorkflowRun`/`RunStatus` model that duplicates `src/domain`. Either land it or quarantine it — two run models is drift cost at zero benefit today.
3. **The assistant launders types through the god-file.** 0 files under `lib/assistant-runtime` import `src/domain` directly; they reach workflow types via `lib/local-fiscal-workflow` re-exports. The clean boundary exists; it's just bypassed.
4. **UI→lib inversion.** `lib/workflow-runs/parse-upload.ts` imports `components/workflow/source-viewers/excel-utils.ts` (1,765 lines of pure parsing sitting under a UI folder).

Positive: **no circular imports among the god-files themselves** (clean DAG), and `src/domain/workflow` is genuinely canonical.

---

## 6. Tooling / type-safety gaps

| Gap | Impact | Fix |
|---|---|---|
| **Lint gate broken** — `pnpm check` (first required CI step) fails with ~3,500 real errors | CI signal is off; PRs merge unchecked (history: 1 PR ever, direct-to-branch commits) | bulk `pnpm fix` + demote noisy rules (`useSortedClasses`, `useSortedAttributes`, `useBlockStatements`, `useNumericSeparators`) to warnings |
| **Untyped island in the build** — `tax-ui/**` (25 files) excluded from tsc but dynamically imported into the shipped bundle in 6 places | type errors in a live surface never fail the build | add a loose `tsconfig.tax-ui.json` (strict:false) + a CI step |
| **CRLF churn** — `core.autocrlf=true`, no `.gitattributes`, biome `eol=lf` | every file reports as needing formatting; `fix` churns line endings | add `.gitattributes` (`* text=auto eol=lf`) + `git add --renormalize .` |
| **knip unwired** — installed, no script, no CI | 55 unused files / 302 unused exports never acted on | tune `knip.json` (entry points) + non-blocking CI job |
| **Build coupled to prod DB** — `next build` runs `db:migrate` first | a DB blip breaks an otherwise-valid build | move migrations to a separate release phase |
| **Thin tests** — 2 Playwright specs (16 tests), no unit tests, one orphaned config | little regression safety for a refactor | add `test:e2e:deep` script + vitest around codegen/registry |

---

## 7. Documentation consistency

The audit docs and README have drifted from the code. Full errata (exact lines + correct values) in [`audit/CORRECTIONS-2026-07-21.md`](./CORRECTIONS-2026-07-21.md). Highlights, now corrected in-place:

- **"Next.js 15" → 16** in 3 places (package.json pins `16.0.10`).
- **"2 starter templates" → 4** (`lib/workflow-runs/index.ts` registers `fapi, roulement, expense, campaign`).
- **Homepage "OrbitalStage" → `ChatWorkspace`** (`app/page.tsx`).
- **A whole ARCHITECTURE section** documented a deleted chat subsystem (`lib/chat-agent.ts`, `lib/fapi-run.ts`, `/api/chat-workspace`) as live — banner-marked superseded.
- **Stale "Last updated" dates** on every audit file; **deleted files** (`chat-workspace-panel.tsx`, `entity-text.tsx`, `action-orb.tsx`) still carry `[LIVE]`/`[SUPERSEDED — retained]` headings.
- README still describes the upstream **"AI Workflow Builder Template"**, not TaxflowOS.

---

## 8. Recommended action plan (value ÷ risk)

**Phase 0 — Make the ground safe (do first; near-zero risk, highest value).**
- ✅ **Done 2026-07-21:** deleted 6,866 LOC of verified dead code (`tsc` source-green); added `.gitattributes`; tuned `knip.json` (unused-files 55 → 10).
- ⏸️ **Left for you (deliberately not done):** (a) `git add --renormalize .` — a whole-tree line-ending pass, best run in its own commit on a quiet tree, not mid-redesign; (b) the `pnpm check` lint gate (~3,492 errors) — decide **demote** the noisy ultracite rules (`useSortedClasses`, `useSortedAttributes`, `useBlockStatements`, `useNumericSeparators`) vs **bulk `pnpm fix`**; I did not override your chosen ruleset or run a repo-wide reformat unasked.

**Phase 1–2 — Establish the reorg pattern** on the safest zones (genui, mapping-agent), then stand up `shared/ui`, `shared/app-shell`, `shared/stores`.

**Phase 3 — Extract `shared/workflow-engine/`** (the real core; highest structural value — kills "two sources of truth" + the UI→lib inversion; highest blast radius, so careful codemods).

**Phase 4–7 — Move builder UI + execution, worksheets/tax-ui (the untyped seam — deferred until the typed foundation is stable), assistant, platform.**

**Phase 8–9 — Optional `plugins/`→`integrations/` rename + god-file decomposition** as independent follow-ups.

Full sequence, mapping table, tsconfig/config changes, and per-step gates: [`docs/reorg-plan.md`](../docs/reorg-plan.md).

> **Nothing destructive has been done.** This audit only *added* documentation and corrected stale prose. Dead-code deletion and the folder reorg are proposed, not executed — they await your go-ahead.
