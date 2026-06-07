'use client';
import dynamic from 'next/dynamic';

const OrbitalStage = dynamic(() => import('@tax/components/OrbitalStage'), { ssr: false });

export default function Home() {
  return <OrbitalStage />;
}
