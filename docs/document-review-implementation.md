# Document interpretation review

## Delivered behavior

The next platform increment gives Sina a structured document-review path in an
active workflow run. It can inventory current captures, read their segments and
propose observations plus open questions. Each observation must quote the exact
captured source. Document type, company, reporting period and currency must each
have an observation or an explicit question.

The user reviews a plain-language card and chooses **Save interpretation notes**.
The workflow command appends notes only if the run revision and source still
match. Run, Chat and Build display the saved notes and quotations. Source
replacement and revised notes retain history. Saved final run records retain
their notes when later interpretations are saved.

## Meaning and limits

- Quotation validation establishes that cited text exists at that source location.
  It does not prove the proposed interpretation follows from the quotation.
- These are proposed interpretation notes. They do not change calculation inputs,
  calculated results, review gates or approval. Saving notes is separate from
  server persistence, which retains the existing workspace save indicator.
- Reviews concern one captured document at a time. Cross-document company history,
  rulebook applicability, fiscal conclusions and mapping acceptance remain later
  work. Multiple entities/periods can be stated separately without choosing one
  implicitly.
- Missing profile fields must be questions. Ambiguities/conflicts need quotations;
  the model must not turn missing information into fabricated evidence.
- Sina uses the existing configured model through its normal Chat tools. No new
  provider, model API, database migration, dependency or top-level navigation was
  added. Live interpretation quality has not been established by deterministic
  tests.
- Proposal previews are transient and workspace-scoped. Saved notes belong to the
  workflow library. A user can request a revised proposal; earlier saved notes
  are retained. Legacy backups need no conversion.

## Try it

1. Open a workflow, start a guided run and attach a supported document to its
   source block. Keep the run paused while saving interpretation notes.
2. In Chat, ask Sina: "Review the documents in this run. Identify their companies,
   reporting periods, currencies and relevant facts. Quote the evidence, list
   missing or conflicting information, and prepare document review cards."
3. Inspect each card and its quotations. Ask for a revised proposal if needed,
   then select **Save interpretation notes**.
4. Open Run or verify the source block in Build to inspect the saved notes. Source
   replacements retain historical notes and require a new interpretation.

This requires the normal Sina model connection. Without a configured/available
model the platform does not manufacture an interpretation.

## File-by-file changes in this increment

Paths are repository-relative. Many files already contained the earlier document
extraction milestone; only the additional changes below belong to this increment.

| File                                                                                    | Purpose and before/after behavior                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/workflow-contracts/src/domain/document-review.ts`                                  | New typed observations, questions, citations and source-bound review records.                                                                                                            |
| `lib/workflow-contracts/src/library-types.ts`                                           | Sessions and approved run records now optionally retain interpretation notes; old records remain valid.                                                                                  |
| `lib/workflow-contracts/src/generated-schemas.ts`                                       | Regenerated validators include the optional review contract. No manual schema changes.                                                                                                   |
| `lib/workflow-core/src/application/document-review.ts`                                  | New validation and review-history queries check source identity, required profile fields and exact quotations.                                                                           |
| `lib/workflow-core/src/application/sessions.ts`                                         | Adds a paused-run command to append notes with stale-revision protection and snapshots notes into approved run records. Execution behavior is unchanged.                                 |
| `lib/workflow-core/src/application/document-inspection.ts`                              | Extracts a reusable capture-inspection query so source text can be read before execution; existing block inspection remains unchanged.                                                   |
| `lib/workflow-core/src/application/inspection.ts`                                       | Exposes review commands/queries and adds recorded notes to exact run inspection.                                                                                                         |
| `artifacts/ai-workflow-builder/src/features/documents/document-review-view.tsx`         | New shared plain-language display for observations, quotations, questions and history status.                                                                                            |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-document-review-tools.tsx` | New inventory/read and proposal tools plus an explicit user-save card. Preparation alone does not persist notes.                                                                         |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`         | Registers the tools, tells Sina when to use them and exposes historical notes during block inspection.                                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`          | Adds the document-review operating sequence to Sina's existing instructions; no change to model configuration.                                                                           |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`   | Run/Chat now display interpretation notes alongside the existing source and step controls.                                                                                               |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-run-inspector.tsx`   | Build shows the selected block's notes, bounded by the selected historical attempt when applicable.                                                                                      |
| `tests/unit/document-review.test.ts`                                                    | New negative/positive cases for evidence validation, stale writes, preserved outputs/history and immutable run snapshots. No production behavior change.                                 |
| `tests/integration/document-extraction.test.mjs`                                        | Extends the real API/database test to retain notes and deny a viewer's write. No production behavior change.                                                                             |
| `e2e/workflow-session.spec.ts`                                                          | Adds user-save, stale-proposal and reload coverage through the real review card, with synthetic API responses. Existing workbook/PDF checks are retained. No production behavior change. |
| `docs/ARCHITECTURE.md`                                                                  | Adds annotation ownership; preserves earlier changes. Documentation only.                                                                                                                |
| `docs/FUNCTIONALITY.md`                                                                 | Describes the new review capability and interpretation limits. Documentation only.                                                                                                       |
| `docs/unified-workflow-execution.md`                                                    | Documents proposal, save, history and runtime behavior. Documentation only.                                                                                                              |
| `docs/document-review-implementation.md`                                                | This review record. Documentation only.                                                                                                                                                  |

Pre-existing extraction work, Mkoro/automatic-approval changes and synthetic-data
planning files are preserved. No commit, push or deployment is authorized or made.

`lib/workflow-contracts/src/library.ts` also changes backup validation: review IDs
must be unique, their blocks must belong to the saved workflow, and source/hash/
revision metadata must match the retained source. Previously this annotation
contract did not exist. Old backups without annotations retain their behavior.

## Verification

Confirmed checks:

- Full `pnpm run verify` passed with 100 unit tests, 34 companion-worker tests,
  23 workflow-core tests, type checking, schema generation checks, architecture
  checks and maintained-file formatting. The final repeat includes the added
  backup identity guard.
- All three `workflow-session.spec.ts` browser tests passed: explicit user save,
  stale proposal rejection/reload, workbook continuation and PDF Run/Chat/Build
  continuity. These tests use synthetic API responses; the card test bypasses
  live model generation and exercises the actual proposal display/save component.
- Both `workflow-storage-recovery.spec.ts` tests passed against a disposable real
  database, covering cross-browser recovery, backups, offline retry, conflicts
  and a one-megabyte payload.
- The three document extraction integration tests passed, including notes saved
  and reloaded through the real API, and denial of a viewer's write. The final
  repeat includes the backup identity guard.
- The initial typecheck identified a nullable workspace reference in the new
  callback. Capturing the validated workspace ID fixed it; subsequent full
  verification passed. No tests or type checks were weakened.
- Both final production builds passed. The frontend retains sourcemap,
  browser-externalization and large-chunk warnings; no thresholds were raised.
- Changed-document formatting, local documentation references and `git diff
--check` passed. No application changes were needed after the final checks.

Logs are under `test-results/phase2/document-review-*.log`. Browser artifacts are
under `04a727d1-51433ffa-a27e-4209-9c5a-527808172a6f` (three session tests) and
`04a727d1-67239830-ab11-4dda-8b29-d73441f257bc` (two persistence tests) in that
directory. The final integration run is
`04a727d1-7f4287d8-f23c-40bb-be16-62926ab94c52`.

Live model interpretation quality, live original-file storage, and live OCR
providers are not verified. Exact quotation matching does not measure semantic
accuracy or completeness. The next evaluation should use independently reviewed
company documents and expected facts/questions.
