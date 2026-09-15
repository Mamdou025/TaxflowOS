import type { IntegrationType } from '@/lib/types/integration';
import { type WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { findActionById, flattenConfigFields, getIntegrationLabels } from '@/plugins';

type MissingIntegrationInfo = {
  integrationType: IntegrationType;
  integrationLabel: string;
  nodeNames: string[];
};

// Built-in actions that require integrations but aren't in the plugin registry
const BUILTIN_ACTION_INTEGRATIONS: Record<string, IntegrationType> = {
  'Database Query': 'database',
};

// Labels for built-in integration types that don't have plugins
const BUILTIN_INTEGRATION_LABELS: Record<string, string> = {
  database: 'Database',
};

// Type for broken template reference info
type BrokenTemplateReferenceInfo = {
  nodeId: string;
  nodeLabel: string;
  brokenReferences: Array<{
    fieldKey: string;
    fieldLabel: string;
    referencedNodeId: string;
    displayText: string;
  }>;
};

// Extract template variables from a string and check if they reference existing nodes
function extractTemplateReferences(value: unknown): Array<{ nodeId: string; displayText: string }> {
  if (typeof value !== 'string') {
    return [];
  }

  const pattern = /\{\{@([^:]+):([^}]+)\}\}/g;
  const matches = value.matchAll(pattern);

  return Array.from(matches).map((match) => ({
    nodeId: match[1],
    displayText: match[2],
  }));
}

// Recursively extract all template references from a config object
function extractAllTemplateReferences(
  config: Record<string, unknown>,
  prefix = '',
): Array<{ field: string; nodeId: string; displayText: string }> {
  const results: Array<{ field: string; nodeId: string; displayText: string }> = [];

  for (const [key, value] of Object.entries(config)) {
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      const refs = extractTemplateReferences(value);
      for (const ref of refs) {
        results.push({ field: fieldPath, ...ref });
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      results.push(...extractAllTemplateReferences(value as Record<string, unknown>, fieldPath));
    }
  }

  return results;
}

// Get broken template references for workflow nodes
export function getBrokenTemplateReferences(nodes: WorkflowNode[]): BrokenTemplateReferenceInfo[] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const brokenByNode: BrokenTemplateReferenceInfo[] = [];

  for (const node of nodes) {
    // Skip disabled nodes
    if (node.data.enabled === false) {
      continue;
    }

    const config = node.data.config as Record<string, unknown> | undefined;
    if (!config || typeof config !== 'object') {
      continue;
    }

    const allRefs = extractAllTemplateReferences(config);
    const brokenRefs = allRefs.filter((ref) => !nodeIds.has(ref.nodeId));

    if (brokenRefs.length > 0) {
      // Get action for label lookups
      const actionType = config.actionType as string | undefined;
      const action = actionType ? findActionById(actionType) : undefined;
      const flatFields = action ? flattenConfigFields(action.configFields) : [];

      brokenByNode.push({
        nodeId: node.id,
        nodeLabel: node.data.label || action?.label || 'Unnamed Step',
        brokenReferences: brokenRefs.map((ref) => {
          // Look up human-readable field label
          const configField = flatFields.find((f) => f.key === ref.field);
          return {
            fieldKey: ref.field,
            fieldLabel: configField?.label || ref.field,
            referencedNodeId: ref.nodeId,
            displayText: ref.displayText,
          };
        }),
      });
    }
  }

  return brokenByNode;
}

// Type for missing required fields info
type MissingRequiredFieldInfo = {
  nodeId: string;
  nodeLabel: string;
  missingFields: Array<{
    fieldKey: string;
    fieldLabel: string;
  }>;
};

// Check if a field value is effectively empty
function isFieldEmpty(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  return false;
}

// Check if a conditional field should be shown based on current config
function shouldShowField(
  field: { showWhen?: { field: string; equals: string } },
  config: Record<string, unknown>,
): boolean {
  if (!field.showWhen) {
    return true;
  }
  return config[field.showWhen.field] === field.showWhen.equals;
}

// Get missing required fields for a single node
function getNodeMissingFields(node: WorkflowNode): MissingRequiredFieldInfo | null {
  if (node.data.enabled === false) {
    return null;
  }

  const config = node.data.config as Record<string, unknown> | undefined;
  const actionType = config?.actionType as string | undefined;
  if (!actionType) {
    return null;
  }

  const action = findActionById(actionType);
  if (!action) {
    return null;
  }

  // Flatten grouped fields to check all required fields
  const flatFields = flattenConfigFields(action.configFields);

  const missingFields = flatFields
    .filter(
      (field) =>
        field.required && shouldShowField(field, config || {}) && isFieldEmpty(config?.[field.key]),
    )
    .map((field) => ({
      fieldKey: field.key,
      fieldLabel: field.label,
    }));

  if (missingFields.length === 0) {
    return null;
  }

  return {
    nodeId: node.id,
    nodeLabel: node.data.label || action.label || 'Unnamed Step',
    missingFields,
  };
}

// Get missing required fields for workflow nodes
export function getMissingRequiredFields(nodes: WorkflowNode[]): MissingRequiredFieldInfo[] {
  return nodes
    .map(getNodeMissingFields)
    .filter((result): result is MissingRequiredFieldInfo => result !== null);
}

// Get missing integrations for workflow nodes
// Uses the plugin registry to determine which integrations are required
// Also handles built-in actions that aren't in the plugin registry
export function getMissingIntegrations(
  nodes: WorkflowNode[],
  userIntegrations: Array<{ id: string; type: IntegrationType }>,
): MissingIntegrationInfo[] {
  const userIntegrationTypes = new Set(userIntegrations.map((i) => i.type));
  const userIntegrationIds = new Set(userIntegrations.map((i) => i.id));
  const missingByType = new Map<IntegrationType, string[]>();
  const integrationLabels = getIntegrationLabels();

  for (const node of nodes) {
    // Skip disabled nodes
    if (node.data.enabled === false) {
      continue;
    }

    const actionType = node.data.config?.actionType as string | undefined;
    if (!actionType) {
      continue;
    }

    // Look up the integration type from the plugin registry first
    const action = findActionById(actionType);
    // Fall back to built-in action integrations for actions not in the registry
    const requiredIntegrationType = action?.integration || BUILTIN_ACTION_INTEGRATIONS[actionType];

    if (!requiredIntegrationType) {
      continue;
    }

    // Check if this node has a valid integrationId configured
    // The integration must exist (not just be configured)
    const configuredIntegrationId = node.data.config?.integrationId as string | undefined;
    const hasValidIntegration =
      configuredIntegrationId && userIntegrationIds.has(configuredIntegrationId);
    if (hasValidIntegration) {
      continue;
    }

    // Check if user has any integration of this type
    if (!userIntegrationTypes.has(requiredIntegrationType)) {
      const existing = missingByType.get(requiredIntegrationType) || [];
      // Use human-readable label from registry if no custom label
      const actionInfo = findActionById(actionType);
      existing.push(node.data.label || actionInfo?.label || actionType);
      missingByType.set(requiredIntegrationType, existing);
    }
  }

  return Array.from(missingByType.entries()).map(([integrationType, nodeNames]) => ({
    integrationType,
    integrationLabel:
      integrationLabels[integrationType] ||
      BUILTIN_INTEGRATION_LABELS[integrationType] ||
      integrationType,
    nodeNames,
  }));
}
