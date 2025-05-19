"use client";

import { Form } from "@workspace/ui/components/form";
import { SheetHeader, SheetTitle } from "@workspace/ui/components/sheet";

import { UserCognito } from "@/types/user-cognito";
import { ErrorDialog } from "@/components/error-dialog";
import { SteppedFormHeader } from "@/components/stepped-form-header";
import { SteppedFormNavigationButtons } from "@/components/stepped-form-navigation-buttons";

import { useSteppedUserForm } from "../../hooks/use-stepped-user-form";
import { BasicInfoStep } from "./steps/basic-info-step";
import { UserFormStepValues } from "./steps/user-form-step-values";
import { UserIdsStep } from "./steps/user-ids-step";
import { UserTypeStep } from "./steps/user-type-step";

type props = {
  user?: UserCognito;
  onSuccess?: () => void;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders a multi-step user form with navigation, validation, and error handling.
 *
 * Displays a stepped interface for creating or editing a user, with separate steps for basic information, user type and permissions, and user IDs. Shows an error dialog if form submission fails. Navigation between steps is managed internally, and the form supports both new user creation and editing existing users.
 *
 * @param user - The user object to edit, or undefined to create a new user.
 * @param onSuccess - Optional callback invoked after successful form submission.
 * @param setIsSubmitting - Optional setter to control external submission state.
 */
export function SteppedUserForm({ user, onSuccess, setIsSubmitting }: props) {
  const {
    form,
    onSubmit,
    isPendingCreateUser,
    isPendingEditUser,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isStepValid,
    nextStep,
    prevStep,
    currentStep,
    setCurrentStep,
  } = useSteppedUserForm({
    onSuccess,
    user,
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
          {user ? "Edit User" : "Add New User"}
        </SheetTitle>
        <SteppedFormHeader
          currentStep={currentStep}
          steps={UserFormStepValues}
          setCurrentStep={setCurrentStep}
        />
      </SheetHeader>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-screen-lg mx-auto px-6 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Basic Information */}
              <div className={currentStep === 1 ? "block" : "hidden"}>
                <BasicInfoStep
                  isSubmitting={isPendingCreateUser || isPendingEditUser}
                />
              </div>

              {/* Step 2: User Type & Permissions */}
              <div className={currentStep === 2 ? "block" : "hidden"}>
                <UserTypeStep
                  isSubmitting={isPendingCreateUser || isPendingEditUser}
                />
              </div>

              {/* Step 3: User IDs */}
              <div className={currentStep === 3 ? "block" : "hidden"}>
                <UserIdsStep
                  isSubmitting={isPendingCreateUser || isPendingEditUser}
                />
              </div>

              {/* Navigation buttons */}
              <SteppedFormNavigationButtons
                steps={UserFormStepValues}
                currentStep={currentStep}
                prevStep={prevStep}
                nextStep={nextStep}
                isStepValid={isStepValid}
                isSubmitting={isPendingCreateUser || isPendingEditUser}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
