/**
 * Payload Generator
 * Converts visual workflow (nodes/edges) to API-compatible payload format.
 */

import { NODE_TYPES } from '@/constants/nodeConfig';
import type {
  Workflow,
  WorkflowNode,
  WorkflowPayload,
  DeviceSelector,
  Rule,
  Action,
  ValidationResult,
  PayloadGenerationResult,
  DeviceSelectorNodeData,
  RuleNodeData,
  EmailActionNodeData,
  SmsActionNodeData,
} from '@/types';

// Type Guards


function isDeviceSelectorData(data: unknown): data is DeviceSelectorNodeData {
  const d = data as DeviceSelectorNodeData;
  return (
    Array.isArray(d?.plants) &&
    Array.isArray(d?.assetTypes) &&
    Array.isArray(d?.assets)
  );
}

function isRuleData(data: unknown): data is RuleNodeData {
  const d = data as RuleNodeData;
  return typeof d?.parameter === 'string' && typeof d?.threshold === 'number';
}

function isActionData(
  data: unknown
): data is EmailActionNodeData | SmsActionNodeData {
  const d = data as EmailActionNodeData;
  return Array.isArray(d?.recipients);
}


// Extraction Functions


/**
 * Extract and combine device selector data from all device selector nodes.
 * Combines plants, assetTypes, and assets arrays, removing duplicates.
 */
function extractDeviceSelector(nodes: WorkflowNode[]): DeviceSelector {
  const deviceNodes = nodes.filter(
    (n) => n.type === NODE_TYPES.DEVICE_SELECTOR
  );

  const allPlants: string[] = [];
  const allAssetTypes: string[] = [];
  const allAssets: string[] = [];

  for (const node of deviceNodes) {
    if (isDeviceSelectorData(node.data)) {
      allPlants.push(...(node.data.plants || []));
      allAssetTypes.push(...(node.data.assetTypes || []));
      allAssets.push(...(node.data.assets || []));
    }
  }

  return {
    plants: [...new Set(allPlants)],
    assetTypes: [...new Set(allAssetTypes)],
    assets: [...new Set(allAssets)],
  };
}

/**
 * Extract rules from all rule nodes.
 */
function extractRules(nodes: WorkflowNode[]): Rule[] {
  const ruleNodes = nodes.filter((n) => n.type === NODE_TYPES.RULE);

  return ruleNodes
    .filter((n) => isRuleData(n.data))
    .map((n) => {
      const data = n.data as RuleNodeData;
      return {
        parameter: data.parameter,
        comparator: data.comparator,
        threshold: data.threshold,
        duration_seconds: data.duration_seconds,
        aggregation: data.aggregation,
        repeat_policy: data.repeat_policy,
      };
    });
}

/**
 * Extract actions from all email and SMS action nodes.
 */
function extractActions(nodes: WorkflowNode[]): Action[] {
  const actionNodes = nodes.filter(
    (n) =>
      n.type === NODE_TYPES.EMAIL_ACTION || n.type === NODE_TYPES.SMS_ACTION
  );

  return actionNodes
    .filter((n) => isActionData(n.data))
    .map((n) => {
      const data = n.data as EmailActionNodeData | SmsActionNodeData;
      const type = n.type === NODE_TYPES.EMAIL_ACTION ? 'email' : 'sms';
      return {
        type: type as 'email' | 'sms',
        recipients: data.recipients,
      };
    });
}


// Validation


/**
 * Validate that a workflow has all required components.
 * Requirements:
 * - At least 1 device selector with selections
 * - At least 1 rule with a parameter
 * - At least 1 action with recipients
 */
export function validateWorkflow(workflow: Workflow): ValidationResult {
  const errors: string[] = [];
  const nodes = workflow.nodes || [];

  // Get nodes by type
  const deviceSelectors = nodes.filter(
    (n) => n.type === NODE_TYPES.DEVICE_SELECTOR
  );
  const rules = nodes.filter((n) => n.type === NODE_TYPES.RULE);
  const actions = nodes.filter(
    (n) =>
      n.type === NODE_TYPES.EMAIL_ACTION || n.type === NODE_TYPES.SMS_ACTION
  );

  // Check minimum node requirements
  if (deviceSelectors.length === 0) {
    errors.push('At least one Device Selector is required');
  }

  if (rules.length === 0) {
    errors.push('At least one Rule is required');
  }

  if (actions.length === 0) {
    errors.push('At least one Action (Email or SMS) is required');
  }

  // Check device selectors have selections
  const emptyDeviceSelectors = deviceSelectors.filter((n) => {
    if (!isDeviceSelectorData(n.data)) return true;
    const d = n.data;
    return (
      (d.plants?.length ?? 0) === 0 &&
      (d.assetTypes?.length ?? 0) === 0 &&
      (d.assets?.length ?? 0) === 0
    );
  });

  if (emptyDeviceSelectors.length > 0) {
    errors.push('All Device Selectors must have at least one selection');
  }

  // Check rules have parameters
  const emptyRules = rules.filter((n) => {
    if (!isRuleData(n.data)) return true;
    return !n.data.parameter;
  });

  if (emptyRules.length > 0) {
    errors.push('All Rules must have a parameter configured');
  }

  // Check actions have recipients
  const emptyActions = actions.filter((n) => {
    if (!isActionData(n.data)) return true;
    return !n.data.recipients || n.data.recipients.length === 0;
  });

  if (emptyActions.length > 0) {
    errors.push('All Actions must have at least one recipient');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


// Payload Generation


/**
 * Generate API-compatible workflow payload from visual workflow.
 * Does not validate - use generateValidatedPayload for validation.
 */
export function generateWorkflowPayload(workflow: Workflow): WorkflowPayload {
  const nodes = (workflow.nodes || []) as WorkflowNode[];

  return {
    name: workflow.name,
    description: workflow.description || '',
    enabled: workflow.enabled,
    device_selector: extractDeviceSelector(nodes),
    rules: extractRules(nodes),
    actions: extractActions(nodes),
  };
}

/**
 * Validate workflow and generate payload if valid.
 * @returns Object with valid flag, errors (if invalid), or payload (if valid)
 */
export function generateValidatedPayload(
  workflow: Workflow
): PayloadGenerationResult {
  const validation = validateWorkflow(workflow);

  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors,
    };
  }

  return {
    valid: true,
    payload: generateWorkflowPayload(workflow),
  };
}

/**
 * Debug utility: Log workflow structure.
 */
export function debugWorkflow(workflow: Workflow): void {
  console.group('Workflow Debug');
  console.log('Name:', workflow.name);
  console.log('Enabled:', workflow.enabled);
  console.log('Nodes:', workflow.nodes.length);
  console.log('Edges:', workflow.edges.length);

  const payload = generateWorkflowPayload(workflow);
  console.log('Generated Payload:', payload);

  const validation = validateWorkflow(workflow);
  console.log('Validation:', validation);
  console.groupEnd();
}
