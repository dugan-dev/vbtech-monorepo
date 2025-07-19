"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

import { useSignInForm } from "../../hooks/auth/use-sign-in-form";
import { SignInFunction } from "../../types/auth/sign-in";

type props<T> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  handleForgotPassword: (email: string) => Promise<void>;
  signInFn: SignInFunction;
};

export function SignInForm<T extends { nextStep: { signInStep: string } }>({
  setCurrentState,
  setEmail,
  setEmailForReset,
  handleForgotPassword,
  signInFn,
}: props<T>) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useSignInForm({ setCurrentState, setEmail, signInFn });

  return (
    <Form {...form}>
      {isErrorDialogOpen && (
        <ErrorDialog
          title={errorTitle}
          description={errorMsg}
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
        />
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 py-4">
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          isDisabled={isLoading}
        />
        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
          isDisabled={isLoading}
        />
        <Button
          type="button"
          variant="link"
          className="justify-self-end text-sm text-primary hover:underline"
          onClick={async () => {
            const email = form.getValues("email");
            if (!email) {
              form.setError("email", {
                message: "Required",
              });
            } else {
              setEmailForReset(email);
              await handleForgotPassword(email);
            }
          }}
          disabled={isLoading}
        >
          Forgot password?
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {"Signing in..."}
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
