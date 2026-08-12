/**
 * AI virtual worker — an LLM drives a real browser through TaxflowOS like a
 * diligent fiscalist + QA tester: it navigates pages, tries to do real work,
 * asks Sina Canadian-tax questions, and reports anything broken, wrong, or
 * confusing. Findings + screenshots are written to a timestamped report folder.
 *
 * The model runs through the Vercel AI Gateway (the same path the Agent Lab uses),
 * so it reuses your existing AI_GATEWAY_API_KEY — no separate key needed. The
 * default model is Claude Opus via the gateway; override with --model to any
 * "provider/model" id the gateway serves (e.g. anthropic/claude-sonnet-5).
 *
 * Setup (once):
 *   pnpm --filter @workspace/scripts exec playwright install chromium
 *   # AI_GATEWAY_API_KEY must be in .env.local (it already is — the app uses it)
 *
 * Run (app must be up — e.g. `docker compose up`):
 *   pnpm --filter @workspace/scripts virtual-worker -- --persona explorer
 *   pnpm --filter @workspace/scripts virtual-worker -- --persona tax-qa --max-steps 50
 *   pnpm --filter @workspace/scripts virtual-worker -- --model anthropic/claude-sonnet-5 --headless
 *   pnpm --filter @workspace/scripts virtual-worker -- --list
 */
import {
  generateText,
  generateObject,
  stepCountIs,
  hasToolCall,
  jsonSchema,
  tool,
  type ModelMessage,
  type ToolSet,
} from 'ai';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { loadEnvLocal } from './env';
import { createHarness, type CapturedError, type Harness } from './browser';
import { PERSONAS, getPersona, type Persona } from './personas';

// --------------------------------------------------------------------------
// CLI args
// --------------------------------------------------------------------------

const argv = process.argv.slice(2);

function flag(name: string): string | undefined {
  const withEq = argv.find((a) => a.startsWith(`--${name}=`));
  if (withEq) return withEq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return undefined;
}
function boolFlag(name: string): boolean {
  return argv.includes(`--${name}`);
}

// --------------------------------------------------------------------------
// Finding model + report
// --------------------------------------------------------------------------

type Severity = 'blocker' | 'high' | 'medium' | 'low' | 'question';

interface Finding {
  id: number;
  severity: Severity;
  category: string;
  title: string;
  detail: string;
  expected?: string;
  actual?: string;
  screenshot?: string;
  /** Set by the optional judge pass. */
  verdict?: string;
  judgeNote?: string;
}

const SEVERITY_ORDER: Severity[] = ['blocker', 'high', 'medium', 'low', 'question'];
const SEVERITY_EMOJI: Record<Severity, string> = {
  blocker: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '⚪',
  question: '❓',
};

