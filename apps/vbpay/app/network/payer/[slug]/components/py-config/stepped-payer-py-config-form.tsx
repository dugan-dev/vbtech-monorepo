"use client";

import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { ErrorDialog } from "@/components/error-dialog";
import { SteppedFormHeader } from "@/components/stepped-form-header";
import { SteppedFormNavigationButtons } from "@/components/stepped-form-navigation-buttons";

import { useSteppedPayerPyConfigForm } from "../../hooks/use-payer-py-config-form";
import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { PayerPyConfigBasicInfoStep1 } from "./steps/payer-py-config-basic-info-step1";
import { PayerPyConfigPhysAssignmentStep2 } from "./steps/payer-py-config-phys-assignment-step2";

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  data?: PayerPyConfigFormData;
  payerPubId?: string;
  pubId?: string;
};

/**
 * Renders a multi-step form for configuring payer performance year settings.
 *
 * This component leverages a custom hook to manage form state, handle submission, validate
 * each step, and display an error dialog if issues occur. It conditionally renders two steps—
 * one for entering basic configuration information and another for physician assignment.
 * The form operates in add mode or edit mode based on the presence of configuration data.
 *
 * @param onSuccess - Callback invoked upon successful form submission.
 * @param setIsSubmitting - Function to update the submission state during the form lifecycle.
 * @param data - Optional configuration data used to pre-populate the form in edit mode.
 * @param payerPubId - Identifier for the payer’s publication.
 * @param pubId - Publication identifier that determines if the form is in add or edit mode.
 * @returns A JSX element representing the multi-step form.
 */
export function SteppedPayerPyConfigForm({
  onSuccess,
  setIsSubmitting,
  data,
  payerPubId,
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
    steps,
  } = useSteppedPayerPyConfigForm({
    onSuccess,
    setIsSubmitting,
    data,
    payerPubId,
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
          {pubId && data
            ? `Edit ${data.basicInfo.perfYear} Performance Year Configuration`
            : "Add Performance Year Configuration"}
        </SheetTitle>
        <SteppedFormHeader currentStep={currentStep} steps={steps} />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Basic Information */}
              <div className={currentStep === 1 ? "block" : "hidden"}>
                <PayerPyConfigBasicInfoStep1 isSubmitting={isPending} />
              </div>

              {/* Step 2: Physician Assignment */}
              <div className={currentStep === 2 ? "block" : "hidden"}>
                <PayerPyConfigPhysAssignmentStep2 isSubmitting={isPending} />
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
