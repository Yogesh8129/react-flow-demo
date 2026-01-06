import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { validateWorkflow } from '@/utils/payloadGenerator';
import { NODE_TYPES } from '@/constants/nodeConfig';
import type { Workflow, DeviceSelectorNodeData, RuleNodeData } from '@/types';

/** Simulation step identifiers */
export const SIMULATION_STEPS = {
  IDLE: 'idle',
  SELECTING_DEVICES: 'selecting_devices',
  EVALUATING_RULES: 'evaluating_rules',
  RULE_TRIGGERED: 'rule_triggered',
  EXECUTING_ACTIONS: 'executing_actions',
  COMPLETED: 'completed',
  ERROR: 'error',
} as const;

export type SimulationStep = (typeof SIMULATION_STEPS)[keyof typeof SIMULATION_STEPS];

/** Step details for display in modal */
export interface StepDetails {
  devices?: string[];
  rules?: RuleNodeData[];
  triggeredRules?: number;
  error?: string;
}

/** Delay helper */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Hook return type */
export interface UseSimulationReturn {
  isRunning: boolean;
  currentStep: SimulationStep;
  stepDetails: StepDetails | null;
  progress: number;
  runSimulation: (workflow: Workflow) => Promise<boolean>;
  resetSimulation: () => void;
}

export default function useSimulation(): UseSimulationReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<SimulationStep>(SIMULATION_STEPS.IDLE);
  const [stepDetails, setStepDetails] = useState<StepDetails | null>(null);
  const [progress, setProgress] = useState(0);

  const runSimulation = useCallback(async (workflow: Workflow): Promise<boolean> => {
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

    // Get device selection summary for display
    const deviceSummary: string[] = [];
    for (const node of deviceSelectors) {
      const data = node.data as DeviceSelectorNodeData;
      if (data.plants?.length) deviceSummary.push(`Plants: ${data.plants.join(', ')}`);
      if (data.assetTypes?.length) deviceSummary.push(`Types: ${data.assetTypes.join(', ')}`);
      if (data.assets?.length) deviceSummary.push(`Assets: ${data.assets.join(', ')}`);
    }

    setIsRunning(true);
    setProgress(0);

    try {
      // Step 1: Selecting Devices
      setCurrentStep(SIMULATION_STEPS.SELECTING_DEVICES);
      setStepDetails({ devices: deviceSummary });
      setProgress(20);
      await delay(1000);

      // Step 2: Evaluating Rules
      setCurrentStep(SIMULATION_STEPS.EVALUATING_RULES);
      setStepDetails({ rules: rules.map((r) => r.data as RuleNodeData) });
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
        const recipients = (emailNode.data as { recipients: string[] }).recipients || [];
        for (const recipient of recipients) {
          await delay(500);
          toast.success(`Email sent to ${recipient}`, {
            icon: '📧',
            duration: 4000,
          });
        }
      }

      // Send SMS notifications
      for (const smsNode of smsActions) {
        const recipients = (smsNode.data as { recipients: string[] }).recipients || [];
        for (const recipient of recipients) {
          await delay(500);
          toast.success(`SMS sent to ${recipient}`, {
            icon: '📱',
            duration: 4000,
          });
        }
      }

      // Step 5: Completed
      setCurrentStep(SIMULATION_STEPS.COMPLETED);
      setStepDetails(null);
      setProgress(100);
      await delay(1000);

      toast.success('Simulation completed successfully!', {
        icon: '✅',
        duration: 3000,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCurrentStep(SIMULATION_STEPS.ERROR);
      setStepDetails({ error: errorMessage });
      toast.error('Simulation failed: ' + errorMessage);
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
