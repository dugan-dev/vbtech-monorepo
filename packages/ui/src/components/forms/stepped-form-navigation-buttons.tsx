import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

type props = {
  steps: SteppedFormStep[];
  currentStep: number;
  prevStep: () => void;
  nextStep: () => Promise<void>;
  isStepValid: (step: number) => boolean;
  isSubmitting: boolean;
};

export function SteppedFormNavigationButtons({
  steps,
  currentStep,
  prevStep,
  nextStep,
  isStepValid,
  isSubmitting,
}: props) {
  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || isSubmitting}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button
        onClick={nextStep}
        disabled={!isStepValid(currentStep) || isSubmitting}
        className="ml-auto"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLastStep ? "Submit" : "Next"}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
