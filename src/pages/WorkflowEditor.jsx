import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { ArrowLeft, Check, Pencil, Save } from "lucide-react";

import InitiativeNode from "../components/InitiativeNode";
import MetricNode from "../components/MetricNode";
import KeyMetricNode from "../components/KeyMetricNode";
import BetNode from "../components/BetNode";
import {
  selectWorkflowById,
  setActiveWorkflow,
  setNodes as setStoreNodes,
  setEdges as setStoreEdges,
  updateWorkflow,
} from "../store/workflowsSlice";

const nodeTypes = {
  initiativeNode: InitiativeNode,
  metricNode: MetricNode,
  keyMetricNode: KeyMetricNode,
  betNode: BetNode,
};

const defaultEdgeOptions = {
  style: { stroke: "#888", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#888" },
};

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const workflow = useSelector(selectWorkflowById(id));
  const isNewWorkflow = id === "new";

  // Refs for tracking initialization and valid workflow
  const initialized = useRef(false);
  const workflowIdRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState("initiativeNode");
  const [selectedNode, setSelectedNode] = useState(null);
  const [updateLabel, setUpdateLabel] = useState("");

  // Workflow name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved"); // "saved" | "saving"
  const nameInputRef = useRef(null);

  // Initialize from Redux when workflow loads (only once per id)
  useEffect(() => {
    if (initialized.current) return;

    if (workflow) {
      dispatch(setActiveWorkflow(id));
      setNodes(workflow.nodes || []);
      setEdges(workflow.edges || []);
      workflowIdRef.current = id;
      initialized.current = true;
    } else if (isNewWorkflow) {
      dispatch(setActiveWorkflow(null));
      setNodes([]);
      setEdges([]);
      workflowIdRef.current = null;
      initialized.current = true;
    }
  }, [workflow, id, isNewWorkflow, dispatch, setNodes, setEdges]);

  // Reset refs when id changes
  useEffect(() => {
    initialized.current = false;
    workflowIdRef.current = null;
  }, [id]);

  // Sync nodes to Redux when they change (skip initial sync)
  useEffect(() => {
    if (!initialized.current || !workflowIdRef.current) return;
    dispatch(setStoreNodes(nodes));
  }, [nodes, dispatch]);

  // Sync edges to Redux when they change (skip initial sync)
  useEffect(() => {
    if (!initialized.current || !workflowIdRef.current) return;
    dispatch(setStoreEdges(edges));
  }, [edges, dispatch]);

  // Focus name input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Start editing workflow name
  const startEditingName = useCallback(() => {
    setEditingNameValue(workflow?.name || "Untitled Workflow");
    setIsEditingName(true);
  }, [workflow]);

  // Handle workflow name save
  const handleNameSave = useCallback(() => {
    if (!workflow || !editingNameValue.trim()) return;
    dispatch(updateWorkflow({ id: workflow.id, name: editingNameValue.trim() }));
    setIsEditingName(false);
  }, [workflow, editingNameValue, dispatch]);

  // Handle explicit save button click
  const handleSave = useCallback(() => {
    if (!workflow) return;
    setSaveStatus("saving");
    dispatch(setStoreNodes(nodes));
    dispatch(setStoreEdges(edges));
    if (editingNameValue.trim()) {
      dispatch(updateWorkflow({ id: workflow.id, name: editingNameValue.trim() }));
    }
    setTimeout(() => setSaveStatus("saved"), 500);
  }, [workflow, nodes, edges, editingNameValue, dispatch]);

  // Get display name
  const displayName = workflow?.name || "Untitled Workflow";

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleAddNode = useCallback(() => {
    if (!nodeName.trim()) return;
    const nodeData = {
      initiativeNode: { title: nodeName, timeEstimate: "4 hours", progress: 0 },
      metricNode: {
        title: nodeName,
        tag: "New",
        metrics: [
          { label: "Value", value: "0", change: "0%" },
          { label: "Value", value: "0", change: "0%" },
          { label: "Value", value: "0", change: "0%" },
        ],
      },
      keyMetricNode: {
        title: nodeName,
        tag: "Key Metric",
        metrics: [
          { label: "Value", value: "0", change: "0%" },
          { label: "Value", value: "0", change: "0%" },
          { label: "Value", value: "0", change: "0%" },
        ],
      },
      betNode: { title: nodeName, tag: "Owner", status: "Active" },
    };
    setNodes((nds) => [
      ...nds,
      {
        id: `node-${Date.now()}`,
        type: nodeType,
        position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 100 },
        data: nodeData[nodeType],
      },
    ]);
    setNodeName("");
  }, [nodeName, nodeType, setNodes]);

  const updateNodeTitle = useCallback(() => {
    if (!selectedNode || !updateLabel.trim()) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, title: updateLabel } } : n
      )
    );
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

  // Handle case where workflow doesn't exist
  if (!workflow && !isNewWorkflow) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Workflow not found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-emerald-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={editingNameValue}
                    onChange={(e) => setEditingNameValue(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameSave();
                      if (e.key === "Escape") {
                        setIsEditingName(false);
                      }
                    }}
                    className="text-xl font-bold text-gray-800 bg-white px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    {displayName}
                  </h1>
                  {workflow && (
                    <button
                      onClick={startEditingName}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500">
                {isNewWorkflow
                  ? "Create a new workflow"
                  : "Initiatives → Metrics → Key Driver → Outcomes"}
              </p>
            </div>
          </div>

          {workflow && (
            <div className="flex items-center gap-3">
              <span className={`text-sm flex items-center gap-1 ${
                saveStatus === "saved" ? "text-emerald-600" :
                saveStatus === "saving" ? "text-amber-500" : "text-gray-400"
              }`}>
                {saveStatus === "saved" && <Check size={16} />}
                {saveStatus === "saved" ? "Saved" : saveStatus === "saving" ? "Saving..." : "Unsaved"}
              </span>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-white border-b border-gray-200 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node title"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="initiativeNode">Initiative</option>
            <option value="metricNode">Metric</option>
            <option value="keyMetricNode">Key Metric</option>
            <option value="betNode">Goal</option>
          </select>
          <button
            onClick={handleAddNode}
            className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600"
          >
            Add
          </button>
        </div>
        <button
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
        >
          Delete
        </button>
        {selectedNode && (
          <div className="flex gap-2 items-center border-l pl-4">
            <span className="text-sm">
              Editing: <strong>{selectedNode.data.title}</strong>
            </span>
            <input
              type="text"
              value={updateLabel}
              onChange={(e) => setUpdateLabel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={updateNodeTitle}
              className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm"
            >
              Update
            </button>
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
                case "initiativeNode":
                  return "#fbbf24";
                case "keyMetricNode":
                  return "#4ade80";
                case "betNode":
                  return "#a855f7";
                default:
                  return "#e5e7eb";
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
