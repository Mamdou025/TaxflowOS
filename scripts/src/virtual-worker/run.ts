/**
 * AI virtual worker — Claude drives a real browser through TaxflowOS like a
 * diligent fiscalist + QA tester: it navigates pages, tries to do real work,
 * asks Sina Canadian-tax questions, and reports anything broken, wrong, or
 * confusing. Findings + screenshots are written to a timestamped report folder.
 *
 * Setup (once):
 *   pnpm --filter @workspace/scripts add @anthropic-ai/sdk playwright
 *   pnpm --filter @workspace/scripts exec playwright install chromium
 *   # add ANTHROPIC_API_KEY=... to .env.local  (get one at console.anthropic.com)
 *
 * Run (app must be up — e.g. `docker compose up`):
 *   pnpm --filter @workspace/scripts virtual-worker -- --persona explorer
 *   pnpm --filter @workspace/scripts virtual-worker -- --persona tax-qa --max-steps 50
 *   pnpm --filter @workspace/scripts virtual-worker -- --base http://localhost:5173 --headless
 *   pnpm --filter @workspace/scripts virtual-worker -- --list
 */
import Anthropic from '@anthropic-ai/sdk';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
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
        if (f.screenshot) lines.push(`  - _Screenshot:_ \`${f.screenshot}\``);
      }
      lines.push('');
    }
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
    JSON.stringify({ persona: persona.name, meta, findings, errors }, null, 2),
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
- click: click an element by its visible text / accessible name (e.g. "Run", "Documents", "New workflow").
- type: type into an input identified by its placeholder/label/nearby text; set submit=true to press Enter.
- ask_sina: type a message into the Sina chat, send it, and read the answer. Use this to ask real tax questions and to test features conversationally.
- report_finding: record a problem the moment you notice it. Use severity: blocker (app unusable/crash), high (a core feature is broken or the AI gives a clearly WRONG tax answer), medium (feature partly works / confusing / missing feedback), low (cosmetic/minor), question (something you suspect is wrong but can't confirm — e.g. a tax answer you'd want a human to verify).
- finish: end the run with a short summary of what you tested and the overall health.

How to judge Sina's answers: you are a tax expert. If an answer is factually wrong, invents rules or numbers, dodges the question, or is dangerously vague for a Canadian corporate-tax context, report it (high if clearly wrong, question if you're unsure). Quote the specific claim in the finding.

Operating notes:
- You are operating autonomously — the user is NOT watching and cannot answer questions. Never ask for permission or confirmation; just take the next reasonable action. Reversible UI actions (clicking, typing, navigating) are always fine.
- Prefer doing over narrating. Take real actions with the tools rather than describing what you would do.
- When something is broken or an answer is wrong, call report_finding immediately (don't wait until the end). Ground every finding in something you actually observed — what you did and what happened.
- Watch the "new errors" section in snapshots and tool results; a console/page/network error after an action is usually worth a finding.
- Work through your mission, then call finish. If you're running low on steps, wrap up and call finish with what you found.`;

// --------------------------------------------------------------------------
// Tool definitions (raw JSON schema for the Anthropic SDK)
// --------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'snapshot',
    description:
      'Look at the current page: returns URL, title, an accessibility outline of interactable elements, and any errors captured since the last look.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'navigate',
    description: 'Navigate to a path (e.g. "/t1134") or a full URL.',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Path like "/documents" or a full URL.' } },
      required: ['path'],
    },
  },
  {
    name: 'click',
    description:
      'Click an element by its visible text or accessible name (e.g. a button label, link, tab, or menu item). You can also pass a CSS selector.',
    input_schema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Visible text / accessible name of the element, or a CSS selector.' },
        why: { type: 'string', description: 'Briefly, what you expect this to do.' },
      },
      required: ['target'],
    },
  },
  {
    name: 'type',
    description: 'Type text into an input identified by its placeholder, label, or nearby text.',
    input_schema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Placeholder/label/name of the input.' },
        text: { type: 'string', description: 'The text to type.' },
        submit: { type: 'boolean', description: 'Press Enter after typing.' },
      },
      required: ['target', 'text'],
    },
  },
  {
    name: 'ask_sina',
    description: 'Send a message to the Sina chat assistant and return its answer. Use on a page that has the chat (e.g. "/").',
    input_schema: {
      type: 'object',
      properties: { message: { type: 'string', description: 'The question or request for Sina.' } },
      required: ['message'],
    },
  },
  {
    name: 'report_finding',
    description: 'Record a problem you observed (broken feature, error, wrong/hallucinated tax answer, or confusing UX).',
    input_schema: {
      type: 'object',
      properties: {
        severity: { type: 'string', enum: ['blocker', 'high', 'medium', 'low', 'question'] },
        category: { type: 'string', description: 'Short tag, e.g. "crash", "ai-accuracy", "ux", "dead-button", "empty-state".' },
        title: { type: 'string', description: 'One-line summary of the problem.' },
        detail: { type: 'string', description: 'What you did and what went wrong.' },
        expected: { type: 'string', description: 'What a correct/working result would be.' },
        actual: { type: 'string', description: 'What actually happened (quote the AI answer or error if relevant).' },
      },
      required: ['severity', 'category', 'title', 'detail'],
    },
  },
  {
    name: 'finish',
    description: 'End the run with a short overall summary of what you tested and the app health.',
    input_schema: {
      type: 'object',
      properties: { summary: { type: 'string', description: 'Overall summary.' } },
      required: ['summary'],
    },
  },
];

