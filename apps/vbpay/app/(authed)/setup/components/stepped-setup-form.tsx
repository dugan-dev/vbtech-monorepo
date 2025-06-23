"use client";

import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { SteppedFormHeader } from "@workspace/ui/components/forms/stepped-form-header";
import { SteppedFormNavigationButtons } from "@workspace/ui/components/forms/stepped-form-navigation-buttons";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { SetupStep1LicenseInfo } from "@/components/setup-form/steps/setup-step1-license-info";
import { SetupStep2LicenseFunctionality } from "@/components/setup-form/steps/setup-step2-license-functionality";
import { SetupStep3GlobalSettings } from "@/components/setup-form/steps/setup-step3-global-settings";

import { useSteppedSetupForm } from "../hooks/use-stepped-setup-form";
import { SetupFormSteps } from "./setup-form-steps";

type props = {
  onSuccess?: () => void;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SteppedSetupForm({ onSuccess, setIsSubmitting }: props) {
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isStepValid,
    nextStep,
    prevStep,
    currentStep,
    setCurrentStep,
  } = useSteppedSetupForm({
    onSuccess,
    setIsSubmitting,
  });

  return (
    <div className="flex flex-col h-full">
      {isErrorDialogOpen && (
        <ErrorDialog
          description={errorMsg}
          title={errorTitle}
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
        />
      )}
      {/* Steps indicator */}
      <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
        <SheetTitle className="w-full text-center text-3xl bg-muted/30">
          VBPay Setup
        </SheetTitle>
        <SteppedFormHeader
          currentStep={currentStep}
          steps={SetupFormSteps}
          setCurrentStep={setCurrentStep}
        />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: License Information */}
              <div className={currentStep === 1 ? "block" : "hidden"}>
                <SetupStep1LicenseInfo isSubmitting={isPending} />
              </div>

              {/* Step 2: License Functionality */}
              <div className={currentStep === 2 ? "block" : "hidden"}>
                <SetupStep2LicenseFunctionality isSubmitting={isPending} />
              </div>

              {/* Step 3: Global Settings */}
              <div className={currentStep === 3 ? "block" : "hidden"}>
                <SetupStep3GlobalSettings isSubmitting={isPending} />
              </div>

              {/* Navigation buttons */}
              <SteppedFormNavigationButtons
                steps={SetupFormSteps}
                currentStep={currentStep}
                prevStep={prevStep}
                nextStep={nextStep}
                isStepValid={isStepValid}
                isSubmitting={isPending}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
