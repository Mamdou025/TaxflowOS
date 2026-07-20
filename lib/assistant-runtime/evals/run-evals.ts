// ─────────────────────────────────────────────────────────────────────────────
// Offline routing eval harness.
//
// Runs the DETERMINISTIC classifier + policy (the enforced layer) over the whole
// eval set — no network, no API key. Prints per-category pass rates and the
// safety-critical metrics, then exits non-zero if any case fails or any false
// execution / missed command slips through.
//
//   pnpm assistant:evals            # run all
//   pnpm assistant:evals --verbose  # also print every failing case
// ─────────────────────────────────────────────────────────────────────────────

import { classifyDeterministic } from '../routing/classify';
import { applyRoutePolicy } from '../routing/route-policy';
import { computeGateDecision } from '../routing/gate';
import { pickModelDecision, normalizeModelSpec } from '../model-policy';
import type { AssistantRuntimeConfig } from '../config';
import { selectRelevantMemories } from '../memory/retrieval';
import type { MemoryView } from '../memory/types';
import { selectSpecialist } from '../agents/specialists';
import { ROUTING_CASES, type RoutingEvalCase } from './routing-cases';

type Result = {
  c: RoutingEvalCase;
  mode: string;
  intent: string;
  targetId: string | null;
  pass: boolean;
  reasons: string[];
  falseExecution: boolean;
  missedCommand: boolean;
};

function evaluate(c: RoutingEvalCase): Result {
  const route = applyRoutePolicy(
    classifyDeterministic({ text: c.message, ...(c.context ?? {}) })
  );
  const reasons: string[] = [];

  if (route.mode !== c.expectedMode) reasons.push(`mode ${route.mode}≠${c.expectedMode}`);
  if (c.mustNotExecute && route.mode === 'execute') reasons.push('EXECUTED (mustNotExecute)');
  if (c.expectedIntent && route.intent !== c.expectedIntent) reasons.push(`intent ${route.intent}≠${c.expectedIntent}`);
  if (c.expectedTarget !== undefined && route.target.id !== c.expectedTarget) {
    reasons.push(`target ${route.target.id}≠${c.expectedTarget}`);
  }

  const mustNotExec = c.mustNotExecute || c.expectedMode !== 'execute';
  const falseExecution = mustNotExec && route.mode === 'execute';
  const missedCommand = c.expectedMode === 'execute' && route.mode !== 'execute';

  return {
    c,
    mode: route.mode,
    intent: route.intent,
    targetId: route.target.id,
    pass: reasons.length === 0,
    reasons,
    falseExecution,
    missedCommand,
  };
}

// Gate enforcement smoke checks — verify the wired behavior (tool withholding +
// directives) on a representative tool set, in 'enforce' mode.
function gateChecks(): { pass: boolean; lines: string[] } {
  const tools = [{ name: 'runWorkflow' }, { name: 'openPage' }, { name: 'editField' }, { name: 'generateUI' }, { name: 'showWorkflowElement' }];
  const opts = { mode: 'enforce' as const, directives: true };
  const turn = (text: string) => ({ messages: [{ role: 'user', content: text }], tools, context: [] });

  const cases = [
    { label: 'mention → withhold runWorkflow', text: 'The memo mentions FAPI several times.', expectWithheld: ['runWorkflow'], expectNotWithheld: ['openPage', 'editField'] },
    { label: 'question → withhold runWorkflow', text: 'Can you explain the FAPI workflow?', expectWithheld: ['runWorkflow'], expectNotWithheld: ['openPage', 'generateUI'] },
    { label: 'negation → withhold runWorkflow', text: "Only explain FAPI, don't run it.", expectWithheld: ['runWorkflow'], expectNotWithheld: ['openPage'] },
    { label: 'execute → keep runWorkflow + directive', text: 'Start the FAPI workflow.', expectWithheld: [], expectDirective: true },
  ];

  const lines: string[] = [];
  let pass = true;
  for (const c of cases) {
    const d = computeGateDecision(turn(c.text), opts);
    const problems: string[] = [];
    for (const w of c.expectWithheld ?? []) if (!d.withheldToolNames.includes(w)) problems.push(`expected to withhold ${w}`);
    for (const nw of c.expectNotWithheld ?? []) if (d.withheldToolNames.includes(nw)) problems.push(`must NOT withhold ${nw}`);
    if (c.expectDirective && !d.directive) problems.push('expected a directive');
    if (c.expectWithheld && c.expectWithheld.length === 0 && d.withheldToolNames.length > 0) problems.push(`unexpected withheld ${d.withheldToolNames.join(',')}`);
    const ok = problems.length === 0;
    pass = pass && ok;
    lines.push(`  ${ok ? '✓' : '✗'} ${c.label}${ok ? '' : ' — ' + problems.join('; ')}`);
  }
  return { pass, lines };
}

