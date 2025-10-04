import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { insertHealthPlanAction } from "../actions/insert-health-plan-action";
import { updateHealthPlanAction } from "../actions/update-health-plan-action";
import {
  HealthPlanFormData,
  HealthPlanFormDefaultValues,
  HealthPlanFormInput,
  HealthPlanFormOutput,
  HealthPlanFormSchema,
} from "../components/health-plan-form/health-plan-form-schema";

type props = {
  onSuccess?: () => void;
  formData?: HealthPlanFormData;
  clientPubId: string;
  healthPlanPubId?: string;
};

export function useHealthPlanForm({
  onSuccess,
  formData,
  clientPubId,
  healthPlanPubId,
}: props) {
  const form = useForm<HealthPlanFormInput>({
    resolver: zodResolver(HealthPlanFormSchema),
    defaultValues: formData ?? HealthPlanFormDefaultValues,
  });

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

  const {
    execute: executeInsertHealthPlan,
    isPending: isPendingInsertHealthPlan,
  } = useAction(insertHealthPlanAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The health plan has been created successfully.",
      });
      onSuccess?.();
      form.reset();
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  const {
    execute: executeUpdateHealthPlan,
    isPending: isPendingUpdateHealthPlan,
  } = useAction(updateHealthPlanAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The health plan has been updated successfully.",
      });
      onSuccess?.();
      form.reset();
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  function onSubmit(formData: HealthPlanFormOutput) {
    if (formData && healthPlanPubId) {
      executeUpdateHealthPlan({
        pubId: healthPlanPubId,
        clientPubId: clientPubId,
        formData,
        revalidationPath,
      });
    } else {
      executeInsertHealthPlan({
        formData,
        clientPubId,
        revalidationPath,
      });
    }
  }

  return {
    form,
    onSubmit,
    isPending: isPendingInsertHealthPlan || isPendingUpdateHealthPlan,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
