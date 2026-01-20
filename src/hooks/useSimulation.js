import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { validateWorkflow } from "../utils/payloadGenerator";
import { NODE_TYPES } from "../constants/nodeConfig";

// Simulation step types
export const SIMULATION_STEPS = {
  IDLE: "idle",
  SELECTING_DEVICES: "selecting_devices",
  EVALUATING_RULES: "evaluating_rules",
  RULE_TRIGGERED: "rule_triggered",
  EXECUTING_ACTIONS: "executing_actions",
  COMPLETED: "completed",
  ERROR: "error",
};

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(SIMULATION_STEPS.IDLE);
  const [stepDetails, setStepDetails] = useState(null);
  const [progress, setProgress] = useState(0);

  const runSimulation = useCallback(async (workflow) => {
    // Validate workflow first
    const validation = validateWorkflow(workflow);
    if (!validation.valid) {
      validation.errors.forEach((error) => {
        toast.error(error);
      });
      return false;
    }

    const nodes = workflow.nodes || [];

    // Extract data for simulation
    const deviceSelectors = nodes.filter((n) => n.type === NODE_TYPES.DEVICE_SELECTOR);
    const rules = nodes.filter((n) => n.type === NODE_TYPES.RULE);
    const emailActions = nodes.filter((n) => n.type === NODE_TYPES.EMAIL_ACTION);
    const smsActions = nodes.filter((n) => n.type === NODE_TYPES.SMS_ACTION);

    // Combine all tags
    const allTags = deviceSelectors.flatMap((n) => n.data.tags || []);

    setIsRunning(true);
    setProgress(0);

    try {
      // Step 1: Selecting Devices
      setCurrentStep(SIMULATION_STEPS.SELECTING_DEVICES);
      setStepDetails({ tags: allTags });
      setProgress(20);
      await delay(1000);

      // Step 2: Evaluating Rules
      setCurrentStep(SIMULATION_STEPS.EVALUATING_RULES);
      setStepDetails({ rules: rules.map((r) => r.data) });
      setProgress(40);
      await delay(1500);

      // Step 3: Rule Triggered
      setCurrentStep(SIMULATION_STEPS.RULE_TRIGGERED);
      setStepDetails({ triggeredRules: rules.length });
      setProgress(60);
      await delay(800);

      // Step 4: Executing Actions
      setCurrentStep(SIMULATION_STEPS.EXECUTING_ACTIONS);
      setProgress(80);

      // Send email notifications
      for (const emailNode of emailActions) {
        const recipients = emailNode.data.recipients || [];
        for (const recipient of recipients) {
          await delay(500);
          toast.success(`Email sent to ${recipient}`, {
            icon: "📧",
            duration: 4000,
          });
        }
      }

      // Send SMS notifications
      for (const smsNode of smsActions) {
        const recipients = smsNode.data.recipients || [];
        for (const recipient of recipients) {
          await delay(500);
          toast.success(`SMS sent to ${recipient}`, {
            icon: "📱",
            duration: 4000,
          });
        }
      }

      // Step 5: Completed
      setCurrentStep(SIMULATION_STEPS.COMPLETED);
      setStepDetails(null);
      setProgress(100);
      await delay(1000);

      toast.success("Simulation completed successfully!", {
        icon: "✅",
        duration: 3000,
      });

      return true;
    } catch (error) {
      setCurrentStep(SIMULATION_STEPS.ERROR);
      setStepDetails({ error: error.message });
      toast.error("Simulation failed: " + error.message);
      return false;
    } finally {
      // Reset after a short delay
      await delay(500);
      setIsRunning(false);
      setCurrentStep(SIMULATION_STEPS.IDLE);
      setStepDetails(null);
      setProgress(0);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(SIMULATION_STEPS.IDLE);
    setStepDetails(null);
    setProgress(0);
  }, []);

  return {
    isRunning,
    currentStep,
    stepDetails,
    progress,
    runSimulation,
    resetSimulation,
  };
}
