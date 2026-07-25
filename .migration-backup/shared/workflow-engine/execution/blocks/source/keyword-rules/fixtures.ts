import type { KeywordRule } from "./schema";

export const SAMPLE_KEYWORD_RULES: KeywordRule[] = [
  {
    categoryId: "interest_income",
    categoryLabel: "Interest Income",
    confidence: 0.9,
    keywords: ["interest income", "interest earned", "bank interest"],
    matchMode: "contains",
    ruleId: "keyword-rule-interest-income",
    suggestedLine: "A",
  },
  {
    categoryId: "rental_income",
    categoryLabel: "Rental Income",
    confidence: 0.9,
    keywords: ["rental income", "rent income", "lease income"],
    matchMode: "contains",
    ruleId: "keyword-rule-rents",
    suggestedLine: "A",
  },
  {
    categoryId: "bank_fees",
    categoryLabel: "Bank Fees",
    confidence: 0.8,
    keywords: ["bank charges", "office expenses", "general expenses"],
    matchMode: "contains",
    ruleId: "keyword-rule-general-expenses",
    suggestedLine: "EXPENSES",
  },
  {
    categoryId: "professional_fees",
    categoryLabel: "Professional Fees",
    confidence: 0.8,
    keywords: ["professional fees", "accounting fees", "audit fees"],
    matchMode: "contains",
    ruleId: "keyword-rule-accounting-expenses",
    suggestedLine: "EXPENSES",
  },
  {
    categoryId: "other_income",
    categoryLabel: "Other Income",
    confidence: 0.7,
    keywords: ["other revenue", "miscellaneous income", "sundry income"],
    matchMode: "contains",
    ruleId: "keyword-rule-other-fapi-income",
    suggestedLine: "A",
  },
];
