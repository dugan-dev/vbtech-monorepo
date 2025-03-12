"use client";

import { SignInOutput } from "aws-amplify/auth";

import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

import { ErrorDialog } from "@/components/error-dialog";
import { Icons } from "@/components/icons";

import { useSignInForm } from "../hooks/use-sign-in-form";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

export function SignInForm({ setCurrentState, setEmail }: props) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useSignInForm({ setCurrentState, setEmail });
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
          onClick={() => {
            if (!form.getValues("email")) {
              form.setError("email", {
                message: "Required",
              });
            } else {
              // TODO
              // handleForgotPassword(signInForm.getValues("email"));
            }
          }}
          disabled={isLoading}
        >
          Forgot password?
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
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