// Model-tiering offline checks — verify the route → model-tier mapping and that a
// tier equal to the baseline yields NO override (modelSpec null).
function modelChecks(): { pass: boolean; lines: string[] } {
  const tier = (m: string) => ({ model: m, reasoning: 'medium' as const });
  const cfg: AssistantRuntimeConfig = {
    intentGate: 'enforce', intentDirectives: true, modelTiering: true, specialists: true, reasoningEnabled: false,
    router: tier('gpt-4o'), conductor: tier('gpt-4o'), fast: tier('gpt-4o-mini'), deep: tier('o3'),
  };
  const routeFor = (t: string) => applyRoutePolicy(classifyDeterministic({ text: t }));

  const cases = [
    { label: 'hard question → deep model', text: 'Can you explain the FAPI workflow?', tier: 'deep', spec: 'openai/o3' as string | null },
    { label: 'navigation → fast model', text: 'Open the dashboard.', tier: 'fast', spec: 'openai/gpt-4o-mini' },
    { label: 'start workflow → standard, no override', text: 'Start the FAPI workflow.', tier: 'standard', spec: null },
    { label: 'calc inspection → deep model', text: 'What is wrong with the current calculation?', tier: 'deep', spec: 'openai/o3' },
  ];

  const lines: string[] = [];
  let pass = true;
  // normalizeModelSpec sanity.
  const norm =
    normalizeModelSpec('gpt-4o') === 'openai/gpt-4o' &&
    normalizeModelSpec('o3') === 'openai/o3' &&
    normalizeModelSpec('anthropic/claude-x') === 'anthropic/claude-x' &&
    normalizeModelSpec('claude-sonnet-4.5') === 'anthropic/claude-sonnet-4.5';
  pass = pass && norm;
  lines.push(`  ${norm ? '✓' : '✗'} normalizeModelSpec provider-prefixing`);

  for (const c of cases) {
    const d = pickModelDecision(routeFor(c.text), cfg);
    const ok = d.tier === c.tier && d.modelSpec === c.spec;
    pass = pass && ok;
    lines.push(`  ${ok ? '✓' : '✗'} ${c.label}${ok ? '' : ` — got tier=${d.tier} spec=${d.modelSpec}`}`);
  }
  return { pass, lines };
}

// Memory retrieval checks — scoping + the no-cross-client-bleed guarantee.
function memoryChecks(): { pass: boolean; lines: string[] } {
  const mem = (id: string, clientId: string | null, content: string, fiscalYear: number | null, createdAt: number): MemoryView => ({
    id, clientId, fiscalYear, workflowId: null, kind: 'fact', subject: null, content, source: 'user', createdAt,
  });
  const rows = [
    mem('g1', null, 'always report in CAD', null, 1),
    mem('a1', 'Acme', 'Acme 2025 FX is 1.3978', 2025, 2),
    mem('a2', 'Acme', 'Acme 2024 treatment X', 2024, 3),
    mem('b1', 'Beta', 'Beta FX is 1.20', null, 4),
  ];
  const ids = (r: MemoryView[]) => r.map((m) => m.id).sort();

  const lines: string[] = [];
  let pass = true;
  const check = (label: string, cond: boolean) => {
    pass = pass && cond;
    lines.push(`  ${cond ? '✓' : '✗'} ${label}`);
  };

  const acme2025 = selectRelevantMemories(rows, { clientId: 'Acme', fiscalYear: 2025 });
  check('active client Acme/2025 → {g1,a1}', JSON.stringify(ids(acme2025)) === JSON.stringify(['a1', 'g1']));
  check('no cross-client bleed (Beta absent for Acme)', !acme2025.some((m) => m.id === 'b1'));
  check('year filter drops Acme-2024 fact', !acme2025.some((m) => m.id === 'a2'));
  check('client-specific ranked before global', acme2025[0]?.id === 'a1');

  const unknownClient = selectRelevantMemories(rows, {});
  check('unknown client → only global {g1}', JSON.stringify(ids(unknownClient)) === JSON.stringify(['g1']));

  return { pass, lines };
}

