import { expect, type Page } from '@playwright/test';

// Exercise the public backup-import path instead of putting retired templates
// back into the application catalog just to support arithmetic regressions.
export async function openDocumentCalculationFixture(page: Page): Promise<void> {
  await page.goto('/w/pf-fapi');
  const backup = await page.evaluate(async () => {
    const { DOCUMENT_CALCULATOR_CONFIG } =
      await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
    const id = 'custom:document-calculation-fixture';
    return JSON.stringify({
      [id]: {
        id,
        templateId: 'pf-document-calculator',
        draft: {
          ...DOCUMENT_CALCULATOR_CONFIG.buildSnapshot(),
          id,
          name: 'Document calculation fixture',
        },
        versions: [],
        runs: [],
      },
    });
  });
  await page.getByLabel('Workflow storage status').click();
  await page.getByLabel('Import workflow backup').setInputFiles({
    name: 'retired-calculation-fixture.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  const imported = page.getByRole('button', {
    name: 'Document calculation fixture — Imported',
    exact: true,
  });
  await expect(imported).toBeVisible();
  await page.getByLabel('Workflow storage status').click();
  await imported.click();
}
