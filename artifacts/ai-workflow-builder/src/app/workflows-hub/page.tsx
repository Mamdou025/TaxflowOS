

// The "Workflows" destination is a Scope-workspace surface (sidebar list + header
// tabs + canvas), not a bare route — so this route opens the workspace workflows
// window and lands you in the workspace.

import { useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useSetAtom } from 'jotai';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';

export default function WorkflowsHubPage() {
  const router = useRouter();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  useEffect(() => {
    openWindow({ pageKey: 'workflows', title: 'Workflows' });
    router.replace('/');
  }, [openWindow, router]);
  return null;
}
