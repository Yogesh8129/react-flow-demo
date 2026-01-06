import { memo } from "react";
import { Position } from "reactflow";
import { MessageSquare } from "lucide-react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node";
import { BaseHandle } from "../base-handle";
import type { SmsActionNodeData } from "@/types";

interface SmsActionNodeProps {
  data: SmsActionNodeData;
}

function SmsActionNode({ data }: SmsActionNodeProps) {
  const { recipients = [] } = data;

  return (
    <BaseNode
      className="w-[220px] border-l-4"
      style={{ borderLeftColor: "#8b5cf6" }}
    >
      <BaseHandle type="target" position={Position.Left} id="left" />

      <BaseNodeHeader className="bg-violet-50 dark:bg-violet-950/50">
        <MessageSquare
          size={16}
          className="text-violet-600 dark:text-violet-400"
        />
        <BaseNodeHeaderTitle className="text-violet-900 dark:text-violet-100 text-sm">
          SMS Action
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {recipients.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {recipients.slice(0, 2).map((phone, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 text-xs rounded"
              >
                {phone}
              </span>
            ))}
            {recipients.length > 2 && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                +{recipients.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No recipients configured
          </p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

export default memo(SmsActionNode);
