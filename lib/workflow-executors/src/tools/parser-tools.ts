import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { BlockSubtype } from '@workspace/workflow-executors/workflow/contracts';
import type { ToolDefinition } from './types';
import { collectEvidence, collectSourceTrace } from './rows';
import { completeResult } from './primitives';
import { ROWS_OUTPUT_ROLE } from './ports';

/** Acquisition occurs at upload; execution reads the exact captured evidence. */
export function createParserTool({
  displayName,
  subtype,
  toolId,
}: {
  displayName: string;
  subtype: BlockSubtype;
  toolId: string;
}): ToolDefinition {
  return {
    defaultConfig: {},
    displayName,
    subtype,
    toolId,
    description:
      'Reads captured source extraction with provenance. Missing or unsupported evidence is an error.',
    family: 'Logic',
    toolGroup: 'data_extraction',
    runMode: 'local_mock',
    inputRoles: [
      {
        acceptedFamilies: ['Source'],
        allowMultiple: true,
        description: 'Captured source evidence.',
        id: 'source_evidence',
        label: 'Source evidence',
        required: true,
      },
    ],
    inputSchema: { fields: [] },
    outputRoles: [
      {
        ...ROWS_OUTPUT_ROLE,
        description: 'Explicit structured source records only.',
        outputType: 'parsed_table',
      },
      {
        id: 'extractions',
        label: 'Document evidence',
        description: 'Captured text and source locations.',
        outputKey: 'extractions',
        outputType: 'object',
        canRouteToFamilies: ['Logic', 'Output'],
      },
    ],
    outputSchema: {
      fields: [
        { key: 'rows', type: 'array' },
        { key: 'text', type: 'string' },
        { key: 'extractions', type: 'array' },
      ],
    },
    execute: (context) => {
      const failure = (message: string) =>
        completeResult({ context, output: {}, status: 'error', errors: [message] });
      if (
        !context.upstreamResults.length ||
        context.upstreamResults.some((result) => ['error', 'skipped'].includes(result.status))
      )
        return failure('Connect and run a source with real captured evidence first.');
      if (toolId === 'logic.pdf_table_parser')
        return failure(
          'PDF table extraction is not installed. PDF text is not a verified table. Supply a structured workbook or JSON source.',
        );
      if (
        context.upstreamResults.some((result) =>
          result.output.extractions !== undefined
            ? !DocumentExtractionSchema.array().nonempty().safeParse(result.output.extractions)
                .success
            : !Array.isArray(result.output.rows) || !result.output.rows.length,
        )
      )
        return failure(
          'Every connected source must contain valid evidence. Empty or malformed sources cannot be skipped.',
        );
      const captures = context.upstreamResults.flatMap((result) =>
        Array.isArray(result.output.extractions) ? result.output.extractions : [],
      );
      const parsed = DocumentExtractionSchema.array().safeParse(captures);
      if (!parsed.success)
        return failure('The source extraction is invalid. Upload the original again.');
      const extractions = parsed.data;
      const method =
        toolId === 'logic.pdf_text_parser'
          ? ['pdf_text', 'docx_text']
          : toolId === 'logic.ocr_extract'
            ? ['ocr']
            : toolId === 'logic.excel_table_reader'
              ? ['workbook']
              : ['json'];
      const matching = extractions.filter((capture) => method.includes(capture.method));
      // Historical workbook/API sources already contain explicit parsed records.
      const legacyRows = context.upstreamResults.flatMap((result) => {
        const compatible =
          toolId === 'logic.excel_table_reader'
            ? result.toolId === 'source.manual_table'
            : toolId === 'logic.api_response_parser' && result.toolId === 'source.http_json';
        return compatible && !result.output.extractions && Array.isArray(result.output.rows)
          ? result.output.rows
          : [];
      });
      const rows = ['logic.excel_table_reader', 'logic.api_response_parser'].includes(toolId)
        ? context.upstreamResults.flatMap((result) =>
            Array.isArray(result.output.rows) ? result.output.rows : [],
          )
        : [...matching.flatMap((capture) => capture.rows), ...legacyRows];
      const text = matching
        .flatMap((capture) => capture.segments.map((segment) => segment.text))
        .join('\n\n');
      if ((!rows.length && !text.trim()) || matching.length !== extractions.length)
        return failure(
          `No compatible complete capture for ${displayName}. Upload the matching source; OCR requires an explicitly captured OCR result.`,
        );
      if (!extractions.length && !legacyRows.length)
        return failure(`No captured evidence is available for ${displayName}.`);
      if (
        context.upstreamResults.some(
          (result) =>
            !result.output.extractions &&
            !(toolId === 'logic.excel_table_reader' && result.toolId === 'source.manual_table') &&
            !(toolId === 'logic.api_response_parser' && result.toolId === 'source.http_json'),
        )
      )
        return failure('Every connected source must provide compatible captured evidence.');
      if (rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row)))
        return failure('The source contains invalid structured records.');
      const warnings = [...new Set(context.upstreamResults.flatMap((result) => result.warnings))];
      return completeResult({
        context,
        status: warnings.length ? 'warning' : 'success',
        warnings,
        output: { rows, text, extractions: matching, sourceMutation: false },
        evidenceRefs: collectEvidence(context),
        sourceTrace: collectSourceTrace(context),
      });
    },
  };
}
