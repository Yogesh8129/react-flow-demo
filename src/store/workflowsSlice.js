import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "1",
      name: "Overheat Alert - Line A",
      description: "Alert when temperature exceeds 80°C for 5 minutes",
      enabled: true,
      nodes: [
        {
          id: "device-1",
          type: "deviceSelector",
          position: { x: 100, y: 150 },
          data: { tags: ["line:A", "zone:heating"] },
        },
        {
          id: "rule-1",
          type: "rule",
          position: { x: 400, y: 150 },
          data: {
            parameter: "temperature",
            comparator: ">",
            threshold: 80,
            duration_seconds: 300,
            aggregation: "avg",
            repeat_policy: { type: "rate_limit", interval_seconds: 600 },
          },
        },
        {
          id: "email-1",
          type: "emailAction",
          position: { x: 700, y: 80 },
          data: { recipients: ["ops@example.com"], template_id: "tmpl_overheat" },
        },
        {
          id: "sms-1",
          type: "smsAction",
          position: { x: 700, y: 220 },
          data: { recipients: ["+919876543210"], template_id: "tmpl_overheat_sms" },
        },
      ],
      edges: [
        { id: "e1", source: "device-1", sourceHandle: "right", target: "rule-1", targetHandle: "left" },
        { id: "e2", source: "rule-1", sourceHandle: "right", target: "email-1", targetHandle: "left" },
        { id: "e3", source: "rule-1", sourceHandle: "right", target: "sms-1", targetHandle: "left" },
      ],
    },
    {
      id: "2",
      name: "Low Pressure Alert",
      description: "Monitor pressure drops in Zone B",
      enabled: false,
      nodes: [],
      edges: [],
    },
  ],
  activeWorkflowId: null,
};

const workflowsSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    // Workflow CRUD
    addWorkflow: (state, action) => {
      state.items.push(action.payload);
    },
    updateWorkflow: (state, action) => {
      const { id, ...updates } = action.payload;
      const workflow = state.items.find((w) => w.id === id);
      if (workflow) {
        Object.assign(workflow, updates);
      }
    },
    deleteWorkflow: (state, action) => {
      state.items = state.items.filter((w) => w.id !== action.payload);
      if (state.activeWorkflowId === action.payload) {
        state.activeWorkflowId = null;
      }
    },
    setActiveWorkflow: (state, action) => {
      state.activeWorkflowId = action.payload;
    },

    // Workflow metadata updates
    updateWorkflowMeta: (state, action) => {
      const { id, name, description, enabled } = action.payload;
      const workflow = state.items.find((w) => w.id === id);
      if (workflow) {
        if (name !== undefined) workflow.name = name;
        if (description !== undefined) workflow.description = description;
        if (enabled !== undefined) workflow.enabled = enabled;
      }
    },
    toggleWorkflowEnabled: (state, action) => {
      const workflow = state.items.find((w) => w.id === action.payload);
      if (workflow) {
        workflow.enabled = !workflow.enabled;
      }
    },

    // Node CRUD (operates on active workflow)
    addNode: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        workflow.nodes.push(action.payload);
      }
    },
    updateNode: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        const { id, ...updates } = action.payload;
        const node = workflow.nodes.find((n) => n.id === id);
        if (node) {
          Object.assign(node, updates);
        }
      }
    },
    deleteNode: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        workflow.nodes = workflow.nodes.filter((n) => n.id !== action.payload);
        // Also remove connected edges
        workflow.edges = workflow.edges.filter(
          (e) => e.source !== action.payload && e.target !== action.payload
        );
      }
    },
    setNodes: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        workflow.nodes = action.payload;
      }
    },

    // Edge CRUD (operates on active workflow)
    addEdge: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        workflow.edges.push(action.payload);
      }
    },
    deleteEdge: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        workflow.edges = workflow.edges.filter((e) => e.id !== action.payload);
      }
    },
    setEdges: (state, action) => {
      const workflow = state.items.find((w) => w.id === state.activeWorkflowId);
      if (workflow) {
        workflow.edges = action.payload;
      }
    },
  },
});

export const {
  addWorkflow,
  updateWorkflow,
  deleteWorkflow,
  setActiveWorkflow,
  updateWorkflowMeta,
  toggleWorkflowEnabled,
  addNode,
  updateNode,
  deleteNode,
  setNodes,
  addEdge,
  deleteEdge,
  setEdges,
} = workflowsSlice.actions;

// Selectors
export const selectWorkflows = (state) => state.workflows.items;
export const selectActiveWorkflowId = (state) => state.workflows.activeWorkflowId;
export const selectActiveWorkflow = (state) =>
  state.workflows.items.find((w) => w.id === state.workflows.activeWorkflowId);
export const selectWorkflowById = (id) => (state) =>
  state.workflows.items.find((w) => w.id === id);

export default workflowsSlice.reducer;
