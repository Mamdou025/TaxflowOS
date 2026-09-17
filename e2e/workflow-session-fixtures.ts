import { createRequire } from 'node:module';
import path from 'node:path';
import type { Page, Locator } from '@playwright/test';

export async function attachSessionWorkbook(
  page: Page,
  panel: Locator,
  name: string,
  amount: number,
) {
  const XLSX = createRequire(path.resolve('artifacts/ai-workflow-builder/package.json'))('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['label', 'amount', 'currency'],
      ['Synthetic item', amount, 'CAD'],
    ]),
    'Records',
  );
  await panel
    .getByLabel('Upload run source')
    .setInputFiles({
      name,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
    });
  const dialog = page.getByRole('dialog', { name: 'Choose spreadsheet data' });
  await dialog.getByRole('combobox', { name: 'Worksheet', exact: true }).selectOption('Records');
  await dialog.getByRole('button', { name: 'Use selected data' }).click();
}
