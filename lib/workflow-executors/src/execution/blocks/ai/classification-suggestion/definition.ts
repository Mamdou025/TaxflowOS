import type { ToolDefinition } from '../../../runtime/types';
import { DEFAULT_CONFIDENCE_THRESHOLD, DEFAULT_MODEL, DEFAULT_SYSTEM_PROMPT } from './schema';

export const classificationSuggestionDefinition: ToolDefinition = {
  defaultConfig: {
    confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
    model: DEFAULT_MODEL,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    toolId: 'ai.classification_suggestion',
  },
  description:
    'Proposes category mappings for rows a Keyword Mapper could not confidently classify, using a model-backed, editable system prompt. Non-authoritative until a reviewer accepts the proposal.',
  displayName: 'AI Mapping Suggestion',
  family: 'AI / Agent',
  // NOTE: these input role ids are deliberately named to match the upstream Keyword
  // Mapper's OWN output role ids ('unmatched_rows', 'low_confidence_rows'), not a
  // generic name like "rows". The engine's backend-adapter routes a connected
  // block's outputs into inputsByRole BY THE UPSTREAM'S OUTPUT ROLE NAME, not by the
  // edge's declared targetInputRole — a role named differently from what feeds it
  // will never see the data despite a valid-looking edge. See
  // lib/workflow-executors/src/tools/backend-adapter.ts's pushBackendOutputsAsInputs.
  inputRoles: [
    {
      acceptedFamilies: ['Logic'],
      acceptedOutputTypes: ['unmatched_rows'],
      allowMultiple: true,
      description: 'Rows a Keyword Mapper could not match to any keyword rule.',
      id: 'unmatched_rows',
      label: 'Unmatched rows',
      required: false,
    },
    {
      acceptedFamilies: ['Logic'],
      acceptedOutputTypes: ['low_confidence_rows'],
      allowMultiple: true,
      description: 'Rows a Keyword Mapper matched below its configured confidence threshold.',
      id: 'low_confidence_rows',
      label: 'Low-confidence rows',
      required: false,
    },
    {
      acceptedFamilies: ['Source'],
      acceptedSourceKinds: ['keyword_rules'],
      allowMultiple: true,
      description:
        'The Keyword Rulebook, given as reference context — this block never matches rows against it mechanically.',
      id: 'keyword_rules',
      label: 'Keyword rules (reference)',
      required: false,
    },
  ],
  outputRoles: [
    {
      canRouteToFamilies: ['Review / Validation', 'Logic', 'Output'],
      description:
        'Per-row category suggestions with confidence and rationale, plus acceptance state.',
      id: 'suggestions',
      label: 'Suggestions',
      outputKey: 'suggestions',
      outputType: 'ai_mapping_suggestions',
      samplePreview: 'AI suggestions (unaccepted)',
    },
  ],
  runMode: 'local_mock',
  subtype: 'AI Mapping Suggestion',
  toolGroup: 'routing',
  toolId: 'ai.classification_suggestion',
};
