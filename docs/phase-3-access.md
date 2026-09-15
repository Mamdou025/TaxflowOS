# Phase 3 — sessions, workspace access and schema history

The user confirmed Better Auth email/password, shared workspaces with Owner,
Editor and Viewer roles, and explicit legacy-library recovery-code claims.
This implements the Phase 3 deliverable in the [product plan](product/README.md).

## What changes for a user

Sign in or create an account, then create or select a workspace. Chat remains home.
The compact Workspace control provides switching, account ID, membership and sign-out.
An Owner grants another existing account access using that person's exact account ID.
Account IDs are identifiers, not credentials. No email messages or invitations are sent.

### Password-free demo

Choose **Try demo** on the sign-in screen to open Chat without entering credentials.
The installed Better Auth anonymous plugin creates a unique guest session; the API
creates one private demo workspace, reusing it across retries, reloads and tabs with
the same session. This uses normal workflow editing, execution, source and chat APIs
with the same workspace checks. AI, uploads and integrations still need their usual
server/provider configuration; demo mode does not fabricate provider responses.

Demo guests can read, write and execute inside their demo workspace. They cannot
create extra workspaces, share membership, join account workspaces or claim old
server libraries. The Chat sidebar's **Demo session** account section explains retention
and provides **Exit demo**. Export a workflow backup before exiting; access depends on
the session cookie, and another browser or a fresh demo cannot recover that guest's
workspace. An email/password account opens separate data; explicit backup import
can bring exported workflows into it. No automatic transfer or deletion occurs.

