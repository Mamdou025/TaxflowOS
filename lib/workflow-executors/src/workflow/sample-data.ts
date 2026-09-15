export const LOCAL_SAMPLE_DATASET = {
  period: 'FY2025 Q4',
  entity: 'FAPI Sample Entity',
  sourceDocuments: [
    'trial-balance.xlsx',
    'financial-statements.pdf',
    'notes-to-financial-statements.pdf',
    'fx-rate-source.json',
    'review-overrides.json',
  ],
  rows: [
    {
      jurisdiction: 'Canada',
      revenue: 1_280_000,
      deductibleExpenses: 740_000,
      protectedInput: false,
      taxAttribute: 'foreign accrual property income',
    },
    {
      jurisdiction: 'United States',
      revenue: 840_000,
      deductibleExpenses: 510_000,
      protectedInput: false,
      taxAttribute: 'interest allocation',
    },
    {
      jurisdiction: 'United Kingdom',
      revenue: 610_000,
      deductibleExpenses: 455_000,
      protectedInput: true,
      taxAttribute: 'withholding reserve',
    },
  ],
};
