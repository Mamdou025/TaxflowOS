// Shared Google API response types.
// Re-exported here so UI components can import them without depending on
// Next.js API route files (which are excluded from the Vite tsconfig).
export type { DriveFile, GmailMessage } from '@/platform/integrations/google/client';

export type GoogleStatusResponse = {
  connected: boolean;
  missingScopes: string[];
  requiredScopes: string[];
  configured: boolean;
};

export type DriveFilesResponse = { files: import('@/platform/integrations/google/client').DriveFile[] };
export type GmailMessagesResponse = { messages: import('@/platform/integrations/google/client').GmailMessage[] };
