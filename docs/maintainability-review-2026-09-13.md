# Strict engineering review — September 13, 2026

## Rating before the refactor

**Vibecode score: 8/10**, where 0 means disciplined, predictable engineering and
10 means accumulated behavior whose safety depends on remembering incidental
details. **Maintainability: approximately 4/10.** These are subjective engineering
judgments grounded in the inspected code, not an industry certification or a
measurement of the product's commercial value.

The application has useful functionality and meaningful deterministic calculations.
Its principal weakness is the cost and uncertainty of changing them. A passing
typecheck and a polished interface suggest stronger guarantees than the boundaries
actually provide. A maintainer must frequently know which of several similarly
named implementations is active and which view owns a piece of state.

| Dimension | Before / 10 | Weight | Assessment |
| --- | ---: | ---: | --- |
| Architectural boundaries | 3 | 20% | Server runtime imported frontend source behind a bundler alias and handwritten declarations. |
| Change locality | 3 | 20% | Registries, factories, storage, samples, rendering, and orchestration were concentrated in a few large modules. |
| Types and contracts | 4 | 15% | Many useful types existed, but runtime data validation and cross-package agreement were weaker than their signatures implied. |
| State and persistence | 4 | 15% | Revision checks and backups existed; module-global sync state and shallow restore validation made edge cases difficult to reason about. |
| Tests | 6 | 15% | Real regression coverage existed, including invalid inputs and export arithmetic, but many deterministic assertions required a browser. |
| Reproducibility and enforcement | 4 | 10% | Workspace typechecks and scripts existed; no tracked CI/lint/format boundary system was found in the reviewed tree. |
| Documentation and discoverability | 3 | 5% | Useful audit notes coexisted with stale source comments and inactive route implementations. |

Weighted maintainability score: **3.85/10**, rounded to 4. The separate vibecode
score describes accumulated coupling and implicit assumptions; it is not calculated
as exactly ten minus that weighted score.

## Evidence and consequences

### 1. The typecheck did not verify the real server/frontend contract

`artifacts/api-server/build.mjs` aliased `@` into the frontend. Files such as
`src/types/web-agent-lab.d.ts` manually restated the exports the server expected.
TypeScript could accept the declaration while esbuild bundled a different signature.
This is a particularly expensive failure mode: an apparently successful check can
give a reviewer confidence in precisely the boundary it has not checked.

The extraction exposed a concrete example. The agent used
`result.usage.cachedInputTokens`, absent from the installed SDK's usage type. The
installed SDK exposes the value under `inputTokenDetails.cacheReadTokens`. The
shared package now checks that implementation directly and uses the typed field.
The template runner also passed its snapshot through `as never`; the snapshot
contract is now a real `WorkflowDefinition`, removing that bypass and several
double assertions in template configs.

### 2. Central modules carried unrelated reasons to change

The pre-refactor scan found 773 TypeScript/TSX files across the inspected source,
library, script, and test roots; 67 exceeded 500 lines and 24 exceeded 1,000 lines.
Counts include generated/data files and therefore are indicators, not defects by
themselves. The serious cases were executable behavior:

- `local-tool-registry.ts`: 6,229 lines, including tool types, parsing, arithmetic,
  evidence formatting, executor definitions, adapters, and resolution rules.
- `local-fiscal-workflow.ts`: 5,296 lines, including domain aliases, canvas
  conversion, storage, publishing, demo fixtures, and workflow factories.
- `workflow-toolbar.tsx`: 3,185 lines, including validation, imports, API polling,
  execution, saving, and component rendering.

A fix to a data parser should not require loading the mental context for output
previews and a toolbar. Moving code into separate files alone would be insufficient:
the extracted code now has direct owner imports, and a check rejects runtime import
cycles in those maintained modules. That check caught an actual cycle during the
refactor: result helpers depended on tool resolution, which also imported the full
registry. ID resolution and registry lookup are now separate.

### 3. Persistence had hidden state and weak trust boundaries

The old library validator checked IDs and whether several top-level values were
arrays, then cast the result to `PersonalWorkflow`. A structurally wrong block or
saved run could survive import and fail later in an editor or result view.

Sync state was a collection of module-level mutable variables. Detailed inspection
also found that a dirty, empty local library could be hydrated from the server,
resurrecting intentionally deleted workflows; and that old requests could report
failure after a workspace switch. Revision metadata could be lost in memory when
writing it to full browser storage failed.

