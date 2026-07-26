
import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional label shown in the fallback (e.g. "Executive Overview") */
  label?: string;
}

interface State {
  error: Error | null;
}

/**
 * Error boundary for legacy worksheet pages.
 * Shows a structured "no data / something went wrong" card instead of a blank
 * white area when the wrapped component throws during render or data loading.
 */
export class WorksheetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to console so dev-tools / Sentry can pick it up
    console.error('[WorksheetErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, label } = this.props;

    if (error) {
      const title = label ? `${label} — data unavailable` : 'Data unavailable';
      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 320,
            padding: '48px 32px',
            textAlign: 'center',
            color: 'var(--sx-muted, #6b7280)',
            gap: 16,
          }}
        >
          <AlertTriangle size={40} strokeWidth={1.5} style={{ color: 'var(--sx-warn, #f59e0b)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: 'var(--sx-text, #111827)' }}>
              {title}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', maxWidth: 420 }}>
              This worksheet couldn't load its data. Check that the underlying data source is connected, then try again.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre
                style={{
                  marginTop: 8,
                  padding: '8px 12px',
                  background: 'var(--sx-surface, #f3f4f6)',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  overflowX: 'auto',
                  maxWidth: 480,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {error.message}
              </pre>
            )}
          </div>
          <button
            onClick={this.handleRetry}
            style={{
              marginTop: 8,
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid var(--sx-border, #d1d5db)',
              background: 'var(--sx-card, #ffffff)',
              color: 'var(--sx-text, #111827)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return children;
  }
}
