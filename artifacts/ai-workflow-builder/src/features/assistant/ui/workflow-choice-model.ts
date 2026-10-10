import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import { workflowSessionRequest } from '../runtime/workflow-session-request';

export type WorkflowChoice = {
  workflowId: string;
  name: string;
  versionName?: string;
  description?: string;
  date?: string;
  target:
    | { kind: 'template' }
    | { kind: 'saved-version'; version: number }
    | { kind: 'draft' }
    | { kind: 'resume'; version: number; runId: string };
};

/** Match names, never collapse separate records that happen to share a title. */
export function filterWorkflowChoices<
  T extends { name: string; description?: string; latestVersionName?: string },
>(records: T[], query?: string): T[] {
  const term = query?.trim().toLocaleLowerCase();
  if (!term) return records;
  const exact = records.filter((record) =>
    [record.name, record.latestVersionName].some(
      (name) => name?.trim().toLocaleLowerCase() === term,
    ),
  );
  return exact.length
    ? exact
    : records.filter((record) =>
        `${record.name} ${record.latestVersionName ?? ''} ${record.description ?? ''}`
          .toLocaleLowerCase()
          .includes(term),
      );
}

const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));
const text = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

/** Read both live tool results and their persisted JSON receipts; no opening side effects. */
export function workflowChoices(
  result: unknown,
  kind: 'available' | 'saved',
): { choices: WorkflowChoice[]; error?: string } {
  let value = result;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return { choices: [], error: 'Workflow choices could not be read. Ask to list them again.' };
    }
  }
  if (!Array.isArray(value))
    return {
      choices: [],
      error:
        (record(value) && text(value.error)) ||
        'Workflow choices are unavailable. Ask to list them again.',
    };
  const choices: WorkflowChoice[] = [];
  for (const item of value) {
    if (!record(item)) continue;
    const workflowId = text(kind === 'available' ? item.workflowId : item.id);
    const name = text(item.name);
    if (!workflowId || !name) continue;
    if (kind === 'available') {
      choices.push({
        workflowId,
        name,
        description: text(item.source),
        target: { kind: 'template' },
      });
      continue;
    }
    const version = item.latestVersion;
    if (
      version !== null &&
      !(typeof version === 'number' && Number.isInteger(version) && version > 0)
    )
      continue;
    choices.push({
      workflowId,
      name,
      versionName: version === null ? undefined : text(item.latestVersionName),
      description: text(item.description),
      date: text(version === null ? item.updatedAt : item.latestVersionSavedAt),
      target: version === null ? { kind: 'draft' } : { kind: 'saved-version', version },
    });
  }
  return choices.length || value.length === 0
    ? { choices }
    : { choices, error: 'Workflow choices could not be read. Ask to list them again.' };
}

/** Recheck the selected identity at click time. Never replace it with latest or a template. */
export function resolveWorkflowChoice(
  choice: WorkflowChoice,
  library: WorkflowLibrary,
  hasTemplate: (id: string) => boolean,
):
  | { kind: 'draft'; workflowId: string }
  | { kind: 'session'; workflowId: string; version?: number }
  | { kind: 'resume'; workflowId: string; version: number; runId: string }
  | { error: string } {
  const entry = library[choice.workflowId];
  if (choice.target.kind === 'template') {
    if (!hasTemplate(choice.workflowId) || entry)
      return {
        error: 'This template is unavailable. List workflows again to choose an exact workflow.',
      };
    return { kind: 'session', workflowId: choice.workflowId };
  }
  if (!entry)
    return { error: 'This saved workflow is no longer available. No other workflow was selected.' };
  if (choice.target.kind === 'draft') return { kind: 'draft', workflowId: choice.workflowId };
  if (choice.target.kind === 'resume') {
    const { runId, version } = choice.target;
    const session = entry.sessions?.find((item) => item.id === runId);
    if (
      !session ||
      session.endedAt ||
      session.version !== version ||
      !entry.versions.some((item) => item.number === version)
    )
      return { error: 'This run can no longer be resumed. No other run was selected.' };
    return { kind: 'resume', workflowId: choice.workflowId, version, runId };
  }
  const request = workflowSessionRequest(
    library,
    () => false,
    choice.workflowId,
    choice.target.version,
  );
  return 'error' in request ? request : { kind: 'session', ...request };
}
