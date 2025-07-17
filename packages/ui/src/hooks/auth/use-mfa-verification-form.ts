import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@workspace/utils/get-error-message";

import { handleSignInNextStep } from "../../lib/auth/handle-sign-in-next-step";
import {
  MfaVerificationFormDefaultValues,
  MfaVerificationFormOutput,
  MfaVerificationFormSchema,
} from "../../lib/auth/mfa-verification-form-schema";
import type { ConfirmSignInFunction, SignInResult } from "../../types/auth";
import { useErrorDialog } from "../use-error-dialog";

type props<T> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  confirmSignInFn: ConfirmSignInFunction;
};

function isValidSignInResult<T extends { nextStep: { signInStep: string } }>(
  result: unknown,
): result is T {
  if (typeof result !== "object" || result === null) {
    return false;
  }

  const obj = result as Record<string, unknown>;

  if (
    !("nextStep" in obj) ||
    typeof obj.nextStep !== "object" ||
    obj.nextStep === null
  ) {
    return false;
  }

  const nextStep = obj.nextStep as Record<string, unknown>;

  return "signInStep" in nextStep && typeof nextStep.signInStep === "string";
}

export function useMfaVerificationForm<
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
    resolver: zodResolver(MfaVerificationFormSchema),
    defaultValues: MfaVerificationFormDefaultValues,
  });

  const onSubmit = async (formData: MfaVerificationFormOutput) => {
    setIsLoading(true);

    let output: T | null = null;

    try {
      const result = await confirmSignInFn({
        challengeResponse: formData.code,
      });

      if (isValidSignInResult<T>(result)) {
        output = result;
      } else {
        throw new Error("Invalid sign-in result structure received");
      }
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
