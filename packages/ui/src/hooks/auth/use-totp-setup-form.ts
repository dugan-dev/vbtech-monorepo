import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { handleSignInNextStep } from "../../lib/auth/handle-sign-in-next-step";
import {
  TotpSetupFormDefaultValues,
  TotpSetupFormOutput,
  TotpSetupFormSchema,
} from "../../lib/auth/totp-setup-form-schema";
import { getErrorMessage } from "../../lib/get-error-message";
import type { ConfirmSignInFunction, SignInResult } from "../../types/auth";
import { useErrorDialog } from "../use-error-dialog";

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
