

// The "Agent" destination is a Scope-workspace surface (header tabs + body), not a
// bare route — so this route opens the workspace agent window and lands in the workspace.

import { useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useSetAtom } from 'jotai';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';

export default function AgentHubPage() {
  const router = useRouter();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  useEffect(() => {
    openWindow({ pageKey: 'agent', title: 'Agent' });
    router.replace('/');
  }, [openWindow, router]);
  return null;
}
