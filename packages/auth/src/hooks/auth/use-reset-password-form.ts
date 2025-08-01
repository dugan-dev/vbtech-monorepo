import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import {
  ResetPasswordFormDefaultValues,
  ResetPasswordFormOutput,
  ResetPasswordFormSchema,
} from "../../lib/auth/reset-password-form-schema";
import { ConfirmResetPasswordFunction } from "../../types/auth/password-reset";

type props = {
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  emailForReset: string | null;
  confirmResetPasswordFn: ConfirmResetPasswordFunction;
};

export function useResetPasswordForm({
  setEmailForReset,
  emailForReset,
  confirmResetPasswordFn,
}: props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const handleError = (message: string) => {
    openErrorDialog("Error", message);
  };

  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: ResetPasswordFormDefaultValues,
  });

  const onSubmit = async (formData: ResetPasswordFormOutput) => {
    setIsLoading(true);

    try {
      if (!emailForReset) {
        throw new Error("Email is required for password reset");
      }
      await confirmResetPasswordFn({
        username: emailForReset,
        confirmationCode: formData.code,
        newPassword: formData.password,
      });
      toast("Success", {
        description:
          "Your password has been updated successfully. Please sign in.",
        duration: Infinity,
        dismissible: true,
        position: "top-center",
      });
    } catch (e) {
      console.error(e);
      handleError(getErrorMessage(e));
    }

    setIsLoading(false);
    setEmailForReset(null);
  };

  return {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  };
}
