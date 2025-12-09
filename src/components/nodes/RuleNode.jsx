import { memo } from "react";
import { Position } from "reactflow";
import { GitBranch } from "lucide-react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node";
import { BaseHandle } from "../base-handle";

function RuleNode({ data }) {
  const {
    parameter = "",
    comparator = ">",
    threshold = 0,
    duration_seconds = 60,
    aggregation = "avg",
  } = data;

  // Format duration for display
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const hasConfig = parameter.length > 0;

  return (
    <BaseNode
      className="w-[220px] border-l-4"
      style={{ borderLeftColor: "#f59e0b" }}
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
            <p className="text-sm font-medium text-gray-800">
              {parameter} {comparator} {threshold}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
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

export default memo(RuleNode);