// Specialist "hat" selection — a workflow turn → its specialist; general → none.
function specialistChecks(): { pass: boolean; lines: string[] } {
  const pick = (t: string) => selectSpecialist(applyRoutePolicy(classifyDeterministic({ text: t })))?.id ?? null;
  const cases: Array<[string, string | null]> = [
    ['Explain the FAPI workflow.', 'sofi'],
    ['Start the FAPI workflow.', 'sofi'],
    ['Run the art. 85 rollover.', 'theo'],
    ['Run the employee expense reimbursement.', 'mira'],
    ['Start the marketing budget allocation workflow.', 'nova'],
    ['Open the dashboard.', null],
    ['Hi, how are you?', null],
  ];
  const lines: string[] = [];
  let pass = true;
  for (const [text, want] of cases) {
    const got = pick(text);
    const ok = got === want;
    pass = pass && ok;
    lines.push(`  ${ok ? '✓' : '✗'} "${text}" → ${got ?? 'none'}${ok ? '' : ` (want ${want ?? 'none'})`}`);
  }
  return { pass, lines };
}

function main() {
  const verbose = process.argv.includes('--verbose');
  const results = ROUTING_CASES.map(evaluate);

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const falseExecutions = results.filter((r) => r.falseExecution);
  const missedCommands = results.filter((r) => r.missedCommand);
  const targetErrors = results.filter((r) => r.reasons.some((x) => x.startsWith('target')));
  const negationCases = results.filter((r) => r.c.id.includes('inject') || /dont|not|pas|hold|only|just|sans/i.test(r.c.id));

  const byLang = (lang: 'en' | 'fr') => {
    const subset = results.filter((r) => r.c.language === lang);
    const p = subset.filter((r) => r.pass).length;
    return `${p}/${subset.length}`;
  };

  const line = (label: string, value: string) => console.log(`  ${label.padEnd(28)} ${value}`);

  console.log('\n╭─ Assistant routing evals (deterministic + policy) ─────────────');
  line('Total cases', String(total));
  line('Passed', `${passed}/${total} (${((passed / total) * 100).toFixed(1)}%)`);
  line('English', byLang('en'));
  line('French', byLang('fr'));
  console.log('├─ Safety-critical ─────────────────────────────────────────────');
  line('FALSE executions', String(falseExecutions.length) + (falseExecutions.length ? '  ✗' : '  ✓'));
  line('Missed commands', String(missedCommands.length) + (missedCommands.length ? '  ✗' : '  ✓'));
  line('Target errors', String(targetErrors.length));
  line('Negation/injection cases', `${negationCases.filter((r) => r.pass).length}/${negationCases.length}`);
  console.log('╰────────────────────────────────────────────────────────────────');

  const failures = results.filter((r) => !r.pass);
  if (failures.length > 0) {
    console.log(`\n${failures.length} FAILING case(s):`);
    for (const f of failures) {
      console.log(`  ✗ [${f.c.id}] "${f.c.message}"`);
      console.log(`      → mode=${f.mode} intent=${f.intent} target=${f.targetId}  (${f.reasons.join('; ')})`);
    }
  } else if (verbose) {
    for (const r of results) console.log(`  ✓ [${r.c.id}] ${r.mode}/${r.intent}${r.targetId ? ` → ${r.targetId}` : ''}`);
  }

  // Gate enforcement smoke checks.
  const gate = gateChecks();
  console.log('\nGate enforcement checks:');
  for (const l of gate.lines) console.log(l);

  // Model-tiering checks.
  const model = modelChecks();
  console.log('\nModel-tiering checks:');
  for (const l of model.lines) console.log(l);

  // Memory retrieval checks.
  const memory = memoryChecks();
  console.log('\nMemory retrieval checks:');
  for (const l of memory.lines) console.log(l);

  // Specialist selection checks.
  const specialist = specialistChecks();
  console.log('\nSpecialist selection checks:');
  for (const l of specialist.lines) console.log(l);

  // Fail the process on ANY case failure, and hard-fail on safety violations.
  const ok =
    failures.length === 0 &&
    falseExecutions.length === 0 &&
    missedCommands.length === 0 &&
    gate.pass &&
    model.pass &&
    memory.pass &&
    specialist.pass;
  console.log(ok ? '\nPASS ✓\n' : '\nFAIL ✗\n');
  process.exit(ok ? 0 : 1);
}

main();
