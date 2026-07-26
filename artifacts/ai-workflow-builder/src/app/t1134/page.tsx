
import dynamic from '@/lib/next-dynamic-shim';
import { WorksheetShell } from '@/components/worksheet-shell';
const T1134Worksheet = dynamic(() => import('@/features/worksheets/legacy/pages/T1134Worksheet'), { ssr: false });
export default function T1134Page() {
  return (
    <WorksheetShell>
      <T1134Worksheet />
    </WorksheetShell>
  );
}
