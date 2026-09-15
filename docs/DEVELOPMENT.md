# Development setup

The reproducible toolchain is **Node 24.21.0** and **pnpm 10.33.2**. The Node pin
lives in [.node-version](../.node-version); pnpm is pinned in
[package.json](../package.json). CI reads those pins and Docker uses the same
versions. `pnpm run doctor` checks agreement before the normal verification suite.

Current native dependency overrides support Windows x64 and Linux x64/glibc.
Other architectures, macOS and Alpine/musl are not established paths for this
repository. Replit's `nodejs-24` module names a major version only; check its actual
patch with `doctor` before claiming the same environment was verified there.

## Choose one dependency environment per checkout

Use a separate clone/worktree for native and Docker development. Workspace-local
`node_modules` links as well as the root dependency directory are platform-specific.
Do not run a Linux install over a checkout currently used for native Windows work.

### Docker: complete application

Prerequisites: Docker Engine/Desktop running and Compose v2.24 or newer (optional
environment-file support). On Windows, Docker Desktop must use Linux containers.

From a clean development checkout, copy the environment template to a new
`.env.local` without overwriting an existing one. Set `APP_ORIGIN` to the exact
browser URL (default `http://localhost:5173`). Generate `BETTER_AUTH_SECRET` once:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Save the generated value privately in `.env.local`; keep it stable across restarts.
Do not use the example provider placeholders as real credentials. Leave unused
provider variables empty. Start the application (a new database is initialized automatically):

```sh
docker compose up --build -d
docker compose logs -f api web
```

The `deps` service installs once with `--frozen-lockfile`. The separate `migrate`
service waits for dependencies and a healthy database, then applies committed
migrations. The API waits for migration success; web waits for API health.
The root dependencies and pnpm package cache use named Linux volumes, avoiding
the cost of unpacking the package cache through a Windows source bind mount.
All four Node services use the same built development image, with pnpm installed at image-build
time from `packageManager`. Provider credentials are optional for basic startup;
AI/document integrations that need credentials remain unavailable until configured.
For an authorized caller without chat provider configuration, `/api/copilotkit` returns HTTP 503 with
`AI_PROVIDER_NOT_CONFIGURED`; the API and workflow features can still start.

Managed migrations replace schema push. For an existing Phase 2 database, follow
[the baseline and upgrade procedure](phase-3-access.md); the migration command does
not guess that existing tables are compatible. API startup refuses an unmigrated
schema and never creates a guest identity or application tables. A failed migration
stops startup; inspect it with `docker compose logs migrate api` rather than bypassing it.

