import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmSignIn, SignInOutput } from "aws-amplify/auth";
import { useForm } from "react-hook-form";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import {
  ChangePasswordFormDefaultValues,
  ChangePasswordFormOutput,
  ChangePasswordFormSchema,
} from "../components/change-password-form-schema";
import { handleSignInNextStep } from "../utils/handle-sign-in-next-step";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
};

export function useChangePasswordForm({ setCurrentState }: props) {
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get("redirect_url");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    let output: SignInOutput | null = null;

    try {
      output = await confirmSignIn({
        challengeResponse: formData.password,
      });
    } catch (e) {
      console.error(e);
      handleError(getErrorMessage(e));
      setIsLoading(false);
      return;
    }

    handleSignInNextStep(
      output,
      setCurrentState,
      setIsLoading,
      handleError,
      router,
      redirect_url,
    );
  };

  return {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
}
