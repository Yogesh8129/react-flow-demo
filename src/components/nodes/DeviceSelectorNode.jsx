import { memo } from "react";
import { Position } from "reactflow";
import { Monitor } from "lucide-react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node";
import { BaseHandle } from "../base-handle";

function DeviceSelectorNode({ data }) {
  const { tags = [] } = data;

  return (
    <BaseNode
      className="w-[220px] border-l-4 border-l-blue-500"
      style={{ borderLeftColor: "#3b82f6" }}
    >
      {/* Output handle only (right side) */}
      <BaseHandle type="source" position={Position.Right} id="right" />

      <BaseNodeHeader className="bg-blue-50">
        <Monitor size={16} className="text-blue-600" />
        <BaseNodeHeaderTitle className="text-blue-900 text-sm">
          Device Selector
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No tags configured</p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

export default memo(DeviceSelectorNode);
