/**
 * API Types
 * Request and response shapes for backend API communication
 */

import type { Workflow, WorkflowPayload } from './workflow';

// ============================================
// Generic Response Types
// ============================================

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: string[];
}

/** Paginated response for list endpoints */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Workflow API Types
// ============================================

/** Response for GET /api/workflows */
export type WorkflowListResponse = ApiResponse<Workflow[]>;

/** Response for GET /api/workflows/:id */
export type WorkflowResponse = ApiResponse<Workflow>;

/** Request body for POST /api/workflows */
export type CreateWorkflowRequest = WorkflowPayload;

/** Request body for PUT /api/workflows/:id */
export type UpdateWorkflowRequest = Partial<WorkflowPayload>;

// ============================================
// Workflow Test Types
// ============================================

/** Response for POST /api/workflows/:id/test */
export interface WorkflowTestResult {
  triggered: boolean;
  matched_devices: number;
  rules_evaluated: number;
  actions_executed: string[];
  simulation_time_ms: number;
}

export type WorkflowTestResponse = ApiResponse<WorkflowTestResult>;

// ============================================
// Execution Log Types
// ============================================

/** Single execution log entry */
export interface ExecutionLog {
  id: string;
  workflow_id: string;
  device_id: string;
  device_name?: string;
  parameter: string;
  value: number;
  threshold: number;
  timestamp: string;
  action_taken: string;
  status: 'success' | 'failure' | 'pending';
  error_message?: string;
}

/** Response for GET /api/workflows/:id/history */
export type ExecutionHistoryResponse = PaginatedResponse<ExecutionLog>;

// ============================================
// Error Types
// ============================================

/** Structured API error */
export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
