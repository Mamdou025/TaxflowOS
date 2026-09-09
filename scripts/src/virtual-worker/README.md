# AI virtual worker

An LLM drives a **real Chromium browser** through TaxflowOS like a diligent
fiscalist + QA tester: it navigates pages, tries to do real work, asks **Sina**
Canadian-tax questions, and **reports anything broken, wrong, or confusing** —
including AI answers it judges to be incorrect or hallucinated.

The model runs through the **Vercel AI Gateway** (the same path the Agent Lab
uses), so it reuses your existing `AI_GATEWAY_API_KEY` — **no separate key needed**.
Default model: `anthropic/claude-opus-4-8` (Claude is much stronger at multi-step
browser navigation than GPT). Override with `--model <provider/model>`.

Each run writes a folder under `scripts/virtual-worker/reports/<persona>-<timestamp>/`:

- `report.md` — findings grouped by severity + the agent's summary + captured browser errors
- `findings.json` — the same, machine-readable
- `finding-N.png`, `end.png` — screenshots

> This is **exploratory / discovery** testing (non-deterministic, uses tokens). Use it
> to find problems fast; harden the good findings into the deterministic Playwright
> suite under `e2e/` afterwards.

## Setup (once)

```bash
# Download the Chromium browser Playwright drives
pnpm --filter @workspace/scripts exec playwright install chromium
```

That's it — `ai` and `playwright` are already dependencies, and `AI_GATEWAY_API_KEY`
is already in your `.env.local` (the app uses it). No Anthropic/OpenAI key of your own
is required; the gateway key reaches Claude and every other provider.

## Run

The app must be running first (e.g. `docker compose up`) so the worker tests the
**real** app and the **real** Sina — not mocks.

```bash
# Run the WHOLE suite (deadclick + calc + builder + documents + tax-qa), one after another
pnpm --filter @workspace/scripts virtual-worker -- --all

# Explore the whole app (default persona)
pnpm --filter @workspace/scripts virtual-worker

# Stress-test Sina's tax answers
pnpm --filter @workspace/scripts virtual-worker -- --persona tax-qa

# Cheaper model, headless, more steps
pnpm --filter @workspace/scripts virtual-worker -- --model anthropic/claude-sonnet-5 --headless --max-steps 60

# Point at a different URL (e.g. your Replit deployment)
pnpm --filter @workspace/scripts virtual-worker -- --base https://your-app.repl.co

# List personas
pnpm --filter @workspace/scripts virtual-worker -- --list
```

By default the browser is **visible** so you can watch it work — pass `--headless`
to hide it.

## Ask it about the live app (interactive mode)

Instead of an autonomous test, open the app and **talk to the worker** about what's on
screen. It inspects the live page and answers questions about the current page, the open
workflow, and what you can do there — and it'll drive the app when you ask.

```bash
pnpm --filter @workspace/scripts virtual-worker -- --interactive
```

Then type questions at the `you>` prompt:

```
you> what page am I on and what is it for?
you> go to /t1134 and tell me what I can do here
you> is a workflow open? what blocks does it have?
you> check this page for dead buttons
you> exit
```

It keeps conversation context, so follow-ups work. If it logs any issues during the
session, they're saved to a report on exit.

## Options

| Flag | Env var | Default | Meaning |
|---|---|---|---|
| `--persona <name>` | | `explorer` | Which persona/mission to run (`--list` to see all) |
| `--base <url>` | `WORKER_BASE_URL` | `http://localhost:5173` | App URL to test |
| `--max-steps <n>` | `WORKER_MAX_STEPS` | `40` | Max agent turns before it must wrap up |
| `--model <id>` | `WORKER_MODEL` | `anthropic/claude-opus-4-8` | Any gateway `provider/model` id (e.g. `anthropic/claude-sonnet-5`) |
| `--effort <level>` | `WORKER_EFFORT` | `medium` | Anthropic reasoning effort (`low`/`medium`/`high`/`xhigh`) — higher = smarter, pricier |
| `--headless` | `WORKER_HEADLESS=1` | off | Hide the browser window |
| `--judge` | | off | After the run, a skeptical second model re-reviews each finding and marks it **confirmed / plausible / false_positive** (cuts noise) |

## Personas

Personas live in [`personas.ts`](./personas.ts) — **edit them freely**. This is where
your fiscalists' expertise becomes reusable tests: add real Canadian corporate-tax
questions to the `tax-qa` mission and the worker will ask them and judge the answers.

- `journey` — the flagship: a full **non-linear** fiscalist task end-to-end — build a workflow, add a document, ask about it, feed document + chat values into the workflow, interrupt to start a second workflow and feed its result back into the first, verify blocks in the builder, ask the chat about the workflow, generate a UI, then reload and **test that every value can be traced to its origin**. Long + token-heavy (auto-uses ≥120 steps).
- `break` — adversarial: tries to **break the app** with invalid/extreme inputs, out-of-order actions, double-submits, mid-action reloads, off-canvas drags, etc.
- `deadclick` — clicks every control on every page to find **buttons that go nowhere** (run with a high `--max-steps`, e.g. 80)
- `calc` — enters values into the calculators/worksheets and **verifies the results are correct** (it works out the expected answer itself and compares)
- `builder` — **moves blocks around** (drag), adds keywords, runs them, and checks **each block's output**
- `documents` — uploads the bundled **sample document** and checks Sina retrieves its values (RAG)
- `explorer` — new fiscalist touring the whole app
- `tax-qa` — stress-tests Sina with Canadian corporate-tax questions and judges accuracy

The bundled sample document lives in [`../../virtual-worker/fixtures/`](../../virtual-worker/fixtures/) (a fictional Canadian corporate tax file with distinctive figures + keywords the `documents` persona quizzes Sina on).

## How it works

`run.ts` calls the AI SDK's `generateText` with a tool set and `stopWhen`, so the model
runs the whole agent loop: each step it sees the page (accessibility outline + any new
console/page/network errors) and calls a tool:

- **act / inspect:** `navigate`, `click` (reports whether it changed anything — that's how
  dead buttons are caught), `type`, `drag`, `upload_document`, `read_workflow` (reads the
  builder's blocks + connections), `reload`, `api_get` (read-only GET to the app's own
  backend, using the current session — **ground truth** for "is what the UI shows actually
  stored?"), `snapshot`, `ask_sina`.
- **track work + proof:** `note` (record a data value + its origin into a **provenance
  ledger**), `goal` (open/close units of work so it never abandons unfinished threads),
  `report_finding`, `finish`.

Pass `--judge` and a skeptical second model reviews every finding afterward, tagging each
**confirmed / plausible / false_positive** in the report so you're not chasing noise.

The provenance ledger and any unfinished goals are written into the report, so a non-linear
`journey` run leaves an auditable trail of what data came from where. The bare
`anthropic/claude-opus-4-8` model string routes through the Vercel AI Gateway via
`AI_GATEWAY_API_KEY`. The browser plumbing (resilient locators, drag, file upload, workflow
reading, the chat helper, error capture) is in [`browser.ts`](./browser.ts).
