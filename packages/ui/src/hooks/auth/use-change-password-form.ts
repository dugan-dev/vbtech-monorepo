import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@workspace/utils/get-error-message";

import {
  ChangePasswordFormDefaultValues,
  ChangePasswordFormOutput,
  ChangePasswordFormSchema,
} from "../../lib/auth/change-password-form-schema";
import { handleSignInNextStep } from "../../lib/auth/handle-sign-in-next-step";
import type { ConfirmSignInFunction, SignInResult } from "../../types/auth";
import { useErrorDialog } from "../use-error-dialog";

type props<T extends SignInResult> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  confirmSignInFn: ConfirmSignInFunction<T>;
};

export function useChangePasswordForm<T extends SignInResult = SignInResult>({
  setCurrentState,
  confirmSignInFn,
}: props<T>) {
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
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: ChangePasswordFormDefaultValues,
  });

  const onSubmit = async (formData: ChangePasswordFormOutput) => {
    setIsLoading(true);
    let output: T | null = null;

    try {
      const result = await confirmSignInFn({
        challengeResponse: formData.password,
      });
      output = result;
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
