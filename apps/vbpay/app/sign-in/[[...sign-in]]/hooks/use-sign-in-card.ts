import { useState } from "react";
import { resetPassword, type SignInOutput } from "aws-amplify/auth";
import { toast } from "sonner";

import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import { useErrorDialog } from "@/hooks/use-error-dialog";

/**
 * Provides state and logic for managing user sign-in and password reset flows in a sign-in card component.
 *
 * Exposes state variables for the current sign-in state, user email, and password reset email, along with setters for each. Includes error dialog state and controls, and a function to initiate the password reset process, which displays a notification on success or an error dialog on failure.
 *
 * @returns An object containing sign-in state, email values and setters, password reset handler, and error dialog controls.
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
