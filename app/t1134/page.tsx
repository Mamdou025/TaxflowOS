'use client';
import dynamic from 'next/dynamic';
const T1134Worksheet = dynamic(() => import('@tax/pages/T1134Worksheet'), { ssr: false });
export default function T1134Page() {
  return <T1134Worksheet />;
}
