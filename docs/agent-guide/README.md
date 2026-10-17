# Agent guide to TaxflowOS

Per-surface notes for an agent operating the running application (driving a real browser,
or calling the API directly) — not architecture explanation. For architecture, read
[docs/ARCHITECTURE.md](../ARCHITECTURE.md) and [docs/FUNCTIONALITY.md](../FUNCTIONALITY.md)
first; for module-local conventions, check for an `AGENTS.md` next to the code you're
touching before reading this tree.

## Verification status is part of the content, not a footnote

Each file here states, near the top, one of:

- **Verified live** — walked against a running local stack (`docker compose up`, see
  [docs/DEVELOPMENT.md](../DEVELOPMENT.md)) on the date given, ideally with
  `scripts/virtual-worker` (an AI-driven browser tester — see its own README) doing the
  walking so the result isn't just one person's click-path.
- **Derived from code/docs, not yet live-verified** — accurate about routes, ownership and
  contracts as of the date given, but the operational steps (exact clicks, exact copy) have
  not been confirmed against a running instance and may be wrong. Treat these as a map, not
  a script.

Don't silently upgrade a file's status without actually running it. A file going stale is
expected — re-verify it when the surface it describes changes, the same way you'd update a
test.

## Index

| File | Surface | Status |
| --- | --- | --- |
| [running-a-workflow.md](running-a-workflow.md) | Starting, resuming and reading back a workflow run (Chat and the Workflows hub) | Derived from code/docs, 2026-10-17 |

This index is intentionally short. Add a file here when you (or `scripts/virtual-worker`)
have actually exercised a surface and have something durable to say about it — not as a
placeholder for every page in the app.
