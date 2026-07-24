// ─────────────────────────────────────────────────────────────────────────────
// Workflow domain registry — the per-workflow expertise Sina applies.
//
// There is ONE assistant, Sina (see agents/sina.ts). This file is NOT a roster of
// personas (it used to define Sofi/Théo/Mira/Nova). It is the DOMAIN-KNOWLEDGE
// registry: for each workflow, the concise expertise Sina surfaces as the turn's
// "domain focus". No identity swap — Sina stays Sina and applies the matching domain.
//
// Pure + isomorphic (no server-only, no React): the server injects the domain focus
// into the model context (app/api/copilotkit/route.ts via agents/sina.ts) and the
// eval harness (runtime/evals) reads the same selection.
// ─────────────────────────────────────────────────────────────────────────────

import { AGENTS } from '@/lib/agents';
import type { AssistantRoute } from '../routing/route-schema';

export type WorkflowDomain = {
  /** Domain id from lib/agents.ts (fapi/roulement/expense/campaign). */
  id: string;
  /** Short domain label (e.g. "FAPI"). */
  name: string;
  /** What the domain covers. */
  role: string;
  /** The workflow this domain owns. */
  workflowId: string;
  /** Concise, real domain guidance surfaced as the per-turn focus. */
  expertise: string;
};

// Domain expertise per workflow — kept concise and factual (the workspace's real
// domain), keyed by the workflow id.
const EXPERTISE: Record<string, string> = {
  fapi:
    'You specialize in FAPI (foreign accrual property income) for controlled foreign affiliates: classifying trial-balance rows into income/expense buckets, the FAPI line build (A, EXPENSES, the 95(2) amount, A.1/A.2/C–H, FAT), the P-coefficient, the FX rate and CAD conversion, and the reviewed net FAPI. You can explain what inputs a FAPI run needs and read results from the run or worksheet.',
  roulement:
    'You specialize in the section 85 rollover (roulement fiscal, art. 85): classifying the transferred property, computing the elected-amount bounds between the PBR (tax cost) floor and the FMV/JVM ceiling, the resulting deferred gain, and the T2057 election — pausing for the user to elect the amount.',
  expense:
    'You specialize in employee expense reimbursement: classifying receipts, applying per-diem caps and the reimbursement policy, and computing the net amount payable to the employee (with CAD conversion).',
  campaign:
    'You specialize in marketing campaign budget allocation: classifying channel spend requests, the human election of the approved budget between the committed floor and the ceiling, and projecting the resulting allocation.',
};

/** All workflow domains, derived from the workflow catalog. */
export const WORKFLOW_DOMAINS: WorkflowDomain[] = AGENTS.filter((a) => a.workflow && EXPERTISE[a.workflow]).map((a) => ({
  id: a.id,
  name: a.name,
  role: a.role,
  workflowId: a.workflow as string,
  expertise: EXPERTISE[a.workflow as string],
}));

const BY_WORKFLOW: Record<string, WorkflowDomain> = Object.fromEntries(WORKFLOW_DOMAINS.map((d) => [d.workflowId, d]));

/** Look up the domain that owns a workflow id, or null. */
export function domainForWorkflow(workflowId: string | null | undefined): WorkflowDomain | null {
  return workflowId ? BY_WORKFLOW[workflowId] ?? null : null;
}

/**
 * Select the domain focus for a turn, from the route. A turn whose target is a
 * resolved workflow gets that workflow's domain; general/navigation turns get null
 * (Sina's base instructions already cover them).
 */
export function selectDomain(route: AssistantRoute): WorkflowDomain | null {
  if (route.target.kind === 'workflow' && route.target.id) {
    return domainForWorkflow(route.target.id);
  }
  return null;
}
