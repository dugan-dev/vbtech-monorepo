import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  payerPubId?: string;
  data?: PayerPyConfigFormData;
  pubId?: string;
};

export function useSteppedPayerPyConfigForm({
  onSuccess,
  setIsSubmitting,
  payerPubId,
  data,
  pubId,
}: props) {
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

  const revalidationPath = usePathname();

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

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

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

  function onSubmit(formData: PayerPyConfigFormOutput) {
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
  };
}
