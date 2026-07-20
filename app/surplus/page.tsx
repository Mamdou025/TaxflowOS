'use client';
import dynamic from 'next/dynamic';
import { WorksheetShell } from '@/components/worksheet-shell';
const SurplusWorksheet = dynamic(() => import('@tax/pages/SurplusWorksheet'), { ssr: false });
export default function SurplusPage() {
  return (
    <WorksheetShell>
      <SurplusWorksheet />
    </WorksheetShell>
  );
}
