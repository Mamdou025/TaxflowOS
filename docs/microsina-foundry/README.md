# MicroSina Foundry candidate

## Status — 2026-09-29

MicroSina was created in the existing Microsoft Foundry `fapi` project.
Version 2 contains the instruction baseline in [instructions.txt](instructions.txt).
The portal selected the existing `gpt-5` Global Standard deployment and attached
Web search by default. No new model deployment was created. Web search was not
used in the smoke test; this default tool is not equivalent to Inscope's tools.

- Project endpoint: `https://fapi-resource.services.ai.azure.com/api/projects/fapi`
- Agent name: `MicroSina`
- Verified saved version: `2`
- Portal: [MicroSina](https://ai.azure.com/nextgen/r/tYHHae4FSM6rWKJtdlcdZg,Fapiplatform,,fapi-resource,fapi/build/agents/MicroSina/build?tid=77e5732d-7332-40ed-9b89-9ea4afccb135)

The local Inscope code now offers MicroSina as a second agent. It has not been
deployed or tested against live Foundry from Inscope. The user clarified that
Azure backend authentication is not configured yet. No Publish action was taken,
and no credentials, production deployment or existing Foundry agent was changed.
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
- No Azure CLI was found on PATH, and the local environment file contains no
  Azure/Foundry credential configuration. Browser sign-in is not backend identity.

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
to the Foundry Responses endpoint. The request pins `MicroSina` and the configured
version. It does not override the Foundry model, base instructions or sampling
settings. It sends the current conversation and registered function tools, and
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

| Variable                    | Meaning                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| `AZURE_AI_PROJECT_ENDPOINT` | `https://fapi-resource.services.ai.azure.com/api/projects/fapi`                |
| `MICROSINA_AGENT_VERSION`   | `2` for the saved candidate; change deliberately after reviewing a new version |
| `AZURE_TENANT_ID`           | Microsoft Entra directory containing the application identity                  |
| `AZURE_CLIENT_ID`           | Application/client ID of the backend identity                                  |
| `AZURE_CLIENT_SECRET`       | Secret value for that identity; keep it only in server secrets                 |

The identity must have permission to invoke the agent in this Foundry project.
This implementation supports client-secret OAuth, not browser login or a managed
identity. Token acquisition uses the `https://ai.azure.com/.default` scope, caches
unexpired tokens and forwards cancellation with a two-minute request timeout.
Provider failures are reported without echoing raw response bodies. No credential
has been created or stored by this task.

### Remaining activation work

1. Establish an authorised backend Azure identity for this Foundry project.
   Do not copy browser session tokens into the app or expose credentials in chat.
2. Review and authorize deployment of the local changes, then set the environment.
3. Verify separate test conversations, streaming, tool results, role denials,
   approval behaviour, document provenance and Goose delegation before switching.
4. Compare Sina and MicroSina on the same representative requests. Foundry's saved
   `gpt-5` model may differ from Sina's configured model; identical wording and
   decisions cannot be promised merely by sharing instructions and tools.

Reference: [Foundry prompt-agent quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/prompt-agent).
Request contract: [Microsoft Foundry REST reference](https://learn.microsoft.com/en-us/rest/api/microsoft-foundry/aiproject).
