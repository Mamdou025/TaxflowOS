
import dynamic from '@/lib/next-dynamic-shim';
import { WorksheetShell } from '@/components/worksheet-shell';
const ExecutiveOverview = dynamic(() => import('@/features/worksheets/legacy/pages/ExecutiveOverview'), { ssr: false });
export default function BuOverviewPage() {
  return (
    <WorksheetShell>
      <ExecutiveOverview />
    </WorksheetShell>
  );
}
