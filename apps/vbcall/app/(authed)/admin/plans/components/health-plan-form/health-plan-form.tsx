"use client";

import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { ErrorDialog } from "@/components/error-dialog";
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
