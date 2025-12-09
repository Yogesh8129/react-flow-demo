import { NODE_TYPES } from "../constants/nodeConfig";

/**
 * Extracts device selector data from nodes.
 * Combines tags from all device selector nodes.
 * @param {Array} nodes - Array of React Flow nodes
 * @returns {Object} Device selector object with combined tags
 */
const extractDeviceSelector = (nodes) => {
  const deviceNodes = nodes.filter((n) => n.type === NODE_TYPES.DEVICE_SELECTOR);
  const allTags = deviceNodes.flatMap((n) => n.data.tags || []);
  // Remove duplicates
  const uniqueTags = [...new Set(allTags)];
  return { tags: uniqueTags };
};

/**
 * Extracts rules from rule nodes.
 * @param {Array} nodes - Array of React Flow nodes
 * @returns {Array} Array of rule objects
 */
const extractRules = (nodes) => {
  const ruleNodes = nodes.filter((n) => n.type === NODE_TYPES.RULE);
  return ruleNodes.map((n) => ({
    parameter: n.data.parameter,
    comparator: n.data.comparator,
    threshold: n.data.threshold,
    duration_seconds: n.data.duration_seconds,
    aggregation: n.data.aggregation,
    repeat_policy: n.data.repeat_policy,
  }));
};

/**
 * Extracts actions from action nodes.
 * @param {Array} nodes - Array of React Flow nodes
 * @returns {Array} Array of action objects with type field
 */
const extractActions = (nodes) => {
  const actionNodes = nodes.filter(
    (n) => n.type === NODE_TYPES.EMAIL_ACTION || n.type === NODE_TYPES.SMS_ACTION
  );

  return actionNodes.map((n) => {
    const type = n.type === NODE_TYPES.EMAIL_ACTION ? "email" : "sms";
    return {
      type,
      recipients: n.data.recipients,
      template_id: n.data.template_id,
    };
  });
};

/**
 * Validates workflow completeness.
 * Checks: at least 1 device selector, 1 rule, 1 action.
 * @param {Object} workflow - The workflow object from Redux
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateWorkflow = (workflow) => {
  const errors = [];
  const nodes = workflow.nodes || [];

  const deviceSelectors = nodes.filter((n) => n.type === NODE_TYPES.DEVICE_SELECTOR);
  const rules = nodes.filter((n) => n.type === NODE_TYPES.RULE);
  const actions = nodes.filter(
    (n) => n.type === NODE_TYPES.EMAIL_ACTION || n.type === NODE_TYPES.SMS_ACTION
  );

  if (deviceSelectors.length === 0) {
    errors.push("At least one Device Selector is required");
  }

  if (rules.length === 0) {
    errors.push("At least one Rule is required");
  }

  if (actions.length === 0) {
    errors.push("At least one Action (Email or SMS) is required");
  }

  // Check if device selectors have tags
  const emptyDeviceSelectors = deviceSelectors.filter(
    (n) => !n.data.tags || n.data.tags.length === 0
  );
  if (emptyDeviceSelectors.length > 0) {
    errors.push("All Device Selectors must have at least one tag");
  }

  // Check if rules have parameters
  const emptyRules = rules.filter((n) => !n.data.parameter);
  if (emptyRules.length > 0) {
    errors.push("All Rules must have a parameter configured");
  }

  // Check if actions have recipients
  const emptyActions = actions.filter(
    (n) => !n.data.recipients || n.data.recipients.length === 0
  );
  if (emptyActions.length > 0) {
    errors.push("All Actions must have at least one recipient");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generates API-compatible workflow payload from visual flow.
 * @param {Object} workflow - The workflow object from Redux
 * @returns {Object} API payload
 */
export const generateWorkflowPayload = (workflow) => {
  const nodes = workflow.nodes || [];

  return {
    name: workflow.name,
    description: workflow.description || "",
    enabled: workflow.enabled,
    device_selector: extractDeviceSelector(nodes),
    rules: extractRules(nodes),
    actions: extractActions(nodes),
  };
};

/**
 * Generates and validates workflow payload.
 * @param {Object} workflow - The workflow object from Redux
 * @returns {Object} { valid: boolean, errors?: string[], payload?: Object }
 */
export const generateValidatedPayload = (workflow) => {
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
};
