/** Parse a complete numeric field, never just the first digits of a label. */
export function parseNumericInput(value: unknown, decimal = '.'): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !value.trim()) return null;
  let text = value.trim().replace(/\u00a0/g, ' ');
  text = text.replace(/^[$\u20ac\u00a3\u00a5]/, '').trim();
  const negative = /^\(.*\)$/.test(text);
  if (negative) text = text.slice(1, -1).trim().replace(/^[$\u20ac\u00a3\u00a5]/, '').trim();
  if (negative && /^[+-]/.test(text)) return null;
  if (/\s/.test(text)) {
    if (!/^[+-]?\d{1,3}(?: \d{3})+(?:[.,]\d+)?(?:[eE][+-]?\d+)?$/.test(text)) return null;
    text = text.replaceAll(' ', '');
  }
  const pattern = decimal === ','
    ? /^[+-]?(?:(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?|,\d+)(?:[eE][+-]?\d+)?$/
    : /^[+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/;
  if (!pattern.test(text)) return null;
  text = decimal === ',' ? text.replaceAll('.', '').replace(',', '.') : text.replaceAll(',', '');
  const result = Number(text) * (negative ? -1 : 1);
  return Number.isFinite(result) ? result : null;
}
