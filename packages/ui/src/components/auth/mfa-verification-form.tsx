"use client";

import { Loader2 } from "lucide-react";

import { useMfaVerificationForm } from "../../hooks/auth/use-mfa-verification-form";
import { ConfirmSignInFunction } from "../../types/auth";
import { Button } from "../button";
import { ErrorDialog } from "../error-dialog";
import { Form } from "../form";
import { FormInputOtp } from "../form/form-input-otp";

type props<T> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  confirmSignInFn: ConfirmSignInFunction;
};

export function MfaVerificationForm<
  T extends { nextStep: { signInStep: string } },
>({ setCurrentState, confirmSignInFn }: props<T>) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useMfaVerificationForm({ setCurrentState, confirmSignInFn });

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
        <FormInputOtp
          control={form.control}
          name="code"
          label="Enter the 6-digit code from your authenticator app."
        />
        <Button type="submit" disabled={isLoading} className="mt-8">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {"Verifying..."}
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>
    </Form>
  );
}
