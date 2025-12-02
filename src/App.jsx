import React, { useState, useCallback } from "react";
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Start" } },
  { id: "2", position: { x: 200, y: 100 }, data: { label: "Process" } },
  { id: "3", position: { x: 400, y: 0 }, data: { label: "End" } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
];

const styles = {
  controlPanel: {
    padding: "10px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  section: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    padding: "8px 16px",
    background: "#4a90d9",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteButton: {
    padding: "8px 16px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
};

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

  // CREATE: Add a new node
  const addNode = useCallback(() => {
    if (!nodeName.trim()) return;
    const newNode = {
      id: `node-${Date.now()}`,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { label: nodeName },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeName("");
  }, [nodeName, setNodes]);

  // UPDATE: Update selected node's label
  const updateNodeLabel = useCallback(() => {
    if (!selectedNode || !updateLabel.trim()) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: updateLabel } }
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
    setUpdateLabel(node.data.label);
  }, []);

  // Event: When clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setUpdateLabel("");
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Control Panel */}
      <div style={styles.controlPanel}>
        {/* CREATE: Add Node */}
        <div style={styles.section}>
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node label"
            style={styles.input}
          />
          <button onClick={addNode} style={styles.button}>
            Add Node
          </button>
        </div>

        {/* DELETE: Remove Selected */}
        <button onClick={deleteSelected} style={styles.deleteButton}>
          Delete Selected
        </button>

        {/* UPDATE: Edit Selected Node */}
        {selectedNode && (
          <div style={styles.section}>
            <span style={styles.label}>Editing: {selectedNode.data.label}</span>
            <input
              type="text"
              value={updateLabel}
              onChange={(e) => setUpdateLabel(e.target.value)}
              placeholder="New label"
              style={styles.input}
            />
            <button onClick={updateNodeLabel} style={styles.button}>
              Update
            </button>
          </div>
        )}
      </div>

      {/* React Flow Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
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
