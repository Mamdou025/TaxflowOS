# Navigation and interaction sketch

This is an information/interaction sketch, not a final visual design or a live
screen. Requirement IDs refer to the [product specification](product-spec.md).

## Primary navigation — R-01, R-02

```text
[Workspace selector]

Chat                       [New conversation]
Workflows
Sources
Connections

Recent conversations
  [Conversation title]
  [Conversation title]

--------------------------------------------
Settings
Help
```

Chat is the home entry, not an additional landing page before the conversation.
Agent selection and "Manage agents" are available from the chat header. Detailed
management remains independently implemented even though it has no primary menu.

| Area        | Contents                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| Chat        | Conversations, agent selection/management, context, proposals, activity and linked results                 |
| Workflows   | Library, templates, run history across workflows; each workflow contains its editor, versions and own runs |
| Sources     | Documents, tables/datasets, connected source registrations, processing state and provenance                |
| Connections | Available supported integrations, configured connections, access settings and health                       |
| Settings    | Workspace configuration, users/access when implemented, preferences                                        |

Blocks belong to the workflow editor/catalog. Knowledge retrieval is a service
behind source-aware answers. Neither creates another primary menu in this baseline.

## Chat home — R-03

```text
+----------------------+-----------------------------------------------------+
| Workspace            | Chat                         [Agent v] [Manage]     |
|                      | Context: [Sources 2] [Workflow: Expense / v7] [v]   |
| Chat                 |                                                     |
| Workflows            | What would you like to work on?                     |
| Sources              |                                                     |
| Connections          | [Ask about sources] [Build workflow] [Run workflow] |
|                      |                                                     |
| Recent conversations | Continue: [Relevant unfinished work]                |
| ...                  | [Attention: 2 items]                                |
|                      |                                                     |
| Settings / Help      | [Attach] [Message...........................] [Send]|
+----------------------+-----------------------------------------------------+
```

The initial recommendation is up to three quick actions and at most two relevant
continuation items; these are adjustable design defaults, not user-confirmed
numeric limits. Hide empty continuation/attention areas. In an active conversation,
messages and action cards take priority over welcome content.

The context strip distinguishes explicitly selected sources from other retrieved
sources actually used. Its retrieval behavior depends on D-03. Merely viewing a
source does not silently attach it or authorize an action.

## Conversation with a result — R-06, R-07, R-08

```text
You: Run Expense using the workbook I selected.

[Action: Run Expense]
 Workflow: Expense / v7    Source: expenses.xlsx / revision 3
 Requested by: You        Executed through: Selected agent
 Execution: Completed     Review: Required     Save: Pending sync
 Result: [concise business result and material findings]
 [Open run] [Inspect sources] [Expand activity]

[Message......................................................] [Send]
```

Labels are illustrative and must map to real domain state. Do not show computed
numbers before they exist. Use an explicit pending/unknown state when a response
is missing. A denied action explains the missing permission without fabricating a
run. Search/read tool activity can expand inside the conversation; it is not
invented workflow run history.

## Detail view with conversation retained — R-04, R-14

```text
+-----------+-------------------------+--------------------------------------+
| Navigation| Conversation            | Workflow / source / run detail      |
|           | Prior messages          | [Title] [Version] [Close detail]     |
|           | Linked action card      |                                      |
|           |                         | Editor, evidence or run results      |
|           | [Message...]            |                                      |
+-----------+-------------------------+--------------------------------------+
```

The split view is a proposed interaction on wide screens. On narrow screens, use
one active surface with a visible return-to-conversation control. Both preserve
conversation ID, draft content and selection in the current session. Closing a
detail panel is not deleting its underlying data or silently saving a draft.

Back/forward and existing deep links need a migration plan. Keep old routes
reachable through adapters/redirects until their consumers are migrated; Phase 0
does not assign replacement URL paths. Keyboard navigation must reach the context
strip, action controls and detail panel, with focus restored on close. Status must
be conveyed by text, not color alone.

## Run history is within Workflows — R-02, R-14

```text
Workflows
  Library
    Expense
      Build / configuration
      Saved versions
      Runs
        Run details -> results, evidence, activity
  Templates
  Run history              # across accessible workflows
```

Run history supports identifying workflow/version, initiator, time and status.
Global history, workflow-specific history and chat cards resolve the same run ID.
Opening history is a read action and must never start a run. A retry is an explicit
operation creating a new attempt linked to the previous one.

Attention in Chat links to the relevant failed run or proposal. Do not introduce a
separate Overview page or a duplicate execution list owned by Chat. Standalone
agent operations remain in conversation activity unless they invoke a workflow.

## Cases the design must handle

- No workflows/sources/connections: offer the relevant first action without fake
  example results or a wall of empty dashboards.
- No active conversation: allow a direct workflow/source link, with a return to Chat.
- Multiple conversations referencing one run: show the same underlying state.
- Deleted or inaccessible source/run: explain that state; never silently open a
  different object or expose another workspace's content.
- Pending proposal or unsaved draft: preserve it while navigating; a stale revision
  must be resolved before application.
- Browser close or network loss: disclose actual persistence/execution guarantees.
  Do not promise resume-after-close behavior before D-01 is implemented.
