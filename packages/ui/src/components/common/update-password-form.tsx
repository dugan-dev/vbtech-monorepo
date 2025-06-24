"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  UpdatePasswordFormDefaultValues,
  UpdatePasswordFormSchema,
  type UpdatePasswordFormInput,
  type UpdatePasswordFormOutput,
} from "@workspace/ui/components/auth/schemas/update-password-form.schema";
import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

/**
 * Props for the UpdatePasswordForm component.
 */
type UpdatePasswordFormProps = {
  closeDialog: () => void;
  icons: {
    loader: React.ElementType;
  };
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
 * @param props - Component props including close handler and icons
 * @returns UpdatePasswordForm component with password update functionality
 */
export function UpdatePasswordForm({
  closeDialog,
  icons,
}: UpdatePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const form = useForm<UpdatePasswordFormInput>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: UpdatePasswordFormDefaultValues,
  });

  const onSubmit = async (formData: UpdatePasswordFormOutput) => {
    setIsLoading(true);

    try {
      await updatePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
    } catch (e) {
      console.error(e);
      openErrorDialog("Error", getErrorMessage(e));
      setIsLoading(false);
      return;
    }

    closeDialog();

    toast("Success", {
      description: "Your password has been updated successfully.",
      dismissible: true,
      duration: 10000,
      position: "top-center",
    });
  };

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

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 py-4">
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
