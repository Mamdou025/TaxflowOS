import { z } from 'zod';
import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import type { DefinitionExecutor } from '../core/ports';
import { createWorkflow, executeSavedWorkflow } from './commands';
import { runTemplateCore, type SourceRow, type TemplateConfig } from './templates';
export const TemplateCommandSchema = z
  .object({
    workflowId: z.string().trim().min(1).max(200),
    recordsJson: z.string().optional(),
    useSample: z.boolean().optional(),
    inputsJson: z.string().optional(),
  })
  .strict();
export type TemplateCommand = z.infer<typeof TemplateCommandSchema>;
export type TemplateCommandRuntime = {
  resolveTemplate: (id: string) => TemplateConfig | null;
  execute: DefinitionExecutor;
  createWorkflowId: () => string;
  context?: Parameters<typeof executeSavedWorkflow>[3];
};
export function executeWorkflowCommand(
  rawArgs: TemplateCommand,
  cachedRows: SourceRow[] | undefined,
  runtime: TemplateCommandRuntime,
  record = false,
) {
  const args = TemplateCommandSchema.parse(rawArgs);
  const config = runtime.resolveTemplate(args.workflowId.replace(/^pf-/, ''));
  if (!config)
    throw new Error(
      `Workflow '${args.workflowId}' is unavailable. Choose a workflow from the executable catalog.`,
    );
  const raw: unknown =
    args.recordsJson !== undefined
      ? JSON.parse(args.recordsJson)
      : args.useSample === true
        ? config.sampleRows
        : cachedRows;
  if (raw === undefined)
    return {
      config,
      required: config.requiredColumns ?? ['label', 'amount'],
      core: null,
      sample: false,
    };
  if (!Array.isArray(raw) || !raw.length || raw.length > 10000)
    throw new Error('Supply a non-empty JSON array of at most 10,000 records.');
  const rows: SourceRow[] = raw.map((row, i) => {
    if (!row || typeof row !== 'object' || Array.isArray(row))
      throw new Error(`Record ${i + 1} must be an object.`);
    const amount =
      typeof row.amount === 'number'
        ? row.amount
        : typeof row.amount === 'string' && row.amount.trim()
          ? Number(row.amount)
          : NaN;
    const requiresAmount = !config.structuredRecords || config.requiredColumns?.includes('amount');
    if (requiresAmount && !Number.isFinite(amount))
      throw new Error(`Record ${i + 1}: amount must be a finite number.`);
    return {
      ...row,
      rowId: String(row.rowId ?? `command-${i + 1}`),
      label: String(row.label ?? row.entity ?? row.owner ?? `Record ${i + 1}`),
      amount: requiresAmount ? amount : Number.isFinite(amount) ? amount : 0,
    };
  });
  if (new Set(rows.map((row) => row.rowId)).size !== rows.length)
    throw new Error(
      'Source row IDs must be unique; duplicate IDs would lose evidence during aggregation.',
    );
  const inputs: unknown = args.inputsJson ? JSON.parse(args.inputsJson) : {};
  if (
    !inputs ||
    typeof inputs !== 'object' ||
    Array.isArray(inputs) ||
    Object.values(inputs).some((n) => typeof n !== 'number' || !Number.isFinite(n))
  )
    throw new Error('inputsJson must be an object of finite numeric values.');
  const allowed = new Set(config.editableInputs?.map((input) => input.key) ?? []);
  for (const key of Object.keys(inputs))
    if (!allowed.has(key)) throw new Error(`Unknown input '${key}' for ${config.name}.`);
  let entry: PersonalWorkflow | undefined;
  const savedId = record ? runtime.createWorkflowId() : undefined;
  const sample = args.useSample === true && args.recordsJson === undefined;
  const selectedConfig = savedId
    ? {
        ...config,
        buildSnapshot: () => ({
          ...config.buildSnapshot(),
          id: savedId,
          name: config.name + (sample ? ' — Sample data' : ''),
        }),
      }
    : config;
  const core = runTemplateCore(
    selectedConfig,
    { rows, overrides: [], inputs: inputs as Record<string, number> },
    (definition) => {
      if (!savedId) return runtime.execute(definition);
      const executed = executeSavedWorkflow(
        createWorkflow(savedId, 'pf-' + config.id, definition),
        {},
        runtime.execute,
        runtime.context,
      );
      entry = executed.entry;
      return executed.result;
    },
  );
  return { config, required: [], core, sample, entry };
}
