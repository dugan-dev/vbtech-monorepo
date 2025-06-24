import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmSignIn, SignInOutput } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import {
  TotpSetupFormDefaultValues,
  TotpSetupFormOutput,
  TotpSetupFormSchema,
} from "../schemas/totp-setup-form-schema";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
};

/**
 * Hook for managing TOTP setup form state and logic during sign-in.
 *
 * This hook provides complete state management for the TOTP setup flow
 * during the authentication process including:
 * - Form validation using Zod schema
 * - AWS Amplify integration for sign-in confirmation
 * - Loading states and error handling
 * - Success notifications and state management
 *
 * @param props - Hook props including sign-in state management
 * @returns Object containing form instance, submission handler, and UI state
 */
export function useTotpSetupForm({ setCurrentState }: props) {
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
    resolver: zodResolver(TotpSetupFormSchema),
    defaultValues: TotpSetupFormDefaultValues,
  });

  const onSubmit = async (formData: TotpSetupFormOutput) => {
    setIsLoading(true);

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: formData.code,
      });

      if (isSignedIn) {
        toast("Success", {
          description: "TOTP setup successful. You are now signed in.",
        });
        setCurrentState(null);
      } else {
        setCurrentState({ isSignedIn, nextStep });
      }
    } catch (e) {
      console.error(e);
      handleError(getErrorMessage(e));
    }

    setIsLoading(false);
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
