import { workspaceStorage } from '@/platform/auth/workspace-context';
import { workspaceContext } from '@/platform/auth/workspace-context';
import { apiFetch } from '@/platform/auth/api-fetch';
import { WorkspaceIdSchema, WORKSPACE_ID_HEADER } from '@workspace/api-zod/access';
import { parseSharedJSON, stringifySharedJSON } from '@/shared/workflow-engine/shared-json';
import { createWorkflowStorageClient } from '@workspace/workflow-contracts/storage-protocol';
import { createWorkflowSyncService } from './services/workflow-sync-service';

export { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
const service = createWorkflowSyncService({
  storage: {
    getItem: key => workspaceStorage.getItem(key),
    setItem: (key, value) => workspaceStorage.setItem(key, value),
  },
  client: createWorkflowStorageClient(apiFetch, { header: WORKSPACE_ID_HEADER, parse: value => WorkspaceIdSchema.parse(value) }),
  encode: stringifySharedJSON,
  decode: parseSharedJSON,
  createCode: () => WorkspaceIdSchema.parse(workspaceContext?.workspace.id),
  parseCode: value => WorkspaceIdSchema.parse(value),
});
export const initializeWorkflowSync = service.initialize;
export const subscribeWorkflowSync = service.subscribe;
export const workflowSyncStatus = service.getStatus;
export const workspaceRecoveryCode = service.recoveryCode;
export const queueWorkflowSave = service.queueSave;
export const syncWorkflowLibrary = service.sync;
export const openWorkflowWorkspace = service.open;
export const pauseWorkflowSync = service.pause;
