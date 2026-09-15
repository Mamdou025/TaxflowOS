import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useRouter } from '@/lib/router';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';

export default function ConnectionsRoute() {
  const router = useRouter();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  useEffect(() => {
    openWindow({ pageKey: 'connections', title: 'Connections' });
    router.replace('/');
  }, [openWindow, router]);
  return null;
}
