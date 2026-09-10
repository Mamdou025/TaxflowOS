**Workflow demo-readiness audit — September 9, 2026**

The complete document-to-result rehearsal passes in the production build. The verified path uploads a CSV, creates a keyword rule, creates an aggregation group, adds a formula with numeric constants, produces 50,000 in the final output, reloads the application, and reruns the same saved version. This is a qualified approval for that rehearsed path, not approval for every document type, every template, or arbitrary financial calculations.

The final development regression sweep passed **47 of 47 tests in 10.0 minutes**, with **zero skipped, failed, or flaky tests**. Earlier failures drove the repairs below; the clean final result does not erase those findings. [The complete machine-readable regression report](demo-audit-evidence/development-test-report.json) retains individual test results, durations, and recorded measurements.

| Regression group | Passed | What it establishes |
|---|---:|---|
| Calculation and storage audit | 6 | Arithmetic errors, six aggregation operations, nested groups, cycles, duplicate keys, lossless storage, FX precedence |
| Calculation inputs | 2 | Constants and connected numeric fields are available to Compute |
| Upload, load, and API audit | 12 | Six additional file formats, stale-preview rejection, custom columns, invalid files, 100/1,000-row persistence, live API and simulated outage |
| Full document-to-result workflow | 1 | CSV upload, new keyword, new group, constants in a formula, downstream output, three distinct persisted reruns |
| Panel resizing and error reporting | 3 | Both dividers, settled resize notifications, preservation of genuine errors and their messages |
| Route smoke checks | 14 | Listed routes render without their crash panel; not a full feature test of each route |
| Builder roundtrip | 4 | Saved rule versions, personal workflows, upload/reload, blank workflow source creation, custom/text data |
| Standalone Run persistence | 2 | Started runs survive navigation; untouched runs still request their source |
| Workspace data flow | 3 | Input & Output tab, selected-link transfers, saved versus draft execution, editable advisory triggers |

**What was actually exercised.** Tests ran in Chromium on this Windows machine, against the Docker development application at localhost:5173 and a separate local preview of the compiled production bundle. The production rehearsal used browser controls throughout; it did not inject a finished workflow or bypass the editor with engine calls. Separate engine tests examined arithmetic, source references, aggregation operations, cycles, and storage. Those tests supplement the UI rehearsal rather than substitute for it. Tests used isolated browser storage. They did not send chat messages or change the user's existing personal workflow library.

The live API check called the real application endpoint and Bank of Canada service. The outage check deliberately mocked a 503 response. Production preview was local only; nothing was deployed.

Both production scenarios passed in separate runs: the complete UI editing rehearsal and the 1,000-row upload/run/reload/rerun scenario. The latter verified a total of **1,000**, two persisted runs after another reload, and no captured browser runtime errors. [Its machine-readable report](demo-audit-evidence/production-load-test-report.json) records the final pass. Its initial test locator selected the similarly named contributing-record list instead of the numeric total; correcting the locator resolved that assertion without changing application code. This is separate from the application defects listed below.

**The end-to-end example.** The uploaded CSV contained:

| Description | Amount | Expected treatment |
|---|---:|---|
| Widget order one | 120 | Match the new “Widget” keyword rule |
| Widget order two | 80 | Match the same rule |
| Consulting service | 50 | Remain unmatched and appear in review findings |

The browser created category `widget_sales` and group `widget_total`. The group produced **200**. The new calculation `widget_total * 500 / 2` produced **50,000**. A downstream summary term passed that value into the final Canonical JSON output. Individual block tests, the full Run action, and saved-version reruns were checked. The regression test verifies a new run ID and an increased persisted run count, so it cannot accidentally accept an old successful result as evidence that a rerun worked.

The production rehearsal is named “Demo rehearsal — widget sales” within its isolated test browser. [The captured production result](demo-audit-evidence/production-final-result.png) shows the aggregation total and final value. [The reusable sales CSV](../e2e/fixtures/demo/sales-check.csv) reproduces the development example, including its additional quantity column; production used the same labels and amounts. The other upload fixtures are in `e2e/fixtures/demo/`.

