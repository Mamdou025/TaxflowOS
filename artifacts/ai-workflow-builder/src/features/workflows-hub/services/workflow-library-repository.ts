import { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';

export const WORKFLOW_LIBRARY_KEY = 'taxflow:workflow-library:v1';

export function createWorkflowLibraryRepository(deps: {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  encode: (value: WorkflowLibrary) => string;
  decode: (text: string) => unknown;
}) {
  return {
    read(): WorkflowLibrary {
      const raw = deps.storage.getItem(WORKFLOW_LIBRARY_KEY);
      return raw === null ? {} : validateWorkflowLibrary(deps.decode(raw));
    },
    save(library: WorkflowLibrary) {
      deps.storage.setItem(WORKFLOW_LIBRARY_KEY, deps.encode(library));
    },
    rawBackup() {
      return deps.storage.getItem(WORKFLOW_LIBRARY_KEY);
    },
  };
}
