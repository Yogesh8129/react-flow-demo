import { Handle, Position } from "reactflow";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeContent,
  BaseNodeFooter,
} from "@/components/base-node";
import { User, Hand, MessageCircle, ChevronDown, ExternalLink, Target } from "lucide-react";

/**
 * BetNode - Strategic goal/bet card for workflow
 *
 * Displays a strategic goal or hypothesis with status badge.
 */
export default function BetNode({ data }) {
  return (
    <BaseNode className="min-w-[280px] max-w-[320px] border-l-4 border-l-purple-500">
      <Handle type="target" position={Position.Top} />

      {/* Header */}
      <BaseNodeHeader className="border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-purple-500 text-sm font-medium">
          <Target className="w-4 h-4" />
          <span>Goal</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" />
      </BaseNodeHeader>

      {/* Content */}
      <BaseNodeContent>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          {data.title}
        </h3>
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
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md text-sm font-medium">
          {data.status || "Active"}
          <ChevronDown className="w-3 h-3" />
        </div>
      </BaseNodeFooter>

      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}
