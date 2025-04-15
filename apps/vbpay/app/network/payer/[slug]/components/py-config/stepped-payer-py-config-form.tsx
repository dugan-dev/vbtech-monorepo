"use client";

import { EditButton } from "@workspace/ui/components/edit-button";
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
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Displays a multi-step form for adding, viewing, or editing payer performance year configuration.
 *
 * The form supports both add and edit modes, determined by the presence of configuration data and identifiers. It includes steps for entering basic configuration information and assigning physicians. The form can be toggled between view and edit modes, with fields disabled when not editing. An error dialog is shown if submission or validation fails.
 *
 * @param onSuccess - Callback triggered after successful form submission.
 * @param setIsSubmitting - Updates the submission state during the form lifecycle.
 * @param data - Optional configuration data for pre-populating the form in edit mode.
 * @param payerPubId - Identifier for the payer’s publication.
 * @param pubId - Publication identifier used to determine add or edit mode.
 * @param isEditing - Indicates whether the form is currently in editing mode.
 * @param setIsEditing - Setter to toggle editing mode.
 *
 * @returns The rendered multi-step configuration form.
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
          setCurrentStep={pubId && data ? setCurrentStep : undefined}
          isEditing={isEditing}
        />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <fieldset
                disabled={isPending || !isEditing}
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
