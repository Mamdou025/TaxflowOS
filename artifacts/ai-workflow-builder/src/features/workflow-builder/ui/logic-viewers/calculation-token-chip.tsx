import type { DisplayToken } from './calculation-editor-model';

function decodeSourcePart(part: string) {
  try {
    return decodeURIComponent(part.replace(/@/g, '%'));
  } catch {
    return part;
  }
}

function getDisplayValue(token: DisplayToken, sourceLabels?: Map<string, string>) {
  const operatorLabels: Record<string, string> = { '*': '×', '-': '−', '/': '÷' };
  if (!token.value.startsWith('source:')) return operatorLabels[token.value] ?? token.value;
  const [, encodedSource = '', encodedPath = ''] = token.value.split(':');
  const source = decodeSourcePart(encodedSource);
  const path = encodedPath.split('.').map(decodeSourcePart).join(' › ');
  return `${sourceLabels?.get(source) ?? source} · ${path}`;
}

export function CalculationTokenChip({
  sourceLabels,
  termKeys,
  token,
  upstreamKeys,
}: {
  sourceLabels?: Map<string, string>;
  termKeys: Set<string>;
  token: DisplayToken;
  upstreamKeys: Set<string>;
}) {
  const displayValue = getDisplayValue(token, sourceLabels);
  if (token.type === 'op') {
    return (
      <span className="inline-flex select-none items-center rounded px-1.5 py-0.5 font-bold font-mono text-foreground/60 text-xs">
        {displayValue}
      </span>
    );
  }
  if (token.type === 'paren') {
    return (
      <span className="inline-flex select-none items-center rounded px-1 py-0.5 font-mono text-muted-foreground text-xs">
        {displayValue}
      </span>
    );
  }
  if (token.type === 'num') {
    return (
      <span className="inline-flex items-center rounded border border-amber-400/50 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-400">
        {displayValue}
      </span>
    );
  }
  if (token.type === 'func') {
    return (
      <span className="inline-flex items-center rounded border border-violet-400/50 bg-violet-400/15 px-1.5 py-0.5 font-mono text-[11px] text-violet-700 dark:text-violet-400">
        {displayValue}
      </span>
    );
  }
  if (termKeys.has(token.value)) {
    return (
      <span className="inline-flex items-center rounded border border-emerald-400/50 bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
        {displayValue}
      </span>
    );
  }
  if (upstreamKeys.has(token.value)) {
    return (
      <span className="inline-flex items-center rounded border border-sky-400/50 bg-sky-400/15 px-1.5 py-0.5 font-mono text-[11px] text-sky-700 dark:text-sky-400">
        {displayValue}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded border border-muted-foreground/30 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
      {displayValue}
    </span>
  );
}
