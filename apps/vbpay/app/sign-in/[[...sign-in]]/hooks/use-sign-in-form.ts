import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, SignInOutput } from "aws-amplify/auth";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import {
  SignInFormDefaultValues,
  SignInFormOutput,
  SignInFormSchema,
} from "../components/sign-in-form-schema";
import { handleSignInNextStep } from "../utils/handle-sign-in-next-step";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

export function useSignInForm({ setCurrentState, setEmail }: props) {
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

    let output: SignInOutput | null = null;

    try {
      output = await signIn({
        username: formData.email,
        password: formData.password,
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
