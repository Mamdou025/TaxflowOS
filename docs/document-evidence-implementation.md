# Document evidence: first platform milestone

Implemented 2026-09-29. This record covers the platform work authorized while the
synthetic company documents are being prepared separately.

## Outcome and boundaries

Guided workflow uploads now capture PDF page text, DOCX paragraph text and
selected Excel/JSON records with a content hash, source revision, extraction
method and issues. Chat, Run and the immutable Build inspector expose the same
saved evidence. Sina can request exact document segments in bounded pages.
Source replacement retains earlier attempts and marks dependent results outdated.

This is the evidence foundation for understanding documents. It does not establish
financial meaning, completeness, tax treatment, company context or correct keyword
mapping. PDF table extraction is explicitly unavailable. The OCR reader needs an
already acquired OCR capture; image-only documents in the guided uploader report
that OCR is required. No new provider or dependency was added.

Original bytes use the existing Sources upload API and its ingestion behavior.
If original storage fails, captured evidence remains usable with an explicit issue.
Downloading an original verifies its content hash. The workflow save indicator
continues to report whether the run itself reached server storage.

## Ownership and compatibility

- Contracts own the optional snapshot shape. Existing backups remain readable;
  historical attachments are not silently upgraded or re-extracted.
- Workflow application commands own revisions, source changes and invalidation.
  Upload/API adapters acquire content; synchronous executors replay it.
- Text and structured records use separate blocks when adding sources. Replace
  can change format. No automatic refresh changes a saved historical run.
- The new tool description tells Sina to cite recorded revisions and treat
  document text as data. Live-model compliance still needs evaluation.
- Removing parser fallback can make a workflow that previously appeared to
  succeed now fail with a useful missing-evidence or unsupported-tool error.
- Generic confidence scores, arithmetic conventions, semantic matching, company
  history and rulebook retrieval remain later work. No product decisions about
  those subjects are implemented here.

## Changed files and before/after meaning

Paths below are repository-relative. Each row names the file's responsibility and
the behavior changed by this milestone.