**Confirmed defects found and repaired.** These were observed failures or specific inconsistencies confirmed by focused tests or code inspection; they are not hypothetical risks.

| Severity | Defect and cause | Repair and verification |
|---|---|---|
| Misleading resize error | The development error reporter forwarded only `ErrorEvent.error`. Browser ResizeObserver notifications carry their message on the event with no Error object, so resizing could display “unknown runtime error.” | The reporter excludes only the two known browser resize notifications when no exception exists, and preserves other event messages. Tests drag both panel dividers, check that notifications settle, and verify that genuine exceptions and promise rejections still appear. The error overlay remains enabled. |
| Demo blocker | Opening Category Rollup froze the page. Some template groups share an ID with a category; the tree recursively expanded that category as the same group forever. | Tree rendering now tracks ancestors. Same-name category wrappers no longer recurse. The full browser rehearsal opens and edits the affected FAPI aggregation block. |
| Demo blocker | A second run could fail to save. Three rows produced about 2.8 million characters of history; duplicated inputs, outputs, transfer snapshots, and logs exhausted browser storage. An earlier test could read the old run and incorrectly pass. | Lossless shared-object storage plus compression retains complete snapshots. Tests now require distinct run IDs, increased persisted counts, reload survival, and unchanged numeric results. Old plain-JSON saves remain readable. |
| Demo blocker at larger sizes | A 1,000-row workflow executed but could not persist its result, even after object deduplication alone. | Compression resolved the measured case. Both the first run and a rerun survive storage and navigation at 1,000 rows. This does not establish unlimited storage capacity. |
| Major performance | Collapsed result panels still mounted every large React subtree. Repeated runs became progressively slower. | Closed result and history panels now render their contents only when opened. Small reruns dropped from roughly 8.8 seconds in the failing baseline to below one second in subsequent measurements. |
| Incorrect arithmetic | Subtract, multiply, divide, and pass-through appeared in the aggregation editor, but normalization converted them to sum. For inputs 6 and 2, multiply returned 8 instead of 12. | All six displayed operations are supported. Tests verify sum 8, absolute sum 8, subtract 4, multiply 12, divide 3, and pass-through 6. |
| Incorrect aggregation | Nested groups were selectable in the editor but treated as missing category names by the runner. | The editor test panel and runner now share group evaluation. A nested example produces 14 rather than 6; original contributing rows remain traceable. |
| Calculation blocker | Compute rejected both constants and a valid `quantity` field when connected records lacked a generic `amount` field. | Compute validates the fields actually referenced. Tests verify constants-only 500 / 2 = 250 and quantity 12 × 2 = 24 with no amount field. |
| Misleading output | Divide-by-zero and malformed formulas produced numeric results with warnings. Examples included 500 / 0 → 0 and 500 + → 500. | Invalid arithmetic and syntax now produce explicit errors and no calculated result. Tests include divide-by-zero, missing operands, unmatched parentheses, and unexpected operators. |
| Invalid configuration | Duplicate result keys or circular references could produce ambiguous or fabricated results. Creating another item after deleting one could also reuse an existing generated ID. | Duplicate keys and cycles fail clearly. Generated term/group IDs skip existing IDs. Focused tests cover duplicate keys and calculation/aggregation cycles. |
| Upload inconsistency | A failed replacement upload left the previous valid preview available to apply. | Starting a new upload clears the old preview. Invalid files cannot accidentally apply stale data. Saved valid data remains unchanged. |
| Navigation inconsistency | Applying an upload could unexpectedly open the selected source editor over the Run tab. | Personal-workflow creation preserves editor focus only when an editor is already open. Format-upload tests now move directly into Run. |
| Canvas usability | Fit view could leave blocks beneath the sidebar because its minimum zoom was too high for a large graph. | The canvas can zoom out far enough to fit the graph; the live API UI test can reach the previously hidden FX block. |
| API editing blocker | After testing an API source, fields became locked with no visible action to create another editable source version. | API/FX setup now exposes “Create new source version.” The test creates a new version, attempts another fetch, and verifies failure handling. |
| FX inconsistency | Clearing the override wrote zero instead of removing it. Also, the UI said an override took precedence while the runner preferred the live rate. | Blank clears to an explicit null, which survives saving. The runner now honors override precedence; focused tests verify override 1.35 and the fetched value after clearing it. |
| Misleading timing | Local execution logs used fixed synthetic per-block times and a fabricated completion duration. | Start/completion timestamps now come from actual execution. UI timings in this report are measured independently around browser actions. |

