import { chromium } from 'playwright';

const url = (process.env.APP_URL ?? 'http://localhost:5173').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 400)));

await page.goto(url + '/run/fapi', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const dump = async (tag) => {
  await page.screenshot({ path: `shot-${tag}.png` });
  const texts = await page.$$eval('button', (bs) => bs.map((b) => (b.textContent || '').trim().replace(/\s+/g, ' ')).filter((t) => t && t.length < 100));
  console.log(`${tag}:`, JSON.stringify(texts));
};
await dump('run-page');

const sample = page.getByRole('button', { name: /Use sample workbook/i });
if (await sample.count()) {
  await sample.first().click();
  await page.waitForTimeout(4000);
}
const where = page.getByRole('button', { name: /where it comes from/i });
console.log('where-links:', await where.count());
if (await where.count() > 1) {
  await where.nth(1).scrollIntoViewIfNeeded();
  await where.nth(1).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: /Open the full block in the builder/i }).first().click();
  await page.waitForTimeout(25000);
  await page.screenshot({ path: 'shot-run-path.png' });
  console.log('url:', page.url(),
              '| overlay:', await page.locator('text=Block workspace').count(),
              '| empty-state:', await page.locator('text=Select a workflow').count());
}
console.log('ERRORS:', JSON.stringify(errors, null, 1));
await browser.close();
