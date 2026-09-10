import { parseNumericInput as parseDocumentNumber } from '@/shared/workflow-engine/numeric-input';
export { parseDocumentNumber };

export function textDocumentRecords(text: string): Record<string, unknown>[] {
  return text.split(/\r?\n/).filter(line => line.trim()).map((line, index) => {
    // Candidates are deliberately not mapped to amount automatically: a number
    // could be a date, quantity, identifier, or money. The user reviews the field.
    const numbers = [...line.matchAll(/(?<![\w])\(?[-+]?[$€£¥]?\d+(?:[.,]\d+)*\)?(?![\w])/g)].map(match => match[0]);
    return { rowId: `row-${index + 1}`, label: line.trim(), ...Object.fromEntries(numbers.map((value, i) => [`number_${i + 1}`, value])) };
  });
}

export function parseDelimitedRecords(text: string, delimiter: string): Record<string, unknown>[] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (!quoted && (char === delimiter || char === '\n' || char === '\r')) {
      row.push(cell); cell = '';
      if (char !== delimiter) { if (row.some(value => value.trim())) rows.push(row); row = []; if (char === '\r' && text[i + 1] === '\n') i++; }
    } else cell += char;
  }
  if (quoted) throw new Error('The document has an unclosed quoted field. Check its CSV formatting.');
  row.push(cell); if (row.some(value => value.trim())) rows.push(row);
  const headers = rows.shift()?.map(value => value.trim()) ?? [];
  if (headers.some(value => !value) || new Set(headers).size !== headers.length) throw new Error('Give each column a unique, nonempty heading.');
  return rows.map(values => {
    if (values.length !== headers.length) throw new Error('A row has a different number of columns than the heading. Check its separators.');
    return Object.fromEntries(headers.map((key, i) => [key, values[i] === '' ? null : /^0\d+$/.test(values[i]) ? values[i] : parseDocumentNumber(values[i]) ?? values[i]]));
  });
}
