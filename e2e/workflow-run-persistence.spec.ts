/**
 * Regression test for the "run state lost on navigation" bug (virtual-worker
 * journey finding #9).
 *
 * The run's gate state (source provided / elected / approved) used to live in
 * component-local `useState` inside WorkflowRunFlow, so leaving the Run surface
 * and coming back reset a started run to the "Document needed" upload gate,
 * discarding the work. The fix moves that state into a shared, persisted atom
 * (`runFlowAtom`), so an advanced run survives navigation AND a reload.
 *
 * This drives the AI-free standalone run route (/run/:workflowId → WorkflowRunFlow)
 * deterministically — no chat, no model, no gateway credit needed.
 */
import { test, expect } from '@playwright/test';

const RUN_ROUTE = '/run/fapi'; // a registered runnable workflow (FAPI Calculation)

test.describe('Workflow run-state persistence (#9)', () => {
  test('a started run is NOT reset to "Document needed" after navigating away and back', async ({ page }) => {
    // Start from a clean slate so the run genuinely begins at the upload gate.
    await page.goto(RUN_ROUTE, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.removeItem('taxflow:run-flow'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    // 1. A fresh run asks for its source.
    await expect(page.getByText('Document needed')).toBeVisible({ timeout: 15_000 });

    // 2. Start the run using the built-in sample workbook.
    await page.getByRole('button', { name: /Use sample workbook/i }).click();

    // 3. The upload gate is gone — the run has advanced.
    await expect(page.getByText('Document needed')).toBeHidden({ timeout: 10_000 });

    // 4. Navigate away, then back (a full reload — the strictest case).
    await page.goto('/documents', { waitUntil: 'domcontentloaded' });
    await page.goto(RUN_ROUTE, { waitUntil: 'domcontentloaded' });

    // 5. THE FIX: the run is still advanced — it did NOT snap back to the upload gate.
    await expect(page.getByText('Document needed')).toBeHidden({ timeout: 15_000 });
  });

  test('a workflow that was never started still asks for its source (invariant preserved)', async ({ page }) => {
    // Clear any persisted run state, then load a run that has never been advanced.
    await page.goto(RUN_ROUTE, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.removeItem('taxflow:run-flow'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    // A brand-new run must still ask for the document (cached data alone must not
    // auto-satisfy the gate).
    await expect(page.getByText('Document needed')).toBeVisible({ timeout: 15_000 });
  });
});
