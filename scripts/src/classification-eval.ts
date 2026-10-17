/**
 * Prototype eval for the proposed "AI classification suggestion" workflow block.
 *
 * NOT part of the shipped block/executor architecture yet — this is a standalone
 * harness to answer one question before any of that gets built: can a model
 * classify GL/trial-balance rows into the FAPI keyword-rulebook's categories
 * (a) as well as the literal keyword list on exact matches, (b) BETTER than the
 * keyword list on same-concept-different-wording rows (the whole point of adding
 * an AI block), and (c) WITHOUT over-flagging rows that merely share a word with
 * a FAPI category but are the wrong direction (expense vs income, paid vs
 * received) or otherwise not a match.
 *
 * Test rows are synthetic (invented for this eval), not real client data.
 * Rulebook categories mirror WORKING_SOURCE_DEMO_RULES in
 * artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/sample-workflows/working-source-rules-demo.ts.
 * Ambiguous rows are scored separately (inspect rationale, no pass/fail) because
 * the "correct" answer depends on real FAPI exclusion rules this script does not
 * adjudicate.
 *
 * Run (repo root, AI_GATEWAY_API_KEY already in .env.local):
 *   pnpm --filter @workspace/scripts exec tsx src/classification-eval.ts
 *   pnpm --filter @workspace/scripts exec tsx src/classification-eval.ts --model anthropic/claude-opus-4-8 --threshold 0.6
 */
import { generateObject, jsonSchema } from 'ai';
import { loadEnvLocal } from './virtual-worker/env';

loadEnvLocal();

const argv = process.argv.slice(2);
function flag(name: string): string | undefined {
  const withEq = argv.find((a) => a.startsWith(`--${name}=`));
  if (withEq) return withEq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  return i !== -1 ? argv[i + 1] : undefined;
}

const MODEL = flag('model') ?? 'anthropic/claude-sonnet-5';
const THRESHOLD = Number(flag('threshold') ?? '0.7');

// --------------------------------------------------------------------------
// The keyword rulebook the AI block would sit next to (mirrors the real demo).
// --------------------------------------------------------------------------

const FAPI_RULEBOOK = [
  { categoryId: 'interestIncome', categoryLabel: 'Interest Income', keywords: ['interest income', 'interest earned', 'bank interest'] },
  { categoryId: 'rents', categoryLabel: 'Rents', keywords: ['rental income', 'rent received', 'lease income'] },
  { categoryId: 'royalties', categoryLabel: 'Royalties', keywords: ['royalty income', 'royalties', 'patent royalty'] },
  { categoryId: 'dividends', categoryLabel: 'Dividends', keywords: ['dividend income', 'portfolio shares'] },
  { categoryId: 'otherFapiIncome', categoryLabel: 'Other FAPI Income', keywords: ['other fapi income', 'miscellaneous fapi revenue'] },
  { categoryId: 'capGains', categoryLabel: 'Capital Gains', keywords: ['capital gains', 'cap gains'] },
  { categoryId: 'debtForgiveness', categoryLabel: 'Debt Forgiveness', keywords: ['debt forgiveness'] },
  { categoryId: 'generalExpenses', categoryLabel: 'General Expenses', keywords: ['general expenses', 'operating expenses'] },
  { categoryId: 'legalExpenses', categoryLabel: 'Legal Expenses', keywords: ['legal expenses', 'legal advisory'] },
  { categoryId: 'accountingExpenses', categoryLabel: 'Accounting Expenses', keywords: ['accounting expenses', 'accounting service'] },
] as const;

const FAPI_INCOME_CATEGORIES = new Set([
  'interestIncome', 'rents', 'royalties', 'dividends', 'otherFapiIncome', 'capGains', 'debtForgiveness',
]);

// --------------------------------------------------------------------------
// Synthetic test rows, grouped by what they're stress-testing.
// --------------------------------------------------------------------------

