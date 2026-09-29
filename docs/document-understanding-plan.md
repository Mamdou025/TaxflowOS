# Document understanding: delivery and evaluation plan

Draft for review — 2026-09-29. This document proposes work; it does not claim that
the capabilities or test data below have been implemented.

## Outcome and agreed direction

Document understanding is the first priority: establish what records say, what
they mean in company and workflow context, what is missing, and which supported
action comes next. Sina must explain actual recorded steps and link them to the
exact workflow, version, run, block, execution attempt, and source revision.

The user has requested realistic synthetic Canadian company data, updateable
source blocks, explicit arithmetic conventions, and a replacement for the current
generic confidence score. This plan specifies a proposed implementation sequence.
It does not approve cloud processing, automatic tax conclusions, numerical policy,
or implementation of every proposed feature.

First milestone: one fictional company group, one document-readiness and mapping
journey, approximately 30 documents, and an independently reviewed answer key.
Success means evidence-backed inputs and visible unresolved questions. Complete
automated tax preparation or filing is outside this milestone.

## Current foundation and gaps

- Shared interactive sessions already expose recorded steps in Chat and Run,
  inspection in Build, source replacement, earlier attempts, and downstream
  invalidation. Extend these paths instead of creating another execution system.
- Sources have identity, revisions, client scope, and retrieval citations. The
  portable retrieval locator currently identifies a document chunk; page regions,
  table cells, and spreadsheet coordinates need a compatible richer contract.
- Real acquisition uses PDF, Word, spreadsheet, and provider-dependent OCR paths.
  Five registered parser tools still share a mock helper with a sample-row
  fallback. Its repair is a prerequisite for trustworthy document workflows.
- Keyword mapping already supports deterministic rules and provenance. Its
  configured rule confidence is not a measured probability of correctness.
- Sina has domain directives, workflow tools, session inspection, and deterministic
  routing evaluations. These do not establish contextual document understanding
  or reliable live-model tool selection.
- Existing arithmetic and template parity tests are useful foundations. Matching
  results across runtimes does not independently establish the right result.

See [current functionality](FUNCTIONALITY.md),
[architecture](ARCHITECTURE.md),
[shared execution](unified-workflow-execution.md),
[ownership](product/ownership.md), and
[fixture policy](../tests/fixtures/README.md).

## 1. Where realistic Canadian reference data comes from

Use public sources to learn structures, vocabulary, disclosure patterns, and
plausible financial ranges. Create a new fictional business with its own coherent
facts. Randomly splicing actual company balances would destroy accounting and
historical consistency.

