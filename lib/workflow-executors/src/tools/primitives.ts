import {
  type ToolRunLog,
  type ToolExecutionContext,
  type ToolRunStatus,
  type EvidenceRef,
  type SourceTraceRef,
  type ToolRunResult,
} from './types';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';

const NUMBER_PATTERN = /-?\d+(\.\d+)?/;

export function makeLog({
  blockId,
  details,
  level = 'info',
  message,
}: {
  blockId: string;
  details?: Record<string, unknown>;
  level?: ToolRunLog['level'];
  message: string;
}): ToolRunLog {
  return {
    at: new Date().toISOString(),
    details,
    id: `tool-log-${blockId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    level,
    message,
  };
}

export function completeResult({
  confidence,
  context,
  errors = [],
  evidenceRefs,
  logs = [],
  output,
  sourceTrace,
  status,
  warnings = [],
}: {
  context: ToolExecutionContext;
  output: Record<string, unknown>;
  status: ToolRunStatus;
  confidence?: number;
  errors?: string[];
  evidenceRefs?: EvidenceRef[];
  logs?: ToolRunLog[];
  sourceTrace?: SourceTraceRef[];
  warnings?: string[];
}): ToolRunResult {
  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    confidence,
    errors,
    evidenceRefs: evidenceRefs ?? context.evidenceRefs,
    logs,
    output,
    runId: context.runId,
    sourceTrace: sourceTrace ?? context.sourceTrace,
    startedAt: context.startedAt,
    status,
    toolId: String(context.config.toolId || getToolIdForBlock(context.block)),
    warnings,
  };
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const record = asRecord(value);
  if (record) {
    return (
      parseNumber(record.value) ??
      parseNumber(record.amount) ??
      parseNumber(record.subtotal) ??
      null
    );
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const match = trimmed.match(NUMBER_PATTERN);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return trimmed.includes('%') ? parsed / 100 : parsed;
}
