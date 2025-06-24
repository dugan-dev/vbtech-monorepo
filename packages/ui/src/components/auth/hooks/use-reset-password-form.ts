import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmResetPassword } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import {
  ResetPasswordFormDefaultValues,
  ResetPasswordFormOutput,
  ResetPasswordFormSchema,
} from "../schemas/reset-password-form-schema";

type props = {
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  emailForReset: string | null;
};

/**
 * Hook for managing reset password form state and logic.
 *
 * This hook provides complete state management for the password reset flow including:
 * - Form validation using Zod schema
 * - AWS Amplify integration for password reset confirmation
 * - Loading states and error handling
 * - Success notifications and state cleanup
 *
 * @param props - Hook props including email reset state management
 * @returns Object containing form instance, submission handler, and UI state
 */
export function useResetPasswordForm({
  setEmailForReset,
  emailForReset,
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
      await confirmResetPassword({
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
