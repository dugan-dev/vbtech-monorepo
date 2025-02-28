import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  PasswordResetFormDefaultValues,
  PasswordResetFormOutput,
  PasswordResetFormSchema,
} from "../components/password-reset-form-schema";

type props = {
  onResetEmailSent?: () => void;
  onResetSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
};

export function usePasswordResetForm({
  onResetEmailSent,
  onResetSuccess,
  onError,
}: props) {
  // TODO: Replace with useSignIn leveraging amplify
  //const { signIn, isLoaded, setActive } = useSignIn();
  const signIn = null;
  const isLoaded = true;
  const setActive = () => {};
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: PasswordResetFormDefaultValues,
  });

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      if (!signIn) {
        throw new Error("SignIn is not loaded");
      }
      // TODO: Replace with amplify
      /*await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });*/
      console.log(`TODO: Replace SignIn with amplify: ${email}`);
      onResetEmailSent?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: PasswordResetFormOutput) => {
    setIsLoading(true);

    try {
      if (!signIn) {
        throw new Error("SignIn is not loaded");
      }
      // TODO: Replace with amplify
      /*
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: formData.resetCode,
        password: formData.newPassword,
      });
      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        onResetSuccess?.(result.createdSessionId);
      } else {
        throw new Error("Unexpected result status");
      }*/
      console.log(
        `TODO: Replace SignIn with amplify: ${formData.resetCode}, ${formData.newPassword}`,
      );
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    showVerifyPassword,
    setShowVerifyPassword,
    isLoading,
    isLoaded,
    handleForgotPassword,
    onSubmit,
    form,
  };
}
