import { useRouter } from '@/lib/router';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';

export default function DocumentsPage() {
  const router = useRouter();
  const openWindow = useSetAtom(openWorkspaceWindowAtom);

  useEffect(() => {
    openWindow({ pageKey: 'sources', title: 'Sources' });
    router.replace('/');
  }, [openWindow, router]);

  return null;
}
