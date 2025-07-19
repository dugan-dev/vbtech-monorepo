"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";
import {
  UpdatePasswordFormDefaultValues,
  UpdatePasswordFormOutput,
  UpdatePasswordFormSchema,
} from "../lib/update-password-form-schema";

interface UpdatePasswordFormProps {
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  loadingText?: string;
  submitText?: string;
  className?: string;
}

export function UpdatePasswordForm({
  onSubmit,
  onClose,
  isLoading = false,
  loadingText = "Updating...",
  submitText = "Update Password",
  className,
}: UpdatePasswordFormProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const {
    isErrorDialogOpen,
    openErrorDialog,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useErrorDialog({});

  const form = useForm({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: UpdatePasswordFormDefaultValues,
  });

  const handleSubmit = async (formData: UpdatePasswordFormOutput) => {
    setInternalLoading(true);

    try {
      await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      onClose();
    } catch (e) {
      console.error(e);
      openErrorDialog("Error", getErrorMessage(e));
    } finally {
      setInternalLoading(false);
    }
  };

  const loading = isLoading || internalLoading;

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
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`grid gap-2 py-4 ${className || ""}`}
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
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText}
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
