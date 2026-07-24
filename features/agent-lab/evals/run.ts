// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — GOLDEN-CASE EVALS: the runner.
//
// Runs every case in cases.ts through the real agent with FISCAL MODE FORCED ON, then
// scores the answer against the non-negotiables. Makes real model calls (spends tokens),
// so it's a manual command, not part of the build.
//
//   pnpm agent-lab:evals                              # default model (OPENAI_CHAT_MODEL or gpt-4o)
//   pnpm agent-lab:evals --model anthropic/claude-opus-4-8   # test a specific model (needs AI_GATEWAY_API_KEY)
//   pnpm agent-lab:evals --verbose                   # also print each answer
//
// Exits non-zero if any check fails or any case errors — so it can gate CI / changes.
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';
import { config } from 'dotenv';
import type { ModelMessage } from 'ai';
import { EVAL_CASES } from './cases';
import { scoreCase, type CheckResult } from './score';
import { DEFAULT_FISCAL_CONTEXT, fiscalPreamble, type FiscalContext } from '../fiscal';

// Load .env.local BEFORE the agent module is imported (below, dynamically).
config({ path: path.resolve(process.cwd(), '.env.local') });

function arg(name: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) {
    return eq.split('=').slice(1).join('=');
  }
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
    return process.argv[i + 1];
  }
  return undefined;
}

async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY && !process.env.AI_GATEWAY_API_KEY) {
    console.error('Set OPENAI_API_KEY or AI_GATEWAY_API_KEY in .env.local to run the evals.');
    process.exit(1);
  }

  const model = arg('model') || process.env.AGENT_LAB_EVAL_MODEL || process.env.OPENAI_CHAT_MODEL || 'gpt-4o';
  const verbose = process.argv.includes('--verbose');

  // Dynamic import so dotenv has already populated process.env before the agent loads.
  const { runAgent } = await import('../agent');

  console.log(`\nAgent Lab — fiscal non-negotiable evals\nModel: ${model} · fiscal mode: ON · ${EVAL_CASES.length} case(s)\n`);

  let totalChecks = 0;
  let passedChecks = 0;
  let failedCases = 0;
  let erroredCases = 0;

  for (const c of EVAL_CASES) {
    const fiscal: FiscalContext = { ...DEFAULT_FISCAL_CONTEXT, ...(c.fiscal ?? {}) };
    const system = `You are a Canadian tax assistant supporting a fiscaliste. Answer the user's question, following the rules below.\n\n${fiscalPreamble(fiscal)}`;
    const messages: ModelMessage[] = [{ role: 'user', content: c.question }];

    let text = '';
    let toolsUsed: string[] = [];
    try {
      const res = await runAgent({ model, system, temperature: 0, maxSteps: 4, enabledTools: c.enabledTools ?? [], messages, documents: [], docMode: 'full' });
      if (res.error) {
        erroredCases++;
        console.log(`✗ ${c.id} — ERROR: ${res.error}\n`);
        continue;
      }
      text = res.text;
      toolsUsed = res.steps.flatMap((s) => s.toolCalls.map((tc) => tc.tool));
    } catch (e) {
      erroredCases++;
      console.log(`✗ ${c.id} — ERROR: ${e instanceof Error ? e.message : String(e)}\n`);
      continue;
    }

    const checks: CheckResult[] = scoreCase(c, text, toolsUsed);
    const casePass = checks.every((r) => r.pass);
    if (!casePass) {
      failedCases++;
    }
    totalChecks += checks.length;
    passedChecks += checks.filter((r) => r.pass).length;

    console.log(`${casePass ? '✓' : '✗'} ${c.id} — ${c.about}`);
    for (const r of checks) {
      console.log(`    ${r.pass ? '✓' : '✗'} ${r.name}: ${r.detail}`);
    }
    if (verbose || !casePass) {
      const preview = text.replace(/\s+/g, ' ').slice(0, 280);
      console.log(`    ↳ answer: ${preview}${text.length > 280 ? '…' : ''}`);
    }
    console.log('');
  }

  const okCases = EVAL_CASES.length - failedCases - erroredCases;
  console.log(`Summary: ${okCases}/${EVAL_CASES.length} cases passed · ${passedChecks}/${totalChecks} checks · ${erroredCases} errored\n`);
  process.exit(failedCases > 0 || erroredCases > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
