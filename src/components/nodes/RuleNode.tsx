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
import { getParameterUnit, getParameterLabel } from "@/mocks/referenceData";
import type { RuleNodeData } from "@/types";

interface RuleNodeProps {
  data: RuleNodeData;
}

function RuleNode({ data }: RuleNodeProps) {
  const {
    parameter = "",
    comparator = ">",
    threshold = 0,
    duration_seconds = 60,
    aggregation = "avg",
  } = data;

  const hasConfig = parameter.length > 0;
  const unit = parameter ? getParameterUnit(parameter) : null;
  const paramLabel = parameter ? getParameterLabel(parameter) : "";

  return (
    <BaseNode
      className="w-[220px] border-l-4"
      style={{ borderLeftColor: "#f59e0b" }}
    >
      <BaseHandle type="target" position={Position.Left} id="left" />
      <BaseHandle type="source" position={Position.Right} id="right" />

      <BaseNodeHeader className="bg-amber-50 dark:bg-amber-950/50">
        <GitBranch size={16} className="text-amber-600 dark:text-amber-400" />
        <BaseNodeHeaderTitle className="text-amber-900 dark:text-amber-100 text-sm">
          Rule
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {hasConfig ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-card-foreground">
              {paramLabel} {comparator} {threshold}
              {unit && (
                <span className="text-muted-foreground ml-0.5">{unit}</span>
              )}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded font-medium">
                {aggregation}
              </span>
              <span>for {formatDuration(duration_seconds)}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No rule configured
          </p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "instant";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

export default memo(RuleNode);
