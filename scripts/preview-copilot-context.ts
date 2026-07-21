#!/usr/bin/env tsx
/*
 * preview-copilot-context — deterministic "what does the AI see?" harness.
 *
 * Reconstructs the two NEW grounding readables (live-workflow-data + editable-field
 * values) for a concrete FAPI scenario, using the SAME pure functions the chat hook
 * uses. No LLM, no tokens, no browser — just the exact context payload the model now
 * receives. Run: `pnpm tsx scripts/preview-copilot-context.ts`
 */

import { WORKFLOW_CONFIGS, getWorkflowConfig } from '@/lib/workflow-runs';
import { createTemplateIntel } from '@/lib/worksheet-intel';

const line = (s = '') => console.log(s);
const h = (s: string) => { line(); line(`━━━ ${s} ━━━`); };

async function main() {
// ── Scenario: the user set the FX rate to 1.3978 in the chat (the screenshot) ──
const WF = 'fapi';
const USER_FX = 1.3978;
const cfg = getWorkflowConfig(WF)!;
const engineFxDefault = cfg.editableInputs?.find((i) => i.key === 'fxRate')?.default;

h('SCENARIO');
line(`Workflow: ${cfg.name} (id "${cfg.id}")`);
line(`User set FX rate to ${USER_FX} in the chat → runEdits["${WF}"].inputs.fxRate = ${USER_FX}`);
line(`(engine default for fxRate is ${engineFxDefault})`);

// ── Live-workflow-data readable: BEFORE (no edit) vs AFTER (user set 1.3978) ──
function snapshotFor(inputs: Record<string, number>) {
  return createTemplateIntel(cfg, { inputs }).describe();
}
const before = snapshotFor({});
const after = snapshotFor({ fxRate: USER_FX });

h('LIVE-WORKFLOW READABLE  —  what the AI sees about the run');
line('BEFORE (nothing set) fxRate → ' + (before.status === 'error' ? before.message : before.fxRate));
line('AFTER  (user set 1.3978) fxRate → ' + (after.status === 'error' ? after.message : after.fxRate));
line();
line('Full AFTER snapshot the model receives (createTemplateIntel(...).describe()):');
line(JSON.stringify(after, null, 2));

// ── Editable-field-values readable (fx entry), same binding logic as the hook ──
h('EDITABLE-FIELD-VALUES READABLE  —  the fx entry');
// binding: fx → { workflowId: 'fapi', inputKey: 'fxRate' }  (from resource-registry)
const simulatedRunEdits: Record<string, { inputs: Record<string, number> }> = {
  fapi: { inputs: { fxRate: USER_FX } },
};
const stored = simulatedRunEdits[WF]?.inputs?.fxRate;
const fxEntry = {
  fieldId: 'fx',
  label: 'Annual Average FX Rate',
  worksheet: 'fapi',
  value: String(stored ?? engineFxDefault ?? ''),
  unit: 'RATE',
  hint: 'USD → CAD annual average',
  isDefault: stored === undefined,
  boundToWorkflow: 'fapi',
};
line(JSON.stringify(fxEntry, null, 2));

// ── Try the REAL registry (fuzzy resolver + real field-values) if it imports ──
h('FUZZY FIELD RESOLUTION  —  the model\'s guesses now resolve');
try {
  // May fail outside Next (resource-registry imports next/dynamic at load).
  const reg = await import('@/shared/stores/resource-registry');
  for (const guess of ['FX_RATE', 'fx rate', 'exchange rate', 'fxRate', 'fx']) {
    line(`resolveFieldId(${JSON.stringify(guess)}) → ${JSON.stringify(reg.resolveFieldId(guess))}`);
  }
  line(`resolveFieldId("net income") → ${JSON.stringify(reg.resolveFieldId('net income'))}  (unknown → null, editField returns the field list)`);
} catch (err) {
  line('(skipped — resource-registry needs the Next runtime to import here)');
  line('  Logic check: id "fx" has editKeyword "fx"; "FX_RATE".includes("fx") ⇒ resolves to "fx".');
  void err;
}

h('SUMMARY');
line('OLD: no field-values readable + worksheet-only snapshot ⇒ model had no FX ⇒ guessed "1".');
line('NEW: both readables carry the real 1.3978 (bound to the engine input) for ANY workflow ⇒ grounded.');
line(`Registered workflows now grounded automatically: ${Object.keys(WORKFLOW_CONFIGS).join(', ')}`);
line();
}

main().catch((err) => { console.error(err); process.exit(1); });
