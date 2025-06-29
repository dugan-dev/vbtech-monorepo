"use client";

import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { FormInputOtp } from "@workspace/ui/components/form/form-input-otp";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Icons } from "@/components/icons";

import { useResetPasswordForm } from "../hooks/use-reset-password-form";

type props = {
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  emailForReset: string;
};

export function ResetPasswordForm({ setEmailForReset, emailForReset }: props) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useResetPasswordForm({ setEmailForReset, emailForReset });

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
          label="Enter the code sent to your email."
        />
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
