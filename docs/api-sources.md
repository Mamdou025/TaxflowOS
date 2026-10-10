# Reusable API Source

An API Source fetches JSON and exposes either table rows (the existing mode) or
named values. Its name is independent of its provider. For example, name a block
Bank of Canada FX Rate and select a numeric `fxRate`, or name it Company Details
and select the text `companyName` from `company.name`.

## Configuration and execution

Choose **Sources → API Source**, configure a custom URL or connector preset, then
choose **Named values**. Each output has a unique name, response path and type:
number, text, boolean or JSON. Empty path selects the response itself. Dotted paths
support array indexes; `*` selects array elements for the numeric mean operation.
Missing observations are skipped only when explicitly selected. Empty strings,
booleans and invalid numbers are never converted to zero.

Send fetches through the existing authenticated HTTP route, using its existing
request, secret-reference and network policies. A successful mapping saves the
response and metadata. A failed request or mapping leaves the previous capture
intact. A run replays the saved response; it does not fetch automatically. Changed
request settings or mappings require another fetch. Named outputs, selection paths,
fetch metadata and explicit overrides remain inspectable in the run evidence.

The downstream role is `named_values`, containing `namedValues`. Each downstream
tool still applies its own input requirements: a text value is not a numeric
calculation operand. Existing row-based API sources retain their mode and outputs.

## FAPI

The new FAPI template has one API Source named Bank of Canada FX Rate. Its connector
requests daily observations for the chosen currency and year; a generic mean
mapping produces positive `fxRate`. This preserves the prior average-of-published-
daily-observations rule, rather than introducing a different rate-selection policy.
The existing workbook draft override (1.35 in the template) remains explicit and
takes precedence. Clear it to use a fetched response. Overrides are labelled as
manual and do not claim to be fetched Bank of Canada evidence.

An older FAPI draft can use **Upgrade FAPI API source** in the workflow menu. This
replaces the old currency source and its redundant Valet source, retaining the
block name, position and explicit override. Save through the normal draft flow.
Saved versions, runs and backups are not rewritten. Old saved rates without raw
observations require a new fetch; the upgrade does not fabricate a response from
a scalar. Customized incoming/outgoing connections are rejected for manual review.
Legacy currency executors remain available for historical replay.

SQL/database and document sources are unchanged. The named-value output shape can
be adopted by those source adapters in a later change without adding provider
names or fiscal rules to their generic engines.

## File responsibilities and before/after behavior

Paths below are relative to the repository root.

| File | Purpose and change |
| --- | --- |
| `lib/source-connectors/src/response-values.ts` | New generic selection/type-validation layer; JSON can now yield named scalar or structured values without fiscal rows. |
| `lib/source-connectors/src/http-json.ts` | Exposes the shared mapping API. Existing row fetch behavior is unchanged. |
| `lib/source-connectors/src/connectors.ts` | Adds a Bank of Canada mean-output preset; provider details become ordinary API/mapping configuration. Existing daily-row preset remains available. |
| `artifacts/api-server/src/routes/http-source.ts` | Adds named-output mode to the existing fetch route; successful calls return the captured payload and selected values. Raw/chat and row modes remain supported. |
| `lib/workflow-executors/src/api-snapshot.ts` | Includes named-output mapping settings in freshness signatures; old row signatures remain compatible. |
| `lib/workflow-executors/src/execution/blocks/source/http-json/run.ts` | Dispatches named-output mode to its focused executor; existing row execution remains intact. |
| `lib/workflow-executors/src/execution/blocks/source/http-json/run-values.ts` | New deterministic replay of named values, explicit overrides, freshness checks and per-output evidence. |
| `lib/workflow-executors/src/execution/blocks/source/http-json/definition.ts` | Advertises the generic named-values output alongside existing row outputs. |
| `lib/workflow-core/src/application/session-inputs.ts` | Allows captured payloads and mapping configuration in API source session edits, plus declared override fields; preserves the surrounding session-edit boundary. |
| `lib/workflow-core/src/application/api-source-upgrade.ts` | New explicit draft-only upgrade; refuses custom connections and preserves historical snapshots. |
| `lib/workflow-core/src/application/commands.ts` | Exports the upgrade command. No other command behavior change is intended. |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/source-viewers/api-output-mapping-editor.tsx` | New output name/path/type/reduction editor and saved-response preview. |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/source-viewers/http-json-source-panel.tsx` | Adds named-output selection, capture and preview; preserves failed-fetch evidence and sends JSON-object POST bodies correctly. |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/toolbar/local-studio-top-bar.tsx` | Offers API Source instead of the specialized FX shortcut and provides the explicit older-draft upgrade. |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/edges.ts` | Connects named-output API sources to calculation inputs using `named_values`; row-mode defaults stay unchanged. |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/sample-workflows/fapi-template.ts` | Replaces the two-source FX arrangement with one configured API source and a direct named-value binding. |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/block-catalog-data.ts` | Describes API outputs generically and marks the old FX source as compatibility-only. No executor behavior change. |
| `tests/unit/api-source-values.test.ts` | Covers typed outputs, invalid/missing/stale data, overrides, FAPI delivery and historical-version preservation. No product behavior change. |
| `e2e/workflow-reliability.spec.ts` | Adds an editor test for text capture and failed-fetch evidence preservation. No product behavior change. |
| `docs/FUNCTIONALITY.md`, `docs/ARCHITECTURE.md`, `docs/api-sources.md` | Describe the implemented behavior, ownership and compatibility limits. No runtime behavior change. |


## Verification on 2026-10-04

- Pinned toolchain doctor, generated-contract check, architecture check (including
  size boundaries), maintained-file formatting, repository TypeScript and test
  TypeScript checks passed.
- All six focused API-source tests passed, including the final draft-entry-point
  preservation check. The broader unit run reported 127 passes and one failure:
  the unrelated `microsina-foundry.test.ts` process stalled without progress and
  was stopped after about five minutes. Therefore `pnpm run verify` did not pass.
- The remaining worker suite passed 37 tests; workflow-core test TypeScript and
  all 27 workflow-core tests passed when run separately.
- A live request through `boc.fx_average` and the shared HTTP/mapping functions
  returned HTTP 200 and `fxRate = 1.3977622489959831` for USD/CAD in 2025. This
  verifies the connector path, not a deployed authenticated UI request.
- `pnpm run test:workflow-reliability --grep 'generic API source'` failed during
  application warmup. The same test run in an isolated component harness rendered
  the editor but timed out waiting for saved-response confirmation. Browser
  verification remains unresolved; no assertions or production safeguards were
  weakened to produce a pass.
- `git diff --check` passed. No commit, push or deployment was performed by this
  task. Concurrent commits appeared during implementation and included portions
  of these changes; existing work and those commits were preserved.
