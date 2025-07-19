import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { handleSignInNextStep } from "../../lib/auth/handle-sign-in-next-step";
import {
  SignInFormDefaultValues,
  SignInFormOutput,
  SignInFormSchema,
} from "../../lib/auth/sign-in-form-schema";
import type { SignInFunction, SignInResult } from "../../types/auth/sign-in";

type props<T> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  signInFn: SignInFunction;
};

export function useSignInForm<
  T extends { nextStep: { signInStep: string } } = SignInResult,
>({ setCurrentState, setEmail, signInFn }: props<T>) {
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
    resolver: zodResolver(SignInFormSchema),
    defaultValues: SignInFormDefaultValues,
  });

  const onSubmit = async (formData: SignInFormOutput) => {
    setIsLoading(true);

    setEmail(formData.email);

    let output: T | null = null;

    try {
      const result = await signInFn({
        username: formData.email,
        password: formData.password,
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
