"use client";

import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormPasswordInput } from "@workspace/ui/components/form/form-password-input";

type SignInFormFields = {
  email: string;
  password: string;
};

/**
 * Props for the SignInForm component.
 */
type SignInFormProps = {
  /** Function to update email for reset */
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  /** Function to handle forgot password */
  handleForgotPassword: (email: string) => Promise<void>;
  /** Form instance from useForm hook */
  form: UseFormReturn<SignInFormFields>;
  /** Form submission handler */
  onSubmit: SubmitHandler<SignInFormFields>;
  /** Whether form is in loading state */
  isLoading: boolean;
  /** Whether error dialog is open */
  isErrorDialogOpen: boolean;
  /** Function to close error dialog */
  closeErrorDialog: () => void;
  /** Error message to display */
  errorMsg: string;
  /** Error title */
  errorTitle: string;
  /** Loader icon JSX */
  LoaderIcon: React.ReactNode;
};

/**
 * A sign-in form component with email and password fields.
 *
 * This component provides a complete sign-in form with:
 * - Email input field
 * - Password input field
 * - Forgot password link
 * - Submit button with loading state
 * - Error handling and display
 *
 * The component is designed to work with any form library (React Hook Form, etc.)
 * by accepting the form instance and handlers as props.
 *
 * @param props - Configuration object containing form state, handlers, and UI components
 * @returns SignInForm component with complete sign-in functionality
 */
export function SignInForm({
  setEmailForReset,
  handleForgotPassword,
  form,
  onSubmit,
  isLoading,
  isErrorDialogOpen,
  closeErrorDialog,
  errorMsg,
  errorTitle,
  LoaderIcon,
}: SignInFormProps) {
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
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          isDisabled={isLoading}
        />
        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
          isDisabled={isLoading}
        />
        <Button
          type="button"
          variant="link"
          className="justify-self-end text-sm text-primary hover:underline"
          onClick={async () => {
            const email = form.getValues("email");
            if (!email) {
              form.setError("email", {
                message: "Required",
              });
            } else {
              setEmailForReset(email);
              await handleForgotPassword(email);
            }
          }}
          disabled={isLoading}
        >
          Forgot password?
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              {LoaderIcon}
              {"Signing in..."}
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
