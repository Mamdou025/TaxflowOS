import type { TemplateConfig } from './engine';
import { FAPI_CONFIG } from './fapi';
import { ROULEMENT_CONFIG } from './roulement';

// Registry of runnable workflows. Add a workflow = add a TemplateConfig here.
export const WORKFLOW_CONFIGS: Record<string, TemplateConfig> = {
  fapi: FAPI_CONFIG,
  roulement: ROULEMENT_CONFIG,
};

export function getWorkflowConfig(id: string): TemplateConfig | null {
  return WORKFLOW_CONFIGS[id] ?? null;
}

export * from './engine';
