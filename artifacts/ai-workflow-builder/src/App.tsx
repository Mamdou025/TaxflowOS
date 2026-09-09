import { Suspense, lazy, type ReactNode, Component, type ErrorInfo } from 'react';
import { captureRenderError } from '@/lib/error-monitoring';

/** Full-page spinner shown while the app shell is hydrating */
function AppSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      width: '100vw',
      background: '#f5f5f5',
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid #d1d5db',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const CHUNK_RELOAD_KEY = 'inscope_chunk_reload_attempted';

function isChunkLoadError(e: Error): boolean {
  // Vite / webpack both surface these patterns
  return (
    e.name === 'ChunkLoadError' ||
    /loading chunk/i.test(e.message) ||
    /failed to fetch dynamically imported module/i.test(e.message) ||
    /error loading dynamically imported module/i.test(e.message) ||
    /importing a module script failed/i.test(e.message)
  );
}

/** Top-level boundary — catches any crash in providers or the shell itself */
class AppErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null; chunkReloading: boolean; isChunkError: boolean }
> {
  state = { error: null as Error | null, chunkReloading: false, isChunkError: false };

  static getDerivedStateFromError(e: Error) {
    const chunk = isChunkLoadError(e);
    // If it's a chunk error and we haven't reloaded yet, trigger a reload.
    if (chunk && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
      // Defer the reload so React can finish rendering the boundary.
      setTimeout(() => window.location.reload(), 0);
      return { error: e, chunkReloading: true, isChunkError: true };
    }
    return { error: e, chunkReloading: false, isChunkError: chunk };
  }

  componentDidCatch(e: Error, info: ErrorInfo) {
    const chunk = isChunkLoadError(e);
    const guardWasSet = !!sessionStorage.getItem(CHUNK_RELOAD_KEY);
    const event = {
      type: chunk ? 'ChunkLoadError' : 'RenderError',
      guardTriggered: chunk && guardWasSet,
      message: e.message,
      stack: e.stack,
      componentStack: info.componentStack,
    };
    // Structured log that production log aggregators (e.g. Datadog, Sentry
    // log drain, CloudWatch) can parse and alert on.
    console.error('[AppErrorBoundary]', event);
    // Forward to the error-monitoring service (Sentry).
    captureRenderError(e, event);
  }

  render() {
    const { error, chunkReloading, isChunkError } = this.state;

    if (error) {
      // Show a brief "updating" message while the reload fires.
      if (chunkReloading) {
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            gap: 12,
            fontFamily: 'system-ui, sans-serif',
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: '3px solid #d1d5db',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              New version available — reloading…
            </p>
          </div>
        );
      }

      // Guard-triggered path: a chunk error after an auto-reload already fired.
      // Explain what happened and guide the user to do a hard refresh.
      if (isChunkError) {
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            gap: 16,
            fontFamily: 'system-ui, sans-serif',
            padding: 24,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32 }}>🔄</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>The page was updated</h1>
            <p style={{ margin: 0, color: '#6b7280', maxWidth: 440 }}>
              A new version of the app was deployed while you were using it.
              Please do a <strong>hard refresh</strong> to load the latest files.
            </p>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: 13 }}>
              Windows / Linux: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Mac: <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem(CHUNK_RELOAD_KEY);
                window.location.reload();
              }}
              style={{
                padding: '8px 20px',
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Reload
            </button>
            <details style={{ marginTop: 8, color: '#9ca3af', fontSize: 12, maxWidth: 600 }}>
              <summary style={{ cursor: 'pointer' }}>Error details</summary>
              <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', marginTop: 8 }}>
                {String(error)}{'\n'}{error.stack}
              </pre>
            </details>
          </div>
        );
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          gap: 16,
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ margin: 0, color: '#6b7280', maxWidth: 400 }}>
            The app failed to start. Try reloading — if the problem persists, contact support.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem(CHUNK_RELOAD_KEY);
              window.location.reload();
            }}
            style={{
              padding: '8px 20px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Reload
          </button>
          <details style={{ marginTop: 8, color: '#9ca3af', fontSize: 12, maxWidth: 600 }}>
            <summary style={{ cursor: 'pointer' }}>Error details</summary>
            <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', marginTop: 8 }}>
              {String(error)}{'\n'}{error.stack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Catch render errors from lazy-loaded pages and show them instead of a blank spinner */
class RouteErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(e: Error) {
    // ChunkLoadErrors should be handled by AppErrorBoundary, which can trigger
    // an auto-reload after a deploy.  Re-throwing here bubbles the error up to
    // the next boundary (AppErrorBoundary) rather than showing the raw error text.
    if (isChunkLoadError(e)) throw e;
    return { error: e };
  }
  componentDidCatch(e: Error, info: ErrorInfo) {
    console.error('[RouteErrorBoundary]', e, info);
    // Forward to the error-monitoring service (Sentry).
    captureRenderError(e, {
      type: 'RenderError',
      guardTriggered: false,
      message: e.message,
      stack: e.stack,
      componentStack: info.componentStack,
    });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: 'red', fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxWidth: 900 }}>
          <strong>Route render error:</strong>{'\n'}{String(this.state.error)}{'\n'}{(this.state.error as Error).stack}
        </div>
      );
    }
    return this.props.children;
  }
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/platform/auth/ui/provider';
import { OverlayProvider } from '@/shared/ui/overlays/overlay-provider';
import { GitHubStarsLoader } from '@/components/github-stars-loader';
import { AppShell } from '@/components/app-shell';
import { GlobalModals } from '@/components/global-modals';
import { Toaster } from '@/shared/ui/sonner';

