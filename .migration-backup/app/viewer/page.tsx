'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Files, Calculator, FileText, Layers, BarChart3, LayoutDashboard, GitFork, Building2 } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { NeumorphicSidebar, NeuSidebarHeader, NeuSectionLabel, NeuRow } from '@/components/neumorphic-sidebar';
import { selectedClientAtom } from '@/shared/stores/nav-store';

// Full-height frame for the Document Viewer route. Same neumorphic sidebar as the
// worksheet routes (for nav parity), but the viewer fills a bounded, overflow-hidden
// panel — NOT the scrolling `worksheet-card` (whose `height:auto` override would
// collapse the PDF iframe / the viewer's own flex layout).
const DocumentViewer = dynamic(() => import('@/features/assistant/workspace/document-viewer'), { ssr: false });

export default function ViewerPage() {
  const router = useRouter();
  const client = useAtomValue(selectedClientAtom);

  return (
    <div className="h-full flex">
      <NeumorphicSidebar header={<NeuSidebarHeader title="Documents" subtitle={client} />}>
        <NeuRow icon={<Files size={14} />} label="Document Viewer" active onClick={() => {}} />
        <NeuSectionLabel>Worksheets</NeuSectionLabel>
        <NeuRow icon={<Calculator size={14} />} label="FAPI Workpaper" onClick={() => router.push('/fapi')} />
        <NeuRow icon={<FileText size={14} />} label="T1134 Workpaper" onClick={() => router.push('/t1134')} />
        <NeuRow icon={<Layers size={14} />} label="Surplus Continuity" onClick={() => router.push('/surplus')} />
        <NeuRow icon={<BarChart3 size={14} />} label="Executive Overview" onClick={() => router.push('/bu-overview')} />
        <NeuSectionLabel>Workspace</NeuSectionLabel>
        <NeuRow icon={<GitFork size={14} />} label="Workflow Builder" onClick={() => router.push('/builder')} />
        <NeuRow icon={<Building2 size={14} />} label="Client file" onClick={() => router.push('/client/northstar')} />
        <NeuRow icon={<LayoutDashboard size={14} />} label="Dashboard" onClick={() => router.push('/dashboard')} />
      </NeumorphicSidebar>

      <div className="flex-1 min-w-0 overflow-hidden" style={{ padding: 12 }}>
        <div style={{ height: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 14px 34px rgba(0,0,0,0.30)' }}>
          <DocumentViewer />
        </div>
      </div>
    </div>
  );
}
