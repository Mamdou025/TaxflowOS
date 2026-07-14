'use client';
import dynamic from 'next/dynamic';
const SurplusWorksheet = dynamic(() => import('@tax/pages/SurplusWorksheet'), { ssr: false });
export default function SurplusPage() {
  return <SurplusWorksheet />;
}
