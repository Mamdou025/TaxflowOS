// Direct link to a workflow (/w/pf-t1134) — preselects it and opens the Scope
// workspace Workflows surface.

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from '@/lib/router';
import { useSetAtom } from 'jotai';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import {
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
  workflowTabAtom,
} from '@/features/workflows-hub/workflows-store';

export default function WorkflowRoute() {
  const router = useRouter();
  const params = useParams();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  const setSelected = useSetAtom(selectedWorkflowIdAtom);
  const setSelectedRun = useSetAtom(selectedWorkflowRunIdAtom);
  const setSurface = useSetAtom(workflowSurfaceAtom);
  const setTab = useSetAtom(workflowTabAtom);
  const search = useSearchParams();
  useEffect(() => {
    let id = String(params?.workflowId ?? '');
    try {
      id = decodeURIComponent(id);
    } catch {
      /* An invalid ID stays unavailable. */
    }
    const runId = search.get('run');
    if (id) {
      setSelected(id);
      setSurface('workflow');
      setSelectedRun(runId);
      setTab(runId ? 'results' : 'overview');
    }
    openWindow({ pageKey: 'workflows', title: 'Workflows' });
    router.replace('/');
  }, [params, openWindow, router, search, setSelected, setSelectedRun, setSurface, setTab]);
  return null;
}
