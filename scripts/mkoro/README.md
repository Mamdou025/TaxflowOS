# Mkoro local Goose companion

This program connects a computer running Goose to Inscope's Mkoro chat. Inscope
stores the conversation and progress; Goose runs locally using the configured
model and tools. Sina remains a separate agent. The companion uses only Node's
built-in libraries and opens no network listener on the computer.

## First connection

1. Use the Node version in the repository's `.node-version`. Install a Goose CLI
   with ACP v1 support. Confirm `goose acp --help` works. Goose Desktop alone does
   not guarantee that `goose` is on the terminal's PATH.
2. Configure Goose's provider, model and enabled extensions locally. For browser
   work, configure Playwright MCP and sign in to the relevant browser yourself.
   A working directory does not restrict tools to that directory.
3. In Inscope, open Chat, choose Mkoro, and create a pairing token for this computer.
4. From this repository, run:

   ```powershell
   node scripts/mkoro/companion.mjs --server https://your-inscope-host --workspace "C:\Users\Mamad\Mkoro"
   ```

   Replace the example origin with your Inscope origin. For local development use
   the API origin, for example `http://localhost:3001`, if that is where your API
   is running. The working folder must already exist. If necessary add
   `--goose "C:\path\to\goose.exe"` or
   `--goose-config "C:\path\to\folder-containing-config-yaml"`.

5. Paste the token at the terminal prompt. It is hidden in interactive terminals
   and never passed as a command-line argument. `MKORO_PAIRING_TOKEN` is also
   supported for a controlled environment. Keep the terminal running.
6. Select the connected computer in Mkoro, create a chat, and start with a small
   task such as listing files in the working folder. Review tool requests in
   Inscope and choose Allow once or Reject once. No approval is granted by silence.
   Approval requests include a bounded arguments preview. Credential fields and
   typed text are hidden, and truncation is identified. Reject the request if the
   visible information is insufficient to assess the action.

Restart with the same command to reuse the pairing and chat mappings. Use `--pair`
with a fresh token to pair again; revoke the old connection in Inscope if replacing
it. `--name` sets the computer's display name, and `--state` chooses a different
local state file. `--help` lists all startup options.

## Local settings and credentials

The default state file is under `%LOCALAPPDATA%\Mkoro` on Windows or `~/.mkoro`
elsewhere, scoped to the configured server and working folder. It contains the
worker credential and the mapping from Inscope conversations to Goose sessions.
Treat it as a credential. Its lock file prevents accidentally running two
companions with the same state; after a crash, confirm the old process has stopped
before removing that specific lock file.

At startup the companion copies `config.yaml` and, if present, `secrets.yaml` into
a private Goose profile beside that state file (`worker.json.goose`). The copy
preserves provider and extension settings. File-based provider credentials are
therefore copied locally; they are never sent to Inscope or printed. The OS
keyring keeps its ordinary Goose service identity. Files are created with private
permissions where supported; Windows also relies on the user profile's ACLs.
These files are not encrypted by the companion and must stay out of source control.

The private profile deliberately starts with an empty saved permission store.
Neither saved Allow always nor saved Reject always decisions from ordinary Goose
are inherited. Every new turn explicitly sets Goose's `approve` mode, and only
one-action approval choices are supported. This is necessary because Goose's
approve mode otherwise honors saved Allow always grants. The original Goose
configuration and permission files remain unchanged. Model and extension
settings are copied again when the companion restarts; already saved sessions
may retain their own configuration, so use a new Mkoro chat to apply tool changes.

Global recipes, custom prompt folders, plugins and saved desktop sessions are not
copied. Workspace hints and skills can still be discovered by Goose normally.
The browser profile/login used by a configured browser extension remains that
extension's local responsibility. Importing a recipe into Goose Desktop does not
automatically select it for this bridge. Use a tested local instruction/skill file
from the working folder as the initial reusable workflow; this bridge does not
call Goose's unstable recipe APIs.

## What this connection supports

- Text messages, streamed answers, bounded text tool progress, parallel tool
  approval requests, cancellation and conversation reuse through ACP sessions.
- Only the locally selected working folder and Goose executable are used. Remote
  messages cannot replace the executable, supply a shell launch command, or set
  the working directory. Goose's enabled tools can act on the machine according
  to the instructions and tool approvals you provide.
- HTTPS requests go outward to one configured Inscope origin. Redirects are
  rejected. The worker token is separate from provider and browser credentials.
- Progress batches retry with stable event IDs so the API can deduplicate them.
  Claimed task commands and model prompts are never automatically replayed.

Messages, tool activity and approval previews are sent to and stored in Inscope.
Preview redaction is a best-effort filter and can miss secrets embedded in arbitrary
commands or outputs. Do not put passwords or tokens into chat; use local browser
sign-in and configured credential stores instead.

This is an attended first version. One prompt can run on a computer at a time.
The companion must remain running and the computer awake. It requests cancellation
on shutdown or a sustained server outage, and stops when the token is rejected.
Cancellation does not undo completed operations or guarantee that an already
started external operation was stopped. A crash or disconnection can leave an
uncertain result; inspect local files and the target application before retrying.
Buffered events are in memory, so a crash can lose progress not yet delivered.
Each task has a 10,000-event limit. The companion reserves the final event for a
failure notice and stops Goose if progress reaches that limit, even when earlier
events have already been delivered.

A completed turn means Goose returned `end_turn`, not that a workflow's results
were independently verified. The initial bridge does not transfer files, render
screenshots, embed MCP apps, implement MCP elicitation forms, or provide remote
Windows desktop control. Browser navigation is available only through the tools
you configure. Goose can still encounter model, extension, authentication or
provider errors; test those separately before running a consequential workflow.

## Verification and protocol references

```powershell
node --test scripts/mkoro/*.test.mjs
node scripts/mkoro/companion.mjs --help
```

Tests use fake ACP streams and HTTP transports; they do not call a paid model,
connect to personal accounts, or execute Goose tools. A real connected browser
task remains a separate manual verification step.

- [Goose ACP integration](https://goose-docs.ai/docs/gdk/acp/)
- [Goose configuration files](https://goose-docs.ai/docs/guides/config-files/)
- [Goose environment variables](https://goose-docs.ai/docs/guides/environment-variables/)
- [ACP session setup](https://agentclientprotocol.com/protocol/v1/session-setup)
- [ACP tool permissions](https://agentclientprotocol.com/protocol/v1/tool-calls)
- [ACP session modes](https://agentclientprotocol.com/protocol/v1/session-modes)

ACP and Goose evolve. This bridge uses standard ACP v1 methods and requires an
acknowledged `session/set_mode` before submitting work. An incompatible version
fails visibly; it never falls back to automatic approval or a shell command.
