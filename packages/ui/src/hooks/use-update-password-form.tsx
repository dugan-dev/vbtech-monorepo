import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodSchema } from "zod";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

type props<T extends object> = {
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  closeDialog: () => void;
  schema: ZodSchema<T>;
  defaultValues: T;
};

export function useUpdatePasswordForm<T extends object>({
  updatePassword,
  closeDialog,
  schema,
  defaultValues,
}: props<T>) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as import("react-hook-form").DefaultValues<T>,
  });

  const onSubmit = async (formData: T) => {
    setIsLoading(true);

    try {
      // @ts-expect-error: The formData type is generic, but we expect currentPassword and newPassword fields
      await updatePassword(formData.currentPassword, formData.newPassword);
    } catch (e) {
      console.error(e);
      openErrorDialog("Error", getErrorMessage(e));
      setIsLoading(false);
      return;
    }

    closeDialog();

    toast("Success", {
      description: "Your password has been updated successfully.",
      dismissible: true,
      duration: 10000,
      position: "top-center",
    });
  };

  return {
    form,
    isErrorDialogOpen,
    errorTitle,
    errorMsg,
    closeErrorDialog,
    onSubmit,
    isLoading,
  };
}
