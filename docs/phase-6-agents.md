# Phase 6 — agent tools and scoped actions

Phase 6 gives the assistant explicit workflow and source capabilities without
making the model the owner of workflow rules. It implements the confirmed D-02
policy and the agent boundary in R-05, R-09 and R-11. Durable background execution
still depends on D-01. The Chat/sidebar composition is implemented in
[the Phase 7 record](phase-7-navigation.md).

## Architecture

`lib/agent-runtime` owns model-neutral tool definitions and action-capability
contracts. Its workspace tools receive actor, workspace and agent context plus
injected ports. Tests can substitute those ports without React, a model provider,
Postgres or a live connector.

`lib/workflow-core` owns the operations those tools request:

- list/read consumers resolve exact workflow IDs and versions;
- a proposed draft records its reason, changed JSON-pointer paths, base revision,
  full base fingerprint and request fingerprint;
- applying a proposal checks the matching authorization receipt, validates the
  whole draft and rejects a stale base without changing saved history;
- saving creates an immutable version through the existing workflow command;
- execution targets an existing version and retains the existing request-ID replay
  behavior and initiator record.

Changing a block's configuration, code, formula or source invalidates that block's
previous approved state. Applying, saving, executing and approving a result remain
separate states.

## Grant policy

The API stores grants and operation outcomes in migration
`0003_agent_action_grants.sql`. Session middleware supplies the actor and current
workspace; browser-supplied actor or role values are not accepted.

| Capability                | Default policy                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------- |
| Workflow/source read      | Allowed within ordinary workspace/resource access                                  |
| Prepare workflow proposal | Allowed; preparing a proposal does not apply it                                    |
| Apply a workflow draft    | One-time exact approval or active reusable grant for that workflow                 |
| Save an immutable version | Separate one-time or reusable workflow-scoped grant                                |
| Execute a workflow        | Separate one-time or reusable workflow-scoped grant                                |
| External connection write | One-time exact approval only; no external-write chat tool is exposed in this phase |

One-time grants bind the operation and request fingerprint. Draft approvals also
bind the base revision. Reusable grants bind actor, workspace, agent, capability,
resource type and resource ID, expire by default after 24 hours, and can be revoked.
Their maximum lifetime is 30 days. Reusing an operation ID for a different request
is a conflict. A completed operation returns its recorded terminal state instead of
performing the action again.

Viewer requests are denied at the Express operation boundary, including case and
trailing-slash variants. Owners and Editors still pass the owning workflow/source
validation after the grant check; a grant is not a replacement for workspace access.

## Chat behavior

Sina can list and read exact saved workflows, prepare a complete draft proposal and
request a separately authorized immutable save. With no applicable grant, Chat shows
the workflow, reason, base revision and changed fields before allowing a one-time or
24-hour scoped permission. With a reusable grant, the same validated command can
continue without another confirmation.

Catalog workflow runs use the same scoped execution review. The current catalog
runner remains browser-hosted and its lifetime is unchanged. The portable
exact-version executor is available to agent adapters. Exact run links and nested
Workflows history are composed in Phase 7.

Chat can select an active Excel or JSON document through **Choose source**, or
through **Use in chat** in Sources. Selection downloads the original file through
the workspace-authorized document API and uses the same workbook parser as upload.
The selected file and record count remain visible. Workbook attachments also try to
save the original file in Sources; a storage failure leaves a clearly labelled local
attachment and does not claim that the source was saved.

The catalog run tool explicitly selects uploaded, inline-record, or sample input.
Uploaded mode reads the selected rows directly, so an empty model-generated inline
array cannot override them. The adapter freezes rows, source identity/revision and
file hash before computing the approval fingerprint. Later selection changes do not
change an already-reviewed run. Explicit invalid inline arrays still fail validation,
and sample mode remains limited to explicit sample requests.

The `/documents` deep link was also migrated away from its legacy top navigation and
secondary sidebar. It now opens the existing source lifecycle library as a detail tab
inside Chat and returns to `/`, preserving the current workspace shell. Phase 7 adds
the primary Sources and Connections navigation.

## Verification scope

The Phase 6 checks cover capability validation, exact grant matching, expiry,
revocation, one-time consumption, tool argument validation, proposal diffs, stale
draft conflicts, immutable history, approval invalidation, separately authorized
save/execute commands and request replay. The API integration case exercises real
sessions, role denial, cross-workspace denial and durable operation records when the
disposable Postgres harness is available.

Live model/provider behavior, live connection writes and durable continuation after
the browser closes are outside this evidence. No connection write tool is enabled by
substituting a sample or a read endpoint.

## Local verification

The final Phase 6 tree passes the frozen install, the repository `verify` command,
the API and web production builds, and the focused production-browser source-library
case. That evidence includes 40 unit tests, 11 workflow-core tests and 2 focused
browser tests. The web build retains its existing source-map, browser externalization
and chunk-size warnings.

The database integration and migration-execution suites were not run in this final
environment because the local Docker Desktop backend exits on its stale inference
socket. Static migration metadata contains four ordered migrations and the integration
case expects that count, but the new grant tables and endpoint transactions still need
the disposable Postgres harness before release.
