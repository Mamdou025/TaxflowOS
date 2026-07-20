import FapiWorksheet from '@/components/worksheet/fapi-worksheet';
import { WorksheetShell } from '@/components/worksheet-shell';

export default function FapiPage() {
  return (
    <WorksheetShell>
      <FapiWorksheet />
    </WorksheetShell>
  );
}
