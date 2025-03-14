import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import { useErrorDialog } from "@/hooks/use-error-dialog";
import {
  UpdatePasswordFormDefaultValues,
  UpdatePasswordFormOutput,
  UpdatePasswordFormSchema,
} from "@/components/update-password-form/update-password-form-schema";

type props = {
  closeDialog: () => void;
};

export function useUpdatePasswordForm({ closeDialog }: props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const form = useForm({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: UpdatePasswordFormDefaultValues,
  });

  const onSubmit = async (formData: UpdatePasswordFormOutput) => {
    setIsLoading(true);

    try {
      await updatePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
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
