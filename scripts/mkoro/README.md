# Mkoro local Goose companion

This program connects a computer running Goose to Sina's chat in Inscope. Sina
owns the conversation and native platform work, and delegates bounded external
computer tasks to Mkoro. Inscope stores task progress; Goose runs locally using
the configured model and tools. The companion uses Node's built-in libraries and,
for optional desktop viewing on Windows, the installed Windows PowerShell and
System.Drawing. It opens no network listener on the computer.

## First connection

1. Use the Node version in the repository's `.node-version`. Install a Goose CLI
   with ACP v1 support. Confirm `goose acp --help` works. Goose Desktop alone does
   not guarantee that `goose` is on the terminal's PATH.
2. Configure Goose's provider, model and enabled extensions locally. For browser
   work, configure Playwright MCP and sign in to the relevant browser yourself.
   A working directory does not restrict tools to that directory.
3. In Inscope, open Chat's computer connection controls and create a pairing token
   for this computer.
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
6. Select the connected computer and ask Sina for a small computer task, such as
   listing files in the working folder. Sina delegates only the portion requiring
   the computer. Review tool requests in the same chat and choose Allow once or
   Reject once. No approval is granted by silence.
   Approval requests include a bounded arguments preview. Credential fields and
   typed text are hidden, and truncation is identified. Reject the request if the
   visible information is insufficient to assess the action.

Restart with the same command to reuse the pairing and chat mappings. Use `--pair`
with a fresh token to pair again; revoke the old connection in Inscope if replacing
it. `--name` sets the computer's display name, and `--state` chooses a different
local state file. `--help` lists all startup options.

When upgrading an existing companion, copy the complete `scripts/mkoro` folder,
including `capture.mjs`, `capture-windows.ps1` and `delegation.mjs`, and restart it.
Its regular poll updates the server's advertised capabilities, so a new pairing
is not required just to upgrade. The server rejects new delegations to companions
without `sina-delegation-v1` and desktop viewing without `desktop-screenshots-v1`.
If a gateway sits between this computer and Inscope, it must also pass the exact
`POST /api/mkoro-worker/screen` route. No incoming computer port is needed.

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

Inscope's per-computer automatic-approval setting can answer those one-action
requests without clicks, including pending requests. The server records automatic
decisions and checks current access. The companion still uses ACP approval mode;
permanent grants are not required. Stop still cancels pending work.

To diagnose a missing desktop view, run `node scripts/mkoro/check-screen.mjs`
on the Goose computer (or `Check-MkoroScreen.cmd` in the Windows bundle).
The check discards pixels and reports dimensions or failure without saving or
uploading an image. Update all companion files together before restarting.

Global recipes, custom prompt folders, plugins and saved desktop sessions are not
copied. Workspace hints and skills can still be discovered by Goose normally.
The browser profile/login used by a configured browser extension remains that
extension's local responsibility. Importing a recipe into Goose Desktop does not
automatically select it for this bridge. Use a tested local instruction/skill file
from the working folder as the initial reusable workflow; this bridge does not
call Goose's unstable recipe APIs.

## Sina and Mkoro responsibilities

The companion accepts only a structured delegation with a task type, external
target, objective, expected output and reason the platform cannot do this step.
Types cover external files, a browser, a desktop application or local files.
Ordinary messages from the retired separate Mkoro composer cannot start Goose.
The worker rejects targets on the configured Inscope app/server origins before
opening a Goose session. Each prompt restates Sina's ownership of sources,
retrieval, workflows, calculations, approval and persistence, and instructs Mkoro
to return a handoff when a platform action is needed.

The bridge supplies no Inscope MCP tools or platform credentials to Goose.
`mcpServers: []` does **not** disable extensions already configured in Goose:
this profile still uses your locally configured extensions. Keep native Inscope
extensions out of that profile. Approving a generic shell or browser action still
gives it the local user's authority. Standard ACP does not provide a reliable
per-tool sandbox, so this is an application responsibility boundary, not an OS or
network guarantee that an approved command cannot reach Inscope. Do not approve
an action that would duplicate platform work. Strict isolation would require a
separate restricted browser/tool environment.

## Refreshed desktop screenshots

On Windows, open the desktop viewer for an active delegated task in Sina's chat.
The viewer renews a short lease; only that exact task on that paired computer can
publish frames. The companion captures roughly every two seconds while the
lease is valid. The complete visible desktop across monitors is resized to a
longest edge of 1600 pixels and encoded as a JPEG no larger than 512 KiB. This is
view-only; mouse and keyboard takeover are not implemented.

The capture process runs hidden in the companion's Windows logon session. Keep
Goose's browser visible in that same session. A headless browser, another logged-in
user's desktop, or an application running on another computer will not appear.
The helper requires an interactive session and the normal input desktop; capture
failures are shown as unavailable, not replaced with example or old images. An
unlocked, connected Windows/Cloud PC desktop still needs a real acceptance test.

Screen data uses a dedicated endpoint and never enters task events, Goose prompts,
or Sina's model context. The companion holds only the current capture in memory;
the API holds the latest frame temporarily. No screenshot is written to a file or
stored in conversation history by this feature. Other visible windows and private
information can appear in the desktop image while viewing is enabled.

Closing the viewer ends its lease. Capture also stops on expiry (ten seconds
without renewal), task completion, cancellation, failed polling or shutdown.
Membership changes and revocation are checked by the API, and the companion stops
when its next authenticated request is rejected. Pending captures/uploads are
aborted and never replayed. Network or process delays can make the refresh rate
slower than two seconds; approvals and cancellation polling remain independent.

## What this connection supports

- Typed Sina delegations, streamed answers, bounded text tool progress, parallel
  tool approval requests, cancellation and conversation reuse through ACP sessions.
- Optional refreshed Windows desktop images while the active task viewer is open.
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
were independently verified. The bridge does not transfer files, embed MCP apps,
implement MCP elicitation forms, or provide remote Windows input control. A local
workbook still requires an explicit supported import into Inscope; a reported path
is not an uploaded source. Browser navigation is available only through the tools
you configure. Goose can still encounter model, extension, authentication or
provider errors; test those separately before running a consequential workflow.

## Verification and protocol references

```powershell
node --test scripts/mkoro/*.test.mjs
node scripts/mkoro/companion.mjs --help
```

Tests use fake ACP streams, HTTP transports and synthetic capture data; they do not
call a paid model, connect to personal accounts, capture the real desktop or execute
Goose tools. They cover capture lease expiry, late-frame rejection, cancellation,
upload failure, unsupported platforms and typed delegation rejection. A real
connected browser/desktop task remains a separate manual verification step.

- [Goose ACP integration](https://goose-docs.ai/docs/gdk/acp/)
- [Goose configuration files](https://goose-docs.ai/docs/guides/config-files/)
- [Goose environment variables](https://goose-docs.ai/docs/guides/environment-variables/)
- [ACP session setup](https://agentclientprotocol.com/protocol/v1/session-setup)
- [ACP tool permissions](https://agentclientprotocol.com/protocol/v1/tool-calls)
- [ACP session modes](https://agentclientprotocol.com/protocol/v1/session-modes)

ACP and Goose evolve. This bridge uses standard ACP v1 methods and requires an
acknowledged `session/set_mode` before submitting work. An incompatible version
fails visibly; it never falls back to automatic approval or a shell command.
