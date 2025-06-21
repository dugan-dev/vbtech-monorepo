import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

type UpdatePasswordFormOutput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type props = {
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  closeDialog: () => void;
  schema: z.ZodSchema;
  defaultValues: UpdatePasswordFormOutput;
};

export function useUpdatePasswordForm({
  updatePassword,
  closeDialog,
  schema,
  defaultValues,
}: props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (formData: UpdatePasswordFormOutput) => {
    setIsLoading(true);

    try {
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
