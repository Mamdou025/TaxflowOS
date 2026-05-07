import type { RollupRule } from "./schema";

export const SAMPLE_ROLLUP_RULES: RollupRule[] = [
  {
    description: "Adds income categories.",
    includeCategoryIds: [
      "interestIncome",
      "rents",
      "royalties",
      "dividends",
      "otherFapiIncome",
    ],
    label: "Income Bucket",
    operation: "sum",
    rollupId: "income_bucket",
  },
  {
    description: "Adds expense categories using absolute category totals.",
    includeCategoryIds: [
      "generalExpenses",
      "legalExpenses",
      "accountingExpenses",
    ],
    label: "Expense Bucket",
    operation: "sum_abs",
    rollupId: "expense_bucket",
  },
];
