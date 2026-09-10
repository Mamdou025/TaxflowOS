import type { WorkflowBlock } from './local-fiscal-workflow';

export type ReadinessCondition = { id: string; kind: 'document' | 'api' | 'field'; sourceId: string; path?: string; operator?: 'exists' | 'equals' | 'greater'; value?: string };
export function readinessConditions(config: Record<string, unknown>, blocks: WorkflowBlock[]): ReadinessCondition[] {
  if (Array.isArray(config.readinessConditions)) return config.readinessConditions.filter((item): item is ReadinessCondition => !!item && typeof item === 'object' && ['document', 'api', 'field'].includes(item.kind) && typeof item.sourceId === 'string');
  const document = blocks.find(block => block.family === 'Source' && (/manual_table|excel|workbook|pdf/.test(String(block.config.toolId)) || /manual_table|excel_workbook/.test(String(block.config.sourceKind))));
  return document ? [{ id: 'document-ready', kind: 'document', sourceId: document.id }] : [];
}
function fieldAt(data: unknown, path: string) {
  return path.split('.').filter(Boolean).reduce<unknown>((value, key) => value && typeof value === 'object' && Object.hasOwn(value, key) ? (value as Record<string, unknown>)[key] : undefined, data);
}
export function evaluateReadiness(condition: ReadinessCondition, blocks: WorkflowBlock[], outputs: Record<string, unknown> = {}) {
  const source = blocks.find(block => block.id === condition.sourceId);
  if (!source) return { status: 'not-checked', detail: 'Choose a source block.' };
  const config = source.config;
  if (condition.kind === 'document') {
    const uploaded = Boolean(config.uploadTimestamp && (config.fileName || config.workbookName));
    return { status: uploaded ? 'met' : 'waiting', detail: uploaded ? `Uploaded: ${config.fileName || config.workbookName}` : 'Waiting for a document upload. Example data does not count as an upload.' };
  }
  if (condition.kind === 'api') {
    if (typeof config.liveRate === 'number' && Number.isFinite(config.liveRate)) return { status: 'met', detail: `Fetched rate available: ${config.liveRate}` };
    const response = config.responseMeta as Record<string, unknown> | undefined;
    const fetched = Boolean(response?.fetchedAt && Array.isArray(config.fetchedRows));
    return { status: fetched ? 'met' : 'waiting', detail: fetched ? `API response available · ${response?.fetchedAt}` : 'Waiting for a fetched API response. Offline samples do not count.' };
  }
  if (!condition.path?.trim()) return { status: 'not-checked', detail: 'Choose an output field.' };
  const output = outputs[source.id];
  if (!output) return { status: 'not-checked', detail: 'Run the source to check this output field.' };
  const value = fieldAt(output, condition.path);
  const exists = value !== undefined && value !== null && value !== '';
  const met = condition.operator === 'equals' ? exists && String(value) === condition.value : condition.operator === 'greater' ? exists && condition.value?.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > Number(condition.value) : exists;
  return { status: met ? 'met' : 'waiting', detail: exists ? `Recorded value: ${String(value)}` : 'The field is absent from the recorded output.' };
}
