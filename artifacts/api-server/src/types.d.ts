// Extend Express.Request with the authenticated user ID.
// Protected routes receive the session actor; workspace routes additionally
// receive the workspace and role verified against current server membership.
declare namespace Express {
  interface Request {
    isDemo: boolean;
    userId: string;
    workspaceId: string;
    workspaceRole: import('@workspace/api-zod/access').WorkspaceRole;
  }
}
