import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";
import {
  SetupFormData,
  SetupFormDefaultValues,
  SetupFormInput,
  SetupFormOutput,
  SetupFormSchema,
} from "@/components/setup-form/setup-form-schema";

import { updateVBPayGlobalSettingsAction } from "../actions/update-vbpay-global-settings-action";
import { updateVBPayLicenseAction } from "../actions/update-vbpay-license-action";
import {
  AdminLicenseFormSteps,
  AdminSettingsFormSteps,
} from "../components/admin-settings-form-steps";

type props = {
  onSuccess?: () => void;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
  data: SetupFormData;
  from: "license" | "settings";
};

/**
 * Manages a multi-step admin settings form for updating VBPay license or global settings.
 *
 * This hook orchestrates form handling, step navigation, and validation for a multi-step
 * process. It leverages react-hook-form with zod validation to ensure that each form step
 * meets the required criteria before proceeding. Depending on the "from" flag, it selects the
 * appropriate steps and update action, resets the form on success, and displays error dialogs
 * on failure.
 *
 * @param props.onSuccess - Optional callback invoked after a successful update.
 * @param props.setIsSubmitting - Optional function to update the form's submitting state.
 * @param props.data - Initial form data used as default values.
 * @param props.from - Indicates the form context, either "license" for updating a VBPay license or "settings" for global settings.
 *
 * @returns An object containing the form instance, submission handler, pending state,
 *          error dialog properties, and functions for step validation and navigation.
 */
export function useSteppedAdminSettingsForm({
  onSuccess,
  setIsSubmitting,
  data,
  from,
}: props) {
  const steps =
    from === "license" ? AdminLicenseFormSteps : AdminSettingsFormSteps;
  const [currentStep, setCurrentStep] = useState(1);

  // Navigate to next step
  const nextStep = async () => {
    const canProceed = await form.trigger(
      from === "license"
        ? getFieldsForLicenseStep(currentStep)
        : getFieldsForSettingsStep(currentStep),
    );

    if (canProceed || currentStep === steps[steps.length - 1]?.id) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const revalidationPath = usePathname();

  const form = useForm<SetupFormInput>({
    resolver: zodResolver(SetupFormSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const watchLicenseInfo = form.watch("licenseInfo");
  const watchFunctionality = form.watch("functionality");
  const watchGlobalSettings = form.watch("globalSettings");

  const isStepValid = (step: number) => {
    if (from === "license" && step === 1) {
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
    } else if (from === "license" && step === 2) {
      return watchFunctionality.functionality.length > 0;
    } else if (from === "settings" && step === 1) {
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

  const {
    execute: executeUpdateVBPayLicense,
    isPending: isUpdateLicensePending,
  } = useAction(updateVBPayLicenseAction, {
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
        description: "The license was updated successfully.",
      });
      form.reset(SetupFormDefaultValues);
      onSuccess?.();
      setIsSubmitting?.(false);
    },
  });

  const {
    execute: executeUpdateVBPayGlobalSettings,
    isPending: isUpdateGlobalSettingsPending,
  } = useAction(updateVBPayGlobalSettingsAction, {
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
        description: "The global settings were updated successfully.",
      });
      form.reset(SetupFormDefaultValues);
      onSuccess?.();
      setIsSubmitting?.(false);
    },
  });

  function onSubmit(formData: SetupFormOutput) {
    setIsSubmitting?.(true);

    if (from === "license") {
      executeUpdateVBPayLicense({
        licenseInfo: formData.licenseInfo,
        functionality: formData.functionality,
        globalSettings: formData.globalSettings,
        revalidationPath,
      });
    } else if (from === "settings") {
      executeUpdateVBPayGlobalSettings({
        licenseInfo: formData.licenseInfo,
        functionality: formData.functionality,
        globalSettings: formData.globalSettings,
        revalidationPath,
      });
    }
  }

  const getFieldsForLicenseStep = (
    step: number,
  ): Array<keyof SetupFormInput> => {
    switch (step) {
      case 1:
        return ["licenseInfo"];
      case 2:
        return ["functionality"];
      default:
        return [];
    }
  };

  const getFieldsForSettingsStep = (
    step: number,
  ): Array<keyof SetupFormInput> => {
    switch (step) {
      case 1:
        return ["globalSettings"];
      default:
        return [];
    }
  };

  return {
    form,
    onSubmit,
    isPending: isUpdateLicensePending || isUpdateGlobalSettingsPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isStepValid,
    prevStep,
    nextStep,
    currentStep,
    steps,
  };
}
