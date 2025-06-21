import { Dispatch, SetStateAction } from "react";
import { ChevronLeft } from "lucide-react";

import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

/**
 * Props for the SteppedFormHeader component.
 */
type props = {
  /** Current step number (1-based index) */
  currentStep: number;
  /** Array of step definitions containing titles and other metadata */
  steps: SteppedFormStep[];
  /** Function to update the current step */
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

/**
 * Header component for multi-step forms.
 *
 * This component displays the current step title, step progress indicator,
 * and a back button when not on the first step. It provides visual feedback
 * about the user's progress through the form steps.
 *
 * @param props - Configuration object containing step data and navigation functions
 * @returns SteppedFormHeader component with title, progress indicator, and back navigation
 */
export function SteppedFormHeader({
  currentStep,
  steps,
  setCurrentStep,
}: props) {
  const currentStepData = steps.find((step) => step.id === currentStep);
  const totalSteps = steps.length;

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-4">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go back</span>
          </button>
        )}
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentStepData?.title || `Step ${currentStep}`}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <div className="flex h-2 w-16 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{
                  width: `${(currentStep / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
