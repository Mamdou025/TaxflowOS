# Mkoro computer tasks inside Sina chat

Sina leads one conversation in Inscope. It handles platform tools, sources,
retrieval, ordinary web search and workflows, and delegates a bounded computer
step to Mkoro only when those capabilities cannot do the work. Mkoro runs Goose
on the selected laptop or virtual computer. Its progress, permissions, Stop
control and optional desktop view appear in the same chat; Goose Desktop need
not be open. The companion and its computer must remain running.

## Connect or update a computer

1. Run the matching frontend/API and apply the normal committed migrations using
   [development setup](DEVELOPMENT.md). `0006_mkoro_companion.sql` creates companion
   records; `0007_mkoro_sina_delegation.sql` adds the Sina thread and delegation
   metadata. Updating source alone does not update a deployed app.
2. Install a Goose CLI supporting ACP v1 and `session/set_mode` with `approve`.
   Configure its model and computer extensions locally. Goose Desktop alone does
   not guarantee that `goose` is on the terminal's PATH. Keep native Inscope tools
   out of the companion's configured extensions.
3. As an Owner or Editor, open Chat's computer settings and choose **Connect a
   computer**. Copy the one-use pairing code; it expires after ten minutes.
4. On the computer that will do the work, run from this repository:

   ```powershell
   New-Item -ItemType Directory -Force "$env:USERPROFILE\Mkoro" | Out-Null
   node scripts/mkoro/companion.mjs --server http://localhost:5173 --workspace "$env:USERPROFILE\Mkoro"
   ```

   Use the actual Inscope origin. `localhost` works only when Inscope runs on that
   same computer; a separate laptop needs the configured reachable HTTPS app or
   worker-relay origin. Pass `--goose` for an explicit CLI path when necessary.
   Paste the code into the companion's private prompt, never into chat. Keep the
   process running. See the [companion reference](../scripts/mkoro/README.md).

5. Select the Online computer in chat settings. Ask Sina to list files in the
   working folder without modifying anything. Review each tool request using
   **Allow once** or **Reject once**. Silence never approves an action.

For an existing connection, wait for the current task to finish, stop the old
companion, copy the complete updated `scripts/mkoro` runtime, and restart with the
same server, working folder and state options. Include `capture.mjs`,
`capture-windows.ps1` and `delegation.mjs`. Valid saved pairing credentials can be
reused; do not add `--pair` just for an upgrade. Polling advertises the new
`sina-delegation-v1` and Windows `desktop-screenshots-v1` capabilities. The API
rejects incompatible companions instead of sending them unrestricted work.

A worker relay must pass the exact **POST `/api/mkoro-worker/screen`** route in
addition to pairing, polling and events. Keep application pages, session cookies
and unrelated APIs out of that relay. The earlier temporary gateway/download
bundle needs this explicit update; repository changes do not replace it.

## What Sina delegates

Each delegation names a task type, exact external target, objective, expected
output and reason an existing platform tool cannot do the step. Allowed types
cover external files, a browser, a desktop application and local files. The
application rejects native Inscope targets and unsupported task types before
dispatch. Every Goose prompt restates these responsibilities:

| Sina owns                                                                          | Mkoro handles when delegated                                                     |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Conversation, platform sources/connectors, retrieval and ordinary web search       | External account/browser work unavailable through a platform tool                |
| Workflow definitions, validation, calculation, execution, review and saved results | Local files and desktop applications needed for the bounded task                 |
| Deciding the next platform action from actual evidence                             | Reporting observations, file locations, changes, blockers and remaining handoffs |

Mkoro must not open Inscope to run its workflows, talk to Sina through the website,
or recreate the platform's calculation rules. A downloaded workbook remains a
local file: **automatic companion-to-Inscope source upload is not implemented**.
Use a supported platform connector/import or an explicit manual upload before
Sina can run the workflow with that source. A reported path is not an upload.

The Sina adapter permits one bounded computer job per user message. Its retry key
comes from the saved chat and originating user-message IDs. Retrying the exact
request returns the existing task; rephrasing it or choosing another computer
under that key produces a conflict, not another execution. A separate job needs
a new user request. Saving the chat must succeed before dispatch; changing chats
must not attach another conversation's task or result to the current one.

## Watch the computer

