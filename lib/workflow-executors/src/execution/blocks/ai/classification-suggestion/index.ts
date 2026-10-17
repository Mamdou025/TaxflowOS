import type { RegisteredToolModule } from '../../../runtime/types';
import { classificationSuggestionDefinition } from './definition';
import { runClassificationSuggestion } from './run';

export const classificationSuggestionToolModule: RegisteredToolModule = {
  definition: classificationSuggestionDefinition,
  run: runClassificationSuggestion,
};