function writeReport(
  reportDir: string,
  persona: Persona,
  meta: {
    base: string;
    model: string;
    effort: string;
    stepsUsed: number;
    maxSteps: number;
    startedAt: string;
    finishedAt: string;
    summary: string;
  },
  findings: Finding[],
  ledger: LedgerEntry[],
  goals: GoalEntry[],
  errors: CapturedError[],
): void {
  const lines: string[] = [];
  lines.push(`# Virtual worker run — ${persona.title}`);
  lines.push('');
  lines.push(`- **Persona:** \`${persona.name}\``);
  lines.push(`- **Base URL:** ${meta.base}`);
  lines.push(`- **Model:** ${meta.model} (effort: ${meta.effort})`);
  lines.push(`- **Steps used:** ${meta.stepsUsed}/${meta.maxSteps}`);
  lines.push(`- **Started:** ${meta.startedAt}`);
  lines.push(`- **Finished:** ${meta.finishedAt}`);
  lines.push(`- **Findings:** ${findings.length}  ·  **Captured errors:** ${errors.length}`);
  lines.push('');
  lines.push('## Agent summary');
  lines.push('');
  lines.push(meta.summary.trim() || '_(no explicit summary — the run ended on the step budget)_');
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (findings.length === 0) {
    lines.push('_No findings reported._');
    lines.push('');
  } else {
    for (const sev of SEVERITY_ORDER) {
      const group = findings.filter((f) => f.severity === sev);
      if (group.length === 0) continue;
      lines.push(`### ${SEVERITY_EMOJI[sev]} ${sev.toUpperCase()} (${group.length})`);
      lines.push('');
      for (const f of group) {
        lines.push(`- **[#${f.id}] ${f.title}**  _(${f.category})_`);
        lines.push(`  - ${f.detail}`);
        if (f.expected) lines.push(`  - _Expected:_ ${f.expected}`);
        if (f.actual) lines.push(`  - _Actual:_ ${f.actual}`);
        if (f.verdict) lines.push(`  - _Judge:_ **${f.verdict}**${f.judgeNote ? ` — ${f.judgeNote}` : ''}`);
        if (f.screenshot) lines.push(`  - _Screenshot:_ \`${f.screenshot}\``);
      }
      lines.push('');
    }
  }
  lines.push('## Provenance ledger (data → origin)');
  lines.push('');
  lines.push('_The worker\'s ground truth: each value it captured and where it came from._');
  lines.push('');
  if (ledger.length === 0) {
    lines.push('_No data lineage recorded._');
  } else {
    for (const d of ledger) {
      lines.push(`- **${d.label}** = \`${d.value}\`  ← _${d.source}_${d.note ? `  (${d.note})` : ''}`);
    }
  }
  lines.push('');

  const openGoals = goals.filter((g) => !g.done);
  if (openGoals.length > 0) {
    lines.push('## ⚠️ Unfinished work at end');
    lines.push('');
    lines.push('_The worker opened these and did not close them — it ran out of steps or got stuck._');
    lines.push('');
    for (const g of openGoals) lines.push(`- ${g.text}`);
    lines.push('');
  }

  lines.push('## Captured browser errors');
  lines.push('');
  if (errors.length === 0) {
    lines.push('_None._');
  } else {
    for (const e of errors) lines.push(`- \`[${e.kind}]\` ${e.detail}`);
  }
  lines.push('');

  writeFileSync(resolve(reportDir, 'report.md'), lines.join('\n'), 'utf8');
  writeFileSync(
    resolve(reportDir, 'findings.json'),
    JSON.stringify({ persona: persona.name, meta, findings, ledger, goals, errors }, null, 2),
    'utf8',
  );
}

// --------------------------------------------------------------------------
// System prompt
// --------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an autonomous QA tester and experienced Canadian corporate-tax fiscalist, testing a web app called TaxflowOS by driving a real browser. TaxflowOS helps Canadian tax professionals run corporate-tax workflows (T1134 foreign affiliate reporting, surplus calculations, FAPI, document management) and includes an AI assistant named "Sina" (a chat). The app may respond in English or French — both are fine.

Your job: behave like a real, curious fiscalist doing real work, and surface anything that is BROKEN, WRONG, or CONFUSING. This is testing, not a demo — poke at things, try to actually accomplish tasks, and be skeptical of what the AI tells you.

You have these tools:
- snapshot: look at the current page (URL, title, accessibility outline, and any new errors). Call this after navigating or acting when you're unsure what's on screen.
- navigate: go to a path like "/t1134" or "/".
- click: click an element by its visible text / accessible name (e.g. "Run", "Documents", "New workflow"). The result tells you whether the click navigated, opened a dialog, changed the page, or did NOTHING — treat "NO visible change (possible dead button)" as a candidate dead button to verify and report.
- type: type into an input identified by its placeholder/label/nearby text; set submit=true to press Enter.
- drag: move an element (e.g. a workflow block/node) by a pixel offset (dx/dy) or onto another element (to). Use it to reposition or reorder blocks in the builder.
- upload_document: upload a document to test the Documents upload + RAG flow. With no arguments it uploads a bundled SAMPLE company tax file (Northwind Fiscal Holdings Inc. / foreign affiliate Northwind Ireland Ltd. / project code PROJECT-BOREALIS-2024 / exempt surplus CAD 1,250,000 / FAPI CAD 87,500). Pass "trigger" = the upload button's label if the file input is hidden behind a button.
- ask_sina: type a message into the Sina chat, send it, and read the answer. Use this to ask real tax questions and to test features conversationally.
- read_workflow: read the builder canvas — lists the blocks (type + label) and connections — so you can verify a workflow was built correctly and check block accuracy.
- reload: reload the page to test that a saved chat / workflow actually persisted (then snapshot to confirm it's still there).
- api_get: read-only GET to the app's OWN backend API using the current session (e.g. "/api/documents", "/api/healthz"). This is your backend GROUND TRUTH — use it to confirm that what the UI or chat claims is really stored server-side. If the UI shows something the backend can't confirm, report it.
- note: record a data VALUE and its ORIGIN (document / chat reply / workflow output) into your provenance ledger. Do this whenever you carry a value from one place to another — it is your proof of where each piece of data came from.
- goal: track work you have OPENED and must finish (action "open" / "done"). It reminds you of everything still open so you never abandon unfinished work.
- report_finding: record a problem the moment you notice it. Use severity: blocker (app unusable/crash), high (a core feature is broken or the AI gives a clearly WRONG tax answer), medium (feature partly works / confusing / missing feedback), low (cosmetic/minor), question (something you suspect is wrong but can't confirm — e.g. a tax answer you'd want a human to verify).
- finish: end the run with a short summary of what you tested and the overall health.

How to judge Sina's answers: you are a tax expert. If an answer is factually wrong, invents rules or numbers, dodges the question, or is dangerously vague for a Canadian corporate-tax context, report it (high if clearly wrong, question if you're unsure). Quote the specific claim in the finding.

