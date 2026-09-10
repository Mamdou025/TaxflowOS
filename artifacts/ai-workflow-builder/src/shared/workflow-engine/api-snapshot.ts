export function apiRequestSignature(config: Record<string, unknown>) {
  return JSON.stringify(Object.fromEntries(['url', 'method', 'headers', 'body', 'resultsPath', 'fieldMap', 'currency', 'maxRows', 'connectorId', 'connectorParams'].map(key => [key, config[key] ?? null])));
}
