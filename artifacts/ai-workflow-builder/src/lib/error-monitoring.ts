/**
 * Error monitoring abstraction backed by Sentry.
 *
 * Initialise once in main.tsx by calling `initErrorMonitoring()`.
 * Both AppErrorBoundary and RouteErrorBoundary call `captureRenderError()`
 * so every unhandled render crash is forwarded to the configured Sentry project.
 *
 * To connect to a real Sentry project, set the environment variable:
 *   VITE_SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
 *
 * Without a DSN the SDK is initialised in "dry-run" mode — structured
 * console.error logs are still emitted, but nothing is sent over the network.
 */

import * as Sentry from '@sentry/react';

export interface RenderErrorEvent {
  /** 'ChunkLoadError' | 'RenderError' */
  type: string;
  /** true when a chunk-reload guard was already set before this crash */
  guardTriggered: boolean;
  message: string;
  stack: string | undefined;
  componentStack: string | null | undefined;
}

let _initialised = false;

/** Call once in the app entry point (main.tsx). Idempotent. */
export function initErrorMonitoring(): void {
  if (_initialised) return;
  _initialised = true;

  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

  Sentry.init({
    // When no DSN is set Sentry no-ops all capture calls; structured
    // console.error logs in the boundaries still fire regardless.
    dsn: dsn || undefined,
    environment: import.meta.env.MODE,
    // Capture 100 % of sessions in development; tune for production.
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Source maps are uploaded separately; attach release via CI env var.
    release: (import.meta.env.VITE_RELEASE as string | undefined) ?? undefined,
  });
}

/**
 * Forward a structured render-error event to Sentry.
 * Always logs to console regardless of whether a DSN is configured.
 */
export function captureRenderError(
  error: Error,
  event: RenderErrorEvent,
): void {
  Sentry.withScope((scope) => {
    scope.setTag('error.type', event.type);
    scope.setExtra('guardTriggered', event.guardTriggered);
    scope.setExtra('componentStack', event.componentStack ?? '(none)');
    Sentry.captureException(error);
  });
}