// Lazy-load all page components (they were Next.js page.tsx files)
const ChatWorkspacePage = lazy(() =>
  import('@/features/assistant/workspace/copilot-workspace-panel').then((m) => ({ default: m.ChatWorkspace })),
);
const WorkflowsPage = lazy(() =>
  import('@/app/workflows/page').then((m) => ({ default: m.default })),
);
const WorkflowPage = lazy(() =>
  import('@/app/workflows/[workflowId]/page').then((m) => ({ default: m.default })),
);
const AgentLabPage = lazy(() =>
  import('@/app/agent-lab/page').then((m) => ({ default: m.default })),
);
const DocumentsPage = lazy(() =>
  import('@/app/documents/page').then((m) => ({ default: m.default })),
);
const WorkflowsHubPage = lazy(() =>
  import('@/app/workflows-hub/page').then((m) => ({ default: m.default })),
);
const RunPage = lazy(() =>
  import('@/app/run/[workflowId]/page').then((m) => ({ default: m.default })),
);
const WPage = lazy(() =>
  import('@/app/w/[workflowId]/page').then((m) => ({ default: m.default })),
);

function PageLoader({ children }: { children: ReactNode }) {
  return (
    <RouteErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function Router() {
  return (
    <Switch>
      {/* Main/home — the chat/assistant workspace */}
      <Route path="/" component={() => <PageLoader><ChatWorkspacePage /></PageLoader>} />
      {/* Redirect pages that were folded into "/" */}
      <Route path="/home"><Redirect to="/" /></Route>
      <Route path="/chat"><Redirect to="/" /></Route>

      {/* Workflow builder + workflows surface */}
      <Route path="/workflows" component={() => <PageLoader><WorkflowsPage /></PageLoader>} />
      <Route path="/workflows/:workflowId" component={() => <PageLoader><WorkflowPage /></PageLoader>} />
      <Route path="/w/:workflowId" component={() => <PageLoader><WPage /></PageLoader>} />
      <Route path="/run/:workflowId" component={() => <PageLoader><RunPage /></PageLoader>} />
      <Route path="/workflows-hub" component={() => <PageLoader><WorkflowsHubPage /></PageLoader>} />

      {/* Agent lab */}
      <Route path="/agent-lab" component={() => <PageLoader><AgentLabPage /></PageLoader>} />

      {/* Documents */}
      <Route path="/documents" component={() => <PageLoader><DocumentsPage /></PageLoader>} />

      {/* 404 */}
      <Route>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">404 — Page not found</h1>
            <a href="/" className="mt-4 text-primary underline block">Go home</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem={false}
        >
          <Provider>
            <AuthProvider>
              <OverlayProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                  <Suspense fallback={<AppSpinner />}>
                    <GitHubStarsLoader>
                      <AppShell>
                        <Router />
                      </AppShell>
                    </GitHubStarsLoader>
                  </Suspense>
                  <Toaster />
                  <GlobalModals />
                </WouterRouter>
              </OverlayProvider>
            </AuthProvider>
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
