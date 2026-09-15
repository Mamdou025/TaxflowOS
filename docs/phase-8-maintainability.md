# Phase 8 — Maintained editor and dependency boundaries

Phase 8 reduces active workflow-editor duplication, consolidates the remaining
button compatibility path, retires two migrated workflow-engine facades and makes
those improvements enforceable. It changes module boundaries without changing who
owns workflow drafts, saved versions, review state or executions.

## Calculation editor boundary

The two calculation editing surfaces previously contained separate copies of the
same tokenizer, legacy-formula conversion, token keys, operator catalog and numeric
literal validation. They now use `calculation-editor-model.ts`. Token presentation
and run-result presentation live in their own components, while each editor keeps
only its interaction and layout responsibilities.

The formatted calculation mode panel declined from 1,043 lines to 493. The main
calculation editor declined from 683 lines to 636 while gaining the same shared
model. The model has direct unit coverage for source-qualified references,
functions, repeated tokens, legacy operations and malformed numeric literals.

Draft ownership did not move into the extracted components. Formula changes still
flow through the workflow configuration patch command, and review state remains in
its existing workflow/run owner. The browser regression creates a formula, opens
the saved workflow through a fresh route, reopens the term, verifies its rendered
formula and source reference, and compares the restored formula configuration with
the saved draft.

## Consolidated UI primitive

The six remaining callers of `components/ui/button.tsx` now import the shared
button implementation and variants directly. They explicitly select the legacy
visual variant so this consolidation does not restyle those controls. The obsolete
button facade was deleted, and six grandfathered legacy imports were removed from
the architecture baseline.

## Retired workflow adapters

`local-fiscal-workflow.ts` and `local-tool-registry.ts` had become re-export-only
compatibility facades. All browser audits now import the owning `workflow/*` or
`tools/*` modules, and both facades were deleted. Runtime execution remains in its
current adapter; this phase does not claim that the broader browser runtime has
already moved to a durable job service.

The architecture check now fails if a retired facade is restored or referenced by
active source or a browser test. It also resolves every browser test's dynamic
`/src` import and reports missing targets, so test-only dependencies cannot drift
silently. The maintained-path policy now covers the complete calculation-editor
area, enforcing formatting, no explicit `any`, no type suppressions and cycle
checks there.

## Acceptance evidence and limits

The Phase 8 calculation browser case verifies editor draft survival after route
navigation. The workflow reliability case verifies that editing calculation input
invalidates prior approval, and the shared execution case verifies that Build and
Run preserve the draft graph and recorded executions. The final focused reliability
set's 19 existing cases passed, including the new editor persistence assertion.
The two run-state navigation/reload cases were then added to that set and passed
2 of 2 in a focused run, bringing the normal reliability suite to 21 cases. The
production web build passed with the existing source-map,
browser-externalization and large-chunk warnings.

The Docker-backed workflow suite was attempted but could not start its disposable
database because Docker Desktop's engine was not running. The failure occurred
before application setup or a browser test. The focused browser suite, unit tests,
typecheck, architecture check and production build do not depend on that engine and
completed independently.

The final Phase 8 tree passes `pnpm run verify`, including 43 unit tests and 12
portable workflow-core tests.

## Local verification

Use the Node and pnpm versions pinned by the repository, then run:

```text
pnpm run verify
pnpm run test:workflow-reliability
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ai-workflow-builder run build
```

With Docker Desktop running, `pnpm run test:workflow-builder` additionally covers
the disposable Postgres and authenticated API path.
