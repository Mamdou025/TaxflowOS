// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — FISCAL MODE (client-safe: pure data + policy text, no secrets).
//
// Encodes the non-negotiables for a tax/fiscalist tool as an injected prompt layer:
//   #1 Cite the authority for every rule/figure — or say you can't verify it.
//   #2 Never compute figures freehand — use a calculation tool / the engine.
//   #3 Pin every answer to a tax year + jurisdiction + entity (temporal/jurisdictional).
//   + Defer on professional judgment (elections/positions) and flag uncertainty.
//
// Delivered as a preamble PREPENDED to the system prompt so it is always present
// (never pruned by context-scope) and sits first (highest priority). Defaults are
// Canadian / Québec (CRA + Revenu Québec) to match this codebase's domain.
// ─────────────────────────────────────────────────────────────────────────────

export type FiscalContext = {
  taxYear: number;
  province: string; // province/territory code, or 'FED' for federal-only
  entityType: string;
  residency: string;
  currency: string;
};

export const PROVINCES: { code: string; label: string }[] = [
  { code: 'FED', label: 'Federal only' },
  { code: 'AB', label: 'Alberta' },
  { code: 'BC', label: 'British Columbia' },
  { code: 'MB', label: 'Manitoba' },
  { code: 'NB', label: 'New Brunswick' },
  { code: 'NL', label: 'Newfoundland and Labrador' },
  { code: 'NS', label: 'Nova Scotia' },
  { code: 'NT', label: 'Northwest Territories' },
  { code: 'NU', label: 'Nunavut' },
  { code: 'ON', label: 'Ontario' },
  { code: 'PE', label: 'Prince Edward Island' },
  { code: 'QC', label: 'Québec' },
  { code: 'SK', label: 'Saskatchewan' },
  { code: 'YT', label: 'Yukon' },
];

export const ENTITY_TYPES = [
  'CCPC (Canadian-controlled private corporation)',
  'Other private corporation',
  'Public corporation',
  'Individual',
  'Trust',
  'Partnership',
];

export const RESIDENCY = ['Canadian resident', 'Non-resident', 'Deemed resident'];

export const CURRENCIES = ['CAD', 'USD', 'EUR', 'GBP'];

export const DEFAULT_FISCAL_CONTEXT: FiscalContext = {
  taxYear: 2025,
  province: 'QC',
  entityType: ENTITY_TYPES[0],
  residency: RESIDENCY[0],
  currency: 'CAD',
};

function jurisdictionLabel(province: string): string {
  if (province === 'FED') {
    return 'Canada (federal — CRA)';
  }
  const p = PROVINCES.find((x) => x.code === province);
  const name = p ? p.label : province;
  // Québec administers its own provincial tax (Revenu Québec) alongside the CRA.
  const admin = province === 'QC' ? 'CRA (federal) + Revenu Québec (provincial)' : `CRA (federal) + ${name} (provincial)`;
  return `${name}, Canada — ${admin}`;
}

/** A one-line stamp for the provenance panel + the fiscal-mode note. */
export function fiscalSummary(ctx: FiscalContext): string {
  const p = PROVINCES.find((x) => x.code === ctx.province);
  return `${ctx.taxYear} · ${p ? p.label : ctx.province} · ${ctx.entityType.split(' (')[0]} · ${ctx.residency} · ${ctx.currency}`;
}

/** The full fiscal preamble: the pinned context header + the non-negotiable policy. */
export function fiscalPreamble(ctx: FiscalContext): string {
  return [
    '## Fiscal context (authoritative — scope every answer to this)',
    `- Tax year: ${ctx.taxYear}`,
    `- Jurisdiction: ${jurisdictionLabel(ctx.province)}`,
    `- Entity type: ${ctx.entityType}`,
    `- Residency: ${ctx.residency}`,
    `- Reporting currency: ${ctx.currency}`,
    '',
    'Every answer applies ONLY to this context. If the question implies a different tax year, jurisdiction, or entity type, say so and ask to update the fiscal context before answering. Open each substantive answer by stating the tax year and jurisdiction it relies on.',
    '',
    '## Non-negotiable rules (fiscal)',
    "1. CITE THE AUTHORITY. For every rule, rate, threshold, deadline, or legal conclusion, cite the source — the statute section (e.g. ITA s. 85), the CRA / Revenu Québec publication, or the attached document + the passage it came from. If you cannot ground a claim in a provided source or a tool result, say plainly \"I can't verify this — it needs a source or a professional\" rather than stating it as fact.",
    '2. NEVER COMPUTE FIGURES YOURSELF. Do not perform tax or financial arithmetic in your head. Use a calculation tool or the workflow engine. If no tool exists for a required calculation, state exactly which calculation is needed and the inputs it requires — do NOT invent or estimate a number.',
    '3. CURRENCY OF LAW. Rates, thresholds, brackets, and deadlines change by tax year and jurisdiction. Do not rely on memory for them — verify against a current authoritative source (CRA / Revenu Québec) and note the date you checked.',
    '4. DEFER ON JUDGMENT. For elections, filing positions, or anything requiring professional judgment (e.g. the elected amount in a s. 85 rollover), present the options and the bounds, then STOP for the professional to decide. Do not choose for them.',
    '5. FLAG UNCERTAINTY. State your confidence. It is better to say "uncertain — verify X" than to be confidently wrong. This output is a draft for professional review, not final client advice.',
  ].join('\n');
}
