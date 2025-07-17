import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { insertClientAction } from "../actions/insert-client-action";
import { updateClientAction } from "../actions/update-client-action";
import {
  ClientFormData,
  ClientFormDefaultValues,
  ClientFormInput,
  ClientFormOutput,
  ClientFormSchema,
} from "../components/client-form/client-form-schema";

type props = {
  onSuccess?: () => void;
  formData?: ClientFormData;
  clientPubId?: string;
};

export function useClientForm({ onSuccess, formData, clientPubId }: props) {
  const form = useForm<ClientFormInput>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: formData ?? ClientFormDefaultValues,
  });

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

  const { execute: executeInsertClient, isPending: isPendingInsertClient } =
    useAction(insertClientAction, {
      onSuccess: () => {
        toast("Success", {
          description: "The client has been created successfully.",
        });
        onSuccess?.();
        form.reset();
      },
      onError: ({ error }) => {
        openErrorDialog("Error", getErrorMessage(error));
      },
    });

  const { execute: executeUpdateClient, isPending: isPendingUpdateClient } =
    useAction(updateClientAction, {
      onSuccess: () => {
        toast("Success", {
          description: "The client has been updated successfully.",
        });
        onSuccess?.();
        form.reset();
      },
      onError: ({ error }) => {
        openErrorDialog("Error", getErrorMessage(error));
      },
    });

  function onSubmit(formData: ClientFormOutput) {
    if (formData && clientPubId) {
      executeUpdateClient({ pubId: clientPubId, formData, revalidationPath });
    } else {
      executeInsertClient({
        formData,
        revalidationPath,
      });
    }
  }

  return {
    form,
    onSubmit,
    isPending: isPendingInsertClient || isPendingUpdateClient,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
