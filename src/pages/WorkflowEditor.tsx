import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, Check, Pencil, Save, Power, Play } from 'lucide-react';

// Node components
import DeviceSelectorNode from '../components/nodes/DeviceSelectorNode';
import RuleNode from '../components/nodes/RuleNode';
import EmailActionNode from '../components/nodes/EmailActionNode';
import SmsActionNode from '../components/nodes/SmsActionNode';

// Form modal and simulation
import NodeFormModal from '../components/forms/NodeFormModal';
import SimulationModal from '../components/SimulationModal';
import useSimulation from '../hooks/useSimulation';

// Constants and store
import {
  NODE_TYPES,
  NODE_CONFIG,
  getDefaultNodeData,
} from '../constants/nodeConfig';
import {
  selectWorkflowById,
  setActiveWorkflow,
  setNodes as setStoreNodes,
  setEdges as setStoreEdges,
  updateWorkflow,
  toggleWorkflowEnabled,
} from '../store/workflowsSlice';
import type { RootState } from '../store';
import type { NodeType, WorkflowNodeData, Workflow } from '@/types';

// Register node types
const nodeTypes = {
  deviceSelector: DeviceSelectorNode,
  rule: RuleNode,
  emailAction: EmailActionNode,
  smsAction: SmsActionNode,
};

const defaultEdgeOptions = {
  style: { stroke: '#888', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#888' },
};

type SaveStatus = 'saved' | 'saving' | 'unsaved';

export default function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const workflow = useSelector((state: RootState) =>
    id ? selectWorkflowById(id)(state) : undefined
  );
  const isNewWorkflow = id === 'new';

  // Refs for tracking initialization
  const initialized = useRef(false);
  const workflowIdRef = useRef<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Modal state for node editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNodeType, setPendingNodeType] = useState<NodeType | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<WorkflowNodeData | Record<string, never>>({});

  // Workflow name and description editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescriptionValue, setEditingDescriptionValue] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  // Simulation
  const {
    isRunning: isSimulationRunning,
    currentStep,
    stepDetails,
    progress,
    runSimulation,
    resetSimulation,
  } = useSimulation();

  // Initialize from Redux when workflow loads (only once per id)
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

  // Focus description input when editing starts
  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  // Start editing workflow name
  const startEditingName = useCallback(() => {
    setEditingNameValue(workflow?.name || 'Untitled Workflow');
    setIsEditingName(true);
  }, [workflow]);

  // Handle workflow name save
  const handleNameSave = useCallback(() => {
    if (!workflow || !editingNameValue.trim()) return;
    dispatch(
      updateWorkflow({ id: workflow.id, name: editingNameValue.trim() })
    );
    setIsEditingName(false);
  }, [workflow, editingNameValue, dispatch]);

  // Start editing workflow description
  const startEditingDescription = useCallback(() => {
    setEditingDescriptionValue(workflow?.description || '');
    setIsEditingDescription(true);
  }, [workflow]);

  // Handle workflow description save
  const handleDescriptionSave = useCallback(() => {
    if (!workflow) return;
    dispatch(
      updateWorkflow({ id: workflow.id, description: editingDescriptionValue.trim() })
    );
    setIsEditingDescription(false);
  }, [workflow, editingDescriptionValue, dispatch]);

  // Handle explicit save button click
  const handleSave = useCallback(() => {
    if (!workflow) return;
    setSaveStatus('saving');
    dispatch(setStoreNodes(nodes));
    dispatch(setStoreEdges(edges));
    if (editingNameValue.trim()) {
      dispatch(
        updateWorkflow({ id: workflow.id, name: editingNameValue.trim() })
      );
    }
    setTimeout(() => setSaveStatus('saved'), 500);
  }, [workflow, nodes, edges, editingNameValue, dispatch]);

  // Toggle workflow enabled status
  const handleToggleEnabled = useCallback(() => {
    if (!workflow) return;
    dispatch(toggleWorkflowEnabled(workflow.id));
  }, [workflow, dispatch]);

  // Run simulation
  const handleRunSimulation = useCallback(() => {
    if (!workflow) return;
    const workflowWithCurrentNodes: Workflow = {
      ...workflow,
      nodes,
      edges,
    };
    runSimulation(workflowWithCurrentNodes);
  }, [workflow, nodes, edges, runSimulation]);

  // Get display values
  const displayName = workflow?.name || 'Untitled Workflow';
  const displayDescription =
    workflow?.description || 'Configure device monitoring rules and actions';

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle "Add Node" button click - opens modal with defaults
  const handleAddNodeClick = useCallback((nodeType: NodeType) => {
    setPendingNodeType(nodeType);
    setEditingNodeId(null);
    setModalInitialValues(getDefaultNodeData(nodeType));
    setIsModalOpen(true);
  }, []);

  // Handle node double-click - opens modal for editing
  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setPendingNodeType(node.type as NodeType);
      setEditingNodeId(node.id);
      setModalInitialValues(node.data as WorkflowNodeData);
      setIsModalOpen(true);
    },
    []
  );

  // Handle modal submit - create new or update existing node
  const handleModalSubmit = useCallback(
    (values: WorkflowNodeData) => {
      if (editingNodeId) {
        // Update existing node
        setNodes((nds) =>
          nds.map((n) => (n.id === editingNodeId ? { ...n, data: values } : n))
        );
      } else if (pendingNodeType) {
        // Create new node
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
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Workflow not found
          </h1>
          <button
            onClick={() => navigate('/')}
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
              onClick={() => navigate('/')}
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
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') setIsEditingName(false);
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
              {isEditingDescription ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={descriptionInputRef}
                    type="text"
                    value={editingDescriptionValue}
                    onChange={(e) => setEditingDescriptionValue(e.target.value)}
                    onBlur={handleDescriptionSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleDescriptionSave();
                      if (e.key === 'Escape') setIsEditingDescription(false);
                    }}
                    placeholder="Add workflow description..."
                    className="text-sm text-gray-500 bg-white px-2 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[300px]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {displayDescription || 'No description'}
                  </p>
                  {workflow && (
                    <button
                      onClick={startEditingDescription}
                      className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
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
              {/* Run Simulation button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulationRunning}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} />
                {isSimulationRunning ? 'Running...' : 'Run Simulation'}
              </button>

              {/* Enabled toggle */}
              <button
                onClick={handleToggleEnabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                  workflow.enabled
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Power size={14} />
                {workflow.enabled ? 'Enabled' : 'Disabled'}
              </button>

              {/* Save status */}
              <span
                className={`text-sm flex items-center gap-1 ${
                  saveStatus === 'saved'
                    ? 'text-emerald-600'
                    : saveStatus === 'saving'
                      ? 'text-amber-500'
                      : 'text-gray-400'
                }`}
              >
                {saveStatus === 'saved' && <Check size={16} />}
                {saveStatus === 'saved'
                  ? 'Saved'
                  : saveStatus === 'saving'
                    ? 'Saving...'
                    : 'Unsaved'}
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
        {(Object.entries(NODE_CONFIG) as [NodeType, (typeof NODE_CONFIG)[NodeType]][]).map(
          ([type, config]) => (
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
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = config.color;
              }}
            >
              {config.label}
            </button>
          )
        )}
        <div className="flex-1" />
        <button
          onClick={deleteSelected}
          disabled={!nodes.some((n) => n.selected) && !edges.some((e) => e.selected)}
          className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
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
              return config?.color || '#e5e7eb';
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

      {/* Simulation Modal */}
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
