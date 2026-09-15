/** Normalized source evidence shared by API adapters and deterministic blocks. */
export type SourceRow = {
  rowId: string;
  label: string;
  amount: number;
  account?: string;
  description?: string;
  currency?: string;
  raw?: Record<string, unknown>;
  rowNumber?: number;
  metadata?: Record<string, unknown>;
};
