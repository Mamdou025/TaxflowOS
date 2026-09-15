import { z } from 'zod';

export const WorkspaceIdSchema = z.string().uuid();
export const WorkspaceRoleSchema = z.enum(['owner', 'editor', 'viewer']);
export type WorkspaceRole = z.infer<typeof WorkspaceRoleSchema>;
export type WorkspaceAction = 'read' | 'write' | 'execute' | 'manage';
export const WORKSPACE_ID_HEADER = 'x-taxflow-workspace';
export function permits(role: WorkspaceRole, action: WorkspaceAction): boolean {
  return role === 'owner' || (role === 'editor' && action !== 'manage') || action === 'read';
}
export const WorkspaceSchema = z.object({
  id: WorkspaceIdSchema,
  name: z.string(),
  role: WorkspaceRoleSchema,
});
export type Workspace = z.infer<typeof WorkspaceSchema>;
export const WorkspaceListSchema = z.object({ workspaces: z.array(WorkspaceSchema) });
export const SessionSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    isDemo: z.boolean().default(false),
  }),
});
export const CreateWorkspaceSchema = z.object({ name: z.string().trim().min(1).max(100) }).strict();
export const MemberSchema = z
  .object({ userId: z.string().min(1).max(128), role: WorkspaceRoleSchema })
  .strict();
export const MemberListSchema = z.object({
  members: z.array(MemberSchema.extend({ name: z.string().nullable() })),
});
