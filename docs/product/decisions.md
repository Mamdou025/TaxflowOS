# Decision register

Do not interpret a recommendation as confirmed policy. Status changes require
an explicit user decision or a clearly scoped design decision documented with its
rationale. Update this register and affected acceptance criteria together.

## Confirmed direction from the conversation

| ID   | Decision                                                                                                  | Basis                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| C-01 | Chat is the home page and main starting point                                                             | User explicitly required chat as the main page                                             |
| C-02 | Runs are within Workflows; no primary Runs menu                                                           | User rejected a standalone Runs menu; accepted the revised planning direction              |
| C-03 | Chat provides a little of each capability without overwhelming the conversation                           | User explicitly described this experience                                                  |
| C-04 | Workflows, agent actions, source-aware answers, documents and integrations are core platform capabilities | User's stated platform vision                                                              |
| C-05 | Subsystems should be independently maintainable through explicit boundaries                               | User asked to work on workflows without unintentionally changing the agent, and vice versa |
| C-06 | Phase 0 produces the product/navigation/ownership/journey blueprint before further implementation         | User authorized Phase 0 after the revised plan                                             |

## Baseline design recommendations

These implement the revised plan and remain reviewable design choices:

- Primary entries: Chat, Workflows, Sources, Connections. Settings/Help below;
  recent conversations in a secondary section.
- No separate Overview menu; contextual attention and continuation appear in Chat.
- Agent selection/management lives inside Chat; this does not merge agent code
  ownership into the UI or workflow engine.
- Global run history is a view inside Workflows, with per-workflow history and
  chat cards linking to the same records.
- Start with module separation inside existing deployments. Introduce a separate
  worker/service only for a demonstrated execution or operational requirement.
- Wide-screen detail panels retain conversation access; small screens use a
  reversible navigation path. Exact layout and item limits remain adjustable.

## D-01 — Execution lifetime

**Status: Confirmed by the user for the durable-execution phase.**

Question: should full runs continue after the browser closes?

Decision: durable server-managed runs, with local previews. This supports
agent-started operations without depending on an open browser, but requires job
state, restart/recovery handling, cancellation semantics and integration tests.

Rollout rule: a saved version is admitted only when every resolved tool is installed
in the durable registry. Unsupported tools are listed and rejected before a job is
created. Browser previews remain available during migration and are labelled as such.

Affects: R-06, R-07, R-13; J4-07; Phases 4 and 9. Interface design and test harness
Follow-up on 2026-09-15: the user requested all currently available workflow tools.
The shared executor package now supplies the complete registry to both runtimes.
This preserves pinned-input behavior; it does not add recurring scheduling, live
source polling or autonomous external writes. See [current functionality](../FUNCTIONALITY.md).

## D-02 — Default agent editing policy

**Status: Confirmed by the user for Phase 6.**

Agents propose workflow changes against an exact draft revision. Applying the
proposal requires either a one-time approval bound to that operation, request and
base revision, or an active reusable grant scoped to the actor, workspace, agent,
capability and workflow. Reusable grants expire and can be revoked. An applicable
grant avoids another confirmation while the workflow command still validates the
request and rejects stale drafts.

Reading workflows, preparing proposals and retrieving authorized sources do not
need an additional action grant. Applying a draft, saving an immutable version and
executing a version are separate capabilities. External writes require one-time
approval. None of these permissions approves a calculation result or bypasses the
Owner/Editor/Viewer policy.

Affects: R-05, R-09; J2-05, J3-02 through J3-06; Phases 3, 4 and 6.

## D-03 — Default context retrieval

**Status: Confirmed by the user for Phase 5.**

Chat searches explicitly selected sources first, then may add relevant sources
that are active, authorized for the current workspace and within the requested
client scope. Every returned passage carries visible source identity, revision,
chunk locator, similarity, selection origin and a stable citation ID.

Callers can choose selected-only when discovery outside the explicit selection
is inappropriate. Missing selected sources and provider failures are limitations,
not empty successful searches.

Neither policy grants action permission from document contents, nor allows
cross-workspace retrieval without access.

Affects: R-03, R-08, R-12; J1-02 through J1-06; Phases 5, 6 and 7.

## D-04 — Authentication, workspace roles and legacy recovery

**Status: Confirmed by the user for Phase 3.**

- Email/password through the already installed Better Auth package.
- Shared workspaces with Owner, Editor and Viewer membership.
- Explicitly claim an anonymous workflow library using its existing recovery code.
  Keep other unassigned legacy chats/documents preserved until ownership is established.

Implementation policy: Owners manage members; Owners and Editors may save and invoke
server tools; Viewers may read but cannot write or execute server tools. Membership
uses the exact account ID of an existing account. Email verification/delivery and
password recovery are not configured, so email is not accepted as proof of membership.
Workspace switching reloads browser state; local caches are keyed by both account and
workspace. Claiming is one-time, transactional and requires an empty destination.

This does not settle D-01. D-02 was confirmed and implemented in Phase 6.
See [Phase 3 implementation and migration instructions](../phase-3-access.md).

### D-04 follow-up — password-free demo

**Status: User requested a demo button after Phase 3.**

The sign-in screen offers **Try demo**, opening Chat through a unique Better Auth
guest session and private workspace. Design choice: keep ordinary editing, saving
and execution available inside it; reserve membership management, extra workspace
creation and legacy-library claims for email/password accounts. Returning requires
the same valid browser session. The UI explains export before exit; account sign-in
does not automatically transfer demo data. This preserves server authorization
without requiring the user to type credentials merely to operate the software.

## D-05 — Source retention and deletion

**Status: Confirmed by the user for Phase 5.**

- Owners and Editors may archive or move a source to recovery.
- Only Owners may restore a source or permanently purge its content.
- Viewers cannot change source lifecycle.
- Archived and deleted sources are excluded from new retrieval immediately.
- A purge removes stored content pointers, extracted details, chunks and pending
  ingestion while retaining the source ID, name, revision, content fingerprint
  and lifecycle timestamps required to interpret historical citations.
- Connection credentials have a separate lifecycle and are never included in a
  source provenance record.

## D-06 — Release performance guardrails

**Status: Implemented operational baseline in Phase 9.**

Production asset ceilings use a measured build with small regression headroom.
Separate improvement targets record the intended reduction in initial JavaScript,
initial CSS and the largest JavaScript chunk. A failing ceiling must lead to a
smaller build or a reviewed design change; the baseline is not regenerated to make
the check pass. Hardware-dependent interaction timings remain observations until a
representative device and service-level objective are selected.

## Deferred implementation decisions

| Decision                                        | When to settle                  | Required evidence                                                         |
| ----------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| Endpoint/transport and event schema details     | Phases 3–4                      | Existing-consumer inventory, runtime validation and compatibility plan    |
| Worker/job mechanism if D-01 selects durability | Phase 4 design; Phase 9 rollout | Restart, duplicate-request, external-effect and cancellation tests        |
| Exact navigation routes and responsive layout   | Phase 7                         | Existing deep-link inventory, draft preservation and accessibility checks |

These choices are not required to finish a Phase 0 blueprint. They must be
resolved before dependent behavior or guarantees are implemented.
