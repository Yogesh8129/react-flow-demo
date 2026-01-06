import { memo } from "react";
import { Position } from "reactflow";
import { Mail } from "lucide-react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node";
import { BaseHandle } from "../base-handle";
import type { EmailActionNodeData } from "@/types";

interface EmailActionNodeProps {
  data: EmailActionNodeData;
}

function EmailActionNode({ data }: EmailActionNodeProps) {
  const { recipients = [] } = data;

  return (
    <BaseNode
      className="w-[220px] border-l-4"
      style={{ borderLeftColor: "#10b981" }}
    >
      <BaseHandle type="target" position={Position.Left} id="left" />

      <BaseNodeHeader className="bg-emerald-50 dark:bg-emerald-950/50">
        <Mail size={16} className="text-emerald-600 dark:text-emerald-400" />
        <BaseNodeHeaderTitle className="text-emerald-900 dark:text-emerald-100 text-sm">
          Email Action
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {recipients.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {recipients.slice(0, 2).map((email, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs rounded truncate max-w-[180px]"
              >
                {email}
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

export default memo(EmailActionNode);
