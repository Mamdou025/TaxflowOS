import { z } from 'zod';
import type { SourceRetrievalPolicy, SourceRetrievalResult } from '@workspace/source-core';
import type { AgentCapability } from './capabilities';

export type AgentWorkspaceContext = {
  actorId: string;
  workspaceId: string;
  agentId: string;
};

export type AgentWorkspacePorts = {
  listWorkflows: (context: AgentWorkspaceContext) => Promise<unknown>;
  readWorkflow: (
    context: AgentWorkspaceContext,
    input: { workflowId: string; version?: number },
  ) => Promise<unknown>;
  retrieveSources: (
    context: AgentWorkspaceContext,
    input: {
      query: string;
      clientId?: string;
      selectedSourceIds: string[];
      policy: SourceRetrievalPolicy;
      limit: number;
    },
  ) => Promise<SourceRetrievalResult>;
  proposeWorkflowDraft: (
    context: AgentWorkspaceContext,
    input: { workflowId: string; reason: string; draft: Record<string, unknown> },
  ) => Promise<unknown>;
  applyWorkflowProposal: (
    context: AgentWorkspaceContext,
    input: { proposalId: string },
  ) => Promise<unknown>;
  saveWorkflowVersion: (
    context: AgentWorkspaceContext,
    input: { workflowId: string },
  ) => Promise<unknown>;
  executeWorkflowVersion: (
    context: AgentWorkspaceContext,
    input: { workflowId: string; version: number; input: Record<string, unknown> },
  ) => Promise<unknown>;
};

const WorkflowIdSchema = z.string().trim().min(1).max(200);
const EmptySchema = z.object({}).strict();

const definitions = {
  listWorkflows: {
    capability: 'workflow:read',
    description: 'List workflows in the current authorized workspace.',
    inputSchema: EmptySchema,
  },
  readWorkflow: {
    capability: 'workflow:read',
    description: 'Read an exact workflow draft or saved version from the current workspace.',
    inputSchema: z
      .object({ workflowId: WorkflowIdSchema, version: z.number().int().positive().optional() })
      .strict(),
  },
  retrieveSources: {
    capability: 'source:retrieve',
    description: 'Retrieve authorized source passages with provenance and limitations.',
    inputSchema: z
      .object({
        query: z.string().trim().min(1).max(2000),
        clientId: z.string().trim().min(1).max(200).optional(),
        selectedSourceIds: z.array(z.string().trim().min(1).max(200)).max(50).default([]),
        policy: z
          .enum(['selected-only', 'selected-and-authorized'])
          .default('selected-and-authorized'),
        limit: z.number().int().min(1).max(20).default(6),
      })
      .strict(),
  },
  proposeWorkflowDraft: {
    capability: 'workflow:propose',
    description: 'Prepare a reviewable workflow draft proposal without applying it.',
    inputSchema: z
      .object({
        workflowId: WorkflowIdSchema,
        reason: z.string().trim().min(1).max(2000),
        draft: z.record(z.string(), z.unknown()),
      })
      .strict(),
  },
  applyWorkflowProposal: {
    capability: 'workflow:apply-draft',
    description: 'Apply an existing proposal after the workflow service verifies its grant.',
    inputSchema: z.object({ proposalId: z.string().trim().min(1).max(200) }).strict(),
  },
  saveWorkflowVersion: {
    capability: 'workflow:save-version',
    description: 'Save the current workflow draft as an immutable version after authorization.',
    inputSchema: z.object({ workflowId: WorkflowIdSchema }).strict(),
  },
  executeWorkflowVersion: {
    capability: 'workflow:execute',
    description: 'Execute an exact saved workflow version after authorization.',
    inputSchema: z
      .object({
        workflowId: WorkflowIdSchema,
        version: z.number().int().positive(),
        input: z.record(z.string(), z.unknown()).default({}),
      })
      .strict(),
  },
} as const satisfies Record<
  string,
  { capability: AgentCapability; description: string; inputSchema: z.ZodType }
>;

export type AgentWorkspaceToolId = keyof typeof definitions;

export class AgentWorkspaceToolError extends Error {
  constructor(
    readonly code: 'UNKNOWN_TOOL' | 'INVALID_ARGUMENTS',
    message: string,
  ) {
    super(message);
    this.name = 'AgentWorkspaceToolError';
  }
}

export function createAgentWorkspaceTools(ports: AgentWorkspacePorts) {
  return {
    definitions,
    async run(toolId: string, rawInput: unknown, context: AgentWorkspaceContext) {
      if (!(toolId in definitions))
        throw new AgentWorkspaceToolError('UNKNOWN_TOOL', `Unknown workspace tool '${toolId}'.`);
      const id = toolId as AgentWorkspaceToolId;
      const parsed = definitions[id].inputSchema.safeParse(rawInput ?? {});
      if (!parsed.success)
        throw new AgentWorkspaceToolError('INVALID_ARGUMENTS', 'Invalid workspace tool arguments.');
      switch (id) {
        case 'listWorkflows':
          return ports.listWorkflows(context);
        case 'readWorkflow':
          return ports.readWorkflow(
            context,
            parsed.data as { workflowId: string; version?: number },
          );
        case 'retrieveSources':
          return ports.retrieveSources(
            context,
            parsed.data as {
              query: string;
              clientId?: string;
              selectedSourceIds: string[];
              policy: SourceRetrievalPolicy;
              limit: number;
            },
          );
        case 'proposeWorkflowDraft':
          return ports.proposeWorkflowDraft(
            context,
            parsed.data as { workflowId: string; reason: string; draft: Record<string, unknown> },
          );
        case 'applyWorkflowProposal':
          return ports.applyWorkflowProposal(context, parsed.data as { proposalId: string });
        case 'saveWorkflowVersion':
          return ports.saveWorkflowVersion(context, parsed.data as { workflowId: string });
        case 'executeWorkflowVersion':
          return ports.executeWorkflowVersion(
            context,
            parsed.data as {
              workflowId: string;
              version: number;
              input: Record<string, unknown>;
            },
          );
      }
    },
  };
}
