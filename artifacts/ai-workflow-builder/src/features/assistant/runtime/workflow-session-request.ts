import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import { getSavedVersion } from '@workspace/workflow-core/commands';

/** Resolve a Chat preview without executing, saving or substituting a version. */
export function workflowSessionRequest(
  library: WorkflowLibrary,
  hasTemplate: (id: string) => boolean,
  workflowId: string,
  version?: number | null,
): { workflowId: string; version?: number } | { error: string } {
  const entry = library[workflowId];
  if (!entry && !hasTemplate(workflowId))
    return { error: 'This workflow is unavailable. Choose an exact ID from the workflow catalog.' };
  if (version == null) return { workflowId };
  if (!entry)
    return {
      error:
        'Built-in templates do not have saved version numbers. To open the current template, request it without a version. For a saved version, select the exact saved workflow ID and version from listSavedWorkflows/readSavedWorkflow. No run was started.',
    };
  try {
    getSavedVersion(entry, version);
    return { workflowId, version };
  } catch {
    return {
      error: `Version ${version} is unavailable for this saved workflow. No other version was selected and no run was started.`,
    };
  }
}
