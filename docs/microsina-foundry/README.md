# MicroSina Foundry candidate

## Status — 2026-09-29

MicroSina was created in the existing Microsoft Foundry `fapi` project.
Version 2 contains the instruction baseline in [instructions.txt](instructions.txt).
The portal selected the existing `gpt-5` Global Standard deployment and attached
Web search by default. No new model deployment was created. Web search was not
used in the smoke test; this default tool is not equivalent to Inscope's tools.

- Project endpoint: `https://fapi-resource.services.ai.azure.com/api/projects/fapi`
- Agent name: `MicroSina`
- Active local version: `3` (version 2 instructions/model plus 47 registered functions)
- Portal: [MicroSina](https://ai.azure.com/nextgen/r/tYHHae4FSM6rWKJtdlcdZg,Fapiplatform,,fapi-resource,fapi/build/agents/MicroSina/build?tid=77e5732d-7332-40ed-9b89-9ea4afccb135)

The local Inscope code offers MicroSina as a second agent. Backend credentials
are configured locally, and the user assigned Foundry Agent Consumer access at
MicroSina's agent scope. A direct live request to the agent endpoint succeeded
with version 2; a nonexistent requested version returned 404. The earlier project
Responses endpoint returned 403 with this scoped identity. The adapter now uses
`/agents/MicroSina/endpoint/protocols/openai/responses?api-version=v1`.
No Publish action or production deployment was performed. Full Inscope UI and
Replit verification remain outstanding.
Live streaming through the actual CopilotKit adapter returned
`MicroSina connection OK.` with no stream errors. The adapter now omits request-time
tool schemas (rejected by saved agents), sending only currently available function
names in `tool_choice`. Version 2 lacked these functions and returned HTTP 400.
The user ran the Cloud Shell import successfully, creating version 3 with 47
registered functions. A live test through the actual CopilotKit adapter requested
`listAvailableWorkflows`, consumed a synthetic tool result, and returned its exact
marker with no additional calls or stream errors. No real workflow was executed.
The ignored local `.env.local` version pin was changed from 2 to 3 and the Docker
API service recreated to load it. Replit's version pin was not changed.

### Full chat request compatibility correction

The first live UI request still returned HTTP 400 despite the earlier isolated
model/tool probe. Reproduction identified two additional request differences:

- The SDK omits `type: "message"` on easy-input messages. Foundry rejected the
  request when developer context was present. The adapter now adds that
  discriminator without changing content, roles or function-call history.
- CopilotKit's BuiltInAgent adds `AGUISendStateSnapshot` and `AGUISendStateDelta`
  automatically. These generic coagent state helpers are not registered in
  Foundry, and Inscope does not use them for its action handlers. The adapter
  excludes exactly those two helpers; it keeps application tools and fails
  visibly for an unknown/unregistered application tool.

A live run through the full BuiltInAgent with all 47 Inscope tool definitions
streamed a MicroSina identity response and emitted `RUN_FINISHED`. This exercises
the runtime's tool injection in addition to the model adapter. It is not a claim
that the user's existing browser tab or every approval interaction was tested.

Files for this correction: `foundry-model.ts` normalizes messages and excludes
the unused runtime helpers; `microsina-foundry.test.ts` adds regression coverage
for message/history preservation and exact helper filtering; this README records
the cause and verification, with no additional runtime behavior. Other prior
MicroSina working-tree changes are retained. Existing architecture and functionality
summaries remain accurate; no product policy, database or dependency changes.

Correction verification: full `pnpm run verify`, all seven focused MicroSina
tests, and the API production build passed. A live full BuiltInAgent request with
application context and 47 tools returned “I'm MicroSina, the InScope workspace
assistant” and `RUN_FINISHED`. The local API was restarted and is healthy.
No Foundry version update, commit, push or Replit deployment was needed.

Endpoint correction checks: `pnpm run verify`, the five focused MicroSina unit
tests, and the API production build passed. These mocked tool tests establish
adapter serialization only; the later version-3 live function round trip passed. The local API
was restarted to load the endpoint correction. No commit, push or Replit deploy
was performed. Architecture and functionality summaries remain accurate about
shared tool surfaces and unverified live parity; this page records the provider
restriction found during activation.
Sina remains the initial default. See the integration details below and the
[file-by-file change report](integration-report.md).

## Instruction provenance

The baseline was extracted from the `INSTRUCTIONS` template in
`artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`.
That file already contained uncommitted work when this task began. Its SHA-256
at extraction was
`2a965b69d8f268522a9610e6139816904d6b5c5005475781cec662a7388dc8fe`.

Changes to the extracted prompt:

- Changed self-identification from Sina to MicroSina.
- Replaced dynamic page/field interpolations with explicit requirements for the
  authenticated host to supply those catalogs; no catalog entries were invented.
- Added a migration-status paragraph requiring honest missing-tool reporting.
- Preserved the other base instructions, including existing fiscal statements.
  Those statements were copied, not independently reviewed in this task.

The resulting 12,794-character instruction file has SHA-256
`442843be89b5ff6f82b62dc7d0b28373dd816752a64219f708c7b3a9d2c37e52`.
This is a historical baseline, not a second runtime configuration source.
Future agent changes should be made in Foundry and recorded with their versions.

## Important gaps in clone parity

- Workspace-specific fiscal settings and extra instructions are stored in browser
  state by `runtime/agent-config.ts`; their effective user values were not read.
- That module explicitly says model/effort settings are stored but not yet wired
  to control live chat. Agent Lab routing is not proof of live Sina routing.
- Live chat uses the CopilotKit route, which prefers Replit AI Integrations when
  configured, otherwise Vercel Gateway. It uses `OPENAI_CHAT_MODEL` for its default.
- The local adapter now shares live context, UI tools, approval cards and
  authenticated actions. Their live-provider round trip remains unverified.
- Foundry's `gpt-5` selection is an initial test configuration, not model parity.
- Local Docker receives Azure credentials from the ignored `.env.local` file.
  Browser sign-in is not backend identity; Replit must have its own server configuration.

## Verification actually performed

The portal showed version 2 after Save. The instruction text was visible in the
agent editor. One playground prompt asked for identity, missing-tool reporting,
question-versus-action handling, and refusal to invent company figures; it
explicitly prohibited tool calls and browsing. The displayed response answered:

- Name: MicroSina.
- Inscope workflow tools are not connected in this smoke test.
- Asking what FAPI is should not start a workflow.
- A company amount cannot be reported without documents or run results.

The portal reported model `gpt-5`, 5 seconds and 7,431 tokens. This was one combined
smoke test, not an evaluation suite or evidence of Inscope integration. No company
documents were uploaded. That playground test predates the application integration;
local application checks are recorded in the change report.

## Inscope connection

The existing Express backend hosts both agents. No additional server is required.
MicroSina uses CopilotKit's own model adapter with a server-only OAuth transport
to MicroSina's Foundry agent Responses endpoint. The request pins `MicroSina` and the configured
version. It does not override the Foundry model, base instructions or sampling
settings. It sends the current conversation and available function names, and
constrains tool choice to those functions, excluding inherited hosted tools such
as the portal's default Bing search. Inscope's existing web-search tool remains
available through the same application controls as Sina.

Requests use `store: false` and do not reuse a Foundry conversation or previous
response ID. Inscope retains its existing workspace-scoped chat persistence.
This is not a claim about Azure's service-level retention or logging policy.
Workspace fiscal settings and additional operator instructions still layer onto
the dynamic context for both agents; Agent Lab is not fully migrated by this change.

The Chat agent selector is enabled only in an empty, unsaved conversation.
Its choice is saved as `chatAgent` metadata on the first stored message, outside
the model text. Legacy records without metadata select Sina; unsupported values
fail restoration rather than choosing another provider. A browser-scoped cache
keeps the selected agent during reload, while saved metadata restores it across
devices. Existing server session and workspace membership checks remain in force.
Workflow approval requests use the selected agent ID. A grant scoped to Sina is
not automatically a grant for MicroSina.

### Required backend configuration

Place these variables in the API server's environment (Replit Secrets for the
Replit deployment), never in frontend `VITE_` variables or source control:

