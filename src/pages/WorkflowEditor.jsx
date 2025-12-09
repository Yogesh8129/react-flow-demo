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
import { ArrowLeft, Check, Pencil, Save, Power } from "lucide-react";

// New telemetry node components
import DeviceSelectorNode from "../components/nodes/DeviceSelectorNode";
import RuleNode from "../components/nodes/RuleNode";
import EmailActionNode from "../components/nodes/EmailActionNode";
import SmsActionNode from "../components/nodes/SmsActionNode";

// Form modal
import NodeFormModal from "../components/forms/NodeFormModal";

// Constants and store
import { NODE_TYPES, NODE_CONFIG, getDefaultNodeData } from "../constants/nodeConfig";
import {
  selectWorkflowById,
  setActiveWorkflow,
  setNodes as setStoreNodes,
  setEdges as setStoreEdges,
  updateWorkflow,
  toggleWorkflowEnabled,
} from "../store/workflowsSlice";

// Register new node types
const nodeTypes = {
  deviceSelector: DeviceSelectorNode,
  rule: RuleNode,
  emailAction: EmailActionNode,
  smsAction: SmsActionNode,
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

  // Refs for tracking initialization
  const initialized = useRef(false);
  const workflowIdRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Modal state for node editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNodeType, setPendingNodeType] = useState(null);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [modalInitialValues, setModalInitialValues] = useState({});

  // Workflow name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved");
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

  // Toggle workflow enabled status
  const handleToggleEnabled = useCallback(() => {
    if (!workflow) return;
    dispatch(toggleWorkflowEnabled(workflow.id));
  }, [workflow, dispatch]);

  // Get display values
  const displayName = workflow?.name || "Untitled Workflow";
  const displayDescription = workflow?.description || "Configure device monitoring rules and actions";

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle "Add Node" button click - opens modal with defaults
  const handleAddNodeClick = useCallback((nodeType) => {
    setPendingNodeType(nodeType);
    setEditingNodeId(null);
    setModalInitialValues(getDefaultNodeData(nodeType));
    setIsModalOpen(true);
  }, []);

  // Handle node double-click - opens modal for editing
  const handleNodeDoubleClick = useCallback((event, node) => {
    setPendingNodeType(node.type);
    setEditingNodeId(node.id);
    setModalInitialValues(node.data);
    setIsModalOpen(true);
  }, []);

  // Handle modal submit - create new or update existing node
  const handleModalSubmit = useCallback(
    (values) => {
      if (editingNodeId) {
        // Update existing node
        setNodes((nds) =>
          nds.map((n) =>
            n.id === editingNodeId ? { ...n, data: values } : n
          )
        );
      } else {
        // Create new node
        const newNode = {
          id: `node-${Date.now()}`,
          type: pendingNodeType,
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          data: values,
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [editingNodeId, pendingNodeType, setNodes]
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingNodeType(null);
    setEditingNodeId(null);
    setModalInitialValues({});
  }, []);

  // Delete selected nodes/edges
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  const onPaneClick = useCallback(() => {
    // Deselect when clicking pane
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
      {/* Header */}
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
                      if (e.key === "Escape") setIsEditingName(false);
                    }}
                    className="text-xl font-bold text-gray-800 bg-white px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">{displayName}</h1>
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
              <p className="text-sm text-gray-500">{displayDescription}</p>
            </div>
          </div>

          {workflow && (
            <div className="flex items-center gap-3">
              {/* Enabled toggle */}
              <button
                onClick={handleToggleEnabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                  workflow.enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Power size={14} />
                {workflow.enabled ? "Enabled" : "Disabled"}
              </button>

              {/* Save status */}
              <span
                className={`text-sm flex items-center gap-1 ${
                  saveStatus === "saved"
                    ? "text-emerald-600"
                    : saveStatus === "saving"
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
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

      {/* Toolbar */}
      <div className="p-3 bg-white border-b border-gray-200 flex gap-2 items-center flex-wrap">
        <span className="text-sm text-gray-500 mr-2">Add:</span>
        {Object.entries(NODE_CONFIG).map(([type, config]) => (
          <button
            key={type}
            onClick={() => handleAddNodeClick(type)}
            className="px-3 py-1.5 text-sm rounded-md border transition-colors"
            style={{
              borderColor: config.color,
              color: config.color,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = config.color;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = config.color;
            }}
          >
            {config.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={deleteSelected}
          className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
        >
          Delete Selected
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={handleNodeDoubleClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const config = NODE_CONFIG[node.type];
              return config?.color || "#e5e7eb";
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background gap={32} />
        </ReactFlow>
      </div>

      {/* Node Form Modal */}
      <NodeFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        nodeType={pendingNodeType}
        initialValues={modalInitialValues}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
