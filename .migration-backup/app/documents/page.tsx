'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Files, FolderOpen, Calculator, FileText, Layers, BarChart3, LayoutDashboard, GitFork } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { NeumorphicSidebar, NeuSidebarHeader, NeuSectionLabel, NeuRow } from '@/components/neumorphic-sidebar';
import { selectedClientAtom } from '@/shared/stores/nav-store';

// The company-document library — upload, browse, and manage stored documents that
// Sina can retrieve from. Same neumorphic sidebar as the viewer route for nav parity.
const DocumentsLibrary = dynamic(
  () => import('@/features/documents/documents-library').then((m) => m.DocumentsLibrary),
  { ssr: false }
);

export default function DocumentsPage() {
  const router = useRouter();
  const client = useAtomValue(selectedClientAtom);

  return (
    <div className="h-full flex">
      <NeumorphicSidebar header={<NeuSidebarHeader title="Documents" subtitle={client} />}>
        <NeuRow icon={<FolderOpen size={14} />} label="Library" active onClick={() => {}} />
        <NeuRow icon={<Files size={14} />} label="Document Viewer" onClick={() => router.push('/viewer')} />
        <NeuSectionLabel>Worksheets</NeuSectionLabel>
        <NeuRow icon={<Calculator size={14} />} label="FAPI Workpaper" onClick={() => router.push('/fapi')} />
        <NeuRow icon={<FileText size={14} />} label="T1134 Workpaper" onClick={() => router.push('/t1134')} />
        <NeuRow icon={<Layers size={14} />} label="Surplus Continuity" onClick={() => router.push('/surplus')} />
        <NeuRow icon={<BarChart3 size={14} />} label="Executive Overview" onClick={() => router.push('/bu-overview')} />
        <NeuSectionLabel>Workspace</NeuSectionLabel>
        <NeuRow icon={<GitFork size={14} />} label="Workflow Builder" onClick={() => router.push('/builder')} />
        <NeuRow icon={<LayoutDashboard size={14} />} label="Dashboard" onClick={() => router.push('/dashboard')} />
      </NeumorphicSidebar>

      <div className="flex-1 min-w-0 overflow-y-auto">
        <DocumentsLibrary />
      </div>
    </div>
  );
}
