import { Position } from "reactflow";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeContent,
  BaseNodeFooter,
} from "@/components/base-node";
import { BaseHandle } from "@/components/base-handle";
import { TrendingUp, BarChart3, ChevronDown, ExternalLink } from "lucide-react";

/**
 * KeyMetricNode - Green highlighted central driver metric
 * The key KPI that connects inputs to outcomes
 */
export default function KeyMetricNode({ data }) {
  return (
    <BaseNode className="min-w-[280px] max-w-[320px] border-2 border-green-400 bg-green-50 shadow-lg shadow-green-100">
      {/* Handles */}
      <BaseHandle id="top" type="target" position={Position.Top} />
      <BaseHandle id="bottom" type="source" position={Position.Bottom} />
      <BaseHandle id="left" type="target" position={Position.Left} />
      <BaseHandle id="right" type="source" position={Position.Right} />

      {/* Header */}
      <BaseNodeHeader className="border-b border-green-200">
        <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <BarChart3 className="w-4 h-4" />
          <span>Key Metric</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        <ExternalLink className="w-4 h-4 text-green-400 cursor-pointer" />
      </BaseNodeHeader>

      {/* Content */}
      <BaseNodeContent>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          {data.title}
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {data.metrics.map((metric, index) => (
            <div key={index} className="text-left">
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className="text-lg font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-green-600 flex items-center gap-0.5">
                {metric.change} <TrendingUp className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </BaseNodeContent>

      {/* Footer */}
      <BaseNodeFooter className="flex-row justify-between border-green-200">
        <span className="text-xs text-green-600 font-medium">{data.tag}</span>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          Sum <ChevronDown className="w-3 h-3" />
        </div>
      </BaseNodeFooter>
    </BaseNode>
  );
}
