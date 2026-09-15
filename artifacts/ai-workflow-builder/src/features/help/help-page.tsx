import { CircleHelp, Database, MessageSquare, PlugZap, Workflow } from 'lucide-react';
import { NEU } from '@/components/neumorphic-sidebar';
import { usePageMenu } from '@/shared/stores/page-menu-store';

const paths = [
  {
    title: 'Start in Chat',
    text: 'Ask about sources, describe a workflow, or request a run. Protected actions show a review card first.',
    Icon: MessageSquare,
  },
  {
    title: 'Build and inspect Workflows',
    text: 'Open drafts, saved versions, results and cross-workflow run history from one area.',
    Icon: Workflow,
  },
  {
    title: 'Manage Sources',
    text: 'Upload documents, inspect processing state and choose what the assistant may retrieve.',
    Icon: Database,
  },
  {
    title: 'Configure Connections',
    text: 'Add and test provider credentials used by supported workflow blocks.',
    Icon: PlugZap,
  },
  {
    title: 'Run after closing the browser',
    text: 'Save and synchronize a workflow version, then start a durable run. All installed tools use the inputs and source responses saved in that version. Return to Workflows → Run history for results.',
    Icon: Workflow,
  },
  {
    title: 'Understand workpaper scope',
    text: 'Workpapers calculate from your supplied applicability, rates and adjustments. The T2 bridge reconciles taxable income; it does not prepare or file a complete return. Review figures and evidence before using them.',
    Icon: CircleHelp,
  },
];

export default function HelpPage() {
  usePageMenu('help', {
    left: [{ kind: 'label', id: 'help-title', text: 'Help', strong: true }],
  });
  return (
    <div className="h-full overflow-auto p-6" style={{ background: NEU.bg }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-start gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.accent }}
          >
            <CircleHelp size={19} />
          </span>
          <div>
            <h1 className="m-0 text-lg font-bold" style={{ color: NEU.text }}>
              Help
            </h1>
            <p className="mt-1 text-sm" style={{ color: NEU.muted }}>
              The main paths through this workspace.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {paths.map(({ title, text, Icon }) => (
            <section
              key={title}
              className="rounded-2xl p-4"
              style={{ background: NEU.surface, boxShadow: NEU.shadowSm }}
            >
              <Icon size={17} style={{ color: NEU.accent }} />
              <h2 className="mt-3 text-sm font-bold" style={{ color: NEU.text }}>
                {title}
              </h2>
              <p className="mt-1 text-xs leading-5" style={{ color: NEU.muted }}>
                {text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
