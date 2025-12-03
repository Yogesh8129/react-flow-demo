import { Position } from "reactflow";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeContent,
} from "@/components/base-node";
import { BaseHandle } from "@/components/base-handle";
import { Lightbulb, ChevronDown, ExternalLink } from "lucide-react";

/**
 * InitiativeNode - Yellow task/initiative card with progress bar
 * Used for actions/tasks that drive metrics
 */
export default function InitiativeNode({ data }) {
  const progress = data.progress || 0;

  return (
    <BaseNode className="min-w-[260px] max-w-[280px] border-l-4 border-l-amber-400 bg-amber-50">
      {/* Handles */}
      <BaseHandle id="top" type="target" position={Position.Top} />
      <BaseHandle id="bottom" type="source" position={Position.Bottom} />
      <BaseHandle id="left" type="target" position={Position.Left} />
      <BaseHandle id="right" type="source" position={Position.Right} />

      {/* Header */}
      <BaseNodeHeader className="border-b border-amber-200">
        <div className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
          <Lightbulb className="w-4 h-4" />
          <span>Initiative</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        <ExternalLink className="w-4 h-4 text-amber-400 cursor-pointer" />
      </BaseNodeHeader>

      {/* Content */}
      <BaseNodeContent>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {data.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{data.timeEstimate || "—"}</span>
            <span>{progress}% done</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </BaseNodeContent>
    </BaseNode>
  );
}
