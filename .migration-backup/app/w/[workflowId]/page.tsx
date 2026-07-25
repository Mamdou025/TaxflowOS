'use client';

// Direct link to a workflow (/w/pf-t1134) — preselects it and opens the Scope
// workspace Workflows surface.

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { selectedWorkflowIdAtom } from '@/features/workflows-hub/workflows-store';

export default function WorkflowRoute() {
  const router = useRouter();
  const params = useParams();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  const setSelected = useSetAtom(selectedWorkflowIdAtom);
  useEffect(() => {
    const id = String(params?.workflowId ?? '');
    if (id) setSelected(id);
    openWindow({ pageKey: 'workflows', title: 'Workflows' });
    router.replace('/');
  }, [params, openWindow, setSelected, router]);
  return null;
}
