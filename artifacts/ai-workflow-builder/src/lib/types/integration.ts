// Integration type identifier used throughout the workflow builder.
// The string union covers all first-party integrations; `& string` allows
// extension without losing autocomplete.
export type IntegrationType =
  | 'google'
  | 'google-drive'
  | 'google-gmail'
  | 'github'
  | 'slack'
  | 'notion'
  | 'linear'
  | 'jira'
  | 'airtable'
  | 'salesforce'
  | 'hubspot'
  | 'stripe'
  | 'openai'
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

// Configuration blob stored per-integration in the workflow builder.
export interface IntegrationConfig {
  credentials?: Record<string, string>;
  [key: string]: unknown;
}
