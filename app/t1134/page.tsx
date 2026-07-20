'use client';
import dynamic from 'next/dynamic';
import { WorksheetShell } from '@/components/worksheet-shell';
const T1134Worksheet = dynamic(() => import('@tax/pages/T1134Worksheet'), { ssr: false });
export default function T1134Page() {
  return (
    <WorksheetShell>
      <T1134Worksheet />
    </WorksheetShell>
  );
}
