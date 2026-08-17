

// Shared state for the Workflows surface — so the workflow LIST (published into
// the Scope sidebar) and the DETAIL (in the page body) + the header tabs all read
// one source of truth.

import { atom } from 'jotai';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { getPortfolioWorkflowDef } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';

export type WorkflowTab = 'overview' | 'build' | 'run' | 'results';

/** Sentinel selection for a brand-new, blank workflow being built in the surface. */
export const NEW_WORKFLOW_ID = '__new__';

/** The workflow selected on the Workflows surface (a portfolio def id like pf-t1134,
 *  or NEW_WORKFLOW_ID for a blank draft). */
export const selectedWorkflowIdAtom = atom<string | null>(null);

/** The active mode for the selected workflow. */
export const workflowTabAtom = atom<WorkflowTab>('overview');

/** Aim the Workflows surface at one workflow's Build tab, optionally focused on a
 *  single block — the shared half of every "open (this block) in the builder"
 *  affordance (chat run cards, worksheets, the standalone run page). Callers still
 *  decide how to GET there: open the surface as an inline window (the chat) or
 *  navigate to /workflows-hub (the standalone pages). Setting the selection is what
 *  the surface reads; without it the page lands on its "Select a workflow" empty
 *  state. The surface selects by PORTFOLIO id, so a runnable id ("fapi") is mapped
 *  to its blueprint ("pf-fapi") when one exists. */
export const aimBuilderAtWorkflowAtom = atom(
  null,
  (_get, set, { workflowId, blockId = '' }: { workflowId: string; blockId?: string }) => {
    const baseId = workflowId.replace(/^pf-/, '');
    const def = getPortfolioWorkflowDef(`pf-${baseId}`) ?? getPortfolioWorkflowDef(workflowId);
    set(builderFocusTargetAtom, { workflowId: def?.id ?? workflowId, blockId });
    set(workflowTabAtom, 'build');
    if (def) set(selectedWorkflowIdAtom, def.id);
    return Boolean(def);
  }
);
