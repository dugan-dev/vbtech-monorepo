import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";
import {
  SetupFormDefaultValues,
  SetupFormInput,
  SetupFormOutput,
  SetupFormSchema,
} from "@/components/setup-form/setup-form-schema";
import { completeSetupAction } from "@/app/setup/actions/complete-setup-action";

import { SetupFormSteps } from "../components/setup-form-steps";

type props = {
  onSuccess?: () => void;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Manages a multi-step setup form with validation, navigation, and submission handling.
 *
 * This hook sets up a form using React Hook Form with Zod schema validation and tracks the current form step,
 * providing helper functions to move between steps. It validates the current step's fields asynchronously before
 * proceeding and handles submission by triggering a complete setup action. On successful submission, it resets the form,
 * invokes an optional success callback, updates submission state, and navigates to the home route.
 *
 * @param onSuccess Callback invoked when the setup completes successfully.
 * @param setIsSubmitting Optional callback to update the submission state.
 *
 * @returns An object containing:
 * - form: The form instance for managing form state.
 * - onSubmit: Handler function for form submission.
 * - isPending: Flag indicating if the setup action is in progress.
 * - isErrorDialogOpen: Flag indicating whether the error dialog is open.
 * - errorMsg: Error message to display.
 * - errorTitle: Title for the error dialog.
 * - closeErrorDialog: Function to close the error dialog.
 * - isStepValid: Function to validate the fields of the current step.
 * - prevStep: Function to navigate to the previous form step.
 * - nextStep: Function to navigate to the next form step.
 * - currentStep: The current step number in the setup process.
 */
export function useSteppedSetupForm({ onSuccess, setIsSubmitting }: props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Navigate to next step
  const nextStep = async () => {
    const canProceed = await form.trigger(getFieldsForStep(currentStep));

    if (canProceed || currentStep === 3) {
      setCurrentStep((prev) => Math.min(prev + 1, SetupFormSteps.length));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const revalidationPath = usePathname();

  const form = useForm<SetupFormInput>({
    resolver: zodResolver(SetupFormSchema),
    defaultValues: SetupFormDefaultValues,
    mode: "onChange",
  });

  const watchLicenseInfo = form.watch("licenseInfo");
  const watchFunctionality = form.watch("functionality");
  const watchGlobalSettings = form.watch("globalSettings");

  const isStepValid = (step: number) => {
    if (step === 1) {
      return (
        watchLicenseInfo.type !== "" &&
        watchLicenseInfo.numPayers !== "" &&
        watchLicenseInfo.fromDate !== "" &&
        watchLicenseInfo.toDate !== "" &&
        watchLicenseInfo.clientName !== "" &&
        watchLicenseInfo.pocName !== "" &&
        watchLicenseInfo.pocPhone !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchLicenseInfo.pocEmail)
      );
    } else if (step === 2) {
      return watchFunctionality.functionality.length > 0;
    } else if (step === 3) {
      return watchGlobalSettings.allowedPayerTypes.length > 0;
    }
    return true;
  };

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { execute: executeCompleteSetup, isPending } = useAction(
    completeSetupAction,
    {
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
          description: "The setup was completed successfully.",
        });
        form.reset(SetupFormDefaultValues);
        onSuccess?.();
        setIsSubmitting?.(false);
        router.replace(Home({}));
      },
    },
  );

  function onSubmit(formData: SetupFormOutput) {
    setIsSubmitting?.(true);
    executeCompleteSetup({
      licenseInfo: formData.licenseInfo,
      functionality: formData.functionality,
      globalSettings: formData.globalSettings,
      revalidationPath,
    });
  }

  const getFieldsForStep = (step: number): Array<keyof SetupFormInput> => {
    switch (step) {
      case 1:
        return ["licenseInfo"];
      case 2:
        return ["functionality"];
      case 3:
        return ["globalSettings"];
      default:
        return [];
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isStepValid,
    prevStep,
    nextStep,
    currentStep,
  };
}