// --------------------------------------------------------------------------
// Tool execution
// --------------------------------------------------------------------------

function formatErrors(errors: CapturedError[]): string {
  if (errors.length === 0) return '';
  return `\n--- New errors since last action (${errors.length}) ---\n${errors
    .map((e) => `[${e.kind}] ${e.detail}`)
    .join('\n')}`;
}

interface RunState {
  findings: Finding[];
  finished: boolean;
  summary: string;
}

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  harness: Harness,
  state: RunState,
  reportDir: string,
): Promise<{ result: string; isError: boolean }> {
  try {
    switch (name) {
      case 'snapshot': {
        const snap = await harness.snapshot();
        return { result: snap + formatErrors(harness.drainErrors()), isError: false };
      }
      case 'navigate': {
        const msg = await harness.goto(String(input.path ?? '/'));
        return { result: msg + formatErrors(harness.drainErrors()), isError: false };
      }
      case 'click': {
        const msg = await harness.click(String(input.target ?? ''));
        return { result: msg + formatErrors(harness.drainErrors()), isError: false };
      }
      case 'type': {
        const msg = await harness.typeInto(
          String(input.target ?? ''),
          String(input.text ?? ''),
          Boolean(input.submit),
        );
        return { result: msg + formatErrors(harness.drainErrors()), isError: false };
      }
      case 'ask_sina': {
        const answer = await harness.askSina(String(input.message ?? ''));
        return {
          result: `Sina replied:\n${answer}${formatErrors(harness.drainErrors())}`,
          isError: false,
        };
      }
      case 'report_finding': {
        const id = state.findings.length + 1;
        const severity = (String(input.severity ?? 'medium') as Severity);
        const shot = await harness.screenshot(`finding-${id}.png`);
        const finding: Finding = {
          id,
          severity: SEVERITY_ORDER.includes(severity) ? severity : 'medium',
          category: String(input.category ?? 'general'),
          title: String(input.title ?? '(untitled)'),
          detail: String(input.detail ?? ''),
          expected: input.expected ? String(input.expected) : undefined,
          actual: input.actual ? String(input.actual) : undefined,
          screenshot: shot ? `finding-${id}.png` : undefined,
        };
        state.findings.push(finding);
        console.log(`  ⚑ finding #${id} [${finding.severity}] ${finding.title}`);
        return { result: `Logged finding #${id}.`, isError: false };
      }
      case 'finish': {
        state.finished = true;
        state.summary = String(input.summary ?? '');
        return { result: 'Run finished.', isError: false };
      }
      default:
        return { result: `Unknown tool: ${name}`, isError: true };
    }
  } catch (e) {
    return { result: `Tool "${name}" threw: ${(e as Error).message}`, isError: true };
  }
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

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      [
        'ANTHROPIC_API_KEY is not set.',
        'The virtual worker uses Claude to drive the browser.',
        'Add this line to your .env.local (get a key at https://console.anthropic.com):',
        '',
        '  ANTHROPIC_API_KEY=sk-ant-...',
        '',
      ].join('\n'),
    );
    process.exit(1);
  }

  const personaName = flag('persona') ?? 'explorer';
  const persona = getPersona(personaName);
  if (!persona) {
    console.error(`Unknown persona "${personaName}". Run with --list to see options.`);
    process.exit(1);
    return;
  }

  const base = flag('base') ?? process.env.WORKER_BASE_URL ?? 'http://localhost:5173';
  const maxSteps = Number(flag('max-steps') ?? process.env.WORKER_MAX_STEPS ?? 40);
  const model = flag('model') ?? process.env.WORKER_MODEL ?? 'claude-opus-4-8';
  const effort = flag('effort') ?? process.env.WORKER_EFFORT ?? 'medium';
  const headless = boolFlag('headless') || process.env.WORKER_HEADLESS === '1';

  const startedAt = new Date().toISOString();
  const stamp = startedAt.replace(/[:.]/g, '-');
  const here = dirname(fileURLToPath(import.meta.url));
  // scripts/src/virtual-worker -> scripts/virtual-worker/reports/<stamp>
  const reportDir = resolve(here, '..', '..', 'virtual-worker', 'reports', `${persona.name}-${stamp}`);
  mkdirSync(reportDir, { recursive: true });

  console.log(`\n▶ Virtual worker — persona "${persona.name}" against ${base}`);
  console.log(`  model=${model} effort=${effort} maxSteps=${maxSteps} headless=${headless}`);
  console.log(`  report: ${reportDir}\n`);

  const harness = await createHarness({ baseUrl: base, headless, screenshotDir: reportDir });
  const client = new Anthropic();
  const state: RunState = { findings: [], finished: false, summary: '' };

  let stepsUsed = 0;
  try {
    await harness.goto('/');
    const firstSnap = await harness.snapshot();

    const messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content:
          `MISSION (persona: ${persona.title}):\n${persona.mission}\n\n` +
          `You are starting on the home page. Here is the initial snapshot:\n\n${firstSnap}\n\n` +
          `Begin. Use the tools to carry out the mission, report problems as you find them, and call finish when done.`,
      },
    ];

    for (let step = 0; step < maxSteps && !state.finished; step += 1) {
      stepsUsed = step + 1;

      const request: Record<string, unknown> = {
        model,
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
        thinking: { type: 'adaptive' },
        output_config: { effort },
      };

      let res: Anthropic.Message;
      try {
        res = await client.messages.create(
          request as unknown as Anthropic.MessageCreateParamsNonStreaming,
        );
      } catch (e) {
        console.error(`  ! model call failed on step ${stepsUsed}: ${(e as Error).message}`);
        break;
      }

      // Echo the assistant turn (including thinking blocks) back for the next request.
      messages.push({
        role: 'assistant',
        content: res.content as unknown as Anthropic.ContentBlockParam[],
      });

      // Surface any text the model produced this step.
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join(' ')
        .trim();
      if (text) console.log(`  · step ${stepsUsed}: ${text.slice(0, 160)}`);

      if (res.stop_reason !== 'tool_use') {
        // Model stopped without calling a tool — treat its text as the summary.
        if (!state.summary && text) state.summary = text;
        break;
      }

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of res.content) {
        if (block.type !== 'tool_use') continue;
        const { result, isError } = await executeTool(
          block.name,
          (block.input ?? {}) as Record<string, unknown>,
          harness,
          state,
          reportDir,
        );
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
          is_error: isError,
        });
      }
      messages.push({ role: 'user', content: toolResults });
    }

    await harness.screenshot('end.png');
  } finally {
    const finishedAt = new Date().toISOString();
    writeReport(
      reportDir,
      persona,
      {
        base,
        model,
        effort,
        stepsUsed,
        maxSteps,
        startedAt,
        finishedAt,
        summary: state.summary,
      },
      state.findings,
      harness.allErrors(),
    );
    await harness.close();

    const bySev = SEVERITY_ORDER.map(
      (s) => `${s}: ${state.findings.filter((f) => f.severity === s).length}`,
    ).join('  ');
    console.log(`\n✔ Done. ${state.findings.length} findings (${bySev}).`);
    console.log(`  Report: ${resolve(reportDir, 'report.md')}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
