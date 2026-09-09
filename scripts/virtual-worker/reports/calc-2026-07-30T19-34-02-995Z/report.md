# Virtual worker run — Enter values and verify the results are correct

- **Persona:** `calc`
- **Base URL:** http://localhost:5173
- **Model:** anthropic/claude-opus-4-8 (effort: medium)
- **Steps used:** 29/40
- **Started:** 2026-07-30T19:34:02.995Z
- **Finished:** 2026-07-30T19:38:01.777Z
- **Findings:** 7  ·  **Captured errors:** 0

## Agent summary

Tested all four calculation surfaces as a corporate-tax fiscalist, hand-computing expected results before comparing.

/surplus (Reg. 5907 rollforward): FX conversions (@1.4782) and the Hybrid column are correct, but found (1) Exempt Surplus closing balance omits the (145,000) ABR adjustment — app shows 2,114,000 vs correct 1,969,000 [HIGH]; and (2) Taxable Surplus double-counts the same (312,000) FAPI figure shown on 3 linked rows, giving (505,600) [QUESTION].

/fapi (FAPI worksheet): (3) deductible expenses of 3,000 are ignored — "Deductions" line reads 0.00 [HIGH]; (4) the ss.91(4) FAT deduction uses a wrong factor of 1.9 (FAT 100 → 190) instead of the corporate relevant tax factor of 4.0 [HIGH]. FX (USD→CAD) conversions are correct.

/t1134: Part III Section 3 FAPI figures reconcile correctly to their components across all affiliates (no error there).

/worksheets + /bu-overview: (5) per-LOS revenue sums to $11.2M but Revenue YTD headline shows $10.2M [MEDIUM].

Sina chat: (6) states the corporate relevant tax factor is 1.9 and computes 12,000×1.9=22,800 — wrong; it is 4.0 → 48,000 [HIGH]. This same wrong 1.9 factor is baked into the /fapi calculator. (7) Sina leaked internal scaffolding/config ("FIRECRAWL_API_KEY is not set...") and produced a garbled reply [MEDIUM].

Overall health: UI navigation works and FX conversions are reliable, but the core tax engines have material calculation errors — a dropped surplus adjustment, ignored FAPI deductions, and an incorrect relevant tax factor shared by both the calculator and the AI. These are the kind of errors that would produce wrong filings, so the calculation layer needs correction before trusting output.

## Findings

### 🟠 HIGH (4)

