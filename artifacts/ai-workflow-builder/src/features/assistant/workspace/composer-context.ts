import { createContext, type ReactNode } from 'react';
import type { ChatAgent } from '@/shared/stores/chat-store';
import type { ToolRunResult } from '../ui/tools-menu';

export type ComposerSuggestion = {
  key: string;
  title: string;
  sub: string;
  kind: string;
  dim?: boolean;
  icon?: ReactNode;
  run: () => void;
};

/** A tool selected in the Tools menu for the next message. */
export type ArmedComposerTool = { name: string; label: string };

/** Application controls and status; assistant-ui owns the draft and attachments. */
export const AsideComposerContext = createContext<{
  search?: (query: string) => ComposerSuggestion[];
  tools?: ComposerSuggestion[];
  commands?: ComposerSuggestion[];
  onAttach?: (files: File[]) => Promise<string>;
  onInterrupt?: () => Promise<void>;
  onSend?: (text: string) => Promise<unknown>;
  replyPending?: boolean;
  agentReady?: boolean;
  conversationKey?: string;
  attaching?: boolean;
  submissionPending?: boolean;
  error?: string | null;
  onAttachmentError?: (error: unknown) => void;
  onCustomizeAgent?: () => void;
  onAgentChange?: (agent: ChatAgent) => void;
  agentSelectionDisabled?: boolean;
  armedTool?: ArmedComposerTool | null;
  setArmedTool?: (tool: ArmedComposerTool | null) => void;
  onRunResult?: (result: ToolRunResult) => void;
} | null>(null);
