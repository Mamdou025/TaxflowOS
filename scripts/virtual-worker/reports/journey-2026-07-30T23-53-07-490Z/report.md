# Virtual worker run — End-to-end non-linear fiscalist work + data traceability

- **Persona:** `journey`
- **Base URL:** http://localhost:5173
- **Model:** anthropic/claude-opus-4-8 (effort: medium)
- **Steps used:** 97/120
- **Started:** 2026-07-30T23:53:07.490Z
- **Finished:** 2026-07-31T00:02:29.960Z
- **Findings:** 12  ·  **Captured errors:** 11

## Agent summary

Run errored: A positive credit balance is required for all requests, including BYOK, so fallback providers remain available. Add credits at https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dtop-up to continue.

## Findings

### 🟠 HIGH (3)

- **[#4] Uploaded document not persisted server-side (/api/documents empty)**  _(persistence)_
  - Uploaded sample-company-tax-document.txt via Documents. The UI shows it listed, previews its full content, and labels it "In Scope's context". But GET /api/documents returns {"documents": []}. The file only exists as a client-side blob (blob: download URL). It is not stored on the backend, so RAG/context and traceability cannot be trusted to persist across sessions.
  - _Expected:_ An uploaded document should be persisted server-side and appear in /api/documents so the assistant's context and lineage survive reloads.
  - _Screenshot:_ `finding-4.png`
- **[#9] Workflow A Run state lost after navigating away and returning**  _(persistence)_
  - In workflow A (Foreign Affiliate Surplus) I ran with the sample workbook, got a full computed result (net 172,900; FX changed to 1.40 → 242,060 CAD). After visiting workflow B and the Build tab and returning to Run, the tab reverted to the initial "Document needed / Upload the workbook" empty state — the run inputs and computed outputs were discarded, forcing a re-run. Work-in-progress is not retained across tab/workflow navigation.
  - _Expected:_ A run in progress (source loaded, inputs edited, figures computed) should persist when navigating between tabs/workflows and back.
  - _Screenshot:_ `finding-9.png`
- **[#11] After reload, app cannot trace the exempt surplus (1,250,000) back to its source document**  _(traceability)_
  - Traceability test: I uploaded sample-company-tax-document.txt (exempt surplus CAD 1,250,000) and Sina cited it correctly during the session. After a reload, asking "which uploaded document contains the exempt surplus of 1,250,000" returns "No uploaded document is currently available in the chat to substantiate an exempt-surplus balance of CAD 1,250,000, so I can't identify or cite its source." The document/context did not persist (consistent with /api/documents being empty), so provenance of document-sourced values is lost across sessions. By contrast the workflow-derived 172,900 IS traced (371,000 − 198,100). My ledger has 1,250,000 = document:sample; the app cannot reproduce that lineage after reload.
  - _Expected:_ Uploaded documents and their extracted values should persist so the assistant can always trace a value like exempt surplus 1,250,000 back to its source document.
  - _Screenshot:_ `finding-11.png`

### 🟡 MEDIUM (7)

- **[#1] "New workflow" button does nothing on Workflows hub**  _(dead-button)_
  - On /workflows-hub, clicking "New workflow" produced no navigation, dialog, or content change on two attempts. A 404 GET /api/auth/get-session appeared in console.
  - _Expected:_ Clicking "New workflow" should open a blank workflow canvas in the builder.
  - _Screenshot:_ `finding-1.png`
- **[#3] Block config overlay shows a centered empty-state instead of editable inputs**  _(ux)_
  - On the Foreign Affiliate Surplus workflow Build canvas, clicking blocks like "Process dividends & UFT" and "Opening surplus balances" opens a modal (ConfigurationOverlay/CalculationEngineWorkspace) whose body is a centered "flex-col items-center justify-center ... text-center" placeholder — no visible form fields to enter real numeric inputs (opening exempt/taxable surplus, dividend amount, UFT). A fiscalist cannot configure real inputs at the block level here.
  - _Expected:_ Clicking a calculation block should expose editable input fields to configure its calculation with real values.
  - _Screenshot:_ `finding-3.png`
- **[#5] Sina first returns a malformed keyword-dump answer, then "Searching the web…" with no result**  _(ai-accuracy)_
  - Asked for the federal SBD limit and full grind threshold. Sina replied with an incoherent fragment: "Official Canadian tax sources / CCPC small business deduction $500,000 taxable capital employed in Canada fully eliminated $50 million current rules / Searching the web…" — no coherent answer, and the "Searching the web…" state never resolved. A re-ask produced the correct answer ($500,000; $10M–$50M grind). Also every Sina reply echoes the user's question verbatim before answering.
  - _Expected:_ A single coherent answer on the first ask; the "Searching the web…" state should resolve; the assistant should not echo the prompt back.
  - _Screenshot:_ `finding-5.png`
- **[#6] FAPI workflow accepts absurd FX rate (12,000) with no validation, producing $300M output**  _(validation)_
  - In the FAPI Calculation Run tab, entering 12000 into the FX rate (USD→CAD) field is accepted without warning. Outputs recompute to Gross CAD 300,000,000.00 and Net FAPI CAD 297,720,000.00. No sanity bounds on the FX rate (a plausible range is ~1.0–1.7).
  - _Expected:_ FX rate should be range-validated (or at least flagged) so a clearly impossible rate doesn't silently produce a nine-figure result.
  - _Screenshot:_ `finding-6.png`
- **[#7] FAPI Run inputs have no accessible label association — can't target fields reliably**  _(accessibility)_
  - The FAPI Run tab has ~15 numeric inputs (FX rate, inclusion rate, Line A–H, FAT) but each is a bare textbox with no linked &lt;label for&gt;/aria-label — the descriptive text is a separate sibling node. As a result, typing addressed to a specific label ("FAT · Foreign accrual tax paid", "FX rate (USD → CAD)", "Feeds FAT deduction") all resolve to the FIRST textbox (FX rate). Screen-reader users and automation cannot distinguish the fields.
  - _Expected:_ Each input should have a programmatically associated label so it is individually addressable and accessible.
  - _Screenshot:_ `finding-7.png`
- **[#8] No mechanism to feed one workflow's output as input to another**  _(feature-gap)_
  - Workflow A (Foreign Affiliate Surplus) has an input block "FAPI & T1134 results — Cross-workflow reconciliation inputs", implying it should consume workflow B's (FAPI Calculation) output. But in the Run UIs there is no way to select/link workflow B's computed Net FAPI as an input to workflow A. Each workflow only accepts a sample/uploaded workbook; the cross-workflow linkage described in the overview is not operable.
  - _Expected:_ A way to pipe workflow B's approved output into workflow A's "FAPI & T1134 results" input, preserving lineage.
  - _Screenshot:_ `finding-8.png`
- **[#12] Sina sometimes returns a raw dump of the page DOM instead of an answer**  _(ai-accuracy)_
  - Asking a two-part provenance question caused Sina to reply with the entire page's text content (sidebar nav, worksheet lines, chat list) followed by an echo of my prompt — no actual answer. Re-asking a simpler version worked. The assistant occasionally leaks page scaffolding into its response.
  - _Expected:_ Sina should answer the question, never emit the surrounding page DOM.
  - _Screenshot:_ `finding-12.png`

### ⚪ LOW (2)

- **[#2] React hydration warning: nested &lt;button&gt; in block config overlay**  _(console-error)_
  - Opening the "Process dividends & UFT" block config (ConfigurationOverlay → CalculationEngineWorkspace) logs: "In HTML, <button> cannot be a descendant of <button>. This will cause a hydration error." A nested-button DOM structure can break click handling and accessibility.
  - _Expected:_ No nested interactive elements; clean DOM without hydration warnings.
  - _Screenshot:_ `finding-2.png`
- **[#10] Results worksheet labels the CAD converted figure with "USD" suffix**  _(ui)_
  - Workflow A Results shows "Net surplus movement (CAD) 242,060.00USD" — the value is the CAD conversion (172,900 × 1.4) but is suffixed "USD". All figures carry a "USD" unit even the FX-converted CAD line, which is misleading for a currency-sensitive surplus computation.
  - _Expected:_ The CAD line should be labeled CAD.
  - _Screenshot:_ `finding-10.png`

## Provenance ledger (data → origin)

_The worker's ground truth: each value it captured and where it came from._

- **Net surplus movement (pre-FX)** = `172,900.00`  ← _workflow A (Foreign Affiliate Surplus) Run output: max(income 371,000 − expense 198,100, 0)_
- **Net surplus movement (CAD)** = `233,415.00`  ← _workflow A Run output: net 172,900 × FX 1.35 (verified correct)_
- **Workflow A recompute verified** = `FX 1.40 → 242,060.00`  ← _workflow A Run: changed FX from 1.35 to 1.40, output recomputed correctly (172,900×1.4)_
- **Exempt surplus (Northwind Ireland Ltd.)** = `1,250,000`  ← _document:sample (sample-company-tax-document.txt)_  (deductible under 113(1)(a) when paid to parent)
- **FAPI 2024** = `87,500`  ← _document:sample_
- **Taxable surplus** = `340,000`  ← _document:sample_
- **Exempt surplus deductibility (chat)** = `1,250,000 deductible under 113(1)(a)`  ← _chat:reply (Sina) referencing uploaded document_
- **Net FAPI inclusion after 91(4) deduction** = `39,500`  ← _chat:reply (Sina); 87,500 − (12,000×4.0=48,000); verified correct_
- **Workflow B FAPI Brut (sample)** = `25,000 (Net FAPI 24,810)`  ← _workflow B (FAPI Calculation) Run output, sample workbook_  (intended to feed net FAPI back into workflow A surplus reconciliation)
- **FX rate provenance (workflow B)** = `overrideRate 12000; rateProvider bank_of_canada; feeds FAPI Summary Engine`  ← _workflow B "where it comes from" drill-down (traceability feature works)_
- **Chat workflow-awareness verified** = `Sina correctly described workflow A steps + data lineage (matches read_workflow: 20 blocks/19 edges)`  ← _chat:reply describing builder workflow A_
- **Generated UI relevance** = `Dashboard shows net 172,900 USD / 242,060 CAD / FX 1.4 — matches workflow A`  ← _chat:reply (Sina generated UI)_

## Captured browser errors

- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[console]` In HTML, %s cannot be a descendant of <%s>.
This will cause a hydration error.%s <button> button 

  ...
    <ConfigurationOverlay overlayId="overlay-17...">
      <div className="flex h-[85...">
        <SmartOverlayHeader>
        <div className="flex min-h...">
          <CalculationEngineWorkspace block={{id:"pf-sur...", ...}} createTermRequest={0} disabled={false} edges={[...]} ...>
         … [truncated 1827 chars]
- `[console]` <%s> cannot contain a nested %s.
See this log for the ancestor stack trace. button <button>
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[console]` [CopilotKit] Agent error: A positive credit balance is required for all requests, including BYOK, so fallback providers remain available. Add credits at https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dtop-up to continue. 
  Code: agent_run_error_event 
  Context: {source: onRunErrorEvent, event: Object, runtimeErrorCode: undefined, agentId: default} 
  Stack: Error: A positive credit ba… [truncated 583 chars]
- `[console]` [CopilotKit] sendMessage error: A positive credit balance is required for all requests, including BYOK, so fallback providers remain available. Add credits at https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dtop-up to continue. Error: A positive credit balance is required for all requests, including BYOK, so fallback providers remain available. Add credits at https://vercel.com/d?to=%2F%… [truncated 448 chars]
- `[console]` [CopilotKit] Error (agent_run_error_event): Error: A positive credit balance is required for all requests, including BYOK, so fallback providers remain available. Add credits at https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dtop-up to continue.
    at Object.onRunErrorEvent (http://localhost:5173/node_modules/.vite/deps/chunk-KEZBGZH5.js?v=488ebfb6:5903:40)
    at http://localhost:5173… [truncated 342 chars]
