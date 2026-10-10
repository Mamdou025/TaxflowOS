import { useCopilotAction } from '@copilotkit/react-core';
import { useStore } from 'jotai';
import type { SourceRetrievalResult } from '@workspace/source-core';
import { apiFetch } from '@/platform/auth/api-fetch';
import { activeRunAtom, runEditsAtom, uploadedRowsAtom } from '@/shared/stores/workspace-store';
import { chatContextAtom, loadedChatSourcesAtom } from '../runtime/chat/chat-context-store';
import {
  createTemplateIntel,
  listIntel,
  pickIntel,
  worksheetIntelRegistryAtom,
} from '@/features/worksheets/intel';
import {
  WORKFLOW_CONFIGS,
  type TemplateConfig,
} from '@/shared/workflow-engine/runtime/workflow-runs';

export function useWorkspaceRetrievalTools() {
  const store = useStore();
  const unavailableWorksheet = (worksheet?: string) => ({
    error: worksheet
      ? 'No worksheet or workflow matches "' + worksheet + '".'
      : 'Which one? No worksheet is open and several workflows exist — pass worksheet (a workflow id).',
    openWorksheets: listIntel(store.get(worksheetIntelRegistryAtom)),
    workflows: Object.entries(WORKFLOW_CONFIGS).map(([id, config]) => ({
      id,
      name: config.name,
    })),
  });
  const resolveIntel = (worksheet?: string) => {
    const live = pickIntel(store.get(worksheetIntelRegistryAtom), worksheet);
    if (live) return live;
    const uploaded = store.get(uploadedRowsAtom);
    const edits = store.get(runEditsAtom);
    const activeId = store.get(activeRunAtom)?.workflowId;
    const hasData = (config: TemplateConfig) => {
      const source = uploaded[config.id];
      const edit = edits[config.id];
      return (
        Boolean(source?.rows?.length) ||
        Boolean(edit && (Object.keys(edit.inputs).length || Object.keys(edit.overrides).length)) ||
        config.id === activeId
      );
    };
    let config: TemplateConfig | null = null;
    if (worksheet) {
      const query = worksheet.toLowerCase();
      config =
        WORKFLOW_CONFIGS[worksheet.replace(/^pf-/, '')] ??
        Object.values(WORKFLOW_CONFIGS).find((item) => item.name.toLowerCase().includes(query)) ??
        null;
    }
    if (worksheet && !config) return null;
    if (!config) {
      const withData = Object.values(WORKFLOW_CONFIGS).filter(hasData);
      config =
        withData.length === 1
          ? withData[0]
          : activeId
            ? (WORKFLOW_CONFIGS[activeId] ?? null)
            : null;
    }
    if (!config) return null;
    const source = uploaded[config.id];
    const edit = edits[config.id];
    return createTemplateIntel(config, {
      rows: source?.rows,
      inputs: edit?.inputs,
      overrides: edit?.overrides,
    });
  };

  const worksheetParameter = {
    name: 'worksheet',
    type: 'string' as const,
    description: 'which open worksheet id (optional if only one is open)',
    required: false,
  };
  useCopilotAction({
    name: 'explainWorksheetLine',
    description:
      'Explain one worksheet line with its value, formula, operands and mapped source rows. query is a line code or description; worksheet selects a workflow when needed.',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'a line code or description',
        required: true,
      },
      worksheetParameter,
    ],
    handler: async ({ query, worksheet }: { query: string; worksheet?: string }) => {
      const intel = resolveIntel(worksheet);
      return intel ? intel.explainLine(query) : unavailableWorksheet(worksheet);
    },
  });
  useCopilotAction({
    name: 'whyWorksheetValue',
    description:
      'Trace how a worksheet figure was derived through formulas, classified buckets and inputs.',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'the line code or summary name to trace',
        required: true,
      },
      worksheetParameter,
    ],
    handler: async ({ query, worksheet }: { query: string; worksheet?: string }) => {
      const intel = resolveIntel(worksheet);
      return intel ? intel.why(query) : unavailableWorksheet(worksheet);
    },
  });
  useCopilotAction({
    name: 'searchWorksheet',
    description: 'Search worksheet lines and formulas by concept.',
    parameters: [
      { name: 'query', type: 'string', description: 'the concept to find', required: true },
      worksheetParameter,
    ],
    handler: async ({ query, worksheet }: { query: string; worksheet?: string }) => {
      const intel = resolveIntel(worksheet);
      return intel ? intel.search(query) : unavailableWorksheet(worksheet);
    },
  });
  useCopilotAction({
    name: 'searchCompanyDocuments',
    description:
      'Search only the saved sources explicitly selected for this chat, with exact revision citations. Company labels do not select documents.',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'what to look for in the documents',
        required: true,
      },
    ],
    handler: async ({ query }: { query: string }) => {
      const selectedSources = store
        .get(chatContextAtom)
        .sources.filter(
          (source) =>
            source.sourceId && store.get(loadedChatSourcesAtom)[source.id]?.status === 'ready',
        );
      if (!selectedSources.length)
        return {
          passages: [],
          note: 'No saved sources are selected and available in this chat. Add a source explicitly; local text is already in the chat context.',
        };
      try {
        const response = await apiFetch('/api/documents/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            k: 6,
            selectedSourceIds: selectedSources.map((source) => source.sourceId),
            policy: 'selected-only',
          }),
        });
        const result = (await response.json()) as SourceRetrievalResult;
        if (!response.ok || result.status === 'unavailable') {
          return {
            passages: [],
            limitations: result.limitations,
            note: result.limitations[0]?.message ?? 'Document search is unavailable.',
          };
        }
        if (result.status !== 'ok' || !result.passages.length) {
          return {
            passages: [],
            limitations: result.limitations,
            note:
              result.limitations[0]?.message ??
              'No relevant passages found in the stored documents.',
          };
        }
        return {
          passages: result.passages
            .filter((passage) =>
              selectedSources.some(
                (source) =>
                  source.sourceId === passage.evidence.source.sourceId &&
                  source.sourceRevision === passage.evidence.source.revision,
              ),
            )
            .map((passage) => ({
              source: passage.evidence.source.label,
              sourceId: passage.evidence.source.sourceId,
              revision: passage.evidence.source.revision,
              citationId: passage.evidence.citationId,
              selection: passage.evidence.selection,
              chunkIndex: passage.evidence.locator.chunkIndex,
              similarity: Number(passage.evidence.similarity.toFixed(3)),
              excerpt: passage.content,
            })),
          limitations: result.limitations,
          instruction:
            'Answer using these passages and cite the supplied citationId and source file for each fact. If they do not answer the question, say so plainly.',
        };
      } catch {
        return { passages: [], note: 'Document search failed.' };
      }
    },
  });
}
