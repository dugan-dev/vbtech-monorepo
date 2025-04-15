"use client";

import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { ErrorDialog } from "@/components/error-dialog";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";
import { SetupStep1LicenseInfo } from "@/components/setup-form/steps/setup-step1-license-info";
import { SetupStep2LicenseFunctionality } from "@/components/setup-form/steps/setup-step2-license-functionality";
import { SetupStep3GlobalSettings } from "@/components/setup-form/steps/setup-step3-global-settings";
import { SteppedFormHeader } from "@/components/stepped-form-header";
import { SteppedFormNavigationButtons } from "@/components/stepped-form-navigation-buttons";

import { useSteppedAdminSettingsForm } from "../hooks/use-stepped-admin-settings-form";
import {
  AdminLicenseFormSteps,
  AdminSettingsFormSteps,
} from "./admin-settings-form-steps";

type props = {
  onSuccess?: () => void;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
  data: SetupFormData;
  from: "license" | "settings";
};

/**
 * Renders a multi-step form for updating either license information or global settings in the admin panel.
 *
 * Displays step indicators, handles navigation between steps, and manages form submission and error dialogs. The form steps and content are determined by the {@link from} prop.
 *
 * @param data - Initial form data to populate the form fields.
 * @param from - Determines whether the form updates "license" information or "settings".
 * @param onSuccess - Optional callback invoked after successful form submission.
 * @param setIsSubmitting - Optional setter to update the submission state externally.
 */
export function SteppedAdminSettingsForm({
  onSuccess,
  setIsSubmitting,
  data,
  from,
}: props) {
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
    steps,
  } = useSteppedAdminSettingsForm({
    onSuccess,
    setIsSubmitting,
    data,
    from,
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
          {from === "license" ? "Update License" : "Update Global Settings"}
        </SheetTitle>
        <SteppedFormHeader
          currentStep={currentStep}
          steps={
            from === "license" ? AdminLicenseFormSteps : AdminSettingsFormSteps
          }
          setCurrentStep={setCurrentStep}
        />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: License Information */}
              <div
                className={
                  from === "license" && currentStep === 1 ? "block" : "hidden"
                }
              >
                <SetupStep1LicenseInfo isSubmitting={isPending} />
              </div>

              {/* Step 2: License Functionality */}
              <div
                className={
                  from === "license" && currentStep === 2 ? "block" : "hidden"
                }
              >
                <SetupStep2LicenseFunctionality isSubmitting={isPending} />
              </div>

              {/* Step 3: Global Settings */}
              <div
                className={
                  from === "settings" && currentStep === 1 ? "block" : "hidden"
                }
              >
                <SetupStep3GlobalSettings isSubmitting={isPending} />
              </div>

              {/* Navigation buttons */}
              <SteppedFormNavigationButtons
                steps={steps}
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
