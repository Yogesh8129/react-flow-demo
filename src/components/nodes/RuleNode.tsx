/**
 * RuleNode Component
 * Visual display of rule/condition configuration in the workflow canvas.
 * Shows parameter, condition, threshold with unit, and timing info.
 */

import { memo } from 'react';
import { Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from '../base-node';
import { BaseHandle } from '../base-handle';
import { getParameterUnit, getParameterLabel } from '@/mocks/referenceData';
import type { RuleNodeData } from '@/types';

interface RuleNodeProps {
  data: RuleNodeData;
}

function RuleNode({ data }: RuleNodeProps) {
  const {
    parameter = '',
    comparator = '>',
    threshold = 0,
    duration_seconds = 60,
    aggregation = 'avg',
  } = data;

  const hasConfig = parameter.length > 0;
  const unit = parameter ? getParameterUnit(parameter) : null;
  const paramLabel = parameter ? getParameterLabel(parameter) : '';

  return (
    <BaseNode
      className="w-[220px] border-l-4"
      style={{ borderLeftColor: '#f59e0b' }}
    >
      {/* Input handle (left side) */}
      <BaseHandle type="target" position={Position.Left} id="left" />
      {/* Output handle (right side) */}
      <BaseHandle type="source" position={Position.Right} id="right" />

      <BaseNodeHeader className="bg-amber-50">
        <GitBranch size={16} className="text-amber-600" />
        <BaseNodeHeaderTitle className="text-amber-900 text-sm">
          Rule
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {hasConfig ? (
          <div className="space-y-2">
            {/* Main condition display */}
            <p className="text-sm font-medium text-gray-800">
              {paramLabel} {comparator} {threshold}
              {unit && <span className="text-gray-500 ml-0.5">{unit}</span>}
            </p>

            {/* Timing and aggregation info */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                {aggregation}
              </span>
              <span>for {formatDuration(duration_seconds)}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No rule configured</p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

/**
 * Format duration in seconds to human-readable string.
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "5m", "1h", "30s")
 */
function formatDuration(seconds: number): string {
  if (seconds === 0) return 'instant';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

export default memo(RuleNode);
