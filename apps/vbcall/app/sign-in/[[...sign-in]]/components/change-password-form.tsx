"use client";

import { SignInOutput } from "aws-amplify/auth";

import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

import { ErrorDialog } from "@/components/error-dialog";
import { Icons } from "@/components/icons";

import { useChangePasswordForm } from "../hooks/use-change-password-form";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
};

export function ChangePasswordForm({ setCurrentState }: props) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useChangePasswordForm({ setCurrentState });

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
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              {"Changing password..."}
            </>
          ) : (
            "Change password"
          )}
        </Button>
      </form>
    </Form>
  );
}
