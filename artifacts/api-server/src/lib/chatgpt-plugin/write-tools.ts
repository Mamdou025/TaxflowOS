import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { WorkflowCommandError } from '@workspace/workflow-core/commands';
import {
  sessionStartSchema,
  sessionPreviewSchema,
  sessionApplySchema,
  sessionRecalculateSchema,
  type SessionService,
} from './session-service';
import { SessionCommandError, type SessionActor } from './session-types';
import { sourceToolSchemas, runSourceTool, SourceCaptureError } from './source-captures';
import { boundedResult, failure, runReadTool, type ReadToolDependencies } from './read-tools';

export const commandTools = {
  start_workflow_session: {
    schema: sessionStartSchema,
    permission: 'write',
    appOnly: true,
    readOnly: false,
    description:
      'Start one paused working run from an exact saved workflow version. Preserves the conversation, saved versions and other runs; does not calculate. Reuse the returned runId for subsequent work. Use a stable requestId for retries.',
  },
  preview_workflow_change: {
    schema: sessionPreviewSchema,
    permission: 'write',
    appOnly: true,
    readOnly: false,
    description:
      'Stage an exact-revision input edit or captured source replacement for user review. Returns before/after values and affected steps. Does not apply or calculate. Present the change for explicit review in the existing InScope panel.',
  },
  apply_workflow_change: {
    schema: sessionApplySchema,
    permission: 'write',
    appOnly: true,
    readOnly: false,
    description:
      'Apply the exact one-time reviewed change after the user chooses Apply in the panel. Leaves the same run paused and dependent results outdated. Does not recalculate or approve.',
  },
  recalculate_workflow_session: {
    schema: sessionRecalculateSchema,
    permission: 'execute',
    appOnly: true,
    readOnly: false,
    description:
      'Explicitly recalculate ready pending/outdated steps in the exact working run using captured inputs. Stops at missing inputs, unsupported tools, errors or review checkpoints; keeps approval separate. Use a stable requestId for retries.',
  },
  begin_workflow_source: {
    schema: sourceToolSchemas.begin_workflow_source,
    permission: 'write',
    appOnly: true,
    readOnly: false,
    description:
      'Stage a user-selected source file for one exact working run and source block. Does not replace the active source. Supports files up to 20 MB.',
  },
  append_workflow_source: {
    schema: sourceToolSchemas.append_workflow_source,
    permission: 'write',
    appOnly: true,
    readOnly: false,
    description:
      'Upload an ordered chunk of the user-selected file bytes. Retries must contain identical bytes. Does not modify the workflow.',
  },
  inspect_workflow_source: {
    schema: sourceToolSchemas.inspect_workflow_source,
    permission: 'write',
    appOnly: true,
    readOnly: true,
    description:
      'Read worksheet/header previews of the staged file so the user can choose the sheet and column mapping. Does not attach or calculate.',
  },
  capture_workflow_source: {
    schema: sourceToolSchemas.capture_workflow_source,
    permission: 'write',
    appOnly: true,
    readOnly: false,
    description:
      'Parse the uploaded bytes and explicit sheet mapping into a verified source capture, retaining its hash and storage status. Does not attach it; preview and reviewed apply are separate.',
  },
} as const;
export type CommandToolName = keyof typeof commandTools;
export type CommandToolDependencies = {
  actor: SessionActor;
  service: SessionService;
  authorize: (permission: 'write' | 'execute') => Promise<void>;
};

export async function runCommandTool(
  name: CommandToolName,
  input: unknown,
  dependencies: CommandToolDependencies,
  reader: ReadToolDependencies,
): Promise<CallToolResult> {
  try {
    const tool = commandTools[name];
    await dependencies.authorize(tool.permission);
    if (name === 'preview_workflow_change')
      return boundedResult({
        ...(await dependencies.service.preview(
          dependencies.actor,
          sessionPreviewSchema.parse(input),
        )),
      });
    let receipt;
    if (name === 'start_workflow_session')
      receipt = await dependencies.service.start(
        dependencies.actor,
        sessionStartSchema.parse(input),
      );
    else if (name === 'apply_workflow_change')
      receipt = await dependencies.service.apply(
        dependencies.actor,
        sessionApplySchema.parse(input),
      );
    else if (name === 'recalculate_workflow_session')
      receipt = await dependencies.service.recalculate(
        dependencies.actor,
        sessionRecalculateSchema.parse(input),
      );
    else return boundedResult(await runSourceTool(dependencies.actor, name, input));
    const view = await runReadTool(
      'inspect_workflow_run',
      { workflowId: receipt.workflowId, runId: receipt.runId },
      reader,
    );
    // A successful command stays acknowledged even if the subsequent read is unavailable.
    if (view.isError)
      return {
        ...boundedResult({
          ...receipt,
          snapshotUnavailable: true,
          message:
            'The change was saved, but its view could not be refreshed. Refresh the same run before further edits.',
        }),
        _meta: { operationReceipt: receipt },
      };
    return {
      ...view,
      structuredContent: { ...view.structuredContent, operation: receipt },
      _meta: { ...view._meta, operationReceipt: receipt },
    };
  } catch (error) {
    if (error instanceof SessionCommandError || error instanceof WorkflowCommandError)
      return failure(error.code, error.message);
    if (error instanceof SourceCaptureError) return failure('SOURCE_UNAVAILABLE', error.message);
    if (error instanceof z.ZodError)
      return failure(
        'INVALID_ARGUMENTS',
        'Supply valid exact arguments; the requested operation was not completed.',
      );
    return failure(
      'OPERATION_UNAVAILABLE',
      'This operation could not be confirmed. Refresh the same working run before retrying; do not create a replacement conversation.',
    );
  }
}
