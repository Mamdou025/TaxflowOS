# Mkoro inside Inscope

Mkoro is a second assistant in Chat, beside Sina. Inscope provides its interface;
a companion process on your computer runs Goose and returns messages and tool
activity. You do not need the Goose desktop window open. The companion and its
computer must remain running for tasks to continue.

## Start a first connection

1. Run the current Inscope frontend and API using the normal development setup and
   migrations. Migration `0006_mkoro_companion.sql` adds the companion's tables.
   This source change does not update an already deployed site.
2. Install/configure a Goose CLI that supports ACP and `session/set_mode` with
   `approve`. Configure its paid or local model and the extensions you intend to use.
   A Goose desktop installation alone is not proof that `goose` is on your PATH.
3. Sign in to Inscope as an Owner or Editor. Open **Chat → Mkoro → Connect your
   computer**. Copy the one-use pairing code; it expires after ten minutes.
4. From this repository, run the companion in PowerShell:

   ```powershell
   New-Item -ItemType Directory -Force "$env:USERPROFILE\Mkoro" | Out-Null
   node scripts/mkoro/companion.mjs --server http://localhost:5173 --workspace "$env:USERPROFILE\Mkoro"
   ```

   Replace the server with the exact URL of your running Inscope app. Use HTTPS
   for a remote server. Local HTTP is supported on loopback addresses only. Pass
   `--goose "C:\path\to\goose.exe"` when the CLI is not on PATH. Paste the pairing
   code into the companion's private prompt, not into an agent conversation.
   See the [companion reference](../scripts/mkoro/README.md) for configuration and
   troubleshooting.

5. Keep that terminal running. Once the computer is Online in Inscope, send:

   > Check your working folder and available tools. List the names of files in
   > the current folder and report whether browser tools are available. Do not
   > modify any files or sign into any account.

   Approve or reject individual requested actions in the Mkoro conversation.
   Confirm the reported folder and tools match your actual computer.

The Google Drive and Drive-to-FAPI test is a separate live check. Goose needs the
appropriate browser extension/profile or a Drive connector configured locally.
Inscope pairing does not copy Google cookies, log in to Drive, install browser
tools, or import the existing Goose recipe automatically. Put the recipe in the
companion's working folder, then ask Mkoro to read it and first verify connections.
Use the existing workflow's required inputs and review gates; do not assume a
completed agent turn means the workflow calculation or approval succeeded.

## What appears in Inscope

- Separate Sina and Mkoro tabs preserve their drafts when switching.
- Mkoro has a computer selector, pairing/revocation controls and saved chats.
- Messages and tool events update by polling, normally every 1.5 seconds.
- Tool detail, requested permissions, errors and disconnected states are visible.
- Permission buttons allow or reject the offered action once. Permanent grants
  are not accepted by the bridge. Multiple pending requests remain separate.
- Stop requests cancellation and waits for the worker's acknowledgement. It does
  not undo actions already taken.

The chat displays text and tool activity. It does not embed arbitrary generated
HTML, Goose Apps, the desktop UI or a live browser video. File paths may be shown
when reported, but this version does not upload local output files to Inscope or
provide platform download links. Those are separate integration features.

## Ownership and access

| Layer             | Owner and responsibility                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| Chat UI           | `features/assistant/mkoro`: tabs, validated status, transcript, pairing and decisions                     |
| Shared contract   | `lib/api-zod/src/mkoro.ts`: validated API and event shapes                                                |
| Authenticated API | `routes/mkoro.ts`: derives actor from session and checks workspace membership and execution role          |
| Worker API        | `routes/mkoro-worker.ts`: checks the companion bearer token and current membership                        |
| Durable state     | API `lib/mkoro` and DB migration/schema: credentials, conversations, turns, commands, events, permissions |
| Local execution   | `scripts/mkoro`: bounded ACP transport, fixed working folder, local Goose settings and task delivery      |
| Workflow behavior | Existing workflow application commands, validation, execution and review rules                            |

Each computer and conversation belongs to one actor in one workspace. Another
workspace member, including an Owner, cannot access it merely by guessing an ID.
Viewers can read their existing personal history but cannot pair, execute, decide
permissions or revoke through the API. Changing membership removes the companion's
authority at its next authenticated request. Pairing and bearer tokens are stored
as hashes on the server; the bearer credential is stored privately on the local
computer so it can reconnect. Disconnect in Inscope revokes that credential.

Conversation text and tool activity are stored in the Inscope database. Treat
them as workspace data when choosing what to ask the agent to inspect. The local
working folder is a starting directory, not an operating-system sandbox: the
configured Goose tools run with the computer user's permissions. Pair only a
computer you intend this account to control.

## Execution and recovery

The companion opens outbound HTTP requests to Inscope and runs `goose acp` over
standard input/output. There is no inbound companion port or public Goose server.
It uses a separate local Goose profile based on the configured model/extensions,
without copying saved tool permission grants, and requires approval mode before
prompts. See the companion reference for the local configuration/credential copy.

A conversation maps to a Goose session; each sent message creates a new task
record for that prompt turn. Only one turn can be active per companion. Finishing
a turn records that Goose stopped responding, not independent verification that
an external job succeeded. The agent may still need an answer from you.

Commands are claimed once; an uncertain response is never permission to resend a
model prompt automatically. Progress events have stable IDs so network retries do
not duplicate history. API restarts preserve records. Companion interruption can
leave an external action's outcome uncertain: inspect the actual browser/files
before instructing a retry. Cancellation and revocation cannot reverse a completed
external side effect. Offline status is based on a stale heartbeat (45 seconds).

If a crash or lost command response leaves a turn permanently active, this first
version cannot resume or reconcile that turn. Stop the companion, inspect the
actual result, disconnect the old computer entry, and pair again with a fresh
code and `--pair`. Start a new chat on the new connection; the old record remains
available for inspection. Reconnecting alone must not be mistaken for resumed
execution of the interrupted turn.

History initially loads the latest 500 activity events and can load earlier
activity. After a long disconnection, a gap causes the view to reload the latest
contiguous page rather than silently join incomplete chunks. The current UI/API
shows the latest 100 conversations and latest 100 turns per conversation; older
turns remain stored but do not yet have a turn-pagination interface. Each turn
accepts at most 10,000 events, and payloads are bounded. Start a new chat for long
independent work.

## Verification boundary

Automated worker tests use an ACP test process; browser tests use synthetic
responses; integration tests use real sessions and disposable Postgres. They
exercise protocol, persistence and access behavior without a paid model or a real
Google account. A live acceptance test additionally requires your actual Goose
CLI, configured model/extensions, signed-in browser and this version of Inscope.
Confirm a harmless tool action, a permission decision, Stop and a returning chat
before attempting the Drive-to-FAPI workflow.

Goose's [ACP guide](https://goose-docs.ai/docs/gdk/acp/) describes the protocol
used by this bridge. Compatibility depends on the installed CLI; unsupported
approval mode fails before sending the task to the model.
