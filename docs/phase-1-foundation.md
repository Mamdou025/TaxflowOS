# Phase 1 — Development foundation

Scope: reproducible development setup, project working instructions, reusable
prompts, and a recoverable source baseline. The Phase 0 decisions D-01 through
D-03 remain pending; this phase does not implement their behavior.

## Starting checkpoint

- Local ref: `codex/phase-1-baseline-20260913-160308`
- Snapshot commit: `03e03a39e56bb04bd5b100d43351231d663c9731`
- Previous HEAD: `c9d84cc74efb48da5cc909e9dd8a8b91a2c0cdda`
- Current working branch at snapshot: `DevBranch`

The snapshot includes the mixed pre-existing working tree, the prior maintainability
refactor and Phase 0 documents. It was created with a separate index and retained
on a local branch. The user's working branch, staging state and files were not
reset or moved. Ignored credentials and dependencies were not captured or pushed.

The inventory and architectural review are recorded in
[the earlier maintainability review](maintainability-review-2026-09-13.md) and
[Phase 0 ownership](product/ownership.md). This recovery snapshot is not a claim
that every historical or user-authored change has received a line-by-line review.

## Changes

- Exact Node/pnpm pins, runtime/configuration checks, and frozen installation in
  Docker and CI; the development image installs pnpm once at build time.
- Optional provider environment file for basic development startup, isolated
  Compose project/port guidance, named Linux dependency/cache volumes, and a
  minimal image build context excluding secrets.
- Root [AGENTS.md](../AGENTS.md), [task prompts](PROMPTS.md),
  [review guidance](REVIEW.md), and [development setup](DEVELOPMENT.md).
- CI checks the active development branch names as well as main and pull requests.
- Git line endings now agree with the existing LF formatter and schema generator.
- A fresh-start blocker required one application correction: CopilotKit without
  gateway credentials now returns a clear HTTP 503 instead of crashing the API
  during module loading. Configured runtime construction and its middleware are
  retained. A local HTTP startup regression check covers the unavailable case.
- Workflow calculation, navigation, data ownership and dependency versions were
  not changed. The dependency lockfile is identical to the starting checkpoint.

## Verification record

Verification uses Node 24.21.0 and pnpm 10.33.2. The official Windows Node archive
was checked against its published SHA256 checksum and used in a task-local shell;
the machine's global runtime was not switched.

- Windows: frozen install, toolchain checks and full `pnpm run verify` passed,
  including 22 direct tests. That full run preceded the CopilotKit startup fix;
  the final API code is verified in the Linux checkout below.
- The toolchain checker accepted the pinned runtime and rejected four mismatch
  cases: wrong Node, npm instead of pnpm, wrong pnpm, and a pnpm launcher using a
  different Node despite the child process using the right version.
- Fresh Git clone: no `.env.local` or pre-existing installed dependencies. A
  uniquely named Docker project used new Postgres, dependency and package-cache
  volumes. Its frozen install completed successfully.
- The API bundle built and started without AI provider credentials. Development
  schema push created 16 public tables, and API startup seeded its guest user.
- `pnpm run test:api-startup` passed: HTTP 200 health and HTTP 503 with
  `AI_PROVIDER_NOT_CONFIGURED` for chat. Frontend HTML and its API health proxy
  also returned successfully. These requests did not call a model provider.
- Final Linux `pnpm run verify` passed, including workspace/test types and all
  22 direct tests. The frontend production build passed in 9m 23s; sourcemap
  diagnostics and large generated bundles remain follow-up work.
- Formatting and 40 local links across eight documentation files passed. Four
  representative files checked out into a separate empty directory used LF,
  confirming the Git attribute independently of formatting the test checkout.

Tested source snapshot: `025e7c80a1a13e0f85e521b4f2e47b041624b537`, retained at
`codex/phase-1-candidate-20260913-161531`. Subsequent edits to this record report
verification and do not alter that application code.

Completed local checkpoint: `codex/phase-1-complete-20260913-164752`.
Compare it with the starting checkpoint to review this phase without conflating
it with earlier uncommitted work. The current branch remains `DevBranch`, its
staging area is unchanged, and neither checkpoint was pushed.

Completed-check logs are retained locally under `.cache/phase-1-evidence/` and
are ignored by Git. The disposable Compose project was
`taxflow-phase1-20260913-161531`; its containers and three named volumes were
removed after verification. The normal development stack was not stopped.

## Problems exposed by the fresh checkout

The first Windows invocation still used a global pnpm launcher tied to Node 20.
It was not counted as pinned verification; a task-local launcher corrected it.
The new checker detects this mismatch explicitly.

The first Docker install wrote its pnpm cache through the Windows source bind
mount. Moving that cache to a Linux volume removed that setup bottleneck. Registry
timeouts and a Docker Desktop HTTP 500 required retries; completed checks are
reported above, not inferred from the interrupted attempts.

Windows Git initially checked out CRLF text while the formatter and generated
schema comparison required LF. The new `.gitattributes` aligns fresh checkouts.
The existing temporary checkout was normalized after adding that rule; the
generated schema's content was already correct and its validation was not relaxed.
The normalized temporary checkout had no tracked content differences from its
source snapshot.

## Remaining work and verification limits

- Hosted GitHub CI, browser interaction suites and live-provider generation were
  not run for this phase. Successful startup is not evidence of tenant isolation,
  real save/conflict behavior, migration safety or live model correctness.
- Legacy `.next` output already contributes 15,718 tracked files. It is retained
  in the recovery snapshot and makes cloning unnecessarily expensive. Remove it
  from version control in a focused artifact-cleanup task.
- Phase 2 should add disposable API/Postgres save/read/conflict tests, synthetic
  fixtures, browser traces and isolated browser-test ports. Phase 3 still owns
  authentication, authorization and managed migrations.
- Product decisions D-01 through D-03 remain pending. No execution-durability or
  broader agent-write behavior is authorized by this setup work.
