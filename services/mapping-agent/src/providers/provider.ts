import type { WorkflowRulePack } from "../rule-pack";
import type { ExtractedFact, MappingDecision } from "../types";

export type MappingProviderContext = {
  facts: ExtractedFact[];
  rulePack: WorkflowRulePack;
  workflow: string;
};

export type MappingProvider = {
  readonly id: string;
  proposeMappings(context: MappingProviderContext): Promise<MappingDecision[]>;
};

export type ExternalProviderAdapter = {
  id: string;
  map: (context: MappingProviderContext) => Promise<MappingDecision[]>;
};

export class AdapterMappingProvider implements MappingProvider {
  readonly id: string;
  private readonly adapter: ExternalProviderAdapter;

  constructor(adapter: ExternalProviderAdapter) {
    this.adapter = adapter;
    this.id = adapter.id;
  }

  proposeMappings(context: MappingProviderContext) {
    return this.adapter.map(context);
  }
}
