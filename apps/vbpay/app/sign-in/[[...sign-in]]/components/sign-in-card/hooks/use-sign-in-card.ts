import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { useIsMounted } from "@workspace/ui/hooks/use-is-mounted";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import { usePasswordResetForm } from "../components/password-reset-form/hooks/use-password-reset-form";
import { useSignInForm } from "../components/sign-in-form/hooks/use-sign-in-form";

export function useSignInCard(redirect_url?: string) {
  const [resetStep, setResetStep] = useState<"initial" | "reset">("initial");
  const router = useRouter();
  const { theme } = useTheme();
  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const mounted = useIsMounted();

  const handleError = (error: Error) => {
    openErrorDialog("Error", error.message);
  };

  const {
    isLoaded: signInFormIsLoaded,
    isLoading: signInFormIsLoading,
    showPassword: signInFormShowPassword,
    setShowPassword: setSignInFormShowPassword,
    form: signInForm,
    onSubmit: signInFormSubmit,
  } = useSignInForm({
    onSuccess: () => router.push(redirect_url ?? "/"),
    onError: handleError,
  });

  const {
    isLoading: passwordResetFormIsLoading,
    showPassword: passwordResetFormShowPassword,
    setShowPassword: setPasswordResetFormShowPassword,
    showVerifyPassword: passwordResetFormShowVerifyPassword,
    setShowVerifyPassword: setPasswordResetFormShowVerifyPassword,
    form: passwordResetForm,
    onSubmit: passwordResetSubmit,
    handleForgotPassword,
    isLoaded: passwordResetFormIsLoaded,
  } = usePasswordResetForm({
    onResetEmailSent: () => {
      toast("Password Reset Email Sent", {
        description: "Please check your email inbox for further instruction.",
      });
      setResetStep("reset");
    },
    onResetSuccess: () => {
      setResetStep("initial");
      router.push(redirect_url ?? "/");
    },
    onError: handleError,
  });

  return {
    mounted,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
    signInFormIsLoaded,
    signInFormIsLoading,
    signInFormShowPassword,
    setSignInFormShowPassword,
    signInForm,
    signInFormSubmit,
    passwordResetFormIsLoaded,
    passwordResetFormIsLoading,
    passwordResetFormShowPassword,
    setPasswordResetFormShowPassword,
    passwordResetFormShowVerifyPassword,
    setPasswordResetFormShowVerifyPassword,
    passwordResetForm,
    passwordResetSubmit,
    handleForgotPassword,
    resetStep,
    setResetStep,
    theme,
  };
}
