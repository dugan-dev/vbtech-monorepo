import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { useErrorDialog } from "@/hooks/use-error-dialog";

import { insertPayerPyConfigAction } from "../actions/insert-payer-py-config-action";
import { updatePayerPyConfigAction } from "../actions/update-payer-py-config-action";
import {
  PayerPyConfigFormData,
  PayerPyConfigFormInput,
  PayerPyConfigFormOutput,
  PayerPyConfigFormSchema,
} from "../components/py-config/payer-py-config-form-schema";
import { PayerPyConfigFormSteps } from "../components/py-config/payer-py-config-form-steps";

// User types and role required to Edit
const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];
const REQUIRED_USER_ROLE: UserRole = "edit";

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  payerPubId?: string;
  data?: PayerPyConfigFormData;
  pubId?: string;
};

/**
 * Provides state management, validation, permission checks, and submission logic for a multi-step payer configuration form.
 *
 * This custom React hook manages the flow of a multi-step form for payer settings, including step navigation, per-step validation, and conditional submission for insert or update modes. It enforces user permission checks before allowing submission and handles error dialogs and success notifications.
 *
 * @param onSuccess - Callback invoked after successful form submission.
 * @param setIsSubmitting - Optional setter to control submitting state externally.
 * @param payerPubId - Payer identifier used when inserting a new configuration.
 * @param data - Existing configuration data; if present, the form operates in update mode.
 * @param pubId - Publication identifier used in update mode.
 * @returns An object with form state, submission handler, step navigation, error dialog controls, permission status, and step validation utilities.
 *
 * @remark Submission is blocked and an error dialog is shown if the current user lacks edit permissions for the payer.
 */
export function useSteppedPayerPyConfigForm({
  onSuccess,
  setIsSubmitting,
  payerPubId,
  data,
  pubId,
}: props) {
  // get user context for permission checks
  const usersAppAttrs = useUserContext();

  // get users payer specific permissions
  const payerPermissions = usersAppAttrs.ids?.find(
    (id) => id.id === payerPubId,
  );

  // assume user cannot edit
  let userCanEdit = false;

  // check if user can edit and update userCanEdit if they can
  if (
    payerPermissions &&
    ALLOWED_USER_TYPES.includes(usersAppAttrs.type) &&
    payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
  ) {
    userCanEdit = true;
  }

  // set up form state
  const steps = PayerPyConfigFormSteps;
  const [currentStep, setCurrentStep] = useState(1);

  // Navigate to next step
  const nextStep = () => {
    const canProceed = isStepValid(currentStep);

    if (canProceed || currentStep === 2) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Set revalidation path
  const revalidationPath = usePathname();

  // Set up react hook form
  const form = useForm<PayerPyConfigFormInput>({
    resolver: zodResolver(PayerPyConfigFormSchema),
    defaultValues: data,
    mode: "onChange",
  });

  // Non-async function that can be passed as prop
  const isStepValid = (step: number) => {
    if (step === 1) {
      // Check if there are any errors in the basicInfo fields
      const basicInfoFields = form.watch("basicInfo");
      const hasBasicInfoErrors =
        Object.keys(form.formState.errors).filter((key) =>
          key.startsWith("basicInfo"),
        ).length > 0;

      return basicInfoFields && !hasBasicInfoErrors;
    } else if (step === 2) {
      // Check if there are any errors in the physAssignment fields
      const physAssignmentFields = form.watch("physAssignment");
      const hasPhysAssignmentErrors =
        Object.keys(form.formState.errors).filter((key) =>
          key.startsWith("physAssignment"),
        ).length > 0;

      return physAssignmentFields && !hasPhysAssignmentErrors;
    }
    return true;
  };

  // Set up error dialog
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  // Set up update action
  const {
    execute: executeUpdatePayerPyConfig,
    isPending: isUpdatePayerPyConfigPending,
  } = useAction(updatePayerPyConfigAction, {
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
          : error.serverError
            ? error.serverError
            : (error as string),
      );
      setIsSubmitting?.(false);
    },
    onSuccess: () => {
      toast("Success", {
        description: "Payer Py Config was updated successfully.",
      });
      onSuccess?.();
      setIsSubmitting?.(false);
    },
  });

  // Set up insert action
  const {
    execute: executeInsertPayerPyConfig,
    isPending: isInsertPayerPyConfigPending,
  } = useAction(insertPayerPyConfigAction, {
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
          : error.serverError
            ? error.serverError
            : (error as string),
      );
      setIsSubmitting?.(false);
    },
    onSuccess: () => {
      toast("Success", {
        description: "Payer Py Config was saved successfully.",
      });
      onSuccess?.();
      setIsSubmitting?.(false);
    },
  });

  /**
   * Handles form submission for payer configuration, performing insert or update based on mode.
   *
   * If the user lacks edit permissions, displays an error dialog and aborts submission.
   *
   * @param formData - The form data to submit.
   */
  function onSubmit(formData: PayerPyConfigFormOutput) {
    if (!userCanEdit) {
      openErrorDialog(
        "Error",
        "You do not have permission to edit this payer.",
      );
      return;
    }

    setIsSubmitting?.(true);

    if (data && pubId) {
      executeUpdatePayerPyConfig({
        formData,
        pubId,
        revalidationPath,
      });
    } else {
      executeInsertPayerPyConfig({
        formData,
        payerPubId: payerPubId!,
        revalidationPath,
      });
    }
  }

  return {
    form,
    onSubmit,
    isPending: isUpdatePayerPyConfigPending || isInsertPayerPyConfigPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isStepValid,
    prevStep,
    nextStep,
    currentStep,
    steps,
    userCanEdit,
    setCurrentStep,
  };
}
