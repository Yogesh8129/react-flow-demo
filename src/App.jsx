import { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node types
import MetricNode from "./components/MetricNode";
import BetNode from "./components/BetNode";

// Register custom nodes - defined outside component to prevent re-renders
const nodeTypes = {
  metricNode: MetricNode,
  betNode: BetNode,
};

// Default edge style - curved bezier line
const defaultEdgeOptions = {
  type: "default",
  style: {
    stroke: "#888",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#888",
  },
};

// Pen Factory Workflow Data
const initialNodes = [
  {
    id: "raw-materials",
    type: "metricNode",
    position: { x: 100, y: 50 },
    data: {
      title: "Raw Materials Inventory",
      tag: "Inventory Manager",
      metrics: [
        { label: "Ink Cartridges", value: "12,450", change: "2.3%" },
        { label: "Plastic Barrels", value: "8,200", change: "1.1%" },
        { label: "Metal Tips", value: "15,800", change: "3.5%" },
      ],
    },
  },
  {
    id: "production",
    type: "metricNode",
    position: { x: 500, y: 50 },
    data: {
      title: "Production Line Status",
      tag: "Production Lead",
      metrics: [
        { label: "Daily Output", value: "2,400", change: "5.2%" },
        { label: "Efficiency", value: "94.5%", change: "1.8%" },
        { label: "Defect Rate", value: "0.8%", change: "-0.3%" },
      ],
    },
  },
  {
    id: "quality",
    type: "metricNode",
    position: { x: 100, y: 400 },
    data: {
      title: "Quality Control",
      tag: "QC Inspector",
      metrics: [
        { label: "Pass Rate", value: "99.2%", change: "0.4%" },
        { label: "Tested Today", value: "2,380", change: "4.8%" },
        { label: "Rejected", value: "19", change: "-12%" },
      ],
    },
  },
  {
    id: "finished-goods",
    type: "metricNode",
    position: { x: 500, y: 400 },
    data: {
      title: "Finished Goods Inventory",
      tag: "Warehouse Manager",
      metrics: [
        { label: "Ready to Ship", value: "45,200", change: "8.1%" },
        { label: "Packed Today", value: "2,350", change: "5.0%" },
        { label: "Pending Orders", value: "12,800", change: "15.2%" },
      ],
    },
  },
  {
    id: "strategic-goal",
    type: "betNode",
    position: { x: 300, y: 720 },
    data: {
      title: "Increase production output by 20%",
      tag: "Operations Director",
      status: "In Progress",
    },
  },
];

const initialEdges = [
  { id: "e-raw-prod", source: "raw-materials", target: "production" },
  { id: "e-prod-quality", source: "production", target: "quality" },
  { id: "e-quality-finished", source: "quality", target: "finished-goods" },
  { id: "e-finished-goal", source: "finished-goods", target: "strategic-goal" },
];

export default function FlowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // CRUD State
  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState("betNode");
  const [selectedNode, setSelectedNode] = useState(null);
  const [updateLabel, setUpdateLabel] = useState("");

  // Connect nodes
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // CREATE: Add a new node
  const addNode = useCallback(() => {
    if (!nodeName.trim()) return;

    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data:
        nodeType === "betNode"
          ? { title: nodeName, tag: "New Owner", status: "Active" }
          : {
              title: nodeName,
              tag: "New Owner",
              metrics: [
                { label: "Metric 1", value: "0", change: "0%" },
                { label: "Metric 2", value: "0", change: "0%" },
                { label: "Metric 3", value: "0", change: "0%" },
              ],
            },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeName("");
  }, [nodeName, nodeType, setNodes]);

  // UPDATE: Update selected node's title
  const updateNodeTitle = useCallback(() => {
    if (!selectedNode || !updateLabel.trim()) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, title: updateLabel } }
          : node
      )
    );
    setUpdateLabel("");
    setSelectedNode(null);
  }, [selectedNode, updateLabel, setNodes]);

  // DELETE: Remove selected nodes and edges
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Event: When a node is clicked
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setUpdateLabel(node.data.title || "");
  }, []);

  // Event: When clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setUpdateLabel("");
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          Pen Factory - Production Workflow
        </h1>
        <p className="text-sm text-gray-500">
          Real-time manufacturing metrics dashboard
        </p>
      </div>

      {/* CRUD Control Panel */}
      <div className="p-3 bg-white border-b border-gray-200 flex gap-4 items-center flex-wrap">
        {/* CREATE */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node title"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="betNode">Goal Node</option>
            <option value="metricNode">Metric Node</option>
          </select>
          <button
            onClick={addNode}
            className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors"
          >
            Add Node
          </button>
        </div>

        {/* DELETE */}
        <button
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
        >
          Delete Selected
        </button>

        {/* UPDATE */}
        {selectedNode && (
          <div className="flex gap-2 items-center border-l border-gray-300 pl-4">
            <span className="text-sm text-gray-600">
              Editing: <strong>{selectedNode.data.title}</strong>
            </span>
            <input
              type="text"
              value={updateLabel}
              onChange={(e) => setUpdateLabel(e.target.value)}
              placeholder="New title"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={updateNodeTitle}
              className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* React Flow Canvas */}
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
          <Background gap={32} />
        </ReactFlow>
      </div>
    </div>
  );
}
