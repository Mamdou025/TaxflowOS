import { useEffect } from 'react';
import { accountLinkingPath } from './api';
import { ConsentPage } from './consent-page';
import { ChatGPTGrantsPanel } from './grants-panel';

/** Account-only routes deliberately do not mount workspace stores or the assistant runtime. */
export default function AccountLinkingPage() {
  useEffect(() => {
    const sessionChanged = (event: StorageEvent) => {
      if (event.key === 'taxflow:session-changed') window.location.reload();
    };
    window.addEventListener('storage', sessionChanged);
    return () => window.removeEventListener('storage', sessionChanged);
  }, []);
  // Consent must be a top-level, visible account action. The separate workflow viewer
  // remains embeddable; this guard applies only to account-linking routes.
  if (window.self !== window.top)
    return (
      <main role="alert" className="p-6">
        Open InScope account linking in its own browser page to continue.
      </main>
    );
  const consent = window.location.pathname.replace(/\/$/, '') === accountLinkingPath('authorize');
  return (
    <div className="h-dvh overflow-y-auto bg-background p-6 text-foreground">
      {consent ? (
        <ConsentPage />
      ) : (
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-semibold">Manage ChatGPT access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access belongs to your account. You can revoke it here even when you have no active
            workspace.
          </p>
          <ChatGPTGrantsPanel standalone />
          <a className="mt-5 inline-block text-sm underline" href={import.meta.env.BASE_URL}>
            Back to InScope
          </a>
        </div>
      )}
    </div>
  );
}