| File                                                                                    | Purpose and before → after                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/workflow-contracts/src/domain/document-extraction.ts`                              | New portable snapshot contract: identity, revision, hash, method, locations, rows and issues.                                                                                                                 |
| `lib/workflow-contracts/src/library-types.ts`                                           | Persisted guided sources previously held rows only; now optionally retain an extraction snapshot.                                                                                                             |
| `lib/workflow-contracts/src/generated-schemas.ts`                                       | Generated validation now accepts and validates that optional snapshot. No separate hand-written rules.                                                                                                        |
| `artifacts/api-server/src/lib/workflow-document-extraction.ts`                          | New native extraction helper preserves PDF pages and extracted DOCX paragraphs; never infers financial rows.                                                                                                  |
| `artifacts/api-server/src/routes/workflow-extract.ts`                                   | Existing extraction route adds the snapshot while preserving legacy text fields, explicit OCR and size/error behavior. No new endpoint or access policy.                                                      |
| `lib/workflow-executors/src/document-evidence.ts`                                       | New replay helper validates saved captures and exposes exact text and evidence references instead of reacquiring documents.                                                                                   |
| `lib/workflow-executors/src/missing-tools.ts`                                           | PDF source reads a valid saved capture when present; its legacy explicit source path remains.                                                                                                                 |
| `lib/workflow-executors/src/tools/backend-adapter.ts`                                   | Structured source execution now carries captures and extraction issues alongside existing normalized row output.                                                                                              |
| `lib/workflow-executors/src/tools/parser-tools.ts`                                      | Shared parser previously substituted default rows; now requires compatible complete evidence and reports unsupported PDF tables.                                                                              |
| `lib/workflow-executors/src/tools/definitions/logic-api-response-parser.ts`             | Wires the API reader to the strict parser; JSON captures and supported explicit legacy API rows are accepted.                                                                                                 |
| `lib/workflow-executors/src/tools/definitions/logic-excel-table-reader.ts`              | Wires the workbook reader to the strict parser; workbook captures and supported explicit legacy table rows are accepted.                                                                                      |
| `lib/workflow-executors/src/tools/definitions/logic-ocr-extract.ts`                     | Wires OCR to captured OCR evidence; ordinary text no longer masquerades as an OCR result.                                                                                                                     |
| `lib/workflow-executors/src/tools/definitions/logic-pdf-table-parser.ts`                | Wires PDF tables to an explicit unavailable result instead of mock rows.                                                                                                                                      |
| `lib/workflow-executors/src/tools/definitions/logic-pdf-text-parser.ts`                 | Wires the text reader to PDF/DOCX captures instead of sample data.                                                                                                                                            |
| `lib/workflow-core/src/application/sessions.ts`                                         | Extends row attachments to text evidence, validates captures, assigns revisions, preserves lineage, and selects the appropriate source executor. Existing invalidation/history commands remain authoritative. |
| `lib/workflow-core/src/application/document-inspection.ts`                              | New read query lists captures/locations and pages exact segment content; unavailable IDs return errors.                                                                                                       |
| `lib/workflow-core/src/application/inspection.ts`                                       | Exports the new query through the existing inspection entry point; no change to existing run-selection behavior.                                                                                              |
| `lib/workflow-core/src/core/outputs.ts`                                                 | Source presentation previously discarded document metadata; it now retains extraction evidence.                                                                                                               |
| `artifacts/ai-workflow-builder/src/features/documents/capture-workflow-document.ts`     | New upload adapter coordinates extraction, workbook selection, hashing and original storage with explicit failures.                                                                                           |
| `artifacts/ai-workflow-builder/src/features/documents/document-extraction-evidence.tsx` | New shared evidence view shows locations, revisions, issues and a hash-verified original download.                                                                                                            |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`   | Guided Run/Chat uploads now accept PDF/DOCX and display recorded extraction evidence in each block.                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-run-inspector.tsx`   | Build verification now shows extraction evidence for the selected result and source history.                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`         | Sina's existing inspection tool now exposes pageable evidence and exact citations, beyond a truncated generic preview.                                                                                        |
| `tests/unit/document-evidence.test.ts`                                                  | New checks for native extraction, parser failures, compatibility, exact inspection, source replacement and backup roundtrip. No production behavior change intended.                                          |
| `tests/integration/document-extraction.test.mjs`                                        | New real-session extraction/access/persistence checks against a disposable database. No production behavior change intended.                                                                                  |
| `e2e/workflow-session.spec.ts`                                                          | Adds PDF Run → Chat → Build evidence verification; retains existing workbook/source-history checks. No production behavior change intended.                                                                   |
| `docs/unified-workflow-execution.md`                                                    | Adds current evidence behavior and limits to the shared execution summary. Documentation only.                                                                                                                |
| `docs/ARCHITECTURE.md`                                                                  | Adds extraction ownership and snapshot/storage boundaries. Documentation only; preserves pre-existing edits.                                                                                                  |
| `docs/FUNCTIONALITY.md`                                                                 | Adds supported document evidence scope and explicit parser limits. Documentation only; preserves pre-existing edits.                                                                                          |
| `docs/document-evidence-implementation.md`                                              | This review record. Documentation only.                                                                                                                                                                       |

The working tree already contained separate Mkoro/automatic-approval work and two
planning documents (`document-understanding-plan.md` and
`synthetic-company-generation-prompt.md`). Those changes are not part of this
implementation. No commit, push or deployment was made.

## Verification

- `pnpm run verify`: passed, including toolchain, generated contracts,
  architecture, formatting, application/test types, 96 unit tests, 34 companion
  worker tests and 23 workflow-core tests.
- API and frontend production builds: passed. Frontend emitted sourcemap and
  browser-externalization warnings; the build completed successfully.
- `pnpm run test:workflow-reliability workflow-session.spec.ts`: both tests passed.
  This covers workbook source addition/recalculation/reload and PDF evidence across
  Run, Chat and Build. Extraction/storage responses in the browser test are mocks;
  the unit test exercises actual PDF and DOCX parsing.
- The earlier broader browser selection passed three existing route/persistence
  cases but failed two session cases: a click was intercepted while development
  reloads were occurring, and the new test used an incomplete backup fixture.
  After correcting the fixture and stabilizing the code, both session cases
  passed without weakening assertions or using forced clicks.
- The first verification attempt caught missing type narrowing in the new test.
  That test was corrected; full verification then passed.
- The new extraction integration test and guided browser persistence suite could
  not start their disposable database because Docker's Linux engine was not
  running. Real-session access denial and server persistence are **unverified**
  for this change. No shared or production database was used.
- No live LLM/OCR service, original-file storage service, or tax interpretation
  accuracy was tested. Unit backup roundtrips and browser save mocks do not
  substitute for those checks.

Local verification logs are under
`test-results/phase2/document-evidence-verification/`. Successful browser artifacts
are under `test-results/phase2/04a727d1-a7978890-0a45-4111-b4b2-d6ebd54fe96d/`.
