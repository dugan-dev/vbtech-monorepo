import { useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import { updateEntityAction } from "../actions/update-entity-action";
import {
  EditEntityFormData,
  EditEntityFormInput,
  EditEntityFormOutput,
  EditEntityFormSchema,
} from "../components/info/edit-entity-form/edit-entity-form-schema";

type props = {
  onSuccess: () => void;
  formData: EditEntityFormData;
  payerPubId: string;
};

export function useEditEntityForm({ onSuccess, formData, payerPubId }: props) {
  const form = useForm<EditEntityFormInput>({
    resolver: zodResolver(EditEntityFormSchema),
    defaultValues: formData,
  });

  const { slug: pubId } = useParams();

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

  const { execute, isPending } = useAction(updateEntityAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The network entity has been updated successfully.",
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
  });

  function onSubmit(formData: EditEntityFormOutput) {
    execute({
      pubId: pubId as string,
      formData,
      revalidationPath,
      payerPubId,
    });
  }

  return {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
