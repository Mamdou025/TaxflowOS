import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkflowViewer } from './workflow-viewer';
import '../../index.css';
import './viewer.css';

class ViewerErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="p-6">
        <h1 className="font-semibold">Workflow viewer unavailable</h1>
        <p role="alert">
          The saved workflow could not be displayed. Reopen its exact version or run from chat.
        </p>
      </main>
    ) : (
      this.props.children
    );
  }
}

createRoot(document.getElementById('root')!).render(
  <ViewerErrorBoundary>
    <WorkflowViewer />
  </ViewerErrorBoundary>,
);