Once the app is running, **Try demo**, the first button on the sign-in screen, opens Chat without
email/password entry. It creates a private guest session on demand and still requires
the configured API/database. Provider-dependent features require their usual setup.
Export workflow backups before exiting the demo; there is no password to recover
that session in another browser. See [demo access](phase-3-access.md#password-free-demo).

If an access check fails while the service is starting, the entry screen keeps
**Try demo** and **Retry access check** available. A successful subsequent check clears
the error automatically. Demo sessions still use the real API and their own workspace.

Default endpoints: frontend `http://localhost:5173`, API health
`http://localhost:5050/api/healthz`, Postgres on `localhost:5433`. The development
database is `taxflowos` with the local-only `postgres` username/password from Compose.

Use `.env.local` for provider configuration, starting from [.env.example](../.env.example)
without overwriting an existing file. Compose injects it when present; it is not
copied into the development image. Never expose server credentials through `VITE_`
variables, client bundles, logs or committed environment files.

```sh
docker compose exec api pnpm run doctor
docker compose exec api pnpm run verify
docker compose restart api
docker compose down
```

The frontend uses Vite HMR with polling for Windows bind mounts. The API dev command
builds once and starts; restart it after API changes. Normal `down` preserves named
database/dependency volumes. Volume removal is only for a deliberately disposable
project, after checking its project name and volumes.

When adding a workspace package, add its `node_modules` named volume to the shared
Compose mounts and the volume declarations. Refresh container dependencies with
`docker compose run --rm --no-deps deps`, then recreate the API/web services. A
native Windows install does not refresh Docker's dependency volumes, and Vite may
retain failed module resolution until restarted. Stop API/web before refreshing
their dependency volumes; keep the database volume intact.

Use a unique Compose project name (`docker compose -p taxflow-task-name ...`) for
each independent checkout. Set `TAXFLOW_WEB_PORT`, `TAXFLOW_API_PORT` and
`TAXFLOW_DB_PORT` to unused host ports when running projects together. Every command
for that project must use the same name/environment. Update `APP_ORIGIN` in its
API environment to match the chosen browser port/hostname. Defaults are for one local app;
the root browser-test commands allocate their own ports and data independently.

### Native: focused checks and development

Activate Node from `.node-version` using your version manager, then install the
exact pnpm version. On Windows with nvm-windows, select the pinned version in your
chosen development environment. Automated tasks should use a task-local PATH or
container rather than changing a global runtime shared by other tasks.

```sh
node --version
npm install --global pnpm@10.33.2
pnpm run doctor
pnpm install --frozen-lockfile
pnpm run verify
```

`doctor` runs without workspace dependencies, so it can diagnose a fresh checkout.
If it reports the wrong Node or pnpm, correct the selected executable; do not
remove engine checks or bypass the preinstall hook. On Windows, a global pnpm
PowerShell shim may explicitly use its sibling Node executable. Verify both
`node --version` and the package manager's reported environment after switching.

To run the frontend in PowerShell:

```powershell
$env:PORT = '5173'
$env:BASE_PATH = '/'
$env:API_BASE = 'http://127.0.0.1:5050'
pnpm --filter @workspace/ai-workflow-builder run dev
```

For native API development, provide `DATABASE_URL`, `APP_ORIGIN`,
`BETTER_AUTH_SECRET` and `PORT` in the API process
environment, then build/start. The existing `dev` alias uses a POSIX shell; this
explicit sequence works in PowerShell:

```powershell
$env:NODE_ENV = 'development'
$env:PORT = '5050'
# Set DATABASE_URL and your persistent BETTER_AUTH_SECRET privately.
$env:APP_ORIGIN = 'http://localhost:5173'
pnpm --filter @workspace/db run migrate
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

Native API startup does not automatically load `.env.local`; explicitly inject
required variables through your environment. Compose handles injection in the
Docker path. Never assume a successful frontend-only start verifies the API or DB.

## Testing and dependency changes

See [TEST.md](../TEST.md) for the verification commands and their scope. Use direct
tests during iteration, `verify` at a source-change boundary, and targeted browser
tests for interactions. Builds verify bundling, not authenticated tenancy or live
provider behavior. A test report must identify the environment it actually used.

For workflow graph or command changes, start with `pnpm run test:workflow-core`.
This suite needs no browser, database or model provider. `test:unit` also checks the
actual browser executor and Chat adapter against the shared command contract.
Both suites are included in `verify`; see [the Phase 4 guide](phase-4-workflows.md).

For the complete Phase 3 gate, install Chromium once with
`pnpm exec playwright install chromium`, start Docker Desktop/Engine, then run
`pnpm run test:phase3` from the native development shell. Docker is used only for
disposable Postgres containers; these commands do not require a running Compose
app or provider credentials. Browser dependency preparation happens before test
timers start. A cold Windows checkout can take several minutes to prepare.
Each invocation prints its report directory. See [TEST.md](../TEST.md) for focused
commands, HTML reports and retained failure traces.

For the provider-free startup smoke check, start a separate local Docker stack
with only session/origin settings and no provider credentials, initialize its new
database as above, then run in PowerShell:

```powershell
$env:TEST_API_BASE_URL = 'http://127.0.0.1:5050'
pnpm run test:api-startup
```

Use that stack's actual API port. This checks health and denial of anonymous chat access. The isolated integration
suite separately checks authenticated chat without a configured provider. It does not exercise model generation or database save/read behavior.

## Recovery and release checks

Validate checked-in or exported workflow backups without importing them:

```sh
pnpm run recovery:verify
pnpm run recovery:verify -- path/to/workflow-backup.json
```

The report under `test-results/recovery` contains hashes and counts, never backup
contents. The full integration suite also restores a physical `pg_dump` into a new
database inside its disposable container.

For release preparation, use:

```sh
pnpm run release:check
pnpm run release:check:persistence
pnpm run release:check:full
```

The first command needs Chromium but not Docker. The persistence gate needs Docker
Desktop/Engine and exercises database recovery, access and authenticated browser
storage. The production asset ceilings and improvement targets are documented in
[the Phase 9 record](phase-9-operations.md). Do not raise a ceiling solely to make
a build pass.

Routine setup uses frozen installs. For an authorized dependency update, deliberately
update the manifest and lockfile together, review the diff, then prove a frozen
install succeeds. Do not silently resolve a different lockfile on a fresh machine.

When changing toolchain pins, update `.node-version`, `package.json` engines,
the development Dockerfile base, and the Compose image label. CI consumes the
version file and `packageManager`. Run `doctor`, a clean frozen install, verification
and affected builds before accepting the update. Node distributions can be checked
against the [official release checksums](https://nodejs.org/dist/v24.21.0/SHASUMS256.txt).

## Git checkpoints and mixed working trees

Start with the current branch and status. A baseline snapshot can contain existing
work from multiple tasks; label it as such, and do not attribute the entire diff to
the next task. Never bulk-stage mixed changes just to obtain a clean-looking state.

This Phase 1 work created a recoverable local starting snapshot through an alternate
Git index. The current branch/index were left in place. The exact ref and validation
record are in [the Phase 1 record](phase-1-foundation.md). It is a recovery checkpoint,
not a release or proof that every historical change has been reviewed.

Inspect or recover into a **new directory** rather than resetting current work:

```sh
git show --stat CHECKPOINT_REF
git worktree add ../TaxflowOS-recovery CHECKPOINT_REF
```

Replace `CHECKPOINT_REF` with the recorded local ref. Checkpoints are local until
explicitly pushed. Ignored, untracked credentials and installed dependencies are
not part of the snapshot. Recreate them from setup instructions. Existing tracked
files are retained, including legacy `.next` build output; `.gitignore` does not
remove files already in Git. Retiring that output is a separate cleanup task.

Keep future feature/refactor tasks focused and checkpoint accepted results. Use
[the prompt library](PROMPTS.md), [review guidance](REVIEW.md), the current
[architecture](ARCHITECTURE.md) and target [product blueprint](product/README.md).
