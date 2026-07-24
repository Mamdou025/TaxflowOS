import type { TemplateConfig } from './engine';
import { FAPI_CONFIG } from './fapi';
import { ROULEMENT_CONFIG } from './roulement';
import { EXPENSE_CONFIG } from './expense';
import { CAMPAIGN_CONFIG } from './campaign';
import { BLUEPRINT_RUN_CONFIGS } from './blueprint-runs';

// Registry of runnable workflows. Add a workflow = add a TemplateConfig here.
export const WORKFLOW_CONFIGS: Record<string, TemplateConfig> = {
  fapi: FAPI_CONFIG,
  roulement: ROULEMENT_CONFIG,
  expense: EXPENSE_CONFIG,
  campaign: CAMPAIGN_CONFIG,
  // Representative runnable configs for the calculation-type portfolio blueprints
  // (T1134, surplus, T106, EIFEL, T2, provision, Part XIII). Demo figures — see
  // blueprint-runs.ts. The workflow page resolves these by the pf-stripped id.
  ...BLUEPRINT_RUN_CONFIGS,
};

export function getWorkflowConfig(id: string): TemplateConfig | null {
  return WORKFLOW_CONFIGS[id] ?? null;
}

export * from './engine';
