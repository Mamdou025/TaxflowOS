# workflow-contracts

Persisted TypeScript domain types (`src/domain/*`, `library-types.ts`, `storage-protocol.ts`,
`tool-types.ts`, `execution-result.ts`) and their generated Zod validators
(`generated-schemas.ts`). See the root [AGENTS.md](../../AGENTS.md) and
[docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md#persisted-contracts) ("Persisted
contracts" section) before editing here.

## The one rule that matters here

`generated-schemas.ts` is generated, not hand-maintained. If you change a type under
`src/domain/` (or `library-types.ts`), run:

```sh
pnpm run contracts:generate
```

and commit the result. `pnpm run contracts:check` (part of `pnpm run verify`) fails the
build on stale generated output — it is not a style nit, it's checking that the schema a
server/browser is validating against actually matches the type you shipped.

## These types are backup/storage formats, not just interfaces

A `DocumentExtraction`, a `PersonalWorkflow` run entry, a library envelope — these are
shapes that get serialized into `workspace_libraries.payload` and v1 portable backups
(`{ format: 'taxflow-workflow-backup-v1', library }`). Changing a field's meaning or
removing one is a migration-shaped change even though there's no SQL involved: existing
saved libraries and exported backups were written against the old shape. Prefer additive,
optional fields; if a field must change meaning, check `src/storage-protocol.ts` and
`library-types.ts` for envelope-version handling first.

## Only `zod` as a dependency

No React, no database client, no model provider — same rule as
[workflow-core](../workflow-core/AGENTS.md), enforced the same way.
