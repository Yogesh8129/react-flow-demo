import { Handle, Position } from "reactflow";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeContent,
  BaseNodeFooter,
} from "@/components/base-node";
import {
  User,
  Hand,
  MessageCircle,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

/**
 * MetricNode - "Metric / Input" type card for workflow
 *
 * Displays KPIs with time-based comparisons.
 */
export default function MetricNode({ data }) {
  return (
    <BaseNode className="min-w-[280px] max-w-[320px] border-l-4 border-l-purple-500">
      <Handle type="target" position={Position.Top} />

      {/* Header */}
      <BaseNodeHeader className="border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-purple-500 text-sm font-medium">
          <BarChart3 className="w-4 h-4" />
          <span>Metric / Input</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" />
      </BaseNodeHeader>

      {/* Content */}
      <BaseNodeContent>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          {data.title}
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {data.metrics.map((metric, index) => (
            <div key={index} className="text-left">
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className="text-lg font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-green-500 flex items-center gap-0.5">
                {metric.change} <TrendingUp className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
          <span>{data.tag}</span>
          <span className="text-gray-400 cursor-pointer">✕</span>
        </div>
      </BaseNodeContent>

      {/* Footer */}
      <BaseNodeFooter className="flex-row justify-between">
        <div className="flex items-center gap-3 text-gray-400">
          <User className="w-4 h-4 cursor-pointer hover:text-gray-600" />
          <Hand className="w-4 h-4 cursor-pointer hover:text-gray-600" />
          <MessageCircle className="w-4 h-4 cursor-pointer hover:text-gray-600" />
          <TrendingUp className="w-4 h-4 cursor-pointer hover:text-gray-600" />
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          Sum
          <ChevronDown className="w-3 h-3" />
        </div>
      </BaseNodeFooter>

      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}
