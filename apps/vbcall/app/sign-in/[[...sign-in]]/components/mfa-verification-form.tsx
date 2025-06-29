"use client";

import { SignInOutput } from "aws-amplify/auth";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormInputOtp } from "@workspace/ui/components/form/form-input-otp";

import { Icons } from "@/components/icons";

import { useMfaVerificationForm } from "../hooks/use-mfa-verification-form";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
};

export function MfaVerificationForm({ setCurrentState }: props) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useMfaVerificationForm({ setCurrentState });

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
          label="Enter the code from your authenticator app."
        />
        <Button type="submit" disabled={isLoading} className="mt-8">
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              {"Signing in..."}
            </>
          ) : (
            "Confirm Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}