Operating notes:
- You are operating autonomously — the user is NOT watching and cannot answer questions. Never ask for permission or confirmation; just take the next reasonable action. Reversible UI actions (clicking, typing, navigating) are always fine.
- Prefer doing over narrating. Take real actions with the tools rather than describing what you would do.
- When you enter values into a calculator/worksheet, work out the correct result YOURSELF first (you are a tax expert) and compare it to what the app outputs — report any mismatch (high), and report a tool that produces no output at all (medium).
- Work is NOT linear. It is fine — even expected — to interrupt a workflow to ask a question, start a second workflow, then return. But OPEN a goal for anything unfinished, and always come back to finish your open goals before you call finish. Sometimes take an unexpected path (an odd click, a back-navigation, a strange input) to try to break things — then recover and continue your real work.
- Proof matters. Whenever you take a number or fact from a document or a chat reply and use it somewhere (a workflow input, a second workflow), record it with note (value + source). At the end, TEST traceability: ask the chat / the app to tell you where a value came from and compare it against your ledger — if the app cannot trace a value back to its origin, report it (that is a real limitation).
- When something is broken or an answer is wrong, call report_finding immediately (don't wait until the end). Ground every finding in something you actually observed — what you did and what happened.
- Watch the "new errors" section in snapshots and tool results; a console/page/network error after an action is usually worth a finding.
- Work through your mission, then call finish. If you're running low on steps, wrap up and call finish with what you found.`;

// --------------------------------------------------------------------------
// Tools (AI SDK ToolSet — each execute drives the browser and returns a string)
// --------------------------------------------------------------------------

function formatErrors(errors: CapturedError[]): string {
  if (errors.length === 0) return '';
  return `\n--- New errors since last action (${errors.length}) ---\n${errors
    .map((e) => `[${e.kind}] ${e.detail}`)
    .join('\n')}`;
}

/** A data value the worker captured, with where it came from (provenance ground truth). */
interface LedgerEntry {
  label: string;
  value: string;
  source: string;
  note?: string;
}

/** A piece of work the worker has opened and must come back to finish. */
interface GoalEntry {
  text: string;
  done: boolean;
}

interface RunState {
  findings: Finding[];
  ledger: LedgerEntry[];
  goals: GoalEntry[];
  finished: boolean;
  summary: string;
}

interface ReportFindingInput {
  severity: string;
  category: string;
  title: string;
  detail: string;
  expected?: string;
  actual?: string;
}

function buildTools(
  harness: Harness,
  state: RunState,
  reportDir: string,
  sampleDoc: string,
): ToolSet {
  const withErrors = (msg: string): string => msg + formatErrors(harness.drainErrors());

  return {
    snapshot: tool({
      description:
        'Look at the current page: URL, title, an accessibility outline of interactable elements, and any errors captured since the last look.',
      inputSchema: jsonSchema<Record<string, never>>({
        type: 'object',
        properties: {},
        additionalProperties: false,
      }),
      execute: async () => withErrors(await harness.snapshot()),
    }),

    navigate: tool({
      description: 'Navigate to a path (e.g. "/t1134") or a full URL.',
      inputSchema: jsonSchema<{ path: string }>({
        type: 'object',
        properties: { path: { type: 'string', description: 'Path like "/documents" or a full URL.' } },
        required: ['path'],
        additionalProperties: false,
      }),
      execute: async ({ path }) => withErrors(await harness.goto(path)),
    }),

    click: tool({
      description:
        'Click an element by its visible text or accessible name (button, link, tab, menu item). A CSS selector also works.',
      inputSchema: jsonSchema<{ target: string; why?: string }>({
        type: 'object',
        properties: {
          target: { type: 'string', description: 'Visible text / accessible name, or a CSS selector.' },
          why: { type: 'string', description: 'Briefly, what you expect this to do.' },
        },
        required: ['target'],
        additionalProperties: false,
      }),
      execute: async ({ target }) => withErrors(await harness.click(target)),
    }),

    type: tool({
      description: 'Type text into an input identified by its placeholder, label, or nearby text.',
      inputSchema: jsonSchema<{ target: string; text: string; submit?: boolean }>({
        type: 'object',
        properties: {
          target: { type: 'string', description: 'Placeholder/label/name of the input.' },
          text: { type: 'string', description: 'The text to type.' },
          submit: { type: 'boolean', description: 'Press Enter after typing.' },
        },
        required: ['target', 'text'],
        additionalProperties: false,
      }),
      execute: async ({ target, text, submit }) =>
        withErrors(await harness.typeInto(target, text, Boolean(submit))),
    }),

    drag: tool({
      description:
        'Drag an element (e.g. a workflow block/node) to move it — either by a pixel offset (dx/dy) or onto another element (to).',
      inputSchema: jsonSchema<{ target: string; dx?: number; dy?: number; to?: string }>({
        type: 'object',
        properties: {
          target: { type: 'string', description: 'The element to grab (visible text / accessible name / CSS selector).' },
          dx: { type: 'number', description: 'Horizontal pixels to move (optional).' },
          dy: { type: 'number', description: 'Vertical pixels to move (optional).' },
          to: { type: 'string', description: 'Optional: another element to drop onto instead of using dx/dy.' },
        },
        required: ['target'],
        additionalProperties: false,
      }),
      execute: async ({ target, dx, dy, to }) => withErrors(await harness.drag(target, { dx, dy, to })),
    }),

    upload_document: tool({
      description:
        'Upload a document to test the Documents upload + RAG flow. Defaults to the bundled sample company tax document. Pass "trigger" = the label of the upload button if the file input is hidden behind it.',
      inputSchema: jsonSchema<{ trigger?: string; path?: string }>({
        type: 'object',
        properties: {
          trigger: { type: 'string', description: 'Label of the button that opens the file picker (optional).' },
          path: { type: 'string', description: 'Absolute path to a file (optional; defaults to the sample document).' },
        },
        required: [],
        additionalProperties: false,
      }),
      execute: async ({ trigger, path }) => withErrors(await harness.uploadFile(path || sampleDoc, trigger)),
    }),

    ask_sina: tool({
      description:
        'Send a message to the Sina chat assistant and return its answer. Use on a page that has the chat (e.g. "/").',
      inputSchema: jsonSchema<{ message: string }>({
        type: 'object',
        properties: { message: { type: 'string', description: 'The question or request for Sina.' } },
        required: ['message'],
        additionalProperties: false,
      }),
      execute: async ({ message }) => withErrors(`Sina replied:\n${await harness.askSina(message)}`),
    }),

    read_workflow: tool({
      description:
        'Read the workflow-builder canvas: lists the blocks/nodes (type + label) and the number of connections. Use to verify a workflow was built correctly and to check block accuracy.',
      inputSchema: jsonSchema<Record<string, never>>({
        type: 'object',
        properties: {},
        additionalProperties: false,
      }),
      execute: async () => withErrors(await harness.readWorkflow()),
    }),

    reload: tool({
      description:
        'Reload the current page. Use to test that state (a saved chat, a built workflow) actually persisted — then snapshot to verify it is still there.',
      inputSchema: jsonSchema<Record<string, never>>({
        type: 'object',
        properties: {},
        additionalProperties: false,
      }),
      execute: async () => withErrors(await harness.reload()),
    }),

    api_get: tool({
      description:
        "Make a read-only GET request to the app's OWN backend API (using the current logged-in session) to check whether what the UI or chat SHOWS is actually stored server-side — your backend ground truth. Examples: \"/api/healthz\", \"/api/documents\". Use it to confirm an upload, a saved chat, or workflow data truly persisted, and to test data traceability. If the UI claims something the backend does not confirm, that's a real finding.",
      inputSchema: jsonSchema<{ path: string }>({
        type: 'object',
        properties: {
          path: { type: 'string', description: 'API path, e.g. "/api/documents" (or a full URL).' },
        },
        required: ['path'],
        additionalProperties: false,
      }),
      execute: async ({ path }) => withErrors(await harness.apiGet(path)),
    }),

    note: tool({
      description:
        'Record a DATA VALUE and where it came from (its origin) into your provenance ledger. Use this every time you take a number/fact from a document or a chat reply, or produce it as a workflow output, and again when you feed it somewhere. This ledger is your ground truth for testing whether the app can trace data back to its origin.',
      inputSchema: jsonSchema<{ label: string; value: string; source: string; note?: string }>({
        type: 'object',
        properties: {
          label: { type: 'string', description: 'What the value is, e.g. "exempt surplus".' },
          value: { type: 'string', description: 'The value itself, e.g. "1,250,000".' },
          source: { type: 'string', description: 'Where it came from, e.g. "document:sample", "chat:reply", "workflow A output block 3".' },
          note: { type: 'string', description: 'Optional: how you are using it downstream.' },
        },
        required: ['label', 'value', 'source'],
        additionalProperties: false,
      }),
      execute: async ({ label, value, source, note }) => {
        state.ledger.push({ label, value, source, note });
        return `Noted "${label}" = ${value} (from ${source}). Ledger has ${state.ledger.length} entr${state.ledger.length === 1 ? 'y' : 'ies'}.`;
      },
    }),

    goal: tool({
      description:
        'Track a piece of work you have OPENED and must come back to finish (e.g. "finish workflow A"). Call with action "open" when you start something, "done" when you complete it. The result reminds you of everything still open, so you do not forget unfinished work.',
      inputSchema: jsonSchema<{ action: string; text: string }>({
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['open', 'done'], description: 'open a new goal, or mark one done.' },
          text: { type: 'string', description: 'The goal, e.g. "finish workflow A: surplus calc".' },
        },
        required: ['action', 'text'],
        additionalProperties: false,
      }),
      execute: async ({ action, text }) => {
        if (action === 'done') {
          const g = state.goals.find((x) => !x.done && x.text.toLowerCase().includes(text.toLowerCase().slice(0, 12)));
          if (g) g.done = true;
          else state.goals.push({ text, done: true });
        } else {
          state.goals.push({ text, done: false });
        }
        const open = state.goals.filter((g) => !g.done).map((g) => `• ${g.text}`);
        return open.length
          ? `Open work you must still finish:\n${open.join('\n')}`
          : 'No open work remaining.';
      },
    }),

    report_finding: tool({
      description:
        'Record a problem you observed (broken feature, error, wrong/hallucinated tax answer, or confusing UX).',
      inputSchema: jsonSchema<ReportFindingInput>({
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'high', 'medium', 'low', 'question'] },
          category: { type: 'string', description: 'Short tag, e.g. "crash", "ai-accuracy", "ux", "dead-button".' },
          title: { type: 'string', description: 'One-line summary of the problem.' },
          detail: { type: 'string', description: 'What you did and what went wrong.' },
          expected: { type: 'string', description: 'What a correct/working result would be.' },
          actual: { type: 'string', description: 'What actually happened (quote the AI answer or error if relevant).' },
        },
        required: ['severity', 'category', 'title', 'detail'],
        additionalProperties: false,
      }),
      execute: async (input) => {
        const id = state.findings.length + 1;
        const severity = input.severity as Severity;
        const shot = await harness.screenshot(`finding-${id}.png`);
        const finding: Finding = {
          id,
          severity: SEVERITY_ORDER.includes(severity) ? severity : 'medium',
          category: input.category || 'general',
          title: input.title || '(untitled)',
          detail: input.detail || '',
          expected: input.expected || undefined,
          actual: input.actual || undefined,
          screenshot: shot ? `finding-${id}.png` : undefined,
        };
        state.findings.push(finding);
        console.log(`  ⚑ finding #${id} [${finding.severity}] ${finding.title}`);
        return `Logged finding #${id}.`;
      },
    }),

    finish: tool({
      description: 'End the run with a short overall summary of what you tested and the app health.',
      inputSchema: jsonSchema<{ summary: string }>({
        type: 'object',
        properties: { summary: { type: 'string', description: 'Overall summary.' } },
        required: ['summary'],
        additionalProperties: false,
      }),
      execute: async ({ summary }) => {
        state.finished = true;
        state.summary = summary || '';
        return 'Run finished.';
      },
    }),
  };
}

