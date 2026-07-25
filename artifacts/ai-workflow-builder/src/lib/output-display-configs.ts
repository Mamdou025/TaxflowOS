/**
 * Output display configuration — maps workflow node types to their result display config.
 * Used by the WorkflowRuns component to render step outputs appropriately.
 */
export type OutputDisplayConfig = {
  label?: string;
  format?: 'text' | 'json' | 'markdown' | 'table' | 'number';
};

export const OUTPUT_DISPLAY_CONFIGS: Record<string, OutputDisplayConfig> = {};
