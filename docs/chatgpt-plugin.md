# InScope in ChatGPT: development pilot

Keep this integration in the TaxflowOS repository. The existing API owns access
and storage; workflow packages own definitions, versions and recorded execution.
The ChatGPT adapter exposes those capabilities without owning a second set of
workflow rules or a new chat transcript.

## Current boundary

The current source includes the [editable workflow workspace](chatgpt-workspace-editing.md),
with separate read/write/execute consent and review-before-recalculation. Its
rollout and verification are recorded separately from the historical reader
acceptance below. The installed 1.0.2 package and existing read-only grant do not
gain write permission automatically.

The private backend/viewer has since been upgraded, with 14 migrations and the
saved workflow/grants preserved. Package 1.0.3 is prepared; its upload, expanded
human consent and live editing acceptance remain pending. See the
[current handoff](chatgpt-workspace-editing.md#private-pilot-handoff-2026-10-08).

The initially installed implementation includes a read-only MCP adapter, a separately built viewer,
and optional [OAuth account linking](chatgpt-account-linking.md) for an allowlisted
private pilot. OAuth stays disabled until all required server settings are
configured. Browser reads retain their session/origin checks; OAuth reads use a
separate credential pinned to one consented workspace. A temporary private-pilot
runtime and personal ChatGPT plugin have now been configured. Live account
linking, saved-workflow reads, viewer rendering, selected-block context,
expansion, the explanation button, revocation and reconnect are verified in
ChatGPT Work. The private pilot is ready within that tested read-only scope,
subject to the temporary runtime limits below.

## Live private pilot status (2026-10-08)

**InScope Private Pilot** has been created as a personal plugin in ChatGPT, and
live account linking is **verified**. InScope sign-in and explicit synthetic
workspace consent returned to the installed plugin page with **Try in chat**;
the grant API confirmed an active grant used by ChatGPT. In **ChatGPT Work**, an
explicit `@InScope Private Pilot` selection successfully called `list_workflows`
and `get_workflow_version`, returning the saved version 1 definition with 12 blocks
and 14 edges. The embedded InScope React Flow viewer was visually observed with
the correct workflow/workspace/version and read-only state. **Expand** opened
the viewer beside chat in the right sidebar, in the same browser tab.

Selecting **Category Rollup** and asking a native-composer follow-up without
naming the block correctly identified `fapi-logic-category-rollup`, the exact
workflow and version 1. ChatGPT fetched its configuration and explained it with
`runId: null` and no invented run results. The separate **Explain this block**
button produced an explicit selected-block follow-up and a correct response.
These results apply to the tested Work conversation; other ChatGPT surfaces have
not passed acceptance.

After revoking the original grant, a fresh `list_workflows` request returned a
reconnect/expired-connection prompt and no workflow data. OAuth consent for the
same workspace created a new active grant while the original remained revoked.
ChatGPT then automatically retried `list_workflows` and returned only the saved
synthetic version 1 workflow. The replacement grant remains active for pilot use.

The first response incorrectly said an embedded viewer was unavailable even
though it rendered. The API now describes the configured viewer to the model as
explained below. After rebuilding/restarting the API and refreshing the plugin
metadata, a fresh Work conversation rendered the viewer and correctly described
opening version 1 in it. The same request listed recorded runs and reported none
in the saved workflow library, without executing or changing anything. The
refreshed viewer, empty-history and narration checks passed. Expand was also
rechecked in that fresh conversation: the viewer opened in the right sidebar
without changing the browser tab or URL.

The runtime uses a fresh isolated database with all **11 managed migrations**,
a dedicated synthetic account/workspace, and a saved canonical workflow definition
at **version 1, with 12 blocks and 14 edges**. It contains **no runs or results**.
The temporary public Cloudflare HTTPS endpoint is protected by the pilot's
authentication and consent checks. A local gateway exposes only built
account-linking pages/assets, sign-in/sign-out, OAuth/discovery and MCP routes;
other application APIs are blocked. No customer database, production deployment
or public directory submission is involved.

Runtime files and credentials remain in ignored, access-restricted
`.local/chatgpt-pilot/` files. The connection depends on those local services and
the tunnel remaining available. A new Quick Tunnel hostname requires matching
origin/resource configuration and fresh account linking. The
[account-linking guide](chatgpt-account-linking.md) records the runtime boundaries,
credential lifetimes and revocation/reconnect procedure. Earlier automated test
results below are historical evidence, not proof of this live connection.

## Plugin branding

The plugin uses the existing InScope mark from
[`src/app/icon.svg`](../artifacts/ai-workflow-builder/src/app/icon.svg), copied
byte-for-byte to [`plugins/inscope/assets/icon.svg`](../plugins/inscope/assets/icon.svg).
The canonical application asset remains unchanged. This replaces the development
package's placeholder icon without changing tools, access or workflow behavior.
The SVG is a passive, square 200-by-200 asset.

The repository's portable [`plugin.json`](../plugins/inscope/plugin.json) already
points its `logo` and `composerIcon` at `./assets/icon.svg`. The installed personal
**InScope Private Pilot** is a separate exported package with
`.codex-plugin/plugin.json` and a registered MCP mapping in `.app.json`. Its
branding update must preserve that manifest format, identity, descriptions,
capabilities and registered mapping rather than replace them with the development
manifest. [OpenAI's package guidance](https://developers.openai.com/plugins/deploy/submission)
defines these icon paths relative to the plugin root.

An icon-only version **1.0.1** has been prepared from the installed version
**1.0.0** export under ignored `.local/chatgpt-pilot/branding/`, alongside the
original ZIP backup and validation report. The only manifest changes are the
version and `interface.logo` / `interface.composerIcon`, both set to
`./assets/icon.svg`; `.app.json` is byte-identical. Archive entry/path checks,
canonical SVG equality, dimensions and passive-content checks passed. The personal
plugin page subsequently showed installed version **1.0.1** on 2026-10-08. The
installed **1.0.2** instructions package retains the same icon asset and mapping.
The canonical orange/purple InScope mark was visually verified on the ChatGPT
plugin settings page. Rendering in every other host surface was not checked.

## Workflow and viewer boundary

The data tools are `list_workflows`, `get_workflow_version`,
`list_workflow_runs`, and `inspect_workflow_run`. `open_workflow_view` is the
explicit presentation tool for an exact saved version or recorded run. It
requires `workflowId` and exactly one of `version` or `runId`, with an optional
`blockId`. All five tools read the server-saved
workspace library. They never save, execute, approve, import sample data, search
external providers or start a computer task. Unsynchronized browser changes are
not visible to these tools. Missing exact versions and runs fail visibly.

The viewer uses the existing recorded workflow builder and its isolated store.
It preserves workflow/version/run identity and shares selected-block context
with its host. Asking for an explanation is an explicit follow-up action. The
browser host harness tests these messages locally. The live selected-block
context evidence is recorded separately above.

When a viewer asset is configured, only `open_workflow_view` attaches the
`ui://inscope/workflow-viewer-v2.html` resource and describes opening the viewer.
`get_workflow_version` and `inspect_workflow_run` return data without requesting
another widget, so a follow-up explanation does not open another canvas. Their
exact snapshots remain available to an existing component's explicit refresh.
The resource supplies a description and
`contents[]._meta["openai/widgetDescription"]` so the model can explain its
selection and expansion controls. These are capability descriptions for
compatible hosts, not evidence that a host rendered the resource. Deployments
without a configured asset cannot open the viewer. This presentation split does
not add write/execute permissions or change stored calculation rules.

The viewer opens with an ordered overview of the actual saved blocks, labelled
statuses and a Steps/Canvas switch. Its sticky context header belongs inside the
component. Recorded-run views count successful recorded block results; a saved
definition has no completion percentage. Readiness, review and approval remain
separate states. Details open only when requested; refresh reads the same exact
record and updates the existing view in place. Expansion can place that component
beside the conversation when supported by the host.
The plugin does not own a persistent native ChatGPT header, and these controls
must not be described as such. The earlier live evidence above predates this
explicit-open/step-overview update; its new acceptance results are recorded
separately in the conversation and step-view follow-up below.

The embedded inspector displays saved configuration and recorded evidence as
read-only data. The main application's advanced editing panels remain in the
main application. This build boundary keeps authoring controls, upload workers
and external editor assets out of the viewer.

Selecting a block shares its exact identity. For an explanation, the model can
read that block's configuration and recorded result using the optional `blockId`
argument. The full graph in the widget payload is not automatically visible to
the model. Reads exceeding 1 MiB fail explicitly instead of returning partial
evidence. Large workflows therefore need further work before this viewer can
cover every existing library.

The adapter omits credential-shaped field names and configuration signatures
from outgoing projections, and reports when fields were omitted. This is a
heuristic filter, not a guarantee that arbitrary prose, URLs or formula code
contain no secrets. Stored workflow records are unchanged. Review the actual
data-disclosure policy before connecting customer data remotely.

Company/engagement selection, editing, execution, source search and computer
delegation remain later capabilities. A workspace is an access boundary, not
automatically a company. Do not invent a company, scope or computer connection
from a workflow name.

## Where assistant instructions belong

The ChatGPT-facing workflow guidance is
[`plugins/inscope/skills/review-workflow/SKILL.md`](../plugins/inscope/skills/review-workflow/SKILL.md).
It carries over Sina's concise, practical conversation style while describing
only these connected read tools. It answers from saved evidence, offers a useful
next step, fetches selected-block details, and distinguishes asking about a
workflow from executing it. ChatGPT attachments are not automatically InScope
Sources or workflow inputs; the plugin must not request an upload as though it
can ingest or calculate it. It cannot invent progress or reproduce an official
workflow result outside the execution service.

There are three separate instruction owners:

| Owner                                         | Location and effect                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plugin skill                                  | The `SKILL.md` above supplies task guidance when loaded by the host. It must be packaged in the installed plugin to be available. It does not replace ChatGPT's system instructions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| MCP server instructions and tool descriptions | [`server.ts`](../artifacts/api-server/src/lib/chatgpt-plugin/server.ts) supplies shared routing/capability guidance and each tool's contract. These describe connected capabilities; they do not create a new model agent or grant permissions.                                                                                                                                                                                                                                                                                                                                                                                                       |
| Main application's model-agent prompts        | Sina's base instructions are in [`assistant-thread.tsx`](../artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx); [`agent-config.ts`](../artifacts/ai-workflow-builder/src/features/assistant/runtime/agent-config.ts) adds optional fiscal guidance and operator instructions. MicroSina's base instructions/model are owned by its pinned Microsoft Foundry agent, with a local copy in [`docs/microsina-foundry/instructions.txt`](microsina-foundry/instructions.txt). [`foundry-model.ts`](../artifacts/api-server/src/lib/foundry-model.ts) invokes that saved agent. None is invoked automatically by the MCP reader. |

The exported installed pilot **1.0.0** contained only `.app.json` and
`.codex-plugin/plugin.json`; the prepared icon-only **1.0.1** added the SVG.
Neither contained the repository skill. The behavior update must add
`skills/review-workflow/SKILL.md` and declare the skills directory in the exported
manifest while preserving its registered `.app.json` mapping and icon. A prepared
**1.0.2** archive and validation report are under ignored
`.local/chatgpt-pilot/branding/`; its only manifest changes from 1.0.1 are `version`
and `skills: "./skills/"`. The mapping and icon remain byte-identical. A prepared
archive alone is not evidence that ChatGPT has installed or loaded those
instructions. The live plugin page subsequently confirmed **New version
uploaded**, version **1.0.2**, and a visible `review-workflow` skill entry.
Installation and skill listing are verified. The later fresh-chat acceptance below
also verified guidance activation and the canonical icon in plugin settings.
Do not copy Sina's entire base prompt into this package: it names upload,
execution, memory and computer tools that this plugin does not expose.

### Interpreting the saved FAPI line A

A read of the isolated pilot's saved version 1 confirmed that line A has
`formulaExpression = pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4`
alongside fallback `operation = max_subtract_zero` and the two bucket operands.
The [canonical template](../artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/sample-workflows/fapi-template.ts)
contains the same fields. The
[Calculation Engine executor](../lib/workflow-executors/src/execution/blocks/logic/calculation-engine/run.ts)
evaluates a nonempty `formulaExpression` first; it uses `operation`/`operands`
only without an expression. Explaining line A as the fallback operation alone
would therefore misstate the configured behavior. The difference is worth
identifying, but it is not evidence that a run failed or a reason to change the
formula or impose a new execution block. The pilot contains no recorded results;
this observation checks configuration semantics, not tax correctness or outputs.

## What happens in code

| Component           | Location                                                    | Responsibility                                                                                                                        |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| MCP adapter         | `artifacts/api-server/src/lib/chatgpt-plugin`               | Validate tool inputs and return bounded read projections through workflow-core.                                                       |
| MCP transport       | `artifacts/api-server/src/routes/chatgpt-plugin.ts`         | Serve stateless MCP at `/api/chatgpt/mcp` using browser session checks or an OAuth grant; both require current workspace read access. |
| Account linking     | `artifacts/api-server/src/security/chatgpt-oauth`           | Own optional private-pilot consent, credential lifecycle and MCP bearer authorization.                                                |
| Embedded viewer     | `artifacts/ai-workflow-builder/src/features/chatgpt-plugin` | Render the recorded canvas and communicate with an MCP Apps host.                                                                     |
| Viewer build        | `artifacts/ai-workflow-builder/vite.chatgpt.config.ts`      | Produce `dist-chatgpt/chatgpt.html` independently of the main application.                                                            |
| Plugin instructions | `plugins/inscope`                                           | Package task guidance and presentation metadata; no credentials or deployment URL.                                                    |

The source plugin package currently contains instructions only. It deliberately
does not claim a working remote MCP connection. Do not publish this package as a
complete customer plugin. Once the configured server is reachable, package its actual
HTTPS MCP endpoint in `mcp.json` alongside the skills before the first submission.

Use the Node and pnpm versions pinned in `.node-version` and `package.json`.
No additional model API key is required to build or test the read-only adapter.

```sh
pnpm run doctor
pnpm install --frozen-lockfile
pnpm --filter @workspace/ai-workflow-builder run build:chatgpt
pnpm --filter @workspace/api-server run build
pnpm run test:chatgpt-viewer
pnpm exec node --test tests/integration/chatgpt-plugin.test.mjs
pnpm run verify
```

The API integration suite creates its own disposable database and real login
sessions. It requires Docker. The viewer tests use a local host harness and
synthetic fixtures, with no paid model or live customer database.

On Windows, the task shell must include `%SystemRoot%\System32` on `PATH` so
Playwright can stop its own test server with `taskkill`. Keep this a task-shell
setting; no global runtime or PATH change is required.

To let the development API return the built viewer, set `INSCOPE_CHATGPT_UI_PATH`
to the absolute path of `artifacts/ai-workflow-builder/dist-chatgpt/chatgpt.html`
in that API process, then restart it. This is server configuration, never a tool
argument. If the resource is not configured, tools must remain usable as text
and must not advertise a working viewer.

## Steps from local code to a real ChatGPT pilot

1. **Build and verify this read-only foundation.** Prove authorization, exact
   version/run selection, no writes, graph rendering and selected-block context.
2. **Configure the implemented account linking.** Apply migration `0010` through
   the normal migration process in the chosen development environment, configure
   the exact OAuth client/callback and pilot account IDs, then restart the API.
   Follow the [account-linking guide](chatgpt-account-linking.md). Never paste
   passwords, client secrets or cookies into a conversation.
3. **Make the authenticated server reachable.** For a private pilot, choose an
   approved HTTPS development endpoint or Secure MCP Tunnel. A tunnel solves
   reachability, not account authentication. Deployment is a separate action.
4. **Connect it in ChatGPT.** Follow the steps below using the actual endpoint
   and its configured authentication. Do not select “No authentication” to make
   a company-data endpoint appear to work.
5. **Run a live acceptance session.** Open a saved version, select a block and ask
   for its explanation. Check what ChatGPT actually knows after each interaction.
   The current isolated fixture has no runs: verify an empty run list and a
   missing-run error rather than claiming execution results. Inspect an exact
   recorded run only when a deliberately prepared test record exists. Then test
   an inaccessible workspace, an expired/revoked connection and a missing version.
   Record results and reconnect after the revocation test.
6. **Expand only after that path works.** Add real company/engagement context,
   search and evidence, then separately reviewed write/execute capabilities and
   computer delegation. Keep the existing application available during the pilot.

## What you do in ChatGPT

These steps apply **after** the OAuth settings are configured and the server is
reachable. The unconfigured browser-only route alone will not connect.

1. Open **Plugins**, choose **+ → Add custom MCP server**.
2. Name it **InScope**, enter the actual HTTPS MCP URL or select its Secure MCP
   Tunnel, and configure the matching authentication.
3. Complete account linking and create/install the resulting personal plugin.
4. Start a new **Work** chat, invoke **@InScope**, and ask: “List my saved workflows.”
5. Choose an actual returned workflow and version: “Open version 3 of this
   workflow.” Use a version that exists in your library. The explicit open uses
   `open_workflow_view`; subsequent questions use the data tools.
6. Select a block in the viewer and use **Explain this block**, or ask a follow-up
   in the native ChatGPT composer. Verify the exact IDs and recorded evidence.
7. After changing tools, metadata, authentication or UI resources, restart/update
   the server, refresh the custom connection and test in a new chat.

You do not upload the application repository into a chat, rebuild a composer,
or add calculation formulas to ChatGPT's system prompt. Code supplies the tools
and viewer; plugin skills supply procedures; server data supplies current rules
and engagement context.

Private workspace access and public directory publication are separate rollout
steps. Public review requires verified publisher identity, production hosting,
authentication, privacy/support materials and tested capabilities. It is not
required for a personal development connection. The personal pilot setup above
does not constitute production deployment or public submission/publication.

## Conversation and step-view follow-up (2026-10-08)

This increment separates explicit viewer opening from ordinary data reads,
adds a compact step overview with in-place refresh, and packages the workflow
skill so ChatGPT can discover the pilot's guidance. It does not introduce a
second workflow engine or change saved calculations, account linking or workspace
authorization. The architecture guide and product blueprint remain accurate:
workflow rules still belong to the portable packages, this adapter remains
read-only, and broader execution/agent policy is unchanged.

Git inspection distinguishes this increment from the mixed working tree.
`docs/FUNCTIONALITY.md` and the shared `recorded-workflow-builder.tsx` are tracked
modified files. The other files listed below appear as untracked in Git because
their earlier plugin foundation has not been committed; they already existed at
the start of this increment except the two new step components. Existing edits
outside this inventory are preserved. No commit, push or publication is part of
this inventory.

| File                                                                                     | Purpose and before/after behavior                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/lib/chatgpt-plugin/server.ts`                                  | Owns MCP registration and guidance. Previously both version/run readers advertised a viewer; now only `open_workflow_view` carries the versioned viewer resource, while data readers remain callable by the model and existing widget. Adds shared instructions for exact follow-ups and unavailable actions.          |
| `artifacts/api-server/src/lib/chatgpt-plugin/read-tools.ts`                              | Owns bounded read dispatch. Adds `open_workflow_view` with exactly one version/run ID and delegates to the existing exact read after validating that choice. The resource URI becomes `workflow-viewer-v2.html`; filtering, size limits, saved records and read-only behavior are preserved.                           |
| `tests/unit/chatgpt-plugin.test.ts`                                                      | Extends read-tool checks for invalid explicit-open arguments before reads, exact snapshot equivalence, selected-block evidence, filtering and no mutation. No production behavior change.                                                                                                                              |
| `tests/integration/chatgpt-plugin.test.mjs`                                              | Extends real-session MCP coverage for five tools, data-only follow-up metadata, viewer availability, exact open requests, denied access and unchanged storage. No production behavior change.                                                                                                                          |
| `tests/integration/chatgpt-oauth.test.mjs`                                               | Updates authenticated discovery expectations for the new fifth read tool while retaining OAuth security-scheme checks. No production behavior change.                                                                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/host-bridge.ts`               | Owns host communication. Adds direct authenticated refresh of the exact selected version/run into the existing view, rejecting changed identities, older revisions and late responses. Refresh sends no chat message; Explain explicitly requests evidence without another viewer.                                     |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/view-contract.ts`             | Validates incoming viewer snapshots and selected context. Adds typed recorded-step/readiness information and graph/step consistency checks so mismatched evidence cannot remain displayed.                                                                                                                             |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/workflow-viewer.tsx`          | Composes the viewer. Previously started with the canvas and inspector; now starts with the step overview, keeps context/status controls inside the panel, offers Steps/Canvas, and refreshes in place while preserving the exact selection. Details require explicit selection.                                        |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/viewer.css`                   | Styles the embedded overview, contextual header, step statuses and details across compact and expanded host sizes. It does not style the native ChatGPT header or the main application shell.                                                                                                                          |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/step-read-model.ts`           | New display projection of actual blocks and recorded steps. Separates current successful results, outdated evidence, input readiness and reviewed checkpoints; saved definitions do not report completion progress. It adds no execution rules.                                                                        |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/step-navigator.tsx`           | New ordered step interface with labelled statuses, explicit details, saved configuration and recorded evidence. It shares block selection and an explicit explanation action; it provides no edit or run controls.                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/recorded-workflow-builder.tsx` | Shared recorded canvas. Adds optional `openInspectorOnMount`, defaulting to the previous `true` behavior. The plugin passes `false` so its canvas opens without an inspector; existing main-app consumers retain their behavior.                                                                                       |
| `e2e/chatgpt-workflow-viewer.spec.ts`                                                    | Extends the local host harness for default steps, accurate recorded progress/readiness, selection, direct refresh, late/error responses, evidence clearing and explicit canvas inspection. No production behavior change; mocked host tests do not prove live ChatGPT behavior.                                        |
| `plugins/inscope/skills/review-workflow/SKILL.md`                                        | Previously supplied exact-record review guidance only in the source package. Adds concise Sina-style assistance, explicit viewer/data routing, truthful attachment/action limits and Calculation Engine expression precedence; included in the installed 1.0.2 package. Main-app Sina/MicroSina prompts are unchanged. |
| `docs/chatgpt-plugin.md`                                                                 | Records instruction ownership, the installed package's missing-skill correction, presentation/data separation, the line A diagnostic and this focused inventory. No runtime behavior change.                                                                                                                           |
| `docs/FUNCTIONALITY.md`                                                                  | Adds the current follow-up boundary without treating earlier live acceptance as proof of the new behavior. Other existing feature documentation is preserved. No runtime behavior change.                                                                                                                              |

The ignored `branding/prepare-instructions.py` helper adds only the manifest
version/skill declaration and the current skill to the previously exported
package. Its ZIP checks preserve the registered application mapping and icon
byte-for-byte; its validation report and prior archive remain local. The live
plugin page confirms installed version 1.0.2 and the skill listing. The fresh
Work acceptance below also verified skill activation and capability guidance.

Verification for this increment:

- `pnpm run verify` passed, including contracts, architecture, formatting,
  application/library/test typechecks, **187 unit tests**, **37 worker tests**
  and **50 workflow-core tests**. The task used the pinned runtime without a
  global toolchain change.
- Focused plugin unit checks passed **9/9**. The disposable-database MCP/OAuth
  integration run passed **18/18**; the final MCP metadata run passed **7/7**.
  API typecheck and the API production build passed. An initial integration
  invocation failed the pnpm guard and was corrected; no checks were weakened.
- The plugin skill validator, package mapping/icon equality checks and local
  documentation links passed. The user completed the native file selection
  after Computer Use could not target that Windows dialog; ChatGPT then showed
  **New version uploaded**, version **1.0.2**, and the `review-workflow` skill.
- The standalone viewer production build passed. All **seven browser scenarios**
  passed across the first six successful cases and a focused rerun. The remaining
  case initially tried to select a node outside the canvas viewport; adding a
  real **Fit view** action fixed its setup. The rerun also refreshed the preview
  screenshot. Windows test-server teardown required stopping the exact owned
  process after assertions; test expectations and timeouts were not weakened.
- The main application production build passed. It emitted nonfatal existing-
  module sourcemap-location, `node-fetch`/`whatwg-url` browser-externalization and
  large-chunk warnings; those unrelated warnings were not suppressed. Scoped
  formatting and tracked diff-whitespace checks also passed. The earlier results
  below apply only to their own increments.

After the isolated API restart, authenticated public-endpoint discovery returned
all five tools and the v2 viewer resource (2,917,816 bytes). ChatGPT's connection
tools were refreshed. A fresh Work chat,
[FAPI Workflow Status](https://chatgpt.com/c/6ac7e999-6778-83ea-87d0-5e21038dd943),
explicitly announced use of `review-workflow` and opened **one** viewer for the
saved FAPI version 1. The default colored step overview showed 12 steps and
**No run selected**, with details initially closed. The response accurately
reported missing trial-balance data and draft settings, and directed input work
to the main application rather than implying plugin ingestion or execution.

**Expand** placed the same component beside chat without changing the browser
tab or URL. Selecting **FAPI Lines Engine** shared its exact identity. The native
composer follow-up, "Explain the selected step and whether it has produced a
result," identified that block/version, explained expression precedence and
reported no recorded result. The conversation still contained **one** viewer.
**Refresh** changed the snapshot timestamp from 15:06:36 to 15:10:09 local time,
retained the selected block/details and added neither a chat message nor another
viewer. **Canvas** opened on demand without automatically opening its inspector;
switching back restored Steps. The chat was left on that steps panel.

This verifies the tested Work conversation only. The pilot remains read-only
and contains no recorded runs; successful/error/outdated/review progress states
were verified with synthetic browser fixtures, not live FAPI execution. The
temporary service/tunnel and host-controlled panel limits remain unchanged.

## Earlier live metadata follow-up (2026-10-08)

This follow-up validated the isolated runtime and changed only the viewer's
model-facing metadata, its focused regression coverage and these three guides.
The earlier milestone inventories below and in the account-linking guide describe
prior work. Other existing working-tree changes are preserved.

| File                                                    | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/lib/chatgpt-plugin/server.ts` | Previously graph tools/resource contents omitted a model-facing explanation of the configured viewer. Adds qualified viewer wording to the two graph tools, a resource description and `openai/widgetDescription` on resource contents. No workflow-domain, access-control, calculation, workflow-data or frontend behavior change. |
| `tests/integration/chatgpt-plugin.test.mjs`             | Extends the existing MCP integration cases to check both graph-tool descriptions, resource contents metadata, and absence of viewer claims for list tools or an unconfigured viewer. No production runtime behavior change; existing assertions remain.                                                                             |
| `docs/chatgpt-plugin.md`                                | Replaces the earlier unverified-live status with the observed Work acceptance results, model-facing metadata behavior and temporary-runtime limits. Adds this focused inventory. No runtime behavior change.                                                                                                                        |
| `docs/chatgpt-account-linking.md`                       | Separates earlier automated evidence from the isolated live pilot, records successful linking/revocation/reconnect and explains private runtime handling and lifetime limits. No runtime behavior change.                                                                                                                           |
| `docs/FUNCTIONALITY.md`                                 | Updates only the pilot status summary to the verified read-only Work scope, including refreshed narration and empty run history. Unrelated existing documentation edits are preserved; no runtime behavior change.                                                                                                                  |

For the focused metadata change, `pnpm run doctor`, all **6/6** MCP integration
cases, `pnpm run verify` and the production API build passed. Verification included
contracts, architecture, formatting, typechecks, unit tests, 37 worker tests and
50 workflow-core tests. After the API restart and plugin metadata refresh, the
fresh live viewer, empty run history and narration checks passed as recorded
above. These results are separate from the earlier automated checkpoints below.

## Foundation verification (2026-10-07)

These results describe the initial read-only adapter. See the
[account-linking guide](chatgpt-account-linking.md) for the subsequent OAuth
increment, its changed files and verification.

- Pinned Node/pnpm toolchain check and frozen lockfile install passed.
- `pnpm run verify` passed: generated contracts, architecture, maintained-source
  formatting, application/library/test typechecks, 184 unit tests, 37 Mkoro
  worker tests and 50 workflow-core tests. The 184 unit tests include the eight
  new plugin cases.
- The six targeted MCP integration cases passed against a disposable database
  with real login sessions.
- API, main frontend and standalone viewer production builds passed. The viewer
  HTML is approximately 2.9 MB and is below the resource loader's limit. The main
  frontend build emitted sourcemap-location, browser-externalization and large
  chunk warnings; these were not suppressed or addressed in this milestone.
- `pnpm run test:chatgpt-viewer` passed all three browser cases and exited
  automatically. It checks exact selection, explicit explanation, recorded
  evidence, empty/invalid context clearing, host errors, blocked graph deletion
  and absence of unexpected API/asset requests. The local preview was visually
  inspected using synthetic test data.
- The plugin skill passed the Skill Creator validator; new documentation was
  formatted, and tracked changed-file whitespace checks passed.

These initial results did not test an OAuth flow. The foundation and subsequent
OAuth automated suites used disposable or synthetic test data; they did not
verify a live ChatGPT account, production hosting, real company data or public
plugin submission. The later live pilot is recorded separately above.

## Foundation changed-file review (2026-10-07)

This inventory covers this milestone's changes only. The working tree already
contained unrelated workflow, calculation, source and documentation changes;
those are preserved. Paths below are relative to the repository root.

| File                                                                                | Purpose and before/after behavior                                                                                                                           |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/app.ts`                                                   | Adds the explicitly read-authorized MCP mount. Previously this route did not exist; existing session, origin and membership checks still apply.             |
| `artifacts/api-server/src/routes/chatgpt-plugin.ts`                                 | New stateless read transport and session-derived workspace reader. Only POST MCP requests are served; no caller-supplied actor identity is trusted.         |
| `artifacts/api-server/src/lib/chatgpt-plugin/server.ts`                             | New four-tool MCP registration and optional viewer resource registration. No write or execute tools are registered.                                         |
| `artifacts/api-server/src/lib/chatgpt-plugin/read-tools.ts`                         | New bounded projections of exact saved versions and runs, reusing workflow-core. Missing records return errors; reads do not modify the library.            |
| `artifacts/api-server/src/lib/chatgpt-plugin/credential-projection.ts`              | New outgoing field filter and omission reporting. Stored records are unchanged; returned data can omit credential-shaped fields.                            |
| `artifacts/api-server/src/lib/chatgpt-plugin/ui-resource.ts`                        | New optional, bounded server-configured HTML loader. Without a valid configured asset, tools remain data-only.                                              |
| `artifacts/ai-workflow-builder/chatgpt.html`                                        | New standalone viewer entry page; the main application entry is unchanged.                                                                                  |
| `artifacts/ai-workflow-builder/vite.chatgpt.config.ts`                              | New self-contained viewer build with a read-only inspector boundary. It emits a separate HTML asset and rejects external build assets.                      |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/main.tsx`                | New React entry for the viewer, independent of the custom chat shell.                                                                                       |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/view-contract.ts`        | New validation of incoming graph/run identities and compact selected-block context. Invalid responses cannot remain displayed as the previous snapshot.     |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/host-bridge.ts`          | New MCP Apps host connection, context updates, explicit explanation message and expand request. No direct application API transport is added to the viewer. |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/workflow-viewer.tsx`     | New read-only graph view with exact identity, selection, recorded evidence and visible connection failures.                                                 |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/read-only-inspector.tsx` | New viewer-only block/edge inspector. Displays saved data instead of importing authoring panels; the normal application inspector is unchanged.             |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/viewer.css`              | New viewer styles scoped to its standalone entry. No intended main application styling change.                                                              |
| `plugins/inscope/plugin.json`                                                       | New source package metadata. Instructions alone do not install or authenticate an MCP connection.                                                           |
| `plugins/inscope/assets/icon.svg`                                                   | New plugin icon; no application behavior change.                                                                                                            |
| `plugins/inscope/skills/review-workflow/SKILL.md`                                   | New guidance for exact-record review and evidence-based explanations; no account credentials or model system-prompt override.                               |
| `tests/unit/chatgpt-plugin.test.ts`                                                 | New checks for argument validation, exact reads, no mutation, disclosure filtering, response limits and optional UI loading. No production behavior change. |
| `tests/integration/chatgpt-plugin.test.mjs`                                         | New disposable-database checks for real sessions, roles, workspace boundaries, revocation, MCP protocol and UI resources. No production behavior change.    |
| `e2e/chatgpt-workflow-viewer.spec.ts`                                               | New browser checks for canvas rendering, exact host context, read-only behavior and failures. No production behavior change.                                |
| `playwright.chatgpt.config.mjs`                                                     | New isolated viewer browser-test configuration. Existing browser-suite configurations are unchanged.                                                        |
| `scripts/testing/chatgpt-viewer-server.mjs`                                         | New local test host for MCP Apps messages and the built viewer; not a production server.                                                                    |
| `artifacts/api-server/package.json`                                                 | Adds the MCP SDK dependency required by the new transport. Existing scripts are unchanged.                                                                  |
| `artifacts/ai-workflow-builder/package.json`                                        | Adds MCP Apps/SDK dependencies and `build:chatgpt`. The main application build command is unchanged.                                                        |
| `package.json`                                                                      | Adds `test:chatgpt-viewer`; pinned runtime and package-manager versions are unchanged.                                                                      |
| `pnpm-lock.yaml`                                                                    | Locks the added SDK dependencies and their dependency tree; no unrelated version upgrades intended.                                                         |
| `scripts/maintained-paths.mjs`                                                      | Includes the new API adapter and viewer in maintained-source formatting checks. No runtime behavior change.                                                 |
| `.gitignore`                                                                        | Excludes generated `dist-chatgpt` output. No runtime behavior change.                                                                                       |
| `docs/ARCHITECTURE.md`                                                              | Adds the adapter/viewer ownership and current authentication limit. Other pre-existing edits are preserved; no runtime behavior change.                     |
| `docs/FUNCTIONALITY.md`                                                             | Adds the implemented development capability and its limits. Other pre-existing edits are preserved; no runtime behavior change.                             |
| `docs/chatgpt-plugin.md`                                                            | New build/runbook, rollout steps, limits and change inventory. No runtime behavior change.                                                                  |

The product blueprint and pending decisions remain unchanged: this adapter
implements a development read boundary and does not approve new product policy,
company semantics, agent roles or computer permissions.

## Official implementation references

- [Build an MCP server](https://developers.openai.com/plugins/build/mcp-server)
- [Add UI to an MCP server](https://developers.openai.com/plugins/build/chatgpt-ui)
- [Authentication](https://developers.openai.com/plugins/build/auth)
- [Connect and test](https://developers.openai.com/plugins/deploy/connect-chatgpt)
- [Package a plugin](https://developers.openai.com/plugins/build/plugins)
- [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)
