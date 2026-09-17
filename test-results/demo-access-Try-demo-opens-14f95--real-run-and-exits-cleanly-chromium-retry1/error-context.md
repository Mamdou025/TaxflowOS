# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-access.spec.ts >> Try demo opens Chat without credentials, saves a real run and exits cleanly
- Location: e2e/demo-access.spec.ts:35:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('region', { name: 'Demo session' })
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('region', { name: 'Demo session' })
    - waiting for "http://127.0.0.1:5173/" navigation to finish...
    - navigated to "http://127.0.0.1:5173/"

```