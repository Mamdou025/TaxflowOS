'use client';

import { createFapiTemplateWorkflow } from '@/lib/local-fiscal-workflow';
import { FAPI_LINES_CALC_RULES, FAPI_SUMMARY_CALC_RULES } from '@/lib/workflow/sample-workflows/fapi-template';
import { FAPI_MAPPING_RULES } from './fapi-mapping';
import type { TemplateConfig, SourceRow, CategoryOption } from './engine';

const ROWS: SourceRow[] = [
  { rowId: 'tb-1', account: '4000', label: 'Interest income', description: 'Bank interest earned on deposits', amount: 12000, currency: 'USD' },
  { rowId: 'tb-2', account: '4100', label: 'Rental income', description: 'Lease income from real property', amount: 8000, currency: 'USD' },
  { rowId: 'tb-3', account: '4200', label: 'Dividend income', description: 'Dividend income from portfolio shares', amount: 5000, currency: 'USD' },
  { rowId: 'tb-4', account: '4300', label: 'Capital gains', description: 'Capital gains on disposition of shares', amount: 6000, currency: 'USD' },
  { rowId: 'tb-5', account: '5000', label: 'General expenses', description: 'Operating expenses for the period', amount: -1500, currency: 'USD' },
  { rowId: 'tb-6', account: '5100', label: 'Legal expenses', description: 'Legal advisory fees', amount: -900, currency: 'USD' },
  { rowId: 'tb-7', account: '5200', label: 'Accounting expenses', description: 'Accounting service fees', amount: -600, currency: 'USD' },
  { rowId: 'tb-8', account: '4900', label: 'Management fees from CFA', description: 'Intercompany management fee income', amount: 4500, currency: 'USD' },
];

const CATEGORIES: CategoryOption[] = [
  { id: 'otherFapiIncome', label: 'Other FAPI Income' },
  { id: 'interestIncome', label: 'Interest Income' },
  { id: 'capGains', label: 'Capital Gains' },
  { id: 'generalExpenses', label: 'General Expense' },
  { id: '__skip__', label: 'Leave unmatched' },
];

export const FAPI_CONFIG: TemplateConfig = {
  id: 'fapi',
  name: 'FAPI',
  agentId: 'sofi',
  documentLabel: 'foreign-affiliate trial balance',
  resultPage: 'fapi',
  steps: [
    { label: 'Collect source documents', sub: 'Foreign-affiliate trial balance' },
    { label: 'Classify & categorize income', sub: 'Keyword mapper → FAPI categories' },
    { label: 'Compute FAPI', sub: 'Rollup + two-stage calculation engine' },
    { label: 'Review & approve', sub: 'Human sign-off on the figures' },
  ],
  buildSnapshot: createFapiTemplateWorkflow as unknown as TemplateConfig['buildSnapshot'],
  sampleRows: ROWS,
  sourceBlockId: 'fapi-source-trial-balance',
  mapperBlockId: 'fapi-logic-keyword-mapper',
  rollupBlockId: 'fapi-logic-category-rollup',
  linesBlockId: 'fapi-logic-lines-engine',
  summaryBlockId: 'fapi-logic-summary-engine',
  linesRules: FAPI_LINES_CALC_RULES,
  summaryRules: FAPI_SUMMARY_CALC_RULES,
  mapperRules: FAPI_MAPPING_RULES as unknown as Array<Record<string, unknown>>,
  // Unmatched rows don't hard-block the run — they're left out of the calc and
  // surfaced as a non-blocking review banner; categorizing them is optional.
  defaultRouteUnmatched: true,
  bucketKeys: ['income_bucket', 'expense_bucket', 'capGains', 'debtForgiveness', 'priorYearG', 'cfaIncome', 'businessLosses'],
  lineKeys: ['A', 'EXPENSES', 'COMPUTATION_95_4', 'A1', 'A2', 'B', 'C', 'D', 'E', 'F', 'F1', 'G', 'H'],
  categoryOptions: CATEGORIES,
  headlineKey: 'GROSS',
  currency: 'USD',
  editableInputs: [
    { key: 'fxRate', label: 'FX rate (USD → CAD)', default: 1.35, step: 0.01, hint: 'Bank of Canada annual average', block: { blockId: 'fapi-source-fx-rate', configKey: 'overrideRate' } },
    { key: 'inclusionRate', label: 'Inclusion rate', default: 0.5, step: 0.05, hint: 'Taxable portion of capital gains', block: { blockId: 'fapi-source-inputs', configKey: 'inclusionRate' } },
    { key: 'pCoefficient', label: 'P-coefficient', default: 1, step: 0.05, hint: 'Participating % applied to property income & expenses (line A)', block: { blockId: 'fapi-source-inputs', configKey: 'pCoefficient' } },
    { key: 'canadianRules95_4', label: '95(2) amount', default: 0, step: 100, hint: 'Canadian 95(2) rules amount (flows into line A)', block: { blockId: 'fapi-source-inputs', configKey: 'canadianRules95_4' } },
    { key: 'debtForgiveness', label: 'Line A.1 · Debt forgiveness', default: 0, step: 100, hint: 'A1 = 2 × debt forgiveness', block: { blockId: 'fapi-source-inputs', configKey: 'debtForgiveness' } },
    { key: 'priorYearG', label: 'Line A.2 · Prior-year G', default: 0, step: 100, hint: 'Prior-year G carried forward', block: { blockId: 'fapi-source-inputs', configKey: 'priorYearG' } },
    { key: 'cfaIncome', label: 'Line C · CFA income', default: 0, step: 100, hint: 'Controlled foreign affiliate income', block: { blockId: 'fapi-source-inputs', configKey: 'cfaIncome' } },
    { key: 'businessLosses', label: 'Line D · Business losses', default: 0, step: 100, hint: 'Deductible business losses', block: { blockId: 'fapi-source-inputs', configKey: 'businessLosses' } },
    { key: 'faclCarryforward', label: 'Line E · FACL carryforward', default: 0, step: 100, hint: 'Foreign accrual capital loss carryforward', block: { blockId: 'fapi-source-inputs', configKey: 'faclCarryforward' } },
    { key: 'prescribedAmount', label: 'Line F · Prescribed amount', default: 0, step: 100, hint: 'Prescribed deductible amount', block: { blockId: 'fapi-source-inputs', configKey: 'prescribedAmount' } },
    { key: 'prescribedAmountF1', label: 'Line F.1 · Prescribed amount', default: 0, step: 100, hint: 'Prescribed deductible amount (F.1)', block: { blockId: 'fapi-source-inputs', configKey: 'prescribedAmountF1' } },
    { key: 'dividendDeductions', label: 'Line G · Dividend deductions', default: 0, step: 100, hint: 'Deductions for dividends', block: { blockId: 'fapi-source-inputs', configKey: 'dividendDeductions' } },
    { key: 'partnershipDividends', label: 'Line H · Partnership dividends', default: 0, step: 100, hint: 'Partnership dividend deductions', block: { blockId: 'fapi-source-inputs', configKey: 'partnershipDividends' } },
    { key: 'fatPaid', label: 'FAT · Foreign accrual tax paid', default: 100, step: 50, hint: 'Feeds FAT deduction = min(FAT × RTF, FAPI brut)', block: { blockId: 'fapi-source-inputs', configKey: 'fatPaid' } },
  ],
};
