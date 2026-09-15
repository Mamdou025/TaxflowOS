import type {
  EvidenceRef,
  NumericValueRef,
  SourceTraceRef,
  ToolDefinition,
  ToolExecutionContext,
  ToolRunResult,
} from '@workspace/workflow-contracts/tool-types';

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function finish(
  context: ToolExecutionContext,
  toolId: string,
  status: ToolRunResult['status'],
  output: Record<string, unknown>,
  options: {
    errors?: string[];
    evidenceRefs?: EvidenceRef[];
    sourceTrace?: SourceTraceRef[];
    warnings?: string[];
  } = {},
): ToolRunResult {
  const completedAt = new Date().toISOString();
  const errors = options.errors ?? [];
  const warnings = options.warnings ?? [];
  return {
    blockId: context.block.id,
    completedAt,
    errors,
    evidenceRefs: options.evidenceRefs ?? context.evidenceRefs,
    logs: [
      {
        at: completedAt,
        id: `${context.runId}-${context.block.id}-durable`,
        level: status === 'error' ? 'error' : warnings.length ? 'warning' : 'info',
        message: errors[0] ?? warnings[0] ?? `${context.block.label} completed.`,
      },
    ],
    output,
    runId: context.runId,
    sourceTrace: options.sourceTrace ?? context.sourceTrace,
    startedAt: context.startedAt,
    status,
    toolId,
    warnings,
  };
}

function numericValues(context: ToolExecutionContext): NumericValueRef[] {
  return context.upstreamResults.flatMap((result) => {
    const label =
      context.workflow.blocks.find((block) => block.id === result.blockId)?.label ?? result.blockId;
    const scalars = [
      'value',
      'subtotal',
      'total',
      'amount',
      'protectedValue',
      'governedValue',
    ].flatMap((key) => {
      const value = parseNumber(result.output[key]);
      return value === null ? [] : [{ key: `${result.blockId}.${key}`, label, value }];
    });
    const totals = result.output.finalTotals;
    const named =
      totals && typeof totals === 'object' && !Array.isArray(totals)
        ? Object.entries(totals).flatMap(([name, raw]) => {
            const value =
              parseNumber(raw) ??
              (raw && typeof raw === 'object' && 'value' in raw ? parseNumber(raw.value) : null);
            return value === null
              ? []
              : [
                  {
                    key: `${result.blockId}.final_totals.${name}`,
                    label: `${label} ${name}`,
                    value,
                  },
                ];
          })
        : [];
    return [...scalars, ...named];
  });
}

function resolveOperand(value: unknown, available: NumericValueRef[]) {
  const literal = parseNumber(value);
  if (literal !== null) return literal;
  const reference = String(value ?? '')
    .trim()
    .toLowerCase();
  const exact = available.find((candidate) => candidate.key.toLowerCase() === reference);
  if (exact) return exact.value;
  const matches = available.filter(
    (candidate) =>
      candidate.key.toLowerCase().endsWith(`.${reference}`) ||
      candidate.label.toLowerCase() === reference,
  );
  return matches.length === 1 ? matches[0]!.value : undefined;
}

function calculate(operation: string, operands: number[]) {
  if (!operands.length) return null;
  const first = operands[0]!;
  if (operation === 'multiply') return operands.reduce((total, value) => total * value, 1);
  if (operation === 'subtract')
    return operands.slice(1).reduce((total, value) => total - value, first);
  if (operation === 'divide')
    return operands.slice(1).reduce((total, value) => total / value, first);
  if (operation === 'percentage') {
    const rate = operands[1] ?? 1;
    return first * (rate > 1 ? rate / 100 : rate);
  }
  return operands.reduce((total, value) => total + value, 0);
}

