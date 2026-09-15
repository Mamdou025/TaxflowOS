import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.route('**/*', (route) => {
  const host = new URL(route.request().url()).hostname;
  return ['127.0.0.1', 'localhost'].includes(host) ? route.continue() : route.abort();
});
try {
  const response = await page.goto('http://127.0.0.1:5173', {
    waitUntil: 'commit',
    timeout: 180000,
  });
  await page.getByRole('button', { name: 'Try demo', exact: true }).waitFor({ timeout: 60000 });
  if (await page.locator('vite-error-overlay').count()) throw new Error('Vite error overlay remains.');
  if (errors.length) throw new Error(errors.join('\n'));
  await page.screenshot({ path: 'test-results/docker-package-smoke.png' });
  console.log(`Docker app loads without import errors (HTTP ${response.status()}); entry screen visible.`);
} catch (error) {
  await page.screenshot({ path: 'test-results/docker-package-smoke-failure.png', timeout: 5000 }).catch(() => {});
  console.error('Browser errors:', errors);
  throw error;
} finally {
  await browser.close();
}
