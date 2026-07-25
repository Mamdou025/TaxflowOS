'use client';

// Inline "Worksheets" hub — the page the Scope sidebar's Worksheets menu opens.
// Renders the shared gallery; picking a worksheet opens it as an inline page in
// the workspace (same openWorkspaceWindow path the sidebar's worksheet rows use),
// so it stays in the chat workspace instead of navigating away.

import { useSetAtom } from 'jotai';
import { WorksheetsGallery } from '@/features/worksheets/components/worksheets-gallery';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { getPage } from '@/shared/stores/resource-registry';

export default function WorksheetsHub() {
  const openWindow = useSetAtom(openWorkspaceWindowAtom);

  return (
    <WorksheetsGallery
      dark
      subtitle="Open a worksheet to review, modify, and work on it."
      onOpen={(ws) => {
        const key = ws.href.replace(/^\//, ''); // "/fapi" → "fapi"
        openWindow({ pageKey: key, title: getPage(key)?.title ?? ws.label });
      }}
    />
  );
}
