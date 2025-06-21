"use client";

import { ChangePasswordForm } from "@workspace/ui/components/auth/forms/change-password-form";
import { MfaVerificationForm } from "@workspace/ui/components/auth/forms/mfa-verification-form";
import { ResetPasswordForm } from "@workspace/ui/components/auth/forms/reset-password-form";
import { TotpSetupForm } from "@workspace/ui/components/auth/forms/totp-setup-form";
import { SignInForm } from "@workspace/ui/components/auth/sign-in-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ThemeToggle } from "@workspace/ui/components/common/theme-toggle";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { useSignInCard } from "@workspace/ui/hooks/use-sign-in-card";
import { useSignInForm } from "@workspace/ui/hooks/use-sign-in-form";

/**
 * Props for the SignInCardClient component.
 */
type SignInCardClientProps = {
  /** Logo JSX for light mode */
  Logo: React.ReactNode;
  /** Logo JSX for dark mode */
  LogoDark: React.ReactNode;
  /** Loader icon JSX */
  LoaderIcon: React.ReactNode;
};

/**
 * A client-side sign-in card component that handles multi-step authentication.
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
 * @param props - Configuration object containing logos, icons, and form components
 * @returns SignInCardClient component with complete authentication flow
 */
export function SignInCardClient({
  Logo,
  LogoDark,
  LoaderIcon,
}: SignInCardClientProps) {
  const {
    currentState,
    setCurrentState,
    email,
    setEmail,
    emailForReset,
    setEmailForReset,
    handleForgotPassword,
    errorMsg,
    errorTitle,
    isErrorDialogOpen,
    closeErrorDialog,
  } = useSignInCard();

  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen: isFormErrorDialogOpen,
    closeErrorDialog: closeFormErrorDialog,
    errorMsg: formErrorMsg,
    errorTitle: formErrorTitle,
  } = useSignInForm({ setCurrentState, setEmail });

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
        {isFormErrorDialogOpen && (
          <ErrorDialog
            title={formErrorTitle}
            description={formErrorMsg}
            open={isFormErrorDialogOpen}
            onOpenChange={closeFormErrorDialog}
          />
        )}
        <div className="flex justify-end pt-4">
          <ThemeToggle />
        </div>
        <CardHeader>
          <div className="mx-auto">
            <div className="block dark:hidden">{Logo}</div>
            <div className="hidden dark:block">{LogoDark}</div>
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
        {currentState === null && emailForReset === null && (
          <SignInForm
            setEmailForReset={setEmailForReset}
            handleForgotPassword={handleForgotPassword}
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isErrorDialogOpen={isFormErrorDialogOpen}
            closeErrorDialog={closeFormErrorDialog}
            errorMsg={formErrorMsg}
            errorTitle={formErrorTitle}
            LoaderIcon={LoaderIcon}
          />
        )}
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
