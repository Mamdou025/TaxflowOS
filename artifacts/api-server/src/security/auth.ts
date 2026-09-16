import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous } from 'better-auth/plugins/anonymous';
import { db, users, sessions, accounts, verifications } from '@workspace/db';

const replitDevelopmentOrigin = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : undefined;
const origin = process.env.APP_ORIGIN ?? replitDevelopmentOrigin;
const secret = process.env.BETTER_AUTH_SECRET ?? process.env.SESSION_SECRET;
if (!origin || !secret || secret.length < 32) {
  throw new Error(
    'Set APP_ORIGIN and a random BETTER_AUTH_SECRET (or SESSION_SECRET) of at least 32 characters. See docs/DEVELOPMENT.md.',
  );
}
const url = new URL(origin);
if (
  url.origin !== origin ||
  (url.protocol !== 'https:' &&
    !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))
) {
  throw new Error('APP_ORIGIN must be an exact HTTPS origin (HTTP is allowed only on loopback).');
}
export const appOrigin = origin;
export const auth = betterAuth({
  appName: 'TaxflowOS',
  baseURL: appOrigin,
  secret,
  trustedOrigins: [appOrigin],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user: users, session: sessions, account: accounts, verification: verifications },
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  plugins: [
    anonymous({
      generateName: () => 'Demo guest',
      emailDomainName: 'demo.invalid',
      // Demo data must not be deleted or transferred implicitly on account sign-in.
      disableDeleteAnonymousUser: true,
    }),
  ],
  // Email is a login identifier, not proof of address ownership or membership.
  account: { accountLinking: { enabled: false } },
  session: { cookieCache: { enabled: false } },
  advanced: {
    useSecureCookies: url.protocol === 'https:',
    defaultCookieAttributes: { httpOnly: true, sameSite: 'lax' },
  },
  rateLimit: { enabled: true, window: 60, max: 100 },
});
