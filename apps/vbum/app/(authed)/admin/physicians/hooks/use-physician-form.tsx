import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { insertPhysicianAction } from "../actions/insert-physician-action";
import { updatePhysicianAction } from "../actions/update-physician-action";
import {
  PhysicianFormData,
  PhysicianFormDefaultValues,
  PhysicianFormInput,
  PhysicianFormSchema,
} from "../components/physician-form/physician-form-schema";

type props = {
  onSuccess?: () => void;
  formData?: PhysicianFormData;
  physPubId?: string;
};

export function usePhysicianForm({ onSuccess, formData, physPubId }: props) {
  const form = useForm<PhysicianFormInput>({
    resolver: zodResolver(PhysicianFormSchema),
    defaultValues: formData ?? PhysicianFormDefaultValues,
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
    execute: executeInsertPhysician,
    isPending: isPendingInsertPhysician,
  } = useAction(insertPhysicianAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The physician has been created successfully.",
      });
      onSuccess?.();
      form.reset();
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  const {
    execute: executeUpdatePhysician,
    isPending: isPendingUpdatePhysician,
  } = useAction(updatePhysicianAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The Physician has been updated successfully.",
      });
      onSuccess?.();
      form.reset();
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  function onSubmit(formData: PhysicianFormInput) {
    if (physPubId) {
      executeUpdatePhysician({
        pubId: physPubId,
        formData,
        revalidationPath,
      });
    } else {
      executeInsertPhysician({
        formData,
        revalidationPath,
      });
    }
  }

  return {
    form,
    onSubmit,
    isPending: isPendingInsertPhysician || isPendingUpdatePhysician,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
