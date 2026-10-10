# Workflow navigation inside its page

## Requested behavior and scope

Opening Workflows puts its list and controls inside the Workflows page instead
of beneath recent conversations in the shared sidebar. Workflows owns this UI;
Chat remains home, with the existing global navigation, branding and conversation.

The local list groups Library, Run history and New workflow together, retains
the existing storage/backup panel, then separates Saved workflows from Templates.
Both kinds of workflow use the same row spacing, icons, title truncation and
selection styling. The existing template categories remain labels, not new
persisted folders. This is a reversible presentation choice; no workflows are
deleted, renamed, merged, moved between stored containers or reclassified.

The list collapses without unmounting the editor or its own storage controls.
It stacks above the detail when the page panel is narrow, including when Chat
is docked on a wider display. Selection, versions, runs, header tabs, execution
commands, permissions and storage formats retain their existing owners.

The mobile browser check exposed an existing shell defect: the desktop chat
minimum width left the workflow page with zero width at a 390px viewport. The
scoped responsive fix focuses the active page on phones and retains Chat mounted;
the Chat action restores it. The header scrolls horizontally and leaves room for
the existing workspace/demo control. This applies consistently to registered
pages without changing desktop split preferences.

## Acceptance criteria

- Workflow controls and names appear inside Workflows, not under recent chats.
- Saved workflows and template categories have consistent visible grouping.
- Library, history, templates, personal workflows, new drafts and backup controls
  remain reachable through the same actions and compatibility links.
- Hiding/restoring the list preserves the mounted editor and stored records.
- Switching pages retains the conversation draft; narrow layouts retain a
  reachable list toggle and usable detail area.

## Files changed in this task

This task started from an already modified working tree. Earlier assistant-ui,
FAPI, access, calculation and ChatGPT-plugin work is not part of this change.
The shell file, architecture/functionality guides, two chat/navigation test files
and maintained-path registry already had changes. The workflow page, selection
store and builder-roundtrip test were previously clean; the navigation component,
stylesheet and this record are new. The table below describes only this task's
changes, checked against the starting file snapshot rather than the whole Git diff.

| File                                                                                                                         | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [workflow-page.tsx](../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-page.tsx)                           | Owns workflow composition. Replaces global sidebar registration with local navigation and a separately positioned detail container. Updates the empty-state instructions. Existing detail selection and execution behavior is preserved.                                                                                                                                            |
| [workflow-navigation.tsx](../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-navigation.tsx)               | New Workflows-owned navigation component, extracted from the page's former sidebar list. Retains selection/storage actions, standardizes rows and groups, and adds an accessible hide/restore control.                                                                                                                                                                              |
| [workflow-navigation.css](../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-navigation.css)               | Adds scoped layout and theme styling. A page-width container query changes the list from a left rail to a bounded, scrollable section above the detail. No calculation or persistence behavior.                                                                                                                                                                                     |
| [workflows-store.ts](../artifacts/ai-workflow-builder/src/features/workflows-hub/workflows-store.ts)                         | Corrects the ownership comment to describe page-local navigation. No runtime behavior change.                                                                                                                                                                                                                                                                                       |
| [copilot-workspace-panel.tsx](../artifacts/ai-workflow-builder/src/features/assistant/workspace/copilot-workspace-panel.tsx) | Updates the ownership comment and fixes the narrow-screen shell: instead of letting the desktop chat minimum squeeze the page to zero, it focuses the active page while retaining mounted Chat. Chat navigation restores the conversation. Scrollable header controls and space beneath the fixed workspace menu keep workflow tabs reachable. Desktop split behavior is unchanged. |
| [phase-7-navigation.spec.ts](../e2e/phase-7-navigation.spec.ts)                                                              | Strengthens navigation coverage for control location and preserved drafts/records; adds narrow-screen collapse/restore coverage and rendered screenshots. No application behavior change.                                                                                                                                                                                           |
| [workflow-builder-roundtrip.spec.ts](../e2e/workflow-builder-roundtrip.spec.ts)                                              | Updates the old “MY WORKFLOWS” assertion to the renamed Saved workflows region. No application behavior change.                                                                                                                                                                                                                                                                     |
| [maintained-paths.mjs](../scripts/maintained-paths.mjs)                                                                      | Includes the changed workflow composition and new navigation files in formatting checks. No application behavior change.                                                                                                                                                                                                                                                            |
| [ARCHITECTURE.md](ARCHITECTURE.md)                                                                                           | Documents Workflows-owned navigation and preserved execution/loading boundaries. No runtime behavior change.                                                                                                                                                                                                                                                                        |
| [FUNCTIONALITY.md](FUNCTIONALITY.md)                                                                                         | Describes the new placement, grouping and collapsible layout. No runtime behavior change.                                                                                                                                                                                                                                                                                           |
| [workflow-page-navigation.md](workflow-page-navigation.md)                                                                   | Records scope, assumptions, per-file meaning and verification. No runtime behavior change.                                                                                                                                                                                                                                                                                          |

The product blueprint already places the library, templates and runs inside
Workflows. Its intended behavior remains accurate; no pending product-policy
decision is promoted or rewritten by this layout change.

The existing assistant-ui draft-choice browser test also now checks the selected
named workflow row in page navigation, since the draft name appears both there
and in the page header. This changes the assertion location without changing the
expected workflow identity or relaxing the preserved-record checks in
[assistant-ui-chat.spec.ts](../e2e/assistant-ui-chat.spec.ts). No application
behavior change is intended in this test file.

## Verification

- `pnpm run verify` passed after the responsive fix: toolchain, contracts,
  architecture, maintained formatting and type checks, plus 316 passing tests
  (229 unit, 37 worker and 50 workflow-core tests). The earlier verification run
  also passed. Final log: `%TEMP%/taxflow-workflow-navigation-verify-final.log`.
- The initial focused browser run selected seven cases: opening a draft from Chat,
  deferred editors/draft retention, primary navigation/history, narrow-screen
  navigation, compatibility links, the blank/FAPI catalog, and importing/rerunning
  a retired-template copy. Six passed; the mobile case exposed the zero-width
  page caused by the desktop chat minimum. Its failure was retained and the shell
  was corrected; no assertion or timeout was weakened.
- The final rerun below passed all four affected navigation cases. It checks
  page-local controls, preserved records and drafts, reachable mobile controls,
  an unchanged editor DOM instance during collapse/restore and Chat/page switching,
  and direct Sources, Connections and workflow-history links.

```text
pnpm run test:workflow-reliability phase-7-navigation.spec.ts --grep 'Chat-first navigation|Workflows page navigation|direct Sources, Connections|page summaries defer editors'
```

The first browser run is retained under
`test-results/phase2/04a727d1-ec47b001-93c2-4785-a3fb-5f2367e3c888`.
The final four passing cases and screenshots are under
`test-results/phase2/04a727d1-1e1f5533-dd01-48cb-889b-27c2f42e8a85`.
These are local test artifacts. Desktop (1600×1000), mobile (390×844) and the
collapsed mobile list were visually inspected. Scoped formatting, diff-whitespace
and local documentation-link checks also passed.

Browser fixtures use disposable state and mocked workflow-library writes; they
do not establish live provider or real database behavior. The separate full
builder-roundtrip suite was not rerun; its changed assertion only names the moved
group. No dependency, API or lazy-loading boundary changed, so a production build
was not repeated for this presentation change. The pre-existing fixed workspace
menu can still grow beyond the 48px mobile reserve when a very long workspace name
wraps; the visual checks cover its normal single-line state. No commit, push or
deployment is part of this task.
