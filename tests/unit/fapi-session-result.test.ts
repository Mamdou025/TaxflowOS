import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { WorkflowSession } from '../../lib/workflow-contracts/src/library-types';
import type { ToolRunResult } from '../../lib/workflow-contracts/src/tool-types';
import { createFapiTemplateWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/fapi';
import {
  fapiWorksheetCsv,
  projectFapiSessionWorksheet,
  supportsFapiWorksheet,
} from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/fapi-session-result';

const lines = 'fapi-logic-lines-engine';
const summary = 'fapi-logic-summary-engine';
const at = '2026-10-09T12:00:00.000Z';

function result(blockId: string, values: Record<string, unknown>): ToolRunResult {
  return {
    blockId,
    runId: 'recorded-attempt',
    toolId: 'logic.calculation_engine',
    status: 'success',
    output: { calculatedResults: values },
    startedAt: at,
    completedAt: at,
    logs: [],
    errors: [],
    warnings: [],
    sourceTrace: [],
    evidenceRefs: [],
  };
}

function fixture() {
  const definition = createFapiTemplateWorkflow();
  const session: WorkflowSession = {
    id: 'exact-fapi-session',
    version: 3,
    revision: 8,
    createdAt: at,
    paused: true,
    results: {},
    stale: [],
    reviewed: [],
    sources: [],
    attempts: [],
  };
  return { definition, session };
}

test('FAPI presentation waits for recorded results and preserves zero as a real value', () => {
  const { definition, session } = fixture();
  const before = JSON.stringify({ definition, session });
  const pending = projectFapiSessionWorksheet(definition, session)!;
  assert.ok(pending);
  assert.equal(pending.summary[0].source.status, 'missing');
  assert.equal(pending.summary[0].source.value, undefined);
  assert.equal(
    pending.sections[0].rows[0].value,
    undefined,
    'configured FX is not a recorded result',
  );
  assert.equal(
    JSON.stringify({ definition, session }),
    before,
    'projection does not execute or mutate',
  );

  session.results[summary] = result(summary, { GROSS: 0, GROSS_CAD: 0 });
  const sheet = projectFapiSessionWorksheet(definition, session)!;
  assert.deepEqual(
    sheet.summary.map((row) => row.key),
    ['GROSS', 'DEDUCTIONS', 'FAPI_BRUT', 'FAT_DEDUCTION', 'NET_FAPI'],
  );
  assert.equal(sheet.summary[0].source.status, 'current');
  assert.equal(sheet.summary[0].source.value, 0);
  assert.equal(sheet.summary[0].cad.value, 0);
  assert.equal(sheet.summary[4].source.status, 'missing');
  assert.equal(sheet.runId, 'exact-fapi-session');
  assert.equal(sheet.version, 3);
  assert.equal(sheet.revision, 8);
  assert.equal(sheet.approvedAt, undefined, 'available results never imply approval');
});

test('FAPI sheet uses recorded CAD values and formulas without calculating a currency conversion', () => {
  const { definition, session } = fixture();
  session.results[lines] = result(lines, { A: 900, B: 200, FAT_PAID: 100 });
  session.results[summary] = result(summary, {
    GROSS: 1100.123456,
    GROSS_CAD: 5432.987654,
    FX_RATE: 1.35,
  });
  session.results[summary].output.formulaTrace = {
    GROSS: { expression: 'saved-custom-expression' },
  };
  const sheet = projectFapiSessionWorksheet(definition, session)!;
  assert.equal(sheet.summary[0].source.value, 1100.123456);
  assert.equal(sheet.summary[0].cad.value, 5432.987654);
  assert.equal(sheet.summary[0].source.formula, 'saved-custom-expression');
  assert.equal(
    sheet.sections.flatMap((section) => section.rows).find((row) => row.key === 'B')?.value,
    200,
  );
  delete (session.results[summary].output.calculatedResults as Record<string, unknown>).GROSS_CAD;
  assert.equal(
    projectFapiSessionWorksheet(definition, session)!.summary[0].cad.status,
    'missing',
    'no UI FX multiplication',
  );
});

test('stale, failed, malformed and missing FAPI values stay distinct from current numbers', () => {
  const { definition, session } = fixture();
  session.results[summary] = result(summary, { GROSS: 1100, GROSS_CAD: 1485 });
  session.stale = [summary];
  const stale = projectFapiSessionWorksheet(definition, session)!;
  assert.equal(stale.summary[0].source.status, 'stale');
  assert.equal(stale.summary[0].source.value, undefined);
  assert.ok(!fapiWorksheetCsv(stale).includes('1485'));
  session.stale = [];
  session.results[summary].errors = ['The calculation failed'];
  assert.equal(
    projectFapiSessionWorksheet(definition, session)!.summary[0].source.status,
    'invalid',
  );
  session.results[summary] = result(summary, { GROSS: '1100', GROSS_CAD: Number.NaN });
  const invalid = projectFapiSessionWorksheet(definition, session)!;
  assert.equal(invalid.summary[0].source.status, 'invalid');
  assert.equal(invalid.summary[0].cad.status, 'invalid');
  session.results[summary] = result('another-block', { GROSS: 999 });
  assert.equal(
    projectFapiSessionWorksheet(definition, session)!.summary[0].source.status,
    'invalid',
  );
});

test('FAPI presentation recognizes saved output fields, respects source currency and declines incompatible graphs', () => {
  const { definition, session } = fixture();
  assert.equal(supportsFapiWorksheet(definition), true);
  const inputs = definition.blocks.find((block) => block.id === 'fapi-source-inputs')!;
  inputs.config.documentCurrency = 'EUR';
  const engine = definition.blocks.find((block) => block.id === summary)!;
  const formulas = engine.config.formulas as Array<Record<string, unknown>>;
  formulas[0].formulaExpression = 'A + B + C';
  const customized = projectFapiSessionWorksheet(definition, session)!;
  assert.equal(customized.source, 'EUR');
  assert.equal(
    customized.summary[0].label,
    'Gross',
    'custom calculations do not retain assumptions in reference captions',
  );
  formulas[0].label = 'Customized gross amount';
  assert.equal(
    projectFapiSessionWorksheet(definition, session)!.summary[0].label,
    'Customized gross amount',
  );
  formulas[0].unit = '%';
  assert.equal(projectFapiSessionWorksheet(definition, session), null);
  delete formulas[0].unit;
  const fx = formulas.find((formula) => formula.resultKey === 'FX_RATE')!;
  fx.unit = '%';
  assert.equal(
    supportsFapiWorksheet(definition),
    false,
    'an explicit percentage is not a currency rate',
  );
  fx.unit = 'EUR → CAD';
  assert.equal(
    supportsFapiWorksheet(definition),
    true,
    'the displayed currency-rate unit remains supported',
  );
  delete fx.unit;
  const lineFormulas = definition.blocks.find((block) => block.id === lines)!.config
    .formulas as Array<Record<string, unknown>>;
  const rtf = lineFormulas.find((formula) => formula.resultKey === 'RTF')!;
  rtf.unit = '%';
  assert.equal(
    supportsFapiWorksheet(definition),
    false,
    'a percentage cannot be displayed as a factor',
  );
  rtf.unit = 'factor';
  assert.equal(supportsFapiWorksheet(definition), true);
  delete rtf.unit;
  assert.equal(supportsFapiWorksheet(definition), true, 'baseline units may remain undeclared');
  engine.config.formulas = formulas.filter((formula) => formula.resultKey !== 'NET_FAPI_CAD');
  assert.equal(projectFapiSessionWorksheet(definition, session), null);
  assert.equal(supportsFapiWorksheet(definition), false);
});

test('FAPI CSV identifies exact revision and exports full precision with blank unavailable amounts', () => {
  const { definition, session } = fixture();
  session.id = '=UNTRUSTED()';
  session.sources = ['original.xlsx', 'replacement.xlsx'].map((name, index) => ({
    id: `source-${index}`,
    blockId: 'fapi-source-trial-balance',
    name,
    at,
    mode: 'replace',
    rows: [],
  }));
  session.results[summary] = result(summary, { GROSS: 1234.123456789, GROSS_CAD: 2000 });
  const csv = fapiWorksheetCsv(projectFapiSessionWorksheet(definition, session)!);
  assert.ok(csv.includes('"Run","\'=UNTRUSTED()","Version",3,"Revision",8'));
  assert.ok(csv.includes('"USD","current",1234.123456789'));
  assert.ok(csv.includes('"CAD","current",2000'));
  assert.ok(csv.includes('"USD","missing",""'));
  assert.ok(csv.includes('"Review","Not approved"'));
  assert.ok(csv.includes('"Source history","source-0","original.xlsx"'));
  assert.ok(csv.includes('"Source history","source-1","replacement.xlsx"'));
});
