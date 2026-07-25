import { Suspense, lazy, type ReactNode, Component, type ErrorInfo } from 'react';

/** Catch render errors from lazy-loaded pages and show them instead of a blank spinner */
class RouteErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(e: Error) { return { error: e }; }
  componentDidCatch(e: Error, info: ErrorInfo) { console.error('[RouteErrorBoundary]', e, info); }
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
const BuilderPage = lazy(() =>
  import('@/app/builder/page').then((m) => ({ default: m.default })),
);
const AgentPage = lazy(() =>
  import('@/app/agent/page').then((m) => ({ default: m.default })),
);
const AgentLabPage = lazy(() =>
  import('@/app/agent-lab/page').then((m) => ({ default: m.default })),
);
const DashboardPage = lazy(() =>
  import('@/app/dashboard/page').then((m) => ({ default: m.default })),
);
const DocumentsPage = lazy(() =>
  import('@/app/documents/page').then((m) => ({ default: m.default })),
);
const ViewerPage = lazy(() =>
  import('@/app/viewer/page').then((m) => ({ default: m.default })),
);
const WorksheetsPage = lazy(() =>
  import('@/app/worksheets/page').then((m) => ({ default: m.default })),
);
const FapiPage = lazy(() =>
  import('@/app/fapi/page').then((m) => ({ default: m.default })),
);
const T1134Page = lazy(() =>
  import('@/app/t1134/page').then((m) => ({ default: m.default })),
);
const SurplusPage = lazy(() =>
  import('@/app/surplus/page').then((m) => ({ default: m.default })),
);
const BuOverviewPage = lazy(() =>
  import('@/app/bu-overview/page').then((m) => ({ default: m.default })),
);
const GenuiLabPage = lazy(() =>
  import('@/app/genui-lab/page').then((m) => ({ default: m.default })),
);
const ClientPage = lazy(() =>
  import('@/app/client/[id]/page').then((m) => ({ default: m.default })),
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

      {/* Workflow builder */}
      <Route path="/builder" component={() => <PageLoader><BuilderPage /></PageLoader>} />
      <Route path="/workflows" component={() => <PageLoader><WorkflowsPage /></PageLoader>} />
      <Route path="/workflows/:workflowId" component={() => <PageLoader><WorkflowPage /></PageLoader>} />
      <Route path="/w/:workflowId" component={() => <PageLoader><WPage /></PageLoader>} />
      <Route path="/run/:workflowId" component={() => <PageLoader><RunPage /></PageLoader>} />
      <Route path="/workflows-hub" component={() => <PageLoader><WorkflowsHubPage /></PageLoader>} />

      {/* Agent surfaces */}
      <Route path="/agent" component={() => <PageLoader><AgentPage /></PageLoader>} />
      <Route path="/agent-lab" component={() => <PageLoader><AgentLabPage /></PageLoader>} />

      {/* Dashboard / analytics */}
      <Route path="/dashboard" component={() => <PageLoader><DashboardPage /></PageLoader>} />
      <Route path="/bu-overview" component={() => <PageLoader><BuOverviewPage /></PageLoader>} />
      <Route path="/t1134" component={() => <PageLoader><T1134Page /></PageLoader>} />
      <Route path="/surplus" component={() => <PageLoader><SurplusPage /></PageLoader>} />
      <Route path="/fapi" component={() => <PageLoader><FapiPage /></PageLoader>} />

      {/* Documents & viewer */}
      <Route path="/documents" component={() => <PageLoader><DocumentsPage /></PageLoader>} />
      <Route path="/viewer" component={() => <PageLoader><ViewerPage /></PageLoader>} />

      {/* Worksheets */}
      <Route path="/worksheets" component={() => <PageLoader><WorksheetsPage /></PageLoader>} />
      <Route path="/client/:id" component={() => <PageLoader><ClientPage /></PageLoader>} />

      {/* GenUI Lab */}
      <Route path="/genui-lab" component={() => <PageLoader><GenuiLabPage /></PageLoader>} />

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
                <Suspense fallback={null}>
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
  );
}
