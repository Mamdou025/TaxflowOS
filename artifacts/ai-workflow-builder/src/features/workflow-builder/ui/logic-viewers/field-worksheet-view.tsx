import { useRef, useState, type ReactNode } from 'react';
import type {
  FieldWorksheetDependency,
  FieldWorksheetProjection,
  FieldWorksheetLineProjection,
} from '@workspace/workflow-core/field-worksheet';
import { ReadableData } from '../workspace/readable-data';
import { LazyDetails } from '../workspace/lazy-details';

function valueText(value: number | undefined, decimalPlaces?: number) {
  return value === undefined || !Number.isFinite(value)
    ? '—'
    : value.toLocaleString('en-CA', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces ?? 6,
      });
}

function statusText(status: FieldWorksheetDependency['status']) {
  return {
    current: 'Available',
    missing: 'Missing',
    invalid: 'Needs attention',
    stale: 'Outdated',
  }[status];
}

function Evidence({
  evidenceRefs,
  sourceTrace,
}: Pick<FieldWorksheetDependency, 'evidenceRefs' | 'sourceTrace'>) {
  if (!evidenceRefs.length && !sourceTrace.length) return null;
  return (
    <LazyDetails className="mt-2 text-xs" summary="Source evidence">
      <ReadableData value={{ evidence: evidenceRefs, sources: sourceTrace }} />
    </LazyDetails>
  );
}

function Dependency({ item }: { item: FieldWorksheetDependency }) {
  const provider =
    item.binding?.kind === 'source'
      ? `Source: ${item.binding.blockId} · ${item.binding.path.join('.')}`
      : item.origin === 'manual'
        ? 'Entered value'
        : item.origin === 'default'
          ? 'Workflow default'
          : item.origin === 'connected'
            ? 'Connected value with this name'
            : undefined;
  return (
    <li className="border-l pl-3" data-worksheet-dependency={item.key}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span>
          {item.label} <code className="text-xs text-muted-foreground">{item.key}</code>
        </span>
        <span className="font-mono tabular-nums">
          {valueText(item.value)} {item.unit}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {statusText(item.status)}
        {provider ? ` · ${provider}` : ''}
      </p>
      {item.message && <p className="text-xs text-muted-foreground">{item.message}</p>}
      {item.calculationLabel && (
        <p className="text-xs text-muted-foreground">Calculated by {item.calculationLabel}</p>
      )}
      {item.formula && <code className="block break-all py-1 text-xs">{item.formula}</code>}
      <Evidence {...item} />
      {!!item.dependencies.length && (
        <LazyDetails className="mt-2 text-xs" summary={`Supporting values for ${item.label}`}>
          <ul className="mt-2 space-y-3">
            {item.dependencies.map((child, index) => (
              <Dependency key={`${child.key}:${index}`} item={child} />
            ))}
          </ul>
        </LazyDetails>
      )}
    </li>
  );
}

function WorksheetLineView({ line }: { line: FieldWorksheetLineProjection }) {
  const [open, setOpen] = useState(false);
  const primary = line.presentation === 'primary';
  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      data-worksheet-line={line.id}
      data-value-status={line.status}
      data-worksheet-presentation={line.presentation ?? 'summary'}
      className={primary ? 'rounded-lg border bg-muted/30 p-4' : 'p-3'}
    >
      <summary className="cursor-pointer">
        <span className="inline-flex w-[calc(100%-1.25rem)] flex-wrap items-baseline justify-between gap-2 align-middle">
          <span>
            <span className="font-medium">{line.label}</span>
            {!primary && (
              <code className="ml-2 text-xs text-muted-foreground">{line.resultKey}</code>
            )}
            {line.description && (
              <span className="mt-1 block text-xs text-muted-foreground">{line.description}</span>
            )}
          </span>
          <span className="flex items-baseline gap-3">
            <span className="text-xs text-muted-foreground">{statusText(line.status)}</span>
            <span
              data-worksheet-value
              className={`font-mono tabular-nums ${primary ? 'text-2xl font-semibold' : ''}`}
            >
              {valueText(line.value, line.decimalPlaces)} {line.unit}
            </span>
          </span>
        </span>
      </summary>
      {open && (
        <div className="mt-3 space-y-3 pl-4">
          <p className="text-xs text-muted-foreground">
            Calculated by {line.calculationLabel ?? line.calculationBlockId}
          </p>
          {line.message && <p className="text-sm text-muted-foreground">{line.message}</p>}
          {line.formula && (
            <code className="block break-all rounded bg-muted p-2 text-xs">
              {line.resultKey} = {line.formula}
            </code>
          )}
          {!!line.dependencies.length && (
            <ul className="space-y-3" aria-label={`Supporting values for ${line.label}`}>
              {line.dependencies.map((item, index) => (
                <Dependency key={`${item.key}:${index}`} item={item} />
              ))}
            </ul>
          )}
          <Evidence {...line} />
        </div>
      )}
    </details>
  );
}

function lineGroups(lines: FieldWorksheetLineProjection[]) {
  const groups = new Map<string, FieldWorksheetLineProjection[]>();
  for (const line of lines) {
    const group = line.group ?? '';
    groups.set(group, [...(groups.get(group) ?? []), line]);
  }
  return [...groups.entries()];
}

