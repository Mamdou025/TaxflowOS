# Archify pilot: explore TaxflowOS

Open [the architecture explorer](../.archify/index.html) in a browser. It now
replaces the original pilot start page and includes the three maps below alongside
two newer maps, five perspectives and file navigation. See the
[explorer guide](architecture-explorer.md) for current usage and refresh commands.
The original pilot inventory and verification below describe the earlier work.
All maps work as local HTML files; no running TaxflowOS API or database is required.

## Maps and current evidence

All three maps describe commit `444d6e0fc84928e35b9635a65eb8392520b09df2`, inspected
on 1 October 2026. Each node's source panel names committed files and line ranges.
The references use `local-only` mode: they show local evidence without assuming
that a viewer can access the remote repository. They do not embed source code.

| Map                                                                                              | Question answered                                           | Current automated receipt                                                                                                  | Current captures                                                                                                         |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [System overview](../.archify/architecture-system-overview-20261001-150322/system-overview.html) | What are the main runtime responsibilities and connections? | [Passing receipt](../.archify/architecture-system-overview-20261001-150322/review-3/system-overview.finalize-summary.json) | [Contact sheet](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.html) |
| [Saved workflow](../.archify/sequence-saved-workflow-20261001-150322/saved-workflow.html)        | How do browser preview and durable execution differ?        | [Passing receipt](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.finalize-summary.json)       | [Contact sheet](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.html)           |
| [Sina to Mkoro](../.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.html)                 | How does a computer task reach Goose and return progress?   | [Passing receipt](../.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.finalize-summary.json)               | [Contact sheet](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.html)      |

Use Find a node, focus, source references, path exploration, and the diagram guide
to inspect a map. The HTML includes its own viewer. The start page uses relative
links, so retain its sibling folders when copying the complete pilot.

## Meaning and ownership

This is developer documentation owned by the architecture/review workflow.
Application source, package dependencies, authorization, storage contracts, and
product policy are unchanged. Before this task there were no Archify maps; after
it there are three explorable explanations and reproducible diagram sources.

The system overview distinguishes the browser, application API, PostgreSQL,
private document storage, providers, source APIs, workers, and personal computer
companion. Shared workflow packages are described as imported code. The workers
start in the API process by default; their separate boxes describe responsibilities,
not proof of separate deployed services.

The saved-workflow map preserves the separation between calculation, approval,
local recording, library sync, and durable run persistence. A new local version
may not exist in the server library until sync succeeds. Durable admission reads
the requested version from that server library; it cannot substitute a missing
version. Cancellation does not interrupt a deterministic block mid-execution.

The Mkoro map separates task admission from offered tool decisions, including the
optional automatic approval setting. It shows outbound companion polling, local
Goose ACP execution, progress, and Stop. Task validation is not an OS sandbox.

The [architecture guide](ARCHITECTURE.md) and [product blueprint](product/README.md)
remain accurate for their respective implementation and intended-behavior scopes.
They were not rewritten to fit a generated picture. The pilot adds a visual
account of the current implementation, not a new product guarantee.

## Verification and limits

| Check                                 | Actual result                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Toolchain doctor                      | Passed with task-local Node 24.21.0 and pnpm 10.26.1                                                             |
| Archify showcase validation           | All three maps passed 9/9 artifact checks, zero errors/warnings                                                  |
| Committed source references           | 26 overview + 32 workflow + 35 Mkoro references verified                                                         |
| Delivery and strict provenance        | Passed for all three current HTML files                                                                          |
| Automated Chrome browser checks       | Passed at 1440x900, 1600x1000, 1920x1080 and 2048x1320; required theme states passed                             |
| Screenshot capture                    | Four light/dark endpoint captures per current map passed                                                         |
| Perceptual inspection                 | Overview and Mkoro: 1440 light and 2048 dark inspected; workflow: all four current captures inspected            |
| Interactive smoke check               | Start-page navigation, overview node finder, API focus and committed source panel verified in the in-app browser |
| Application suites and live providers | Not run; no application behavior was changed or certified                                                        |

