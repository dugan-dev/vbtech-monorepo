import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, SignInOutput } from "aws-amplify/auth";
import { useForm } from "react-hook-form";

import {
  SignInFormDefaultValues,
  SignInFormOutput,
  SignInFormSchema,
} from "@workspace/ui/components/auth/sign-in-form-schema";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";
import { handleSignInNextStep } from "@workspace/ui/utils/handle-sign-in-next-step";

/**
 * Props for the useSignInForm hook.
 */
type UseSignInFormProps = {
  /** Function to update authentication state */
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
  /** Function to update email */
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

/**
 * Hook for managing sign-in form state and submission.
 *
 * This hook provides form state management, validation, and submission handling
 * for the sign-in process. It integrates with AWS Amplify authentication and
 * handles various authentication flows including MFA and password changes.
 *
 * @param props - Configuration object containing state setters
 * @returns Form state, submission handler, loading state, and error handling
 */
export function useSignInForm({
  setCurrentState,
  setEmail,
}: UseSignInFormProps) {
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
