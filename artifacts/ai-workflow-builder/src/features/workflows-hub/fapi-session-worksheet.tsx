import { Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import {
  fapiWorksheetCsv,
  projectFapiSessionWorksheet,
  type FapiRecordedValue,
  type FapiWorksheetProjection,
} from './fapi-session-result';

const statusLabels = {
  current: 'Available',
  missing: 'Not calculated',
  stale: 'Outdated — recalculate',
  invalid: 'Needs attention',
};

function Amount({ cell, digits = 2 }: { cell: FapiRecordedValue; digits?: number }) {
  return (
    <span data-result-key={cell.key} data-value-status={cell.status}>
      {cell.status === 'current' && cell.value !== undefined ? (
        <span className="font-mono tabular-nums">
          {cell.value.toLocaleString('en-CA', {
            minimumFractionDigits: digits === 6 ? 4 : digits,
            maximumFractionDigits: digits,
          })}
        </span>
      ) : (
        <span className="text-xs font-normal text-muted-foreground">
          {statusLabels[cell.status]}
        </span>
      )}
    </span>
  );
}

function download(sheet: FapiWorksheetProjection) {
  const blob = new Blob(['\uFEFF', fapiWorksheetCsv(sheet)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fapi-worksheet-v${sheet.version}-revision-${sheet.revision}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function Summary({ sheet }: { sheet: FapiWorksheetProjection }) {
  return (
    <div className="overflow-x-auto">
      <table aria-label="FAPI results summary" className="w-full text-sm">
        <thead className="bg-muted/30 text-[10px] uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Results summary</th>
            <th className="px-4 py-3 text-right font-semibold">{sheet.source}</th>
            <th className="px-4 py-3 text-right font-semibold">{sheet.reporting}</th>
          </tr>
        </thead>
        <tbody>
          {sheet.summary.map((row) => (
            <tr
              key={row.key}
              className={`border-t border-border/60 ${['FAPI_BRUT', 'NET_FAPI'].includes(row.key) ? 'bg-muted/20 font-semibold' : ''}`}
            >
              <th scope="row" className="px-4 py-3 text-left font-[inherit]">
                {row.label}
                {row.source.formula && (
                  <details className="mt-1 text-xs font-normal text-muted-foreground">
                    <summary className="cursor-pointer">Recorded formula</summary>
                    <code className="mt-1 block break-all">{row.source.formula}</code>
                  </details>
                )}
              </th>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <Amount cell={row.source} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <Amount cell={row.cad} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorksheetLines({ sheet }: { sheet: FapiWorksheetProjection }) {
  return (
    <div className="overflow-x-auto">
      <table aria-label="FAPI worksheet lines" className="w-full text-sm">
        <thead className="bg-muted/30 text-[10px] uppercase tracking-wide text-muted-foreground">
          <tr>
            {['Line', 'Description', 'Amount', 'Ccy / unit'].map((label) => (
              <th
                key={label}
                className={`px-4 py-3 font-semibold ${['Line', 'Description'].includes(label) ? 'text-left' : 'text-right'}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        {sheet.sections.map((section) => (
          <tbody key={section.title}>
            <tr>
              <th
                colSpan={4}
                scope="colgroup"
                className="px-4 pb-2 pt-4 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {section.title}
              </th>
            </tr>
            {section.rows.map((row) => (
              <tr key={row.key} className="border-t border-border/60 hover:bg-muted/20">
                <th scope="row" className="px-4 py-3 text-left">
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${row.code === 'FX' ? 'bg-[#7fb2d9]' : 'bg-[#7cc3a6]'}`}
                    />
                    <span className="rounded border bg-muted/30 px-1.5 py-0.5 text-xs">
                      {row.code}
                    </span>
                  </span>
                </th>
                <td className="px-4 py-3">
                  {row.label}
                  {row.formula && (
                    <details className="mt-1 text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Recorded formula</summary>
                      <code className="mt-1 block break-all">{row.formula}</code>
                    </details>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Amount cell={row} digits={row.digits} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-muted-foreground">
                  {row.unit}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

/** A prescribed FAPI sheet backed by the exact run; inputs remain in the session's live forms. */
export function FapiSessionWorksheet({
  definition,
  session,
  presentation = 'summary',
  onOpenWorksheet,
}: {
  definition: WorkflowDefinition;
  session: WorkflowSession;
  presentation?: 'summary' | 'worksheet';
  onOpenWorksheet?: () => void;
}) {
  const sheet = projectFapiSessionWorksheet(definition, session);
  if (!sheet) return null;
  const available = sheet.summary.some(
    (row) => row.source.status === 'current' || row.cad.status === 'current',
  );
  const outdated = sheet.summary.some(
    (row) => row.source.status === 'stale' || row.cad.status === 'stale',
  );
  const complete = sheet.summary.every(
    (row) => row.source.status === 'current' && row.cad.status === 'current',
  );
  return (
    <section
      aria-label="FAPI worksheet"
      data-fapi-worksheet
      data-run-id={sheet.runId}
      className="overflow-hidden rounded-2xl border bg-background text-foreground shadow-sm"
    >
      <header className="space-y-2 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <FileSpreadsheet className="size-3.5" /> FAPI worksheet
          </span>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-50"
            disabled={!available}
            onClick={() => download(sheet)}
          >
            <Download className="size-3.5" /> Export worksheet CSV
          </button>
        </div>
        <h4 className="text-lg font-semibold tracking-tight">Foreign accrual property income</h4>
        <p className="text-xs text-muted-foreground">
          Version {sheet.version} · Revision {sheet.revision} ·{' '}
          {sheet.approvedAt ? 'Approved' : 'Not yet approved'}
        </p>
        <p role="status" className="text-xs text-muted-foreground">
          {outdated
            ? 'Inputs changed. Recalculate to refresh the worksheet.'
            : complete
              ? 'Recorded calculation results are available.'
              : 'The worksheet fills as the saved workflow calculates its fields.'}
        </p>
        {!!sheet.sources.length && (
          <p className="text-xs text-muted-foreground">
            Source history: {sheet.sources.map((source) => source.name).join(', ')}
          </p>
        )}
        {!!sheet.messages.length && (
          <ul className="list-disc space-y-1 pl-4 text-xs text-amber-700">
            {sheet.messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </header>
      {presentation === 'worksheet' && <WorksheetLines sheet={sheet} />}
      <Summary sheet={sheet} />
      <div className="space-y-2 border-t px-4 py-3">
        {presentation === 'summary' &&
          (onOpenWorksheet ? (
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
              onClick={onOpenWorksheet}
            >
              <ExternalLink className="size-3.5" /> Open worksheet
            </button>
          ) : (
            <details>
              <summary className="cursor-pointer text-sm font-medium">Open full worksheet</summary>
              <div className="mt-3">
                <WorksheetLines sheet={sheet} />
              </div>
            </details>
          ))}
        <p className="text-[11px] text-muted-foreground">
          Saved workflow fields and recorded values. Display rounding does not change calculations
          or exported precision. Approval and saving are separate.
        </p>
      </div>
    </section>
  );
}
