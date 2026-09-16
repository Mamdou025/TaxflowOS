# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-builder-roundtrip.spec.ts >> defined aggregation terms are available without a run and saved versions retain edited rules
- Location: e2e/workflow-builder-roundtrip.spec.ts:3:5

# Error details

```
Error: page.evaluate: WorkflowCommandError: The draft must belong to this workflow.
    at saveVersion (http://127.0.0.1:5173/@fs/home/runner/workspace/lib/workflow-core/src/application/commands.ts:62:11)
    at eval (eval at evaluate (:311:30), <anonymous>:35:17)
    at async <anonymous>:337:30
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - group [ref=e3]:
    - 'generic "Workspace: Synthetic workspace (owner)" [ref=e4] [cursor=pointer]'
    - option "Select…" [disabled]
    - option "Synthetic workspace (owner)" [selected]
    - option "Viewer" [selected]
    - option "Editor"
    - option "Owner"
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]:
        - button "Open chat" [ref=e10] [cursor=pointer]:
          - generic [ref=e11]: InScope
        - button "Collapse sidebar" [ref=e12] [cursor=pointer]
      - button "New chat" [ref=e16] [cursor=pointer]
      - button "Workspace" [ref=e18] [cursor=pointer]
      - button "Chat" [ref=e22] [cursor=pointer]
      - button "Workflows" [ref=e28] [cursor=pointer]
      - button "Sources" [ref=e36] [cursor=pointer]
      - button "Connections" [ref=e44] [cursor=pointer]
      - button "Recent conversations" [ref=e54] [cursor=pointer]
      - generic [ref=e58]: No saved chats yet.
      - generic [ref=e59]:
        - button "Settings" [ref=e61] [cursor=pointer]
        - button "Help" [ref=e68] [cursor=pointer]
        - group "Theme" [ref=e76]:
          - button "Light" [pressed] [ref=e77] [cursor=pointer]
          - button "Dark" [ref=e84] [cursor=pointer]
    - generic [ref=e92]:
      - generic [ref=e93]:
        - generic [ref=e94]: InScope
        - button "Choose client — Scope reads their worksheets & documents" [ref=e95] [cursor=pointer]
      - generic [ref=e152]:
        - generic [ref=e153]:
          - generic [ref=e154]: Good evening, Sophia
          - generic [ref=e155]: What would you like to work on?
        - generic [ref=e158]:
          - textbox "Ask Scope, or describe a task…" [ref=e159]
          - generic [ref=e160]:
            - button "Add — search, workflows, worksheets" [ref=e161] [cursor=pointer]
            - button "Attach files" [ref=e163] [cursor=pointer]
            - 'button "Chat agent: Sina" [ref=e166] [cursor=pointer]': Sina
            - button "Send" [disabled] [ref=e177]
        - generic [ref=e181]:
          - button "Ask about sources" [ref=e182] [cursor=pointer]:
            - generic [ref=e188]:
              - generic [ref=e189]: Ask about sources
              - generic [ref=e190]: Find facts with visible evidence
          - button "Build a workflow" [ref=e191] [cursor=pointer]:
            - generic [ref=e199]:
              - generic [ref=e200]: Build a workflow
              - generic [ref=e201]: Design and save a reusable process
          - button "Run a workflow" [ref=e202] [cursor=pointer]:
            - generic [ref=e206]:
              - generic [ref=e207]: Run a workflow
              - generic [ref=e208]: Choose exact inputs and review the result
  - region "Notifications alt+T"
```