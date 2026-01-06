import {
  Monitor,
  GitBranch,
  Zap,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import {
  SIMULATION_STEPS,
  type SimulationStep,
  type StepDetails,
} from "@/hooks/useSimulation";

interface StepConfig {
  icon: LucideIcon;
  title: string;
  color: string;
  bgColor: string;
}

const stepConfig: Record<SimulationStep, StepConfig> = {
  [SIMULATION_STEPS.IDLE]: {
    icon: Loader2,
    title: "Preparing...",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  [SIMULATION_STEPS.SELECTING_DEVICES]: {
    icon: Monitor,
    title: "Selecting Devices",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  [SIMULATION_STEPS.EVALUATING_RULES]: {
    icon: GitBranch,
    title: "Evaluating Rules",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  [SIMULATION_STEPS.RULE_TRIGGERED]: {
    icon: Zap,
    title: "Rule Triggered!",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
  },
  [SIMULATION_STEPS.EXECUTING_ACTIONS]: {
    icon: Send,
    title: "Executing Actions",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  [SIMULATION_STEPS.COMPLETED]: {
    icon: CheckCircle,
    title: "Simulation Complete",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  [SIMULATION_STEPS.ERROR]: {
    icon: XCircle,
    title: "Simulation Failed",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: SimulationStep;
  stepDetails: StepDetails | null;
  progress: number;
}

export default function SimulationModal({
  isOpen,
  onClose,
  currentStep,
  stepDetails,
  progress,
}: SimulationModalProps) {
  if (!isOpen) return null;

  const config = stepConfig[currentStep];
  const Icon = config?.icon || Loader2;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={
          currentStep === SIMULATION_STEPS.COMPLETED ||
          currentStep === SIMULATION_STEPS.ERROR
            ? onClose
            : undefined
        }
      />

      <div className="relative bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                config?.bgColor || "bg-muted"
              } mb-4`}
            >
              <Icon
                size={32}
                className={`${config?.color || "text-muted-foreground"} ${
                  currentStep !== SIMULATION_STEPS.COMPLETED &&
                  currentStep !== SIMULATION_STEPS.ERROR
                    ? "animate-pulse"
                    : ""
                }`}
              />
            </div>

            <h3
              className={`text-lg font-semibold ${
                config?.color || "text-foreground"
              }`}
            >
              {config?.title || "Running Simulation..."}
            </h3>

            <div className="mt-4 text-sm text-muted-foreground w-full">
              {currentStep === SIMULATION_STEPS.SELECTING_DEVICES &&
                stepDetails?.devices && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {stepDetails.devices.map((device, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded text-xs"
                      >
                        {device}
                      </span>
                    ))}
                  </div>
                )}

              {currentStep === SIMULATION_STEPS.EVALUATING_RULES &&
                stepDetails?.rules && (
                  <div className="space-y-2">
                    {stepDetails.rules.map((rule, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-amber-50 dark:bg-amber-900/30 rounded text-amber-700 dark:text-amber-300 text-xs"
                      >
                        {rule.parameter} {rule.comparator} {rule.threshold}
                      </div>
                    ))}
                  </div>
                )}

              {currentStep === SIMULATION_STEPS.RULE_TRIGGERED && (
                <p className="text-orange-600 dark:text-orange-400 font-medium">
                  {stepDetails?.triggeredRules} rule(s) triggered! Executing
                  actions...
                </p>
              )}

              {currentStep === SIMULATION_STEPS.EXECUTING_ACTIONS && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-emerald-500" />
                  <span>Sending notifications...</span>
                </div>
              )}

              {currentStep === SIMULATION_STEPS.COMPLETED && (
                <p className="text-success">All actions executed successfully!</p>
              )}

              {currentStep === SIMULATION_STEPS.ERROR && stepDetails?.error && (
                <p className="text-destructive">{stepDetails.error}</p>
              )}
            </div>
          </div>

          {(currentStep === SIMULATION_STEPS.COMPLETED ||
            currentStep === SIMULATION_STEPS.ERROR) && (
            <button
              onClick={onClose}
              className="mt-6 w-full px-4 py-2 bg-muted text-foreground rounded-md hover:bg-accent transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
