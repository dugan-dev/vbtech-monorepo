import { Button } from "@workspace/ui/components/button";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";

import { SteppedFormStep } from "@/types/stepped-form-step";
import { Icons } from "@/components/icons";

type props = {
  isStepValid: (step: number) => boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  steps: SteppedFormStep[];
};

export function SteppedFormNavigationButtons({
  isStepValid,
  currentStep,
  nextStep,
  prevStep,
  isSubmitting,
  steps,
}: props) {
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1 || isSubmitting}
      >
        Previous
      </Button>

      <div className="flex gap-2">
        {currentStep < steps.length ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep) || isSubmitting}
          >
            Next
            <Icons.chevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <FormSubmitButton
            isSaving={isSubmitting}
            isDisabled={!isStepValid(currentStep) || isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
