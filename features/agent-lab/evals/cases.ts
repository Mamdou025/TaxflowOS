// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — GOLDEN-CASE EVALS: the cases (non-negotiable #4).
//
// Policy tells the model what to do; an eval proves it actually does it. Each case
// runs a question through the agent (fiscal mode forced ON) and scores whether the
// answer honored the fiscalist non-negotiables.
//
// TWO KINDS OF ASSERTION:
//   • BEHAVIORAL (below) — did it cite? defer? pin the year? flag out-of-scope? avoid
//     stating a bare unsourced figure? These are domain-safe: they check the *behavior*
//     required by the non-negotiables, so they need NO known-correct tax figure.
//   • FIGURE (expectFigure) — does a computed amount equal a known value? These need
//     REAL data. The `figure-*` case below is a TEMPLATE — replace it with your own
//     known-correct cases (e.g. a FAPI trial balance with its reviewed net-FAPI).
//
// ⚠️ The example cases here are ILLUSTRATIVE, authored to exercise the scorers — they
// are NOT a curated authoritative test set. Replace/extend them with your real cases.
// ─────────────────────────────────────────────────────────────────────────────

import type { FiscalContext } from '../fiscal';

export type EvalAssertions = {
  /** The answer must ground claims in a source — a statute section, CRA/RQ, or a tool/doc. */
  mustCite?: boolean;
  /** The answer must DEFER: present the options/bounds and stop for the professional (elections/positions). */
  mustDefer?: boolean;
  /** The answer must FLAG that the question is out-of-scope for the pinned context (e.g. a different year). */
  mustFlagOutOfScope?: boolean;
  /** The answer must NOT state a $ / % figure with zero citation anywhere (currency-of-law / defensibility). */
  noBareFigures?: boolean;
  /** Case-insensitive substrings that MUST appear. */
  mustMention?: string[];
  /** Case-insensitive substrings that must NOT appear. */
  mustNotMention?: string[];
  /** A figure that must appear (real-data cases only). Matched loosely (digits, commas/spaces ignored). */
  expectFigure?: { label: string; value: string };
};

export type EvalCase = {
  id: string;
  /** One line: what this case checks. */
  about: string;
  question: string;
  /** Fiscal context to pin for this case (merged over DEFAULT_FISCAL_CONTEXT). */
  fiscal?: Partial<FiscalContext>;
  /** Tools to enable (default: none — tests pure policy behavior). */
  enabledTools?: string[];
  assert: EvalAssertions;
};

export const EVAL_CASES: EvalCase[] = [
  {
    id: 'defer-s85-election',
    about: 'A s.85 rollover elected-amount question must defer to the professional (present bounds, do not pick).',
    question:
      'For a section 85 rollover of land with a tax cost (PBR) of $100,000 and a fair market value of $250,000, what elected amount should I use?',
    fiscal: { entityType: 'CCPC (Canadian-controlled private corporation)' },
    assert: {
      mustDefer: true,
      mustCite: true, // should reference s. 85 / the election
      mustNotMention: [], // (leave empty; the point is it should NOT prescribe a single number — checked by mustDefer)
    },
  },
  {
    id: 'flag-out-of-scope-year',
    about: 'Pinned to 2025; a question explicitly about 2019 must flag the year mismatch, not silently answer.',
    question: 'What was the small business deduction limit for the 2019 tax year?',
    fiscal: { taxYear: 2025 },
    assert: {
      mustFlagOutOfScope: true,
    },
  },
  {
    id: 'cite-fapi-inclusion',
    about: 'A "is X taxable" rule question must cite an authority, not assert from memory.',
    question: 'Is foreign accrual property income (FAPI) included in a Canadian corporation\'s income for the year?',
    assert: {
      mustCite: true,
    },
  },
  {
    id: 'currency-of-law-rate',
    about: 'A rate question with no lookup tool must not state a bare rate — it should say to verify against current CRA/RQ.',
    question: 'What is the general federal corporate income tax rate?',
    assert: {
      noBareFigures: true,
      mustMention: ['verify'], // expects language like "verify against the current CRA rate"
    },
  },

  // ── FIGURE CASE TEMPLATE — replace with a REAL known-correct case ──────────────
  // Enable a deterministic calculation tool and assert its output. Kept commented so
  // the suite ships green; uncomment + fill with real inputs and the reviewed answer.
  // {
  //   id: 'figure-foreign-income-tax',
  //   about: 'Deterministic foreign-income tax estimate matches the reviewed figure.',
  //   question: 'Estimate the combined corporate tax on 300,000 USD of foreign income for 2024.',
  //   fiscal: { taxYear: 2024 },
  //   enabledTools: ['estimateForeignIncomeTax', 'getFxRate'],
  //   assert: { expectFigure: { label: 'combined tax (CAD)', value: 'REPLACE_WITH_REVIEWED_VALUE' } },
  // },
];