| Variable                    | Meaning                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `AZURE_AI_PROJECT_ENDPOINT` | `https://fapi-resource.services.ai.azure.com/api/projects/fapi`                       |
| `MICROSINA_AGENT_VERSION`   | `4` locally, with public toolbox version 1; change deliberately after verification |
| `MICROSINA_PUBLIC_TOOL_SEARCH` | Optional `true` after verifying a version with public toolbox v1 attached; defaults off |
| `AZURE_TENANT_ID`           | Microsoft Entra directory containing the application identity                         |
| `AZURE_CLIENT_ID`           | Application/client ID of the backend identity                                         |
| `AZURE_CLIENT_SECRET`       | Secret value for that identity; keep it only in server secrets                        |

The identity needs Foundry Agent Consumer at MicroSina's agent scope (or a parent
scope). Agent-scoped access requires the agent endpoint used by this adapter;
it does not authorize the project-wide `/openai/v1/responses` route.
This implementation supports client-secret OAuth, not browser login or a managed
identity. Token acquisition uses the `https://ai.azure.com/.default` scope, caches
unexpired tokens and forwards cancellation with a two-minute request timeout.
Provider failures are reported without echoing raw response bodies. No credential
is stored in source control. The user entered the secret privately in local and
Replit configuration; its value must never appear in logs or documentation.