// --------------------------------------------------------------------------
// Interactive mode — answer questions about the live page / workflow / task
// --------------------------------------------------------------------------

const INTERACTIVE_SYSTEM = `You are a hands-on assistant embedded in a LIVE TaxflowOS browser session (a Canadian corporate-tax app with pages for T1134, surplus, FAPI, workflows, documents, and a chat assistant named "Sina"). A human is watching the same browser and asking you questions.

Answer questions about the CURRENT state by INSPECTING the live page — call snapshot to see the current URL, page title, and on-page elements BEFORE answering. Be concrete and concise:
- "current page" → name the route and what the page is for, plus the key things on it.
- "current workflow" → if a workflow/builder canvas is open, name it and list its blocks/nodes and connections; if none is open, say so.
- "current task" → describe what the app is set up to do here and what the user could do next.

You can also DRIVE the app when asked: navigate, click, type, drag blocks, upload the sample document, or ask Sina a question. After doing something, briefly say what happened. If asked to check/test the page you may log issues with report_finding, but here your main job is to answer clearly. Keep answers short unless asked for detail. Do not call finish.`;

async function runInteractive(opts: {
  base: string;
  model: string;
  effort: string;
  headless: boolean;
  here: string;
  sampleDoc: string;
}): Promise<void> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = resolve(opts.here, '..', '..', 'virtual-worker', 'reports', `interactive-${stamp}`);
  mkdirSync(reportDir, { recursive: true });

  console.log(`\n▶ Interactive worker — ${opts.base}  (model=${opts.model})`);
  const harness = await createHarness({
    baseUrl: opts.base,
    headless: opts.headless,
    screenshotDir: reportDir,
  });
  const state: RunState = { findings: [], ledger: [], goals: [], finished: false, summary: '' };
  const tools = buildTools(harness, state, reportDir, opts.sampleDoc);
  const providerOptions = opts.effort ? { anthropic: { effort: opts.effort } } : undefined;

  await harness.goto('/');
  console.log(
    [
      '',
      'The browser is open. Ask about the current page / workflow / task, or tell me to drive it.',
      'Examples:  "what page am I on?"   "what is this page for?"   "is a workflow open? what blocks?"',
      '           "go to /t1134 and tell me what I can do here"   "check this page for dead buttons"',
      'Type "exit" to quit.',
      '',
    ].join('\n'),
  );

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string): Promise<string> => new Promise((res) => rl.question(q, res));

  const messages: ModelMessage[] = [];
  try {
    for (;;) {
      const q = (await ask('you> ')).trim();
      if (!q) continue;
      if (['exit', 'quit', ':q'].includes(q.toLowerCase())) break;
      messages.push({ role: 'user', content: q });
      try {
        const result = await generateText({
          model: opts.model,
          system: INTERACTIVE_SYSTEM,
          tools,
          messages,
          stopWhen: stepCountIs(10),
          ...(providerOptions ? { providerOptions } : {}),
        });
        console.log(`\nworker> ${result.text || '(used tools; no text answer)'}\n`);
        messages.push(...(result.response.messages as ModelMessage[]));
      } catch (e) {
        console.error(`  ! ${(e as Error).message}\n`);
      }
    }
  } finally {
    rl.close();
    await harness.close();
    if (state.findings.length > 0) {
      const persona: Persona = { name: 'interactive', title: 'Interactive session', mission: '' };
      writeReport(
        reportDir,
        persona,
        {
          base: opts.base,
          model: opts.model,
          effort: opts.effort,
          stepsUsed: 0,
          maxSteps: 0,
          startedAt: stamp,
          finishedAt: new Date().toISOString(),
          summary: '',
        },
        state.findings,
        state.ledger,
        state.goals,
        harness.allErrors(),
      );
      console.log(`Saved ${state.findings.length} finding(s) to ${resolve(reportDir, 'report.md')}`);
    }
  }
}

