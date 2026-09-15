# TaxflowOS

Workflow authoring, deterministic workpapers, and an assistant workspace.
The live application uses React/Vite, Express, and PostgreSQL.

Start with [current functionality and limits](docs/FUNCTIONALITY.md) for what the
application supports today and [readiness evidence](docs/readiness-2026-09-15.md)
for the latest local verification.

Read [the architecture and ownership guide](docs/ARCHITECTURE.md) before changing
workflow execution, persistence, or server routes.

The [Phase 0 product blueprint](docs/product/README.md) defines the chat-first
product direction, navigation, target ownership, user journeys and open decisions.
It distinguishes intended behavior from the current implementation.

## Development

Use Node 24.21.0 and pnpm 10.33.2. Read [development setup](docs/DEVELOPMENT.md)
for the native and Docker paths, environment variables and checkpoint recovery.
Use a separate checkout for each dependency platform.

```sh
pnpm run doctor
pnpm install --frozen-lockfile
pnpm run verify
pnpm run test:workflow-reliability
```

`verify` runs the toolchain, schema, architecture, formatting, type, and direct-test checks.
The reliability suite starts its own frontend on an automatically assigned port
and mocks workflow storage. `pnpm run test:integration` and
`pnpm run test:workflow-persistence` start disposable Postgres/API stacks through
Docker. See [testing commands and failure reports](TEST.md) and
[the Phase 2 record](docs/phase-2-testing.md).

Use `pnpm run release:check` for the Docker-free release gate and
`pnpm run release:check:full` with Docker running for database restoration,
authenticated persistence and the complete release evidence. Phase 9 documents
the [operational guarantees and current performance budgets](docs/phase-9-operations.md).

Sign-in, workspace roles, legacy-library recovery and database upgrades are documented
in [the Phase 3 guide](docs/phase-3-access.md). Use `pnpm run test:phase3` for the full gate.
To operate without entering credentials, choose **Try demo** on the sign-in screen.
It opens a private guest workspace. Export workflow backups before choosing **Exit demo**.

Workflow definitions, application commands and graph execution are separated as described
in [Phase 4](docs/phase-4-workflows.md). Use `pnpm run test:workflow-core` for the portable
engine tests without a browser or model provider.

After editing persisted contract types, run `pnpm run contracts:generate`.
Use `pnpm run format` to format the maintained modules.

For work with Codex, start with [AGENTS.md](AGENTS.md), the reusable
[prompt templates](docs/PROMPTS.md), and [review guidance](docs/REVIEW.md).
