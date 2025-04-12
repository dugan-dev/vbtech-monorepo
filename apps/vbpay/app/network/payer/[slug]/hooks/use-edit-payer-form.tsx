import { useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import { updatePayerAction } from "../actions/update-payer-action";
import {
  EditPayerFormData,
  EditPayerFormInput,
  EditPayerFormOutput,
  EditPayerFormSchema,
} from "../components/info/edit-payer-form/edit-payer-form-schema";

type props = {
  onSuccess: () => void;
  formData: EditPayerFormData;
};

export function useEditPayerForm({ onSuccess, formData }: props) {
  const form = useForm<EditPayerFormInput>({
    resolver: zodResolver(EditPayerFormSchema),
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

  const { execute, isPending } = useAction(updatePayerAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The payer has been updated successfully.",
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

  function onSubmit(formData: EditPayerFormOutput) {
    execute({
      pubId: pubId as string,
      formData,
      revalidationPath,
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
