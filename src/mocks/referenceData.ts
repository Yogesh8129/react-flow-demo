/**
 * Mock Reference Data
 * Provides development data for dropdowns and selection UI.
 * Replace with API calls when backend is ready.
 */

import type {
  ReferenceData,
  ReferenceDataResponse,
  SelectOption,
  ParameterOption,
} from '@/types';


// Mock Data


export const mockReferenceData: ReferenceData = {
  plants: [
    { value: 'plant-a', label: 'Plant A' },
    { value: 'plant-b', label: 'Plant B' },
    { value: 'plant-c', label: 'Plant C' },
    { value: 'mumbai', label: 'Mumbai Plant' },
    { value: 'pune', label: 'Pune Plant' },
    { value: 'delhi', label: 'Delhi Plant' },
    { value: 'bangalore', label: 'Bangalore Plant' },
    { value: 'chennai', label: 'Chennai Plant' },
    { value: 'coimbatore', label: 'Coimbatore Plant' },
  ],

  assets: [
    { value: 'ext-001', label: 'Extruder Line 1' },
    { value: 'ext-003', label: 'Twin Screw Extruder' },
    { value: 'print-101', label: 'Flexo Printer A' },
    { value: 'print-102', label: 'Digital Printer Pro' },
    { value: 'cut-201', label: 'Auto Cutter X9' },
    { value: 'cut-202', label: 'Inline Cutter' },
    { value: 'comp-401', label: 'Main Compressor' },
    { value: 'chiller-501', label: 'Central Chiller Unit' },
    { value: 'dg-701', label: '1000 kVA DG Set' },
  ],

  assetTypes: [
    { value: 'extruder', label: 'Extruder' },
    { value: 'printer', label: 'Printer' },
    { value: 'cutter', label: 'Cutter' },
    { value: 'mixer', label: 'Mixer' },
    { value: 'compressor', label: 'Air Compressor' },
    { value: 'chiller', label: 'Chiller Unit' },
    { value: 'boiler', label: 'Boiler' },
    { value: 'dg-set', label: 'DG Set' },
    { value: 'sensor', label: 'IoT Sensor' },
    { value: 'plc', label: 'PLC Controller' },
  ],

  parameters: [
    { value: 'Temperature', label: 'Temperature', unit: '°C' },
    { value: 'Pressure', label: 'Pressure', unit: 'bar' },
    { value: 'Vibration', label: 'Vibration Level', unit: 'mm/s' },
    { value: 'Power Consumption', label: 'Power Consumption', unit: 'kW' },
    { value: 'Rated Speed', label: 'Rated Speed', unit: 'm/min' },
    { value: 'Actual Line Speed', label: 'Actual Line Speed', unit: 'm/min' },
    { value: 'OEE', label: 'OEE', unit: '%' },
    { value: 'Yield', label: 'Yield', unit: '%' },
    { value: 'Rejection Rate', label: 'Rejection Rate', unit: '%' },
  ],
};

/** Mock API response wrapper */
export const mockReferenceDataResponse: ReferenceDataResponse = {
  status: 'success',
  message: 'Reference data loaded',
  meta: mockReferenceData,
};


// Helper Functions


/**
 * Get the unit for a parameter value.
 * @param parameterValue - The parameter value (e.g., 'Temperature')
 * @returns The unit string (e.g., '°C') or null if no unit
 *
 * @example
 * getParameterUnit('Temperature') // '°C'
 * getParameterUnit('OEE') // '%'
 */
export function getParameterUnit(parameterValue: string): string | null {
  const param = mockReferenceData.parameters.find(
    (p) => p.value === parameterValue
  );
  return param?.unit ?? null;
}

/**
 * Get the display label for a parameter value.
 * @param parameterValue - The parameter value (e.g., 'Temperature')
 * @returns The label string or the value itself if not found
 *
 * @example
 * getParameterLabel('Temperature') // 'Temperature'
 * getParameterLabel('OEE') // 'OEE %'
 */
export function getParameterLabel(parameterValue: string): string {
  const param = mockReferenceData.parameters.find(
    (p) => p.value === parameterValue
  );
  return param?.label ?? parameterValue;
}

/**
 * Find a parameter option by value.
 * @param parameterValue - The parameter value to find
 * @returns The full ParameterOption or undefined
 */
export function findParameter(
  parameterValue: string
): ParameterOption | undefined {
  return mockReferenceData.parameters.find((p) => p.value === parameterValue);
}

/**
 * Convert an array of values to their display labels.
 * @param values - Array of option values
 * @param options - Array of options to search
 * @returns Array of labels (or original values if not found)
 *
 * @example
 * getLabelsByValues(['mumbai', 'pune'], mockReferenceData.plants)
 * // ['Mumbai Plant', 'Pune Plant']
 */
export function getLabelsByValues(
  values: string[],
  options: SelectOption[]
): string[] {
  return values.map((v) => {
    const option = options.find((o) => o.value === v);
    return option?.label ?? v;
  });
}

/**
 * Format a selection for display (truncated if too many).
 * @param values - Selected values
 * @param options - Options to get labels from
 * @param maxDisplay - Max items to show before truncating (default: 2)
 * @returns Formatted string like "Mumbai, Pune" or "Mumbai, Pune +2 more"
 *
 * @example
 * formatSelection(['mumbai', 'pune', 'delhi'], plants, 2)
 * // 'Mumbai Plant, Pune Plant +1 more'
 */
export function formatSelection(
  values: string[],
  options: SelectOption[],
  maxDisplay: number = 2
): string {
  if (values.length === 0) return '';

  const labels = getLabelsByValues(values, options);

  if (labels.length <= maxDisplay) {
    return labels.join(', ');
  }

  const displayed = labels.slice(0, maxDisplay).join(', ');
  const remaining = labels.length - maxDisplay;
  return `${displayed} +${remaining} more`;
}

/**
 * Check if any selection exists in device selector data.
 * @param data - Device selector data object
 * @returns True if at least one filter has values
 */
export function hasAnySelection(data: {
  plants?: string[];
  assetTypes?: string[];
  assets?: string[];
}): boolean {
  return (
    (data.plants?.length ?? 0) > 0 ||
    (data.assetTypes?.length ?? 0) > 0 ||
    (data.assets?.length ?? 0) > 0
  );
}
