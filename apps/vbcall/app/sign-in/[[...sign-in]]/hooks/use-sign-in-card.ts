import { useState } from "react";
import { resetPassword, type SignInOutput } from "aws-amplify/auth";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

/**
 * Provides state and logic for managing user sign-in and password reset flows in a sign-in card component.
 *
 * Exposes state variables for the current sign-in state and email addresses, as well as functions for handling password reset requests and error dialog management.
 *
 * @returns An object containing sign-in state, email management, password reset handling, and error dialog controls for use in authentication UI components.
 */
export function useSignInCard() {
  const [currentState, setCurrentState] = useState<SignInOutput | null>(null);
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
