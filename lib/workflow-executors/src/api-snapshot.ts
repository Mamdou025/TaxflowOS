export function apiRequestSignature(config: Record<string, unknown>) {
  return JSON.stringify(
    Object.fromEntries(
      [
        'url',
        'method',
        'headers',
        'body',
        'resultsPath',
        'fieldMap',
        'currency',
        'maxRows',
        'connectorId',
        'connectorParams',
        ...(config.outputMode === 'values' ? ['outputMode', 'outputMappings'] : []),
      ].map((key) => [key, config[key] ?? null]),
    ),
  );
}
