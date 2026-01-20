import { z } from 'zod';

// Reusable schema parts
const nonEmptyString = z.string().min(1, 'Required');
const emailArray = z
  .array(z.string().email('Invalid email'))
  .min(1, 'At least one recipient required');
const phoneArray = z
  .array(z.string().min(10, 'Invalid phone number'))
  .min(1, 'At least one recipient required');
const tagsArray = z
  .array(z.string().min(1))
  .min(1, 'At least one tag required');

// Device Selector Schema
export const deviceSelectorSchema = z.object({
  tags: tagsArray,
});

// Rule Schema
export const ruleSchema = z.object({
  parameter: nonEmptyString,
  comparator: z.enum(['>', '<', '>=', '<=', '==']),
  threshold: z.number(),
  duration_seconds: z.number().min(0),
  aggregation: z.enum(['avg', 'min', 'max', 'sum', 'last']),
  repeat_policy: z.object({
    type: z.enum(['rate_limit', 'once', 'always']),
    interval_seconds: z.number().min(0),
  }),
});

// Email Action Schema
export const emailActionSchema = z.object({
  recipients: emailArray,
  template_id: nonEmptyString,
});

// SMS Action Schema
export const smsActionSchema = z.object({
  recipients: phoneArray,
  template_id: nonEmptyString,
});

// Map node types to schemas
export const nodeSchemas = {
  deviceSelector: deviceSelectorSchema,
  rule: ruleSchema,
  emailAction: emailActionSchema,
  smsAction: smsActionSchema,
};

// Helper to validate node data
export const validateNodeData = (nodeType, data) => {
  const schema = nodeSchemas[nodeType];
  if (!schema) return { success: false, error: 'Unknown node type' };
  return schema.safeParse(data);
};
