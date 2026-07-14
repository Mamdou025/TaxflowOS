// ─────────────────────────────────────────────────────────────────────────────
// FAPI mapping rules — ported from the authoritative Platform repo.
//
// `fapi-concept-cards.json` is a copy of Platform's
// backend/config/fapi-concept-cards.json (the source of truth for how accounts
// are classified into FAPI lines). This transforms each concept card into the
// keyword-rule shape the TaxflowOS keyword mapper consumes:
//   • positiveIndicators + frenchPositiveIndicators → keywords
//   • negativeIndicators + frenchNegativeIndicators → excludeKeywords (disqualify)
//   • lineId / fieldName → the mapper's line + category targets
//
// So Sofi now classifies with Platform's exact vocabulary (bilingual, with
// negative indicators), instead of the old 18 static demo keywords.
// ─────────────────────────────────────────────────────────────────────────────

import conceptCards from './fapi-concept-cards.json';

type ConceptCard = {
  fieldName: string;
  lineId: string;
  subsectionId: string | null;
  label: string;
  positiveIndicators?: string[];
  negativeIndicators?: string[];
  frenchPositiveIndicators?: string[];
  frenchNegativeIndicators?: string[];
};

export type MappingRule = {
  ruleId: string;
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
  excludeKeywords: string[];
  confidence: number;
  matchMode: 'all_words';
  lineId: string;
  target: string;
};

const lc = (arr?: string[]) => (arr ?? []).map((s) => s.toLowerCase().trim()).filter(Boolean);

/** Platform's FAPI classification vocabulary, as mapper rules. */
export const FAPI_PLATFORM_RULES: MappingRule[] = (conceptCards as ConceptCard[]).map((c) => ({
  ruleId: `platform-${c.fieldName}`,
  categoryId: c.fieldName,
  categoryLabel: c.label,
  keywords: lc([...(c.positiveIndicators ?? []), ...(c.frenchPositiveIndicators ?? [])]),
  excludeKeywords: lc([...(c.negativeIndicators ?? []), ...(c.frenchNegativeIndicators ?? [])]),
  confidence: 0.9,
  // Word-order- + plural-tolerant matching so real GL labels like
  // "Investment Income - Interest" match the "interest income" indicator.
  matchMode: 'all_words',
  lineId: c.lineId,
  target: c.fieldName,
}));

// ─────────────────────────────────────────────────────────────────────────────
// Supplemental rules — FAPI lines the concept cards don't cover.
//
// The 10 concept cards classify property-income (line A) and expense rows. But a
// trial balance also carries rows that drive OTHER lines: CFA income (C), debt
// forgiveness (A1), business losses (D), foreign accrual capital losses (E), and
// "foreign accrual property income" (line A / otherFapiIncome). Platform routes
// these via its field-routing registry; here we classify them so they reach the
// lines engine as named values (categoryId → named value, then C = cfaIncome,
// A1 = 2×debtForgiveness, D = businessLosses, E = faclCarryforward). Deduction
// lines (D, E) come from negative rows — a sum_abs rollup rule flips their sign.
// All use all_words matching (word-order + plural tolerant).
// ─────────────────────────────────────────────────────────────────────────────
export const FAPI_SUPPLEMENTAL_RULES: MappingRule[] = [
  {
    ruleId: 'supp-cfaIncome',
    categoryId: 'cfaIncome',
    categoryLabel: 'Controlled foreign affiliate income (C)',
    keywords: [
      'controlled foreign corporation income', 'controlled foreign affiliate income',
      'controlled foreign corporation', 'controlled foreign affiliate', 'cfc income', 'cfa income',
    ],
    excludeKeywords: ['loss', 'expense', 'payable'],
    confidence: 0.9, matchMode: 'all_words', lineId: 'C', target: 'cfaIncome',
  },
  {
    ruleId: 'supp-debtForgiveness',
    categoryId: 'debtForgiveness',
    categoryLabel: 'Debt forgiveness (A1)',
    keywords: ['debt forgiveness income', 'debt forgiveness', 'forgiveness of debt'],
    excludeKeywords: ['expense', 'payable'],
    confidence: 0.9, matchMode: 'all_words', lineId: 'A1', target: 'debtForgiveness',
  },
  {
    ruleId: 'supp-businessLosses',
    categoryId: 'businessLosses',
    categoryLabel: 'Business losses (D)',
    keywords: ['business investment losses', 'business investment loss', 'allowable business investment loss', 'business loss'],
    excludeKeywords: ['income', 'gain'],
    confidence: 0.9, matchMode: 'all_words', lineId: 'D', target: 'businessLosses',
  },
  {
    ruleId: 'supp-faclCarryforward',
    categoryId: 'faclCarryforward',
    categoryLabel: 'Foreign accrual capital losses (E)',
    keywords: ['foreign accrual capital losses', 'foreign accrual capital loss', 'facl carryforward'],
    excludeKeywords: ['income', 'gain', 'property'],
    confidence: 0.9, matchMode: 'all_words', lineId: 'E', target: 'faclCarryforward',
  },
  {
    ruleId: 'supp-otherFapiIncome',
    categoryId: 'otherFapiIncome',
    categoryLabel: 'Other FAPI income',
    keywords: ['foreign accrual property income', 'foreign exchange gains', 'foreign exchange gain', 'fapi income'],
    excludeKeywords: ['loss', 'expense', 'payable'],
    confidence: 0.9, matchMode: 'all_words', lineId: 'A', target: 'otherFapiIncome',
  },
];

/** Full FAPI classification vocabulary: Platform concept cards + supplemental
 *  line rules. This is what the FAPI run feeds the keyword mapper. */
export const FAPI_MAPPING_RULES: MappingRule[] = [...FAPI_PLATFORM_RULES, ...FAPI_SUPPLEMENTAL_RULES];

/** Human-readable summary of the ported vocabulary (used in audits/tests). */
export const FAPI_PLATFORM_RULE_SUMMARY = FAPI_MAPPING_RULES.map(
  (r) => `${r.categoryId} → line ${r.lineId} (+${r.keywords.length} / -${r.excludeKeywords.length})`
);
