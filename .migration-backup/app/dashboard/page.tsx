'use client';
import dynamic from 'next/dynamic';
// Client-only: this page uses `wouter`, whose hooks read `location` (undefined
// during server render). See app/fapi/page.tsx for the same pattern.
const Dashboard = dynamic(() => import('@tax/pages/Dashboard'), { ssr: false });
export default function DashboardPage() {
  return <Dashboard />;
}
