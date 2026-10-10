/** Build a portable, user-requested workflow from the actual workbook; never seed tax inputs. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { WorkflowDefinition } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { DocumentExtraction } from '../../lib/workflow-contracts/src/domain/document-extraction';
import { workflowBackup, validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import { startSession, getSession, sessionContext, changeSession, type SessionAction } from '../../lib/workflow-core/src/application/sessions';
import type { GraphRuntime } from '../../lib/workflow-core/src/core/ports';
import { projectFieldWorksheet } from '../../lib/workflow-core/src/application/field-worksheet';
import { inferCalculationInputs } from '../../lib/workflow-core/src/core/calculation-inputs';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { getToolIdForBlock } from '../../lib/workflow-core/src/core/tool-resolution';
import { isWorkflowRelationshipAllowed } from '../../lib/workflow-contracts/src/domain/workflow-validation';
import type { WorkflowRelationshipType } from '../../lib/workflow-contracts/src/domain/edge-types';
import { LOCAL_TOOL_REGISTRY } from '../../lib/workflow-executors/src/tools/registry';
import { buildApiRequest, apiRequestToBlockConfig } from '../../lib/source-connectors/src/connectors';
import { fetchJsonPayload } from '../../lib/source-connectors/src/http-json';
import { apiRequestSignature } from '../../lib/workflow-executors/src/api-snapshot';
import { executeDurableWorkflow } from '../../artifacts/api-server/src/lib/workflow-runs/executor';
import { parseExcelWorkbookFile, detectExcelColumnMapping, getNormalizedRowsForSheet } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/parsing/excel-utils';
import { createWorkflowBlockFromCatalog } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/block-factory';
import { getWorkflowStructure } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/canvas';
import { generateRuntimeUiConfigFromParts, generateOutputMappingPreviewFromParts } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/runtime-ui';
import { FAPI_LINES_CALC_RULES, FAPI_SUMMARY_CALC_RULES } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/sample-workflows/fapi-template';

const out = dirname(fileURLToPath(import.meta.url));
const filePath = process.env.FAPI_WORKBOOK_PATH || 'C:/Users/Mamad/Documents/Sinaxetools/PNL-anonymisé (1).xlsx';
const now = new Date().toISOString();
const verifyOnly = process.argv.includes('--verify-only');
const id = 'custom:new-fapi-calc-2024';
const ids = Object.fromEntries(['trigger', 'workbook', 'mapper', 'mapping-review', 'rollup', 'pnl-calculation', 'reconciliation-review', 'fx-api', 'tax-calculation', 'pnl-results', 'evidence'].map((key) => [key, `new-fapi-${key}`]));
const sha256 = (value: string | Uint8Array) => `sha256:${createHash('sha256').update(value).digest('hex')}`;
const write = (name: string, value: unknown) => { if (!verifyOnly) writeFileSync(resolve(out, name), `${JSON.stringify(value, null, 2)}\n`); };
const close = (actual: number, expected: number, label: string) => assert.ok(Math.abs(actual - expected) < 0.000001, `${label}: expected ${expected}, got ${actual}`);

// Static account lists are intentional: a newly introduced account must be reviewed.
const categories = [
  ['salesRevenue', 'Sales and intercompany revenue', 'sales', ['42100', '42110', '42200']],
  ['revenueAdjustments', 'Work in progress / deferred revenue movement', 'sales', ['43100']],
  ['otherRevenue', 'Other accounting revenue', 'sales', ['44220']],
  ['costSalaries', 'Cost of sales — payroll and social charges', 'cost_of_sales', ['51100', '51101', '51206', '51207', '51208', '51209', '51210', '51211', '51212', '51300']],
  ['subcontractors', 'Cost of sales — subcontractors', 'cost_of_sales', ['52100', '52200', '52400']],
  ['productionCosts', 'Cost of sales — project expenses', 'cost_of_sales', ['53100', '53150', '53200']],
  ['administrativePayroll', 'Administrative payroll and social charges', 'overheads', ['60100', '60101', '60151', '60152', '60153', '60154', '60155', '60156', '60157']],
  ['professionalFees', 'Professional, legal and consulting fees', 'overheads', ['62100', '62200', '62300']],
  ['travelExpenses', 'Travel expenses', 'overheads', ['63010']],
  ['meals', 'Meals expense', 'overheads', ['64010']],
  ['insurance', 'Commercial insurance expense', 'overheads', ['65100']],
  ['badDebts', 'Bad debt expense', 'overheads', ['66010']],
  ['officeRentExpense', 'Office rent expense', 'overheads', ['68010']],
  ['otherFacilityExpenses', 'Other office and occupancy expenses', 'overheads', ['68030', '68090', '68110', '68120', '68135', '68150', '68170']],
  ['marketing', 'Marketing, events and gifts expense', 'overheads', ['69090', '69110', '69150', '69170', '69190', '69211', '69212']],
  ['humanResources', 'Human resources expense', 'overheads', ['70010', '70030', '70050', '70110']],
  ['technology', 'Technology expense', 'overheads', ['71010', '71031', '71050', '71110']],
  ['amortizationSigned', 'Amortization — original signed amount', 'other_signed', ['82100']],
  ['financialExpensesSigned', 'Bank charges, interest and penalties — signed', 'other_signed', ['83100', '83200']],
  ['exchangeAndRoundingSigned', 'Currency exchange and rounding — signed', 'other_signed', ['85200', '85550', '85551', '85500', '85660']],
  ['incomeTaxExpenseSigned', 'Accounting income tax expense — signed', 'other_signed', ['90010']],
] as const;
const references = [
  ['pnl_reference_gross', 'Gross Profit', 1301978.01],
  ['pnl_reference_operating', 'Operating Profit', 488525.80],
  ['pnl_reference_net', 'Net Profit/(Loss)', 308079.42],
] as const;
const labels: Record<string, string> = {
  pCoefficient: 'Reviewed P coefficient', income_bucket: 'Reviewed FAPI income (EUR)',
  expense_bucket: 'Reviewed eligible FAPI expenses (EUR)', canadianRules95_4: 'Reviewed Canadian rules adjustment — existing 95(2) line (EUR)',
  debtForgiveness: 'Reviewed debt forgiveness operand (EUR)', priorYearG: 'Reviewed prior-year G amount (EUR)',
  capGains: 'Reviewed capital gains (EUR)', inclusionRate: 'Reviewed capital gains inclusion rate',
  cfaIncome: 'Reviewed CFA income — line C (EUR)', businessLosses: 'Reviewed business losses — line D (EUR)',
  faclCarryforward: 'Reviewed FACL carryforward — line E (EUR)', prescribedAmount: 'Reviewed prescribed amount — line F (EUR)',
  prescribedAmountF1: 'Reviewed prescribed amount — line F1 (EUR)', dividendDeductions: 'Reviewed dividend deductions — line G (EUR)',
  partnershipDividends: 'Reviewed partnership dividends — line H (EUR)', fatPaid: 'Reviewed foreign accrual tax paid (EUR)',
  rtf: 'Reviewed relevant tax factor', fxRate: 'EUR to CAD annual average — 2024',
};

async function main() {
  const bytes = readFileSync(filePath);
  const workbook = await parseExcelWorkbookFile(new File([bytes], 'PNL-anonymisé (1).xlsx'));
  const sheet = workbook.sheets.find((item) => item.sheetName === 'ProfitandLoss');
  assert.ok(sheet, 'Expected the actual ProfitandLoss worksheet');
  assert.ok(!sheet.truncated, 'The actual workbook must be parsed completely');
  const columnMapping = detectExcelColumnMapping(sheet.headers);
  const rows = getNormalizedRowsForSheet({ workbook, sheet, mapping: columnMapping });
  assert.equal(rows.length, 72);
  assert.equal(rows.filter((row) => row.account).length, 69);
  assert.ok(rows.every((row) => row.currency === 'EUR'));
  for (const [, label, expected] of references) close(rows.find((row) => row.label === label)!.amount, expected, label);
  const extraction: DocumentExtraction = {
    id: 'new-fapi-pnl-2024-extraction', revision: 1, fileName: workbook.fileName,
    contentHash: sha256(bytes), extractedAt: now, method: 'workbook',
    segments: rows.map((row) => ({ id: row.rowId, location: `ProfitandLoss!A${row.rowNumber}:B${row.rowNumber}`, text: `${row.label} | ${row.raw?.Amount ?? row.amount} | EUR` })),
    rows, issues: [{ code: 'ORIGINAL_NOT_STORED', message: 'The original Excel binary is not stored in this portable backup. Parsed cells, normalized rows and its SHA-256 are retained; keep the original workbook for independent verification.' }],
  };
  const keywordRules = [...categories.map(([categoryId, categoryLabel, , accounts]) => ({
    ruleId: `account-${categoryId}`, categoryId, categoryLabel, keywords: [], exactKeywords: [...accounts],
    confidence: 1, priority: 100, description: 'Exact account-code accounting classification for the supplied 2024 P&L. This is not a tax classification.',
  })), ...references.map(([categoryId, label]) => ({
    ruleId: `reference-${categoryId}`, categoryId, categoryLabel: `${label} — reference only`, keywords: [], exactKeywords: [label],
    confidence: 1, priority: 100, description: 'Exact full-label workbook comparison value; excluded from financial rollup groups.',
  }))];
  const rollupRules = ['sales', 'cost_of_sales', 'overheads', 'other_signed'].map((group) => ({
    rollupId: `pnl_${group}`, label: `P&L ${group.replaceAll('_', ' ')}`, operation: 'sum',
    includeCategoryIds: categories.filter((item) => item[2] === group).map((item) => item[0]),
    description: 'Sum detail accounts with original signs; no subtotal or profit summary rows.',
  }));
  const pnlRules = [
    ['PNL_SALES', 'Accounting sales and revenue (EUR)', 'pnl_sales'],
    ['PNL_COST_OF_SALES', 'Accounting cost of sales (EUR)', 'pnl_cost_of_sales'],
    ['PNL_OVERHEADS', 'Accounting overheads (EUR)', 'pnl_overheads'],
    ['PNL_OTHER_SIGNED', 'Accounting other items — original signs (EUR)', 'pnl_other_signed'],
    ['PNL_GROSS', 'Gross profit (EUR)', 'pnl_sales - pnl_cost_of_sales'],
    ['PNL_OPERATING', 'Operating profit (EUR)', 'PNL_GROSS - pnl_overheads'],
    ['PNL_NET', 'Net profit (EUR)', 'PNL_OPERATING + pnl_other_signed'],
    ['PNL_DIFF_GROSS', 'Gross profit difference from workbook (EUR)', 'PNL_GROSS - pnl_reference_gross'],
    ['PNL_DIFF_OPERATING', 'Operating profit difference from workbook (EUR)', 'PNL_OPERATING - pnl_reference_operating'],
    ['PNL_DIFF_NET', 'Net profit difference from workbook (EUR)', 'PNL_NET - pnl_reference_net'],
  ].map(([resultKey, label, formulaExpression]) => ({ calculationId: resultKey, resultKey, label, formulaExpression, operands: [], operation: 'add', unit: 'EUR', roundingDigits: 2 }));
  const fapiRules = structuredClone([...FAPI_LINES_CALC_RULES, ...FAPI_SUMMARY_CALC_RULES]);
  const manualInputs = inferCalculationInputs(fapiRules).filter((name) => name !== 'fxRate');
  assert.equal(manualInputs.length, 17);
  const primaryKeys = new Set(['NET_FAPI', 'NET_FAPI_CAD']);
  const summaryKeys = new Set(['GROSS', 'GROSS_CAD', 'DEDUCTIONS', 'DEDUCTIONS_CAD', 'FAPI_BRUT', 'FAPI_BRUT_CAD', 'FAT_DEDUCTION', 'FAT_DEDUCTION_CAD', 'FX_RATE']);
  const summaryLabels: Record<string, string> = {
    NET_FAPI: 'Net FAPI', NET_FAPI_CAD: 'Net FAPI', GROSS: 'Gross FAPI', GROSS_CAD: 'Gross FAPI',
    DEDUCTIONS: 'Deductions', DEDUCTIONS_CAD: 'Deductions', FAPI_BRUT: 'FAPI before foreign-tax deduction', FAPI_BRUT_CAD: 'FAPI before foreign-tax deduction',
    FAT_DEDUCTION: 'Foreign tax deduction', FAT_DEDUCTION_CAD: 'Foreign tax deduction', FX_RATE: 'Exchange rate',
  };
  const worksheetLines = [
    ...fapiRules.map((rule) => ({
      id: rule.resultKey,
      label: summaryLabels[rule.resultKey] ?? `FAPI — ${rule.label}`,
      calculationBlockId: ids['tax-calculation'],
      resultKey: rule.resultKey,
      unit: rule.resultKey === 'RTF' ? 'ratio' : rule.resultKey === 'FX_RATE' ? 'CAD/EUR' : rule.resultKey.endsWith('_CAD') ? 'CAD' : 'EUR',
      presentation: primaryKeys.has(rule.resultKey) ? 'primary' : summaryKeys.has(rule.resultKey) ? 'summary' : 'detail',
      ...(primaryKeys.has(rule.resultKey) ? {} : { group: summaryKeys.has(rule.resultKey) ? 'Calculation summary' : 'FAPI lines' }),
      description: rule.description,
      decimalPlaces: ['FX_RATE', 'RTF'].includes(rule.resultKey) ? 6 : 2,
    })),
    ...pnlRules.map((rule) => ({
      id: rule.resultKey,
      label: `Accounting support — ${rule.label}`,
      calculationBlockId: ids['pnl-calculation'],
      resultKey: rule.resultKey,
      unit: 'EUR',
      presentation: 'detail',
      group: 'Accounting support',
      description: `Accounting reconciliation only: ${rule.formulaExpression}. This value does not establish tax treatment.`,
      decimalPlaces: 2,
    })),
  ];
  assert.equal(worksheetLines.length, 36);
  assert.equal(new Set(worksheetLines.map((line) => line.id)).size, worksheetLines.length);
  assert.deepEqual(worksheetLines.filter((line) => line.presentation === 'primary').map((line) => line.id), ['NET_FAPI', 'NET_FAPI_CAD']);
  assert.equal(worksheetLines.filter((line) => line.presentation === 'summary').length, 9);
  assert.equal(worksheetLines.filter((line) => line.presentation === 'detail').length, 25);
  const block = (key: string, catalogId: string, label: string, description: string, x: number, y: number, config: Record<string, unknown> = {}) => createWorkflowBlockFromCatalog(catalogId, {
    id: ids[key], label, description, position: { x, y }, config, status: 'configured', sample: false,
    createdAt: now, updatedAt: now, createdBy: 'user-request', updatedBy: 'user-request',
  });
  const request = buildApiRequest('boc.fx_average', { currency: 'EUR', year: 2024 });
  assert.ok(request.ok, request.ok ? '' : request.errors.join('; '));
  const api = block('fx-api', 'source:api-http-request', 'Bank of Canada EUR / CAD — 2024', 'Generic API source. Captures the arithmetic mean of 2024 daily EUR/CAD observations; confirm the appropriate FX method for the filing before use.', 310, 520, apiRequestToBlockConfig('boc.fx_average', request.params, request.spec));
  const capturePath = resolve(out, 'api-capture.json');
  const priorCapture = existsSync(capturePath) ? JSON.parse(readFileSync(capturePath, 'utf8')) : undefined;
  const response = priorCapture?.request.signature === apiRequestSignature(api.config)
    ? priorCapture
    : { ...(await fetchJsonPayload({ url: String(api.config.url), method: 'GET', headers: {} })), capturedAt: now };
  const rawResponseHash = response.rawResponseHash ?? sha256(response.rawText);
  api.config = { ...api.config, fetchedPayload: response.payload, responseMeta: response.responseMeta, fetchedAt: response.capturedAt, fetchedRequestSignature: apiRequestSignature(api.config) };
  write('api-capture.json', { capturedAt: response.capturedAt, request: { url: api.config.url, method: 'GET', signature: api.config.fetchedRequestSignature }, responseMeta: response.responseMeta, rawResponseHash, payload: response.payload });
  const blocks = [
    block('trigger', 'trigger:manual', 'FAPI readiness checklist', 'Start source collection and review the formula-derived required fields. No tax values are assumed.', 0, 200, {
      readinessConditions: [{ id: 'document-ready', kind: 'document', sourceId: ids.workbook }],
    }),
    block('workbook', 'source:excel-workbook', '2024 P&L — supplied workbook', 'Actual supplied French P&L, Jan–Dec 2024, EUR. Retains parsed cells, rows, coordinates and original SHA-256.', 310, 80, {
      sourceKind: 'excel_workbook', requireUpload: true, sourceLocator: workbook.fileName, currency: 'EUR',
      excelWorkbook: workbook, sheetName: sheet.sheetName, columnMapping, rows, documentExtractions: [extraction],
      excludeTotalRows: true, includeTotalRows: false, includeRowsWithoutAmount: false,
    }),
    block('mapper', 'logic:classification-mapping', 'Exact account-code mapping', 'Accounting categories only. Exact account codes avoid ambiguous words; three exact profit labels are reference-only. New accounts require review.', 620, 80, {
      keywordRules, matchFields: ['account', 'label'], matchMode: 'exact', conflictStrategy: 'send_conflict_to_review', unmatchedStrategy: 'send_to_review', lowConfidenceThreshold: 0.99,
    }),
    block('mapping-review', 'review:unmatched-rows-check', 'Review unmapped accounts', 'Review every new or unmatched account before continuing. No unmatched-row override is supplied.', 930, -100, { blocking: true, overrideUnmatchedRows: false }),
    block('rollup', 'logic:category-rollup-aggregator', 'P&L accounting subtotals', 'Preserve the workbook signs. Financial groups contain only detail accounts; the three profit references never enter a financial group.', 930, 160, { rollupRules }),
    block('pnl-calculation', 'logic:calculation-engine', 'P&L reconciliation', 'Independently rebuild gross, operating and net profit from account subtotals; compare against the separate workbook profit references.', 1240, 160, {
      mode: 'inline', formulas: pnlRules, outputCurrency: 'EUR', inputValues: {},
      inputDefinitions: inferCalculationInputs(pnlRules).map((name) => ({ name, type: 'number', unit: 'EUR', binding: { kind: 'source', blockId: ids.rollup, path: ['namedValues', name] } })),
    }),
    block('reconciliation-review', 'review:formula-consistency-check', 'Check P&L against workbook', 'Checks reconstructed profits against independently read workbook references. Each comparison difference must be zero.', 1550, -40, {
      tolerance: 0.01, expectedResults: { PNL_DIFF_GROSS: 0, PNL_DIFF_OPERATING: 0, PNL_DIFF_NET: 0 },
    }),
    block('pnl-results', 'field:field-block', 'FAPI worksheet', 'Main FAPI lines, EUR/CAD summaries and separate accounting support. Each line references its calculation and exposes required inputs and evidence. Accounting values remain visible while tax inputs await review; no tax result is assumed.', 2170, 240, { worksheetLines }),
    api,
    block('tax-calculation', 'logic:calculation-engine', 'FAPI calculation — reviewed inputs', 'Existing FAPI line and summary formulas, unchanged. All 17 tax operands require explicit reviewed values, including zero when appropriate. Accounting mappings are evidence, not automatic tax classifications. Inputs can be rebound to reviewed source or rollup fields.', 1860, 440, {
      mode: 'inline', formulas: fapiRules, outputCurrency: 'EUR', inputValues: {},
      inputDefinitions: inferCalculationInputs(fapiRules).map((name) => ({ name, label: labels[name], type: 'number', unit: ['pCoefficient', 'inclusionRate', 'rtf'].includes(name) ? 'ratio' : name === 'fxRate' ? 'CAD/EUR' : 'EUR', binding: name === 'fxRate' ? { kind: 'source', blockId: ids['fx-api'], path: ['namedValues', 'fxRate'] } : { kind: 'manual' } })),
    }),
    block('evidence', 'output:evidence-pack', 'FAPI results and evidence', 'Review worksheet results, source evidence, both review checkpoints and calculation trace once all tax inputs are explicitly supplied. No final approval is pre-recorded.', 2480, 240),
  ];
  const edge = (from: string, to: string, relationshipType: WorkflowRelationshipType, sourceOutputRole?: string, targetInputRole?: string) => createWorkflowEdgeRecord({
    sourceBlockId: ids[from], targetBlockId: ids[to], relationshipType, sourceOutputRole, targetInputRole, reason: `${from} supplies ${to}`, createdAt: now, createdBy: 'user-request',
  });
  const edges = [
    edge('trigger', 'workbook', 'initiates'), edge('trigger', 'fx-api', 'initiates'),
    edge('workbook', 'mapper', 'provides_data_to', 'rows', 'data_rows'),
    edge('mapper', 'mapping-review', 'checked_by', 'unmatched_rows', 'checked_items'),
    edge('mapper', 'rollup', 'aggregates_into', 'mapped_rows', 'mapped_rows'),
    edge('rollup', 'pnl-calculation', 'transforms_into', 'named_values', 'named_values'),
    edge('pnl-calculation', 'reconciliation-review', 'checked_by', 'calculated_results', 'checked_items'),
    edge('pnl-calculation', 'pnl-results', 'provides_data_to', 'calculated_results', 'computed_values'),
    edge('pnl-calculation', 'tax-calculation', 'depends_on', 'named_values', 'named_values'),
    edge('fx-api', 'tax-calculation', 'provides_data_to', 'named_values', 'named_values'),
    edge('tax-calculation', 'pnl-results', 'provides_data_to', 'calculated_results', 'computed_values'),
    edge('pnl-results', 'evidence', 'feeds_output_input', 'computed_values', 'protected_values'),
    edge('mapping-review', 'evidence', 'included_in_output_preview', 'review_status', 'review_findings'),
    edge('reconciliation-review', 'evidence', 'included_in_output_preview', 'review_status', 'review_findings'),
  ];
  // Validate actual catalog relationships and port contracts, not only the backup's JSON shape.
  for (const connection of edges) {
    const source = blocks.find((item) => item.id === connection.sourceBlockId)!;
    const target = blocks.find((item) => item.id === connection.targetBlockId)!;
    assert.ok(isWorkflowRelationshipAllowed({ sourceFamily: source.family, targetFamily: target.family, relationshipType: connection.relationshipType }), `Unsupported relationship: ${connection.id}`);
    if (source.family === 'Trigger') {
      assert.equal(connection.relationshipType, 'initiates');
      assert.equal(connection.sourceOutputRole, undefined);
      assert.equal(connection.targetInputRole, undefined);
      continue;
    }
    const sourceTool = LOCAL_TOOL_REGISTRY[getToolIdForBlock(source)];
    const targetTool = LOCAL_TOOL_REGISTRY[getToolIdForBlock(target)];
    const sourceRole = sourceTool.outputRoles.find((role) => role.id === connection.sourceOutputRole);
    const targetRole = targetTool.inputRoles.find((role) => role.id === connection.targetInputRole);
    assert.ok(sourceRole, `Unknown output role: ${connection.id}`);
    assert.ok(targetRole, `Unknown input role: ${connection.id}`);
    assert.ok(!sourceRole.canRouteToFamilies || sourceRole.canRouteToFamilies.includes(target.family), `Output route disallowed: ${connection.id}`);
    assert.ok(!targetRole.acceptedFamilies || targetRole.acceptedFamilies.includes(source.family), `Input family disallowed: ${connection.id}`);
    assert.ok(!targetRole.acceptedOutputTypes || targetRole.acceptedOutputTypes.includes(sourceRole.outputType), `Input type disallowed: ${connection.id}`);
  }
  const structure = getWorkflowStructure(blocks);
  const definition: WorkflowDefinition = {
    schemaVersion: 'workflow-studio.local.v1', id, name: 'New FAPI Calc', status: 'draft', blocks, edges, structure,
    description: 'Generic worksheet for FAPI lines, EUR/CAD summaries and the actual 2024 EUR P&L reconciliation. Requires reviewed tax inputs; accounting support remains distinct.',
    metadata: { kind: 'generic-fiscal-workflow', tags: ['fapi', '2024', 'EUR', 'user-workbook'], createdBy: 'user-request', updatedBy: 'user-request', createdAt: now, updatedAt: now,
      notes: 'Account mappings describe accounting presentation only; they do not determine FAPI tax treatment. All FAPI tax operands remain blank until reviewed. Zero is accepted only when explicitly supplied. Rebind inputs to reviewed source or rollup fields when appropriate. Existing FAPI formulas are preserved without tax-policy changes. The annual mean EUR/CAD API value is context-specific, not a claim about the legally required conversion method. Original workbook binary must be retained separately. No mock runs or synthetic tax values are included.' },
    runtimeUiConfig: generateRuntimeUiConfigFromParts({ blocks, structure, sourceWorkflowId: id, generatedAt: now }),
    outputMappingPreview: generateOutputMappingPreviewFromParts({ blocks, edges, sourceWorkflowId: id, generatedAt: now }),
    mockRuns: [], versionSnapshots: [], aiProposals: [], events: [],
  };
  const entry = saveVersion(createWorkflow(id, 'blank', definition), now);
  const backup = workflowBackup({ [id]: entry });
  const roundtrip = validateWorkflowLibrary(JSON.parse(JSON.stringify(backup)));
  assert.deepEqual(roundtrip[id].draft.blocks.find((item) => item.id === ids['tax-calculation'])!.config.inputValues, {});
  assert.deepEqual(roundtrip[id].draft.blocks.find((item) => item.id === ids['tax-calculation'])!.config.inputDefaults ?? {}, {});
  assert.deepEqual(roundtrip[id].draft.blocks.find((item) => item.id === ids['tax-calculation'])!.config.inputChoices ?? {}, {});
  assert.deepEqual(roundtrip[id].draft.blocks.find((item) => item.id === ids['pnl-results'])!.config.worksheetLines, worksheetLines);
  assert.deepEqual(roundtrip[id].draft.blocks.find((item) => item.id === ids['tax-calculation'])!.config.formulas, [...FAPI_LINES_CALC_RULES, ...FAPI_SUMMARY_CALC_RULES]);
  for (const line of worksheetLines) {
    const calculator = blocks.find((item) => item.id === line.calculationBlockId)!;
    assert.ok((calculator.config.formulas as Array<{ resultKey: string }>).some((rule) => rule.resultKey === line.resultKey), `Worksheet line must refer to a real formula: ${line.id}`);
    assert.ok(edges.some((connection) => connection.sourceBlockId === calculator.id && connection.targetBlockId === ids['pnl-results'] && connection.status === 'active'), `Worksheet calculator must be directly connected: ${line.id}`);
  }
  assert.equal(roundtrip[id].runs.length, 0);
  const actual = executeDurableWorkflow(roundtrip[id].draft, 'new-fapi-actual-verification');
  const results = Object.fromEntries(actual.result.results.map((result) => [result.blockId, result]));
  const output = (key: string) => results[ids[key]].output as Record<string, any>;
  const mapping = output('mapper');
  assert.equal(mapping.mappedRows.length, 72);
  assert.equal(mapping.unmatchedRows.length, 0);
  assert.equal(mapping.conflicts.length, 0);
  const rent = mapping.mappedRows.find((row: any) => row.account === '68010');
  assert.equal(rent.categoryId, 'officeRentExpense');
  close(rent.amount, 223519.91, 'Office rent expense');
  for (const row of mapping.mappedRows) close(row.amount, rows.find((item) => item.rowId === row.rowId)!.amount, `Preserved sign ${row.rowId}`);
  const rollup = output('rollup');
  const categoryTotals = rollup.categoryTotals;
  for (const rule of rollupRules) assert.ok(rule.includeCategoryIds.every((category) => !category.startsWith('pnl_reference_')));
  assert.equal(rollup.excludedRows.length, 3);
  close(rollup.rollupTotals.pnl_sales, 3866031.62, 'Sales');
  close(rollup.rollupTotals.pnl_cost_of_sales, 2564053.61, 'Cost of sales');
  close(rollup.rollupTotals.pnl_overheads, 813452.21, 'Overheads');
  close(rollup.rollupTotals.pnl_other_signed, -180446.38, 'Other signed items');
  const pnl = output('pnl-calculation').calculatedResults;
  assert.equal(results[ids['pnl-calculation']].status, 'success', JSON.stringify(results[ids['pnl-calculation']].errors));
  for (const [key, expected] of Object.entries({ PNL_SALES: 3866031.62, PNL_COST_OF_SALES: 2564053.61, PNL_OVERHEADS: 813452.21, PNL_OTHER_SIGNED: -180446.38, PNL_GROSS: 1301978.01, PNL_OPERATING: 488525.8, PNL_NET: 308079.42, PNL_DIFF_GROSS: 0, PNL_DIFF_OPERATING: 0, PNL_DIFF_NET: 0 })) close(pnl[key], expected, key);
  assert.equal(output('reconciliation-review').pass, true);
  assert.equal(results[ids['tax-calculation']].status, 'error');
  const requirements = output('tax-calculation').calculationSummary.inputRequirements;
  assert.equal(requirements.filter((item: any) => item.status !== 'provided').length, 17);
  assert.deepEqual(requirements.filter((item: any) => item.status === 'missing').map((item: any) => item.name).sort(), [...manualInputs].sort());
  assert.equal(requirements.find((item: any) => item.name === 'fxRate').status, 'provided');
  assert.ok(!('NET_FAPI' in (output('tax-calculation').calculatedResults ?? {})));
  const started = startSession(entry, 1, 'readiness-verification', now);
  const readiness = sessionContext(started, getSession(started, 'readiness-verification'));
  assert.equal(readiness.steps.find((step) => step.id === ids['tax-calculation'])!.inputRequired, true);
  assert.equal(readiness.steps.find((step) => step.id === ids.workbook)!.inputRequired, false);
  const fxRate = output('fx-api').namedValues.fxRate;
  assert.ok(Number.isFinite(fxRate) && fxRate > 0);
  const worksheetBlock = definition.blocks.find((item) => item.id === ids['pnl-results'])!;
  const unopenedWorksheet = projectFieldWorksheet({ definition, block: worksheetBlock, results: {} });
  assert.deepEqual(unopenedWorksheet.errors, []);
  assert.equal(unopenedWorksheet.lines.length, worksheetLines.length);
  assert.ok(unopenedWorksheet.lines.every((line) => line.status === 'missing' && line.value === undefined));
  for (const line of worksheetLines) {
    const projected = unopenedWorksheet.lines.find((item) => item.id === line.id)!;
    assert.equal(projected.presentation, line.presentation);
    assert.equal(projected.group, line.group);
    assert.equal(projected.description, line.description);
    assert.equal(projected.decimalPlaces, line.decimalPlaces);
  }
  // Project the already captured accounting evidence before attempting tax, as a guided run does.
  const accountingResults = Object.fromEntries(Object.entries(results).filter(([blockId]) => ![ids['tax-calculation'], ids['pnl-results'], ids.evidence].includes(blockId)));
  const partialWorksheet = projectFieldWorksheet({ definition, block: worksheetBlock, results: accountingResults });
  assert.deepEqual(partialWorksheet.errors, []);
  const accountingLines = partialWorksheet.lines.filter((line) => line.calculationBlockId === ids['pnl-calculation']);
  const taxLines = partialWorksheet.lines.filter((line) => line.calculationBlockId === ids['tax-calculation']);
  assert.equal(accountingLines.length, 10);
  assert.ok(accountingLines.every((line) => line.status === 'current'));
  assert.equal(taxLines.length, 26);
  assert.ok(taxLines.every((line) => line.status === 'missing' && line.value === undefined));
  for (const line of accountingLines) close(line.value!, pnl[line.resultKey], `Partial accounting line ${line.id}`);

  // Deliberately separate, synthetic arithmetic smoke test; never persisted to the import artifact.
  const smoke = structuredClone(definition);
  const syntheticValues = Object.fromEntries(manualInputs.map((name) => [name, 0]));
  Object.assign(syntheticValues, { pCoefficient: 1, income_bucket: 1000, expense_bucket: 100, inclusionRate: 0.5, fatPaid: 25, rtf: 4 });
  smoke.blocks.find((item) => item.id === ids['tax-calculation'])!.config.inputValues = syntheticValues;
  const smokeRun = executeDurableWorkflow(smoke, 'synthetic-arithmetic-smoke-only');
  const smokeTax = smokeRun.result.results.find((result) => result.blockId === ids['tax-calculation'])!;
  assert.equal(smokeTax.status, 'success');
  const smokeResults = (smokeTax.output as any).calculatedResults;
  close(smokeResults.NET_FAPI, 800, 'Synthetic net FAPI');
  close(smokeResults.NET_FAPI_CAD, 800 * fxRate, 'Synthetic CAD conversion');
  assert.deepEqual(definition.blocks.find((item) => item.id === ids['tax-calculation'])!.config.inputValues, {});
  const smokeWorksheet = smokeRun.result.results.find((result) => result.blockId === ids['pnl-results'])!;
  assert.equal(smokeWorksheet.status, 'success');
  const worksheetValues = (smokeWorksheet.output as any).computedValues;
  assert.equal(Object.keys(worksheetValues).length, worksheetLines.length);
  for (const line of worksheetLines) close(worksheetValues[line.id], line.calculationBlockId === ids['tax-calculation'] ? smokeResults[line.resultKey] : pnl[line.resultKey], `Qualified worksheet value ${line.id}`);
  const smokeEvidence = smokeRun.result.results.find((result) => result.blockId === ids.evidence)!;
  assert.ok(['success', 'warning'].includes(smokeEvidence.status));
  assert.ok(smokeEvidence.evidenceRefs.some((ref) => ref.sourceBlockId === ids.workbook), 'Final evidence retains workbook provenance through the Field');
  assert.ok(smokeEvidence.sourceTrace.some((ref) => ref.sourceBlockId === ids['fx-api']), 'Final evidence retains API provenance through the Field');
  assert.equal((smokeEvidence.output as any).formulas.length, 2, 'Final evidence retains both calculator traces');

  // Exercise the guided, isolated-block handoff too. Run choices remain solely in
  // this in-memory session; source context must reach Field without stale claims.
  const guidedId = 'synthetic-guided-smoke-only';
  let guided = startSession(structuredClone(entry), 1, guidedId, now);
  const guidedRuntime: GraphRuntime = {
    createId: () => 'synthetic-guided-block-only',
    resolveToolId: getToolIdForBlock,
    getTool: (toolId) => LOCAL_TOOL_REGISTRY[toolId] ?? null,
  };
  const guidedAction = (action: SessionAction) => {
    const current = getSession(guided, guidedId);
    guided = changeSession(guided, guidedId, current.revision, action, guidedRuntime, now);
  };
  guidedAction({ kind: 'inputs', blockId: ids['tax-calculation'], patch: {
    inputChoices: Object.fromEntries(Object.entries(syntheticValues).map(([name, value]) => [name, { kind: 'manual', value }])),
  } });
  guidedAction({ kind: 'resume' });
  for (let step = 0; step < blocks.length + 2; step++) {
    const current = getSession(guided, guidedId);
    if (current.paused) break;
    const context = sessionContext(guided, current);
    const next = context.steps.find((item) => item.ready && !item.inputRequired && ['pending', 'outdated'].includes(item.status));
    if (next) guidedAction({ kind: 'block', blockId: next.id });
    else {
      assert.ok(context.steps.every((item) => ['success', 'warning', 'reviewed'].includes(item.status)), 'Synthetic guided handoff must finish all required blocks');
      guidedAction({ kind: 'record' });
    }
  }
  const guidedSession = getSession(guided, guidedId);
  assert.equal(guidedSession.paused, true);
  assert.ok(Object.values(guidedSession.results).every((result) => ['success', 'warning'].includes(result.status)), 'No fabricated review acknowledgement may hide a missing/stale guided result');
  const guidedTax = guidedSession.results[ids['tax-calculation']];
  close((guidedTax.output as any).calculatedResults.NET_FAPI, 800, 'Guided synthetic net FAPI');
  close((guidedTax.output as any).calculatedResults.NET_FAPI_CAD, 800 * fxRate, 'Guided synthetic CAD conversion');
  const guidedWorksheet = guidedSession.results[ids['pnl-results']];
  assert.equal(guidedWorksheet.status, 'success');
  assert.equal(Object.keys((guidedWorksheet.output as any).computedValues).length, worksheetLines.length);
  assert.ok((guidedWorksheet.output as any).worksheet.lines.every((line: any) => line.status === 'current'), 'Guided Field retains current transitive source context');
  const guidedEvidence = guidedSession.results[ids.evidence];
  assert.ok(['success', 'warning'].includes(guidedEvidence.status));
  assert.ok(guidedEvidence.evidenceRefs.some((ref) => ref.sourceBlockId === ids.workbook));
  assert.ok(guidedEvidence.sourceTrace.some((ref) => ref.sourceBlockId === ids['fx-api']));
  assert.deepEqual(entry.sessions ?? [], []);
  assert.deepEqual(entry.draft.blocks.find((item) => item.id === ids['tax-calculation'])!.config.inputValues, {});
  write('new-fapi-calc.backup.json', backup);
  write('verification-evidence.json', {
    verifiedAt: now, workflowId: id, workbook: { fileName: workbook.fileName, contentHash: extraction.contentHash, sheet: sheet.sheetName, currency: 'EUR', period: '2024-01-01 through 2024-12-31', rows: rows.length, detailRows: 69, referenceRows: 3, originalBinaryStored: false },
    mapping: { mappedRows: mapping.mappedRows.length, unmatchedRows: 0, conflicts: 0, officeRent: { account: rent.account, category: rent.categoryId, amount: rent.amount }, originalSignsPreserved: true, categoryTotals },
    accounting: { rollupTotals: rollup.rollupTotals, excludedReferenceRows: rollup.excludedRows, calculatedResults: pnl, checks: output('reconciliation-review').formulaConsistency, rowTrace: rollup.includedRowsByRollup },
    api: { url: api.config.url, fetchedAt: response.capturedAt, responseMeta: response.responseMeta, rawResponseHash, fxRate, unit: 'CAD/EUR', method: 'Arithmetic mean of available daily EUR/CAD observations in calendar 2024; appropriateness remains subject to user review.' },
    graph: { blocks: blocks.length, connections: edges.length, allFamilyRelationshipsAllowed: true, allDataRolesKnownAndCompatible: true, triggerEdgesAreControlOnly: true },
    worksheet: { blockId: ids['pnl-results'], lines: worksheetLines, presentation: { primary: 2, summary: 9, detail: 25, primaryResultIds: ['NET_FAPI', 'NET_FAPI_CAD'], detailGroups: ['FAPI lines', 'Accounting support'], displayRoundingDoesNotChangeValues: true }, taxFormulaCount: fapiRules.length, accountingSupportCount: pnlRules.length, referencesAreCalculatorQualified: true, taxFormulasUnchanged: true, noTaxDefaults: true, preTaxProjection: { purpose: 'Shared worksheet projection using actual accounting/source results before attempting tax; no tax result or execution history is fabricated.', currentAccountingLines: accountingLines.map(({ id, value }) => ({ id, value })), missingTaxLineIds: taxLines.map((line) => line.id) }, fullValuesAndProvenanceVerifiedOnlyWithSyntheticInputs: true },
    readiness: { missingManualTaxInputs: manualInputs, requirements, noTaxResultProduced: true, sourceReady: true, noSyntheticInputsInBackup: true, noApprovalRecorded: true },
    syntheticSmokeTest: { purpose: 'Engine arithmetic and API binding only. These numbers are invented test inputs, not user tax facts, and are excluded from the backup.', inputs: syntheticValues, results: smokeResults, pass: true, guidedHandoff: { pass: true, requiredBlocksExecuted: Object.keys(guidedSession.results).length, worksheetCurrentLines: worksheetLines.length, noReviewBypass: true, finalSourceProvenanceRetained: true, runOnlyChoicesNeverPersistedToBackup: true } },
    checksPassed: ['Portable backup schema and import roundtrip', 'All family relationships and data ports are catalog-compatible', '36 calculator-qualified worksheet lines reference real connected formulas', 'All existing tax formulas unchanged and no tax defaults introduced', 'Actual workbook parsed by app parser', '72 exact mappings, zero unmatched and conflicts', 'Office rent is an expense', 'Original amounts and signs preserved', '3 summary references excluded from accounting profit aggregation', '4 independent account subtotals and 3 reconstructed profits reconcile', '17 missing tax values stop FAPI', 'Guided run exposes missing tax inputs while source is ready', 'Live API capture and request signature retained', 'Separate synthetic arithmetic smoke passes', 'Synthetic complete worksheet preserves every value and final workbook/API provenance'],
  });
  process.stdout.write(JSON.stringify({ backup: resolve(out, 'new-fapi-calc.backup.json'), workflowId: id, PNL_NET: pnl.PNL_NET, fxRate, missingManualInputs: manualInputs.length, checks: 'passed' }) + '\n');
}
main().catch((error) => { process.stderr.write(`${error.stack ?? error}\n`); process.exitCode = 1; });
