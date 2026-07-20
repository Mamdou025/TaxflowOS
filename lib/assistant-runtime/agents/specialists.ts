// ─────────────────────────────────────────────────────────────────────────────
// Specialists — "one assistant, many hats".
//
// The single conductor becomes the right domain specialist based on the route the
// intent layer already computed: a FAPI turn is answered as Sofi, a rollover as
// Théo, an expense report as Mira, a campaign budget as Nova. There is ONE agent
// loop and ONE conversation — the persona + domain expertise + the (already
// route-scoped) tools are what change. This is the recommended multi-agent shape:
// no competing independent agents, no separate memory.
//
// Pure + isomorphic (no server-only, no React): the server injects the persona into
// the model context (app/api/copilotkit/route.ts) and the client uses it to show
// who's working (components/assistant/specialist-presence.tsx).
// ─────────────────────────────────────────────────────────────────────────────

import { AGENTS } from '@/lib/agents';
import type { AssistantRoute } from '../routing/route-schema';

export type Specialist = {
  /** Agent id from lib/agents.ts (sofi/theo/mira/nova). */
  id: string;
  name: string;
  role: string;
  /** The workflow this specialist owns. */
  workflowId: string;
  /** Concise, real domain guidance injected as the per-turn persona. */
  expertise: string;
};

// Domain expertise per specialist — kept concise and factual (the workspace's real
// domain), keyed by the workflow id each agent owns.
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

/** All specialists that own a workflow, derived from the agent roster. */
export const SPECIALISTS: Specialist[] = AGENTS.filter((a) => a.workflow && EXPERTISE[a.workflow]).map((a) => ({
  id: a.id,
  name: a.name,
  role: a.role,
  workflowId: a.workflow as string,
  expertise: EXPERTISE[a.workflow as string],
}));

const BY_WORKFLOW: Record<string, Specialist> = Object.fromEntries(SPECIALISTS.map((s) => [s.workflowId, s]));

/** Look up the specialist that owns a workflow id, or null. */
export function specialistForWorkflow(workflowId: string | null | undefined): Specialist | null {
  return workflowId ? BY_WORKFLOW[workflowId] ?? null : null;
}

/**
 * Select the specialist to "wear as a hat" for a turn, from the route. A turn whose
 * target is a resolved workflow gets that workflow's specialist; general/navigation
 * turns get null (the coordinating Workspace Assistant stays in charge).
 */
export function selectSpecialist(route: AssistantRoute): Specialist | null {
  if (route.target.kind === 'workflow' && route.target.id) {
    return specialistForWorkflow(route.target.id);
  }
  return null;
}

/** The persona instruction injected for a turn (server → model context). */
export function specialistDirective(s: Specialist): string {
  return `SPECIALIST FOR THIS TURN — You are ${s.name}, the ${s.role} for this workspace. ${s.expertise} Answer this turn with that expertise and perspective; you may speak in the first person as ${s.name} when it feels natural. Stay within your domain — if the user clearly shifts to another area, switch to the right specialist or hand back to general assistance. Never fabricate figures: ground them in the provided context and use the deterministic workflow/calculation tools for official numbers.`;
}
