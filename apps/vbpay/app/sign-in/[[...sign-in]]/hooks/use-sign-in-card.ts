import { useState } from "react";
import { getErrorMessage } from "@/utils/get-error-message";
import { resetPassword, type SignInOutput } from "aws-amplify/auth";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";

export function useSignInCard() {
  const [currentState, setCurrentState] = useState<SignInOutput | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { theme } = useTheme();
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
      await resetPassword({ username: email });
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
    theme,
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
