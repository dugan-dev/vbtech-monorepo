import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmSignIn, SignInOutput } from "aws-amplify/auth";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import {
  MfaVerificationFormDefaultValues,
  MfaVerificationFormOutput,
  MfaVerificationFormSchema,
} from "../components/mfa-verification-form-schema";
import { handleSignInNextStep } from "../utils/handle-sign-in-next-step";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
};

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

    let output: SignInOutput | null = null;

    try {
      output = await confirmSignIn({
        challengeResponse: formData.code,
      });
    } catch (e) {
      console.error(e);
      handleError(getErrorMessage(e));
      setIsLoading(false);
      return;
    }

    handleSignInNextStep(output, setCurrentState, setIsLoading, handleError);
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
