import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useRouter } from '@/lib/router';
import { workflowSurfaceAtom } from '@/features/workflows-hub/workflows-store';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';

export default function WorkflowRunsRoute() {
  const router = useRouter();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  const setSurface = useSetAtom(workflowSurfaceAtom);
  useEffect(() => {
    setSurface('history');
    openWindow({ pageKey: 'workflows', title: 'Workflows' });
    router.replace('/');
  }, [openWindow, router, setSurface]);
  return null;
}