**Document format coverage.** These are small, deliberately controlled fixtures, not a claim that every file using the same extension will parse.

| Format | Upload/extraction | Numeric fields for calculation | Important boundary |
|---|---|---|---|
| CSV | Passed, including the complete production rehearsal | Preserved | Custom column mapping also tested |
| TSV | Passed | Preserved | Three-row fixture |
| XLSX | Passed | Preserved | One sheet with headers and three records |
| JSON | Passed | Preserved | Object records, not arbitrary scalar JSON |
| TXT | Passed | Not automatically separated from text | Suitable for keyword classification; numeric fields need preparation |
| Text PDF | Passed | Not automatically separated from text | Extraction is not structured table recognition |
| DOCX | Passed | Not automatically separated from text | Paragraph text is extracted; numbers are not automatically assigned to columns |

Empty CSV, empty JSON records, scalar JSON, malformed JSON, and invalid PDF content were tested for safe rejection without overwriting saved valid data. The stale-preview replacement case has its own regression. Custom columns `Product`, `Units`, and `Rate` were tested: Product becomes classification text, Units becomes the calculation amount, zero remains zero, and the separate Rate field remains available.

Some first PDF/Word checks exceeded a five-second test threshold while the development server loaded extraction dependencies. Rechecks with a realistic loading timeout passed. Do not present those initial threshold failures as corrupted-file failures. A dependency-cache reload also caused blank page-load timeouts during development; the server was restarted before the stable verification passes.

**Performance measurements.** These are single-machine observations, not a cross-device benchmark or a latency guarantee. Browser timings include the action, state persistence, and the specified UI/readback work. Network conditions affect the live API request.

| Scenario | Observed measurement |
|---|---:|
| Production: open workflow Build | About 2.8 seconds |
| Production: run and open final result | About 1.0 second |
| Production: full scripted rehearsal, including edits and reload | 17.6 seconds |
| Production: 1,000 rows, run and open the numeric totals | 4.2 seconds |
| Production: full 1,000-row scenario, including two runs and reloads | 25.3 seconds |
| Failing baseline: small rerun | About 8.8 seconds; new run did not persist |
| After lazy rendering/deduplication: small reruns | About 0.6–1.0 seconds |
| 100 rows: successful run after compression | About 0.5 seconds |
| 1,000 rows: upload and apply in development | About 1.2–2.1 seconds |
| 1,000 rows: successful first run and persisted readback in development | About 4.2–7.2 seconds |
| PDF preview in the development regression sweep | About 9.1 seconds |
| Word preview in the development regression sweep | About 5.1 seconds |
| 1,000 rows: two saved runs | About 498 KB of stored text |
| Real Bank of Canada request | About 6–8.6 seconds |
| Storage codec fixture: expanded versus stored | 976,396 versus 14,143 characters, with exact JSON-value roundtrip |

The live response contained 249 daily observations for USD/CAD in 2025 and an average of 1.3977622489959842. The tests checked that a successful fetch was pinned and that a simulated API outage retained the prior valid value. Running a workflow replays its pinned source value; it does not automatically refresh the remote API on every run.

