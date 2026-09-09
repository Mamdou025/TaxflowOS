

import dynamic from '@/lib/next-dynamic-shim';
import { useRouter } from '@/lib/router';
import { FolderOpen, GitFork } from 'lucide-react';
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
        <NeuSectionLabel>Workspace</NeuSectionLabel>
        <NeuRow icon={<GitFork size={14} />} label="Workflow Builder" onClick={() => router.push('/workflows-hub')} />
      </NeumorphicSidebar>

      <div className="flex-1 min-w-0 overflow-y-auto">
        <DocumentsLibrary />
      </div>
    </div>
  );
}
