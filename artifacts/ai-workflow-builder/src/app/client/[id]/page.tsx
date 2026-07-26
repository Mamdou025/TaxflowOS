
import dynamic from '@/lib/next-dynamic-shim';
import { WorksheetErrorBoundary } from '@/components/worksheet-error-boundary';
const ClientWorkspace = dynamic(() => import('@/features/worksheets/legacy/pages/ClientWorkspace'), { ssr: false });
export default function ClientPage() {
  return (
    <WorksheetErrorBoundary label="Client Workspace">
      <ClientWorkspace />
    </WorksheetErrorBoundary>
  );
}
