import { WORKPAPER_SPECS } from '@/shared/workflow-engine/portfolio-workpapers';
// ─────────────────────────────────────────────────────────────────────────────
// Workflow TARGET resolution — "which workflow is this text about?"
//
// Deliberately separate from action detection (command-parser.ts): resolving a
// target NEVER implies the user wants to run it. Ids mirror the keys of
// WORKFLOW_CONFIGS (lib/workflow-runs/index.ts): fapi | roulement | expense |
// campaign. Kept as a static table (no engine import) so the classifier stays
// light and the eval harness runs standalone under tsx.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowTarget = {
  id: string;
  /** Canonical display name. */
  name: string;
  /** EN + FR aliases matched on word boundaries (already lowercased). */
  aliases: string[];
};

export const WORKFLOW_TARGETS: WorkflowTarget[] = [
  { id: 'fapi', name: 'FAPI', aliases: ['fapi', 'foreign accrual property income', 'reaimp', 'reatb'] },
  { id: 'expense', name: 'Expense reimbursement', aliases: ['expense', 'expense reimbursement', 'reimbursement', 'remboursement'] },
  { id: 'document-calculator', name: 'Document Calculator', aliases: ['document calculator'] },
  ...WORKPAPER_SPECS.map(spec => ({ id: spec.id, name: spec.name, aliases: [spec.id, spec.id.replaceAll('-', ' '), spec.name.toLowerCase(), ...(spec.id === 'platform-sequence' ? ['universal execution sequence'] : []), ...(spec.id === 't2-suite' ? ['t2'] : []), ...(spec.id === 'part-xiii' ? ['part xiii'] : [])] })),
];

// Recognize retired names so mixed requests remain ambiguous and cannot launch the wrong workflow.
const RETIRED_TARGETS: WorkflowTarget[] = [
  { id: 'roulement', name: 'Removed rollover workflow', aliases: ['roulement', 'rollover', 'art. 85', 'section 85', 't2057'] },
  { id: 'campaign', name: 'Removed campaign workflow', aliases: ['campaign', 'marketing budget', 'budget allocation'] },
  { id: 'holiday-payroll', name: 'Removed holiday payroll workflow', aliases: ['holiday payroll', 'statutory holiday', 'holiday accrual'] },
];

/** Escape a literal for use inside a RegExp. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A word-ish boundary match so "expense" hits in "run the expense report" but
 * "fapi" does NOT hit inside an unrelated longer token. Handles the "art. 85"
 * style aliases (which contain punctuation) by anchoring on non-alphanumerics.
 */
function aliasHits(haystack: string, alias: string): boolean {
  const a = escapeRegExp(alias);
  const re = new RegExp(`(?:^|[^a-z0-9])${a}(?:$|[^a-z0-9])`, 'i');
  return re.test(haystack);
}

export type WorkflowTargetResolution = {
  /** Best single target, or null if none matched. */
  id: string | null;
  name: string | null;
  /** Every distinct workflow id whose aliases matched. */
  matchedIds: string[];
  /** True when >1 distinct workflow matched — caller must treat as ambiguous. */
  ambiguous: boolean;
  confidence: number;
  /** A 4-digit fiscal year if one appears in the text (e.g. 2025). */
  fiscalYear: number | null;
  /** A rough client/entity name captured after "for"/"pour", if any. */
  clientName: string | null;
};

/** Extract a 20xx / 19xx fiscal year, if present. */
function extractYear(text: string): number | null {
  const m = text.match(/\b(19|20)\d{2}\b/);
  if (!m) return null;
  const y = Number(m[0]);
  return Number.isFinite(y) ? y : null;
}

/** Very light "for <Name>" / "pour <Name>" capture — just enough to know scope was named. */
function extractClientName(original: string): string | null {
  const m = original.match(/\b(?:for|pour)\s+([A-ZÀ-Ý][\w&.'-]*(?:\s+[A-ZÀ-Ý][\w&.'-]*){0,3})/);
  return m ? m[1].trim() : null;
}

/**
 * Resolve the workflow(s) a message refers to. Pure and side-effect free.
 * `original` preserves case for name capture; matching itself is case-insensitive.
 */
export function resolveWorkflowTarget(original: string): WorkflowTargetResolution {
  // Resolve the commanded procedure, not workflow-looking words inside its data
  // or client name (e.g. "Run FAPI with records: [{label: 'expense'}]").
  const command = original.match(/\b(?:run|start|execute|calculate|compute|launch|d[ée]marre[rz]?|lance[rz]?|calcule[rz]?)\s+([\s\S]*?)(?=\s+(?:with|using|on|for|pour|avec)\b|[\[{]|$)/i);
  const targetText = command?.[1] ?? original.split(/[\[{]/, 1)[0];
  const text = ` ${targetText.toLowerCase()} `;
  const matched: string[] = [];
  for (const t of [...WORKFLOW_TARGETS, ...RETIRED_TARGETS]) {
    if (t.aliases.some((a) => aliasHits(text, a))) matched.push(t.id);
  }
  const ambiguous = matched.length > 1;
  const id = matched.length >= 1 ? matched[0] : null;
  const name = id ? [...WORKFLOW_TARGETS, ...RETIRED_TARGETS].find((t) => t.id === id)?.name ?? null : null;
  return {
    id: ambiguous ? null : id,
    name: ambiguous ? null : name,
    matchedIds: matched,
    ambiguous,
    // One clean match → high confidence; none → 0; several → 0 (ambiguous, caller asks).
    confidence: matched.length === 1 ? 0.95 : 0,
    fiscalYear: extractYear(original),
    clientName: extractClientName(original),
  };
}
