import { Handle, Position } from "reactflow";

/**
 * NodeCard - Shared shell for all custom nodes
 *
 * Uses composition: common structure here, specific content via children.
 * Props control the variable parts (icon, type label, tag text, footer content).
 */
export default function NodeCard({
  icon,
  type,
  tag,
  footer,
  accentColor = "#8b5cf6",
  children,
}) {
  return (
    <div className="node-card" style={{ "--accent-color": accentColor }}>
      {/* Connection handle - top */}
      <Handle type="target" position={Position.Top} />

      {/* Header */}
      <div className="node-header">
        <div className="node-header-left">
          {icon}
          <span>{type}</span>
          <span className="node-header-arrow">▼</span>
        </div>
        <span className="node-header-link">↗</span>
      </div>

      {/* Body - node-specific content */}
      <div className="node-body">
        {children}

        {/* Tag */}
        {tag && (
          <div className="node-tag">
            <span>{tag}</span>
            <span className="node-tag-close">✕</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="node-footer">{footer}</div>

      {/* Connection handle - bottom */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
