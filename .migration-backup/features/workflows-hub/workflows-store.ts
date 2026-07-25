'use client';

// Shared state for the Workflows surface — so the workflow LIST (published into
// the Scope sidebar) and the DETAIL (in the page body) + the header tabs all read
// one source of truth.

import { atom } from 'jotai';

export type WorkflowTab = 'overview' | 'build' | 'run' | 'results';

/** Sentinel selection for a brand-new, blank workflow being built in the surface. */
export const NEW_WORKFLOW_ID = '__new__';

/** The workflow selected on the Workflows surface (a portfolio def id like pf-t1134,
 *  or NEW_WORKFLOW_ID for a blank draft). */
export const selectedWorkflowIdAtom = atom<string | null>(null);

/** The active mode for the selected workflow. */
export const workflowTabAtom = atom<WorkflowTab>('overview');