| Reference source                                                                                                                                                                                                                | What to take from it                                                                        | Boundary                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [SEDAR+](https://www.sedarplus.ca/home/)                                                                                                                                                                                        | Public financial statements, MD&A, annual information forms, ownership and business context | Public filings do not supply a complete internal ledger or client tax file                                   |
| [Magna reports](https://www.magna.com/company/investors/financial-reports-public-filings/annual-reports)                                                                                                                        | Manufacturing disclosure and financial-document patterns                                    | Inspiration candidate; no assertion that its figures or tax facts describe the fictional case                |
| [CGI reports](https://www.cgi.com/en/investors/annual-reports)                                                                                                                                                                  | Services-business terminology and multi-period reporting patterns                           | Keep each issuer's actual statements separate from generated facts                                           |
| [CAE investor materials](https://www.cae.com/Investors)                                                                                                                                                                         | Additional document styles and complex business narratives                                  | Reference selection still requires reading exact documents                                                   |
| [Statistics Canada business statistics](https://www.statcan.gc.ca/en/subjects-start/business_performance_and_ownership) and [Financial Performance Data](https://www23.statcan.gc.ca/imdb/p2SV.pl?Function=getSurvey&SDDS=5028) | Industry profiles and plausible revenue, expense, balance-sheet, and ratio ranges           | Aggregate benchmarks are not individual-company records; large public issuers alone are a poor SME benchmark |
| [CRA T2 guide](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4012/t2-corporation-income-tax-guide.html)                                                                                     | Terminology, requested information, and reference-document structure                        | Pin the applicable tax-year edition; a generated scenario is not tax authority                               |
| [Bank of Canada Valet](https://www.bankofcanada.ca/valet/docs/)                                                                                                                                                                 | Dated exchange-rate observations for source/revision tests                                  | Record currency pair, direction, date, and retrieval evidence; rate-selection policy remains explicit        |

These are researched starting points, not an already collected corpus. During
collection, record URL, publisher, document title, publication/reporting dates,
page or section, access date, file hash, and permitted use. Prefer links and brief
pattern notes over copying entire reports into fixtures. Generate original prose
and layouts without real logos, signatures, account numbers, or purported internal
communications from actual companies.

Keep genuine reference excerpts clearly identified. Mark every generated document
and dataset as synthetic. Use fictional people and identifiers such as
`TEST-BN-001`, and reserved example domains for contact details. If a future format
test requires valid-looking identifiers, keep those fixtures isolated from filing
and external-write tools.

## 2. Synthetic company and document design

### Pilot profile

Proposed pilot: a fictional Quebec-based manufacturing group with a Canadian
parent, a Canadian operating subsidiary, and one foreign subsidiary. Include two
fiscal years, French and English records, CAD and USD documents, a name change,
an intercompany agreement, and a revised current-year record.

The initial journey answers: what documents and entities are present, what
information is supported, how descriptions map to the selected rulebook, and what
must be resolved before calculating. Foreign ownership is a context test; do not
infer a final FAPI or other tax position from the structure alone.

Later add a services company and a distributor as separate cases. Their document
templates, terminology, and transaction patterns should differ. Reserve complete
company cases for evaluation instead of splitting near-identical documents from
one company between development and evaluation.

### Generate a company model first

Create a versioned machine-readable specification with a fixed random seed:

- Entities, relationships, ownership dates, fiscal periods, currency conventions,
  company history, and a bilingual company glossary.
- Chart of accounts, opening balances, transaction records, agreements, rates,
  and links between transactions and supporting evidence.
- Approximately 500 journal lines for the pilot, with explicit debit/credit and
  unit conventions; this is a manageable test sample, not a complete annual GL.
- Stable IDs for facts, records, documents, revisions, and source locations.
- Deliberately unknown facts and expected questions. Some questions must remain
  unanswerable from the supplied documents.

Use deterministic code for balances, statements, exchange calculations, and
document tables. Use an LLM for varied wording, plausible correspondence, and
scenario descriptions constrained by the model. Validate generated prose against
the specification before treating it as a fixture.

### Proposed 30-document manifest

| Document family                                           | Count | Purpose                                                        |
| --------------------------------------------------------- | ----: | -------------------------------------------------------------- |
| Financial statements and supporting notes                 |     6 | Entity/period identification, comparisons, units and footnotes |
| Trial-balance and GL workbooks                            |     3 | Detailed records, account mapping, reconciliation              |
| Invoices and credit notes                                 |     4 | Line items, negative amounts, supporting evidence              |
| Agreements and amendments                                 |     4 | Dates, relationships, defined terms, superseded terms          |
| Emails and internal memos                                 |     4 | Jargon, explanations, uncertainty and contradictions           |
| Organization chart, company profile and event timeline    |     3 | Company context and changes over time                          |
| Prior workpaper, mapping history and reviewer corrections |     3 | Historical context without automatic reuse                     |
| Glossary, explicit case rulebook and evidence checklist   |     3 | Terminology, expected inputs and test instructions             |

Mix XLSX/CSV, text PDFs, scanned PDFs, and DOCX. Add scan and error variants after
the clean 30-document case passes integrity checks; variants do not count as new
independent cases. Include merged cells, multi-page tables, parentheses for
negative values, French decimal formatting, amounts in thousands, duplicate
attachments, missing pages, similar entity names, and ambiguous abbreviations.

### Truth, evidence, and defects stay separate

Maintain three distinct artifacts:

1. Generator specification: the fictional world's complete underlying facts.
2. Input documents: only the evidence Sina is permitted to see for that case.
3. Evaluator answer key: expected extractions, acceptable interpretations,
   citations, missing facts, contradictions, mappings, and permitted next actions.

Separate objective facts from expert judgment. A hidden fact in the generator
specification does not make it answerable from the documents. The answer key must
say when Sina should ask, defer, or present competing interpretations.

Build a clean internally consistent case first. Inject controlled defects into
copies using a manifest that records the exact change and expected detection.
Unplanned inconsistencies are generator defects, not tests Sina is expected to
guess. Cross-check debits/credits, balance sheets, opening/closing balances,
invoice totals, intercompany pairs, ownership periods, and statement-to-ledger
reconciliation under the specified rounding rules.

Have a fiscalist review meaningful interpretations and rule applicability. Use
independently specified small arithmetic examples to check the generator and
calculator; do not use the application under test to generate its own expected
answers. A second model may assist review but cannot alone certify the answer key.

## 3. Delivery sequence

Each phase should produce a reviewable change with evidence, rather than a large
unverified rewrite. Timeline estimates should follow the pilot baseline.

| Phase                                 | Work and owner                                                                                                                                                                                        | Exit evidence                                                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Define the benchmark              | Test fixtures and product requirements: select the pilot workflow, facts, questions, reference pack, interpretation rubric, and draft acceptance thresholds                                           | Reviewed manifest and answer-key schema; explicit distinction between facts, recommendations, and unresolved policy                                            |
| 1 — Generate the pilot                | Fixture generator and artifact rendering: construct the company model, compute consistent numbers, generate 30 documents, inspect renders, validate the answer key, freeze checksums                  | Clean dataset passes integrity checks; hidden evaluator files cannot be retrieved by Sina; documented defects are isolated variants                            |
| 2 — Measure the baseline              | Evaluation harness: run current extraction, retrieval, mapping, and Sina behavior; classify failures by layer                                                                                         | Reproducible per-case baseline including unsupported formats, wrong values, missing evidence, and wrong next actions                                           |
| 3 — Make extraction real              | Source ingestion, source contracts, executor adapters: remove implicit sample fallback, reuse real parsers, compare extraction providers, retain page/table/cell provenance and completeness findings | Missing/failed extraction cannot become fabricated rows; clean and degraded documents are compared to independent truth; provider choice has measured evidence |
| 4 — Build contextual interpretation   | Source/context retrieval and narrow interpretation capability: entity/period resolution, glossary, sourced history, applicable rulebook passages, conflicts and structured mapping proposals          | Candidate facts and meanings cite evidence; unknowns stay unknown; different entities and periods remain separated                                             |
| 5 — Make source changes traceable     | Sources, workflow contracts and workflow-core: explicit refresh/replace/add operations, source revisions, context dependencies, downstream invalidation and retained attempts                         | A source or rulebook update identifies affected results; stale approvals cannot carry forward; prior evidence remains inspectable                              |
| 6 — Give Sina an executable work plan | Agent adapters plus workflow-core readiness queries and shared Chat/Run/Build UI: inspect recorded state, explain findings, request allowed next actions                                              | Sina chooses appropriate tools and shows exact block/run/source links; viewing never silently reruns; unavailable tools remain visible                         |
| 7 — Harden arithmetic and acceptance  | Deterministic executors and contract migration: explicit percentage units, decimal/rounding policy, replacement of generic confidence display with evidence/review findings                           | Independent arithmetic cases pass; old versions retain explicit legacy semantics; no unapproved reinterpretation of historical results                         |
| 8 — Broaden and qualify               | Test/evaluation owners: add independent company cases, held-out document styles, repeated model runs, failure injection, production UI and persistence checks                                         | Report by document type/company/failure severity, with no hidden critical errors; supported scope and remaining gaps published                                 |

Phases 5 and 6 can be specified during extraction work. Arithmetic policy should
be resolved before any pilot result is presented as calculation-ready. Phase 8
requires multiple independent cases; a 30-document pilot alone cannot establish
production reliability.

### Extraction and matching experiment

Compare the existing parser path with
[Docling](https://docling-project.github.io/docling/concepts/docling_document/)
and, if a synthetic-data provider trial is selected,
[Azure Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/layout?view=doc-intel-4.0.0).
Measure exact financial-cell recovery, table structure, provenance, missing pages,
supported formats, processing time, and cost. Inspect rendered source regions
when providers disagree. No provider has been benchmarked for this plan.

Compare mapping in stages: approved exact rules; fuzzy suggestions using a
candidate such as [RapidFuzz](https://rapidfuzz.github.io/RapidFuzz/Usage/fuzz.html);
glossary expansion and semantic retrieval; then evidence-backed LLM proposals.
Use the same cases to establish whether each added stage improves decisions.
Text similarity ranks candidates; it does not prove tax meaning. Keep accepted
rules separate from suggestions and record company/period applicability.

## 4. How Sina knows what needs to be done

A prompt is one component. Sina also needs structured task requirements, recorded
progress, and tools whose results it can inspect. The workflow engine remains
responsible for enforcing prerequisites and permissions.

### A. Versioned workflow requirements

Each workflow should declare its objective, required facts/documents, applicable
scope, prerequisites, supported block operations, stop conditions, and output
contract. Define these in the owning workflow modules and expose them through
application queries. Do not duplicate the requirements in a chat prompt.

### B. A persisted working brief

Provide Sina with a compact view of the exact workflow/run, selected company and
period, source revisions, relevant glossary/history/rulebook references, completed
steps, outstanding findings, unavailable tools, and next eligible actions.
Reconstruct it from records after reload. Do not depend on conversational memory.
Retrieve focused evidence on demand instead of putting every document in a prompt.

### C. A controlled operating loop

1. Read the exact workflow requirements and current run state.
2. Inventory the sources and identify entity, period, format, and revision.
3. Request extraction where required and inspect its actual result.
4. Retrieve the relevant company context and rulebook passages.
5. Record facts, competing interpretations, missing evidence, and proposed mappings.
6. Explain the current step and propose or perform the next authorized action.
7. Verify the returned result and refresh the recorded plan before continuing.

Ask a precise question when the missing fact changes the outcome. Continue
independent work where possible. A request to explain a step is not a request to
execute it. Document text cannot grant tool permissions or override instructions.

### D. Shared tools and cards

Extend the existing `inspectWorkflowBlock`, `controlWorkflowRun`, source retrieval,
and workflow commands. New conceptual operations may include document inventory,
evidence lookup, interpretation proposal, and readiness inspection; names and API
schemas remain design work. Providers stay behind the source/connector adapters.

Each chat step card should show purpose, input sources/revisions, observed result,
supporting citations, unresolved findings, and next action. Link to the exact
recorded block attempt in Build and the original evidence region. Use factual
states such as extracted, proposed, missing evidence, conflicting evidence,
accepted, and outdated. Extraction success and reviewer acceptance stay separate.

Recommended concise Sina directive for implementation and evaluation:

> Read the selected workflow requirements and recorded run state before deciding
> what comes next. Use document, company, period, and rulebook evidence to support
> interpretations. Separate extracted facts, proposed meanings, accepted decisions,
> and missing information. Explain each step using its actual tool result and exact
> workflow/block/source references. Use the workflow commands for changes and
> execution within the current authorization. Ask when missing evidence changes
> the conclusion; continue independent steps. Preserve prior revisions and never
> invent figures, completion, approval, or evidence.

This directive is a proposal, not a runtime change. No claim is made that reading
this plan automatically changes Sina's behavior.

## 5. Test plan and proposed acceptance criteria

Thresholds below are proposed pilot gates. Freeze them after the baseline and
before comparing candidates; do not relax them merely to pass a failing run.

| Layer                 | Test                                                                                             | Proposed gate                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Fixture integrity     | Independently checked reconciliation, schema validation, links and rendered document QA          | All clean-case checks pass; every intended inconsistency is listed                                                         |
| Extraction            | Exact values, signs, currency, scale, row/column and source location against the key             | Every critical value consumed downstream is correct or explicitly blocked; report raw accuracy and blocked rate separately |
| Identification        | Entity, period, document type, revision and supersession                                         | No wrong-entity or wrong-period input reaches an accepted result                                                           |
| Retrieval             | Correct supporting passages present among results, citation resolution, scoped access            | All critical pilot evidence is retrievable; zero cross-workspace leakage; test client scope explicitly                     |
| Interpretation        | Supported meaning, contradictions, unknowns, references and acceptable alternatives              | No unsupported critical conclusion; at least 90% of pilot questions meet the reviewed rubric, with complete denominators   |
| Mapping               | Exact category accuracy on answerable rows, abstention on ambiguous rows, supporting rules       | Zero incorrect automatic acceptance in the critical cases; report useful coverage so rejecting everything cannot pass      |
| Arithmetic            | Independently specified rounding, percentages, zeros, credits, division and currency cases       | Exact agreement under the selected numeric policy                                                                          |
| Source updates        | Replacement, added evidence, connector refresh, glossary/rulebook change, stale run revision     | Affected outputs and approvals become outdated; historical attempts remain readable; unaffected branches stay intact       |
| Sina actions          | Tool arguments, order, prerequisite checks, permission boundaries and reported outcomes          | No fabricated completion, wrong-version execution, or unauthorized action; required next actions match the case rubric     |
| Chat/Build continuity | Open exact evidence, navigate, reload, inspect older attempt                                     | Same IDs and results throughout; inspection causes no execution                                                            |
| Recovery              | Provider timeout, malformed response, duplicate request, interrupted ingestion and save conflict | Visible failure with preserved work; no fabricated fallback or duplicate external effects                                  |

Include contradictory notes, an outdated rulebook, a missing agreement, a
wrong-company attachment, unreadable numeric cells, reordered documents, and
document text that attempts to instruct Sina to ignore its workflow rules.

Run deterministic checks on every affected change. Run each critical live-model
scenario at least five times under recorded model/prompt/provider versions;
report per-run failures rather than only a mean score. This is a pilot sampling
rule, not a statistical guarantee. Grade actions and evidence, not exact prose.

Keep evaluator answer keys outside every ingestion/retrieval path available to
Sina. Separate prompts, sessions, storage and credentials for generation and
evaluation. Split whole company/template families into development, validation,
and held-out sets. Do not tune on held-out failures; create a new held-out version
after deliberately promoting a failed case into regression coverage.

Use a repository-owned evaluation harness with saved results; hosted evaluation
platform selection is unnecessary for the first milestone. Follow the principles
in [OpenAI evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices):
defined objectives, representative cases, explicit metrics and repeated evaluation.

Future implementation checks: `pnpm run test:unit`, `pnpm run test:workflow-core`,
affected contract checks, and `pnpm run verify` for completed source changes;
workflow reliability tests for Chat/source/review journeys; disposable integration
and persistence tests for revision/storage changes; production builds for new
provider/runtime boundaries. Live provider evaluations are a separate reported
gate. Follow [TEST.md](../TEST.md), using package.json and .node-version as the
toolchain authority where documentation differs.

## 6. Decisions and implementation boundaries

Resolve before dependent implementation:

- Which initial workflow requirements and expert-reviewed interpretations define
  correctness. Recommended starting scope: document readiness and account mapping.
- Cloud versus local document processing, permitted providers, retention, regions,
  and cost limits. Synthetic evaluation does not authorize uploading client data.
- Rulebook authority, effective dates, company overrides and conflict precedence.
- Which interpretations can be automatically accepted, if any. Existing grants
  govern actions; they do not constitute approval of an interpretation.
- Percentage representation, decimal precision, rounding stage/mode, currency
  conversion policy, and preservation of legacy saved-version semantics.
- Explicit versus scheduled source refresh. Start the design with explicit refresh;
  recurring automation is a separate product decision.

Implement schemas additively, preserve old backups and frozen run records, and
never reinterpret old percentage values silently. Keep a versioned old executor
or an explicit compatibility path where needed. Pilot new extraction behind a
selectable adapter; compare results before retiring an existing supported path.
Rollback selects the previous adapter for new work while retaining recorded
results and evidence from both versions.

## 7. First work package and completion record

Recommended next work package: collect a small reference manifest, define the
fictional pilot company and case questions, and build the generator plus an
independently reviewed answer key. Use the accompanying
[ChatGPT generation prompt](synthetic-company-generation-prompt.md) for drafting.
Begin with the company specification and three representative documents before
expanding to all 30; this catches consistency and rendering problems early.

This planning change adds this plan and the reusable prompt only. No application
behavior, fixtures, dependency versions, schemas, prompts used by Sina, or provider
configuration are changed. Existing architecture/functionality summaries continue
to describe implementation; the parser discrepancy identified in the initial
review remains unresolved and is explicitly included in Phase 3.

The initial review found the shell's Node/pnpm versions differ from the project
pins. Establish the pinned task-local toolchain before implementation tests; do
not change the global runtime or bypass project checks.
