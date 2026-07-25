
import dynamic from '@/lib/next-dynamic-shim';
import { WorksheetShell } from '@/components/worksheet-shell';
const SurplusWorksheet = dynamic(() => import('@/features/worksheets/legacy/pages/SurplusWorksheet'), { ssr: false });
export default function SurplusPage() {
  return (
    <WorksheetShell>
      <SurplusWorksheet />
    </WorksheetShell>
  );
}