**Remaining limitations that matter for the demo.** These prevent an unrestricted “any document, any calculation” readiness claim.

1. **PDF/Word numeric extraction is incomplete.** Uploading a PDF or DOCX successfully does not mean the application has separate usable numeric columns. Text-only extraction is what was verified. Scanned documents need OCR or manually prepared values. Use the rehearsed CSV/XLSX path for the calculation demonstration.
2. **The FAPI template still brings fiscal assumptions and review warnings.** The sales example intentionally leaves a service row unmatched and does not supply the template's other categories. Missing-template-category warnings are expected in that scenario. They must not be mistaken for execution errors or silently ignored in a real fiscal calculation.
3. **Missing ordinary named operands can still become zero with warnings.** Explicit connected-field references now fail when the numeric value is absent, but legacy ordinary named operands retain warning-based behavior. A displayed number is not sufficient evidence of completeness; review the associated warnings. This is a remaining consistency issue.
4. **Most calculation results still use two-decimal rounding.** Code review confirmed a fiscal convention: most result keys round to cents, with rate/FX exceptions. This can affect chained nonfinancial calculations requiring higher precision. The rehearsed integer example does not exercise that limitation. A configurable precision policy remains necessary before promising general mathematical behavior.
5. **The final output presentation is still technical.** The production screenshot verifies the value, but Canonical JSON's Values view remains long and exposes terms such as formula trace and pass-through. The dedicated Input & Output tab is an improvement; a concise business-facing final summary still needs design work. Do not claim that the entire interface is already polished for nonprogrammers.
6. **Storage is still browser-local and finite.** Compression fixes the measured small and 1,000-row failures. It does not make history unlimited or synchronize personal workflows across browsers, machines, or users. Larger files, many workflows, and long-lived histories need additional capacity testing and a more durable persistence design.
7. **API availability remains external.** A successful live request today does not guarantee a live response during the demo. Pin and verify the required data beforehand, and explain clearly when a run uses pinned data.
8. **Large bundles remain.** The production build succeeds but reports large JavaScript chunks, including approximately 3.04 MB for CopilotKit, 2.63 MB for document processing, and 2.39 MB for the main bundle before gzip. Local production timing is acceptable in this rehearsal; slower devices/networks were not tested.
9. **Scope is deliberately bounded.** The audit includes workflow UI, calculations, uploads, versioning, resize behavior, API fetch behavior, persistence, production boot/rehearsal, and route smoke checks. It does not validate every workflow template, every external service, chat/AI answers, concurrent editing, every browser, or the legal correctness of tax calculations. Route smoke checks prove rendering without the route crash panel, not full functionality of each route.

**Demo procedure supported by the evidence.** Use the production build and the exact rehearsed workflow/file combination. Upload the structured file, check the extracted columns, create or inspect the keyword category, verify the 200 aggregation total, and verify 50,000 in Compute. Save the workflow under its intended name, open Run, and run the saved version. Show the final output and its review messages. Reload and run the same saved version once before the audience arrives. If changing an already-tested API source, create a new source version and check whether an override is set. Avoid switching to an untested scanned document or precision-sensitive formula mid-demo.

**Reproduction and evidence.** Run `pnpm run test:workflow-builder` for the expanded development regression suite. Build with `docker exec taxflowos-web-1 pnpm --filter @workspace/ai-workflow-builder build`, then run `pnpm exec playwright test --config playwright.production-audit.config.mjs --tsconfig e2e/tsconfig.json` for the production UI rehearsal. Type checking uses `docker exec taxflowos-web-1 pnpm --filter @workspace/ai-workflow-builder typecheck`. The test specifications, small upload fixtures, production screenshot, and final machine-readable test report are retained with this audit.

Type checking passed. The production build passed, with existing sourcemap-reporting warnings and the large-chunk warnings described above. Both production UI scenarios passed with no captured browser runtime errors. The final development sweep passed all 47 tests; no application source changes followed that sweep or the production build.
