/**
 * DeviceSelectorNode Component
 * Visual display of device selector configuration in the workflow canvas.
 * Shows selected plants, asset types, and specific assets.
 */

import { memo } from 'react';
import { Position } from 'reactflow';
import { Monitor } from 'lucide-react';
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from '../base-node';
import { BaseHandle } from '../base-handle';
import {
  mockReferenceData,
  formatSelection,
  hasAnySelection,
} from '@/mocks/referenceData';
import type { DeviceSelectorNodeData } from '@/types';

interface DeviceSelectorNodeProps {
  data: DeviceSelectorNodeData;
}

function DeviceSelectorNode({ data }: DeviceSelectorNodeProps) {
  const { plants = [], assetTypes = [], assets = [] } = data;
  const hasSelection = hasAnySelection({ plants, assetTypes, assets });

  return (
    <BaseNode
      className="w-[240px] border-l-4 border-l-blue-500"
      style={{ borderLeftColor: '#3b82f6' }}
    >
      {/* Output handle only (right side) */}
      <BaseHandle type="source" position={Position.Right} id="right" />

      <BaseNodeHeader className="bg-blue-50">
        <Monitor size={16} className="text-blue-600" />
        <BaseNodeHeaderTitle className="text-blue-900 text-sm">
          Device Selector
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {hasSelection ? (
          <div className="space-y-1.5">
            {/* Plants */}
            {plants.length > 0 && (
              <FilterRow
                label="Plants"
                values={plants}
                options={mockReferenceData.plants}
                colorClass="bg-blue-100 text-blue-700"
              />
            )}

            {/* Asset Types */}
            {assetTypes.length > 0 && (
              <FilterRow
                label="Types"
                values={assetTypes}
                options={mockReferenceData.assetTypes}
                colorClass="bg-indigo-100 text-indigo-700"
              />
            )}

            {/* Specific Assets */}
            {assets.length > 0 && (
              <FilterRow
                label="Assets"
                values={assets}
                options={mockReferenceData.assets}
                colorClass="bg-cyan-100 text-cyan-700"
              />
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No devices selected</p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

// ============================================
// Filter Row Component
// ============================================

interface FilterRowProps {
  label: string;
  values: string[];
  options: Array<{ value: string; label: string }>;
  colorClass: string;
}

function FilterRow({ label, values, options, colorClass }: FilterRowProps) {
  const displayText = formatSelection(values, options, 2);

  return (
    <div className="flex items-start gap-1.5">
      <span className="text-[10px] text-gray-500 font-medium min-w-[38px] pt-0.5">
        {label}:
      </span>
      <span className={`text-xs px-1.5 py-0.5 rounded ${colorClass}`}>
        {displayText}
      </span>
    </div>
  );
}

export default memo(DeviceSelectorNode);