The overview retains two resolved connector crossings and two route-detour
advisories. A position-only alternative failed the readability gate and was
reverted. The retained map passes automated checks; its routes were visually
inspected. The workflow has two short bend advisories. The Mkoro map is tall,
with substantial whitespace and a long Stop return route. These are presentation
limits of this pilot, not claims about runtime behavior.

Initial checks using the ambient Node 24.19.0/pnpm 11.19.0 and then pnpm 10.33.2
failed the repository's engine requirement. The project manifest pins pnpm
10.26.1, which passed with Node 24.21.0. The opening toolchain paragraph in
DEVELOPMENT.md currently says 10.33.2; that existing documentation discrepancy
was not changed as part of this pilot. No global runtime was changed.

Source existence, line ranges, layout and browser checks cannot prove that every
architectural interpretation is correct. These maps do not inspect live
infrastructure or establish provider availability, security completeness, or
end-to-end correctness. Generated HTML contains internal system descriptions and
source paths; it has not been published. No commit, push or deployment was made.

Final handoff checks also verified 76 local documentation/start-page links,
Prettier formatting of this guide and the start page, and agreement between each
current candidate, HTML hash and capture receipt. Git showed only this pilot's
61 additions and no modified tracked files.

## Reproduce or update

Archify was installed from `tt-a1i/archify`, tag `v3.0.1`, into the user's Codex
skills directory. It is development tooling, not a TaxflowOS runtime dependency.
The installed [Archify skill](https://github.com/tt-a1i/archify/blob/v3.0.1/archify/SKILL.md)
defines authoring, validation, bounded repairs, and artifact delivery.

From the repository root, use Node 24.21.0 and an absolute path to the installed
`archify/bin/archify.mjs`. For each map run:

```text
node <archify-cli> finalize <type> <folder>/candidate.json <folder>/<name>.html --repo-root . --quality showcase --json --out-dir <folder>/<fresh-evidence-directory>
node <archify-cli> visual-check <folder>/<name>.html --summary --require-provenance --out-dir <folder>/<fresh-evidence-directory>/visual-check
```

Use `architecture` for the overview and `workflow` for both journeys. The saved
workflow's original folder starts with `sequence-`; its actual schema and CLI type
are `workflow`. Keep a fresh evidence directory when regenerating existing HTML
so prior receipts remain associated with the exact bytes they verified.

The pilot set `ARCHIFY_UPDATE_CHECK_DISABLED=1` only in its rendering processes.
Update-reminder network checks were disabled; no persistent update preference
was changed. The core rendering workflow needed no dependency installation.

For a later code revision, trace affected entry points and calls, update the
candidate's repository revision and evidence, and rerun the full checks. Do not
change only the revision label or present uncommitted code as verified committed
evidence. New proposal diagrams should explicitly say they depict a proposal.

For future change reviews, explain the affected responsibility, before/after
behavior, source evidence, tests run, and remaining unknowns. Refresh a map when
ownership, interfaces, storage or execution changes materially affect it. This
pilot does not add a CI gate or automatic map refresh.

## File inventory

Every file listed below is new. Its before-state was absence; its after-state is
the named documentation or verification artifact. No application behavior change
is intended for any file. Git reported a clean tree before the task; the listed
files are this task's additions. Earlier receipts and captures are retained as
history; use the current links above when evaluating the delivered HTML.

| File                                                                                                                                                                                                                                          | Purpose                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [.archify/architecture-system-overview-20261001-150322/candidate.json](../.archify/architecture-system-overview-20261001-150322/candidate.json)                                                                                               | Editable diagram structure, wording, geometry and committed source references    |
| [.archify/architecture-system-overview-20261001-150322/review-2/system-overview.finalize-summary.json](../.archify/architecture-system-overview-20261001-150322/review-2/system-overview.finalize-summary.json)                               | Compact validation and delivery result for this attempt                          |
| [.archify/architecture-system-overview-20261001-150322/review-2/system-overview.finalize.json](../.archify/architecture-system-overview-20261001-150322/review-2/system-overview.finalize.json)                                               | Detailed validation and delivery result for this attempt                         |
| [.archify/architecture-system-overview-20261001-150322/review-3/system-overview.browser-check.json](../.archify/architecture-system-overview-20261001-150322/review-3/system-overview.browser-check.json)                                     | Automated browser measurements bound to exact HTML bytes                         |
| [.archify/architecture-system-overview-20261001-150322/review-3/system-overview.finalize-summary.json](../.archify/architecture-system-overview-20261001-150322/review-3/system-overview.finalize-summary.json)                               | Compact validation and delivery result for this attempt                          |
| [.archify/architecture-system-overview-20261001-150322/review-3/system-overview.finalize.json](../.archify/architecture-system-overview-20261001-150322/review-3/system-overview.finalize.json)                                               | Detailed validation and delivery result for this attempt                         |
| [.archify/architecture-system-overview-20261001-150322/system-overview.browser-check.json](../.archify/architecture-system-overview-20261001-150322/system-overview.browser-check.json)                                                       | Automated browser measurements bound to exact HTML bytes                         |
| [.archify/architecture-system-overview-20261001-150322/system-overview.delivery.json](../.archify/architecture-system-overview-20261001-150322/system-overview.delivery.json)                                                                 | Current generated HTML provenance and hashes                                     |
| [.archify/architecture-system-overview-20261001-150322/system-overview.finalize-summary.json](../.archify/architecture-system-overview-20261001-150322/system-overview.finalize-summary.json)                                                 | Compact validation and delivery result for this attempt                          |
| [.archify/architecture-system-overview-20261001-150322/system-overview.finalize.json](../.archify/architecture-system-overview-20261001-150322/system-overview.finalize.json)                                                                 | Detailed validation and delivery result for this attempt                         |
| [.archify/architecture-system-overview-20261001-150322/system-overview.html](../.archify/architecture-system-overview-20261001-150322/system-overview.html)                                                                                   | Self-contained interactive system map                                            |
| [.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.1440x900.dark.png](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.1440x900.dark.png)     | Captured viewport and theme for visual review                                    |
| [.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.1440x900.light.png](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.1440x900.light.png)   | Captured viewport and theme for visual review                                    |
| [.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.2048x1320.dark.png](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.2048x1320.dark.png)   | Captured viewport and theme for visual review                                    |
| [.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.2048x1320.light.png](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.2048x1320.light.png) | Captured viewport and theme for visual review                                    |
| [.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.html](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.html)                               | Contact sheet for this attempt’s screenshot captures                             |
| [.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.json](../.archify/architecture-system-overview-20261001-150322/visual-check/system-overview.visual-check.json)                               | Capture receipt with exact artifact and screenshot identities                    |
| [.archify/index.html](../.archify/index.html)                                                                                                                                                                                                 | Start page linking the three interactive maps                                    |
| [.archify/sequence-saved-workflow-20261001-150322/candidate.json](../.archify/sequence-saved-workflow-20261001-150322/candidate.json)                                                                                                         | Editable diagram structure, wording, geometry and committed source references    |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.browser-check.json](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.browser-check.json)                                                 | Automated browser measurements bound to exact HTML bytes                         |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.finalize-summary.json](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.finalize-summary.json)                                           | Compact validation and delivery result for this attempt                          |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.finalize.json](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.finalize.json)                                                           | Detailed validation and delivery result for this attempt                         |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.1440x900.dark.png](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.1440x900.dark.png)                         | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.1440x900.light.png](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.1440x900.light.png)                       | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.2048x1320.dark.png](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.2048x1320.dark.png)                       | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.2048x1320.light.png](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.2048x1320.light.png)                     | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.html](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.html)                                                   | Contact sheet for this attempt’s screenshot captures                             |
| [.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.json](../.archify/sequence-saved-workflow-20261001-150322/review-2/saved-workflow.visual-check.json)                                                   | Capture receipt with exact artifact and screenshot identities                    |
| [.archify/sequence-saved-workflow-20261001-150322/saved-workflow.browser-check.json](../.archify/sequence-saved-workflow-20261001-150322/saved-workflow.browser-check.json)                                                                   | Automated browser measurements bound to exact HTML bytes                         |
| [.archify/sequence-saved-workflow-20261001-150322/saved-workflow.delivery.json](../.archify/sequence-saved-workflow-20261001-150322/saved-workflow.delivery.json)                                                                             | Current generated HTML provenance and hashes                                     |
| [.archify/sequence-saved-workflow-20261001-150322/saved-workflow.finalize-summary.json](../.archify/sequence-saved-workflow-20261001-150322/saved-workflow.finalize-summary.json)                                                             | Compact validation and delivery result for this attempt                          |
| [.archify/sequence-saved-workflow-20261001-150322/saved-workflow.finalize.json](../.archify/sequence-saved-workflow-20261001-150322/saved-workflow.finalize.json)                                                                             | Detailed validation and delivery result for this attempt                         |
| [.archify/sequence-saved-workflow-20261001-150322/saved-workflow.html](../.archify/sequence-saved-workflow-20261001-150322/saved-workflow.html)                                                                                               | Self-contained interactive system map                                            |
| [.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.1440x900.dark.png](../.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.1440x900.dark.png)                 | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.1440x900.light.png](../.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.1440x900.light.png)               | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.2048x1320.dark.png](../.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.2048x1320.dark.png)               | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.2048x1320.light.png](../.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.2048x1320.light.png)             | Captured viewport and theme for visual review                                    |
| [.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.html](../.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.html)                                           | Contact sheet for this attempt’s screenshot captures                             |
| [.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.json](../.archify/sequence-saved-workflow-20261001-150322/visual-check/saved-workflow.visual-check.json)                                           | Capture receipt with exact artifact and screenshot identities                    |
| [.archify/workflow-sina-mkoro-20261001-150322/candidate.json](../.archify/workflow-sina-mkoro-20261001-150322/candidate.json)                                                                                                                 | Editable diagram structure, wording, geometry and committed source references    |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.browser-check.json](../.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.browser-check.json)                                                                 | Automated browser measurements bound to exact HTML bytes                         |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.finalize-summary.json](../.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.finalize-summary.json)                                                           | Compact validation and delivery result for this attempt                          |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.finalize.json](../.archify/workflow-sina-mkoro-20261001-150322/review-2/sina-mkoro.finalize.json)                                                                           | Detailed validation and delivery result for this attempt                         |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.1440x900.dark.png](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.1440x900.dark.png)               | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.1440x900.light.png](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.1440x900.light.png)             | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.2048x1320.dark.png](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.2048x1320.dark.png)             | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.2048x1320.light.png](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.2048x1320.light.png)           | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.html](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.html)                                         | Contact sheet for this attempt’s screenshot captures                             |
| [.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.json](../.archify/workflow-sina-mkoro-20261001-150322/review-2/visual-check/sina-mkoro.visual-check.json)                                         | Capture receipt with exact artifact and screenshot identities                    |
| [.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.browser-check.json](../.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.browser-check.json)                                                                                   | Automated browser measurements bound to exact HTML bytes                         |
| [.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.delivery.json](../.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.delivery.json)                                                                                             | Current generated HTML provenance and hashes                                     |
| [.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.finalize-summary.json](../.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.finalize-summary.json)                                                                             | Compact validation and delivery result for this attempt                          |
| [.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.finalize.json](../.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.finalize.json)                                                                                             | Detailed validation and delivery result for this attempt                         |
| [.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.html](../.archify/workflow-sina-mkoro-20261001-150322/sina-mkoro.html)                                                                                                               | Self-contained interactive system map                                            |
| [.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.1440x900.dark.png](../.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.1440x900.dark.png)                                 | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.1440x900.light.png](../.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.1440x900.light.png)                               | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.2048x1320.dark.png](../.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.2048x1320.dark.png)                               | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.2048x1320.light.png](../.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.2048x1320.light.png)                             | Captured viewport and theme for visual review                                    |
| [.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.html](../.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.html)                                                           | Contact sheet for this attempt’s screenshot captures                             |
| [.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.json](../.archify/workflow-sina-mkoro-20261001-150322/visual-check/sina-mkoro.visual-check.json)                                                           | Capture receipt with exact artifact and screenshot identities                    |
| [docs/archify-pilot.md](../docs/archify-pilot.md)                                                                                                                                                                                             | Pilot scope, semantic explanation, verification, regeneration and file inventory |