- **[#1] Surplus worksheet Exempt Surplus closing balance excludes the ABR adjustment (off by 145,000)**  _(ai-accuracy)_
  - On /surplus (Northstar SAS Paris, 2025), the Exempt Surplus column has: OB 1,245,000; NI 2,180,000; OCI 0; ABR (Active business income adjustments, foreign rules) (145,000); Depreciation/CCA (98,000); Accruals (47,000); Income taxes (654,000); WHT (12,000); Dividends out of exempt (500,000); all other lines 0. Summing every line gives a closing balance of 1,969,000. The app displays a closing Exempt Surplus of 2,114,000. The difference is exactly 145,000 — the ABR line — indicating the ABR (145,000) reduction is being dropped from the ES rollforward. The CAD conversion (2,114,000 × 1.4782 = 3,124,915) is internally consistent with the wrong figure, so the error is upstream in the summation.
  - _Expected:_ Exempt Surplus closing balance = 1,969,000 (CAD @1.4782 = 2,910,776), including the (145,000) ABR book-to-tax adjustment.
  - _Actual:_ App shows Exempt Surplus closing = 2,114,000 (CAD 3,124,915), which is 145,000 too high — the ABR line is omitted from the total.
  - _Screenshot:_ `finding-1.png`
- **[#3] FAPI worksheet ignores deductible expenses — "Deductions" total shows 0 despite 3,000 entered**  _(ai-accuracy)_
  - On /fapi (SAS Paris, 2025): Property income A = 22,000 USD, Deductible expenses EXP = 3,000 USD, Gains on disposition B = 3,000 USD, all other components 0. The Results summary shows Gross 25,000, Deductions 0.00, FAPI brut 25,000. The 3,000 deductible expenses is not being subtracted anywhere — the "Deductions" line reads 0.00. Gross FAPI is correctly 22,000 + 3,000 = 25,000, but net-of-expenses FAPI should be 25,000 − 3,000 = 22,000.
  - _Expected:_ FAPI brut = 25,000 − 3,000 deductible expenses = 22,000 USD; Deductions line should show 3,000.
  - _Actual:_ Deductions = 0.00 and FAPI brut = 25,000 USD — the deductible expenses are dropped from the calculation.
  - _Screenshot:_ `finding-3.png`
- **[#4] FAPI FAT deduction uses wrong relevant tax factor (shows 190 for FAT 100; ss.91(4) requires ×4.0)**  _(ai-accuracy)_
  - On /fapi, Foreign accrual tax (FAT) = 100 USD. Under ss.91(4) ITA the deduction from FAPI is FAT × relevant tax factor, and for a corporation the relevant tax factor is 4.0, giving a deduction of 400 USD. The app shows a "FAT deduction" of 190.00 USD (Net FAPI = Gross 25,000 − 190 = 24,810). 190 corresponds to a factor of 1.9, which is not the statutory relevant tax factor. The FAT deduction is being computed with an incorrect multiplier.
  - _Expected:_ FAT deduction = 100 × 4.0 = 400 USD (relevant tax factor for a corporation under the s.248(1)/91(4) definition).
  - _Actual:_ FAT deduction = 190.00 USD (implied factor 1.9), producing Net FAPI 24,810 USD instead of the correct amount.
  - _Screenshot:_ `finding-4.png`
- **[#6] Sina states the corporate relevant tax factor is 1.9 (should be 4.0), giving a wrong ss.91(4) deduction**  _(ai-accuracy)_
  - Asked Sina for the relevant tax factor for a corporation under s.248(1) and its use in the ss.91(4) FAT deduction. Sina answered: "For a corporation, the relevant tax factor (RTF) in subsection 248(1) is 1.9" and computed FAT 12,000 × 1.9 = $22,800. The corporate relevant tax factor under the s.248(1) definition is 4.0 (1 divided by 25%), and has been 4.0 since 2016; 1.9 is the factor for an individual/trust, not a corporation. The correct ss.91(4) deduction on FAT of 12,000 is 12,000 × 4.0 = $48,000 (subject to the s.91(1) inclusion cap). This matches finding #4 — the /fapi worksheet also uses 1.9 (FAT 100 × 1.9 = 190), so the wrong factor is baked into both the AI and the calculator.
  - _Expected:_ Relevant tax factor for a corporation = 4.0; ss.91(4) deduction on FAT 12,000 = 48,000 (capped at the s.91(1) FAPI inclusion).
  - _Actual:_ Sina: RTF = 1.9; deduction = 12,000 × 1.9 = $22,800.
  - _Screenshot:_ `finding-6.png`

### 🟡 MEDIUM (2)

- **[#5] BU Overview: per-LOS revenue sums to $11.2M but "Revenue YTD" shows $10.2M**  _(ai-accuracy)_
  - On /bu-overview the Revenue Attainment by LOS lists: TC $1.2M, ICT $2.1M, M&A $3.4M, IND $0.6M, R&D $0.8M, US $1.1M, TP $0.9M, PE $0.4M, LIT $0.7M. These sum to $11.2M. However the headline "Revenue YTD" card reads $10.2M (73% of $14.0M target). The per-LOS breakdown does not reconcile to the reported total (off by $1.0M). Note $10.2M/$14.0M = 72.9% which is consistent with the 73%, so the headline total is internally consistent — the LOS breakdown is what over-sums.
  - _Expected:_ Sum of per-LOS revenue should equal the Revenue YTD total ($10.2M), or the total should reflect the $11.2M sum.
  - _Actual:_ Per-LOS revenue sums to $11.2M while Revenue YTD is reported as $10.2M.
  - _Screenshot:_ `finding-5.png`
- **[#7] Sina leaks internal config error to the user ("FIRECRAWL_API_KEY is not set in .env.local")**  _(ux)_
  - When asking Sina a tax question, the assistant's reply included raw internal scaffolding and an error string: it echoed the prompt, printed a search query "site:laws-lois.justice.gc.ca Income Tax Act 248 relevant tax factor 1.9 corporation 91(4)...", and then "FIRECRAWL_API_KEY is not set in .env.local — it is required for Canadian tax lookups." An earlier reply also returned garbled text ") Canada / Searching the web…" with no real answer. This exposes backend configuration/implementation details to end users and indicates web-lookup grounding is not actually functioning, so answers are unverified model output.
  - _Expected:_ Sina should return a clean answer and, if a lookup backend is unavailable, degrade gracefully without exposing environment-variable names or internal search queries.
  - _Actual:_ Reply contained internal search queries and "FIRECRAWL_API_KEY is not set in .env.local"; a prior reply was garbled/incomplete.
  - _Screenshot:_ `finding-7.png`

### ❓ QUESTION (1)

- **[#2] Taxable Surplus column shows the same (312,000) FAPI figure on 3 linked rows — total appears to count it twice**  _(ux)_
  - On /surplus Taxable Surplus column, three rows all show (312,000): "CDN adjustments (businesses other than active)", "FAPI recharacterization (ss.95(2)) — LINKED FAPI", and "5907(2)(a) FAPI inclusion — LINKED FAPI". Plus OB 312,000, Income taxes (93,600), Dividends out of taxable (100,000). The displayed closing TS is (505,600), which equals 312,000 − 312,000 − 312,000 − 93,600 − 100,000 (i.e. two of the three 312,000 lines counted). If these three rows are the same underlying FAPI amount, only one should reduce surplus (expected closing ≈ (193,600)); if they are genuinely three separate adjustments the closing should be (817,600). Either way the presentation is ambiguous and likely double-counts the FAPI inclusion.
  - _Expected:_ Each economic adjustment should be included exactly once; the same FAPI amount shouldn't appear on three linked rows in a way that double-counts it in the total.
  - _Actual:_ Closing Taxable Surplus (505,600) reflects the 312,000 FAPI figure being deducted twice.
  - _Screenshot:_ `finding-2.png`

## Captured browser errors

_None._
