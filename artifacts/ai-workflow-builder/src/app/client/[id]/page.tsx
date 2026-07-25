
import dynamic from '@/lib/next-dynamic-shim';
const ClientWorkspace = dynamic(() => import('@/features/worksheets/legacy/pages/ClientWorkspace'), { ssr: false });
export default function ClientPage() {
  return <ClientWorkspace />;
}
