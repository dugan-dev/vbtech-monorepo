"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";

import { AppIcons } from "@/components/app-icons";

import { useSignInCard } from "../hooks/use-sign-in-card";
import { ChangePasswordForm } from "./change-password-form";
import { MfaVerificationForm } from "./mfa-verification-form";
import { ResetPasswordForm } from "./reset-password-form";
import { SignInForm } from "./sign-in-form";
import { TotpSetupForm } from "./totp-setup-form";

/**
 * Renders a multi-step sign-in card interface with support for password reset, multi-factor authentication, and error handling.
 *
 * Displays different forms and titles based on the current authentication step, manages transitions between steps, and provides theme toggling and error dialogs.
 */
export function SignInCard() {
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
            <AppIcons.logo
              height={80}
              width={150}
              className="block dark:hidden"
            />
            <AppIcons.logoDark
              height={80}
              width={150}
              className="hidden dark:block"
            />
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
            setEmail={setEmail}
            setCurrentState={setCurrentState}
            setEmailForReset={setEmailForReset}
            handleForgotPassword={handleForgotPassword}
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
