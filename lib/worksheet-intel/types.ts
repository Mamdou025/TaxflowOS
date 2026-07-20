// ─────────────────────────────────────────────────────────────────────────────
// Worksheet-intelligence contract — the normalized shapes every worksheet speaks.
//
// The chat answers questions about ANY worksheet through this one interface,
// without pasting the sheet. A worksheet becomes "intelligent" by providing a
// `WorksheetIntel` (template-driven sheets get one for free via
// createTemplateIntel; bespoke sheets can implement it over their own data).
// ─────────────────────────────────────────────────────────────────────────────

export type ProvenanceRow = {
  label: string;
  amount: number;
  category: string;
  keyword: string | null;
  confidence: number; // 0–100
};

export type WorksheetLineValue = { code: string; label: string; value: string; raw: number; isRate?: boolean };
export type WorksheetSummaryRow = { key: string; label: string; usd: string; cad?: string };

export type WorksheetSnapshot =
  | { id: string; title: string; status: 'error'; message: string }
  | {
      id: string;
      title: string;
      status: 'success' | 'warning';
      currency: string;
      fxRate?: string;
      source: { fileRows: number; usingSample: boolean };
      lines: WorksheetLineValue[];
      summary: WorksheetSummaryRow[];
      classification?: {
        classifiedRows: number;
        unmatchedRows: number;
        buckets: { key: string; value: string }[];
      };
      hint: string;
    };

export type OperandBreakdown = { name: string; value: number; display: string; source: string };

export type LineExplanation =
  | { found: false; message: string; availableLines?: string[] }
  | {
      found: true;
      id: string;
      code: string;
      key: string;
      label: string;
      value: number;
      display: string;
      unit: string;
      formula: string;
      expression: string | null;
      operation: string | null;
      breakdown: OperandBreakdown[];
      cad?: string;
      note?: string;
      contributingRows?: ProvenanceRow[];
    };

export type TraceNode = {
  key: string;
  label: string;
  value: number;
  display: string;
  formula: string | null;
  operation?: string | null;
  inputs?: Array<TraceNode | OperandBreakdown>;
};

export type ValueTrace =
  | { found: false; message: string }
  | { found: true; id: string; trace: TraceNode };

export type SearchResult = {
  matches: Array<{ code: string; key: string; label: string; formula: string | null }>;
};

// The one interface the chat talks to. `live` = backed by the on-screen sheet's
// exact state (vs a default/shared-store computation).
export interface WorksheetIntel {
  id: string;
  title: string;
  live: boolean;
  describe(): WorksheetSnapshot;
  explainLine(query: string): LineExplanation;
  why(query: string): ValueTrace;
  search(query: string): SearchResult;
}
