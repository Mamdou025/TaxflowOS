// Stable, source-qualified references prevent two blocks' identically named
// fields from overwriting one another. Segments also support spaces and dots.
const encodeSegment = (value: string) => encodeURIComponent(value).replace(/[.!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%/g, '@');
export const calculationValueKey = (blockId: string, path: string[]) =>
  `source:${encodeSegment(blockId)}:${path.map(encodeSegment).join('.')}`;

export function numericOutputFields(output: unknown, path: string[] = []): { path: string[]; value: number }[] {
  if (path.length > 16) return [];
  const numeric = typeof output === 'number' ? output :
    typeof output === 'string' && /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(output.trim()) ? Number(output) : NaN;
  if (Number.isFinite(numeric)) return [{ path, value: numeric }];
  if (!output || typeof output !== 'object') return [];
  return Object.entries(output).flatMap(([key, value]) =>
    key === 'backendOutputs' ? [] : numericOutputFields(value, [...path, key]));
}
