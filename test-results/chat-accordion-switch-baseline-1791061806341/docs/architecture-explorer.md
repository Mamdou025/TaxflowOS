# TaxflowOS architecture explorer

Open [the local explorer](../.archify/index.html) in a browser. It is a permanent
start page for understanding the implementation from **whole system → subsystem →
individual files**. It works without starting the TaxflowOS API or database.

This is developer documentation owned by the architecture tooling in
`scripts/architecture-explorer`. Application behavior, stored business data,
authorization rules and model configuration are unchanged.

## Start here

1. Choose a perspective in the sidebar.
2. Select a diagram block to read its responsibility and representative files.
3. Select a **Code area** to browse its directory structure and every indexed file
   assigned to that module.
4. Select a file to inspect its explanation, exports, local dependencies, importers,
   source locations and related tests.
5. Follow an import or importer to continue through the code. Use the breadcrumb
   or sidebar to return to the system view.

Use the search box, or press `/`, to find a file, export or module. The file page
can filter by code area and file kind. **Package inventory** lists dependency
requirements from manifests. **How work gets done** follows five concrete
journeys. **Archify diagrams** opens the native diagrams with their own zoom,
theme, source and export controls.

The five perspectives answer different questions:

| Perspective                       | Question answered                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Whole system · frontend / backend | Which parts run in the browser, server, workers, shared libraries and external services?                    |
| Technology stack                  | Which concrete technologies implement those responsibilities?                                               |
| API communication & models        | How are requests authorized and routed, where are records stored, and which model adapters are available?   |
| How AI chat connects              | How do offered tools connect the conversation to workflow commands, source evidence and computer tasks?     |
| How work gets done                | How does supplied evidence become a saved version, local or durable execution, inspected output and review? |

The native diagram library retains the original overview, saved-workflow and
Sina-to-Mkoro maps, and adds:

- [Frontend, backend & shared code](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.html).
- [Chat, API & model communication](../.archify/sequence-chat-api-20261001-160000/chat-api.html).

The explorer needs its sibling `explorer-data.js`, `explorer.js`,
`explorer.css` and diagram folders. Each native Archify HTML also works on its
own. Local source links depend on the surrounding repository being present;
browser handling may display or download the source. The shown line numbers are
evidence locations, not a promise that the browser will jump to that line.
In the preview served from `.archify`, source references are displayed as paths;
the preview does not expose the rest of the repository. Open the local HTML file
to use its source-file links, or copy a path into your editor.

## Understand the evidence

The index includes eligible tracked and nonignored working files: TypeScript and
JavaScript, tests, styles, SQL, configuration, text/HTML resources, PowerShell and
shell scripts. Archives, dependencies, build output, attached assets, environment
files and lockfiles are excluded. It is a source inventory, not proof that every
included file is reachable in production.

Import extraction uses the TypeScript syntax tree, nearest TypeScript
configuration and workspace package exports. It records literal imports,
re-exports, literal `import()` and `require()`, including type-only relationships.
PowerShell and shell files are listed without JavaScript import inference.
Runtime expressions, selected-at-runtime aliases, HTTP calls and database
relationships require separate inspection.

There are **35 individually reviewed file explanations**. Their detail panels
include purpose, reads/inputs, writes/changes, rules, source evidence, related
tests and the review date/revision. All remaining files show clearly labeled
**structural facts**: path, extracted exports and import relationships. They do
not claim an individually reviewed behavioral explanation.

A reviewed file's content hash is compared with the recorded reviewed hash.
Changed or unverifiable content receives **Review needs refresh**. An unchanged
file can still be affected by a change elsewhere: matching bytes are useful
freshness evidence, not a complete semantic audit.

The system views, work journeys and native Archify maps are written explanations.
They are not automatically inferred runtime traces. The review covered source
at commit `444d6e0fc84928e35b9635a65eb8392520b09df2` on 1 October 2026.
Current file counts and working-tree state appear in the explorer.

Keep these implementation boundaries in mind:

- Chat's guided sessions and local previews run in the browser. Durable workflow
  jobs use the separately persisted server queue.
- Computation, human approval and server synchronization are separate states.
- Sources retain identity, revision and citations. Missing evidence remains a
  visible limitation.
- Model names are source configuration, not an inspection of deployment secrets.
  Sina's gateway, optional MicroSina/Foundry and Agent Builder have distinct
  provider paths.
- Computer task observations do not prove that a platform workflow completed.
- A related test link identifies evidence to inspect; it does not claim a test
  passed or measure coverage.

The [architecture guide](ARCHITECTURE.md) still describes current implementation.
The [product blueprint](product/README.md) still describes intended behavior.
Neither was rewritten to make the code match a diagram.

## Refresh the same explorer

