"use client";

import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { ErrorDialog } from "@/components/error-dialog";
import { SteppedFormHeader } from "@/components/stepped-form-header";
import { SteppedFormNavigationButtons } from "@/components/stepped-form-navigation-buttons";

import { useSteppedSetupForm } from "../../hooks/use-stepped-setup-form";
import { SetupFormStepValues } from "./steps/setup-form-step-values";
import { SetupStep1LicenseInfo } from "./steps/setup-step1-license-info";
import { SetupStep2LicenseFunctionality } from "./steps/setup-step2-license-functionality";
import { SetupStep3GlobalSettings } from "./steps/setup-step3-global-settings";

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
          steps={SetupFormStepValues}
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
                steps={SetupFormStepValues}
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