type Group = 'exact' | 'nuance' | 'trap' | 'unrelated' | 'ambiguous';
type TestRow = {
  rowId: string;
  account: string;
  description: string;
  amount: number;
  currency: string;
  group: Group;
  expected: string | null; // null = not a FAPI-income category; ignored for 'ambiguous'
  note: string;
};

const ROWS: TestRow[] = [
  // --- exact: literal keyword present (sanity baseline) ---
  { rowId: 'R01', account: '4100', description: 'Interest income on USD term deposit', amount: 18500, currency: 'USD', group: 'exact', expected: 'interestIncome', note: 'literal "interest income"' },
  { rowId: 'R02', account: '4210', description: 'Dividend income from foreign portfolio shares', amount: 42000, currency: 'USD', group: 'exact', expected: 'dividends', note: 'literal "dividend income" + "portfolio shares"' },
  { rowId: 'R03', account: '4310', description: 'Royalty income - patent royalty from German licensee', amount: 9000, currency: 'EUR', group: 'exact', expected: 'royalties', note: 'literal "royalty income"/"patent royalty"' },
  { rowId: 'R04', account: '4400', description: 'Rental income - commercial property lease Bahamas', amount: 26000, currency: 'USD', group: 'exact', expected: 'rents', note: 'literal "rental income"' },

  // --- nuance: same concept, none of the rulebook's literal phrases ---
  { rowId: 'R05', account: '4101', description: 'Coupon receipts on offshore corporate bonds', amount: 7400, currency: 'USD', group: 'nuance', expected: 'interestIncome', note: 'bond coupons = interest, no word "interest"' },
  { rowId: 'R06', account: '4211', description: "Distribution received from Cayman holding company's common shares", amount: 31000, currency: 'USD', group: 'nuance', expected: 'dividends', note: 'no word "dividend"' },
  { rowId: 'R07', account: '4311', description: 'Licensing fee for use of trademark - foreign affiliate', amount: 5200, currency: 'USD', group: 'nuance', expected: 'royalties', note: 'trademark licensing fee, no word "royalty"' },
  { rowId: 'R08', account: '4410', description: 'Lease payment received - office space, Barbados sub', amount: 14000, currency: 'USD', group: 'nuance', expected: 'rents', note: 'no "rental income"/"lease income" phrase' },
  { rowId: 'R09', account: '4500', description: 'Gain on disposition of foreign affiliate shares', amount: 61000, currency: 'USD', group: 'nuance', expected: 'capGains', note: 'no word "capital"' },

  // --- trap: shares a word with a category but wrong direction/context ---
  { rowId: 'R10', account: '5100', description: 'Interest expense on intercompany loan payable', amount: 12000, currency: 'USD', group: 'trap', expected: null, note: 'EXPENSE not income — must not become interestIncome' },
  { rowId: 'R11', account: '5210', description: 'Legal expenses re: royalty infringement litigation', amount: 8800, currency: 'CAD', group: 'trap', expected: 'legalExpenses', note: '"royalty" appears but this is a legal expense' },
  { rowId: 'R12', account: '3000', description: 'Dividends paid to common shareholders', amount: 50000, currency: 'CAD', group: 'trap', expected: null, note: 'PAID not received — not FAPI income' },
  { rowId: 'R13', account: '5220', description: 'Accounting fees - review of royalty agreements', amount: 3100, currency: 'CAD', group: 'trap', expected: 'accountingExpenses', note: '"royalty" appears but this is an accounting expense' },
  { rowId: 'R14', account: '5300', description: 'Rent expense - warehouse lease payment', amount: 9600, currency: 'CAD', group: 'trap', expected: null, note: 'EXPENSE not income — must not become rents' },
  { rowId: 'R15', account: '5400', description: 'Royalty paid to foreign affiliate for software license', amount: 15000, currency: 'USD', group: 'trap', expected: null, note: 'PAID not received' },

  // --- unrelated: nothing FAPI-ish about these at all ---
  { rowId: 'R16', account: '4000', description: 'Sales revenue - domestic retail store #4', amount: 220000, currency: 'CAD', group: 'unrelated', expected: null, note: 'ordinary business income' },
  { rowId: 'R17', account: '5500', description: 'Office supplies expense', amount: 1400, currency: 'CAD', group: 'unrelated', expected: null, note: 'ordinary expense' },
  { rowId: 'R18', account: '5600', description: 'Salaries and wages - head office staff', amount: 180000, currency: 'CAD', group: 'unrelated', expected: null, note: 'ordinary expense' },
  { rowId: 'R19', account: '5000', description: 'Cost of goods sold - inventory', amount: 95000, currency: 'CAD', group: 'unrelated', expected: null, note: 'ordinary expense' },

  // --- ambiguous: real FAPI-law nuance this script does not adjudicate ---
  { rowId: 'R20', account: '4600', description: "Management fee income from non-arm's-length foreign subsidiary", amount: 22000, currency: 'USD', group: 'ambiguous', expected: null, note: 'services income — FAPI treatment depends on facts; inspect rationale only' },
  { rowId: 'R21', account: '4700', description: 'Foreign exchange gain on USD cash holdings', amount: 4300, currency: 'USD', group: 'ambiguous', expected: null, note: 'FX gains can be FAPI in some circumstances; inspect rationale only' },
  { rowId: 'R22', account: '4212', description: 'Dividend received from controlled foreign affiliate - active business surplus', amount: 70000, currency: 'USD', group: 'ambiguous', expected: null, note: 'CFA-to-CFA dividends out of exempt/taxable surplus are often EXCLUDED from FAPI despite the word "dividend" — the real test is whether the model naively pattern-matches or flags the surplus-exclusion nuance' },
];

