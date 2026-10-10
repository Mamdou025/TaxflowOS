import { resolveResponseValues, parseResponseValueMappings } from './schema';
import { apiRequestSignature } from '../../../../api-snapshot';
import { createEvidenceRef, createSourceTraceRef } from '../../../runtime/lineage';
import type { ToolExecutionContext, ToolRunResult } from '../../../runtime/types';

export function runHttpValuesSource(context: ToolExecutionContext): ToolRunResult {
  const { config, block } = context;
  const base = {
    blockId: block.id,
    toolId: 'source.http_json',
    runId: context.runId,
    startedAt: context.startedAt,
    completedAt: new Date().toISOString(),
    logs: [],
  };
  try {
    const mappings = parseResponseValueMappings(config.outputMappings);
    const needsResponse = mappings.some(
      (mapping) => !mapping.overrideKey || config[mapping.overrideKey] == null,
    );
    if (
      needsResponse &&
      (!Object.hasOwn(config, 'fetchedPayload') ||
        config.fetchedRequestSignature !== apiRequestSignature(config))
    ) {
      throw new Error('No matching API response is saved. Fetch this request before running.');
    }
    const { namedValues, overrides } = resolveResponseValues(
      config.fetchedPayload,
      mappings,
      config,
    );
    const evidenceRefs = mappings.map((mapping) =>
      createEvidenceRef({
        block,
        sourceKind: 'http_json',
        field: mapping.name,
        label: overrides.includes(mapping.name)
          ? `${mapping.name} (manual override)`
          : `${mapping.name}: ${mapping.path || 'response'}`,
        valuePreview: JSON.stringify(namedValues[mapping.name]),
      }),
    );
    const sourceTrace = evidenceRefs.map((evidenceRef) => createSourceTraceRef({ evidenceRef }));
    const warnings = overrides.length ? [`Manual overrides used: ${overrides.join(', ')}.`] : [];
    return {
      ...base,
      status: warnings.length ? 'warning' : 'success',
      errors: [],
      warnings,
      evidenceRefs,
      sourceTrace,
      primaryOutputRole: 'named_values',
      outputs: {
        named_values: { namedValues, immutable: true, evidenceRefs, sourceTrace },
        response_metadata: {
          responseMeta: config.responseMeta,
          endpoint: config.url,
          mappings,
          overrides,
          origin: needsResponse ? 'saved_response' : 'manual_override',
        },
        source_metadata: {
          sourceId: block.id,
          sourceName: block.label,
          sourceKind: 'http_json',
          sourceVersion: config.sourceVersion || 1,
          sourceLocator: config.url,
        },
        source_locator: { sourceLocator: config.url, locator: config.url },
      },
    };
  } catch (error) {
    return {
      ...base,
      status: 'error',
      errors: [error instanceof Error ? error.message : 'Invalid API outputs.'],
      warnings: [],
      outputs: {},
      evidenceRefs: [],
      sourceTrace: [],
    };
  }
}
