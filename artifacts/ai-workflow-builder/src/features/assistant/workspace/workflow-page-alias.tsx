import { useEffect } from 'react';
import { useStore } from 'jotai';
import {
  closeWorkspaceWindowAtom,
  openWorkspaceWindowAtom,
  workspaceWindowsAtom,
} from '@/shared/stores/workspace-store';
import {
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
  workflowTabAtom,
} from '@/features/workflows-hub/workflows-store';

/** Old worksheet links navigate to the shared workflow surface without starting a run. */
export default function WorkflowPageAlias({ workflowId }: { workflowId: string }) {
  const store = useStore();
  useEffect(() => {
    store.set(selectedWorkflowIdAtom, workflowId);
    store.set(selectedWorkflowRunIdAtom, null);
    store.set(workflowSurfaceAtom, 'workflow');
    store.set(workflowTabAtom, 'overview');
    store.set(openWorkspaceWindowAtom, { pageKey: 'workflows', title: 'Workflows' });
    const alias = store
      .get(workspaceWindowsAtom)
      .find((window) => window.pageKey === workflowId.replace(/^pf-/, ''));
    if (alias) store.set(closeWorkspaceWindowAtom, alias.id);
  }, [store, workflowId]);
  return <p style={{ padding: 24 }}>Opened in Workflows.</p>;
}
