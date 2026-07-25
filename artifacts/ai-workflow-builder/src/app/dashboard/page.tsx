
import dynamic from '@/lib/next-dynamic-shim';
// Client-only: this page uses `wouter`, whose hooks read `location` (undefined
// during server render). See app/fapi/page.tsx for the same pattern.
const Dashboard = dynamic(() => import('@/features/worksheets/legacy/pages/Dashboard'), { ssr: false });
export default function DashboardPage() {
  return <Dashboard />;
}
