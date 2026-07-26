import type { CSSProperties } from 'react';
import { LC } from '@/lib/librechat-theme';

// Shared CSS-in-JS theme object applied to the root AssistantThread div.
// Lives in its own file so that edits to assistant-thread.tsx don't trigger
// a Fast-Refresh cascade through assistant-panel.tsx → copilot-workspace-panel.tsx
// (React's Fast Refresh requires every exported value from a component file to
// itself be a component or hook).
export const CHAT_THEME: CSSProperties = {
  fontSize: 13,
  color: LC.text,
};
