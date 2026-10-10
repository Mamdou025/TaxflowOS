import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ALL_SCOPES,
  EXECUTE_SCOPE,
  SCOPE,
  WRITE_SCOPE,
  canConsentWorkflowScopes,
  loadOAuthConfig,
  parseWorkflowScopes,
} from '../../artifacts/api-server/src/security/chatgpt-oauth/config';

const settings = {
  INSCOPE_CHATGPT_OAUTH_CLIENT_ID: 'synthetic-client',
  INSCOPE_CHATGPT_OAUTH_CLIENT_SECRET: 'synthetic-client-secret-at-least-32-characters',
  INSCOPE_CHATGPT_OAUTH_REDIRECT_URI: 'https://client.example.invalid/exact-callback',
  INSCOPE_CHATGPT_PILOT_USER_IDS: 'account-one, account-two',
};

test('OAuth scopes require read and preserve independent write/execute choices without implicit permissions', () => {
  assert.deepEqual(parseWorkflowScopes(SCOPE), [SCOPE]);
  assert.deepEqual(parseWorkflowScopes([WRITE_SCOPE, SCOPE]), [SCOPE, WRITE_SCOPE]);
  assert.deepEqual(parseWorkflowScopes(`${EXECUTE_SCOPE} ${SCOPE}`), [SCOPE, EXECUTE_SCOPE]);
  assert.deepEqual(parseWorkflowScopes([...ALL_SCOPES].reverse()), [...ALL_SCOPES]);
  for (const value of [
    undefined,
    '',
    [],
    WRITE_SCOPE,
    EXECUTE_SCOPE,
    `${SCOPE} ${SCOPE}`,
    `${SCOPE} unknown`,
    `${SCOPE} `,
  ])
    assert.equal(parseWorkflowScopes(value), undefined);
  for (const role of ['owner', 'editor']) {
    assert.equal(canConsentWorkflowScopes(role, ALL_SCOPES), true);
    assert.equal(canConsentWorkflowScopes(role, [SCOPE, EXECUTE_SCOPE]), true);
  }
  assert.equal(canConsentWorkflowScopes('viewer', [SCOPE]), true);
  assert.equal(canConsentWorkflowScopes('viewer', [SCOPE, WRITE_SCOPE]), false);
  assert.equal(canConsentWorkflowScopes('viewer', [SCOPE, EXECUTE_SCOPE]), false);
  assert.equal(canConsentWorkflowScopes('unknown', [SCOPE]), false);
  assert.equal(canConsentWorkflowScopes('owner', []), false);
});
test('OAuth stays disabled without configuration and partial settings cannot broaden access', () => {
  assert.equal(loadOAuthConfig({}, 'https://inscope.example.invalid'), undefined);
  for (const key of Object.keys(settings)) {
    const partial = { ...settings, [key]: '' };
    assert.throws(
      () => loadOAuthConfig(partial, 'https://inscope.example.invalid'),
      /Configure all four/,
    );
  }
});
test('OAuth configuration fixes issuer/resource and requires exact safe callbacks and account IDs', () => {
  const config = loadOAuthConfig(settings, 'https://inscope.example.invalid')!;
  assert.equal(config.resource, 'https://inscope.example.invalid/api/chatgpt/mcp');
  assert.deepEqual(config.pilotUserIds, ['account-one', 'account-two']);
  for (const redirect of [
    'http://client.example.invalid/callback',
    'https://client.example.invalid/callback#fragment',
    'https://user:pass@client.example.invalid/callback',
    'javascript:alert(1)',
  ])
    assert.throws(() =>
      loadOAuthConfig({ ...settings, INSCOPE_CHATGPT_OAUTH_REDIRECT_URI: redirect }, config.issuer),
    );
  assert.throws(() =>
    loadOAuthConfig(
      { ...settings, INSCOPE_CHATGPT_PILOT_USER_IDS: 'someone@example.invalid' },
      config.issuer,
    ),
  );
  assert.throws(() =>
    loadOAuthConfig({ ...settings, INSCOPE_CHATGPT_OAUTH_CLIENT_SECRET: 'short' }, config.issuer),
  );
  assert.throws(() => loadOAuthConfig(settings, 'http://public.example.invalid'));
  assert.throws(() => loadOAuthConfig(settings, 'https://inscope.example.invalid/'));
  assert.doesNotThrow(() =>
    loadOAuthConfig(
      { ...settings, INSCOPE_CHATGPT_OAUTH_REDIRECT_URI: 'http://127.0.0.1:4567/callback' },
      'http://127.0.0.1:4568',
    ),
  );
});