// --------------------------------------------------------------------------
// Autonomous run (one persona)
// --------------------------------------------------------------------------

interface RunCtx {
  base: string;
  model: string;
  effort: string;
  headless: boolean;
  maxSteps: number;
  here: string;
  sampleDoc: string;
  judge: boolean;
}

/**
 * Optional second pass: a skeptical reviewer re-reads each finding and marks it
 * confirmed / plausible / false_positive, to cut noise from the non-deterministic run.
 * Mutates each finding in place with `verdict` + `judgeNote`.
 */
async function judgeFindings(model: string, findings: Finding[]): Promise<void> {
  const payload = findings.map((f) => ({
    id: f.id,
    severity: f.severity,
    title: f.title,
    detail: f.detail,
    expected: f.expected,
    actual: f.actual,
  }));

  const { object } = await generateObject({
    model,
    schema: jsonSchema<{
      verdicts: Array<{ id: number; verdict: string; reason: string }>;
    }>({
      type: 'object',
      properties: {
        verdicts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              verdict: { type: 'string', enum: ['confirmed', 'plausible', 'false_positive'] },
              reason: { type: 'string' },
            },
            required: ['id', 'verdict', 'reason'],
            additionalProperties: false,
          },
        },
      },
      required: ['verdicts'],
      additionalProperties: false,
    }),
    system:
      'You are a skeptical senior QA reviewer for a Canadian corporate-tax web app. For each reported finding, decide if it is a real defect. Be adversarial: default to "false_positive" when the evidence is weak, the behavior is plausibly correct, or the tester likely misunderstood the app. Use "confirmed" only when the detail clearly shows a real bug or a clearly wrong tax answer. Use "plausible" when it could be real but a human should check. Give a one-line reason for each.',
    prompt: `Findings to review:\n${JSON.stringify(payload, null, 2)}`,
  });

  const byId = new Map(object.verdicts.map((v) => [v.id, v]));
  for (const f of findings) {
    const v = byId.get(f.id);
    if (v) {
      f.verdict = v.verdict;
      f.judgeNote = v.reason;
    }
  }
}

