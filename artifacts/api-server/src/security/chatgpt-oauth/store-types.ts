import type { WorkspaceRole } from '@workspace/api-zod/access';

export type OAuthActor = { userId: string; sessionId: string };
export type OAuthRequestInput = {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  resource: string;
  scope: string;
  state?: string;
};
export type OAuthDecision = { decision: 'allow' | 'deny'; workspaceId?: string };
export type OAuthRequestDetails = {
  clientName: string;
  scope: string;
  resource: string;
  redirectUri: string;
  expiresAt: string;
  workspaces: { id: string; name: string; role: WorkspaceRole }[];
};
export type OAuthGrantSummary = {
  id: string;
  workspaceId: string;
  workspaceName: string;
  scope: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};
export type OAuthCodeExchange = {
  clientId: string;
  code: string;
  redirectUri: string;
  resource: string;
};
export type OAuthRefresh = {
  clientId: string;
  refreshToken: string;
  resource: string;
  scopes?: string[];
};
export type GrantRow = {
  id: string;
  user_id: string;
  workspace_id: string;
  client_id: string;
  resource: string;
  scope: string;
  expires_at: Date;
  revoked_at: Date | null;
};
