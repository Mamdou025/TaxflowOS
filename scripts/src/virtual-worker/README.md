# AI virtual worker

An LLM (Claude) drives a **real Chromium browser** through TaxflowOS like a diligent
fiscalist + QA tester: it navigates pages, tries to do real work, asks **Sina**
Canadian-tax questions, and **reports anything broken, wrong, or confusing** —
including AI answers it judges to be incorrect or hallucinated.

Each run writes a folder under `scripts/virtual-worker/reports/<persona>-<timestamp>/`:

- `report.md` — findings grouped by severity + the agent's summary + captured browser errors
- `findings.json` — the same, machine-readable
- `finding-N.png`, `end.png` — screenshots

> This is **exploratory / discovery** testing (non-deterministic, uses tokens). Use it
> to find problems fast; harden the good findings into the deterministic Playwright
> suite under `e2e/` afterwards.

## Setup (once)

```bash
# 1. Install the two dependencies into the scripts package
pnpm --filter @workspace/scripts add @anthropic-ai/sdk playwright

# 2. Download the Chromium browser Playwright drives
pnpm --filter @workspace/scripts exec playwright install chromium

# 3. Add an Anthropic API key to the repo-root .env.local (get one at
#    https://console.anthropic.com). The worker uses Claude to drive the browser.
#    (This is separate from OPENAI_API_KEY / AI_GATEWAY_API_KEY, which the app uses.)
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local
```

## Run

The app must be running first (e.g. `docker compose up`) so the worker tests the
**real** app and the **real** Sina — not mocks.

```bash
# Explore the whole app (default persona)
pnpm --filter @workspace/scripts virtual-worker

# Stress-test Sina's tax answers
pnpm --filter @workspace/scripts virtual-worker -- --persona tax-qa

# Point at a different URL (e.g. your Replit deployment) and run headless
pnpm --filter @workspace/scripts virtual-worker -- --base https://your-app.repl.co --headless

# List personas
pnpm --filter @workspace/scripts virtual-worker -- --list
```

By default the browser is **visible** so you can watch it work — pass `--headless`
to hide it.

## Options

| Flag | Env var | Default | Meaning |
|---|---|---|---|
| `--persona <name>` | | `explorer` | Which persona/mission to run (`--list` to see all) |
| `--base <url>` | `WORKER_BASE_URL` | `http://localhost:5173` | App URL to test |
| `--max-steps <n>` | `WORKER_MAX_STEPS` | `40` | Max agent turns before it must wrap up |
| `--model <id>` | `WORKER_MODEL` | `claude-opus-4-8` | Claude model that drives the browser |
| `--effort <level>` | `WORKER_EFFORT` | `medium` | Reasoning effort (`low`/`medium`/`high`/`xhigh`) — higher = smarter, pricier |
| `--headless` | `WORKER_HEADLESS=1` | off | Hide the browser window |

## Personas

Personas live in [`personas.ts`](./personas.ts) — **edit them freely**. This is where
your fiscalists' expertise becomes reusable tests: add real Canadian corporate-tax
questions to the `tax-qa` mission and the worker will ask them and judge the answers.

- `explorer` — new fiscalist touring the whole app
- `tax-qa` — stress-tests Sina with Canadian corporate-tax questions and judges accuracy
- `documents` — document upload + RAG (`searchCompanyDocuments`)
- `workflows` — tries to run a real T1134 / surplus / FAPI workflow
- `chaos` — curious user poking at everything to see what breaks

## How it works

`run.ts` runs a Claude tool-use loop. Each turn Claude sees the page (accessibility
outline + any new console/page/network errors) and calls one of: `navigate`, `click`,
`type`, `ask_sina`, `snapshot`, `report_finding`, or `finish`. The browser plumbing
(resilient locators, the chat helper, error capture) is in [`browser.ts`](./browser.ts).
