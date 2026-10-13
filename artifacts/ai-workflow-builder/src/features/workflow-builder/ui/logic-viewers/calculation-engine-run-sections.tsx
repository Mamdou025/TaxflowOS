function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function getCalculationRunModeLabel(mode: string) {
  if (mode === 'auto:external') return 'Auto - using connected Calculation Rules Source';
  if (mode === 'auto:inline' || mode === 'inline') return 'Auto - using inline formulas';
  if (mode === 'external_rules') return 'External Calculation Rules Source';
  return mode;
}

export type CalculationRunSection = 'summary' | 'results' | 'trace' | 'warnings';
const ALL_SECTIONS: CalculationRunSection[] = ['summary', 'results', 'trace', 'warnings'];

export function CalculationEngineRunSections({
  lastRunOutput,
  resolvedMode,
  sections = ALL_SECTIONS,
}: {
  lastRunOutput: Record<string, unknown>;
  resolvedMode?: string;
  /** Which sections to render — lets the Results and Review tabs in
   *  calculation-engine-editor.tsx split this same read without duplicating
   *  the extraction logic. Omit to render everything (existing callers). */
  sections?: CalculationRunSection[];
}) {
  const calculationSummary = asRecord(lastRunOutput.calculationSummary);
  const formulaTrace = asRecord(asRecord(lastRunOutput.formula_trace).formulaTrace);
  const calculatedResults = asRecord(asRecord(lastRunOutput.calculated_results).calculatedResults);
  const warnings = Array.isArray(lastRunOutput.warnings)
    ? (lastRunOutput.warnings as string[])
    : [];
  const mode = resolvedMode || (calculationSummary.formulaMode as string | undefined) || 'auto';
  const traceEntries = Object.entries(formulaTrace);
  const resultEntries = Object.entries(calculatedResults);
  const show = (section: CalculationRunSection) => sections.includes(section);

  return (
    <div className="space-y-3">
      {show('summary') && (
        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-sm">Run summary</div>
          <div className="divide-y rounded border bg-background/40 text-xs">
            {[
              { label: 'Formula mode', value: getCalculationRunModeLabel(mode) },
              { label: 'Formulas evaluated', value: calculationSummary.calculatedCount ?? '–' },
              { label: 'Input values', value: calculationSummary.inputCount ?? '–' },
              { label: 'Rules used', value: calculationSummary.ruleCount ?? '–' },
              { label: 'Warnings', value: calculationSummary.warningCount ?? '–' },
            ].map((row) => (
              <div className="grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5" key={row.label}>
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{String(row.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {show('results') && resultEntries.length > 0 && (
        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-xs">Calculated results</div>
          <div className="divide-y rounded border bg-background/40 text-xs">
            {resultEntries.map(([key, value]) => (
              <div className="grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5" key={key}>
                <span className="font-mono text-muted-foreground">{key}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {show('trace') && traceEntries.length > 0 && (
        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-xs">Formula trace</div>
          <div className="space-y-1">
            {traceEntries.map(([key, traceValue]) => {
              const trace = asRecord(traceValue);
              const traceWarnings = Array.isArray(trace.warnings)
                ? (trace.warnings as string[])
                : [];
              return (
                <div className="rounded border bg-background/60 p-2 text-[11px]" key={key}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium font-mono">{key}</span>
                    <span className="font-medium">= {String(trace.result ?? '–')}</span>
                  </div>
                  <div className="mt-0.5 text-muted-foreground">
                    {String(trace.expression || trace.operation || '')}
                  </div>
                  {traceWarnings.length > 0 && (
                    <div className="mt-1 text-[10px] text-amber-600">
                      {traceWarnings.join('; ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {show('warnings') &&
        (warnings.length > 0 ? (
          <div className="space-y-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="font-medium text-amber-700 text-xs">Warnings</div>
            {warnings.map((warning) => (
              <div className="text-[11px] text-amber-800 dark:text-amber-300" key={warning}>
                {warning}
              </div>
            ))}
          </div>
        ) : (
          <p className="px-1 text-muted-foreground text-xs">
            Nothing needs attention — no warnings from the last run.
          </p>
        ))}
    </div>
  );
}
