'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WizardStep } from './ServerWizard';

type Step = {
  id: WizardStep;
  label: string;
  description: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
};

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  // Function to determine the status of a step
  const getStepStatus = (stepId: WizardStep) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col space-y-1">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isCompleted = status === 'completed';
        const isCurrent = status === 'current';

        return (
          <div key={step.id} className="relative">
            {/* Step with icon */}
            <div
              className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-50 cursor-default'
                  : isCompleted
                    ? 'hover:bg-blue-50 cursor-pointer'
                    : 'text-gray-400 cursor-default'
              }`}
              onClick={() => isCompleted && onStepClick(step.id)}
            >
              {/* Step icon/number */}
              <div
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full
                  ${isCurrent ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                  transition-all duration-300
                `}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <span className="text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step text */}
              <div className="ml-4 flex-1">
                <p className={`font-medium ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className={`text-sm ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 ml-[1px] w-[2px] top-[3.25rem] h-6">
                <div className={`h-full w-full ${
                  status === 'completed' && getStepStatus(steps[index + 1].id) !== 'upcoming'
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                } transition-colors duration-500`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
