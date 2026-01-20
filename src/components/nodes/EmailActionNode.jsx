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

function EmailActionNode({ data }) {
  const { recipients = [], template_id = "" } = data;

  return (
    <BaseNode
      className="w-[220px] border-l-4"
      style={{ borderLeftColor: "#10b981" }}
    >
      {/* Input handle only (left side) */}
      <BaseHandle type="target" position={Position.Left} id="left" />

      <BaseNodeHeader className="bg-emerald-50">
        <Mail size={16} className="text-emerald-600" />
        <BaseNodeHeaderTitle className="text-emerald-900 text-sm">
          Email Action
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {recipients.length > 0 ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {recipients.slice(0, 2).map((email, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded truncate max-w-[180px]"
                >
                  {email}
                </span>
              ))}
              {recipients.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  +{recipients.length - 2} more
                </span>
              )}
            </div>
            {template_id && (
              <p className="text-xs text-gray-500">
                Template: <span className="font-mono">{template_id}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No recipients configured</p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

export default memo(EmailActionNode);
