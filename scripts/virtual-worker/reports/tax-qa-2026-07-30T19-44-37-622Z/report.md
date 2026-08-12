# Virtual worker run — Stress-testing Sina with Canadian corporate tax questions

- **Persona:** `tax-qa`
- **Base URL:** http://localhost:5173
- **Model:** anthropic/claude-opus-4-8 (effort: medium)
- **Steps used:** 13/40
- **Started:** 2026-07-30T19:44:37.622Z
- **Finished:** 2026-07-30T19:48:04.397Z
- **Findings:** 2  ·  **Captured errors:** 0

## Agent summary

Stress-tested Sina with 6 Canadian corporate-tax questions. Tax accuracy was strong — all six answers were substantively correct: (1) SBD business limit $500,000, shared among associated corps, ground down by taxable capital/AAII ✓; (2) T1134 for Dec 31, 2025 year-end due Oct 31, 2026 (10 months) ✓; (3) FAPI = passive income of a CFA taxed currently on the shareholder's participating %, with FAT deduction ✓; (4) exempt surplus (treaty-country ABI, s.113(1) deductible) vs taxable surplus (FAPI/non-treaty ABI, taxable with UFT relief) ✓; (5) general federal rate 15% (28% net less 13% GRR) ✓; (6) French dividend answer covering all four surplus pools, withholding, and prior FAPI inclusion ✓. No hallucinated numbers or invented rules.

Two issues found: (medium) a raw internal config error "FIRECRAWL_API_KEY is not set in .env.local" leaked into a chat answer; (question/medium) Sina displays a "Searching Official Canadian tax sources / Searching the web…" indicator implying grounded, cited answers, but the retrieval step is not actually configured and no citations are ever shown — misleading for a tax professional relying on source authority. Overall app health: chat functional and tax-accurate, but grounding/retrieval is non-functional and internal errors are exposed to users.

## Findings

### 🟡 MEDIUM (1)

- **[#1] Internal config error (FIRECRAWL_API_KEY) leaked into Sina chat answer**  _(ux)_
  - Asked Sina "When is a T1134 due for a December 31 year-end?" The chat displayed a raw internal error string: "FIRECRAWL_API_KEY is not set in .env.local — it is required for Canadian tax lookups." before giving the answer. Internal environment/config errors should not be exposed to end users; it also implies the web-lookup / RAG grounding is not actually functioning.
  - _Expected:_ User-facing chat should not surface raw server env-var errors; either the lookup works or a graceful message is shown.
  - _Actual:_ "FIRECRAWL_API_KEY is not set in .env.local — it is required for Canadian tax lookups." appeared inline in the assistant response.
  - _Screenshot:_ `finding-1.png`

### ❓ QUESTION (1)

- **[#2] Sina shows "Searching Official Canadian tax sources" but web lookup is not actually configured**  _(ai-accuracy)_
  - Every Sina answer displays a UI stage "Official Canadian tax sources" plus a search query and "Searching the web…". However on the T1134 question the chat exposed "FIRECRAWL_API_KEY is not set — required for Canadian tax lookups," indicating the retrieval/grounding step is not actually running. Answers appear to come purely from the base model, not from cited CRA sources. The "searching official sources" indicator is therefore misleading to a tax professional who may believe answers are grounded/cited. No source citations were ever shown.
  - _Expected:_ Either genuinely retrieve and cite CRA/ITA sources, or don't display a "searching official Canadian tax sources" indicator that implies grounded answers.
  - _Actual:_ "Official Canadian tax sources … Searching the web…" shown, but FIRECRAWL key missing; answers ungrounded and uncited.
  - _Screenshot:_ `finding-2.png`

## Captured browser errors

_None._
