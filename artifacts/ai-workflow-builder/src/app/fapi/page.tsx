import FapiWorksheet from '@/features/worksheets/components/fapi-worksheet';
import { WorksheetShell } from '@/components/worksheet-shell';

export default function FapiPage() {
  return (
    <WorksheetShell>
      <FapiWorksheet />
    </WorksheetShell>
  );
}
