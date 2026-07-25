'use client';
import dynamic from 'next/dynamic';
const ClientWorkspace = dynamic(() => import('@tax/pages/ClientWorkspace'), { ssr: false });
export default function ClientPage() {
  return <ClientWorkspace />;
}
