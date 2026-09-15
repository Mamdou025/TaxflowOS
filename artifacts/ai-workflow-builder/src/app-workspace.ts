// Vite development serves individual modules. Load the primary workspace before
// mounting routes; production selects the bundled lazy adapter in vite.config.ts.
export { AppShell } from '@/components/app-shell';
export { ChatWorkspace as ChatWorkspacePage } from '@/features/assistant/workspace/copilot-workspace-panel';