Use Node 24.21.0 and pnpm 10.26.1, as pinned in
[package.json](../package.json). Follow [development setup](DEVELOPMENT.md) for the
environment; its older opening pnpm version remains an existing documentation
discrepancy recorded in the pilot guide. From the repository root:

```sh
pnpm run explorer:build
pnpm run explorer:check
pnpm run explorer:watch
pnpm run test:architecture-explorer
```

| Command                      | What it does                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `explorer:build`             | Rebuilds the same `.archify/index.html`, viewer files and generated file/import/package snapshot.             |
| `explorer:check`             | Checks whether generated outputs match their current inputs; fails on stale output.                           |
| `explorer:watch`             | Rebuilds after local source/configuration changes while the command remains running. Stop with Ctrl+C.        |
| `test:architecture-explorer` | Runs the isolated indexer tests for resolution, extraction, review freshness, scope and reference validation. |

**Refresh the browser after a rebuild.** The viewer's **Reload snapshot** button
reloads the last generated files; it does not analyze code or start a build.

The watcher performs mechanical indexing. It makes no AI requests and does not
rewrite file explanations, journeys, architecture relationships or native
Archify diagrams. It is not installed as a background service. When an input or
reference cannot be validated, the build reports the error; it does not invent
replacement evidence.

A useful maintenance sequence after code work is:

1. Rebuild or run the watcher to refresh file relationships and stale-note badges.
2. Review changed responsibilities and the affected explanatory notes.
3. Update those notes and diagrams from actual source evidence.
4. Rebuild and run `explorer:check`; use native Archify validation for regenerated
   Archify HTML.

Adding commands here does not make them part of `pnpm run verify` or CI. Run the
explorer checks explicitly when changing this tooling or its content.

## Edit or add a view

The plain-language editing interface remains this coding chat. For a direct
source edit, open
[content.json](../scripts/architecture-explorer/content.json). It contains:

| Section    | What to edit                                                                            |
| ---------- | --------------------------------------------------------------------------------------- |
| `modules`  | Responsibility, owner and path prefixes. The longest matching prefix assigns each file. |
| `views`    | Perspective titles, clickable blocks, module/file links and reviewed connections.       |
| `notes`    | Individually reviewed file explanations, evidence, tests and reviewed content identity. |
| `journeys` | Ordered explanations of how a user task moves through the implementation.               |
| `diagrams` | The native Archify diagram catalog; paths are relative to `.archify`.                   |

Review a changed file before updating its `reviewedHash`, `reviewedAt` and
`reviewedRevision`; do not refresh those fields merely to clear a warning.
For new architectural assertions, attach concrete source locations and state
uncertainty where evidence is incomplete.

The HTML interface supports exploration; it has no drag-and-drop diagram editor.
Changing layout or interaction code uses `viewer.html`, `viewer.css` and
`viewer.js`, followed by a rebuild.

