import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmSignIn, SignInOutput } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import {
  MfaVerificationFormDefaultValues,
  MfaVerificationFormOutput,
  MfaVerificationFormSchema,
} from "../schemas/mfa-verification-form-schema";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
};

/**
 * Hook for managing MFA verification form state and logic during sign-in.
 *
 * This hook provides complete state management for the MFA verification flow
 * during the authentication process including:
 * - Form validation using Zod schema
 * - AWS Amplify integration for sign-in confirmation
 * - Loading states and error handling
 * - Success notifications and state management
 *
 * @param props - Hook props including sign-in state management
 * @returns Object containing form instance, submission handler, and UI state
 */
export function useMfaVerificationForm({ setCurrentState }: props) {
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
    resolver: zodResolver(MfaVerificationFormSchema),
    defaultValues: MfaVerificationFormDefaultValues,
  });

  const onSubmit = async (formData: MfaVerificationFormOutput) => {
    setIsLoading(true);

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: formData.code,
      });

      if (isSignedIn) {
        toast("Success", {
          description: "MFA verification successful. You are now signed in.",
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
