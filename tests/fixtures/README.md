# Synthetic test fixtures

These files contain invented data and no customer documents or credentials.

- `backups/legacy-v0.json` is a frozen, hand-authored bare backup from the legacy
  format. Its incomplete draft is allowed by storage validation; its historical
  `triggers` relationship must become `initiates` on restore. Draft and saved
  version names intentionally differ so a migration cannot replace history.
- `calculations/document-rows.json` has independently specified arithmetic,
  including a negative adjustment and an explicit zero. Expected output is 30.
- `backups/document-calculation-v1.json` is a synthetic, current-format saved
  graph for the production workflow-session smoke check. It was created once
  from the internal retired calculator definition, without stored runs or version
  copies. The smoke test imports it through the public backup UI, supplies its
  own workbook rows, and independently expects 200 × 2 = 400 followed by
  (200 + 50) × 2 = 500. It is not a historical migration fixture or an advertised
  workflow; never regenerate it to change a failing arithmetic expectation.
- Existing upload fixtures under `e2e/fixtures/demo` cover CSV, PDF, Word and Excel
  parsing. Browser tests create other small synthetic uploads in memory.

Do not regenerate legacy backups or expected outputs from the current implementation
to make a regression pass. Add a new fixture when the persisted format changes;
keep old supported fixtures as compatibility evidence.