### Remaining activation work

1. Verify interactive local Inscope chat with version 4, including real application tool
   handlers and approval UI. The synthetic provider round trip passed.
2. Review and authorize deployment of the local changes, then verify Replit's environment.
3. Verify separate test conversations, streaming, tool results, role denials,
   approval behaviour, document provenance and Goose delegation before switching.
4. Compare Sina and MicroSina on the same representative requests. Foundry's saved
   `gpt-5` model may differ from Sina's configured model; identical wording and
   decisions cannot be promised merely by sharing instructions and tools.

Reference: [Foundry prompt-agent quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/prompt-agent).
Request contract: [Microsoft Foundry REST reference](https://learn.microsoft.com/en-us/rest/api/microsoft-foundry/aiproject).

## Public tool search setup

The user verified `inscope-public-tools` version 1 in Cloud Shell: its MCP endpoint
advertises `tool_search` and `call_tool`. MicroSina version 4 passed exact definition
readback and both live tool calls in Cloud Shell. Local activation now selects
version 4 with `MICROSINA_PUBLIC_TOOL_SEARCH=true`; Replit is not activated.

The first external toolbox is limited to public Microsoft documentation. Private
document connections are deferred at the user's request. Tool search discovers
tools in a configured toolbox; it does not install arbitrary servers or grant
access to an entire public catalog.

Upload [enable-public-tool-search.py](enable-public-tool-search.py) through
Cloud Shell's **Manage files > Upload**, then run:

```sh
python3 enable-public-tool-search.py --apply
```

The new script creates `inscope-public-tools` with tool search and three allowed
Microsoft Learn operations: `microsoft_docs_search`, `microsoft_docs_fetch`, and
`microsoft_code_sample_search`. Automatic approval applies only to these public,
read-only operations. It does not establish approval policy for future tools.
Without flags the script previews configuration without requesting credentials.

Creation uses the signed-in Azure user's project permissions. Tokens stay in
memory. A receipt, `inscope-public-tools-result.json`, prevents blind repeated
creation. Keep that receipt if the ephemeral Cloud Shell session is ending.
If creation succeeded but verification is delayed, retry without creating another
version:

```sh
python3 enable-public-tool-search.py --verify-only
```

Success here means the versioned MCP endpoint advertises `tool_search` and
`call_tool`. It does **not** mean MicroSina can use the toolbox yet. No agent version,
role assignment, application behavior, or deployment is changed by this setup script.

The starter recommendation is to retain Inscope's existing web search, Canadian
tax search, page fetching and calculation tools, and add Microsoft Learn for
Azure/Foundry development. Consider Code Interpreter later for sandboxed data
analysis after reviewing its configuration and costs. Additional document services
and their account connections are outside this initial public toolbox.

Verification so far: the public Microsoft Learn server returned the three expected
read-only tools; local script preview, payload assertions and JSON/SSE parsing
checks passed. The user's Cloud Shell result confirms toolbox creation and its two
discovery/call operations. MicroSina version 4 also passed a live backend search.

Files for this step: the new Python script adds an explicit administrative setup
operation; this README documents its behavior and activation status. Existing
application changes from the preceding MicroSina repair are separate. Architecture
and functionality summaries retain the same ownership boundaries.

References: [Foundry toolbox setup](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/toolbox),
[tool search](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-search),
and [Microsoft Learn MCP](https://learn.microsoft.com/en-us/training/support/mcp).

### Attach the public toolbox to MicroSina (completed for version 4)

The following creation step has already completed; do not repeat it for version 4.
For a fresh setup, upload [attach-public-toolbox.py](attach-public-toolbox.py) to signed-in Cloud Shell:

```sh
python3 attach-public-toolbox.py --apply
```

This administrative step checks that toolbox version 1 contains exactly the
reviewed public documentation operations, grants the Foundry project managed
identity Foundry User on this project if needed, and creates the named
`inscope-public-tools-v1` RemoteTool connection using that identity. This project
identity is shared infrastructure, and Foundry User grants more than read-only
tool invocation; it is the documented toolbox runtime role. The app's separate
consumer identity gets no additional roles. No secrets are copied into the agent.

The script copies MicroSina version 3, preserves its entire definition and metadata,
and appends one MCP attachment under `inscope_public_tools`, pinned to toolbox
version 1. Its automatic approval is limited to this verified public toolbox.
Private/write capabilities require a separately reviewed configuration. Existing
connections with different settings are rejected instead of overwritten.

The script verifies the new definition and sends a synthetic streamed request
asking the candidate to perform both `tool_search` and `call_tool`. It records
completed calls and errors without printing request credentials or provider output.
Return the result for a test using the app's backend identity and CopilotKit runtime.
Only after that succeeds should local `MICROSINA_AGENT_VERSION` select the returned
version and `MICROSINA_PUBLIC_TOOL_SEARCH=true` enable it. Recreate the local API
container to load updated environment values; Replit activation is separate.

Keep `microsina-toolbox-attachment-result.json`. If a candidate was created but
verification failed or role propagation is delayed, run `--verify-only`. If setup
stopped before recording a version, inspect the receipt/resources before retrying.
The script does not automatically roll back partial role/connection creation or
repeat an uncertain agent creation. It never changes the local environment or
deploys the application.

The first attachment attempt created candidate version 4, then stopped because the
saved definition did not exactly match the submitted one. The user's diagnostic
identified one difference at `/definition/tools/48/allowed_tools`: the submitted
array was saved as an object. The script now uses the documented MCPToolFilter
form, `{"tool_names":["tool_search","call_tool"]}`, in the expected attachment.
Comparison remains exact; it does not ignore differences or accept extra filters.
The script reports differing JSON paths, change kinds and value types without printing
instructions or field values. Re-upload it and run `--verify-only` with the existing
receipt to inspect that candidate. It still blocks activation and the live test
when any difference exists; it does not create another version during verification.
The local consumer identity returned HTTP 403 for listing agent versions, so the
readback diagnostic must run under the signed-in Cloud Shell identity.

Diagnostic repair files: `attach-public-toolbox.py` replaces the generic mismatch
message with field-level diagnostics and clarifies verify-only output;
`test_attach_public_toolbox.py` adds offline coverage for changed instructions,
endpoints, approvals, missing tools, types, ordering and value redaction; this README
records the diagnosis. That repair did not change app runtime behavior or activate
the candidate. Architecture and product summaries remain accurate. Run the focused
checks with `python docs/microsina-foundry/test_attach_public_toolbox.py`.
All six focused tests pass, including rejection of additional/missing tools and
unexpected filter properties. The change is limited to the script's expected
wire format, its regression tests and this setup record; app behavior is unchanged.
Reference: [Foundry REST MCPTool format](https://learn.microsoft.com/en-us/rest/api/microsoft-foundry/aiproject).

A live synthetic probe of candidate version 4 through Inscope's actual
`BuiltInAgent` and Foundry adapter completed successfully using the backend's
existing consumer identity. Provider events recorded `tool_search` and `call_tool`
as completed without MCP error fields; the streamed reply included a Microsoft
documentation link. The test overrode version/flag only in its own process and
did not access private workspace data. The user subsequently returned
`agent_tool_calls_verified` for version 4 from the corrected script: exact readback
and both calls passed. Local `.env.local` now selects version 4 and enables public
tool search; the API was recreated and its health check passed. An interactive
browser conversation has not yet been verified.

Post-restart verification used the API container's actual environment, without
version/flag overrides, and offered all 47 native functions alongside the public
toolbox. `BuiltInAgent` reached `RUN_FINISHED`; both MCP calls completed without
reported errors and the reply included an official Microsoft documentation link.
Only a synthetic public query was sent; native function execution and the browser
approval flow were not exercised by this particular test.

Files changed for attachment support:

- `artifacts/api-server/src/lib/foundry-model.ts`: previously allowed native
  functions only; now a server-only opt-in additionally permits the two named MCP
  operations under the fixed public label. Default behavior is unchanged. Browser
  input cannot set the flag or attach other MCP servers.
- `tests/unit/microsina-foundry.test.ts`: adds opt-in/disabled/rejected-input checks
  and streamed hosted-MCP compatibility coverage; no application behavior itself.
- `attach-public-toolbox.py`: new explicit administrative setup and synthetic live
  verification; before execution, no Azure behavior changes.
- This README and `docs/ARCHITECTURE.md`: describe ownership, activation and limits;
  no behavior change. The product blueprint and source-connection contracts remain
  accurate because no private connector or source-import behavior is introduced.

Local focused checks passed: nine MicroSina unit tests, including hosted MCP stream
handling; Python payload checks preserve all 47 functions/model/instructions and
reject an unexpected toolbox. Live candidate and backend runtime tests passed.
`pnpm run verify`, the API production build, Python syntax checks and a mocked
complete setup/verify-only retry also passed. No live Azure setup was executed
from the local checkout. Activation changed only the two MicroSina settings in
ignored `.env.local`, followed by a local API restart. No code was committed, pushed
or deployed to Replit. This README records before/after configuration; the
architecture guide continues to describe the server-controlled opt-in correctly.

Authentication reference: [Foundry MCP authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication).

## Register Inscope function schemas

Upload [register-microsina.py](register-microsina.py) and [tools.json](tools.json)
into the same directory in signed-in Azure Cloud Shell, then run:

```sh
python3 register-microsina.py --apply
```

Without `--apply`, the script only reads and previews. It uses the signed-in Azure
CLI identity in memory; no token or secret is printed or saved. It reads version 2
from Foundry, preserves its model/instructions/settings and existing hosted tools,
adds 47 Inscope function schemas, creates a new version, and reads it back to check
schemas, model and instructions. It does not change Azure roles, the app's version
setting, Sina, or any deployment. A local receipt prevents blind duplicate POSTs
after a lost response. If interrupted, inspect Foundry and the receipt before retrying.

The runtime identity has invocation access only. This one-time import needs the
signed-in user's existing agent editing permission, rather than broader access for
the app. Return the printed version number for a synthetic function round trip
before changing the local version pin. Replit requires separate activation.

Regenerate the snapshot with `node scripts/export-microsina-tools.mjs`, and check
drift with `node scripts/export-microsina-tools.mjs --check`. The exporter reads
literal hook declarations (including builder-only tools) without running handlers.
It uses CopilotKit's schema converter. Dynamic description values become a reference
to the current Inscope context; parameter types and required fields are preserved.
Unsupported nonliteral schemas fail export instead of being guessed.

The browser regression compares every offered chat tool's parameter shape with
this snapshot. Saved definitions do not make all tools available on every turn:
the adapter's function allowlist still follows the current Inscope registrations.
The public-toolbox opt-in additionally permits its two MCP operations; other hosted
tools remain excluded. Without that opt-in it selects `none` when no functions are
available. Function execution,
workspace membership and approval checks remain in their existing application owners.

### Files changed for tool registration

- `artifacts/api-server/src/lib/foundry-model.ts`: previously sent schemas on each
  request; now selects saved function names and keeps the pinned version/history.
- `tests/unit/microsina-foundry.test.ts`: asserts schemas are absent while the
  available function allowlist and version are retained; no app behavior itself.
- `scripts/export-microsina-tools.mjs`: new declaration-only catalog exporter and
  drift check; no runtime handlers or user data are executed/read.
- `tools.json`: generated registration snapshot of 47 function definitions;
  these take effect in Foundry only after import and deliberate version activation.
- `register-microsina.py`: explicit Cloud Shell import with base preservation,
  readback verification and a retry receipt; no unattended runtime synchronization.
- `e2e/microsina-chat.spec.ts`: compares the actual chat tool schemas with the
  snapshot and attaches their definitions as test evidence; no production behavior.
- This README: setup, activation limits and before/after explanation only.

Architecture and functionality guides remain accurate about shared tools,
Foundry ownership and unverified model parity. The product blueprint is unchanged.

### Tool-registration verification

- `pnpm run verify`: passed after the adapter change.
- `pnpm --filter @workspace/api-server run build`: passed.
- Catalog regeneration/check: 47 function schemas; no hooks executed.
- Focused browser regression: passed, including parameter-shape comparisons for
  all 37 offered chat tools. Evidence:
  `test-results/phase2/04a727d1-129a167a-fec8-4658-bfd6-24db7ca64cc7/report.json`.
- Synthetic Python payload checks passed: preserve base definition and metadata,
  preserve existing tools, reject empty/duplicate/non-function catalogs.
- Live version-2 probe: HTTP 400 because the selected function was not registered.
  After the user created version 3, a live streamed function call and synthetic
  result round trip passed. Actual application tool handlers, approval UI, saved
  chat behavior with the live provider and Replit activation remain unverified.
