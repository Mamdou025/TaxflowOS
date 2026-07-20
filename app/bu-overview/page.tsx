'use client';
import dynamic from 'next/dynamic';
import { WorksheetShell } from '@/components/worksheet-shell';
const ExecutiveOverview = dynamic(() => import('@tax/pages/ExecutiveOverview'), { ssr: false });
export default function BuOverviewPage() {
  return (
    <WorksheetShell>
      <ExecutiveOverview />
    </WorksheetShell>
  );
}
