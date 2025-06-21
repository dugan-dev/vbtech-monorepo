"use client";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormInputOtp } from "@workspace/ui/components/form/form-input-otp";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

import { Icons } from "@/components/icons";

import { useResetPasswordForm } from "../hooks/use-reset-password-form";

type props = {
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  emailForReset: string;
};

/**
 * A form component for resetting user passwords.
 *
 * This component provides a complete password reset flow including:
 * - OTP code input for verification
 * - New password input with confirmation
 * - Password strength validation
 * - Loading states and error handling
 * - Integration with AWS Amplify auth
 *
 * @param props - Component props including email reset state management
 * @returns ResetPasswordForm component with complete password reset functionality
 */
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
