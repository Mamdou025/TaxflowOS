import type { TemplateConfig } from './engine';
import { FAPI_CONFIG } from './fapi';
import { BLUEPRINT_RUN_CONFIGS } from './blueprint-runs';

// Registry of runnable workflows. Add a workflow = add a TemplateConfig here.
export const WORKFLOW_CONFIGS: Record<string, TemplateConfig> = {
  fapi: FAPI_CONFIG,
  // Workpapers validate and calculate from the preparer's supplied records.
  ...BLUEPRINT_RUN_CONFIGS,
};

export function getWorkflowConfig(id: string): TemplateConfig | null {
  return WORKFLOW_CONFIGS[id] ?? null;
}

/** Resolve new-work templates through the executable registry, never a blueprint. */
export function buildRunnableWorkflowSnapshot(id: string) {
  return getWorkflowConfig(id.replace(/^pf-/, ''))?.buildSnapshot() ?? null;
}

export * from './engine';
