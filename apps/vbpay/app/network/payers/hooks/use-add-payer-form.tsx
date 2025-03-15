import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import { insertPayerAction } from "../actions/insert-payer-action";
import {
  AddPayerFormDefaultValues,
  AddPayerFormInput,
  AddPayerFormOutput,
  AddPayerFormSchema,
} from "../components/add-payer-form/add-payer-form-schema";

type props = {
  onSuccess?: () => void;
};

export function useAddPayerForm({ onSuccess }: props) {
  const form = useForm<AddPayerFormInput>({
    resolver: zodResolver(AddPayerFormSchema),
    defaultValues: AddPayerFormDefaultValues,
  });

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

  const { execute: execInsertPayerAction, isPending: isInsertPayerPending } =
    useAction(insertPayerAction, {
      onSuccess: () => {
        toast("Success", {
          description: "The payer has been created successfully.",
        });
        onSuccess?.();
        form.reset();
      },
      onError: ({ error }) => {
        openErrorDialog(
          "Error",
          error.validationErrors
            ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
            : error.serverError
              ? error.serverError
              : (error as string),
        );
      },
    });

  function onSubmit(formData: AddPayerFormOutput) {
    execInsertPayerAction({
      formData: {
        ...formData,
        initPerfMo: Number(formData.initPerfMo),
        initPerfYr: Number(formData.initPerfYr),
      },
      revalidationPath,
    });
  }

  return {
    form,
    onSubmit,
    isInsertPayerPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
