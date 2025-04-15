import { SteppedFormStep } from "@/types/stepped-form-step";
import { Icons } from "@/components/icons";

type props = {
  currentStep: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  isEditing?: boolean;
  steps: SteppedFormStep[];
};

/**
 * Renders a horizontal step indicator for a multi-step form, displaying each step as an interactive button with visual cues for current, completed, and upcoming steps.
 *
 * @param currentStep - The ID of the currently active step.
 * @param setCurrentStep - Optional setter function to update the current step when a step button is clicked.
 * @param isEditing - Optional flag indicating if the form is in editing mode, which enables navigation to completed steps.
 * @param steps - Array of step objects, each containing an ID, title, and icon.
 *
 * @returns A React element displaying the step navigation header.
 */
export function SteppedFormHeader({
  currentStep,
  setCurrentStep,
  isEditing,
  steps,
}: props) {
  return (
    <div className="bg-muted/30">
      <div className="container max-w-screen-lg mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <button
              key={step.id}
              className="flex flex-1 items-center hover:cursor-pointer hover:opacity-80"
              onClick={() => setCurrentStep?.(step.id)}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 hover:border-primary ${
                  currentStep === step.id
                    ? "bg-primary border-primary text-primary-foreground hover:bg-primary/80"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {currentStep > step.id &&
                setCurrentStep !== undefined &&
                isEditing ? (
                  <Icons.check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div
                className={`ml-3 ${i === steps.length ? "flex-1" : "flex-1 relative"}`}
              >
                <p
                  className={`text-sm font-medium ${
                    currentStep === step.id
                      ? "text-foreground"
                      : currentStep > step.id
                        ? "text-foreground/80"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                {i !== steps.length && (
                  <div
                    className={`absolute top-5 w-full h-0.5 ${
                      currentStep > step.id
                        ? "bg-primary/30"
                        : "bg-muted-foreground/20"
                    }`}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
