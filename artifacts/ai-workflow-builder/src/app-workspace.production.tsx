import { lazy } from 'react';

// Production loads compact bundles rather than the development module graph.
export const AppShell = lazy(() =>
  import('@/components/app-shell').then((module) => ({ default: module.AppShell })),
);
export const ChatWorkspacePage = lazy(() =>
  import('@/features/assistant/workspace/copilot-workspace-panel').then((module) => ({
    default: module.ChatWorkspace,
  })),
);
