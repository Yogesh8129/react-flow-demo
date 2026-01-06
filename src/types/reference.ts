/**
 * Reference Data Types
 * Types for dropdown options and selection UI components
 */

/** Base option type for single-select and multi-select dropdowns */
export interface SelectOption {
  value: string;
  label: string;
}

/** Parameter option with unit information for threshold display */
export interface ParameterOption extends SelectOption {
  unit: string | null;
}

/** Complete reference data structure from backend API */
export interface ReferenceData {
  plants: SelectOption[];
  assets: SelectOption[];
  assetTypes: SelectOption[];
  parameters: ParameterOption[];
}

/** API response wrapper for reference data endpoint */
export interface ReferenceDataResponse {
  status: 'success' | 'error';
  message: string;
  meta: ReferenceData;
}
