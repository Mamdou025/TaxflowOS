# Phase 0 — TaxflowOS product blueprint

For implemented capabilities and their limits, use the [current functionality
guide](../FUNCTIONALITY.md). The phase records below document earlier checkpoints.

This is the product and architecture design baseline developed from the planning
conversation. It specifies intended behavior; it is not evidence that every
capability has been implemented. No application behavior is changed by this pack.

## Start here

| Document                                             | Use it to answer                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| [Product specification](product-spec.md)             | What is the platform, and what must remain true?                   |
| [Navigation and interaction sketch](navigation.md)   | Where does a user go, and what appears in chat?                    |
| [Ownership and interfaces](ownership.md)             | Which system owns a change, and how do consumers interact with it? |
| [User journeys and acceptance criteria](journeys.md) | What observable behavior must implementation demonstrate?          |
| [Decision register](decisions.md)                    | What is confirmed, recommended, or still unresolved?               |

The [current architecture guide](../ARCHITECTURE.md) describes the implementation.
Use it alongside this target blueprint. When they differ, record a migration task;
do not assume the proposed boundary already exists.

## Scope and decision handling

Phase 0 produces the specification, sketch, ownership map, journeys, and decisions.
Implementation, root `AGENTS.md`, prompt-library installation, dependency changes,
new services, authentication, and UI changes belong to later phases.

The sidebar baseline is **Chat, Workflows, Sources, Connections**, with Settings
and Help below. Chat is home. Runs belong within Workflows; there is no primary
Runs or Overview menu. Agent management is accessible from Chat.

Unanswered product questions remain marked **Pending** in the decision register.
A suggested answer or elapsed time does not confirm a decision. Independent
baseline and test-harness work may continue; behavior that depends on a pending
decision must remain a proposal until that decision is recorded.

## Implementation handoff

Deliver each phase through focused, reviewable changes. Preserve existing saved
data, behavior, and unrelated local work. Avoid renaming folders solely to match
the conceptual system names below.

| Phase | Deliverable                                                                                                                          | Exit evidence                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| 0     | This product blueprint and explicit decision register                                                                                | Consistent requirements, ownership, five journeys, and a visible list of unresolved choices            |
| 1     | Reviewed Git checkpoint, aligned Node/pnpm and frozen installs, setup documentation, concise root `AGENTS.md`, reusable task prompts | Fresh-checkout setup is reproducible; task scope and verification rules are discoverable               |
| 2     | Focused direct tests, synthetic fixtures, isolated API/Postgres suite, browser failure traces, worktree-specific ports/data          | Calculation, persistence, migration and UI regressions are reproducible without shared test data       |
| 3     | Authenticated workspace ownership, operation authorization, validated API boundaries, managed database migrations                    | Workspace isolation and allowed/denied actions pass integration tests                                  |
| 4     | Workflow model/core/application separation, shared commands, version and run ownership                                               | Core tests need neither React nor a model provider; builder and agent adapters pass the same contracts |
| 5     | Source lifecycle, connector operations, provenance and permission-filtered context retrieval                                         | Source identity, invalid responses, retries and citations have tested contracts                        |
| 6     | Agent workflow tools and retrieval adapters, scoped action grants, agent evaluations                                                 | Invalid/stale/unauthorized operations fail visibly; agent implementation is independently testable     |
| 7     | Chat-first navigation, context strip, action cards, contextual attention and nested run history                                      | All five user journeys pass through Chat and directly accessible detail views                          |
| 8     | Smaller editors, consolidated primitives, retired migrated adapters, stronger type and dependency enforcement                        | Drafts and review state survive editing/navigation; legacy dependencies and exclusions decline         |
| 9     | Durable execution if chosen, recovery verification, tracing, performance budgets, release checks                                     | Operational expectations and restoration are demonstrated; UI claims match actual guarantees           |

Dependencies: Phase 3 authorization is required before enabling wider agent writes.
Phase 4 interfaces support Phases 5–6; Phase 7 composes those capabilities. Phase 0
may sketch the final experience before those services exist. Durable execution
design begins with decision D-01 and Phase 4; its rollout must precede any promise
that runs survive closing the browser.

## Definition of done for future tasks

Reference the relevant requirement/journey IDs and owning system. Distinguish
facts, assumptions and new decisions; surface scope expansion. Verify the smallest
meaningful layer, then affected interfaces and journeys. Review the diff and
report checks run, failures and untested behavior. Do not weaken validation or
substitute sample data to make acceptance criteria pass.

Phase 1 installs [stable task templates](../PROMPTS.md) for known corrections,
root-cause bug fixes, read-only audits, verification, additional test coverage,
behavior-preserving refactors, features/blocks/integrations, read-only reviews,
and architecture planning. Its setup changes, recovery checkpoint and verification
evidence are tracked in [the Phase 1 record](../phase-1-foundation.md).

Phase 2's isolated test commands, synthetic fixtures, verification evidence and
remaining limits are tracked in [the Phase 2 record](../phase-2-testing.md).

Phase 3's access design, role policy, legacy recovery and migration procedures are
tracked in [the Phase 3 record](../phase-3-access.md).

Phase 4's workflow core, application commands, adapters and verification are tracked
in [the Phase 4 record](../phase-4-workflows.md).

Phase 5's source lifecycle, retrieval provenance, connector behavior and verification
are tracked in [the Phase 5 record](../phase-5-sources.md).

Phase 6's agent tools, proposal-first workflow editing and scoped action grants are
tracked in [the Phase 6 record](../phase-6-agents.md).

Phase 7's Chat-first navigation, context summary, nested workflow run history and
detail-route composition are tracked in [the Phase 7 record](../phase-7-navigation.md).

Phase 8's editor consolidation, retired facades and stronger architecture checks
are tracked in [the Phase 8 record](../phase-8-maintainability.md).

Phase 9's recovery drills, tracing, measured performance budgets and release gates
are tracked in [the Phase 9 record](../phase-9-operations.md).

## Phase 0 verification

This pack is checked for local links, requirement/journey/decision references,
consistent navigation, and separation of existing behavior from target behavior.
No application test results are claimed from documentation checks. Existing test
references in [journeys](journeys.md) are coverage leads, not certification that
the full target behavior already passes.

Documentation verification completed: 8 documents, 31 local links, 14 requirement
IDs, 1 pending product decision, 5 user journeys and 32 acceptance criteria.
No broken local links, undefined requirement/decision IDs or duplicate acceptance
IDs were found. The six blueprint documents were formatted with the repository's
installed formatter. Application tests were not run for this documentation change.
