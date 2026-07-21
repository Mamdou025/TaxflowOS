'use client';

// Worksheets hub — the standalone route for the "Worksheets" menu. A gallery of
// every worksheet in the engagement; open one to review, modify, and work on it.
// Wrapped in WorksheetShell so it shares the neumorphic worksheet rail.

import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { WorksheetShell } from '@/components/worksheet-shell';
import { WorksheetsGallery } from '@/components/worksheet/worksheets-gallery';
import { selectedClientAtom } from '@/shared/stores/nav-store';

export default function WorksheetsPage() {
  const router = useRouter();
  const client = useAtomValue(selectedClientAtom);

  return (
    <WorksheetShell>
      <WorksheetsGallery
        subtitle={`Open a worksheet to review, modify, and work on it — ${client}.`}
        onOpen={(ws) => router.push(ws.href)}
      />
    </WorksheetShell>
  );
}
