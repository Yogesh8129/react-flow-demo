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
import "./App.css";
import "./components/nodes.css";

// Custom node types
import BetNode from "./components/BetNode";
import MetricNode from "./components/MetricNode";

// Register custom nodes - defined outside component to prevent re-renders
const nodeTypes = {
  betNode: BetNode,
  metricNode: MetricNode,
};

// Default edge style - dashed line matching the design
const defaultEdgeOptions = {
  type: "smoothstep",
  style: {
    stroke: "#888",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#888",
  },
};

// Sample data matching the design screenshots
const initialNodes = [
  {
    id: "1",
    type: "metricNode",
    position: { x: 100, y: 50 },
    data: {
      title: "Seat expansion revenue",
      tag: "Data science AI agent",
      metrics: [
        { label: "Past 7 days", value: "$9.1K", change: "0.03%" },
        { label: "Past 6 weeks", value: "$54.2K", change: "10.95%" },
        { label: "Past 12 months", value: "$395.6K", change: "46.97%" },
      ],
    },
  },
  {
    id: "2",
    type: "betNode",
    position: { x: 100, y: 420 },
    data: {
      title: "Expand through seats added",
      tag: "Bet ideator AI agent",
    },
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function FlowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  
  const [nodeName, setNodeName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [updateLabel, setUpdateLabel] = useState("");

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // CREATE: Add a new node (defaults to betNode type)
  const addNode = useCallback(() => {
    if (!nodeName.trim()) return;
    const newNode = {
      id: `node-${Date.now()}`,
      type: "betNode",
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: {
        title: nodeName,
        tag: "New agent",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeName("");
  }, [nodeName, setNodes]);

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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Control Panel */}
      <div className="control-panel">
        {/* CREATE: Add Node */}
        <div className="section">
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node label"
            className="input"
          />
          <button onClick={addNode} className="button">
            Add Node
          </button>
        </div>

        {/* DELETE: Remove Selected */}
        <button onClick={deleteSelected} className="delete-button">
          Delete Selected
        </button>

        {/* UPDATE: Edit Selected Node */}
        {selectedNode && (
          <div className="section">
            <span className="label">Editing: {selectedNode.data.title}</span>
            <input
              type="text"
              value={updateLabel}
              onChange={(e) => setUpdateLabel(e.target.value)}
              placeholder="New title"
              className="input"
            />
            <button onClick={updateNodeTitle} className="button">
              Update
            </button>
          </div>
        )}
      </div>

      {/* React Flow Canvas */}
      <div className="flow-container">
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
