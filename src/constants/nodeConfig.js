// Node type identifiers
export const NODE_TYPES = {
  DEVICE_SELECTOR: 'deviceSelector',
  RULE: 'rule',
  EMAIL_ACTION: 'emailAction',
  SMS_ACTION: 'smsAction',
};

// Node categories for UI grouping
export const NODE_CATEGORIES = {
  INPUT: 'input',
  LOGIC: 'logic',
  ACTION: 'action',
};

// Configuration for each node type
export const NODE_CONFIG = {
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

// Default data for new nodes
export const getDefaultNodeData = (nodeType) => {
  switch (nodeType) {
    case NODE_TYPES.DEVICE_SELECTOR:
      return { tags: [] };
    case NODE_TYPES.RULE:
      return {
        parameter: '',
        comparator: '>',
        threshold: 0,
        duration_seconds: 60,
        aggregation: 'avg',
        repeat_policy: { type: 'rate_limit', interval_seconds: 300 },
      };
    case NODE_TYPES.EMAIL_ACTION:
      return { recipients: [], template_id: '' };
    case NODE_TYPES.SMS_ACTION:
      return { recipients: [], template_id: '' };
    default:
      return {};
  }
};
