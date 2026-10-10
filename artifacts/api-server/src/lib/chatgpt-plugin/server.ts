import { McpServer, type RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { normalizeObjectSchema } from '@modelcontextprotocol/sdk/server/zod-compat.js';
import { toJsonSchemaCompat } from '@modelcontextprotocol/sdk/server/zod-json-schema-compat.js';
import {
  ListToolsRequestSchema,
  ToolSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import {
  readToolSchemas,
  runReadTool,
  WORKFLOW_VIEW_URI,
  type ReadToolDependencies,
  type ReadToolName,
} from './read-tools';
import { commandTools, runCommandTool, type CommandToolDependencies } from './write-tools';
import { SCOPE, WRITE_SCOPE, EXECUTE_SCOPE } from '../../security/chatgpt-oauth/config';

const descriptions: Record<ReadToolName, string> = {
  list_workflows:
    'List saved workflows and exact available version numbers in the authorized workspace. Does not list unsynchronized browser drafts or templates.',
  read_workflow_source:
    'Read the next bounded page of one exact current or replaced source in a workflow run. Preserves source identity and provenance; never attaches, replaces or executes it.',
  get_workflow_version:
    'Read data for one exact saved workflow version without opening a viewer. Use for follow-up questions and refreshing an existing view. Returns graph metadata; include blockId to inspect one exact block configuration and formula. Never runs or edits it. Credential-shaped fields are omitted.',
  list_workflow_runs:
    'List recorded runs and guided sessions in the saved workflow library, optionally for one exact workflow. Separate background-job queue records are not included.',
  inspect_workflow_run:
    'Read data for one exact recorded workflow run or guided session without opening a viewer. Use for follow-up questions and refreshing an existing view. Include blockId for that block configuration, recorded inputs, outputs and provenance. Does not execute or resume it. Missing records fail without selecting a newer run. Credential-shaped fields are omitted.',
  open_workflow_view:
    'Open one exact saved workflow version or recorded run for an explicit request to view, show or reopen it. Supply workflowId and exactly one of version or runId; optionally select blockId. Do not use for follow-up explanations or refreshing an already-open view. Requires a configured viewer. Never runs or edits the workflow. Credential-shaped fields are omitted.',
};
const viewerDescription =
  'Interactive InScope workspace for one exact workflow version or working run, with Workflow, Inputs, Sources and Changes panels. Editing requires explicit write access; review and apply changes before separately recalculating. Users can refresh or expand this same view within ChatGPT.';
const viewerToolDescription =
  ' Also provides an embedded interactive workflow overview in compatible hosts, with selectable step details, inputs, sources, changes and an optional canvas.';

/** This factory receives an already-authorized read port, never caller-supplied identity. */
export function createChatgptPluginServer(
  dependencies: ReadToolDependencies,
  ui?: { html: string; resourceUri?: string },
  oauthScopes?: string[],
  commands?: CommandToolDependencies,
) {
  const server = new McpServer(
    { name: 'inscope-workflow-reader', version: '0.1.0' },
    {
      instructions:
        'Use open_workflow_view only when the user explicitly asks to open, show, visualize or reopen a workflow. For follow-up explanations or existing-view refresh, use get_workflow_version or inspect_workflow_run with the exact selected workspace/workflow/version/run/block context; do not open another viewer. ' +
        (commands
          ? 'Keep the same working run and conversation for corrections. Check returned capabilities; read-only grants cannot edit or recalculate. Direct the user to Start work or the Inputs/Sources controls in the existing panel; its app-only commands stage changes for review and Apply before a separate Recalculate action. Explain the shared pendingReview as an unapplied proposal; fetch the exact saved run for current data. A selected ChatGPT attachment is not evidence until its bytes have been uploaded and captured by the InScope panel. Never reset the workflow to change an input; never invent extracted rows. '
          : 'These tools only inspect saved definitions and recorded evidence: do not offer upload, execution, editing or approval through this plugin. ') +
        'Keep computed results, review/approval and server saving distinct; never describe missing results as completed.',
    },
  );
  const resourceUri = ui?.resourceUri ?? WORKFLOW_VIEW_URI;
  const registered = new Map<string, RegisteredTool>();
  const securitySchemes = oauthScopes ? [{ type: 'oauth2', scopes: [...oauthScopes] }] : undefined;
  for (const name of Object.keys(readToolSchemas) as ReadToolName[]) {
    const showsGraph = name === 'open_workflow_view';
    const refreshesGraph =
      name === 'get_workflow_version' ||
      name === 'inspect_workflow_run' ||
      name === 'read_workflow_source';
    const tool = server.registerTool(
      name,
      {
        description: descriptions[name] + (ui && showsGraph ? viewerToolDescription : ''),
        inputSchema: readToolSchemas[name],
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        ...(securitySchemes || (ui && (showsGraph || refreshesGraph))
          ? {
              _meta: {
                ...(securitySchemes ? { securitySchemes } : {}),
                ...(ui && showsGraph
                  ? { ui: { resourceUri }, 'openai/outputTemplate': resourceUri }
                  : {}),
                ...(ui && refreshesGraph
                  ? { ui: { visibility: ['model', 'app'] }, 'openai/widgetAccessible': true }
                  : {}),
              },
            }
          : {}),
      },
      (input: unknown): CallToolResult | Promise<CallToolResult> =>
        name === 'open_workflow_view' && !ui
          ? {
              isError: true,
              content: [{ type: 'text', text: 'The InScope workflow viewer is not configured.' }],
              structuredContent: {
                error: {
                  code: 'UI_UNAVAILABLE',
                  message: 'The InScope workflow viewer is not configured.',
                },
              },
            }
          : runReadTool(name, input, dependencies),
    );
    registered.set(name, tool);
  }
  if (commands)
    for (const [name, descriptor] of Object.entries(commandTools)) {
      const scopes = oauthScopes
        ? [
            {
              type: 'oauth2',
              scopes: [SCOPE, descriptor.permission === 'write' ? WRITE_SCOPE : EXECUTE_SCOPE],
            },
          ]
        : undefined;
      const tool = server.registerTool(
        name,
        {
          description: descriptor.description,
          inputSchema: descriptor.schema,
          annotations: {
            readOnlyHint: descriptor.readOnly,
            destructiveHint: false,
            idempotentHint: name !== 'begin_workflow_source' && name !== 'preview_workflow_change',
            openWorldHint: name === 'capture_workflow_source',
          },
          _meta: {
            ...(scopes ? { securitySchemes: scopes } : {}),
            ui: { visibility: descriptor.appOnly ? ['app'] : ['model', 'app'] },
            'openai/widgetAccessible': true,
          },
        },
        (input: unknown) =>
          runCommandTool(name as keyof typeof commandTools, input, commands, dependencies),
      );
      registered.set(name, tool);
    }
  if (securitySchemes)
    // SDK 1.29's high-level listing drops top-level extension fields. Keep its
    // registered schemas and call handlers, adding only the OAuth descriptor.
    server.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [...registered]
        .filter(([, tool]) => tool.enabled)
        .map(([name, tool]) => {
          const input = normalizeObjectSchema(tool.inputSchema);
          if (!input) throw new Error('An InScope tool is missing its registered input schema.');
          const output = normalizeObjectSchema(tool.outputSchema);
          const descriptor = ToolSchema.parse({
            name,
            title: tool.title,
            description: tool.description,
            inputSchema: toJsonSchemaCompat(input, { strictUnions: true, pipeStrategy: 'input' }),
            ...(output
              ? {
                  outputSchema: toJsonSchemaCompat(output, {
                    strictUnions: true,
                    pipeStrategy: 'output',
                  }),
                }
              : {}),
            annotations: tool.annotations,
            execution: tool.execution,
            _meta: {
              ...tool._meta,
              securitySchemes: tool._meta?.securitySchemes ?? securitySchemes,
            },
          });
          return { ...descriptor, securitySchemes: tool._meta?.securitySchemes ?? securitySchemes };
        }),
    }));
  if (ui)
    server.registerResource(
      'workflow-viewer',
      resourceUri,
      { mimeType: 'text/html;profile=mcp-app', description: viewerDescription },
      async () => ({
        contents: [
          {
            uri: resourceUri,
            mimeType: 'text/html;profile=mcp-app',
            text: ui.html,
            _meta: { 'openai/widgetDescription': viewerDescription },
          },
        ],
      }),
    );
  return server;
}
