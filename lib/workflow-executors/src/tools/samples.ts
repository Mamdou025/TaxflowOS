import { LOCAL_SAMPLE_DATASET } from '@workspace/workflow-executors/workflow/sample-data';
import { type FiscalRow, type KeywordRule } from './types';

export const DEFAULT_TABLE_ROWS: FiscalRow[] = [
  {
    account: '4000',
    amount: 12_000,
    label: 'Interest income',
    rowId: 'tb-row-interest-income',
  },
  {
    account: '4100',
    amount: 8000,
    label: 'Rental income',
    rowId: 'tb-row-rental-income',
  },
  {
    account: '5000',
    amount: -600,
    label: 'Bank charges',
    rowId: 'tb-row-bank-charges',
  },
  {
    account: '5200',
    amount: -1200,
    label: 'Professional fees',
    rowId: 'tb-row-professional-fees',
  },
  {
    account: '6000',
    amount: 3000,
    label: 'Other revenue',
    rowId: 'tb-row-other-revenue',
  },
];

export const DEFAULT_KEYWORD_RULES: KeywordRule[] = [
  {
    categoryId: 'interest_income',
    categoryLabel: 'Interest Income',
    confidence: 0.9,
    keywords: ['interest income', 'interest earned', 'bank interest'],
    ruleId: 'keyword-rule-interest-income',
    suggestedLine: 'A',
  },
  {
    categoryId: 'rental_income',
    categoryLabel: 'Rental Income',
    confidence: 0.9,
    keywords: ['rental income', 'rent income', 'lease income'],
    ruleId: 'keyword-rule-rents',
    suggestedLine: 'A',
  },
  {
    categoryId: 'bank_fees',
    categoryLabel: 'Bank Fees',
    confidence: 0.8,
    keywords: ['bank charges', 'office expenses', 'general expenses'],
    ruleId: 'keyword-rule-general-expenses',
    suggestedLine: 'EXPENSES',
  },
  {
    categoryId: 'professional_fees',
    categoryLabel: 'Professional Fees',
    confidence: 0.8,
    keywords: ['professional fees', 'accounting fees', 'audit fees'],
    ruleId: 'keyword-rule-accounting-expenses',
    suggestedLine: 'EXPENSES',
  },
  {
    categoryId: 'other_income',
    categoryLabel: 'Other Income',
    confidence: 0.7,
    keywords: ['other revenue', 'miscellaneous income', 'sundry income'],
    ruleId: 'keyword-rule-other-fapi-income',
    suggestedLine: 'A',
  },
];

export function getSampleManualRows(): FiscalRow[] {
  return DEFAULT_TABLE_ROWS.map((row) => ({ ...row }));
}

export function getSampleKeywordRules(): KeywordRule[] {
  return DEFAULT_KEYWORD_RULES.map((rule) => ({ ...rule }));
}

export function getSampleSourceDocuments() {
  return LOCAL_SAMPLE_DATASET.sourceDocuments;
}
