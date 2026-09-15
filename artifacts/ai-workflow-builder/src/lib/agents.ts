import { WORKPAPER_SPECS } from '@/shared/workflow-engine/portfolio-workpapers';
// ─────────────────────────────────────────────────────────────────────────────
// Workflow catalog + per-workflow domain roles.
//
// There is ONE assistant in the workspace — Sina (see lib/coworkers.ts). This file
// is NOT a roster of separate personas (it used to be Sofi/Théo/Mira/Nova). It is
// the catalog of the workspace's runnable workflows and the per-workflow DOMAIN
// (label + role + live flag) that Sina applies. The detailed domain EXPERTISE text
// lives in features/assistant/runtime/agents/specialists.ts, keyed by the same
// workflow id. `WORKFLOWS` is the suggestion list shown in the composer/sidebar.
// ─────────────────────────────────────────────────────────────────────────────

export type Agent = {
  id: string;
  /** Domain label (e.g. "FAPI") — a workflow domain, NOT a persona. Sina is the one agent. */
  name: string;
  /** What the domain covers, shown/used as the per-turn focus. */
  role: string;
  /** The workflow id this domain owns, if any. */
  workflow?: string;
  live: boolean;
};

/** The workspace's workflow domains (Sina applies the matching one per turn). */
export const AGENTS: Agent[] = [
  { id: 'document-calculator', name: 'Document Calculator', role: 'Document calculations', workflow: 'document-calculator', live: true },
  ...WORKPAPER_SPECS.map(s => ({ id: s.id, name: s.name, role: s.purpose, workflow: s.id, live: true })),
  { id: 'fapi', name: 'FAPI', role: 'Foreign accrual property income', workflow: 'fapi', live: true },
  { id: 'expense', name: 'Expense reimbursement', role: 'Employee expense reimbursement', workflow: 'expense', live: true },
];

export type WorkflowSuggestion = {
  id: string;
  name: string;
  sub: string;
  ready: boolean;
};

/** Runnable procedures surfaced as suggestions in the composer + sidebar. */
export const WORKFLOWS: WorkflowSuggestion[] = [
  { id: 'document-calculator', name: 'Document Calculator', sub: 'Document records → calculated results', ready: true },
  ...WORKPAPER_SPECS.map(s => ({ id: s.id, name: s.name, sub: s.purpose, ready: true })),
  { id: 'fapi', name: 'Calculate FAPI', sub: 'Foreign accrual property income', ready: true },
  { id: 'expense', name: 'Expense reimbursement', sub: 'Receipts → policy caps → net payable', ready: true },
];
