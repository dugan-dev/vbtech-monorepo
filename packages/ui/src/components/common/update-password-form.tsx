"use client";

import { updatePassword } from "aws-amplify/auth";
import { ZodSchema } from "zod";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";
import { useUpdatePasswordForm } from "@workspace/ui/hooks/use-update-password-form";

/**
 * Props for the UpdatePasswordForm component.
 */
type UpdatePasswordFormProps<T extends object> = {
  closeDialog: () => void;
  icons: {
    loader: React.ElementType;
  };
  schema: ZodSchema<T>;
  defaultValues: T;
};

/**
 * A form component for updating user passwords.
 *
 * Features:
 * - Current password validation
 * - New password input with confirmation
 * - Password strength validation
 * - Loading states and error handling
 * - Integration with AWS Amplify auth
 *
 * @param props - Component props including close handler, icons, and form schema
 * @returns UpdatePasswordForm component with password update functionality
 */
export function UpdatePasswordForm<T extends object>({
  closeDialog,
  icons,
  schema,
  defaultValues,
}: UpdatePasswordFormProps<T>) {
  const {
    form,
    isErrorDialogOpen,
    errorTitle,
    errorMsg,
    closeErrorDialog,
    onSubmit,
    isLoading,
  } = useUpdatePasswordForm({
    updatePassword: (oldPassword, newPassword) =>
      updatePassword({ oldPassword, newPassword }),
    closeDialog,
    schema,
    defaultValues,
  });

  const LoaderIcon = icons.loader;

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

      <form
        onSubmit={form.handleSubmit(
          onSubmit as import("react-hook-form").SubmitHandler<unknown>,
        )}
        className="grid gap-2 py-4"
      >
        <FormPasswordInput
          control={form.control}
          name="currentPassword"
          label="Current Password"
          isRequired
        />
        <FormPasswordInput
          control={form.control}
          name="newPassword"
          label="New Password"
          isRequired
        />
        <FormPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          isRequired
        />
        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              {"Updating..."}
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