function PresentedLines({ lines }: { lines: FieldWorksheetLineProjection[] }) {
  if (!lines.some((line) => line.presentation || line.group)) {
    return (
      <div className="divide-y rounded border">
        {lines.map((line) => (
          <WorksheetLineView key={line.id} line={line} />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {(['primary', 'summary', 'detail'] as const).map((role) =>
        lineGroups(lines.filter((line) => (line.presentation ?? 'summary') === role)).map(
          ([group, items]) => {
            const content = (
              <div className={role === 'primary' ? 'grid gap-3' : 'divide-y rounded border'}>
                {items.map((line) => (
                  <WorksheetLineView key={line.id} line={line} />
                ))}
              </div>
            );
            return role === 'detail' ? (
              <LazyDetails
                key={`${role}:${group}`}
                className="rounded border p-3"
                summary={
                  <span>
                    <span data-worksheet-group={group || 'Supporting details'}>
                      {group || 'Supporting details'}
                    </span>{' '}
                    <span className="text-xs text-muted-foreground">({items.length})</span>
                  </span>
                }
              >
                <div className="mt-3">{content}</div>
              </LazyDetails>
            ) : (
              <section
                key={`${role}:${group}`}
                aria-label={group || (role === 'primary' ? 'Primary results' : 'Result summary')}
                className="space-y-2"
              >
                {group && <h4 className="text-sm font-medium">{group}</h4>}
                {content}
              </section>
            );
          },
        ),
      )}
    </div>
  );
}

function missingInputs(lines: FieldWorksheetLineProjection[]) {
  const missing = new Map<string, { label: string; calculationId: string }>();
  const visit = (items: FieldWorksheetDependency[], calculationId: string) => {
    for (const item of items) {
      const owner = item.calculationBlockId ?? calculationId;
      if (item.kind === 'input' && item.status === 'missing' && !item.dependencies.length)
        missing.set(`${owner}:${item.key}`, { label: item.label, calculationId: owner });
      visit(item.dependencies, owner);
    }
  };
  for (const line of lines) visit(line.dependencies, line.calculationBlockId);
  return [...missing.values()];
}

/** The projection resolves dependencies, freshness and provenance; this component presents it. */
export function FieldWorksheetView({
  label,
  projection,
  lastRun = false,
  renderInputs,
  editableCalculationIds,
}: {
  label: string;
  projection: FieldWorksheetProjection;
  lastRun?: boolean;
  renderInputs?: (calculationBlockId: string) => ReactNode;
  editableCalculationIds?: readonly string[];
}) {
  const [openInputs, setOpenInputs] = useState<Set<string>>(() => new Set());
  const inputPanels = useRef(new Map<string, HTMLDetailsElement>());
  const calculatorLabels = new Map<string, string>();
  const includeDependencies = (dependencies: FieldWorksheetDependency[]) => {
    for (const item of dependencies) {
      if (item.calculationBlockId)
        calculatorLabels.set(
          item.calculationBlockId,
          item.calculationLabel ?? item.calculationBlockId,
        );
      includeDependencies(item.dependencies);
    }
  };
  for (const line of projection.lines) {
    calculatorLabels.set(line.calculationBlockId, line.calculationLabel ?? line.calculationBlockId);
    includeDependencies(line.dependencies);
  }
  const calculators = [...calculatorLabels.entries()];
  const editableCalculators = calculators.filter(
    ([id]) => !editableCalculationIds || editableCalculationIds.includes(id),
  );
  const missing = missingInputs(projection.lines);
  const missingCalculatorIds = editableCalculators
    .filter(([id]) => missing.some((item) => item.calculationId === id))
    .map(([id]) => id);
  return (
    <section
      aria-label={`Worksheet: ${label}`}
      className="space-y-3 rounded-lg border bg-background p-3"
    >
      <header>
        <h3 className="font-semibold">{label}</h3>
        <p className="text-xs text-muted-foreground">
          Open a line to see its formula, supporting values and evidence.
        </p>
        {lastRun && (
          <p className="mt-1 text-xs text-muted-foreground">
            Last run evidence. Run again after changing sources, connections or formulas.
          </p>
        )}
      </header>
      {projection.errors.map((error, index) => (
        <p role="alert" className="text-sm text-amber-700" key={index}>
          {error}
        </p>
      ))}
      {!!missing.length && (
        <div
          className="rounded border border-amber-300 bg-amber-50/50 p-3 text-sm"
          data-worksheet-missing-inputs
        >
          <p>
            {missing.length} required {missing.length === 1 ? 'value is' : 'values are'} missing:{' '}
            {missing.map((item) => item.label).join(', ')}.
          </p>
          {renderInputs && !!missingCalculatorIds.length && (
            <button
              type="button"
              className="mt-1 underline"
              onClick={() => {
                setOpenInputs((current) => new Set([...current, ...missingCalculatorIds]));
                inputPanels.current
                  .get(missingCalculatorIds[0])
                  ?.scrollIntoView({ block: 'nearest' });
              }}
            >
              Review required inputs
            </button>
          )}
        </div>
      )}
      <PresentedLines lines={projection.lines} />
      {renderInputs &&
        editableCalculators.map(([id, name]) => (
          <details
            key={id}
            ref={(element) => {
              if (element) inputPanels.current.set(id, element);
              else inputPanels.current.delete(id);
            }}
            open={openInputs.has(id)}
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenInputs((current) => {
                if (current.has(id) === open) return current;
                const next = new Set(current);
                if (open) next.add(id);
                else next.delete(id);
                return next;
              });
            }}
            className="rounded border p-3 text-sm"
          >
            <summary className="cursor-pointer font-medium">Edit inputs for {name}</summary>
            {openInputs.has(id) && <div className="mt-3">{renderInputs(id)}</div>}
          </details>
        ))}
    </section>
  );
}