This addition uses the existing `users.is_anonymous` column and installed Better Auth
package; it requires no new migration or dependency. Demo records remain stored after
session expiry/sign-out; automatic retention cleanup is not implemented. The existing
auth rate limit applies; this change does not introduce per-guest provider quotas.
See [Better Auth anonymous sessions](https://better-auth.com/docs/plugins/anonymous)
for the library mechanism; options were checked against installed version 1.6.25.

| Action                                                | Owner | Editor | Viewer |
| ----------------------------------------------------- | ----- | ------ | ------ |
| Read workspace workflows, chats, documents and memory | Yes   | Yes    | Yes    |
| Save/delete workspace data or claim a legacy library  | Yes   | Yes    | No     |
| Invoke server model/tool/connector endpoints          | Yes   | Yes    | No     |
| Change/remove workspace members                       | Yes   | No     | No     |

The table applies to email/password accounts. Demo restrictions above also apply
even though the guest owns its private demo workspace.

The final Owner cannot be removed or demoted, including by competing requests.
Viewer local previews do not grant server write/execute permission. This release
does not introduce durable workflow execution or fine-grained agent action grants.
D-01, D-02 and D-03 were pending when this phase completed. The current status is
recorded in [the decision register](product/decisions.md).

## Architecture and invariants

1. Better Auth owns password hashing, cookie sessions and sign-in/out. Its Express
   handler runs before JSON parsing. The API requires an exact `APP_ORIGIN` and a
   privately generated `BETTER_AUTH_SECRET` of at least 32 characters.
2. The browser sends an HTTP-only session cookie and `x-taxflow-workspace` UUID.
   The server derives actor identity from the session and checks current membership
   on every protected request. Browser roles/IDs never confer authority.
3. The access contract is in `lib/api-zod/src/access.ts`; server enforcement is in
   `artifacts/api-server/src/security`. Execution endpoints include models, agent
   tools, HTTP sources, FX and parameter options. Case/trailing-slash variants use
   the same policy. Mutating application requests require the configured Origin.
4. Libraries use workspace ownership plus revision compare-and-swap. Deleting a
   library retains an empty backup and advances its revision, so an old browser
   cannot overwrite a recreated library by reusing an earlier revision. Workflow,
   chat, memory and document reads/writes are scoped to workspace. Chat message-ID
   collisions cannot overwrite another thread or workspace. Document chunks and
   ingest jobs carry workspace scope; legacy unassigned jobs are not claimed.
5. The browser session gate verifies access before mounting protected UI. Workspace
   switching reloads stores and pending state. Resource caches include both account
   and workspace; signing out notifies other tabs. These are UI isolation measures,
   not encryption of browser storage. Use separate browser profiles on shared devices.
6. Requests and decoded workflow backups are validated at the API boundary. Shared
   references and compressed backups have depth/expansion limits. Saved historical
   bytes and provenance are preserved; a malformed backup is rejected, not repaired.

Membership changes affect subsequent requests. The UI refreshes on focus and every
60 seconds; revocation cannot retract information already delivered to a browser.
Session verification and library failures remain explicit errors. No runtime DDL or
automatic anonymous-account seed is used. Some older document/retrieval helpers still
return empty results on provider or database failure; making those states explicit
belongs in the source-lifecycle work in Phase 5.

## Existing data and recovery

The migration adds nullable workspace ownership to legacy tables. Existing rows
remain intact and unassigned, with no automatic first-user ownership transfer.
Anonymous documents/chats are not exposed to a new account. Their eventual ownership
recovery needs separate evidence and a reviewed migration.

For a legacy server library, select an empty workspace, open workflow Storage, and
enter the existing recovery code. The server hashes the code, locks the source,
checks prior claims and atomically creates the destination library plus claim record.
Only one competing claimant can succeed. The original legacy row remains retained.
A nonempty destination or previously claimed code is rejected without replacing data.

Unscoped browser libraries remain untouched. Storage offers a raw legacy-browser
download and explicit validated backup import. A recovery code does not sign someone
in or grant membership. Keep any original backups until recovery has been verified.

## Database setup and upgrade

Use the pinned Node/pnpm environment in [DEVELOPMENT.md](DEVELOPMENT.md). Inject
`DATABASE_URL` privately into the command environment. The API does not migrate on boot.
Local Docker Compose runs a separate migration service before starting the API and
waits for API health before starting web. Existing untracked schema history still
requires the explicit baseline procedure below.

For a **new empty database**:

```sh
pnpm --filter @workspace/db run migrate
pnpm --filter @workspace/db run migration-status
```

For an **existing Phase 2 database**:

1. Take and verify a restorable backup. Rehearse against its isolated restored copy.
2. Stop writers during baseline adoption/upgrade. Run the following against the
   intended database, with its connection supplied through the environment:

```sh
pnpm --filter @workspace/db run baseline
pnpm --filter @workspace/db run migrate
pnpm --filter @workspace/db run migration-status
```

3. Baseline adoption compares the existing columns, types, defaults, constraints and
   indexes with a temporary copy of the committed Phase 2 schema. Differences stop
   adoption; review drift instead of deleting tables or forcing a schema push.
4. Confirm two applied migrations, configure the session secret/origin, and restart
   the API. Rehearse sign-in, workspace creation, a legacy claim and save/read.

`0000_phase2_baseline.sql` represents the existing schema; `0001_workspace_access.sql`
adds ownership and shared access. The migration runner holds a database advisory lock,
verifies applied hashes/timestamps, and uses Drizzle's transactional migrator. Reruns
do not reapply history. A failed migration rolls back its transaction and journal entry.
There is no destructive automatic down migration: restore a verified backup if an
upgrade must be undone. A rollback must preserve data created since that backup.

For future changes, edit the Drizzle schema, run `pnpm --filter @workspace/db run generate`,
review the generated SQL and commit a new migration. Never edit applied migrations.
Legacy `push`/`push-force` scripts remain only for disposable experiments; they are
not the application setup or upgrade path.

## Verification and remaining limits

Run `pnpm run test:phase3` for verification, integration, reliability and authenticated
browser persistence/access tests. It uses synthetic users and disposable Postgres;
no shared database, provider credentials or email delivery is needed. The unchanged
`test-results/phase2` directory name identifies the reused harness, not old auth behavior.
See [TEST.md](../TEST.md) for focused commands, logs, screenshots and failure traces.

Local verification on 2026-09-13 used Node 24.21.0, pnpm 10.33.2, Chromium and
disposable pgvector/Postgres 16 containers:

| Check                                                              | Result                                                       |
| ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Frozen dependency install                                          | Passed                                                       |
| `verify`: contracts, architecture, formatting, types, direct tests | Passed; 25 direct tests                                      |
| API/Postgres integration                                           | 27 passed, including deletion/recreation revision protection |
| Workflow browser reliability                                       | 15 passed                                                    |
| Real-session browser persistence/access                            | 4 passed                                                     |
| Production API and frontend bundle checks                          | Passed                                                       |

The complete `test:phase3` gate passed. The final deletion/recreation fix was then
checked with another full `verify` and all 27 integration tests. That change affects
the API's whole-library delete operation; the frontend browser flows were unchanged.
The final API is also rebuilt by those integration tests. Production bundle checks
preceded the small final permission/UI and deletion follow-ups; their final source
was covered by typechecks and the relevant integration/browser checks.

Local evidence: `.cache/phase3-gate.log`, `.cache/phase3-final-source-check.log`,
`.cache/phase3-final-integration.log`, and `.cache/phase3-build.log`. Browser artifacts
are under `test-results/phase2/04a727d1-186b52fd-20c9-48fe-813c-7fb08987d07a`
(reliability) and `test-results/phase2/04a727d1-2e1f0174-7905-4d8c-ba83-1924f8c08afa`
(persistence/access). These ignored artifacts are local evidence, not committed fixtures.
Earlier attempts retained failures from concurrent build pressure, Windows network
changes and a test that expected Workflows to remain open after a switch returned to
Chat. The sequential gate passed without reducing existing assertions or time limits.

The generator also confirmed that the current schema matches the committed migrations.
A Phase 3-only review patch is saved at `.cache/phase3-review.patch`, relative to the
Phase 2 review baseline. It was produced with an alternate Git index; the user's
index and unrelated changes were preserved. No commit, push, deployment or migration
of the user's existing database was performed.

Test containers and processes were cleaned up. Automatic approval review rejected
removal of the ignored build directory
`artifacts/api-server/.test-builds/04a727d1-0134d133-cb85-431f-af5e-6a7bc49b5c17`
with “blocked by policy”; that temporary directory remains.

Email verification and password-reset delivery are not configured. Membership therefore
uses account IDs, not claimed email ownership. Better Auth rate limiting is enabled;
without a configured trusted proxy it conservatively uses a shared per-path bucket.
Hosted deployments need their own reviewed proxy/session configuration. Live providers,
hosted deployment, production data migration, load behavior and all historical browser
specs are outside this local verification. This work does not certify a production release.

Integration follows the installed Better Auth 1.6.25 APIs; reference the official
[Express integration](https://better-auth.com/docs/integrations/express),
[Drizzle adapter](https://better-auth.com/docs/adapters/drizzle), and
[Drizzle migrations](https://orm.drizzle.team/docs/migrations) when extending it.

### Demo follow-up verification

The password-free addition passed `pnpm run verify` (25 direct tests) and all
28 API/Postgres integration tests. The API's production bundler is exercised by the
isolated integration stacks. No new dependency or database migration was introduced.

All four existing persistence/access browser cases passed. The added demo journey
initially failed because its test labels did not match the documented “Item” keyword
in Document Calculator. Correcting those fixture labels preserved the expected
calculation of `(10 + 20) * 2 = 60`; the focused rerun passed entry, failure/retry,
editing/running, saving, session-based reload recovery, export, exit and fresh-session
isolation. Entry and demo-workspace screenshots were inspected.

The focused reliability regression **Build runs in place; Run and Build retain one
execution and the original blocks** also passed. This follow-up verified six browser
cases in total, rather than rerunning the entire historical browser selection.

Evidence is retained in `.cache/demo-verify.log`, `.cache/demo-integration.log`,
`.cache/demo-browser.log` (four passes and the original fixture failure), and
`.cache/demo-browser-retry.log`. Browser artifacts are under
`test-results/phase2/04a727d1-09c5ad95-1b16-47db-afcd-acc4c09735a5` and
`test-results/phase2/04a727d1-e9c6cc22-8b94-4edc-b826-17edde65dc8b`.
The focused regression log is `.cache/demo-reliability.log`, with artifacts in
`test-results/phase2/04a727d1-632c57c0-bf29-4312-8225-3e613d454e34`.
The demo-only review diff is `.cache/demo-review.patch`, relative to the Phase 3
snapshot, using an alternate index. The real Git index and existing database remain
untouched. Provider-dependent functionality still requires its ordinary configuration;
the test suite uses no live provider credentials.

### Local startup recovery (2026-09-13)

The reported sign-in error came from a stopped local API: its startup query failed
because `workspaces` did not exist in the older Docker database. A separate UI bug
kept the error visible after a later access check correctly returned signed-out.

The entry screen now puts **Try demo** before the account form and keeps it available
when an access check fails. Retrying does not require a page reload, successful
signed-out checks clear the old error, and access requests time out after ten seconds.
Protected UI still requires verified workspace access; demo does not bypass the API.
If the guest session already exists after an outage, **Try demo** handles Better Auth's
duplicate-anonymous-sign-in response by resuming that session. The server session and
workspace are rechecked, preserving the guest's workspace identity.

Compose now runs the committed migrations in a separate `migrate` service before
starting the API. Web waits for the API health check. Schema creation remains outside
the application request/boot code, and applied migration files remain unchanged.

The existing local database was backed up and restored into a separate rehearsal
database before upgrade. Inspection found only the missing `documents.in_library`
column. The rehearsal added its committed definition (`boolean NOT NULL DEFAULT true`),
adopted the baseline and applied workspace access. Baseline comparison was corrected
to sort columns by name, since PostgreSQL appends an added column physically; it still
compares every column definition, default, constraint and index. Missing columns and
actual constraint drift remain errors. No table was rebuilt or dropped.

The same repair was then applied to the intended local `taxflowos` database. Counts
and fingerprints of all 16 original tables matched before and after (excluding only
the newly introduced columns). Legacy rows remain unassigned. The backup and evidence
are retained in `.cache/demo-startup-20260913-212540`, including `before.dump`,
`before-records.json`, `rehearsal-records.json` and `after-records.json`.

Manual browser verification at `http://localhost:5173` reached Chat by clicking
**Try demo** once without filling any account fields. The running API is healthy.
The final `pnpm run verify` passed in the running Linux/Docker environment, including
formatting, types, contracts, architecture checks and 35 direct tests. All 29
API/Postgres integration tests passed in a separate native copy installed with
`--frozen-lockfile`, including missing-column rejection and reordered-column adoption.
No application dependency versions or lockfile entries were changed.

Native verification in the shared checkout encountered Docker dependency links. The
isolated native frontend then timed out during dependency warmup before browser tests
started. A local bridge to the Docker development frontend completed six browser cases;
two demo cases exceeded their existing 20-second UI deadline during repeated page
reloads. Their traces show successful guest sign-in, session checks and workspace
creation, with individual HTML responses taking roughly five to eight seconds.
Development loading performance remains a separate follow-up.

The Docker production build passed, retaining its source-map reporting and large-chunk
warnings. All eight browser cases passed against that compiled frontend using a local
bridge to a disposable API/database. Every `/api` request stays in the disposable
stack. The persistence cases and their assertions/timeouts are unchanged apart from
the added demo regressions. User data is not used by those tests. The entry-screen
screenshot was inspected. A first production-browser attempt was stopped after the
temporary bridge mishandled deep routes; correcting that helper's static-file root
resolved the setup error without changing application code or test expectations.

Verification logs are `.cache/demo-startup-final-verify.log` and
`.cache/demo-startup-20260913-212540/native-integration.log`. The latter directory also
retains the initial native environment failures, bridge scripts, production build log
and browser logs. The passing browser log is `production-browser.log`; its complete
report and artifacts are under
`native/test-results/phase2/5c812e85-4bf5ad04-f999-4df9-b9ab-5a4f13006714` within that
directory. `review.patch` contains only this startup/demo fix relative to the Phase 4
checkpoint; the real Git index remains untouched.
