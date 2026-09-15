import { executeWorkflowCommand as executeCommand } from '@workspace/workflow-core/template-command';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { executeWorkflowDefinition } from '@/shared/workflow-engine/workflow/execute';
import { workflowRunContext } from '@/features/workflows-hub/services/workflow-context';
import type { createStore } from 'jotai';
import { executeWorkflowCommand } from './workflow-command';
import { workflowLibraryAtom } from '@/features/workflows-hub/workflow-library';
import { uploadedRowsAtom } from '@/shared/stores/workspace-store';
import { type WorkflowDefinition } from '@/shared/workflow-engine/workflow/contracts';

/** The actual chat handler, shared with integration tests. Every executed graph is
 * saved with its inputs and outputs; missing-input requests create no fake run. */
export function executeAndSaveWorkflowCommand(
  store: ReturnType<typeof createStore>,
  args: Parameters<typeof executeWorkflowCommand>[0],
) {
  try {
    const id = args.workflowId.replace(/^pf-/, '');
    const sources = store.get(uploadedRowsAtom);
    const executed = executeCommand(
      args,
      sources.__unassigned__?.rows ?? sources[id]?.rows,
      {
        resolveTemplate: getWorkflowConfig,
        execute: executeWorkflowDefinition,
        createWorkflowId: () => `custom:${crypto.randomUUID()}`,
        context: workflowRunContext('chat'),
      },
      true,
    );
    const { config, core } = executed;
    if (!core)
      return {
        name: config.name,
        status: 'needs_input',
        requiredColumns: executed.required,
        purpose: config.purpose ?? config.documentLabel,
      };
    if (!executed.entry) throw new Error('No workflow execution was recorded.');
    const savedId = executed.entry.id;
    store.set(workflowLibraryAtom, (previous) => ({ ...previous, [savedId]: executed.entry! }));
    if (!executed.sample)
      store.set(uploadedRowsAtom, (previous) => {
        const remaining = { ...previous };
        if (args.recordsJson === undefined) delete remaining.__unassigned__;
        return {
          ...remaining,
          [config.id]: {
            fileName: typeof core.detail.sourceRows[0]?.sourceFileName === 'string' ? core.detail.sourceRows[0].sourceFileName : 'Chat records',
            rows: core.detail.sourceRows,
            at: Date.now(),
          },
        };
      });
    return {
      name: config.name,
      status: core.status,
      savedWorkflowId: savedId,
      runId: core.runId,
      version: executed.entry.versions.at(-1)?.number,
      sampleData: executed.sample,
      purpose: config.purpose,
      sourceFileName: core.detail.sourceRows[0]?.sourceFileName,
      results: core.status === 'error' ? [] : core.detail.summary,
      rows: core.status === 'error' ? undefined : core.detail.workpaperRows,
      findings: core.execution.result.warnings,
      errors: core.errors,
      excludedRecords: core.unmatched.length,
      approval: 'Not approved; review calculated results and findings.',
      persistence: 'Server sync not confirmed',
    };
  } catch (error) {
    return {
      status: 'error',
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
