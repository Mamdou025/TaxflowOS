import { test as base, expect } from '@playwright/test';
import { syntheticContext, syntheticSession } from '../scripts/testing/browser-fixtures.mjs';
export { expect };
// Dedicated persistence tests use the real API. All other regression cases
// isolate their server writes just as they isolate their local browser storage.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(value => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)), syntheticContext);
    await page.route('**/api/session', route => route.fulfill({ json: syntheticSession }));
    await page.route('**/api/workspaces', route => route.fulfill({ json: { workspaces: [syntheticContext.workspace] } }));
    await page.route('**/api/workflow-library', route => route.fulfill({ json: route.request().method() === 'GET' ? { revision: 0, payload: null } : { revision: (route.request().postDataJSON()?.revision ?? 0) + 1 } }));
    await use(page);
  },
});
