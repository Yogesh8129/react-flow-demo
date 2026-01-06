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
import {
  mockReferenceData,
  formatSelection,
  hasAnySelection,
} from "@/mocks/referenceData";
import type { DeviceSelectorNodeData } from "@/types";

interface DeviceSelectorNodeProps {
  data: DeviceSelectorNodeData;
}

function DeviceSelectorNode({ data }: DeviceSelectorNodeProps) {
  const { plants = [], assetTypes = [], assets = [] } = data;
  const hasSelection = hasAnySelection({ plants, assetTypes, assets });

  return (
    <BaseNode
      className="w-[240px] border-l-4 border-l-blue-500"
      style={{ borderLeftColor: "#3b82f6" }}
    >
      <BaseHandle type="source" position={Position.Right} id="right" />

      <BaseNodeHeader className="bg-blue-50 dark:bg-blue-950/50">
        <Monitor size={16} className="text-blue-600 dark:text-blue-400" />
        <BaseNodeHeaderTitle className="text-blue-900 dark:text-blue-100 text-sm">
          Device Selector
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        {hasSelection ? (
          <div className="space-y-1.5">
            {plants.length > 0 && (
              <FilterRow
                label="Plants"
                values={plants}
                options={mockReferenceData.plants}
                colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              />
            )}

            {assetTypes.length > 0 && (
              <FilterRow
                label="Types"
                values={assetTypes}
                options={mockReferenceData.assetTypes}
                colorClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
              />
            )}

            {assets.length > 0 && (
              <FilterRow
                label="Assets"
                values={assets}
                options={mockReferenceData.assets}
                colorClass="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
              />
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No devices selected
          </p>
        )}
      </BaseNodeContent>
    </BaseNode>
  );
}

interface FilterRowProps {
  label: string;
  values: string[];
  options: Array<{ value: string; label: string }>;
  colorClass: string;
}

function FilterRow({ label, values, options, colorClass }: FilterRowProps) {
  const displayText = formatSelection(values, options, 2);

  return (
    <div className="flex items-start gap-1.5">
      <span className="text-[10px] text-muted-foreground font-medium min-w-[38px] pt-0.5">
        {label}:
      </span>
      <span className={`text-xs px-1.5 py-0.5 rounded ${colorClass}`}>
        {displayText}
      </span>
    </div>
  );
}

export default memo(DeviceSelectorNode);
