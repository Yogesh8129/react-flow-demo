/**
 * Workflows Redux Slice
 * State management for workflows, nodes, and edges
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Edge } from 'reactflow';
import type { Workflow, WorkflowNode, WorkflowNodeData } from '@/types';


// State Type


interface WorkflowsState {
  items: Workflow[];
  activeWorkflowId: string | null;
}


// Initial State


const initialState: WorkflowsState = {
  items: [
    {
      id: '1',
      name: 'Overheat Alert - Line A',
      description: 'Alert when temperature exceeds 80°C for 5 minutes',
      enabled: true,
      nodes: [
        {
          id: 'device-1',
          type: 'deviceSelector',
          position: { x: 100, y: 150 },
          data: {
            plants: ['mumbai'],
            assetTypes: ['extruder'],
            assets: [],
          },
        },
        {
          id: 'rule-1',
          type: 'rule',
          position: { x: 400, y: 150 },
          data: {
            parameter: 'Temperature',
            comparator: '>',
            threshold: 80,
            duration_seconds: 300,
            aggregation: 'avg',
            repeat_policy: { type: 'rate_limit', interval_seconds: 600 },
          },
        },
        {
          id: 'email-1',
          type: 'emailAction',
          position: { x: 700, y: 80 },
          data: {
            recipients: ['ops@example.com'],
          },
        },
        {
          id: 'sms-1',
          type: 'smsAction',
          position: { x: 700, y: 220 },
          data: {
            recipients: ['+919876543210'],
          },
        },
      ] as WorkflowNode[],
      edges: [
        {
          id: 'e1',
          source: 'device-1',
          sourceHandle: 'right',
          target: 'rule-1',
          targetHandle: 'left',
        },
        {
          id: 'e2',
          source: 'rule-1',
          sourceHandle: 'right',
          target: 'email-1',
          targetHandle: 'left',
        },
        {
          id: 'e3',
          source: 'rule-1',
          sourceHandle: 'right',
          target: 'sms-1',
          targetHandle: 'left',
        },
      ],
    },
    {
      id: '2',
      name: 'Low Pressure Alert',
      description: 'Monitor pressure drops in Zone B',
      enabled: false,
      nodes: [],
      edges: [],
    },
  ],
  activeWorkflowId: null,
};


// Slice


const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    // ----------------------------------------
    // Workflow CRUD
    // ----------------------------------------

    addWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.items.push(action.payload);
    },

    updateWorkflow: (
      state,
      action: PayloadAction<{ id: string } & Partial<Workflow>>
    ) => {
      const { id, ...updates } = action.payload;
      const workflow = state.items.find((w) => w.id === id);
      if (workflow) {
        Object.assign(workflow, updates);
      }
    },

    deleteWorkflow: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((w) => w.id !== action.payload);
      if (state.activeWorkflowId === action.payload) {
        state.activeWorkflowId = null;
      }
    },

    setActiveWorkflow: (state, action: PayloadAction<string | null>) => {
      state.activeWorkflowId = action.payload;
    },

    // ----------------------------------------
    // Workflow Metadata Updates
    // ----------------------------------------

    updateWorkflowMeta: (
      state,
      action: PayloadAction<{
        id: string;
        name?: string;
        description?: string;
        enabled?: boolean;
      }>
    ) => {
      const { id, name, description, enabled } = action.payload;
      const workflow = state.items.find((w) => w.id === id);
      if (workflow) {
        if (name !== undefined) workflow.name = name;
        if (description !== undefined) workflow.description = description;
        if (enabled !== undefined) workflow.enabled = enabled;
      }
    },

    toggleWorkflowEnabled: (state, action: PayloadAction<string>) => {
      const workflow = state.items.find((w) => w.id === action.payload);
      if (workflow) {
        workflow.enabled = !workflow.enabled;
      }
    },

    // ----------------------------------------
    // Node CRUD (operates on active workflow)
    // ----------------------------------------

    addNode: (state, action: PayloadAction<WorkflowNode>) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        workflow.nodes.push(action.payload);
      }
    },

    updateNode: (
      state,
      action: PayloadAction<{ id: string; data?: WorkflowNodeData } & Partial<WorkflowNode>>
    ) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        const { id, ...updates } = action.payload;
        const node = workflow.nodes.find((n) => n.id === id);
        if (node) {
          Object.assign(node, updates);
        }
      }
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        workflow.nodes = workflow.nodes.filter((n) => n.id !== action.payload);
        // Also remove connected edges
        workflow.edges = workflow.edges.filter(
          (e) => e.source !== action.payload && e.target !== action.payload
        );
      }
    },

    setNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        workflow.nodes = action.payload;
      }
    },

    // ----------------------------------------
    // Edge CRUD (operates on active workflow)
    // ----------------------------------------

    addEdge: (state, action: PayloadAction<Edge>) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        workflow.edges.push(action.payload);
      }
    },

    deleteEdge: (state, action: PayloadAction<string>) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        workflow.edges = workflow.edges.filter((e) => e.id !== action.payload);
      }
    },

    setEdges: (state, action: PayloadAction<Edge[]>) => {
      const workflow = state.items.find(
        (w) => w.id === state.activeWorkflowId
      );
      if (workflow) {
        workflow.edges = action.payload;
      }
    },
  },
});


// Exports


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


interface RootState {
  workflows: WorkflowsState;
}

export const selectWorkflows = (state: RootState): Workflow[] =>
  state.workflows.items;

export const selectActiveWorkflowId = (state: RootState): string | null =>
  state.workflows.activeWorkflowId;

export const selectActiveWorkflow = (state: RootState): Workflow | undefined =>
  state.workflows.items.find((w) => w.id === state.workflows.activeWorkflowId);

export const selectWorkflowById =
  (id: string) =>
  (state: RootState): Workflow | undefined =>
    state.workflows.items.find((w) => w.id === id);

export default workflowsSlice.reducer;
