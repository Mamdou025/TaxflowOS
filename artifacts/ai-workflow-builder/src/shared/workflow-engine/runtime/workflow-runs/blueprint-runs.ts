

// ─────────────────────────────────────────────────────────────────────────────
// Representative run configs for the calculation-type portfolio blueprints.
//
// The 15 portfolio workflows are STRUCTURAL blueprints. The calculation ones
// (T1134, surplus, T106, EIFEL, T2, provision, Part XIII) get a runnable
// TemplateConfig here so the full Run → Results flow works end-to-end — using the
// SAME generic deterministic engine the FAPI/expense demos use: real classify →
// rollup of the uploaded/sample rows, then a `computeExtra` that nets income vs
// expense. The FIGURES ARE REPRESENTATIVE (a demo income/expense pipeline), NOT
// authoritative tax computation — a real per-workflow engine (real T1134/EIFEL/…
// math) is a separate, domain-specific build. The Build tab still shows each
// workflow's full structural graph. Foundation/Platform blueprints (ownership
// graph, ledgers, portfolio ops, the platform services) are not calculations, so
// they stay structural (no run config).
// ─────────────────────────────────────────────────────────────────────────────

import { createPortfolioWorkflow } from '@/shared/workflow-engine/local-fiscal-workflow';
import type { PortfolioWorkflowDef } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import type { TemplateConfig, SourceRow, CategoryOption, DerivedRow, StepDef } from './engine';

const money = (n: number) => Number(n.toFixed(2));

const CATEGORIES: CategoryOption[] = [
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' },
  { id: '__skip__', label: 'Leave unclassified' },
];

const KEYWORD_RULES = [
  { ruleId: 'r-income', categoryId: 'income', categoryLabel: 'Income', keywords: ['income', 'revenue', 'interest income', 'dividend', 'gain', 'earnings', 'management fee', 'royalty', 'rent', 'proceeds'], confidence: 0.9 },
  { ruleId: 'r-expense', categoryId: 'expense', categoryLabel: 'Expense', keywords: ['expense', 'cost', 'loss', 'deduction', 'interest expense', 'charge', 'salaries', 'professional fees', 'depreciation', 'amortization'], confidence: 0.9 },
];

const ROLLUP_RULES = [
  { rollupId: 'income_bucket', label: 'Income', includeCategoryIds: ['income'], operation: 'sum' },
  { rollupId: 'expense_bucket', label: 'Expense', includeCategoryIds: ['expense'], operation: 'sum_abs' },
];

const STEPS: [StepDef, StepDef, StepDef, StepDef] = [
  { label: 'Collect source data', sub: 'Upload the workbook (or use the sample)' },
  { label: 'Classify rows', sub: 'Keyword classifier → income / expense' },
  { label: 'Compute (representative)', sub: 'Aggregate + net the classified amounts' },
  { label: 'Review & approve', sub: 'Sign off on the figures' },
];

function sampleRows(scale: number, currency: string): SourceRow[] {
  const s = (n: number) => Math.round(n * scale);
  return [
    { rowId: 'r1', label: 'Operating revenue', description: 'Business income for the period', amount: s(480000), currency },
    { rowId: 'r2', label: 'Interest income', description: 'Interest earned on balances', amount: s(32000), currency },
    { rowId: 'r3', label: 'Dividend income', description: 'Dividends received', amount: s(18000), currency },
    { rowId: 'r4', label: 'Salaries expense', description: 'Operating cost — salaries', amount: s(-210000), currency },
    { rowId: 'r5', label: 'Interest expense', description: 'Financing cost — interest', amount: s(-45000), currency },
    { rowId: 'r6', label: 'Professional fees', description: 'Advisory and professional fees', amount: s(-28000), currency },
  ];
}

function runDef(id: string, name: string): PortfolioWorkflowDef {
  return {
    id: `bp-run-${id}`,
    name,
    description: '',
    group: 'foundation',
    sub: '',
    blocks: [
      { catalogId: 'trigger:manual', id: 'start', label: 'Start', description: 'Manual start', stage: 0, row: 0 },
      { catalogId: 'source:excel-workbook', id: 'src', label: 'Source data', description: 'Uploaded / sample rows', stage: 0, row: 1, config: { rows: [], requireUpload: true, columns: ['rowId', 'account', 'label', 'description', 'amount', 'currency'], sourceKind: 'excel_workbook', sourceLocator: 'local-excel://awaiting-upload', sourceStatus: 'draft', toolId: 'source.manual_table', outputs: 'selected_rows' } },
      { catalogId: 'logic:classification-mapping', id: 'classify', label: 'Classify', description: 'Income vs expense', stage: 1, row: 1, config: { keywordRules: KEYWORD_RULES, matchFields: ['label', 'description', 'account'], matchMode: 'contains', conflictStrategy: 'highest_confidence', unmatchedStrategy: 'send_to_review', toolId: 'logic.keyword_mapper', inputs: 'data_rows, keyword_rules', outputs: 'mapped_rows, unmatched_rows' } },
      { catalogId: 'logic:category-rollup-aggregator', id: 'rollup', label: 'Aggregate', description: 'Income & expense buckets', stage: 2, row: 1, config: { rollupRules: ROLLUP_RULES, operation: 'sum', toolId: 'logic.category_rollup_aggregator', inputs: 'mapped_rows, rollup_rules', outputs: 'category_totals, rollup_totals, named_values, rollup_summary' } },
      { catalogId: 'logic:calculation-engine', id: 'lines', label: 'Compute', description: 'Representative computation', stage: 3, row: 1, config: { formulas: [], mode: 'auto', toolId: 'logic.calculation_engine', outputs: 'calculated_results' } },
      { catalogId: 'logic:calculation-engine', id: 'summary', label: 'Summary', description: 'Totals', stage: 4, row: 1, config: { formulas: [], mode: 'auto', toolId: 'logic.calculation_engine', outputs: 'calculated_results' } },
      { catalogId: 'output:evidence-pack', id: 'out', label: 'Result', description: 'Manager result', stage: 5, row: 1, config: { toolId: 'output.evidence_pack_preview', outputs: 'preview' } },
    ],
    edges: [
      { from: 'start', to: 'src', label: 'Start', reason: 'Manual start', rel: 'initiates' },
      { from: 'src', to: 'classify', label: 'Rows', reason: 'Classify rows' },
      { from: 'classify', to: 'rollup', label: 'Mapped', reason: 'Aggregate', rel: 'aggregates_into' },
      { from: 'rollup', to: 'lines', label: 'Buckets', reason: 'Compute' },
      { from: 'lines', to: 'summary', label: 'Lines', reason: 'Summarize' },
      { from: 'summary', to: 'out', label: 'Result', reason: 'Output', rel: 'included_in_output_preview' },
    ],
  };
}

