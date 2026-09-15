import { workspaceStorage } from '@/platform/auth/workspace-context';
import { parseSharedJSON, stringifySharedJSON } from '../shared-json';
import { type LocalRunRecord, LOCAL_RUNS_STORAGE_KEY } from './contracts';

export function loadLocalRunRecords(): LocalRunRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = workspaceStorage.getItem(LOCAL_RUNS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const records = parseSharedJSON(stored) as LocalRunRecord[];
    return records.map((record) => ({
      execution: {
        ...record.execution,
        startedAt: new Date(record.execution.startedAt),
        completedAt: record.execution.completedAt ? new Date(record.execution.completedAt) : null,
      },
      logs: record.logs.map((log) => ({
        ...log,
        startedAt: new Date(log.startedAt),
        completedAt: log.completedAt ? new Date(log.completedAt) : null,
      })),
    }));
  } catch {
    return [];
  }
}

const RUN_RECORD_ARRAY_PREVIEW_LIMIT = 120;

const RUN_RECORD_OBJECT_KEY_LIMIT = 80;

const RUN_RECORD_MAX_DEPTH = 7;

export function isLocalRunExecutionId(executionId?: string | null) {
  return Boolean(executionId?.startsWith('local-tool-') || executionId?.startsWith('local-run-'));
}

function compactRunRecordValue(value: unknown, depth = 0): unknown {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return value;
  }

  if (depth >= RUN_RECORD_MAX_DEPTH) {
    return '[truncated depth]';
  }

  if (Array.isArray(value)) {
    const preview = value
      .slice(0, RUN_RECORD_ARRAY_PREVIEW_LIMIT)
      .map((item) => compactRunRecordValue(item, depth + 1));
    return value.length > RUN_RECORD_ARRAY_PREVIEW_LIMIT
      ? [
          ...preview,
          {
            omittedCount: value.length - RUN_RECORD_ARRAY_PREVIEW_LIMIT,
            truncated: true,
          },
        ]
      : preview;
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const compacted = Object.fromEntries(
    entries
      .slice(0, RUN_RECORD_OBJECT_KEY_LIMIT)
      .map(([key, item]) => [key, compactRunRecordValue(item, depth + 1)]),
  );

  return entries.length > RUN_RECORD_OBJECT_KEY_LIMIT
    ? {
        ...compacted,
        omittedKeyCount: entries.length - RUN_RECORD_OBJECT_KEY_LIMIT,
        truncated: true,
      }
    : compacted;
}

function compactLocalRunRecord(record: LocalRunRecord): LocalRunRecord {
  return {
    execution: record.execution,
    logs: record.logs.map((log) => ({
      ...log,
      input: compactRunRecordValue(log.input),
      output: compactRunRecordValue(log.output),
    })),
  };
}

function minimalLocalRunRecord(record: LocalRunRecord): LocalRunRecord {
  return {
    execution: record.execution,
    logs: record.logs.map((log) => ({
      ...log,
      input: undefined,
      output: {
        compacted: true,
        message:
          'Detailed local run payload was too large for browser storage. Re-run the workflow to inspect current results.',
        status: log.status,
      },
    })),
  };
}

function persistLocalRunRecords(records: LocalRunRecord[]) {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    workspaceStorage.setItem(LOCAL_RUNS_STORAGE_KEY, stringifySharedJSON(records));
    return true;
  } catch (error) {
    console.warn('Local run history was too large to store.', error);
    return false;
  }
}

export function saveLocalRunRecord(record: LocalRunRecord): LocalRunRecord[] {
  const records = [record, ...loadLocalRunRecords()].slice(0, 12);
  if (persistLocalRunRecords(records)) {
    return records;
  }

  if (persistLocalRunRecords([record])) {
    return [record];
  }

  const compactRecords = records.map(compactLocalRunRecord).slice(0, 4);
  if (persistLocalRunRecords(compactRecords)) {
    return compactRecords;
  }

  const compactCurrentRecord = compactLocalRunRecord(record);
  if (persistLocalRunRecords([compactCurrentRecord])) {
    return [compactCurrentRecord];
  }

  const minimalRecords = [minimalLocalRunRecord(record)];
  persistLocalRunRecords(minimalRecords);
  return minimalRecords;
}

export function clearLocalRunRecords() {
  if (typeof window !== 'undefined') {
    workspaceStorage.removeItem(LOCAL_RUNS_STORAGE_KEY);
  }
}
