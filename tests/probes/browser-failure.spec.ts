import { test, expect } from '@playwright/test';

// Opt-in harness diagnostic, excluded from all normal test suites.
// The expected process exit is nonzero; trace, screenshot and video must survive it.
test('intentional failure proves browser artifacts are retained', async ({ page }) => {
  await page.setContent('<main><h1>Synthetic failure probe</h1></main>');
  expect(await page.getByRole('heading').textContent()).toBe('This assertion intentionally fails');
});
