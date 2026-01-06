/**
 * Node Validation Schemas
 * Zod schemas for validating node data in the workflow editor
 */

import { z } from 'zod';
import type { NodeType } from '@/types';

// ============================================
// Reusable Schema Parts
// ============================================

const nonEmptyString = z.string().min(1, 'Required');

const emailArray = z
  .array(z.string().email('Invalid email'))
  .min(1, 'At least one recipient required');

const phoneArray = z
  .array(z.string().min(10, 'Invalid phone number'))
  .min(1, 'At least one recipient required');

const stringArray = z.array(z.string());

// ============================================
// Device Selector Schema
// ============================================

/**
 * Device selector validates that at least one filter is selected.
 * Filters: plants, assetTypes, or assets
 */
export const deviceSelectorSchema = z
  .object({
    plants: stringArray.default([]),
    assetTypes: stringArray.default([]),
    assets: stringArray.default([]),
  })
  .refine(
    (data) =>
      data.plants.length > 0 ||
      data.assetTypes.length > 0 ||
      data.assets.length > 0,
    {
      message: 'Select at least one plant, asset type, or asset',
    }
  );

export type DeviceSelectorSchemaType = z.infer<typeof deviceSelectorSchema>;

// ============================================
// Rule Schema
// ============================================

export const ruleSchema = z.object({
  parameter: nonEmptyString,
  comparator: z.enum(['>', '<', '>=', '<=', '==']),
  threshold: z.number({ required_error: 'Threshold is required' }),
  duration_seconds: z.number().min(0, 'Duration must be 0 or greater'),
  aggregation: z.enum(['avg', 'min', 'max', 'sum', 'last']),
  repeat_policy: z.object({
    type: z.enum(['rate_limit', 'once', 'always']),
    interval_seconds: z.number().min(0).default(300),
  }),
});

export type RuleSchemaType = z.infer<typeof ruleSchema>;

// ============================================
// Action Schemas
// ============================================

export const emailActionSchema = z.object({
  recipients: emailArray,
});

export type EmailActionSchemaType = z.infer<typeof emailActionSchema>;

export const smsActionSchema = z.object({
  recipients: phoneArray,
});

export type SmsActionSchemaType = z.infer<typeof smsActionSchema>;

// ============================================
// Schema Registry
// ============================================

/** Map of node types to their validation schemas */
export const nodeSchemas = {
  deviceSelector: deviceSelectorSchema,
  rule: ruleSchema,
  emailAction: emailActionSchema,
  smsAction: smsActionSchema,
} as const;

type NodeSchemaMap = typeof nodeSchemas;

// ============================================
// Validation Helper
// ============================================

/**
 * Validate node data against its schema.
 * @param nodeType - The type of node to validate
 * @param data - The data to validate
 * @returns Zod SafeParseReturnType with success flag and data/error
 *
 * @example
 * const result = validateNodeData('rule', { parameter: 'Temperature', ... });
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.log(result.error.issues);
 * }
 */
export function validateNodeData<T extends NodeType>(
  nodeType: T,
  data: unknown
): z.SafeParseReturnType<unknown, z.infer<NodeSchemaMap[T]>> {
  const schema = nodeSchemas[nodeType];
  if (!schema) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          path: [],
          message: `Unknown node type: ${nodeType}`,
        },
      ]),
    } as z.SafeParseReturnType<unknown, never>;
  }
  return schema.safeParse(data);
}

/**
 * Get default values for a node type based on schema.
 * Useful for initializing forms with valid defaults.
 * @param nodeType - The type of node
 * @returns Default values object
 */
export function getSchemaDefaults(nodeType: NodeType): Record<string, unknown> {
  switch (nodeType) {
    case 'deviceSelector':
      return { plants: [], assetTypes: [], assets: [] };
    case 'rule':
      return {
        parameter: '',
        comparator: '>',
        threshold: 0,
        duration_seconds: 60,
        aggregation: 'avg',
        repeat_policy: { type: 'rate_limit', interval_seconds: 300 },
      };
    case 'emailAction':
      return { recipients: [] };
    case 'smsAction':
      return { recipients: [] };
    default:
      return {};
  }
}
