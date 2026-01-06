/**
 * DeviceSelectorForm Component
 * Form for configuring which devices to monitor in a workflow.
 * Uses multi-select dropdowns for plants, asset types, and specific assets.
 */

import type { FormikProps } from 'formik';
import MultiSelect from '../ui/MultiSelect';
import { mockReferenceData } from '@/mocks/referenceData';
import type { DeviceSelectorNodeData } from '@/types';

interface DeviceSelectorFormProps {
  formik: FormikProps<DeviceSelectorNodeData>;
}

export default function DeviceSelectorForm({ formik }: DeviceSelectorFormProps) {
  const { values, setFieldValue, errors, touched } = formik;

  // Get the combined validation error message
  const getValidationError = (): string | null => {
    // Check if form was touched and has validation error
    const hasBeenTouched =
      touched.plants || touched.assetTypes || touched.assets;

    if (!hasBeenTouched) return null;

    // Check if at least one selection exists
    const hasSelection =
      (values.plants?.length ?? 0) > 0 ||
      (values.assetTypes?.length ?? 0) > 0 ||
      (values.assets?.length ?? 0) > 0;

    if (!hasSelection) {
      // Return Zod error if exists, or default message
      if (typeof errors === 'string') return errors;
      return 'Select at least one plant, asset type, or asset';
    }

    return null;
  };

  const validationError = getValidationError();

  return (
    <div className="space-y-3">
      {/* Info text */}
      <p className="text-xs text-gray-500">
        Select devices by plant location, asset type, or specific assets.
        Filters are combined with AND logic.
      </p>

      {/* Plants multi-select */}
      <MultiSelect
        label="Filter by Plants"
        options={mockReferenceData.plants}
        value={values.plants ?? []}
        onChange={(selected) => {
          setFieldValue('plants', selected);
        }}
        searchPlaceholder="Search plants..."
        defaultExpanded={values.plants?.length > 0}
      />

      {/* Asset Types multi-select */}
      <MultiSelect
        label="Filter by Asset Types"
        options={mockReferenceData.assetTypes}
        value={values.assetTypes ?? []}
        onChange={(selected) => {
          setFieldValue('assetTypes', selected);
        }}
        searchPlaceholder="Search asset types..."
        defaultExpanded={values.assetTypes?.length > 0}
      />

      {/* Specific Assets multi-select */}
      <MultiSelect
        label="Or Select Specific Assets"
        options={mockReferenceData.assets}
        value={values.assets ?? []}
        onChange={(selected) => {
          setFieldValue('assets', selected);
        }}
        searchPlaceholder="Search assets..."
        defaultExpanded={values.assets?.length > 0}
      />

      {/* Validation error */}
      {validationError && (
        <p className="text-sm text-red-600 mt-2">{validationError}</p>
      )}

      {/* Selection summary */}
      <SelectionSummary
        plants={values.plants ?? []}
        assetTypes={values.assetTypes ?? []}
        assets={values.assets ?? []}
      />
    </div>
  );
}

// ============================================
// Selection Summary Component
// ============================================

interface SelectionSummaryProps {
  plants: string[];
  assetTypes: string[];
  assets: string[];
}

function SelectionSummary({ plants, assetTypes, assets }: SelectionSummaryProps) {
  const totalSelections = plants.length + assetTypes.length + assets.length;

  if (totalSelections === 0) {
    return null;
  }

  // Get labels for display
  const getLabels = (values: string[], options: typeof mockReferenceData.plants) => {
    return values.map((v) => options.find((o) => o.value === v)?.label ?? v);
  };

  const plantLabels = getLabels(plants, mockReferenceData.plants);
  const assetTypeLabels = getLabels(assetTypes, mockReferenceData.assetTypes);
  const assetLabels = getLabels(assets, mockReferenceData.assets);

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
      <p className="text-xs font-medium text-blue-800 mb-2">Selection Summary</p>
      <div className="space-y-1.5">
        {plantLabels.length > 0 && (
          <SummaryRow label="Plants" items={plantLabels} />
        )}
        {assetTypeLabels.length > 0 && (
          <SummaryRow label="Asset Types" items={assetTypeLabels} />
        )}
        {assetLabels.length > 0 && (
          <SummaryRow label="Assets" items={assetLabels} />
        )}
      </div>
      {plants.length > 0 && assetTypes.length > 0 && (
        <p className="text-xs text-blue-600 mt-2 italic">
          Devices matching ALL selected filters will be monitored.
        </p>
      )}
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  items: string[];
}

function SummaryRow({ label, items }: SummaryRowProps) {
  const displayItems = items.length <= 3 ? items : [...items.slice(0, 3)];
  const remaining = items.length - 3;

  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-blue-700 font-medium min-w-[80px]">{label}:</span>
      <span className="text-blue-900">
        {displayItems.join(', ')}
        {remaining > 0 && (
          <span className="text-blue-600"> +{remaining} more</span>
        )}
      </span>
    </div>
  );
}