// --------------------------------------------------------------------------
// The prompt the real block would send (this is the "systemPrompt" config knob).
// --------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are classifying general-ledger rows for a Canadian corporate FAPI (Foreign Accrual Property Income) worksheet. You are given a KEYWORD RULEBOOK of known categories with example phrasing, and a list of GL rows to classify.

RULEBOOK (the keywords are EXAMPLES of each category's phrasing, not an exhaustive list — use judgment to recognize the same concept in different wording):
${JSON.stringify(FAPI_RULEBOOK, null, 2)}

For EACH row, decide:
- categoryId: the single best-matching category id from the rulebook above, or null if none applies.
- confidence: 0 to 1, calibrated — do not default to a high number. Reserve >=0.85 for cases you are quite sure of.
- rationale: one sentence, concrete, naming what in the row text drove the decision.
- matchedSignal: the word/phrase/concept that drove the match (or "" if categoryId is null).

Rules you must apply:
1. Direction matters. "Interest income", "dividend income", "royalty income", "rental income" are things the company RECEIVED. If a row is an EXPENSE or something PAID OUT (interest expense, dividends paid, royalty paid, rent expense), it is NOT a match for that income category, even though it shares a word with the rulebook. categoryId must be null for those, or the correct EXPENSE category if the rulebook has one (e.g. legalExpenses, accountingExpenses, generalExpenses) that genuinely matches the row's own subject.
2. Word overlap is not meaning overlap. "Legal expenses re: royalty infringement litigation" is a legal expense, not royalty income, even though the word "royalty" appears — classify it as legalExpenses (or null if no expense category fits), never royalties.
3. Recognize the same underlying concept in different wording (e.g. "coupon receipts" = interest income, "distribution received from shares" = dividends, "licensing fee" = royalties, "lease payment received" = rental income). Do not require a literal keyword match.
4. If a row touches on a real FAPI tax-law nuance you are not certain about (e.g. whether a specific type of income is excluded from FAPI by a surplus/exemption rule, or whether services income qualifies), do NOT silently guess with high confidence. Lower your confidence and say so in the rationale, so a human reviews it.
5. Never fabricate certainty you don't have. It is better to return a lower confidence or null than to confidently mislabel a row.

Return your answer for every row given, preserving rowId.`;

const OUTPUT_SCHEMA = jsonSchema<{
  results: Array<{
    rowId: string;
    categoryId: string | null;
    confidence: number;
    rationale: string;
    matchedSignal: string;
  }>;
}>({
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rowId: { type: 'string' },
          categoryId: { type: ['string', 'null'] },
          confidence: { type: 'number' },
          rationale: { type: 'string' },
          matchedSignal: { type: 'string' },
        },
        required: ['rowId', 'categoryId', 'confidence', 'rationale', 'matchedSignal'],
        additionalProperties: false,
      },
    },
  },
  required: ['results'],
  additionalProperties: false,
});

// --------------------------------------------------------------------------
// Run + score
// --------------------------------------------------------------------------

async function main() {
  console.log(`Model: ${MODEL}  |  confidence threshold: ${THRESHOLD}\n`);

  const { object } = await generateObject({
    model: MODEL,
    schema: OUTPUT_SCHEMA,
    system: SYSTEM_PROMPT,
    prompt: `GL rows to classify:\n${JSON.stringify(
      ROWS.map(({ rowId, account, description, amount, currency }) => ({ rowId, account, description, amount, currency })),
      null,
      2,
    )}`,
  });

  const byId = new Map(ROWS.map((r) => [r.rowId, r]));
  const byResult = new Map(object.results.map((r) => [r.rowId, r]));

  const scored = { exact: [] as string[], nuance: [] as string[], trap: [] as string[], unrelated: [] as string[] };
  let fpOnTrapsAndUnrelated = 0;
  let recallHitsOnExactAndNuance = 0;
  const exactNuanceTotal = ROWS.filter((r) => r.group === 'exact' || r.group === 'nuance').length;
  const trapUnrelatedTotal = ROWS.filter((r) => r.group === 'trap' || r.group === 'unrelated').length;

  console.log('ROW  GROUP      EXPECTED              GOT (gated @ threshold)   CONF   OK?  NOTE');
  console.log('-'.repeat(110));

  for (const row of ROWS) {
    const result = byResult.get(row.rowId);
    if (!result) {
      console.log(`${row.rowId}  MISSING RESULT`);
      continue;
    }
    const gated = result.confidence >= THRESHOLD ? result.categoryId : null;

    if (row.group === 'ambiguous') {
      console.log(
        `${row.rowId}  ambiguous  (no scored expectation)   raw=${result.categoryId ?? 'null'} conf=${result.confidence.toFixed(2)}`,
      );
      console.log(`      rationale: ${result.rationale}`);
      console.log(`      note: ${row.note}`);
      continue;
    }

    const ok = gated === row.expected;
    if (row.group === 'exact' || row.group === 'nuance') {
      if (ok) recallHitsOnExactAndNuance++;
    }
    if (row.group === 'trap' || row.group === 'unrelated') {
      if (!ok) fpOnTrapsAndUnrelated++;
    }
    scored[row.group].push(row.rowId + (ok ? ':ok' : ':FAIL'));

    console.log(
      `${row.rowId}   ${row.group.padEnd(10)} ${String(row.expected).padEnd(20)}  ${String(gated).padEnd(24)} ${result.confidence
        .toFixed(2)
        .padEnd(6)} ${ok ? ' OK ' : 'FAIL'}  ${row.note}`,
    );
    if (!ok) {
      console.log(`      rationale: ${result.rationale}`);
    }
  }

  console.log('-'.repeat(110));
  console.log(
    `Recall on exact+nuance (can it find FAPI rows, including ones not in the literal keyword list): ${recallHitsOnExactAndNuance}/${exactNuanceTotal}`,
  );
  console.log(
    `False positives on trap+unrelated (did it wrongly flag an expense/paid/unrelated row as FAPI income): ${fpOnTrapsAndUnrelated}/${trapUnrelatedTotal}`,
  );
  console.log('\nAmbiguous rows are not scored — read their rationale above and judge by hand.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
