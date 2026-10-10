import { test, expect, type Page } from '@playwright/test';

const requestId = 'a'.repeat(43);
const requestPath = `/api/chatgpt/oauth/requests/${requestId}`;
const consentPath = `/chatgpt/authorize?request=${requestId}`;
const callback = 'https://oauth.example.invalid/callback?state=synthetic&code=one-use';
const workspaces = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'First workspace', role: 'owner' },
  { id: '00000000-0000-4000-8000-000000000002', name: 'Viewer workspace', role: 'viewer' },
];
const consent = () => ({
  request: {
    id: requestId,
    clientName: 'ChatGPT — InScope private pilot',
    scope: 'inscope.workflows:read',
    expiresAt: new Date(Date.now() + 600000).toISOString(),
    grantDurationDays: 7,
  },
  account: { id: 'registered-pilot-account', name: 'Pilot tester', email: 'pilot@example.invalid' },
  workspaces,
});

async function isolate(page: Page) {
  const unexpected: string[] = [];
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/*', (route) => {
    const hostname = new URL(route.request().url()).hostname;
    return hostname === '127.0.0.1' || hostname === 'localhost'
      ? route.continue()
      : route.abort('blockedbyclient');
  });
  await page.route('**/api/**', (route) => {
    unexpected.push(`${route.request().method()} ${new URL(route.request().url()).pathname}`);
    return route.fulfill({ status: 503, json: { error: 'Unexpected request blocked by test.' } });
  });
  await page.route('https://oauth.example.invalid/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>Returned to the test client</h1>' }),
  );
  return { unexpected, pageErrors };
}

test('framed account linking fails before loading a consent request', async ({ page }) => {
  const { unexpected, pageErrors } = await isolate(page);
  await page.route('**/__account-linking-frame-test', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<iframe title="Framed authorization" src="${consentPath}"></iframe>`,
    }),
  );
  await page.goto('/__account-linking-frame-test');
  const frame = page.frameLocator('iframe');
  await expect(frame.getByRole('alert')).toContainText('own browser page');
  await expect(frame.getByRole('button', { name: 'Allow read-only access' })).toHaveCount(0);
  expect(unexpected).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('account login preserves the opaque request and consent shares only the explicitly chosen workspace', async ({
  page,
}) => {
  const { unexpected, pageErrors } = await isolate(page);
  let signedIn = false;
  const decisions: unknown[] = [];
  await page.route(`**${requestPath}`, (route) =>
    route.fulfill(
      signedIn ? { json: consent() } : { status: 401, json: { error: 'Sign in required.' } },
    ),
  );
  await page.route('**/api/auth/sign-in/email', (route) => {
    expect(route.request().method()).toBe('POST');
    signedIn = true;
    return route.fulfill({ json: { success: true } });
  });
  await page.route(`**${requestPath}/decision`, (route) => {
    decisions.push(route.request().postDataJSON());
    return route.fulfill({ json: { redirectUrl: callback } });
  });
  await page.goto(`${consentPath}&redirect_uri=https://untrusted.example.invalid/`);
  await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try demo' })).toHaveCount(0);
  await page.getByLabel('Email', { exact: true }).fill('pilot@example.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Synthetic-password-2026!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Connect InScope to ChatGPT' })).toBeVisible();
  expect(new URL(page.url()).searchParams.get('request')).toBe(requestId);
  await expect(page.getByLabel('Workspace to share')).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Allow read-only access' })).toBeDisabled();
  expect(decisions).toEqual([]);
  await expect(page.getByText('Access expires after 7 days.', { exact: false })).toBeVisible();
  await page.getByLabel('Workspace to share').selectOption(workspaces[1].id);
  expect(decisions).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('consent.png'), fullPage: true });
  await page.getByRole('button', { name: 'Allow read-only access' }).click();
  await expect(page).toHaveURL(callback);
  expect(decisions).toEqual([{ decision: 'allow', workspaceId: workspaces[1].id }]);
  expect(unexpected).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('deny requires no workspace and only follows the callback returned by the server', async ({
  page,
}) => {
  const { unexpected, pageErrors } = await isolate(page);
  const decisions: unknown[] = [];
  const deniedCallback =
    'https://oauth.example.invalid/callback?state=synthetic&error=access_denied';
  await page.route(`**${requestPath}`, (route) => route.fulfill({ json: consent() }));
  await page.route(`**${requestPath}/decision`, (route) => {
    decisions.push(route.request().postDataJSON());
    return route.fulfill({ json: { redirectUrl: deniedCallback } });
  });
  await page.goto(consentPath);
  await expect(page.getByRole('button', { name: 'Allow read-only access' })).toBeDisabled();
  await page.getByRole('button', { name: 'Deny', exact: true }).click();
  await expect(page).toHaveURL(deniedCallback);
  expect(decisions).toEqual([{ decision: 'deny' }]);
  expect(unexpected).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('elevated consent describes only the requested actions and never selects or authorizes automatically', async ({
  page,
}) => {
  const { unexpected, pageErrors } = await isolate(page);
  let requestedScope = 'inscope.workflows:read inscope.workflows:write';
  const decisions: unknown[] = [];
  await page.route(`**${requestPath}`, (route) => {
    const details = consent();
    details.request.scope = requestedScope;
    details.workspaces = [workspaces[0]];
    return route.fulfill({ json: details });
  });
  await page.route(`**${requestPath}/decision`, (route) => {
    decisions.push(route.request().postDataJSON());
    return route.fulfill({ json: { redirectUrl: callback } });
  });
  await page.goto(consentPath);
  await expect(page.getByText('Change inputs:', { exact: false })).toContainText(
    'source file replacements',
  );
  await expect(page.getByText('Change inputs:', { exact: false })).toContainText(
    'does not automatically run',
  );
  await expect(page.getByText('Execute:', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Allow requested access' })).toBeDisabled();
  await expect(page.getByLabel('Workspace to share')).toHaveValue('');
  expect(decisions).toEqual([]);

  requestedScope = 'inscope.workflows:read inscope.workflows:execute';
  await page.goto(consentPath);
  await expect(page.getByText('Execute:', { exact: false })).toContainText(
    'explicit execution request',
  );
  await expect(page.getByText('Change inputs:', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Allow requested access' })).toBeDisabled();
  expect(decisions).toEqual([]);
  await page.getByLabel('Workspace to share').selectOption(workspaces[0].id);
  expect(decisions).toEqual([]);
  await page.getByRole('button', { name: 'Allow requested access' }).click();
  await expect(page).toHaveURL(callback);
  expect(decisions).toEqual([{ decision: 'allow', workspaceId: workspaces[0].id }]);
  expect(unexpected).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('demo, disabled pilot, expired requests and lost membership never authorize automatically', async ({
  page,
}) => {
  const { unexpected, pageErrors } = await isolate(page);
  let status = 403;
  let requests = 0;
  let decisions = 0;
  await page.route(`**${requestPath}`, (route) => {
    requests += 1;
    return route.fulfill(
      status === 200
        ? { json: consent() }
        : {
            status,
            json: {
              error:
                status === 403
                  ? 'This account cannot use the private pilot.'
                  : 'The authorization request is unavailable.',
            },
          },
    );
  });
  await page.route(`**${requestPath}/decision`, (route) => {
    decisions += 1;
    return route.fulfill({
      status: 403,
      json: { error: 'Workspace membership is no longer available.' },
    });
  });
  await page.goto(consentPath);
  for (const nextStatus of [403, 503, 404]) {
    status = nextStatus;
    await page.getByRole('button', { name: 'Retry access check' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Allow read-only access' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Try demo' })).toHaveCount(0);
  }
  expect(decisions).toBe(0);
  status = 200;
  await page.getByRole('button', { name: 'Retry access check' }).click();
  await page.getByLabel('Workspace to share').selectOption(workspaces[1].id);
  await page.getByRole('button', { name: 'Allow read-only access' }).click();
  await expect(page.getByRole('alert')).toContainText('membership is no longer available');
  expect(decisions).toBe(1);
  expect(page.url()).toContain(consentPath);
  const previousRequests = requests;
  await page.goto('/chatgpt/authorize?request=invalid');
  await expect(page.getByRole('alert')).toContainText('invalid');
  expect(requests).toBe(previousRequests);
  expect(unexpected).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('own grants can be revoked without an active workspace and failed revocation is not reported as success', async ({
  page,
}) => {
  const { unexpected, pageErrors } = await isolate(page);
  const grant = {
    id: '10000000-0000-4000-8000-000000000001',
    clientName: 'ChatGPT — InScope private pilot',
    workspaceId: workspaces[1].id,
    workspaceName: workspaces[1].name,
    scope: 'inscope.workflows:read',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    revokedAt: null,
  };
  let failRevoke = true;
  let revoked = false;
  let signedOut = false;
  const history = Array.from({ length: 100 }, (_, index) => ({
    ...grant,
    id: `20000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    revokedAt: grant.createdAt,
  }));
  await page.route('**/api/chatgpt/oauth/grants', (route) =>
    route.fulfill(
      signedOut
        ? { status: 401, json: { error: 'Sign in required.' } }
        : { json: { grants: revoked ? history : [...history, grant] } },
    ),
  );
  await page.route(`**/api/chatgpt/oauth/grants/${grant.id}`, (route) => {
    expect(route.request().method()).toBe('DELETE');
    if (failRevoke)
      return route.fulfill({ status: 503, json: { error: 'Revocation could not be saved.' } });
    revoked = true;
    return route.fulfill({ status: 204 });
  });
  await page.goto('/chatgpt/connections');
  expect(
    await page.evaluate(() => sessionStorage.getItem('taxflow:authenticated-workspace')),
  ).toBeNull();
  const button = page.getByRole('button', {
    name: `Revoke ChatGPT access to ${grant.workspaceName}`,
  });
  await button.click();
  await expect(page.getByRole('alert')).toContainText('could not be saved');
  await expect(button).toBeEnabled();
  await expect(page.getByText(`ChatGPT access to ${grant.workspaceName} was revoked.`)).toHaveCount(
    0,
  );
  failRevoke = false;
  await button.click();
  await expect(page.getByRole('status')).toContainText('was revoked');
  await expect(button).toHaveCount(0);
  await expect(
    page.getByText('information already copied into a conversation remains there.', {
      exact: false,
    }),
  ).toBeVisible();
  signedOut = true;
  await page.evaluate(() =>
    window.dispatchEvent(new StorageEvent('storage', { key: 'taxflow:session-changed' })),
  );
  await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  await expect(page.getByText(grant.clientName, { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Try demo' })).toHaveCount(0);
  expect(unexpected).toEqual([]);
  expect(pageErrors).toEqual([]);
});
