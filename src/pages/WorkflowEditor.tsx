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
  type Connection,
  type NodeMouseHandler,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Check, Pencil, Save, Power, Play } from "lucide-react";

import DeviceSelectorNode from "../components/nodes/DeviceSelectorNode";
import RuleNode from "../components/nodes/RuleNode";
import EmailActionNode from "../components/nodes/EmailActionNode";
import SmsActionNode from "../components/nodes/SmsActionNode";

import NodeFormModal from "../components/forms/NodeFormModal";
import SimulationModal from "../components/SimulationModal";
import useSimulation from "../hooks/useSimulation";

import {
  NODE_CONFIG,
  getDefaultNodeData,
} from "../constants/nodeConfig";
import {
  selectWorkflowById,
  setActiveWorkflow,
  setNodes as setStoreNodes,
  setEdges as setStoreEdges,
  updateWorkflow,
  toggleWorkflowEnabled,
} from "../store/workflowsSlice";
import type { RootState } from "../store";
import type { NodeType, WorkflowNodeData, Workflow } from "@/types";

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

type SaveStatus = "saved" | "saving" | "unsaved";

export default function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const workflow = useSelector((state: RootState) =>
    id ? selectWorkflowById(id)(state) : undefined
  );
  const isNewWorkflow = id === "new";

  const initialized = useRef(false);
  const workflowIdRef = useRef<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNodeType, setPendingNodeType] = useState<NodeType | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<
    WorkflowNodeData | Record<string, never>
  >({});

  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescriptionValue, setEditingDescriptionValue] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const {
    isRunning: isSimulationRunning,
    currentStep,
    stepDetails,
    progress,
    runSimulation,
    resetSimulation,
  } = useSimulation();

  useEffect(() => {
    if (initialized.current) return;

    if (workflow) {
      dispatch(setActiveWorkflow(id ?? null));
      setNodes(workflow.nodes || []);
      setEdges(workflow.edges || []);
      workflowIdRef.current = id ?? null;
      initialized.current = true;
    } else if (isNewWorkflow) {
      dispatch(setActiveWorkflow(null));
      setNodes([]);
      setEdges([]);
      workflowIdRef.current = null;
      initialized.current = true;
    }
  }, [workflow, id, isNewWorkflow, dispatch, setNodes, setEdges]);

  useEffect(() => {
    initialized.current = false;
    workflowIdRef.current = null;
  }, [id]);

  useEffect(() => {
    if (!initialized.current || !workflowIdRef.current) return;
    dispatch(setStoreNodes(nodes));
  }, [nodes, dispatch]);

  useEffect(() => {
    if (!initialized.current || !workflowIdRef.current) return;
    dispatch(setStoreEdges(edges));
  }, [edges, dispatch]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  const startEditingName = useCallback(() => {
    setEditingNameValue(workflow?.name || "Untitled Workflow");
    setIsEditingName(true);
  }, [workflow]);

  const handleNameSave = useCallback(() => {
    if (!workflow || !editingNameValue.trim()) return;
    dispatch(
      updateWorkflow({ id: workflow.id, name: editingNameValue.trim() })
    );
    setIsEditingName(false);
  }, [workflow, editingNameValue, dispatch]);

  const startEditingDescription = useCallback(() => {
    setEditingDescriptionValue(workflow?.description || "");
    setIsEditingDescription(true);
  }, [workflow]);

  const handleDescriptionSave = useCallback(() => {
    if (!workflow) return;
    dispatch(
      updateWorkflow({
        id: workflow.id,
        description: editingDescriptionValue.trim(),
      })
    );
    setIsEditingDescription(false);
  }, [workflow, editingDescriptionValue, dispatch]);

  const handleSave = useCallback(() => {
    if (!workflow) return;
    setSaveStatus("saving");
    dispatch(setStoreNodes(nodes));
    dispatch(setStoreEdges(edges));
    if (editingNameValue.trim()) {
      dispatch(
        updateWorkflow({ id: workflow.id, name: editingNameValue.trim() })
      );
    }
    setTimeout(() => setSaveStatus("saved"), 500);
  }, [workflow, nodes, edges, editingNameValue, dispatch]);

  const handleToggleEnabled = useCallback(() => {
    if (!workflow) return;
    dispatch(toggleWorkflowEnabled(workflow.id));
  }, [workflow, dispatch]);

  const handleRunSimulation = useCallback(() => {
    if (!workflow) return;
    const workflowWithCurrentNodes: Workflow = {
      ...workflow,
      nodes,
      edges,
    };
    runSimulation(workflowWithCurrentNodes);
  }, [workflow, nodes, edges, runSimulation]);

  const displayName = workflow?.name || "Untitled Workflow";
  const displayDescription =
    workflow?.description || "Configure device monitoring rules and actions";

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleAddNodeClick = useCallback((nodeType: NodeType) => {
    setPendingNodeType(nodeType);
    setEditingNodeId(null);
    setModalInitialValues(getDefaultNodeData(nodeType));
    setIsModalOpen(true);
  }, []);

  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setPendingNodeType(node.type as NodeType);
      setEditingNodeId(node.id);
      setModalInitialValues(node.data as WorkflowNodeData);
      setIsModalOpen(true);
    },
    []
  );

  const handleModalSubmit = useCallback(
    (values: WorkflowNodeData) => {
      if (editingNodeId) {
        setNodes((nds) =>
          nds.map((n) => (n.id === editingNodeId ? { ...n, data: values } : n))
        );
      } else if (pendingNodeType) {
        const newNode: Node = {
          id: `node-${Date.now()}`,
          type: pendingNodeType,
          position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
          },
          data: values,
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [editingNodeId, pendingNodeType, setNodes]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingNodeType(null);
    setEditingNodeId(null);
    setModalInitialValues({});
  }, []);

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  const onPaneClick = useCallback(() => {
    // Deselect when clicking pane
  }, []);

  if (!workflow && !isNewWorkflow) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">
            Workflow not found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <ArrowLeft size={20} className="text-muted-foreground" />
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
                    className="text-xl font-bold text-foreground bg-card px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {displayName}
                  </h1>
                  {workflow && (
                    <button
                      onClick={startEditingName}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              )}
              {isEditingDescription ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={descriptionInputRef}
                    type="text"
                    value={editingDescriptionValue}
                    onChange={(e) =>
                      setEditingDescriptionValue(e.target.value)
                    }
                    onBlur={handleDescriptionSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDescriptionSave();
                      if (e.key === "Escape") setIsEditingDescription(false);
                    }}
                    placeholder="Add workflow description..."
                    className="text-sm text-muted-foreground bg-card px-2 py-0.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-w-[300px]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {displayDescription || "No description"}
                  </p>
                  {workflow && (
                    <button
                      onClick={startEditingDescription}
                      className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {workflow && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulationRunning}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} />
                {isSimulationRunning ? "Running..." : "Run Simulation"}
              </button>

              <button
                onClick={handleToggleEnabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  workflow.enabled
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Power size={14} />
                {workflow.enabled ? "Enabled" : "Disabled"}
              </button>

              <span
                className={`text-sm flex items-center gap-1 ${
                  saveStatus === "saved"
                    ? "text-success"
                    : saveStatus === "saving"
                      ? "text-warning"
                      : "text-muted-foreground"
                }`}
              >
                {saveStatus === "saved" && <Check size={16} />}
                {saveStatus === "saved"
                  ? "Saved"
                  : saveStatus === "saving"
                    ? "Saving..."
                    : "Unsaved"}
              </span>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-secondary transition-colors"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 bg-card border-b border-border flex gap-2 items-center flex-wrap">
        <span className="text-sm text-muted-foreground mr-2">Add:</span>
        {(
          Object.entries(NODE_CONFIG) as [
            NodeType,
            (typeof NODE_CONFIG)[NodeType],
          ][]
        ).map(([type, config]) => (
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
          disabled={
            !nodes.some((n) => n.selected) && !edges.some((e) => e.selected)
          }
          className="px-4 py-1.5 bg-destructive text-destructive-foreground rounded-md text-sm hover:opacity-90 transition-opacity disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
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
            nodeColor={(node: Node) => {
              const config = NODE_CONFIG[node.type as NodeType];
              return config?.color || "#e5e7eb";
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background gap={32} />
        </ReactFlow>
      </div>

      <NodeFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        nodeType={pendingNodeType}
        initialValues={modalInitialValues}
        onSubmit={handleModalSubmit}
      />

      <SimulationModal
        isOpen={isSimulationRunning}
        onClose={resetSimulation}
        currentStep={currentStep}
        stepDetails={stepDetails}
        progress={progress}
      />
    </div>
  );
}
