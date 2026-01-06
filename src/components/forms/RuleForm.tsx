/**
 * RuleForm Component
 * Form for configuring rule/condition parameters in a workflow.
 * Features parameter dropdown with automatic unit display.
 */

import type { FormikProps } from 'formik';
import { useMemo } from 'react';
import FormField from '../ui/FormField';
import FormSelect from '../ui/FormSelect';
import { mockReferenceData, getParameterUnit } from '@/mocks/referenceData';
import type { RuleNodeData } from '@/types';

// ============================================
// Static Options
// ============================================

const comparatorOptions = [
  { value: '>', label: '> (greater than)' },
  { value: '<', label: '< (less than)' },
  { value: '>=', label: '>= (greater or equal)' },
  { value: '<=', label: '<= (less or equal)' },
  { value: '==', label: '== (equals)' },
];

const aggregationOptions = [
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
  { value: 'sum', label: 'Sum' },
  { value: 'last', label: 'Last Value' },
];

const repeatPolicyOptions = [
  { value: 'rate_limit', label: 'Rate Limit' },
  { value: 'once', label: 'Once Only' },
  { value: 'always', label: 'Always' },
];

// ============================================
// Component
// ============================================

interface RuleFormProps {
  formik: FormikProps<RuleNodeData>;
}

export default function RuleForm({ formik }: RuleFormProps) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    formik;

  // Get unit for selected parameter
  const selectedUnit = useMemo(() => {
    return values.parameter ? getParameterUnit(values.parameter) : null;
  }, [values.parameter]);

  // Handle parameter change - could reset threshold if unit changes significantly
  const handleParameterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParameter = e.target.value;
    setFieldValue('parameter', newParameter);
  };

  return (
    <div className="space-y-4">
      {/* Parameter Dropdown */}
      <FormField
        label="Parameter"
        name="parameter"
        error={touched.parameter ? (errors.parameter as string) : undefined}
      >
        <select
          id="parameter"
          name="parameter"
          value={values.parameter}
          onChange={handleParameterChange}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select parameter...</option>
          {mockReferenceData.parameters.map((param) => (
            <option key={param.value} value={param.value}>
              {param.label}
              {param.unit ? ` (${param.unit})` : ''}
            </option>
          ))}
        </select>
      </FormField>

      {/* Comparator and Threshold */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Comparator"
          name="comparator"
          error={touched.comparator ? (errors.comparator as string) : undefined}
        >
          <FormSelect
            name="comparator"
            value={values.comparator}
            onChange={handleChange}
            options={comparatorOptions}
            placeholder=""
          />
        </FormField>

        <FormField
          label="Threshold"
          name="threshold"
          error={touched.threshold ? (errors.threshold as string) : undefined}
        >
          <div className="relative">
            <input
              id="threshold"
              name="threshold"
              type="number"
              value={values.threshold}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                selectedUnit ? 'pr-12' : ''
              }`}
            />
            {/* Unit badge */}
            {selectedUnit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                {selectedUnit}
              </span>
            )}
          </div>
        </FormField>
      </div>

      {/* Duration and Aggregation */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Duration (seconds)"
          name="duration_seconds"
          error={
            touched.duration_seconds
              ? (errors.duration_seconds as string)
              : undefined
          }
        >
          <input
            id="duration_seconds"
            name="duration_seconds"
            type="number"
            min="0"
            value={values.duration_seconds}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </FormField>

        <FormField
          label="Aggregation"
          name="aggregation"
          error={
            touched.aggregation ? (errors.aggregation as string) : undefined
          }
        >
          <FormSelect
            name="aggregation"
            value={values.aggregation}
            onChange={handleChange}
            options={aggregationOptions}
            placeholder=""
          />
        </FormField>
      </div>

      {/* Repeat Policy Section */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Repeat Policy</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Type"
            name="repeat_policy.type"
            error={
              touched.repeat_policy?.type
                ? (errors.repeat_policy as { type?: string })?.type
                : undefined
            }
          >
            <FormSelect
              name="repeat_policy.type"
              value={values.repeat_policy?.type || 'rate_limit'}
              onChange={(e) =>
                setFieldValue('repeat_policy.type', e.target.value)
              }
              options={repeatPolicyOptions}
              placeholder=""
            />
          </FormField>

          {values.repeat_policy?.type === 'rate_limit' && (
            <FormField
              label="Interval (seconds)"
              name="repeat_policy.interval_seconds"
              error={
                touched.repeat_policy?.interval_seconds
                  ? (errors.repeat_policy as { interval_seconds?: string })
                      ?.interval_seconds
                  : undefined
              }
            >
              <input
                id="repeat_policy.interval_seconds"
                name="repeat_policy.interval_seconds"
                type="number"
                min="0"
                value={values.repeat_policy?.interval_seconds ?? 300}
                onChange={(e) =>
                  setFieldValue(
                    'repeat_policy.interval_seconds',
                    Number(e.target.value)
                  )
                }
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </FormField>
          )}
        </div>
      </div>

      {/* Rule Summary */}
      <RuleSummary values={values} unit={selectedUnit} />
    </div>
  );
}

// ============================================
// Rule Summary Component
// ============================================

interface RuleSummaryProps {
  values: RuleNodeData;
  unit: string | null;
}

function RuleSummary({ values, unit }: RuleSummaryProps) {
  if (!values.parameter) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return 'instantly';
    if (seconds < 60) return `for ${seconds}s`;
    if (seconds < 3600) return `for ${Math.floor(seconds / 60)}m`;
    return `for ${Math.floor(seconds / 3600)}h`;
  };

  const getRepeatText = (): string => {
    switch (values.repeat_policy?.type) {
      case 'once':
        return 'fire once';
      case 'always':
        return 'fire every time';
      case 'rate_limit':
      default:
        const interval = values.repeat_policy?.interval_seconds ?? 300;
        return `max once per ${formatDuration(interval).replace('for ', '')}`;
    }
  };

  return (
    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
      <p className="text-xs font-medium text-amber-800 mb-1">Rule Summary</p>
      <p className="text-sm text-amber-900">
        When{' '}
        <span className="font-semibold">
          {values.aggregation} {values.parameter}
        </span>{' '}
        <span className="font-semibold">
          {values.comparator} {values.threshold}
          {unit ? ` ${unit}` : ''}
        </span>{' '}
        {formatDuration(values.duration_seconds)}, {getRepeatText()}.
      </p>
    </div>
  );
}
