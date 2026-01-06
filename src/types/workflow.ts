/**
 * Workflow Domain Types
 * Core business entities for the telemetry alert workflow engine
 */

import type { Node, Edge } from 'reactflow';

// ============================================
// Enums / Literal Types
// ============================================

/** Comparator operators for rule conditions */
export type Comparator = '>' | '<' | '>=' | '<=' | '==';

/** Aggregation functions for telemetry values over time window */
export type Aggregation = 'avg' | 'min' | 'max' | 'sum' | 'last';

/** Repeat policy determines how often alerts fire */
export type RepeatPolicyType = 'rate_limit' | 'once' | 'always';

/** Supported action types for workflow triggers */
export type ActionType = 'email' | 'sms';

/** Node type identifiers matching NODE_TYPES constant */
export type NodeType = 'deviceSelector' | 'rule' | 'emailAction' | 'smsAction';

// ============================================
// Device Selector
// ============================================

/**
 * DeviceSelector defines which devices to monitor.
 * Filters are combined with AND logic - devices must match ALL non-empty filters.
 * At least one filter must have values.
 */
export interface DeviceSelector {
  /** Filter by plant/location (e.g., ['mumbai', 'pune']) */
  plants: string[];
  /** Filter by asset category (e.g., ['extruder', 'compressor']) */
  assetTypes: string[];
  /** Filter by specific asset IDs (e.g., ['ext-001', 'comp-401']) */
  assets: string[];
}

// ============================================
// Rule / Condition
// ============================================

/** Configuration for alert repeat behavior */
export interface RepeatPolicy {
  type: RepeatPolicyType;
  /** Minimum seconds between alerts (required when type is 'rate_limit') */
  interval_seconds?: number;
}

/**
 * Rule defines when an alert should trigger.
 * Condition: parameter {comparator} threshold for duration_seconds
 */
export interface Rule {
  /** Telemetry parameter to monitor (e.g., 'Temperature') */
  parameter: string;
  /** Comparison operator */
  comparator: Comparator;
  /** Threshold value to compare against */
  threshold: number;
  /** Time window in seconds the condition must hold */
  duration_seconds: number;
  /** How to aggregate values over the time window */
  aggregation: Aggregation;
  /** How often to fire repeated alerts */
  repeat_policy: RepeatPolicy;
}

// ============================================
// Actions
// ============================================

/** Action to execute when workflow triggers */
export interface Action {
  type: ActionType;
  /** Email addresses or phone numbers */
  recipients: string[];
}

// ============================================
// Workflow
// ============================================

/** Complete workflow entity as stored in Redux/database */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  nodes: WorkflowNode[];
  edges: Edge[];
  created_at?: string;
  created_by?: string;
}

/** API payload format for creating/updating workflows */
export interface WorkflowPayload {
  name: string;
  description: string;
  enabled: boolean;
  device_selector: DeviceSelector;
  rules: Rule[];
  actions: Action[];
}

// ============================================
// Node Data Types (ReactFlow node.data shapes)
// ============================================

/** Data shape for DeviceSelector node */
export interface DeviceSelectorNodeData extends DeviceSelector {}

/** Data shape for Rule node */
export interface RuleNodeData extends Rule {}

/** Data shape for Email Action node */
export interface EmailActionNodeData {
  recipients: string[];
}

/** Data shape for SMS Action node */
export interface SmsActionNodeData {
  recipients: string[];
}

/** Union of all possible node data shapes */
export type WorkflowNodeData =
  | DeviceSelectorNodeData
  | RuleNodeData
  | EmailActionNodeData
  | SmsActionNodeData;

/** Typed ReactFlow node for workflow editor */
export interface WorkflowNode extends Omit<Node, 'data' | 'type'> {
  type: NodeType;
  data: WorkflowNodeData;
}

// ============================================
// Validation Types
// ============================================

/** Result of workflow validation */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Result of payload generation with validation */
export interface PayloadGenerationResult {
  valid: boolean;
  errors?: string[];
  payload?: WorkflowPayload;
}