During an active Windows task, choose **View Mkoro's computer** on its task card.
Opening this view enables capture for that exact task and computer. The viewer
renews a ten-second lease about every five seconds; the companion captures about
every two seconds. It includes visible monitors in the companion's Windows
session, resized to a longest edge of 1600 pixels and a JPEG at most 512 KiB.
Transport or capture delays can make refreshes slower. This is view-only, with
no remote mouse or keyboard takeover.

Keep the Windows session unlocked and the browser visible in that same session.
A headless browser or another logged-in user's desktop will not appear. The
helper checks for an interactive, normal input desktop; unavailable capture is
reported explicitly. Other windows and private information visible on the desktop
can appear while viewing is enabled.

Closing or hiding the view stops renewal and requests release. Capture stops on
lease expiry, cancellation, task completion, failed polling or shutdown; revoked
access is checked on authenticated requests. Pending old captures are discarded.
The API retains only the latest frame in memory, with a fifteen-second freshness
limit and earlier removal when its lease ends. Responses use `no-store`; the UI
clears stale or unavailable images. Viewer frames are not written to screenshot
files, durable events, chat history, or Sina/Goose model context. API restarts
discard them. Multiple API processes need sticky routing or shared ephemeral
transport; durable screenshot storage is not provided.

## Access and tool boundaries

Computers and task records belong to the authenticated actor within one workspace.
Another member, including an Owner, cannot gain control by guessing identifiers.
Pairing, delegation, decisions, cancellation, revocation, enabling a view **and
reading its screenshots** require current execution permission (Owner or Editor).
Viewers may read their existing personal history, but cannot watch a live desktop.
Membership and bearer-token checks also apply to worker polls and screen uploads.

Raw computer activity and screenshots remain personal to the actor. Text that
Sina summarizes into its saved conversation follows the existing workspace chat
sharing rules; other authorized workspace members can read that resulting answer.
Combining the chats does not make the live desktop or computer controls shared.

Pairing does not copy Google cookies, log into accounts, install tools, or send
platform session credentials to Goose. The companion uses outbound HTTP and local
ACP, with no inbound computer port. Its private local Goose profile copies the
configured provider/extensions and any file-based provider secrets on that same
computer; those secrets are not sent to Inscope. Saved permanent tool approvals
are not copied. Every turn requires Goose's manual approval mode.

The bridge supplies no Inscope MCP tools. Goose can still load its configured
extensions, and an approved generic browser or shell action has the local user's
authority. The working folder and prompt are **not an OS or network sandbox**.
Strict restriction of those tools would require a separate controlled environment.
Text progress and bounded permission previews are stored in Inscope; preview
redaction is best effort, so do not put credentials into chat.

## History, recovery and verification

Computer settings retain all personal computer-task history, including former
standalone Mkoro chats and tasks whose Sina chat was deleted. They are not replayed
or used as a second composer. Owners and Editors can still decide pending one-action
permissions or stop their existing active tasks there. Screenshots and Sina result
review are available only inside a bound chat. New work belongs to the saved Sina
chat and selected computer. Task cards retain progress, errors, pending one-action
permissions and cancellation.
Opening another chat stops Sina's current reply before replacing its messages;
it does not cancel Mkoro's separate computer job. Status lookup reads the latest
200 task events and returns bounded text, not the full transcript.

Only one task can run per companion. Goose's `end_turn` means its turn ended; it
does not independently verify a download, source upload, fiscal result or saved
workflow. Sina treats returned text as reported evidence, not new authorization.
Stop requests cancellation and cannot undo external actions already completed.

Claimed commands and model prompts are never automatically replayed. Event retries
use stable IDs; buffered progress can be lost if the companion crashes. A stale
heartbeat marks the computer offline after 45 seconds. API restarts preserve
durable task records, but do not resume an uncertain external action. If a crash
leaves a task permanently active, inspect the actual results, stop the companion,
disconnect the old entry and pair afresh before a new request. Reconnecting alone
is not proof that an interrupted task resumed.

Automated checks use synthetic ACP/capture responses, mocked browser services and
disposable databases as applicable. They do not prove a real Google account,
Goose installation, Windows Cloud PC or fiscal workflow works. Live acceptance
still requires a harmless delegated action, permission decision, desktop-view
open/close, Stop and returning-chat check on the actual connected computer. See
[test guidance](../TEST.md) and Goose's [ACP guide](https://goose-docs.ai/docs/gdk/acp/).
