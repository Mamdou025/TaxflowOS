// Ambient declaration for the shared http-json Source block we reuse from the web
// package via the `@` alias (esbuild resolves it at build; tsc uses this stub so it
// doesn't pull the whole web source tree into this package's program). Keep in sync
// with shared/workflow-engine/execution/blocks/source/http-json/schema.ts.
declare module "@/shared/workflow-engine/execution/blocks/source/http-json/schema" {
  export type HttpJsonFieldMap = {
    rowId?: string;
    label?: string;
    description?: string;
    amount?: string;
    currency?: string;
    account?: string;
  };

  export type HttpJsonResponseMeta = {
    status?: number;
    url?: string;
    method?: string;
    fetchedAt?: string;
    durationMs?: number;
    recordCount?: number;
    truncated?: boolean;
    totalBytes?: number;
  };

  export type HttpJsonSourceConfig = {
    url: string;
    method: "GET" | "POST";
    headers: Record<string, string>;
    body?: unknown;
    resultsPath?: string;
    fieldMap: HttpJsonFieldMap;
    currency?: string;
    maxRows: number;
    fetchedRows?: unknown[];
    responseMeta?: HttpJsonResponseMeta;
  };

  export type SourceRow = {
    rowId: string;
    label: string;
    amount: number;
    account?: string;
    description?: string;
    currency?: string;
    raw?: Record<string, unknown>;
    rowNumber?: number;
  };

  export const HTTP_JSON_MAX_ROWS: number;

  export function parseHttpJsonConfig(
    config: Record<string, unknown>
  ): HttpJsonSourceConfig;

  export function assertPublicHttpUrl(rawUrl: string): URL;

  export function extractAtPath(payload: unknown, path?: string): unknown;

  export function findRecordArray(payload: unknown): unknown[] | null;

  export function mapRecordsToRows(input: {
    records: unknown[];
    fieldMap: HttpJsonFieldMap;
    currency?: string;
    maxRows: number;
  }): { rows: SourceRow[]; skipped: number; truncated: boolean };

  export function fetchJsonPayload(
    config: Pick<HttpJsonSourceConfig, "url" | "method" | "headers" | "body">
  ): Promise<{
    payload: unknown;
    responseMeta: HttpJsonResponseMeta;
    rawText: string;
  }>;

  export function fetchJsonSource(config: HttpJsonSourceConfig): Promise<{
    rows: SourceRow[];
    responseMeta: HttpJsonResponseMeta;
    skipped: number;
    samplePayload: unknown;
  }>;
}
