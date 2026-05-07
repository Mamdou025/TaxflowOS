import type { EvidenceRef, SourceTraceRef } from "../../../runtime/types";

const NUMBER_PATTERN = /-?\d+(\.\d+)?/;

export type ManualTableRow = {
  rowId: string;
  label: string;
  amount: number;
  account?: string;
  description?: string;
  currency?: string;
  raw?: Record<string, unknown>;
  rowNumber?: number;
  metadata?: Record<string, unknown>;
  evidenceRefs?: EvidenceRef[];
  sourceTrace?: SourceTraceRef[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(NUMBER_PATTERN);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

export function normalizeManualTableRow(
  value: unknown,
  index: number
): ManualTableRow | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const amount =
    parseNumber(record.amount) ??
    parseNumber(record.value) ??
    parseNumber(record.balance);

  if (amount === null) {
    return null;
  }

  return {
    account:
      optionalString(record.account) || optionalString(record.accountNumber),
    amount,
    currency: optionalString(record.currency),
    description: optionalString(record.description),
    label: String(record.label || record.name || `Source row ${index + 1}`),
    metadata: asRecord(record.metadata) || undefined,
    raw:
      asRecord(record.raw) ||
      asRecord(asRecord(record.metadata)?.raw) ||
      undefined,
    rowId: String(record.rowId || record.id || `source-row-${index + 1}`),
    rowNumber: optionalNumber(record.rowNumber),
  };
}

export function parseManualTableRows({
  config,
  fallbackRows,
}: {
  config: Record<string, unknown>;
  fallbackRows: ManualTableRow[];
}): ManualTableRow[] {
  const rowSource =
    config.rows || config.manualRows || config.tableRows || config.sampleRows;
  if (!Array.isArray(rowSource)) {
    if (config.requireUpload === true) {
      return [];
    }
    return fallbackRows.map((row) => ({ ...row }));
  }

  const rows = rowSource
    .map(normalizeManualTableRow)
    .filter((row): row is ManualTableRow => Boolean(row));

  if (rows.length > 0) {
    return rows;
  }

  return config.requireUpload === true
    ? []
    : fallbackRows.map((row) => ({ ...row }));
}
