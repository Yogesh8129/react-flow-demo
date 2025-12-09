import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "1",
      name: "Pen Factory Workflow",
      schedule: "Every 5 minutes",
      lastRun: { status: "completed", time: "12 minutes ago" },
      nextRun: "2024-12-09 15:15",
      nodes: [
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
      ],
      edges: [
        { id: "e1", source: "init-1", sourceHandle: "right", target: "metric-rate", targetHandle: "left" },
        { id: "e2", source: "init-2", sourceHandle: "right", target: "metric-rate", targetHandle: "left" },
        { id: "e3", source: "init-3", sourceHandle: "right", target: "metric-quality", targetHandle: "left" },
        { id: "e4", source: "metric-rate", sourceHandle: "right", target: "key-metric", targetHandle: "left" },
        { id: "e5", source: "metric-quality", sourceHandle: "right", target: "key-metric", targetHandle: "left" },
        { id: "e6", source: "key-metric", sourceHandle: "right", target: "outcome-inventory", targetHandle: "left" },
        { id: "e7", source: "key-metric", sourceHandle: "right", target: "outcome-revenue", targetHandle: "left" },
        { id: "e8", source: "outcome-inventory", sourceHandle: "bottom", target: "goal", targetHandle: "top" },
        { id: "e9", source: "outcome-revenue", sourceHandle: "bottom", target: "goal", targetHandle: "top" },
      ],
    },
    {
      id: "2",
      name: "Supply Chain Monitor",
      schedule: "At 12:00 AM, daily",
      lastRun: { status: "completed", time: "34 minutes ago" },
      nextRun: "2024-12-10 00:00",
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
