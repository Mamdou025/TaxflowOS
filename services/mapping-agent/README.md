# Mapping Agent

This service is the provider-independent mapping layer for TaxflowOS. It reads source trial balances, identifies each foreign affiliate, applies a versioned workflow rule pack, emits structured and cited mapping decisions, and performs mandatory post-mapping validation.

The initial `fapi` workflow uses a deterministic provider. No Copilot, OpenAI, Anthropic, or other hosted AI service is required. A future local or hosted model can be added through the `MappingProvider` interface without changing ingestion, output schemas, evaluation, or validation.

## Current capabilities

| Capability | Current implementation |
| --- | --- |
| Workflow rules | `rule-packs/fapi/rule-pack.json` |
| Source format | Excel trial balances (`.xlsx`) |
| Affiliate detection | Legal-name patterns in the versioned rule pack |
| Evidence | Source file, sheet, label cell, value cell, value, and formula |
| Mapping provider | Deterministic workflow-rule provider |
| Provider extension | `src/providers/provider.ts` |
| Post-mapping validation | `src/validator.ts` |
| API | `GET` and `POST /api/mapping-agent` |
| Evaluation | FAPI case 001 with 44 accepted expectations |

## Run the accepted evaluation

From the TaxflowOS repository root:

```bash
pnpm agent:evaluate:fapi
```

The command writes `tests/fixtures/mapping/fapi/case-001/agent_evaluation_report.json` and exits with an error when a mapping is missing, extra, mismatched, or invalid.

## API

`GET /api/mapping-agent` returns the service status and available workflows.

`POST /api/mapping-agent` accepts `multipart/form-data` with the following fields:

| Field | Requirement | Description |
| --- | --- | --- |
| `workflow` | Optional | Defaults to `fapi` |
| `trialBalances` | Required, repeatable | One or more primary trial-balance files |
| `referenceDocuments` | Optional, repeatable | Historical workpapers used only as benchmark evidence |
| `includeBenchmarkCoverage` | Optional | Set to `true` to emit governed benchmark-only expectations |

Example:

```bash
curl -X POST http://localhost:3000/api/mapping-agent \
  -F workflow=fapi \
  -F trialBalances=@fa-01_trial_balance.xlsx \
  -F trialBalances=@fa-02_trial_balance.xlsx \
  -F referenceDocuments=@reference_fapi_workpaper.xlsx \
  -F includeBenchmarkCoverage=true
```

## Add another workflow

Create `rule-packs/<workflow>/rule-pack.json` using the schema in `src/rule-pack.ts`, then add an evaluation case under `tests/fixtures/mapping/<workflow>/`. The common ingestion, provider, output, and validation layers do not need to be rewritten.

## Add an AI provider later

Implement `MappingProvider` or wrap an external/local model with `AdapterMappingProvider`. The provider proposes mappings first; the common validator then rejects unsupported engine fields, missing evidence, affiliate-source leakage, benchmark evidence used as primary support, and duplicate mappings.

User corrections must not directly rewrite production rules. Store them as proposed examples or rule changes, rerun all accepted evaluations, and promote the revised rule pack only after review.
