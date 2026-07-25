

// Inline "Workflows" hub — the page the Scope sidebar's Workflows menu opens
// (registered as resource `workflows`). The single Workflows surface: a workflow
// list + Overview · Build · Run · Results tabs over the selected workflow.

import { WorkflowPage } from '@/features/workflows-hub/workflow-page';

export default function WorkflowsHub() {
  return <WorkflowPage />;
}
