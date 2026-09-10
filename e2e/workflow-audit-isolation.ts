import { test as base, expect } from '@playwright/test';
export { expect };
// Dedicated persistence tests use the real API. All other regression cases
// isolate their server writes just as they isolate their local browser storage.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/workflow-library', route => route.fulfill({ json: route.request().method() === 'GET' ? { revision: 0, payload: null } : { revision: (route.request().postDataJSON()?.revision ?? 0) + 1 } }));
    await use(page);
  },
});
