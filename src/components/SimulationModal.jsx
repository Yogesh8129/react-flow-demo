import { Monitor, GitBranch, Zap, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { SIMULATION_STEPS } from "../hooks/useSimulation";

const stepConfig = {
  [SIMULATION_STEPS.SELECTING_DEVICES]: {
    icon: Monitor,
    title: "Selecting Devices",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  [SIMULATION_STEPS.EVALUATING_RULES]: {
    icon: GitBranch,
    title: "Evaluating Rules",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  [SIMULATION_STEPS.RULE_TRIGGERED]: {
    icon: Zap,
    title: "Rule Triggered!",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  [SIMULATION_STEPS.EXECUTING_ACTIONS]: {
    icon: Send,
    title: "Executing Actions",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  [SIMULATION_STEPS.COMPLETED]: {
    icon: CheckCircle,
    title: "Simulation Complete",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  [SIMULATION_STEPS.ERROR]: {
    icon: XCircle,
    title: "Simulation Failed",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
};

export default function SimulationModal({
  isOpen,
  onClose,
  currentStep,
  stepDetails,
  progress,
}) {
  if (!isOpen) return null;

  const config = stepConfig[currentStep];
  const Icon = config?.icon || Loader2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={currentStep === SIMULATION_STEPS.COMPLETED ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step indicator */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${config?.bgColor || "bg-gray-50"} mb-4`}
            >
              <Icon
                size={32}
                className={`${config?.color || "text-gray-500"} ${
                  currentStep !== SIMULATION_STEPS.COMPLETED &&
                  currentStep !== SIMULATION_STEPS.ERROR
                    ? "animate-pulse"
                    : ""
                }`}
              />
            </div>

            <h3 className={`text-lg font-semibold ${config?.color || "text-gray-700"}`}>
              {config?.title || "Running Simulation..."}
            </h3>

            {/* Step details */}
            <div className="mt-4 text-sm text-gray-600 w-full">
              {currentStep === SIMULATION_STEPS.SELECTING_DEVICES && stepDetails?.tags && (
                <div className="flex flex-wrap justify-center gap-2">
                  {stepDetails.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {currentStep === SIMULATION_STEPS.EVALUATING_RULES && stepDetails?.rules && (
                <div className="space-y-2">
                  {stepDetails.rules.map((rule, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-amber-50 rounded text-amber-700 text-xs"
                    >
                      {rule.parameter} {rule.comparator} {rule.threshold}
                    </div>
                  ))}
                </div>
              )}

              {currentStep === SIMULATION_STEPS.RULE_TRIGGERED && (
                <p className="text-orange-600 font-medium">
                  {stepDetails?.triggeredRules} rule(s) triggered! Executing actions...
                </p>
              )}

              {currentStep === SIMULATION_STEPS.EXECUTING_ACTIONS && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-emerald-500" />
                  <span>Sending notifications...</span>
                </div>
              )}

              {currentStep === SIMULATION_STEPS.COMPLETED && (
                <p className="text-green-600">All actions executed successfully!</p>
              )}

              {currentStep === SIMULATION_STEPS.ERROR && stepDetails?.error && (
                <p className="text-red-600">{stepDetails.error}</p>
              )}
            </div>
          </div>

          {/* Close button - only show when completed or error */}
          {(currentStep === SIMULATION_STEPS.COMPLETED ||
            currentStep === SIMULATION_STEPS.ERROR) && (
            <button
              onClick={onClose}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
