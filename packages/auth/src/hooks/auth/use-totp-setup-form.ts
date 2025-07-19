import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { handleSignInNextStep } from "../../lib/auth/handle-sign-in-next-step";
import {
  TotpSetupFormDefaultValues,
  TotpSetupFormOutput,
  TotpSetupFormSchema,
} from "../../lib/auth/totp-setup-form-schema";
import type { ConfirmSignInFunction, SignInResult } from "../../types/auth/sign-in";

type props<T> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  confirmSignInFn: ConfirmSignInFunction;
};

export function useTotpSetupForm<
  T extends { nextStep: { signInStep: string } } = SignInResult,
>({ setCurrentState, confirmSignInFn }: props<T>) {
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
    let output: T | null = null;

    try {
      const result = await confirmSignInFn({
        challengeResponse: formData.code,
      });

      // Validate the result has the expected structure
      if (
        !result ||
        typeof result !== "object" ||
        !("nextStep" in result) ||
        !result.nextStep ||
        typeof result.nextStep !== "object" ||
        !("signInStep" in result.nextStep) ||
        typeof result.nextStep.signInStep !== "string"
      ) {
        throw new Error(
          "Invalid sign-in result: missing required nextStep.signInStep",
        );
      }

      // Type-safe assertion: We've validated the structure matches T's constraint
      // Using unknown intermediate cast to satisfy TypeScript's strict checking
      // This is safe because we've verified the runtime structure
      output = result as unknown as T;
    } catch (e) {
      console.error(e);
      handleError(getErrorMessage(e));
      setIsLoading(false);
      return;
    }

    if (output) {
      handleSignInNextStep(output, setCurrentState, setIsLoading, handleError);
    }
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
