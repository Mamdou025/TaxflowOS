type AuthProvider = "email" | "github" | "google" | "vercel";

type EnabledProviders = {
  email: boolean;
  github: boolean;
  google: boolean;
  vercel: boolean;
};

interface WindowWithEnv extends Window {
  ENV?: {
    NEXT_PUBLIC_AUTH_PROVIDERS?: string;
    NEXT_PUBLIC_GITHUB_CLIENT_ID?: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
    NEXT_PUBLIC_VERCEL_CLIENT_ID?: string;
  };
}

/**
 * Read a public env var in the browser. This module runs in the Vite client
 * bundle, where the Next-era `process` global does not exist — touching it
 * bare throws a ReferenceError and takes the whole page down through the app
 * error boundary. Prefer Vite's `import.meta.env`, then the server-injected
 * `window.ENV`, and only then a `process` that actually exists (SSR/tests).
 */
function readEnv(key: keyof NonNullable<WindowWithEnv["ENV"]>): string | undefined {
  const viteEnv = import.meta.env as Record<string, string | undefined>;
  const fromVite = viteEnv[key] ?? viteEnv[`VITE_${key}`];
  if (fromVite) return fromVite;

  if (typeof window !== "undefined") {
    const fromWindow = (window as WindowWithEnv).ENV?.[key];
    if (fromWindow) return fromWindow;
  }

  if (typeof process !== "undefined" && process.env) return process.env[key];
  return undefined;
}

/**
 * Get the list of enabled authentication providers from environment variables
 * Defaults to email only if not specified
 */
export function getEnabledAuthProviders(): EnabledProviders {
  const providersEnv = readEnv("NEXT_PUBLIC_AUTH_PROVIDERS") || "email";

  const enabledProviders = providersEnv
    .split(",")
    .map((p: string) => p.trim().toLowerCase());

  return {
    email: enabledProviders.includes("email"),
    github:
      enabledProviders.includes("github") &&
      !!readEnv("NEXT_PUBLIC_GITHUB_CLIENT_ID"),
    google:
      enabledProviders.includes("google") &&
      !!readEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID"),
    vercel:
      enabledProviders.includes("vercel") &&
      !!readEnv("NEXT_PUBLIC_VERCEL_CLIENT_ID"),
  };
}

/**
 * Get array of enabled provider names
 */
export function getEnabledProvidersList(): AuthProvider[] {
  const providers = getEnabledAuthProviders();
  return Object.entries(providers)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name as AuthProvider);
}

/**
 * Get the single enabled provider, or null if there are multiple
 */
export function getSingleProvider(): AuthProvider | null {
  const providersList = getEnabledProvidersList();
  return providersList.length === 1 ? providersList[0] : null;
}
