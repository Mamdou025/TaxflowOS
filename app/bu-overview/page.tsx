'use client';
import dynamic from 'next/dynamic';
const ExecutiveOverview = dynamic(() => import('@tax/pages/ExecutiveOverview'), { ssr: false });
export default function BuOverviewPage() {
  return <ExecutiveOverview />;
}
