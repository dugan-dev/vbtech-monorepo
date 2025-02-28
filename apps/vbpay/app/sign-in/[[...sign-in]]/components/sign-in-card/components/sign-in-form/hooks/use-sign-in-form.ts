import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  SignInFormDefaultValues,
  SignInFormOutput,
  SignInFormSchema,
} from "../sign-in-form-schema";

type props = {
  onSuccess: () => void;
  onError: (error: Error) => void;
};

export function useSignInForm({ onSuccess, onError }: props) {
  // TODO: Replace with useSignIn leveraging amplify
  // const { signIn, isLoaded, setActive } = useSignIn();
  const signIn = null;
  const isLoaded = true;
  const setActive = () => {};
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: SignInFormDefaultValues,
  });

  const onSubmit = async (formData: SignInFormOutput) => {
    setIsLoading(true);

    try {
      if (!signIn) {
        throw new Error("SignIn is not loaded");
      }

      // TODO: Replace with amplify
      /*
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });*/
      console.log(
        `TODO: Replace SignIn with amplify: ${formData.email}, ${formData.password}`,
      );

      /*
      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        onSuccess();
      } else {
        throw new Error("Unexpected result status: " + result.status);
      }
      */
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setShowPassword,
    showPassword,
    isLoading,
    onSubmit,
    isLoaded,
    form,
  };
}