// Keep the agent's RE-SENT context bounded so a long journey (100+ steps) doesn't grow the
// message history quadratically and exhaust the model/credit budget mid-run. Keep the first
// message (the mission) + the most recent turns; older turns are dropped — their findings are
// already captured in the report + provenance ledger, and the agent works from recent context
// plus its still-open goals (the goal tool re-lists them). Never start the window on an orphan
// tool result (an Anthropic tool_result must follow its assistant tool_use).
function windowMessages<T extends { role: string }>(messages: T[]): T[] {
  const KEEP = 24;
  if (messages.length <= KEEP + 1) return messages;
  const mission = messages[0];
  let tail = messages.slice(messages.length - KEEP);
  while (tail.length > 0 && tail[0].role === 'tool') tail = tail.slice(1);
  return [mission, ...tail];
}

async function runPersona(persona: Persona, ctx: RunCtx): Promise<number> {
  // deadclick needs breadth; the journey scenario is long and non-linear — give
  // each a bigger step budget if the caller didn't ask for more.
  const maxSteps =
    persona.name === 'deadclick'
      ? Math.max(ctx.maxSteps, 70)
      : persona.name === 'journey'
        ? Math.max(ctx.maxSteps, 120)
        : ctx.maxSteps;

  const startedAt = new Date().toISOString();
  const stamp = startedAt.replace(/[:.]/g, '-');
  const reportDir = resolve(ctx.here, '..', '..', 'virtual-worker', 'reports', `${persona.name}-${stamp}`);
  mkdirSync(reportDir, { recursive: true });

  console.log(`\n▶ Virtual worker — persona "${persona.name}" against ${ctx.base}`);
  console.log(`  model=${ctx.model} effort=${ctx.effort} maxSteps=${maxSteps} headless=${ctx.headless}`);
  console.log(`  report: ${reportDir}\n`);

  const harness = await createHarness({ baseUrl: ctx.base, headless: ctx.headless, screenshotDir: reportDir });
  const state: RunState = { findings: [], ledger: [], goals: [], finished: false, summary: '' };
  let stepsUsed = 0;

  try {
    await harness.goto('/');
    const firstSnap = await harness.snapshot();

    const messages: ModelMessage[] = [
      {
        role: 'user',
        content:
          `MISSION (persona: ${persona.title}):\n${persona.mission}\n\n` +
          `You are starting on the home page. Here is the initial snapshot:\n\n${firstSnap}\n\n` +
          `Begin. Use the tools to carry out the mission, report problems as you find them, and call finish when done.`,
      },
    ];

    // Anthropic models take the effort dial via providerOptions; ignored by others.
    const providerOptions = ctx.effort ? { anthropic: { effort: ctx.effort } } : undefined;

    const result = await generateText({
      model: ctx.model,
      system: SYSTEM_PROMPT,
      tools: buildTools(harness, state, reportDir, ctx.sampleDoc),
      messages,
      stopWhen: [stepCountIs(maxSteps), hasToolCall('finish')],
      prepareStep: ({ messages: msgs }) => ({ messages: windowMessages(msgs) }),
      ...(providerOptions ? { providerOptions } : {}),
      onStepFinish: (step) => {
        stepsUsed += 1;
        const text = (step.text ?? '').trim();
        const calls = step.toolCalls.map((c) => c.toolName).join(', ');
        console.log(
          `  · step ${stepsUsed}${calls ? ` [${calls}]` : ''}${text ? `: ${text.slice(0, 140)}` : ''}`,
        );
      },
    });

    if (!state.summary) state.summary = result.text ?? '';
    await harness.screenshot('end.png');
    const u = result.usage;
    if (u) console.log(`  tokens: in=${u.inputTokens ?? '?'} out=${u.outputTokens ?? '?'}`);
  } catch (e) {
    console.error(`  ! run failed: ${(e as Error).message}`);
    if (!state.summary) state.summary = `Run errored: ${(e as Error).message}`;
  } finally {
    const finishedAt = new Date().toISOString();
    if (ctx.judge && state.findings.length > 0) {
      console.log('  · judging findings…');
      try {
        await judgeFindings(ctx.model, state.findings);
      } catch (e) {
        console.error(`  ! judge failed: ${(e as Error).message}`);
      }
    }
    writeReport(
      reportDir,
      persona,
      {
        base: ctx.base,
        model: ctx.model,
        effort: ctx.effort,
        stepsUsed,
        maxSteps,
        startedAt,
        finishedAt,
        summary: state.summary,
      },
      state.findings,
      state.ledger,
      state.goals,
      harness.allErrors(),
    );
    await harness.close();

    const bySev = SEVERITY_ORDER.map(
      (s) => `${s}: ${state.findings.filter((f) => f.severity === s).length}`,
    ).join('  ');
    console.log(`\n✔ Done "${persona.name}". ${state.findings.length} findings (${bySev}).`);
    console.log(`  Report: ${resolve(reportDir, 'report.md')}\n`);
  }

  return state.findings.length;
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

async function main(): Promise<void> {
  if (boolFlag('list')) {
    console.log('Available personas:');
    for (const p of PERSONAS) console.log(`  ${p.name.padEnd(12)} ${p.title}`);
    return;
  }

  loadEnvLocal();

  if (!process.env.AI_GATEWAY_API_KEY) {
    console.error(
      [
        'AI_GATEWAY_API_KEY is not set.',
        'The virtual worker routes the model through the Vercel AI Gateway (same as the Agent Lab).',
        'Make sure your .env.local has:',
        '',
        '  AI_GATEWAY_API_KEY=vck_...',
        '',
        '(To use a Claude model directly instead, set --model to a bare id and provide that provider key.)',
      ].join('\n'),
    );
    process.exit(1);
  }

  const base = flag('base') ?? process.env.WORKER_BASE_URL ?? 'http://localhost:5173';
  const model = flag('model') ?? process.env.WORKER_MODEL ?? 'anthropic/claude-opus-4-8';
  const effort = flag('effort') ?? process.env.WORKER_EFFORT ?? 'medium';
  const headless = boolFlag('headless') || process.env.WORKER_HEADLESS === '1';
  const here = dirname(fileURLToPath(import.meta.url));
  // Bundled sample document the upload_document tool uploads by default.
  const sampleDoc = resolve(here, '..', '..', 'virtual-worker', 'fixtures', 'sample-company-tax-document.txt');

  // Interactive mode: open the app and answer questions about the current page /
  // workflow / task (and drive it on request) instead of running an autonomous test.
  if (boolFlag('interactive') || boolFlag('ask')) {
    await runInteractive({ base, model, effort, headless, here, sampleDoc });
    return;
  }

  const maxSteps = Number(flag('max-steps') ?? process.env.WORKER_MAX_STEPS ?? 40);
  const judge = boolFlag('judge');
  const ctx: RunCtx = { base, model, effort, headless, maxSteps, here, sampleDoc, judge };

  // Full suite: run every testing persona in sequence, each writing its own report.
  if (boolFlag('all')) {
    const suite = ['deadclick', 'calc', 'builder', 'documents', 'tax-qa'];
    console.log(`\n▶ Running the full suite (${suite.length} passes): ${suite.join(', ')}`);
    const totals: Array<{ name: string; findings: number }> = [];
    for (const name of suite) {
      const p = getPersona(name);
      if (!p) continue;
      const n = await runPersona(p, ctx);
      totals.push({ name, findings: n });
    }
    console.log('\n════════ Suite complete ════════');
    for (const t of totals) console.log(`  ${t.name.padEnd(12)} ${t.findings} findings`);
    console.log(`  Reports under: ${resolve(here, '..', '..', 'virtual-worker', 'reports')}\n`);
    return;
  }

  const personaName = flag('persona') ?? 'explorer';
  const persona = getPersona(personaName);
  if (!persona) {
    console.error(`Unknown persona "${personaName}". Run with --list to see options.`);
    process.exit(1);
    return;
  }
  await runPersona(persona, ctx);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