Native Archify diagrams have their own editable `candidate.json` files.
`explorer:build` links these diagrams but does not regenerate them. Follow the
[Archify authoring and regeneration instructions](archify-pilot.md#reproduce-or-update)
and the installed Archify skill when updating a candidate. Use type
`architecture` for the new frontend/backend map and `sequence` for the new chat/API
map. Preserve receipts for the exact HTML bytes they checked.

## Verification record

The explorer adds documentation/tooling; no application behavior change is
intended. Source checks and diagram validation do not establish live provider
availability, production access guarantees or correctness of every explanatory
statement.

| Check                                              | Actual result                                                                                                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Isolated architecture indexer tests                | 6 passed; includes resolver boundaries, syntax extraction, stale-review detection, exclusions and broken-reference rejection.                                                                                                                     |
| Reviewed-file freshness at generation              | 35 reviewed hashes matched; zero stale reviews at the checked snapshot.                                                                                                                                                                           |
| New frontend/backend Archify diagram               | Finalize passed validation, delivery, artifact and browser gates; 9/9 artifact checks, zero errors/warnings.                                                                                                                                      |
| New chat/API Archify diagram                       | Finalize passed validation, delivery, artifact and browser gates; 9/9 artifact checks, zero errors/warnings.                                                                                                                                      |
| Native diagram captures                            | Four light/dark captures per new map, plus capture receipts and contact sheets, were generated.                                                                                                                                                   |
| Full `pnpm run verify`                             | Passed on task-local Node 24.21.0 and pnpm 10.26.1: contracts, architecture, maintained formatting, typechecks, 109 unit tests, 34 Mkoro tests and 23 workflow-core tests.                                                                        |
| Explorer browser interaction and visual QA         | Passed in the restricted localhost preview: all five perspectives, component/module/file drill-down, search, package inventory, five journeys and the embedded chat/API diagram. Details verified at 820px; no horizontal page overflow at 560px. |
| Final output freshness, formatting and local links | Passed: generated outputs match current inputs, explorer sources pass Prettier, and local documentation references resolve.                                                                                                                       |
| Live providers and production/shared data          | Not exercised by this documentation task.                                                                                                                                                                                                         |

The watcher detected addition and removal of a disposable source file, including its unique export. A deletion overlapping a scan caused one transient ENOENT; the next watched rebuild recovered. Deliberate output tampering made explorer:check fail, and rebuilding restored a passing check. The probe was removed and the watcher was stopped.

The native automated receipts are
[frontend/backend](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.finalize-summary.json)
and [chat/API](../.archify/sequence-chat-api-20261001-160000/chat-api.finalize-summary.json).
Their validation is separate from custom-explorer UI checks.

The first full-verification launch inherited the machine's global pnpm/Node pair
inside nested commands and stopped at its engine guard. Re-running with the
existing task-local pnpm launcher on PATH passed. No runtime pins, engine checks
or machine-wide installation were changed. The pre-existing opening paragraph in
`docs/DEVELOPMENT.md` names pnpm 10.33.2; the manifest and passing doctor require
10.26.1, which this task used.

Direct `file://` UI inspection was blocked by browser-tool policy. Browser QA used
a localhost server restricted to `.archify`; source paths and documentation links
were checked on disk. No live providers, integration databases or production build
were needed for this developer-tooling change.

## Changed-file inventory

The task began with an existing, untracked Archify pilot. A pre-task hash
inventory distinguished that work from this expansion. Of the inventoried
existing files, only `package.json`, `docs/ARCHITECTURE.md`,
`docs/archify-pilot.md` and `.archify/index.html` changed. The three earlier
diagram folders and their receipts/captures were retained.

Every change below belongs to architecture documentation and tooling. No
TaxflowOS runtime behavior change is intended.

### Maintained source and documentation

| File                                                                                                | Purpose and before → after                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [scripts/architecture-explorer/indexer.mjs](../scripts/architecture-explorer/indexer.mjs)           | New indexer: previously no repository-wide explorer data; now extracts eligible files, imports, exports, package requirements and review freshness. It validates authored evidence and navigation references. |
| [scripts/architecture-explorer/build.mjs](../scripts/architecture-explorer/build.mjs)               | New build/check/watch entry point: previously diagrams were separate files; now refreshes a stable explorer output and detects stale generated files.                                                         |
| [scripts/architecture-explorer/indexer.test.mjs](../scripts/architecture-explorer/indexer.test.mjs) | New isolated tooling tests: adds coverage for the explorer's resolution, extraction, scope, freshness and evidence behavior. No application test expectation changes.                                         |
| [scripts/architecture-explorer/viewer.html](../scripts/architecture-explorer/viewer.html)           | New maintained page shell: supplies navigation, search, main content and component/file detail surfaces.                                                                                                      |
| [scripts/architecture-explorer/viewer.css](../scripts/architecture-explorer/viewer.css)             | New maintained styling: supplies responsive maps, file navigation, evidence panels and diagram presentation.                                                                                                  |
| [scripts/architecture-explorer/viewer.js](../scripts/architecture-explorer/viewer.js)               | New local viewer behavior: supplies perspective selection, system-to-file navigation, filters, import exploration, evidence details and native diagram embeds.                                                |
| [scripts/architecture-explorer/content.json](../scripts/architecture-explorer/content.json)         | New authored semantic content: adds five perspectives, module ownership, 35 reviewed file notes, five work journeys and the diagram catalog.                                                                  |
| [package.json](../package.json)                                                                     | Adds four explicit explorer commands. Existing application commands, dependency requirements and toolchain pins remain unchanged.                                                                             |
| [docs/ARCHITECTURE.md](ARCHITECTURE.md)                                                             | Adds links to the explorer and this guide. Its implementation description remains authoritative within its existing scope; no behavior change is intended.                                                    |
| [docs/archify-pilot.md](archify-pilot.md)                                                           | Updates the introduction to point to the expanded explorer. The original pilot inventory and check record remain historical evidence.                                                                         |
| [docs/architecture-explorer.md](architecture-explorer.md)                                           | New user/maintenance guide, evidence limits, verification record and per-file change inventory.                                                                                                               |

### Generated explorer

| File                                                      | Purpose and before → after                                                                                                                |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [.archify/index.html](../.archify/index.html)             | Replaces the original three-link pilot start page with the maintained explorer shell. Earlier diagrams remain linked in its library.      |
| [.archify/explorer.css](../.archify/explorer.css)         | New generated copy of viewer styling; refreshed by `explorer:build`.                                                                      |
| [.archify/explorer.js](../.archify/explorer.js)           | New generated copy of local navigation/interaction code; refreshed by `explorer:build`.                                                   |
| [.archify/explorer-data.js](../.archify/explorer-data.js) | New generated working-tree snapshot containing file facts, written explanations, relationships, package inventory and freshness metadata. |

### New native Archify artifacts

These 24 files are new to this expansion. Each row states the file's role;
all add diagram content or verification evidence without changing the application.

#### Frontend, backend & shared code

| New file                                                                                                                                                                                                                                          | Role                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [.archify/architecture-frontend-backend-20261001-160000/candidate.json](../.archify/architecture-frontend-backend-20261001-160000/candidate.json)                                                                                                 | Editable diagram specification: structure, wording, geometry and committed source references. |
| [.archify/architecture-frontend-backend-20261001-160000/frontend-backend.html](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.html)                                                                                   | Standalone interactive Archify viewer for this perspective.                                   |
| [.archify/architecture-frontend-backend-20261001-160000/frontend-backend.delivery.json](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.delivery.json)                                                                 | Delivery provenance and hashes linking the specification to the generated HTML.               |
| [.archify/architecture-frontend-backend-20261001-160000/frontend-backend.finalize.json](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.finalize.json)                                                                 | Detailed validation and delivery results for the delivered artifact.                          |
| [.archify/architecture-frontend-backend-20261001-160000/frontend-backend.finalize-summary.json](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.finalize-summary.json)                                                 | Compact pass/fail receipt and pointers to the detailed evidence.                              |
| [.archify/architecture-frontend-backend-20261001-160000/frontend-backend.browser-check.json](../.archify/architecture-frontend-backend-20261001-160000/frontend-backend.browser-check.json)                                                       | Automated browser measurements associated with the checked HTML.                              |
| [.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.1440x900.light.png](../.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.1440x900.light.png)   | Captured 1440×900 light-theme viewport for visual review.                                     |
| [.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.1440x900.dark.png](../.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.1440x900.dark.png)     | Captured 1440×900 dark-theme viewport for visual review.                                      |
| [.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.2048x1320.light.png](../.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.2048x1320.light.png) | Captured 2048×1320 light-theme viewport for visual review.                                    |
| [.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.2048x1320.dark.png](../.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.2048x1320.dark.png)   | Captured 2048×1320 dark-theme viewport for visual review.                                     |
| [.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.html](../.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.html)                               | Contact sheet linking this map's screenshot captures.                                         |
| [.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.json](../.archify/architecture-frontend-backend-20261001-160000/visual-check/frontend-backend.visual-check.json)                               | Capture receipt identifying the HTML and generated screenshot files.                          |

#### Chat, API & model communication

| New file                                                                                                                                                                                                  | Role                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [.archify/sequence-chat-api-20261001-160000/candidate.json](../.archify/sequence-chat-api-20261001-160000/candidate.json)                                                                                 | Editable diagram specification: structure, wording, geometry and committed source references. |
| [.archify/sequence-chat-api-20261001-160000/chat-api.html](../.archify/sequence-chat-api-20261001-160000/chat-api.html)                                                                                   | Standalone interactive Archify viewer for this perspective.                                   |
| [.archify/sequence-chat-api-20261001-160000/chat-api.delivery.json](../.archify/sequence-chat-api-20261001-160000/chat-api.delivery.json)                                                                 | Delivery provenance and hashes linking the specification to the generated HTML.               |
| [.archify/sequence-chat-api-20261001-160000/chat-api.finalize.json](../.archify/sequence-chat-api-20261001-160000/chat-api.finalize.json)                                                                 | Detailed validation and delivery results for the delivered artifact.                          |
| [.archify/sequence-chat-api-20261001-160000/chat-api.finalize-summary.json](../.archify/sequence-chat-api-20261001-160000/chat-api.finalize-summary.json)                                                 | Compact pass/fail receipt and pointers to the detailed evidence.                              |
| [.archify/sequence-chat-api-20261001-160000/chat-api.browser-check.json](../.archify/sequence-chat-api-20261001-160000/chat-api.browser-check.json)                                                       | Automated browser measurements associated with the checked HTML.                              |
| [.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.1440x900.light.png](../.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.1440x900.light.png)   | Captured 1440×900 light-theme viewport for visual review.                                     |
| [.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.1440x900.dark.png](../.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.1440x900.dark.png)     | Captured 1440×900 dark-theme viewport for visual review.                                      |
| [.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.2048x1320.light.png](../.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.2048x1320.light.png) | Captured 2048×1320 light-theme viewport for visual review.                                    |
| [.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.2048x1320.dark.png](../.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.2048x1320.dark.png)   | Captured 2048×1320 dark-theme viewport for visual review.                                     |
| [.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.html](../.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.html)                               | Contact sheet linking this map's screenshot captures.                                         |
| [.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.json](../.archify/sequence-chat-api-20261001-160000/visual-check/chat-api.visual-check.json)                               | Capture receipt identifying the HTML and generated screenshot files.                          |

No commit, push, merge or deployment is part of this change.
