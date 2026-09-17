import { useParams, useRouter } from '@/lib/router';
import { WorkflowSessionPanel } from '@/features/workflows-hub/workflow-session-panel';

/** Compatibility route uses the same run panel as Chat and Workflows. */
export default function RunPage() {
  const params = useParams();
  const router = useRouter();
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <button className="underline" onClick={() => router.push('/')}>
          Back to Chat
        </button>
        <WorkflowSessionPanel workflowId={String(params?.workflowId ?? '')} />
      </div>
    </div>
  );
}
