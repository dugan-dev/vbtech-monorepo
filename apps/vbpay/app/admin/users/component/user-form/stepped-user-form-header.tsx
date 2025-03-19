import { Icons } from "@/components/icons";

import { UserFormStepValues } from "./steps/steps";

type props = {
  currentStep: number;
};

export function SteppedUserFormHeader({ currentStep }: props) {
  return (
    <div className="bg-muted/30">
      <div className="container max-w-screen-lg mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {UserFormStepValues.map((step, i) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep > step.id
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Icons.check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div
                className={`ml-3 ${i === UserFormStepValues.length ? "flex-1" : "flex-1 relative"}`}
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
                {i !== UserFormStepValues.length && (
                  <div
                    className={`absolute top-5 w-full h-0.5 ${
                      currentStep > step.id
                        ? "bg-primary/30"
                        : "bg-muted-foreground/20"
                    }`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
