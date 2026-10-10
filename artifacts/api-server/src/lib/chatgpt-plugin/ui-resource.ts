import { open } from 'node:fs/promises';
import { isAbsolute } from 'node:path';

export const MAX_UI_RESOURCE_BYTES = 16 * 1024 * 1024;
const loaded = new Map<string, { html: string }>();

/** Server configuration only. Successful immutable assets are cached until restart. */
export async function loadChatgptPluginUi(
  configuredPath: string | undefined,
  warn: (message: string) => void,
): Promise<{ html: string } | undefined> {
  if (!configuredPath) return undefined;
  const cached = loaded.get(configuredPath);
  if (cached) return cached;
  const unavailable = () => {
    // Never log filesystem paths, HTML or filesystem error details.
    warn(
      'ChatGPT workflow viewer is unavailable: configure an absolute path to a valid HTML asset of at most 16 MiB. Data tools remain available.',
    );
    return undefined;
  };
  if (!isAbsolute(configuredPath)) return unavailable();
  try {
    const file = await open(configuredPath, 'r');
    try {
      const stat = await file.stat();
      if (!stat.isFile() || stat.size < 1 || stat.size > MAX_UI_RESOURCE_BYTES)
        return unavailable();
      // A bounded read remains bounded even if the asset grows after stat().
      const buffer = Buffer.alloc(stat.size + 1);
      let read = 0;
      while (read < buffer.length) {
        const chunk = await file.read(buffer, read, buffer.length - read, null);
        if (chunk.bytesRead === 0) break;
        read += chunk.bytesRead;
      }
      if (read !== stat.size) return unavailable();
      const html = buffer.subarray(0, read).toString('utf8');
      if (!/<html(?:\s|>)/i.test(html)) return unavailable();
      const ui = { html };
      loaded.set(configuredPath, ui);
      return ui;
    } finally {
      await file.close();
    }
  } catch {
    return unavailable();
  }
}
