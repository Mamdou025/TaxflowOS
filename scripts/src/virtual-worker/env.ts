/**
 * Minimal `.env.local` loader for the virtual worker.
 *
 * Reads KEY=VALUE lines from the repo-root `.env.local` (then `.env`) and copies
 * any that aren't already set in process.env. No dependency on `dotenv` — the
 * worker is a standalone script and we don't want to touch the app's env plumbing.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export function loadEnvLocal(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  // scripts/src/virtual-worker -> repo root is three levels up.
  const root = resolve(here, '..', '..', '..');
  for (const name of ['.env.local', '.env']) {
    const file = resolve(root, name);
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = val;
    }
  }
}