The refactor validates nested persisted types and library relationships, preserves
unknown extension fields, restores serialized dates, and rejects unsupported backup
envelopes. Sync is an injected service with tests for concurrent edits, offline
retry, conflicts, deletion, and stale requests. Invalid local bytes are preserved
for raw export instead of being overwritten by an empty fallback.

Running all 17 executable templates through this validator exposed previously
hidden contract errors: `triggers` was used where the domain requires `initiates`,
and currency-rate sources were omitted from source metadata. The tightened types
also caught a historical holiday template using `data_flow`. Templates now use
canonical relationships; those two saved legacy aliases migrate on read. Currency
sources now have an explicit contract, and catalog source metadata is tested.

### 4. Execution rules were not clearly owned by an application layer

The Build/Run atom performed version selection, execution, recording, canvas state
updates, and toast notifications in one callback. Chat had its own recording code.
The saved-version path also silently selected the latest version if an explicitly
requested version did not exist.

Versioning, saved execution, and recording are now application commands without
React, Jotai, or toast imports. The views remain adapters. Chat shares the recording
rule. A missing requested version fails before invoking the executor. This gives
the rules a place to be tested independently and prevents each UI from acquiring
its own definition of a saved run.

### 5. There were competing maps of the application

Next.js API handlers remained under the frontend source although Vite/Express was
the active stack. Repository memory even documented a previous fix made necessary
by the difference between the live Express route and the inactive Next route.
Those handlers are now explicitly archived after checking their active imports.

Two UI primitive trees remain historically distinct. Their buttons now share the
implementation while retaining their existing styles. A baseline prevents new
imports from spreading the legacy tree. This is a controlled migration, not a claim
that every primitive has already been unified.

The existing generated OpenAPI specification covers health. Workflow-library
transport now has a shared runtime-validated protocol, but the older platform API
client still contains other manually typed endpoints. That remaining debt is explicit.

### 6. Tests were valuable but unnecessarily expensive to run locally

The existing browser regressions are a major reason the original score is not 9 or
10. They check meaningful behavior, not only screenshots. However, several arithmetic
and missing-field cases import domain modules inside `page.evaluate`, coupling
calculation feedback to browser startup and the development server.

Direct tests now cover the arithmetic, missing fields, source mapping, library
contracts, version selection, and sync transitions. Browser regressions remain for
the real UI integration. The checks are wired into `pnpm run verify` and CI rather
than relying on a developer remembering a collection of commands.

## What this refactor does not earn

This work materially improves maintainability; it does not turn the application
into a finished production platform. Several inspector/editor files still exceed
1,000 lines. Their draft-editing behavior needs careful extraction. Legacy tool
adapters and some handwritten REST contracts remain. Formatting enforcement is
scoped to maintained modules, and remaining TypeScript exclusions are documented.

The live Express middleware still assigns `req.userId = "anonymous"`. A private
workspace recovery code is a separate possession-based mechanism, not authenticated
tenant isolation for every route. Implementing the identity model is a separate
product/security change. Passing deterministic sample tests also does not establish
correctness for every uploaded dataset or every live model/provider interaction.

I would not award a 2/10 vibecode score after this refactor. A provisional **6/10**
is more defensible: the critical shared boundaries and change safeguards improve,
while significant older application code still needs the same treatment. The next
material improvement should come from reducing the large inspector/editor modules,
migrating the remaining active API contracts, and proving the authenticated data
ownership model—not from adding another abstraction layer by default.

## Verification record

Local checks completed:

- `pnpm run verify`: passed schema generation consistency, architecture checks
  across 792 source files, maintained-module formatting, workspace and test
  typechecks, and 22 direct tests. One test runs and roundtrips all 17 executable
  template results; another verifies all Source catalog metadata types.
- `pnpm run test:workflow-reliability`: all 15 browser tests passed in the full
  rerun. An earlier full run timed out opening Build; the isolated case and the
  subsequent full run passed. The timeout's cause was not established.
- API and frontend production builds passed locally. Frontend warnings remain
  for large chunks, dependency browser externals, and sourcemap locations. The
  main bundle is about 2.1 MB and the CopilotKit chunk about 3 MB before gzip;
  this refactor does not earn a performance claim.

These checks ran on Windows with Node 20.19.5 and pnpm 10.33.2. The added hosted
CI targets Node 24 on Linux and has not been executed here. The isolated suite
does not prove real Postgres persistence, authenticated tenancy, live provider
behavior, or correctness for every uploaded dataset.

Existing user changes were preserved; no commit, push, or deployment is part of
this refactor.
