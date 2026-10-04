import { Eraser, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { WorkflowRuns } from '../workflow-runs';

export function WorkspaceRunsTab({
  activeTab,
  isRefreshing,
  onDeleteAll,
  onRefresh,
  refreshRunsRef,
}: {
  activeTab: string;
  isRefreshing: boolean;
  onDeleteAll: () => void;
  onRefresh: () => void;
  refreshRunsRef: React.RefObject<(() => Promise<void>) | null>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
        <Button
          className="text-muted-foreground"
          disabled={isRefreshing}
          onClick={onRefresh}
          size="sm"
          variant="ghost"
        >
          <RefreshCw className={`mr-2 size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button className="text-muted-foreground" onClick={onDeleteAll} size="sm" variant="ghost">
          <Eraser className="mr-2 size-4" />
          Clear All
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <WorkflowRuns isActive={activeTab === 'runs'} onRefreshRef={refreshRunsRef} />
      </div>
    </div>
  );
}
