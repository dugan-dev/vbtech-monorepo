"use client";

import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

import { useUpdatePasswordForm } from "@/hooks/use-update-password-form";
import { ErrorDialog } from "@/components/error-dialog";
import { Icons } from "@/components/icons";

type props = {
  closeDialog: () => void;
};

export function UpdatePasswordForm({ closeDialog }: props) {
  const {
    form,
    isErrorDialogOpen,
    errorTitle,
    errorMsg,
    closeErrorDialog,
    onSubmit,
    isLoading,
  } = useUpdatePasswordForm({ closeDialog });
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
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
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
