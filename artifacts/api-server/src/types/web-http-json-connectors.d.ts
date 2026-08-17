// Ambient declaration for the shared API-connector layer we reuse from the web
// package via the `@` alias (esbuild resolves it at build; tsc uses this stub so it
// doesn't pull the whole web source tree into this package's program). Keep in sync
// with shared/workflow-engine/execution/blocks/source/http-json/connectors.ts.
declare module "@/shared/workflow-engine/execution/blocks/source/http-json/connectors" {
  export type ApiParamOption = { value: string; label: string };

  export type ApiParamOptionsSource = {
    url: string;
    method?: "GET" | "POST";
    resultsPath?: string;
    mode: "array" | "objectKeys";
    valueKey?: string;
    labelKey?: string;
    valuePattern?: string;
  };

  export type ApiParamValues = Record<string, string | number>;

  export type ApiRequestSpec = {
    url: string;
    method: "GET" | "POST";
    headers?: Record<string, string>;
    body?: unknown;
    resultsPath?: string;
    fieldMap?: Record<string, string | undefined>;
    currency?: string;
    maxRows?: number;
  };

  export function getParamOptionsSource(
    connectorId: string,
    paramKey: string
  ): ApiParamOptionsSource | undefined;

  export function optionsFromPayload(
    payload: unknown,
    source: ApiParamOptionsSource
  ): ApiParamOption[];

  export function buildApiRequest(
    connectorId: string,
    params?: ApiParamValues
  ):
    | { ok: true; spec: ApiRequestSpec; params: ApiParamValues }
    | { ok: false; errors: string[] };

  export function describeApiConnectors(): unknown[];
}
