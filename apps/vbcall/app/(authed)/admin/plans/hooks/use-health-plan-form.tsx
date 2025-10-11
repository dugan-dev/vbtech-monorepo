import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { insertHealthPlanAction } from "../actions/insert-health-plan-action";
import { updateHealthPlanAction } from "../actions/update-health-plan-action";
import {
  HealthPlanFormData,
  HealthPlanFormDefaultValues,
  HealthPlanFormInput,
  HealthPlanFormSchema,
} from "../components/health-plan-form/health-plan-form-schema";
import { HealthPlanFormStepValues } from "../components/health-plan-form/health-plan-form-step-values";

type props = {
  onSuccess?: () => void;
  formData?: HealthPlanFormData;
  clientPubId: string;
  pubId?: string;
};

/**
 * React hook for managing a multi-step health plan form with validation, submission, and error handling.
 *
 * Provides step navigation, field validation, and handles both creation and updating of health plans. Integrates error dialog management and exposes form state and controls for use in UI components.
 *
 * @param onSuccess - Optional callback invoked after successful form submission.
 * @param formData - Optional initial form data to prefill the form.
 * @param clientPubId - Unique identifier for the client.
 * @param pubId - Optional identifier for updating an existing health plan.
 *
 * @returns An object containing the form instance, submission handler, loading state, error dialog controls, step validation checker, navigation functions, and current step state.
 */
export function useHealthPlanForm({
  onSuccess,
  formData,
  clientPubId,
  pubId,
}: props) {
  const [currentStep, setCurrentStep] = useState(formData ? 2 : 1);
  const form = useForm<HealthPlanFormInput>({
    resolver: zodResolver(HealthPlanFormSchema),
    defaultValues: formData ?? HealthPlanFormDefaultValues,
  });

  // Navigate to next step
  const nextStep = async () => {
    let canProceed = false;

    if (currentStep === 1) {
      // Validate only the basic info fields
      const result = await form.trigger([
        "planName",
        "planId",
        "phoneNumber",
        "faxNumber",
      ]);
      canProceed = result;
    } else if (currentStep === 2) {
      // Validate only the PBP fields
      // We need to trigger validation for each PBP field individually
      const pbpsArray = form.getValues("pbps");
      const validationPromises = pbpsArray.map((_, index) => {
        return form.trigger([`pbps.${index}.pbpId`, `pbps.${index}.pbpName`]);
      });

      const validationResults = await Promise.all(validationPromises);
      canProceed = validationResults.every((result) => result === true);
    }

    if (canProceed || currentStep === 3) {
      setCurrentStep((prev) =>
        Math.min(prev + 1, HealthPlanFormStepValues.length),
      );
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const planName = useWatch({ control: form.control, name: "planName" });
  const planId = useWatch({ control: form.control, name: "planId" });
  const phoneNumber = useWatch({ control: form.control, name: "phoneNumber" });
  const faxNumber = useWatch({ control: form.control, name: "faxNumber" });
  const pbps = useWatch({ control: form.control, name: "pbps" });

  const isStepValid = (step: number) => {
    if (step === 1) {
      return (
        planName.length > 0 &&
        planId.length > 0 &&
        phoneNumber.length > 0 &&
        faxNumber.length > 0
      );
    }
    if (step === 2) {
      return (
        pbps.length > 0 &&
        pbps.every((pbp) => pbp.pbpId.length > 0 && pbp.pbpName.length > 0)
      );
    }
    if (step === 3) {
      return true; // Review step is always valid if reached
    }
    return false;
  };

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

  const { execute: executeInsert, isPending: isPendingInsert } = useAction(
    insertHealthPlanAction,
    {
      onSuccess: () => {
        toast("Success", {
          description: "The health plan has been created successfully.",
        });
        onSuccess?.();
        form.reset();
      },
      onError: ({ error }) => {
        openErrorDialog(
          "Error",
          error.validationErrors
            ? `Invalid inputs. Please double check the data and try again. If the problem persists please contact support. ${JSON.stringify(error)}`
            : error.serverError
              ? error.serverError
              : (error as string),
        );
      },
    },
  );

  const { execute: executeUpdate, isPending: isPendingUpdate } = useAction(
    updateHealthPlanAction,
    {
      onSuccess: () => {
        toast("Success", {
          description: "The health plan has been updated successfully.",
        });
        onSuccess?.();
        form.reset();
      },
      onError: ({ error }) => {
        openErrorDialog(
          "Error",
          error.validationErrors
            ? `Invalid inputs. Please double check the data and try again. If the problem persists please contact support. ${JSON.stringify(error)}`
            : error.serverError
              ? error.serverError
              : (error as string),
        );
      },
    },
  );

  // Define a custom type that ensures isActive is always boolean
  type HealthPlanFormWithRequiredIsActive = {
    planName: string;
    planId: string;
    phoneNumber: string;
    faxNumber: string;
    pbps: {
      pbpPubId: string;
      isActive: boolean;
      pbpId: string;
      pbpName: string;
    }[];
  };

  function onSubmit(formData: HealthPlanFormWithRequiredIsActive) {
    if (formData && pubId) {
      executeUpdate({ pubId, formData, revalidationPath, clientPubId });
    } else {
      executeInsert({
        formData,
        revalidationPath,
        clientPubId,
      });
    }
  }

  return {
    form,
    onSubmit,
    isPending: isPendingInsert || isPendingUpdate,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isStepValid,
    prevStep,
    nextStep,
    currentStep,
    setCurrentStep,
  };
}
