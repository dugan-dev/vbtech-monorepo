"use client";

import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { SteppedFormHeader } from "@/components/stepped-form-header";
import { SteppedFormNavigationButtons } from "@/components/stepped-form-navigation-buttons";

import { useHealthPlanForm } from "../../hooks/use-health-plan-form";
import { HealthPlanFormBasicInfoStep } from "./health-plan-form-basic-info-step";
import { HealthPlanFormPBPsStep } from "./health-plan-form-pbps-step";
import { HealthPlanFormData } from "./health-plan-form-schema";
import { HealthPlanFormStepValues } from "./health-plan-form-step-values";

type props = {
  onSuccess?: () => void;
  formData?: HealthPlanFormData;
  clientPubId: string;
  pubId?: string;
};

/**
 * Renders a multi-step form for creating or editing a health plan, including basic information and plan benefit packages.
 *
 * Displays an error dialog on submission errors, dynamically updates the form title based on whether editing or adding a plan, and manages step navigation and validation. On submission, ensures each plan benefit package has an `isActive` flag set to `true` if undefined before invoking the submit handler.
 *
 * @param onSuccess - Optional callback invoked after successful form submission.
 * @param formData - Optional initial data for editing an existing health plan.
 * @param clientPubId - Identifier for the client associated with the health plan.
 * @param pubId - Optional identifier for the health plan being edited.
 */
export function HealthPlanForm({
  onSuccess,
  formData,
  clientPubId,
  pubId,
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
  } = useHealthPlanForm({
    onSuccess,
    formData,
    clientPubId,
    pubId,
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
          {formData ? "Edit Health Plan" : "Add New Health Plan"}
        </SheetTitle>
        <SteppedFormHeader
          currentStep={currentStep}
          steps={HealthPlanFormStepValues}
          setCurrentStep={setCurrentStep}
        />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                // Ensure isActive is always defined for each PBP
                const formattedData = {
                  ...values,
                  pbps: values.pbps.map((pbp) => ({
                    ...pbp,
                    isActive: pbp.isActive ?? true, // Default to true if undefined
                  })),
                };
                onSubmit(formattedData);
              })}
              className="space-y-4"
            >
              <fieldset disabled={isPending} className="space-y-4 mb-8">
                {/* Step 1: Basic Information */}
                <div className={currentStep === 1 ? "block" : "hidden"}>
                  <HealthPlanFormBasicInfoStep />
                </div>

                {/* Step 2: Heath Plan PBPs */}
                <div className={currentStep === 2 ? "block" : "hidden"}>
                  <HealthPlanFormPBPsStep />
                </div>
              </fieldset>
              {/* Navigation buttons */}
              <SteppedFormNavigationButtons
                steps={HealthPlanFormStepValues}
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
