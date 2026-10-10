# Private ChatGPT account linking

This increment implements the user-authorized sign-in, explicit workspace consent,
revocable access token and per-request permission checks. It extends the
[read-only MCP foundation](chatgpt-plugin.md), in the same repository. The initial
implementation was verified locally. The subsequently authorized live pilot is
recorded separately below; account linking, saved-workflow reads, viewer
rendering, selected-block context, expansion, the explanation button, revocation
and reconnect are verified in ChatGPT Work. The private pilot is ready within
that tested read-only scope, subject to the temporary runtime limits below.

The later [editable-workspace handoff](chatgpt-workspace-editing.md#private-pilot-handoff-2026-10-08)
upgraded the private backend/viewer and isolated database to 14 migrations after
backup and before/after state checks. The active ChatGPT grant still has read
scope only. Package 1.0.3 upload, expanded human consent and live editing
acceptance remain pending; the earlier 11-migration live record below is historical.

## Separate read, write and execute consent

The current source adds optional `inscope.workflows:write` and
`inscope.workflows:execute` permissions alongside the required
`inscope.workflows:read` discovery/read permission. Write and execute are
independent: permission to change inputs does not imply permission to run a
calculation. The consent page describes input changes and source file replacement
separately from explicit start/recalculation, and consent itself does neither.

Existing read-only grants are unchanged. A new permission set requires a fresh
authorization request and explicit workspace consent. The API stores the exact
canonical scope set with the grant; authorization-code exchange and every refresh
return that same set. Refresh may omit `scope` or repeat the granted set in any
order, but cannot add or remove permissions. A rejected scope-change request does
not consume the valid refresh token or revoke the existing grant.

Only current owners and editors can consent to write or execute access. The
consent workspace list is filtered accordingly, and the decision rechecks the
actual membership in case it changed while the page was open. The browser cannot
add a scope to its decision. Read-only consent remains available to viewers.
Every MCP command still derives identity/workspace from the verified credential;
the mutation adapter checks both its required scope and current owner/editor
membership. A later downgrade to viewer preserves reads but denies changes and
execution. Complete membership removal or loss of pilot eligibility continues
to revoke a grant when checked. Scope consent is not an override of membership.

The additive `0011_chatgpt_oauth_scopes.sql` migration permits the four exact
scope combinations in request/grant constraints without rewriting prior rows or
editing migration `0010`. The schema mirrors those constraints. Apply it through
the managed migration process before enabling new consent in an authorized
environment. The live evidence below records the earlier read-only pilot; it is
not evidence of deployed write/execute consent.

### Scope expansion verification and changed files

The pinned toolchain doctor passed. The scope/config unit tests passed **3/3**.
The final disposable-database OAuth suite passed **14/14** in 35.2 seconds, covering
the three advertised scopes, role-restricted consent, old-grant escalation
denial, exact-scope refresh, reordered equivalent scopes, denied browser scope
injection and current membership alongside the existing PKCE/replay/expiry and
revocation cases. Actual MCP command calls also deny old read credentials,
write-only execution, execute-only run creation, and an elevated grant after its
editor becomes a viewer, including case/trailing-slash variants. Its database
applied the additive migrations; no live pilot
or shared database was migrated by these tests. The final API production build
passed. The final coordinated `pnpm run verify` passed all type checks, **211 unit**,
**37 worker** and **50 core** tests, contracts, architecture and maintained-source
formatting. An earlier standalone API typecheck had encountered missing workbook
declarations while that extraction module was being added; the final verification
resolved those diagnostics. Scoped formatting also passed for the changed OAuth,
consent, schema, test and guide files.

The normal frontend production build passed in **15m 34s**, with the existing
source-map, browser-externalization and large-chunk warnings. Against those fresh
artifacts, the focused account-linking browser suite passed **6/6** in **45.2s**.
The original five cases retain framing refusal, login/request preservation,
explicit consent, denial/error states and personal revocation coverage. The new
sixth case separately checks write and execute descriptions, an empty workspace
selection, no automatic authorization and the explicit server decision payload.
The fixtures include the grant scope already supplied by the real API. These are
mocked-account browser checks, not live ChatGPT authorization evidence.

An initial browser CLI launch stopped before running cases because Playwright
traversed the root TypeScript project references. The already documented explicit
`--tsconfig=e2e/tsconfig.json` option fixed harness loading; no source or test
assertion was changed for that retry. No write/execute rollout or live grant
change is implied by these local checks.

Git already showed the account-linking module, tests and guide as untracked from
the earlier implementation; those files are modified for this follow-up, not
newly invented implementations. The schema was also already untracked. Migration
`0011` is new in this follow-up. The tracked journal also contains coordinated
later migration entries owned by other modules; this scope change appends only
`0011`. Unrelated working-tree changes remain preserved. Paths below are relative
to the repository root.

| File                                                                                  | Purpose and before/after behavior in this follow-up                                                                                                                                                                 |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/security/chatgpt-oauth/config.ts`                           | Keeps the original read scope and validates canonical read/write/execute combinations. Read was the only valid permission; write and execute are now independent explicit opt-ins, limited to owner/editor consent. |
| `artifacts/api-server/src/security/chatgpt-oauth/provider.ts`                         | Advertises the supported scope set for the fixed client and validates authorization/refresh inputs. Exact callback, client, PKCE and resource checks remain unchanged.                                              |
| `artifacts/api-server/src/security/chatgpt-oauth/public-router.ts`                    | Discovery now advertises all three implemented scope names instead of read alone. It does not grant them.                                                                                                           |
| `artifacts/api-server/src/security/chatgpt-oauth/mcp-access.ts`                       | Accepts verified supported scope sets and preserves them on the request. Baseline read access, bearer-versus-cookie dispatch and authentication requirements remain unchanged.                                      |
| `artifacts/api-server/src/security/chatgpt-oauth/store-common.ts`                     | Grant matching accepts only canonical supported scope sets, preserving original read-only rows and all existing grant identity checks.                                                                              |
| `artifacts/api-server/src/security/chatgpt-oauth/store-requests.ts`                   | Persists the requested scope set, filters eligible workspaces and rechecks the current role on consent. Browser decisions still cannot supply their own scopes.                                                     |
| `artifacts/api-server/src/security/chatgpt-oauth/store-tokens.ts`                     | Minted and refreshed tokens retain the exact consented scopes. An attempted refresh scope change now fails before consuming the valid refresh token; old read grants gain no new authority.                         |
| `lib/db/src/schema/chatgpt-oauth.ts`                                                  | Mirrors the four permitted canonical scope combinations in request/grant constraints. No existing row is rewritten.                                                                                                 |
| `lib/db/migrations/0011_chatgpt_oauth_scopes.sql`                                     | Adds the new constraint values through an additive migration. Applied migration `0010` and existing read grants are preserved.                                                                                      |
| `lib/db/migrations/meta/_journal.json`                                                | Registers additive migration `0011`; prior entries remain unchanged. Later independently owned entries are retained.                                                                                                |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/api.ts`           | Validates the actual request/grant scope combinations and derives clear permission labels. It no longer assumes every connection is read-only.                                                                      |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/consent-page.tsx` | Describes the exact requested input/file-change and execution permissions separately. Workspace selection and Allow remain explicit; viewing or granting consent never applies inputs or runs calculations.         |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/grants-panel.tsx` | Connection history displays each grant's actual permissions rather than a fixed read-only label. Personal revoke behavior is unchanged.                                                                             |
| `tests/unit/chatgpt-oauth-config.test.ts`                                             | Adds independent scope-combination and allowed/denied-role checks. No runtime behavior change.                                                                                                                      |
| `tests/integration/chatgpt-oauth.test.mjs`                                            | Extends real-session, disposable-database checks for exact scopes, consent denial and refresh escalation prevention, while retaining existing OAuth lifecycle cases. No runtime behavior change.                    |
| `e2e/chatgpt-account-linking.spec.ts`                                                 | Adds write-only/execute-only consent-copy and no-auto-approval coverage; grant fixtures now include the scope already returned by the real API. Existing assertions remain. No runtime behavior change.             |
| `docs/chatgpt-account-linking.md`                                                     | Documents scope consent, rollout limits and this review inventory, preserving the dated read-only live evidence. No runtime behavior change.                                                                        |

The product blueprint's ownership and computation-versus-review boundaries remain
accurate. This increment expands the permission ceiling for separately authorized
MCP commands; it does not change saved workflow definitions, tax rules, approval
authority or primary navigation. The command adapter remains responsible for
checking each action against current membership as well as its granted scope.

## Live private pilot status (2026-10-08)

The private pilot now uses a fresh, isolated PostgreSQL database with all **11
managed migrations** applied, including `0010_chatgpt_oauth.sql`. It has a
dedicated synthetic account and workspace, plus one saved canonical test workflow
definition at **version 1: 12 blocks and 14 edges**. No runs or calculation results
exist in this fixture. No customer database or customer workflow was connected.

A temporary public Cloudflare HTTPS endpoint routes through the local allowlist
gateway to the built frontend and dedicated API process. The endpoint is publicly
reachable; data access requires the configured authentication and pilot consent.
Only the account-linking pages and built assets, email sign-in/sign-out,
OAuth/discovery routes and protected MCP transport are exposed. Other application
APIs, including workflow writes and agent execution, are blocked by the gateway.
This is a development runtime, with no production deployment or public directory
submission.

The personal ChatGPT plugin **InScope Private Pilot** has been created and live
account linking is **verified**. InScope sign-in and explicit consent for the
synthetic workspace returned to the installed plugin page with **Try in chat**.
The grant API confirmed an active grant with a recorded use by ChatGPT.

In **ChatGPT Work**, explicit `@InScope Private Pilot` selection successfully
called `list_workflows` and `get_workflow_version`, returning the saved test
definition at version 1 with 12 blocks and 14 edges. The actual embedded InScope
React Flow viewer was visually observed with its workflow title, workspace,
version and read-only state. **Expand** opened the viewer in the right sidebar
beside chat, in the same browser tab.

After selecting **Category Rollup**, a native-composer follow-up that did not name
the block correctly identified `fapi-logic-category-rollup`, the exact workflow
and saved version 1. ChatGPT fetched and explained its configuration while
explicitly retaining `runId: null` and the absence of run results. The separate
**Explain this block** button also produced an explicit selected-block follow-up
and a correct response. This evidence applies to the tested Work conversation;
it does not establish tool availability in every ChatGPT surface.

Live revocation is verified: after the original grant was revoked, a fresh
`list_workflows` request returned a reconnect/expired-connection prompt and no
workflow data. OAuth consent for the same workspace created a new active grant;
the original remains revoked. ChatGPT automatically retried `list_workflows` and
returned only the saved synthetic version 1 workflow. This verifies fresh access
after reconnect. The replacement grant was left active for continued pilot use.

An initial assistant response incorrectly denied the available viewer despite
its visible rendering. After the focused model-facing metadata change, API
restart and plugin metadata refresh, a fresh Work conversation rendered the
viewer and correctly described opening version 1 in the read-only viewer. It
also reported no recorded runs in the saved library and confirmed that nothing
was executed or changed. This narration retest passed. See the
[viewer boundary](chatgpt-plugin.md#workflow-and-viewer-boundary) for what that
metadata communicates and what it does not establish.

Separate cookie-authenticated probes through the public endpoint returned HTTP
200 for MCP initialization, `tools/list` and `resources/read`. They verify that
the protocol and built resource are reachable using a browser session. They do
not themselves prove ChatGPT tool availability, a bearer-authenticated workflow
read, or execution of the viewer inside ChatGPT. The live Work check above provides
the separate read and rendering evidence.

Pilot runtime files are held in the ignored, access-restricted
`.local/chatgpt-pilot/` directory. Keep its credentials, session material and
process records out of Git, documentation and chat messages. The repository guides
describe the setup without embedding the temporary hostname or secret values.

The gateway, API, database and tunnel processes must remain available for the
pilot to work. Stopping the tunnel removes its public endpoint; creating another
Quick Tunnel changes the hostname. A changed origin requires matching issuer,
resource and ChatGPT connection configuration, followed by fresh account linking.
The existing seven-day grant limit still applies. This temporary runtime does not
provide persistent hosting or an uptime guarantee. Cloudflare's interactive email
gate must not sit in front of the shared OAuth/MCP endpoint because ChatGPT's
server requests cannot complete that browser-only login. See the
[Quick Tunnel limitations](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

To test revocation while leaving a usable final connection, first verify a fresh
read, revoke only that test grant, and verify that another fresh request requires
authorization. Then reconnect with explicit consent and verify a fresh read using
the replacement grant. Leave the replacement active. Previously rendered cards
may remain in the conversation; their presence is not evidence of continued
server access. Do not rotate the fixed client credentials or change workspace
membership merely to perform this lifecycle test.

## What happens

ChatGPT starts authorization with the configured OAuth client, exact callback,
the requested scope set (including `inscope.workflows:read`), resource and an S256
PKCE challenge. The API stores
a pending request and opens `/chatgpt/authorize?request=...`. That page uses the
existing email/password login, then displays the account, permitted workspaces,
access requested and lifetime. No workspace is preselected and no request is
approved merely by opening it. Demo accounts and accounts outside the pilot
allowlist cannot link.

Consent is bound to the actual server session and actor. Allow creates a grant
for one currently accessible workspace; Deny returns an OAuth denial with the
original client state. The client exchanges the single-use code with PKCE and
its configured secret. Tokens are opaque random values; only their SHA-256 hashes
are stored. These credentials do not authorize the application's write APIs.

The private-pilot implementation uses a predefined confidential client with
`client_secret_post`. Dynamic registration, CIMD, public clients and HTTP Basic
client authentication are not advertised. It does not advertise RFC 9207 issuer
identification; copy the exact callback-specific redirect URI shown by ChatGPT,
rather than assuming the stable callback applies.

| Credential/state         | Lifetime and behavior                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Pending consent request  | 10 minutes; bound to the account and browser session when opened.                                                                        |
| Authorization code       | 5 minutes; one use; a valid replay revokes its grant.                                                                                    |
| Access token             | At most 15 minutes, and never beyond its grant expiry.                                                                                   |
| Grant and refresh access | Absolute 7 days from consent. Refresh rotates the token without extending that deadline. Replaying a consumed refresh revokes the grant. |
| Revocation               | Stops subsequent reads and refreshes. Browser sign-out is separate; use the explicit revoke control to end connected access.             |

These short lifetimes are implementation defaults for the private pilot,
not a decision about future paid plans or company-wide access. Every bearer read
checks the grant, expiry, fixed client/resource/scope, pilot eligibility and current
workspace role. New command permissions are checked separately against that
current role and the original consented scope set. A denied membership/pilot check also revokes the grant; re-adding
access after that denial does not reactivate the old credentials.

Connections has a **ChatGPT access** section. `/chatgpt/connections` provides the
same personal grant management even without an active workspace. Viewers can
revoke their own grants. Another account cannot list or revoke them. Complete
grant history remains visible; it is not silently truncated behind older entries.
Each entry shows the actual granted read/change-input/execute permissions.
Revocation does not delete information already copied into a ChatGPT conversation.

## Enable in a chosen development environment

The code is disabled by default. Set all four values privately in the API process
environment, using the documented placeholders in `.env.example`:

| Setting                               | Required value                                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INSCOPE_CHATGPT_OAUTH_CLIENT_ID`     | The predefined client ID configured in ChatGPT.                                                                                                           |
| `INSCOPE_CHATGPT_OAUTH_CLIENT_SECRET` | A separate random secret, at least 32 characters, configured in ChatGPT's OAuth settings. Never reuse the session secret or put it in a `VITE_` variable. |
| `INSCOPE_CHATGPT_OAUTH_REDIRECT_URI`  | The exact callback URI shown in ChatGPT's server management page. No wildcards or arbitrary return URL.                                                   |
| `INSCOPE_CHATGPT_PILOT_USER_IDS`      | Comma-separated existing InScope account IDs, not email addresses (up to 20 accounts).                                                                    |

All empty keeps OAuth disabled. Partial or invalid settings fail startup rather
than allowing anonymous company access. `APP_ORIGIN` is the canonical issuer and
frontend/API origin. HTTPS is required outside loopback development. Separate
API/frontend public origins are not implemented in this pilot.

Apply `0010_chatgpt_oauth.sql` and additive `0011_chatgpt_oauth_scopes.sql` using the existing managed migration
command in the explicitly chosen development database; never edit applied
migrations. Build the API and viewer, set `INSCOPE_CHATGPT_UI_PATH` to the built
`dist-chatgpt/chatgpt.html` asset in the API environment, then restart. This guide
does not authorize a migration of an existing shared or production database.

The public origin must route all of the following correctly:

- `/api/chatgpt/mcp`: protected MCP transport.
- `/.well-known/oauth-protected-resource/api/chatgpt/mcp`: resource discovery.
- `/.well-known/oauth-authorization-server`: authorization-server discovery.
- `/api/chatgpt/oauth/authorize`, `/token` and `/revoke`: public OAuth protocol
  endpoints under the same `/api/chatgpt/oauth` prefix.
- `/api/chatgpt/oauth/requests/...` and `/grants/...`: cookie/origin-protected
  consent and personal grant management.
- `/chatgpt/authorize` and `/chatgpt/connections`: frontend pages.

The Vite development proxy forwards discovery as well as `/api`. Its dependency
scan starts from `index.html` so generated standalone viewer HTML is not scanned
as an application entry. Configure equivalent routing when hosting. Set
`Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY` for
the two frontend account-linking pages. Their client guard also refuses framed
rendering; the embedded workflow viewer remains allowed to run in its host.

Once reachable, configure the actual MCP URL with OAuth in ChatGPT, enter the
matching client settings, sign in to InScope, select a workspace and approve the
displayed scopes. Verify the intended permitted operations and revocation in a live account before
calling the connection ready. A private tunnel only solves reachability; the
browser consent pages and OAuth endpoints must also be reachable appropriately.

## Automated verification before the live pilot

Checked locally on 2026-10-08 with the pinned Node 24.21.0 and pnpm 10.26.1:

- `pnpm run doctor` passed.
- `pnpm run verify` passed: contracts, architecture, maintained-source formatting,
  application/test type checks, unit tests, worker tests and core tests.
- The complete integration suite passed **78/78**, including **11 OAuth cases**:
  consent/session binding, denied access, exact callback/resource, PKCE, concurrent
  code redemption, workspace isolation, metadata, refresh/replay, expiry,
  revocation, membership changes, restart durability and secret-safe logging.
  Its disposable stacks also built the API with the new migration.
- The main frontend production build passed (**16,531 modules**, 6m 12s). Existing
  areas still emit source-map, browser externalization and large-chunk warnings.
- The focused production browser suite passed **5/5** in 12.9 seconds, covering
  framing refusal, login/request preservation, explicit workspace consent,
  denial/error states, grant history/revocation and account changes. The consent
  screenshot was visually inspected.
- The existing persistence browser suite finished **6 passed, 2 failed**. Both
  failures are unchanged startup-copy expectations: `e2e/demo-access.spec.ts:10`
  and `e2e/demo-resume.spec.ts:15` expect “app service is not ready”, while the
  unchanged auth provider returns “The app service is temporarily unavailable.
  Please retry.” Storage recovery, backup/offline retry, revision conflicts,
  the 1 MiB roundtrip, account/workspace isolation, membership revocation and
  the demo run/save/reload/export/exit cases passed. No expectation was changed
  to hide those failures. Later assertions in those two failed cases did not
  run. Disposable services were cleaned up.

Local evidence:

- Consent screenshot:
  `test-results/phase2/chatgpt-account-linking/chatgpt-account-linking-ac-0e6cd-explicitly-chosen-workspace/consent.png`.
- Persistence report:
  `test-results/phase2/04a727d1-d14638cf-5fc0-4294-a387-0385abe04a31/report.json`.

These API and persistence tests use disposable PostgreSQL databases and real local
sessions. Account-linking browser tests use synthetic API responses and a fake
callback; they block non-loopback asset requests. These automated suites use no
shared database, live provider or live OpenAI account. Their passing results do
not verify the later public runtime or ChatGPT connection. The live pilot status
above records the separately observed setup progress and remaining acceptance
checks.

Useful commands, with the repository's pinned Node/pnpm versions:

```sh
pnpm run doctor
pnpm run verify
pnpm exec node --test --test-concurrency=1 tests/integration/*.test.mjs
pnpm run test:workflow-reliability chatgpt-account-linking.spec.ts
pnpm run test:workflow-persistence
pnpm --filter @workspace/ai-workflow-builder run build
pnpm exec playwright test --config=playwright.chatgpt-account.config.mjs --tsconfig=e2e/tsconfig.json
```

For the main frontend build, set `PORT=5173` and `BASE_PATH=/` as described in
[development setup](DEVELOPMENT.md), then run the focused production browser
command against that completed build. The existing development reliability
harness timed out during full-chat warmup before the focused tests started;
the production harness keeps the same account-linking assertions. An earlier
build was intentionally stopped after a UI import changed and replaced by the
successful final-source build above. Windows task shells need System32 on PATH
for process cleanup. No dependency versions changed in this increment.

An extra formatting check found pre-existing formatting in `vite.config.ts`;
the Git HEAD version fails the same check. Broad reformatting was left outside
this task. The required maintained-source formatting check passed.

## File-by-file review

The working tree already contained the plugin foundation and substantial unrelated
workflow work. The table covers this OAuth increment only; those earlier changes
are preserved. It records the initial implementation before the live pilot. The
[live follow-up inventory](chatgpt-plugin.md#live-pilot-follow-up-changes-2026-10-08)
covers the subsequent metadata change and updated acceptance evidence. Paths are
relative to the repository root.

| File                                                                                          | Purpose, change and before/after behavior                                                                                                                                                             |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/security/chatgpt-oauth/config.ts`                                   | New private-pilot configuration validation. OAuth was absent; it now remains disabled unless the complete bounded configuration is present.                                                           |
| `artifacts/api-server/src/security/chatgpt-oauth/provider.ts`                                 | New bridge to the existing MCP OAuth SDK handlers. Enforces registered client, exact callback, resource, S256 and read scope before calling storage.                                                  |
| `artifacts/api-server/src/security/chatgpt-oauth/public-router.ts`                            | New discovery/authorization/token/revocation routes. Advertises actual supported methods and contains parser errors so form secrets cannot enter the global error log.                                |
| `artifacts/api-server/src/security/chatgpt-oauth/account-router.ts`                           | New session/origin-protected personal consent and grant routes. Viewers can approve read access and revoke their own connections; they gain no workflow write permission.                             |
| `artifacts/api-server/src/security/chatgpt-oauth/mcp-access.ts`                               | New MCP-only credential dispatch. Valid bearer credentials derive actor/workspace from stored grants; invalid Authorization cannot fall back to a cookie. Existing browser reads retain their checks. |
| `artifacts/api-server/src/security/chatgpt-oauth/store.ts`                                    | New grant listing/revocation and store composition. Returns only the signed-in actor's connection history.                                                                                            |
| `artifacts/api-server/src/security/chatgpt-oauth/store-types.ts`                              | New internal credential and consent types. No standalone runtime behavior.                                                                                                                            |
| `artifacts/api-server/src/security/chatgpt-oauth/store-common.ts`                             | New hashing, eligibility and transaction helpers. Revocations that accompany rejection are committed rather than rolled back.                                                                         |
| `artifacts/api-server/src/security/chatgpt-oauth/store-requests.ts`                           | New pending-request/session binding and explicit consent. Stores only hashes of request/code secrets and consumes requests once.                                                                      |
| `artifacts/api-server/src/security/chatgpt-oauth/store-tokens.ts`                             | New token issue/refresh/verify/revoke behavior, atomic consumption, expiry checks and replay revocation.                                                                                              |
| `artifacts/api-server/src/security/access.ts`                                                 | Exposes the already verified session ID to consent storage. Existing account/workspace authorization rules remain unchanged.                                                                          |
| `artifacts/api-server/src/types.d.ts`                                                         | Types the verified session ID; no independent behavior change.                                                                                                                                        |
| `artifacts/api-server/src/app.ts`                                                             | Mounts public OAuth, protected personal consent and MCP bearer dispatch ahead of ordinary cookie routes. Other API routes retain their browser authentication.                                        |
| `artifacts/api-server/src/routes/chatgpt-plugin.ts`                                           | Uses the identity established by either authorized transport and enables OAuth metadata only when configured. Workflow reads remain unchanged.                                                        |
| `artifacts/api-server/src/lib/chatgpt-plugin/server.ts`                                       | Adds matching top-level and compatibility OAuth declarations for the same four registered tools. SDK tool-call validation remains intact.                                                             |
| `lib/db/src/schema/chatgpt-oauth.ts`                                                          | New separate request/grant/code/token tables with ownership, scope/type and expiry constraints. Workflow storage is unchanged.                                                                        |
| `lib/db/src/schema/index.ts`                                                                  | Exports the new database schema; no separate policy change.                                                                                                                                           |
| `lib/db/migrations/0010_chatgpt_oauth.sql`                                                    | Additive credential tables/indexes only. Existing tables/data and applied migration history are preserved.                                                                                            |
| `lib/db/migrations/meta/_journal.json`                                                        | Appends migration 0010 to the managed sequence; older entries remain unchanged.                                                                                                                       |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/api.ts`                   | New validated personal-consent/grant API client. Does not use the selected browser workspace as authority.                                                                                            |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/account-linking-page.tsx` | New standalone page wrapper with frame refusal and session-change clearing; avoids starting the normal chat shell.                                                                                    |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/consent-page.tsx`         | New explicit workspace selection and Allow/Deny flow, showing actual account and scope/lifetimes. Opening the page never grants access.                                                               |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/grants-panel.tsx`         | New own-connection history and server-confirmed revocation, usable by Viewers without an active workspace.                                                                                            |
| `artifacts/ai-workflow-builder/src/features/chatgpt-account-linking/access-notice.tsx`        | New sign-in/unavailable/denied handling, including explicit account switching. Does not automatically sign a user out.                                                                                |
| `artifacts/ai-workflow-builder/src/App.tsx`                                                   | Routes only the two account-linking pages outside the normal providers; existing primary navigation remains unchanged.                                                                                |
| `artifacts/ai-workflow-builder/src/platform/auth/ui/sign-in.tsx`                              | Adds optional demo suppression for account linking. Normal sign-in still offers demo by default.                                                                                                      |
| `artifacts/ai-workflow-builder/src/features/connections/connections-page.tsx`                 | Adds personal ChatGPT access management alongside existing connections. Provider-connection editing permissions remain unchanged.                                                                     |
| `artifacts/ai-workflow-builder/vite.config.ts`                                                | Proxies discovery URLs and scans only the actual application entry. Prevents generated viewer output breaking development dependency scanning.                                                        |
| `tests/unit/chatgpt-oauth-config.test.ts`                                                     | New configuration boundary tests; no production behavior change.                                                                                                                                      |
| `tests/integration/chatgpt-oauth.test.mjs`                                                    | New real-session/disposable-database OAuth, isolation, replay, expiry, revocation and secret-log tests. No production behavior change.                                                                |
| `e2e/chatgpt-account-linking.spec.ts`                                                         | New browser coverage of consent, login, denial, framing and personal revocation. No production behavior change.                                                                                       |
| `playwright.reliability.config.mjs`                                                           | Includes the new focused browser cases; existing test entries remain unchanged.                                                                                                                       |
| `playwright.chatgpt-account.config.mjs`                                                       | New focused browser configuration that requires the completed production build and keeps the same assertions. No production behavior change.                                                          |
| `scripts/testing/chatgpt-account-server.mjs`                                                  | New loopback-only static test server confined to the built frontend; has no backend proxy and refuses unmocked APIs. No production behavior change.                                                   |
| `scripts/maintained-paths.mjs`                                                                | Includes the new frontend module in maintained-source formatting. No runtime behavior change.                                                                                                         |
| `.env.example`                                                                                | Documents optional private server settings with empty values. Does not enable OAuth or provide credentials.                                                                                           |
| `docs/ARCHITECTURE.md`                                                                        | Updates ownership/auth boundaries; unrelated prior edits retained. No runtime behavior change.                                                                                                        |
| `docs/FUNCTIONALITY.md`                                                                       | Describes implemented optional linking and unverified live use. No runtime behavior change.                                                                                                           |
| `docs/chatgpt-plugin.md`                                                                      | Updates current pilot setup and links this increment; retains dated foundation evidence. No runtime behavior change.                                                                                  |
| `docs/chatgpt-account-linking.md`                                                             | This setup, behavior, verification and change inventory. No runtime behavior change.                                                                                                                  |

For the initial read-only implementation recorded in the table above, product
blueprint decisions about calculation, approval, agent roles, company scope and
computer permissions remained unchanged, and no workflow writes or primary
navigation were added. The subsequent scope expansion is described separately
at the top of this guide.

The protocol follows the [OpenAI plugin authentication guide](https://developers.openai.com/plugins/build/auth).
Connection setup is documented in [OpenAI's connect-and-test guide](https://developers.openai.com/plugins/deploy/connect-chatgpt).
