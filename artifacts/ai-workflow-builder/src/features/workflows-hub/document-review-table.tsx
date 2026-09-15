import { useState } from 'react';
export function DocumentReviewTable({ rows, onChange, numericFields, onNumericFields }: {
  rows: Record<string, unknown>[]; onChange: (rows: Record<string, unknown>[]) => void;
  numericFields: string[]; onNumericFields: (fields: string[]) => void;
}) {
  const [page, setPage] = useState(0);
  const [field, setField] = useState('');
  const columns = [...new Set(rows.flatMap(Object.keys))].filter(key => key !== 'rowId' && rows.some(row => row[key] === null || typeof row[key] !== 'object'));
  const current = Math.min(page, Math.max(0, Math.ceil(rows.length / 25) - 1));
  return <div className="space-y-2" aria-label="Document extraction review">
    <p className="text-sm">{rows.length} records · edit values and choose numeric columns before applying.</p>
    <div className="max-h-80 overflow-auto"><table className="text-xs"><thead><tr>
      {columns.map(key => <th className="sticky top-0 border bg-background p-2" key={key}>{key}<select aria-label={`Column type ${key}`} value={numericFields.includes(key) ? 'number' : 'text'} onChange={event => { onNumericFields(event.target.value === 'number' ? [...new Set([...numericFields, key])] : numericFields.filter(item => item !== key)); if (event.target.value === 'text') onChange(rows.map(row => ({ ...row, [key]: row[key] == null ? '' : String(row[key]) }))); }}><option value="text">Text</option><option value="number">Number</option></select></th>)}<th>Remove</th>
    </tr></thead><tbody>{rows.slice(current * 25, current * 25 + 25).map((row, offset) => {
      const index = current * 25 + offset;
      return <tr key={index}>{columns.map(key => <td className="border p-1" key={key}><input aria-label={`Row ${index + 1} ${key}`} className="min-w-28 rounded border p-1" value={row[key] == null ? '' : typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])} onChange={event => onChange(rows.map((item, i) => i === index ? { ...item, [key]: event.target.value } : item))} /></td>)}<td><button aria-label={`Remove row ${index + 1}`} onClick={() => onChange(rows.filter((_, i) => i !== index))}>Remove</button></td></tr>;
    })}</tbody></table></div>
    <div className="flex flex-wrap gap-3"><button disabled={current === 0} onClick={() => setPage(current - 1)}>Previous records</button><span>Page {current + 1} of {Math.max(1, Math.ceil(rows.length / 25))}</span><button disabled={(current + 1) * 25 >= rows.length} onClick={() => setPage(current + 1)}>Next records</button><button onClick={() => { onChange([...rows, Object.fromEntries(columns.map(key => [key, '']))]); setPage(Math.floor(rows.length / 25)); }}>Add record</button></div>
    <div className="flex gap-2"><input aria-label="New document field" placeholder="New field name" value={field} onChange={event => setField(event.target.value)} /><button disabled={!field.trim() || columns.includes(field.trim()) || field.trim() === 'rowId'} onClick={() => { onChange(rows.map(row => ({ ...row, [field.trim()]: '' }))); setField(''); }}>Add field</button></div>
  </div>;
}
