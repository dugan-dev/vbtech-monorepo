"use client";

import { EditButton } from "@workspace/ui/components/edit-button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { SteppedFormHeader } from "@workspace/ui/components/forms/stepped-form-header";
import { SteppedFormNavigationButtons } from "@workspace/ui/components/forms/stepped-form-navigation-buttons";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { useSteppedPayerPyConfigForm } from "../../hooks/use-payer-py-config-form";
import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { PayerPyConfigBasicInfoStep1 } from "./steps/payer-py-config-basic-info-step1";
import { PayerPyConfigPhysAssignmentStep2 } from "./steps/payer-py-config-phys-assignment-step2";

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  data?: PayerPyConfigFormData;
  payerPubId: string;
  pubId?: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders a two-step form for adding, viewing, or editing payer performance year configuration.
 *
 * The form adapts its mode based on provided configuration data and editing state, supporting step navigation, validation, and error handling. Input fields and navigation are disabled when submitting or when viewing without editing. An error dialog is displayed if submission or validation fails.
 *
 * @returns The multi-step payer performance year configuration form UI.
 */
export function SteppedPayerPyConfigForm({
  onSuccess,
  setIsSubmitting,
  data,
  payerPubId,
  pubId,
  isEditing,
  setIsEditing,
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
    userCanEdit,
    setCurrentStep,
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
            ? `${isEditing ? "Edit" : "View"} ${data.basicInfo.perfYear} Performance Year Configuration`
            : "Add Performance Year Configuration"}
        </SheetTitle>
        <SteppedFormHeader
          currentStep={currentStep}
          steps={steps}
          setCurrentStep={setCurrentStep}
        />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <fieldset
                disabled={
                  isPending || (data && pubId && !isEditing ? true : false)
                }
                className="space-y-4 mb-8"
              >
                {/* Step 1: Basic Information */}
                <div className={currentStep === 1 ? "block" : "hidden"}>
                  <PayerPyConfigBasicInfoStep1 isSubmitting={isPending} />
                </div>

                {/* Step 2: Physician Assignment */}
                <div className={currentStep === 2 ? "block" : "hidden"}>
                  <PayerPyConfigPhysAssignmentStep2 isSubmitting={isPending} />
                </div>
              </fieldset>

              {data && pubId && !isEditing ? (
                <div className="flex pt-4 border-t justify-end">
                  <EditButton
                    setIsEditing={setIsEditing}
                    userCanEdit={userCanEdit}
                  />
                </div>
              ) : (
                <SteppedFormNavigationButtons
                  steps={steps}
                  currentStep={currentStep}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  isStepValid={isStepValid}
                  isSubmitting={isPending}
                />
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
