/**
 * Node Configuration
 * Defines node types, categories, visual config, and default data
 */

import type {
  NodeType,
  DeviceSelectorNodeData,
  RuleNodeData,
  EmailActionNodeData,
  SmsActionNodeData,
  WorkflowNodeData,
} from '@/types';

// ============================================
// Node Type Identifiers
// ============================================

export const NODE_TYPES = {
  DEVICE_SELECTOR: 'deviceSelector',
  RULE: 'rule',
  EMAIL_ACTION: 'emailAction',
  SMS_ACTION: 'smsAction',
} as const;

// ============================================
// Node Categories
// ============================================

export const NODE_CATEGORIES = {
  INPUT: 'input',
  LOGIC: 'logic',
  ACTION: 'action',
} as const;

type NodeCategory = (typeof NODE_CATEGORIES)[keyof typeof NODE_CATEGORIES];

// ============================================
// Node Configuration
// ============================================

interface NodeConfigItem {
  label: string;
  category: NodeCategory;
  color: string;
  icon: string;
  allowedConnections: {
    inputs: number;
    outputs: number;
  };
}

export const NODE_CONFIG: Record<NodeType, NodeConfigItem> = {
  [NODE_TYPES.DEVICE_SELECTOR]: {
    label: 'Device Selector',
    category: NODE_CATEGORIES.INPUT,
    color: '#3b82f6', // blue
    icon: 'Monitor',
    allowedConnections: {
      inputs: 0, // No inputs (start node)
      outputs: Infinity, // Can connect to multiple rules
    },
  },
  [NODE_TYPES.RULE]: {
    label: 'Rule',
    category: NODE_CATEGORIES.LOGIC,
    color: '#f59e0b', // amber
    icon: 'GitBranch',
    allowedConnections: {
      inputs: Infinity,
      outputs: Infinity,
    },
  },
  [NODE_TYPES.EMAIL_ACTION]: {
    label: 'Email Action',
    category: NODE_CATEGORIES.ACTION,
    color: '#10b981', // emerald
    icon: 'Mail',
    allowedConnections: {
      inputs: Infinity,
      outputs: 0, // No outputs (end node)
    },
  },
  [NODE_TYPES.SMS_ACTION]: {
    label: 'SMS Action',
    category: NODE_CATEGORIES.ACTION,
    color: '#8b5cf6', // violet
    icon: 'MessageSquare',
    allowedConnections: {
      inputs: Infinity,
      outputs: 0,
    },
  },
};

// ============================================
// Default Node Data
// ============================================

/**
 * Get default data for a new node of given type.
 * @param nodeType - The type of node
 * @returns Default data object matching the node type's schema
 */
export function getDefaultNodeData(nodeType: NodeType): WorkflowNodeData {
  switch (nodeType) {
    case NODE_TYPES.DEVICE_SELECTOR:
      return {
        plants: [],
        assetTypes: [],
        assets: [],
      } satisfies DeviceSelectorNodeData;

    case NODE_TYPES.RULE:
      return {
        parameter: '',
        comparator: '>',
        threshold: 0,
        duration_seconds: 60,
        aggregation: 'avg',
        repeat_policy: { type: 'rate_limit', interval_seconds: 300 },
      } satisfies RuleNodeData;

    case NODE_TYPES.EMAIL_ACTION:
      return {
        recipients: [],
        template_id: '',
      } satisfies EmailActionNodeData;

    case NODE_TYPES.SMS_ACTION:
      return {
        recipients: [],
        template_id: '',
      } satisfies SmsActionNodeData;

    default: {
      // Exhaustive check - TypeScript will error if a case is missing
      const _exhaustive: never = nodeType;
      return _exhaustive;
    }
  }
}

/**
 * Get the config for a node type.
 * @param nodeType - The type of node
 * @returns Node configuration object
 */
export function getNodeConfig(nodeType: NodeType): NodeConfigItem {
  return NODE_CONFIG[nodeType];
}

/**
 * Get all node types for a category.
 * @param category - The category to filter by
 * @returns Array of node types in that category
 */
export function getNodeTypesByCategory(category: NodeCategory): NodeType[] {
  return (Object.entries(NODE_CONFIG) as [NodeType, NodeConfigItem][])
    .filter(([, config]) => config.category === category)
    .map(([type]) => type);
}
