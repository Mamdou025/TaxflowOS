# Claude Code Instructions — Workflow Builder

## Audit Maintenance Rule

This project has a living audit system in the `audit/` folder. After **any task** that touches the areas below, update the corresponding file(s) before reporting the task as done.

| If you changed...                              | Update this file         |
|------------------------------------------------|--------------------------|
| Block types, block config, block behavior      | `audit/BLOCKS.md`        |
| Workflow execution, data flow, run logic       | `audit/ARCHITECTURE.md`  |
| UI panels, overlays, editors, toolbar          | `audit/UI.md`            |
| Core TypeScript types or domain model          | `audit/TYPES.md`         |
| Features (added, removed, stubbed, wired up)   | `audit/FEATURES.md`      |
| Anything that affects the overall app state    | `audit/INDEX.md`         |

When in doubt, update `INDEX.md` — it is the entry point and should always reflect current app state.

## Audit File Format

Each audit file should use the following conventions:
- Use `## Section` headers to group related items
- Mark status inline: `[LIVE]`, `[STUB]`, `[REMOVED]`, `[WIP]`
- Keep descriptions concise — one or two lines per item
- Note breaking changes or design shifts under a `### Notes` subsection

## General Rules

- Do not leave audit files stale after making changes
- If a file in the codebase is deleted or renamed, reflect that in the relevant audit file
- If a new block type, UI panel, or feature is added, add it to the audit immediately
- The `audit/INDEX.md` summary section should reflect the current state of the app at all times