export const sourceManualValue: ToolDefinition = {
  toolId: 'source.manual_value',
  family: 'Source',
  subtype: 'Manual Entry',
  toolGroup: 'data_extraction',
  displayName: 'Manual value source',
  description: 'Reads an explicit immutable scalar from the saved workflow version.',
  inputRoles: [],
  outputRoles: [
    {
      id: 'value',
      label: 'Value',
      description: 'Explicit scalar value.',
      outputType: 'value',
      canRouteToFamilies: ['Logic', 'Protected', 'Review / Validation'],
      outputKey: 'value',
    },
  ],
  inputSchema: { fields: [] },
  outputSchema: { fields: [{ key: 'value', type: 'number', required: true }] },
  defaultConfig: {},
  runMode: 'local_mock',
  execute: (context) => {
    // Historical templates used this tool for a reference-only API block.
    // Preserve its locator without inventing a numeric response or exchange rate.
    if (context.config.sourceKind === 'api_reference') {
      const locator = context.config.sourceLocator || context.block.source?.locator;
      if (typeof locator !== 'string' || !locator.trim()) {
        return finish(
          context,
          'source.manual_value',
          'error',
          {},
          {
            errors: ['API reference requires an explicit source locator.'],
          },
        );
      }
      return finish(
        context,
        'source.manual_value',
        'warning',
        {
          apiReference: { locator, label: context.block.label },
          immutable: true,
        },
        { warnings: ['API reference only; this block contains no fetched numeric value.'] },
      );
    }
    const value =
      parseNumber(context.config.value) ??
      parseNumber(context.config.manualValue) ??
      parseNumber(context.config.scalarValue) ??
      parseNumber(context.config.valuePreview) ??
      parseNumber(context.block.source?.valuePreview);
    if (value === null) {
      const message =
        'Manual Value Source requires an explicit numeric value in the saved version.';
      return finish(context, 'source.manual_value', 'error', {}, { errors: [message] });
    }
    const evidence: EvidenceRef = {
      evidenceId: `${context.block.id}:value`,
      immutable: true,
      label: context.block.label,
      locator:
        context.block.source?.locator ||
        String(context.config.sourceLocator || 'saved-workflow-version'),
      sourceBlockId: context.block.id,
      sourceLabel: context.block.label,
      valuePreview: String(value),
    };
    const trace: SourceTraceRef = {
      evidenceRefId: evidence.evidenceId,
      relationshipPath: [context.block.id],
      sourceBlockId: context.block.id,
      sourceLabel: context.block.label,
      valuePreview: String(value),
    };
    return finish(
      context,
      'source.manual_value',
      'success',
      {
        immutable: true,
        label: String(context.config.valueLabel || context.block.label),
        readOnlyEvidence: true,
        unit: context.config.unit || context.config.currency || null,
        value,
      },
      { evidenceRefs: [evidence], sourceTrace: [trace] },
    );
  },
};

export const logicFormula: ToolDefinition = {
  toolId: 'logic.formula',
  family: 'Logic',
  subtype: 'Formula',
  toolGroup: 'calculation',
  displayName: 'Formula',
  description: 'Calculates an explicit safe arithmetic operation over upstream values.',
  inputRoles: [
    {
      acceptedFamilies: ['Logic', 'Source'],
      acceptedOutputTypes: ['subtotal', 'value'],
      allowMultiple: true,
      description: 'Numeric values from upstream Sources or Logic.',
      id: 'values',
      label: 'Values',
      required: true,
    },
  ],
  outputRoles: [
    {
      id: 'value',
      label: 'Value',
      description: 'Calculated value.',
      outputType: 'value',
      canRouteToFamilies: ['Output', 'Protected', 'Review / Validation'],
      outputKey: 'value',
    },
  ],
  inputSchema: { fields: [{ key: 'values', type: 'array', required: true }] },
  outputSchema: { fields: [{ key: 'value', type: 'number', required: true }] },
  defaultConfig: {},
  runMode: 'local_mock',
  execute: (context) => {
    const available = numericValues(context);
    if (context.config.operands !== undefined && !Array.isArray(context.config.operands)) {
      return finish(
        context,
        'logic.formula',
        'error',
        {},
        {
          errors: ['Formula operands must be an array of numbers or source references.'],
        },
      );
    }
    const configured = Array.isArray(context.config.operands) ? context.config.operands : [];
    const operands: number[] = [];
    for (const [index, operand] of configured.entries()) {
      const value = resolveOperand(operand, available);
      if (value === undefined) {
        return finish(
          context,
          'logic.formula',
          'error',
          {},
          {
            errors: [
              `Formula operand ${index + 1} is invalid, missing or ambiguous. Use a finite number or an exact source reference.`,
            ],
          },
        );
      }
      operands.push(value);
    }
    if (!configured.length) operands.push(...available.map((value) => value.value));
    const operation = String(context.config.operation || 'add').toLowerCase();
    if (!['add', 'divide', 'multiply', 'percentage', 'subtract'].includes(operation)) {
      const message = `Unsupported formula operation '${operation}'.`;
      return finish(context, 'logic.formula', 'error', {}, { errors: [message] });
    }
    if (operation === 'divide' && operands.slice(1).some((value) => value === 0)) {
      const message = 'Division by zero is not allowed.';
      return finish(context, 'logic.formula', 'error', {}, { errors: [message] });
    }
    const value = calculate(operation, operands);
    if (value === null || !Number.isFinite(value)) {
      const message = 'Formula requires explicit finite numeric operands.';
      return finish(context, 'logic.formula', 'error', {}, { errors: [message] });
    }
    return finish(context, 'logic.formula', 'success', {
      formulaTrace: `${operation}(${operands.join(', ')})`,
      inputValues: available,
      operation,
      value,
    });
  },
};
