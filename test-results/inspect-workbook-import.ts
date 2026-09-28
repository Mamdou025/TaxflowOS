import fs from 'node:fs';
import { parseUploadToRows } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/parse-upload';
async function main() {
  const directory = 'C:/Users/Mamad/Downloads';
  const name = fs.readdirSync(directory).find(name => name.startsWith('Raw data for AI') && name.endsWith('v5.xlsx'))!;
  const parsed = await parseUploadToRows(new File([fs.readFileSync(`${directory}/${name}`)], name), {
    selection: { sheetName: 'SAP EXPORT', headerRowNumber: 1, mapping: {
      account: 'G/L Account', description: 'Jrnl.Entry Item Text', amount: 'Amount in CC Crcy',
    } },
  });
  console.log(JSON.stringify({ rows: parsed.rows.length, firstRow: parsed.rows[0].rowNumber, lastRow: parsed.rows.at(-1)?.rowNumber,
    allFinite: parsed.rows.every(row => Number.isFinite(row.amount)), total: parsed.rows.reduce((sum, row) => sum + row.amount, 0) }));
}
void main();
