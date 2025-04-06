"use client";

import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { ErrorDialog } from "@/components/error-dialog";
import { SetupStep1LicenseInfo } from "@/components/setup-form/steps/setup-step1-license-info";
import { SetupStep2LicenseFunctionality } from "@/components/setup-form/steps/setup-step2-license-functionality";
import { SetupStep3GlobalSettings } from "@/components/setup-form/steps/setup-step3-global-settings";
import { SteppedFormHeader } from "@/components/stepped-form-header";
import { SteppedFormNavigationButtons } from "@/components/stepped-form-navigation-buttons";

import { useSteppedSetupForm } from "../hooks/use-stepped-setup-form";
import { SetupFormSteps } from "./setup-form-steps";

type props = {
  onSuccess?: () => void;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders the VBPay setup multi-step form.
 *
 * This component manages a multi-step configuration process using the internal 
 * `useSteppedSetupForm` hook. It displays a form divided into three distinct steps—license information, 
 * license functionality, and global settings—and includes navigation controls to move between these steps.
 * An error dialog is presented if issues occur during form processing.
 *
 * @param onSuccess - Optional callback invoked after a successful form submission.
 * @param setIsSubmitting - Optional callback to update the external submitting state.
 */
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
        <SteppedFormHeader currentStep={currentStep} steps={SetupFormSteps} />
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
