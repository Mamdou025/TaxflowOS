import { ChatWorkspace } from '@/features/assistant/workspace/copilot-workspace-panel';

// The main page IS the assistant — the chat is mounted on landing (no navigation
// delay), with the composer centered until the first message, then it transitions
// into the full conversation.
export default function Home() {
  return <ChatWorkspace />;
}
