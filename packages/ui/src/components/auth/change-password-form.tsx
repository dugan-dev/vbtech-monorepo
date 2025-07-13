"use client";

import { Loader2 } from "lucide-react";

import { useChangePasswordForm } from "../../hooks/auth/use-change-password-form";
import { ConfirmSignInFunction, SignInResult } from "../../types/auth";
import { Button } from "../button";
import { ErrorDialog } from "../error-dialog";
import { Form } from "../form";
import { FormPasswordInput } from "../form/form-password-input";

type props<T extends SignInResult> = {
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  confirmSignInFn: ConfirmSignInFunction<T>;
};

export function ChangePasswordForm<T extends SignInResult = SignInResult>({
  setCurrentState,
  confirmSignInFn,
}: props<T>) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useChangePasswordForm({ setCurrentState, confirmSignInFn });

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
        <FormPasswordInput
          control={form.control}
          name="password"
          label="New Password"
          isRequired
          isDisabled={isLoading}
        />
        <FormPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          isRequired
          isDisabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} className="mt-8">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {"Updating password..."}
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </Form>
  );
}
