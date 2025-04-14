import { useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import { updatePhysicianAction } from "../actions/update-physician-action";
import {
  EditPhysicianFormData,
  EditPhysicianFormInput,
  EditPhysicianFormOutput,
  EditPhysicianFormSchema,
} from "../components/info/edit-physician-form/edit-physician-form-schema";

type props = {
  onSuccess: () => void;
  formData: EditPhysicianFormData;
  payerPubId: string;
};

export function useEditPhysicianForm({
  onSuccess,
  formData,
  payerPubId,
}: props) {
  const form = useForm<EditPhysicianFormInput>({
    resolver: zodResolver(EditPhysicianFormSchema),
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

  const { execute, isPending } = useAction(updatePhysicianAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The network physician has been updated successfully.",
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

  function onSubmit(formData: EditPhysicianFormOutput) {
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
