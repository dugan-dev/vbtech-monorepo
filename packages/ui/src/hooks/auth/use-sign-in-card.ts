import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@workspace/utils/get-error-message";

import type { ResetPasswordFunction } from "../../types/auth";
import { useErrorDialog } from "../use-error-dialog";

type props = {
  resetPasswordFn: ResetPasswordFunction;
};

export function useSignInCard<T extends { nextStep: { signInStep: string } }>({
  resetPasswordFn,
}: props) {
  const [currentState, setCurrentState] = useState<T | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [emailForReset, setEmailForReset] = useState<string | null>(null);

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

  const handleForgotPassword = async (email: string) => {
    setEmailForReset(email);
    try {
      await resetPasswordFn({ username: email });
      toast("Success", {
        description:
          "An email has been sent with a verification code to reset your password.",
        duration: Infinity,
        dismissible: true,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      handleError(getErrorMessage(error));
      setEmailForReset(null);
    }
  };

  return {
    currentState,
    setCurrentState,
    email,
    setEmail,
    emailForReset,
    setEmailForReset,
    handleForgotPassword,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  };
}
