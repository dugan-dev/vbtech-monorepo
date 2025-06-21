"use client";

import { SignInOutput } from "aws-amplify/auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ThemeToggle } from "@workspace/ui/components/common/theme-toggle";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";

import { ChangePasswordForm } from "./forms/change-password-form";
import { MfaVerificationForm } from "./forms/mfa-verification-form";
import { ResetPasswordForm } from "./forms/reset-password-form";
import { TotpSetupForm } from "./forms/totp-setup-form";

/**
 * Props for the SignInCard component.
 */
type SignInCardProps = {
  /** Current authentication state */
  currentState: SignInOutput | null;
  /** Function to update authentication state */
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
  /** Current email for sign-in */
  email: string | null;
  /** Email for password reset */
  emailForReset: string | null;
  /** Function to update email for reset */
  setEmailForReset: React.Dispatch<React.SetStateAction<string | null>>;
  /** Error message to display */
  errorMsg: string;
  /** Error title */
  errorTitle: string;
  /** Whether error dialog is open */
  isErrorDialogOpen: boolean;
  /** Function to close error dialog */
  closeErrorDialog: () => void;
  /** Logo component for light mode */
  Logo: React.ComponentType<{
    height: number;
    width: number;
    className?: string;
  }>;
  /** Logo component for dark mode */
  LogoDark: React.ComponentType<{
    height: number;
    width: number;
    className?: string;
  }>;
  /** Sign-in form component */
  SignInForm: () => React.ReactNode;
};

/**
 * A comprehensive sign-in card component that handles multi-step authentication.
 *
 * This component manages the entire sign-in flow including:
 * - Initial sign-in form
 * - Password reset flow
 * - MFA setup and verification
 * - Password change requirements
 * - Error handling and display
 *
 * The component uses a state machine approach to show the appropriate form
 * based on the current authentication step.
 *
 * @param props - Configuration object containing state, handlers, and form components
 * @returns SignInCard component with complete authentication flow
 */
export function SignInCard({
  currentState,
  setCurrentState,
  email,
  emailForReset,
  setEmailForReset,
  errorMsg,
  errorTitle,
  isErrorDialogOpen,
  closeErrorDialog,
  Logo,
  LogoDark,
  SignInForm,
}: SignInCardProps) {
  return (
    <Card>
      <CardContent className="min-w-[425px] sm:max-w-[425px]">
        {isErrorDialogOpen && (
          <ErrorDialog
            title={errorTitle}
            description={errorMsg}
            open={isErrorDialogOpen}
            onOpenChange={closeErrorDialog}
          />
        )}
        <div className="flex justify-end pt-4">
          <ThemeToggle />
        </div>
        <CardHeader>
          <div className="mx-auto">
            <Logo height={80} width={150} className="block dark:hidden" />
            <LogoDark height={80} width={150} className="hidden dark:block" />
          </div>
          <CardTitle className="text-center text-2xl font-semibold">
            {currentState === null && emailForReset === null && "Sign in"}
            {currentState?.nextStep.signInStep ===
              "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" &&
              "Create a new password"}
            {currentState?.nextStep.signInStep ===
              "CONTINUE_SIGN_IN_WITH_TOTP_SETUP" && "Setup MFA"}
            {currentState?.nextStep.signInStep ===
              "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && "Enter MFA code"}
            {emailForReset && currentState === null && "Reset Password"}
          </CardTitle>
        </CardHeader>
        {currentState === null && emailForReset === null && SignInForm()}
        {emailForReset && currentState === null && (
          <ResetPasswordForm
            emailForReset={emailForReset}
            setEmailForReset={setEmailForReset}
          />
        )}
        {currentState?.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" && (
          <ChangePasswordForm setCurrentState={setCurrentState} />
        )}
        {currentState?.nextStep.signInStep ===
          "CONTINUE_SIGN_IN_WITH_TOTP_SETUP" && (
          <TotpSetupForm
            currentState={currentState}
            setCurrentState={setCurrentState}
            email={email || ""}
          />
        )}
        {currentState?.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && (
          <MfaVerificationForm setCurrentState={setCurrentState} />
        )}
      </CardContent>
    </Card>
  );
}
