import { useNavigate } from "react-router-dom";
import {
  Play,
  Trash2,
  Power,
  GitBranch,
  Mail,
  MessageSquare,
} from "lucide-react";
import useSimulation from "@/hooks/useSimulation";
import SimulationModal from "./SimulationModal";
import type { Workflow } from "@/types";

interface WorkflowCardProps {
  workflow: Workflow;
  onDelete: () => void;
}

export default function WorkflowCard({
  workflow,
  onDelete,
}: WorkflowCardProps) {
  const navigate = useNavigate();

  const {
    isRunning: isSimulationRunning,
    currentStep,
    stepDetails,
    progress,
    runSimulation,
    resetSimulation,
  } = useSimulation();

  const rulesCount =
    workflow.nodes?.filter((n) => n.type === "rule").length || 0;
  const actionsCount =
    workflow.nodes?.filter(
      (n) => n.type === "emailAction" || n.type === "smsAction"
    ).length || 0;

  const handleRun = () => {
    runSimulation(workflow);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                workflow.enabled
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Play size={18} className="ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-card-foreground">
                  {workflow.name}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    workflow.enabled
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Power size={10} />
                  {workflow.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {workflow.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {workflow.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <GitBranch size={14} className="text-warning" />
                  {rulesCount} {rulesCount === 1 ? "rule" : "rules"}
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={14} className="text-success" />
                  <MessageSquare size={14} className="text-chart-5" />
                  {actionsCount} {actionsCount === 1 ? "action" : "actions"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isSimulationRunning}
              className="px-3 py-1.5 text-sm text-primary hover:bg-accent rounded transition-colors disabled:opacity-50"
            >
              Run
            </button>
            <button
              onClick={() => navigate(`/workflow/${workflow.id}`)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <SimulationModal
        isOpen={isSimulationRunning}
        onClose={resetSimulation}
        currentStep={currentStep}
        stepDetails={stepDetails}
        progress={progress}
      />
    </>
  );
}
