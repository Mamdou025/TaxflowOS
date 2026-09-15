import type { TemplateCommand } from '@workspace/workflow-core/template-command';
import type { UploadedSource } from '@/shared/stores/workspace-store';

export type AgentTemplateRunArgs = TemplateCommand & {
  sourceMode?: 'uploaded' | 'records' | 'sample';
};

/** Resolve browser input once, before the approval fingerprint is created. */
export function prepareWorkflowRunInput(
  args: AgentTemplateRunArgs,
  source: UploadedSource | undefined,
): { args: TemplateCommand; source?: Omit<UploadedSource, 'rows'> } {
  const { sourceMode, ...command } = args;
  const mode =
    sourceMode ??
    (command.recordsJson !== undefined ? 'records' : command.useSample ? 'sample' : 'uploaded');
  if (!['uploaded', 'records', 'sample'].includes(mode))
    throw new Error('Choose uploaded, records, or sample as the input source.');
  if (mode === 'sample') return { args: { ...command, recordsJson: undefined, useSample: true } };
  if (mode === 'records') {
    if (command.recordsJson === undefined)
      throw new Error('Supply inline records or choose the uploaded source.');
    return { args: { ...command, useSample: false } };
  }
  if (!source?.rows.length)
    throw new Error('Choose a source or attach a workbook before running this workflow.');
  const { rows, ...identity } = source;
  return {
    args: {
      ...command,
      recordsJson: JSON.stringify(rows.map((row) => ({ ...row, sourceFileName: source.fileName }))),
      useSample: false,
    },
    source: identity,
  };
}