type Spec = { id: string; name: string; headline: string; documentLabel: string; scale?: number; currency?: string };

function makeConfig(spec: Spec): TemplateConfig {
  const P = `bp-run-${spec.id}`;
  const currency = spec.currency ?? 'USD';
  const def = runDef(spec.id, spec.name);
  return {
    id: spec.id,
    name: spec.name,
    documentLabel: spec.documentLabel,
    // A shared demo income/expense engine stands in for each blueprint's real
    // domain math — the worksheet must say so.
    representative: true,
    steps: STEPS,
    buildSnapshot: (() => createPortfolioWorkflow(def)) as unknown as TemplateConfig['buildSnapshot'],
    sampleRows: sampleRows(spec.scale ?? 1, currency),
    sourceBlockId: `${P}--src`,
    mapperBlockId: `${P}--classify`,
    rollupBlockId: `${P}--rollup`,
    linesBlockId: `${P}--lines`,
    summaryBlockId: `${P}--summary`,
    linesRules: [],
    summaryRules: [],
    defaultRouteUnmatched: true,
    bucketKeys: ['income_bucket', 'expense_bucket'],
    lineKeys: ['INCOME', 'EXPENSE'],
    categoryOptions: CATEGORIES,
    headlineKey: 'NET',
    currency,
    params: { fxRate: 1.35 },
    editableInputs: [
      { key: 'fxRate', label: 'FX rate (→ CAD)', default: 1.35, step: 0.01, hint: 'Annual average (Bank of Canada)' },
    ],
    computeExtra: ({ rollup, params }): { lines: DerivedRow[]; summary: DerivedRow[]; boundsMin: number; boundsMax: number } => {
      const income = rollup.income_bucket ?? 0;
      const expense = rollup.expense_bucket ?? 0;
      const net = Math.max(income - expense, 0);
      const fx = params.fxRate ?? 1.35;
      const lines: DerivedRow[] = [
        { key: 'INCOME', label: 'Income (classified)', value: money(income), formula: 'sum of income-classified rows' },
        { key: 'EXPENSE', label: 'Expense (classified)', value: money(expense), formula: 'sum of expense-classified rows' },
      ];
      const summary: DerivedRow[] = [
        { key: 'GROSS', label: 'Gross income', value: money(income), formula: 'income bucket' },
        { key: 'DEDUCTIONS', label: 'Deductions', value: money(expense), formula: 'expense bucket' },
        { key: 'NET', label: spec.headline, value: money(net), formula: 'max(income − expense, 0)' },
        { key: 'FX_RATE', label: 'FX rate', value: fx, formula: 'annual average (Bank of Canada)' },
        { key: 'NET_CAD', label: `${spec.headline} (CAD)`, value: money(net * fx), formula: `net × ${fx}` },
      ];
      return { lines, summary, boundsMin: 0, boundsMax: 0 };
    },
  };
}

// The calculation-type blueprints, keyed by the id the workflow page resolves
// (def.id with the "pf-" prefix stripped). fapi stays the real FAPI_CONFIG.
export const BLUEPRINT_RUN_CONFIGS: Record<string, TemplateConfig> = {
  t1134: makeConfig({ id: 't1134', name: 'T1134 Foreign Affiliate Reporting', headline: 'Affiliate net income', documentLabel: 'affiliate financial data', scale: 1.0 }),
  surplus: makeConfig({ id: 'surplus', name: 'Foreign Affiliate Surplus', headline: 'Net surplus movement', documentLabel: 'current-year affiliate activity', scale: 0.7 }),
  t106: makeConfig({ id: 't106', name: 'T106 Related-Party Transaction Reporting', headline: 'Net reportable amount', documentLabel: 'intercompany ledger', scale: 0.5 }),
  eifel: makeConfig({ id: 'eifel', name: 'EIFEL', headline: 'Adjusted taxable income', documentLabel: 'entity financing data', scale: 1.3 }),
  't2-suite': makeConfig({ id: 't2-suite', name: 'T2 Corporate Income Tax Compliance Suite', headline: 'Net income for tax', documentLabel: 'trial balance', scale: 1.1 }),
  'tax-provision': makeConfig({ id: 'tax-provision', name: 'Corporate Tax Provision', headline: 'Current tax base', documentLabel: 'entity financial data', scale: 0.9 }),
  'part-xiii': makeConfig({ id: 'part-xiii', name: 'Part XIII Withholding Tax', headline: 'Net payments to non-residents', documentLabel: 'payments to non-residents', scale: 0.3 }),
};
