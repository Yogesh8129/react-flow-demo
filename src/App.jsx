import { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node types
import InitiativeNode from "./components/InitiativeNode";
import MetricNode from "./components/MetricNode";
import KeyMetricNode from "./components/KeyMetricNode";
import BetNode from "./components/BetNode";

// Register custom nodes
const nodeTypes = {
  initiativeNode: InitiativeNode,
  metricNode: MetricNode,
  keyMetricNode: KeyMetricNode,
  betNode: BetNode,
};

// Default edge style
const defaultEdgeOptions = {
  type: "default",
  style: { stroke: "#888", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#888" },
};

// Pen Factory Causality Workflow
// Layout: Initiatives (yellow) → Metrics (white) → Key Driver (green) → Outcomes (white)
const initialNodes = [
  // LEFT - Initiatives (Yellow)
  {
    id: "init-1",
    type: "initiativeNode",
    position: { x: 50, y: 30 },
    data: { title: "Optimize ink mixing process", timeEstimate: "4 hours", progress: 80 },
  },
  {
    id: "init-2",
    type: "initiativeNode",
    position: { x: 50, y: 200 },
    data: { title: "Upgrade assembly machines", timeEstimate: "8 hours", progress: 60 },
  },
  {
    id: "init-3",
    type: "initiativeNode",
    position: { x: 50, y: 370 },
    data: { title: "Install quality sensors", timeEstimate: "6 hours", progress: 40 },
  },

  // MIDDLE-LEFT - Leading Metrics (White)
  {
    id: "metric-rate",
    type: "metricNode",
    position: { x: 380, y: 30 },
    data: {
      title: "Production Rate",
      tag: "Operations",
      metrics: [
        { label: "Per Hour", value: "142", change: "3.2%" },
        { label: "Per Shift", value: "1,136", change: "2.8%" },
        { label: "Per Day", value: "2,400", change: "5.1%" },
      ],
    },
  },
  {
    id: "metric-quality",
    type: "metricNode",
    position: { x: 380, y: 370 },
    data: {
      title: "Quality Score",
      tag: "QC Team",
      metrics: [
        { label: "Pass Rate", value: "99.2%", change: "0.4%" },
        { label: "Defect Rate", value: "0.8%", change: "-0.3%" },
        { label: "Rework", value: "12", change: "-15%" },
      ],
    },
  },

  // CENTER - Key Driver (Green)
  {
    id: "key-metric",
    type: "keyMetricNode",
    position: { x: 750, y: 180 },
    data: {
      title: "Daily Production Output",
      tag: "Key Performance Driver",
      metrics: [
        { label: "Today", value: "2,400", change: "5.2%" },
        { label: "This Week", value: "11,850", change: "4.1%" },
        { label: "This Month", value: "48,200", change: "8.3%" },
      ],
    },
  },

  // RIGHT - Outcomes (White)
  {
    id: "outcome-inventory",
    type: "metricNode",
    position: { x: 1120, y: 30 },
    data: {
      title: "Finished Goods",
      tag: "Warehouse",
      metrics: [
        { label: "In Stock", value: "45,200", change: "8.1%" },
        { label: "Packed", value: "2,350", change: "5.0%" },
        { label: "Pending", value: "12,800", change: "15.2%" },
      ],
    },
  },
  {
    id: "outcome-revenue",
    type: "metricNode",
    position: { x: 1120, y: 370 },
    data: {
      title: "Revenue & Margin",
      tag: "Finance",
      metrics: [
        { label: "Revenue", value: "$2.4M", change: "12.5%" },
        { label: "Cost/Unit", value: "$0.12", change: "-3.2%" },
        { label: "Margin", value: "34.5%", change: "2.1%" },
      ],
    },
  },

  // BOTTOM - Strategic Goal
  {
    id: "goal",
    type: "betNode",
    position: { x: 750, y: 520 },
    data: {
      title: "Increase production output by 20%",
      tag: "Operations Director",
      status: "In Progress",
    },
  },
];

// Edges with handle connections
const initialEdges = [
  // Initiatives → Metrics
  { id: "e1", source: "init-1", sourceHandle: "right", target: "metric-rate", targetHandle: "left" },
  { id: "e2", source: "init-2", sourceHandle: "right", target: "metric-rate", targetHandle: "left" },
  { id: "e3", source: "init-3", sourceHandle: "right", target: "metric-quality", targetHandle: "left" },

  // Metrics → Key Driver
  { id: "e4", source: "metric-rate", sourceHandle: "right", target: "key-metric", targetHandle: "left" },
  { id: "e5", source: "metric-quality", sourceHandle: "right", target: "key-metric", targetHandle: "left" },

  // Key Driver → Outcomes
  { id: "e6", source: "key-metric", sourceHandle: "right", target: "outcome-inventory", targetHandle: "left" },
  { id: "e7", source: "key-metric", sourceHandle: "right", target: "outcome-revenue", targetHandle: "left" },

  // Outcomes → Goal
  { id: "e8", source: "outcome-inventory", sourceHandle: "bottom", target: "goal", targetHandle: "top" },
  { id: "e9", source: "outcome-revenue", sourceHandle: "bottom", target: "goal", targetHandle: "top" },
];

export default function FlowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState("initiativeNode");
  const [selectedNode, setSelectedNode] = useState(null);
  const [updateLabel, setUpdateLabel] = useState("");

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    if (!nodeName.trim()) return;
    const nodeData = {
      initiativeNode: { title: nodeName, timeEstimate: "4 hours", progress: 0 },
      metricNode: { title: nodeName, tag: "New", metrics: [{ label: "Value", value: "0", change: "0%" }, { label: "Value", value: "0", change: "0%" }, { label: "Value", value: "0", change: "0%" }] },
      keyMetricNode: { title: nodeName, tag: "Key Metric", metrics: [{ label: "Value", value: "0", change: "0%" }, { label: "Value", value: "0", change: "0%" }, { label: "Value", value: "0", change: "0%" }] },
      betNode: { title: nodeName, tag: "Owner", status: "Active" },
    };
    setNodes((nds) => [...nds, {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 100 },
      data: nodeData[nodeType],
    }]);
    setNodeName("");
  }, [nodeName, nodeType, setNodes]);

  const updateNodeTitle = useCallback(() => {
    if (!selectedNode || !updateLabel.trim()) return;
    setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, title: updateLabel } } : n));
    setUpdateLabel("");
    setSelectedNode(null);
  }, [selectedNode, updateLabel, setNodes]);

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setUpdateLabel(node.data.title || "");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setUpdateLabel("");
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Pen Factory - Causality Workflow</h1>
        <p className="text-sm text-gray-500">Initiatives → Metrics → Key Driver → Outcomes</p>
      </div>

      <div className="p-3 bg-white border-b border-gray-200 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <input type="text" value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node title" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
          <select value={nodeType} onChange={(e) => setNodeType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="initiativeNode">Initiative</option>
            <option value="metricNode">Metric</option>
            <option value="keyMetricNode">Key Metric</option>
            <option value="betNode">Goal</option>
          </select>
          <button onClick={addNode} className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600">Add</button>
        </div>
        <button onClick={deleteSelected} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
        {selectedNode && (
          <div className="flex gap-2 items-center border-l pl-4">
            <span className="text-sm">Editing: <strong>{selectedNode.data.title}</strong></span>
            <input type="text" value={updateLabel} onChange={(e) => setUpdateLabel(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button onClick={updateNodeTitle} className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm">Update</button>
          </div>
        )}
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'initiativeNode': return '#fbbf24';
                case 'keyMetricNode': return '#4ade80';
                case 'betNode': return '#a855f7';
                default: return '#e5e7eb';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background gap={32} />
        </ReactFlow>
      </div>
    </div>
  );
}
