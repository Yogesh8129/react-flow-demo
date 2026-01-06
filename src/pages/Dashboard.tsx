import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import WorkflowCard from "../components/WorkflowCard";
import {
  selectWorkflows,
  deleteWorkflow,
  addWorkflow,
} from "../store/workflowsSlice";
import type { RootState } from "../store";
import type { Workflow } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workflows = useSelector((state: RootState) => selectWorkflows(state));

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      dispatch(deleteWorkflow(id));
    }
  };

  const handleCreateWorkflow = () => {
    const newId = `workflow-${Date.now()}`;
    const newWorkflow: Workflow = {
      id: newId,
      name: "Untitled Workflow",
      description: "",
      enabled: false,
      nodes: [],
      edges: [],
    };
    dispatch(addWorkflow(newWorkflow));
    navigate(`/workflow/${newId}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Home → Alert Workflows
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Alert Workflows
              </h1>
              <p className="text-muted-foreground text-sm">
                Configure telemetry monitoring rules and actions
              </p>
            </div>
            <button
              onClick={handleCreateWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              <Plus size={18} />
              Create workflow
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onDelete={() => handleDelete(workflow.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
