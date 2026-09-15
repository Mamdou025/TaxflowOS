import { workspaceContext } from '@/platform/auth/workspace-context';
import type { RunInitiator } from '@workspace/workflow-core/commands';

// Provenance only. Server session/membership checks remain the authority for APIs.
export function workflowRunContext(surface: RunInitiator['surface']) {
  return workspaceContext
    ? {
        initiatedBy: {
          actorId: workspaceContext.userId,
          workspaceId: workspaceContext.workspace.id,
          surface,
        },
      }
    : {};
}
