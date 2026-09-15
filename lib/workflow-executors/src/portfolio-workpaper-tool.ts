import { type ToolDefinition } from '@workspace/workflow-executors/tools/types';
import { executeWorkpaper } from './portfolio-workpapers';

export const portfolioWorkpaperTool: ToolDefinition = {
  toolId: 'logic.portfolio_workpaper',
  family: 'Logic',
  toolGroup: 'calculation',
  displayName: 'Portfolio Workpaper',
  description: 'Validate supplied records and produce the selected deterministic workpaper.',
  defaultConfig: {},
  runMode: 'local_mock',
  inputRoles: [
    {
      id: 'rows',
      label: 'Workpaper records',
      description: 'Structured source records',
      required: true,
      allowMultiple: false,
      acceptedFamilies: ['Source'],
    },
  ],
  outputRoles: [
    {
      id: 'mapped_rows',
      label: 'Workpaper rows',
      description: 'Validated business results',
      outputType: 'mapped_rows',
      outputKey: 'mappedRows',
      canRouteToFamilies: ['Output', 'Field', 'Logic'],
    },
    {
      id: 'calculated_results',
      label: 'Results',
      description: 'Workpaper metrics',
      outputType: 'calculated_results',
      outputKey: 'calculatedResults',
      canRouteToFamilies: ['Output', 'Field', 'Logic'],
    },
  ],
  inputSchema: { fields: [{ key: 'rows', type: 'array', required: true }] },
  outputSchema: {
    fields: [
      { key: 'mappedRows', type: 'array' },
      { key: 'calculatedResults', type: 'object' },
    ],
  },
  execute: (context) => {
    let output: Record<string, unknown> = {},
      errors: string[] = [],
      warnings: string[] = [];
    try {
      // Read original business columns from the connected source only.
      if (
        context.upstreamBlocks.length !== 1 ||
        context.upstreamResults.some((r) => r.status === 'error')
      )
        throw new Error('Connect one successful workpaper source.');
      const rows = context.upstreamBlocks[0].config.rows;
      if (!Array.isArray(rows)) throw new Error('The connected source has no structured records.');
      const result = executeWorkpaper(String(context.config.workpaperId), rows);
      warnings = result.findings;
      output = {
        workpaperRows: result.rows,
        mappedRows: result.rows,
        rows: result.rows,
        calculatedResults: result.figures,
        namedValues: result.figures,
        reviewFindings: result.findings,
        unmatchedRows: [],
      };
    } catch (error) {
      errors = [error instanceof Error ? error.message : String(error)];
    }
    return {
      blockId: context.block.id,
      toolId: 'logic.portfolio_workpaper',
      runId: context.runId,
      startedAt: context.startedAt,
      completedAt: new Date().toISOString(),
      status: errors.length ? 'error' : warnings.length ? 'warning' : 'success',
      output,
      errors,
      warnings,
      evidenceRefs: context.evidenceRefs,
      sourceTrace: context.sourceTrace,
      logs: [],
    };
  },
};
