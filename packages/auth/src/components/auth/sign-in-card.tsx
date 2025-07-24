"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";

import { useSignInCard } from "../../hooks/auth/use-sign-in-card";
import type {
  ConfirmResetPasswordFunction,
  ResetPasswordFunction,
} from "../../types/auth/password-reset";
import type {
  ConfirmSignInFunction,
  SignInFunction,
  SignInResult,
} from "../../types/auth/sign-in";
import { ChangePasswordForm } from "./change-password-form";
import { MfaVerificationForm } from "./mfa-verification-form";
import { ResetPasswordForm } from "./reset-password-form";
import { SignInForm } from "./sign-in-form";
import { TotpSetupForm } from "./totp-setup-form";

type LogoComponent = React.ComponentType<{
  height: number;
  width: number;
  className?: string;
}>;

type props<T extends SignInResult> = {
  logo: LogoComponent;
  logoDark: LogoComponent;
  signInFn: SignInFunction;
  confirmSignInFn: ConfirmSignInFunction<T>;
  confirmResetPasswordFn: ConfirmResetPasswordFunction;
  resetPasswordFn: ResetPasswordFunction;
};

export function SignInCard<T extends SignInResult = SignInResult>({
  logo: Logo,
  logoDark: LogoDark,
  signInFn,
  confirmSignInFn,
  confirmResetPasswordFn,
  resetPasswordFn,
}: props<T>) {
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
  } = useSignInCard<T>({ resetPasswordFn });

  return (
    <Card>
      <CardContent className="w-[10000px]">
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
        {currentState === null && emailForReset === null && (
          <SignInForm
            setEmail={setEmail}
            setCurrentState={setCurrentState}
            setEmailForReset={setEmailForReset}
            handleForgotPassword={handleForgotPassword}
            signInFn={signInFn}
          />
        )}
        {emailForReset && currentState === null && (
          <ResetPasswordForm
            emailForReset={emailForReset}
            setEmailForReset={setEmailForReset}
            confirmResetPasswordFn={confirmResetPasswordFn}
          />
        )}
        {currentState?.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" && (
          <ChangePasswordForm
            setCurrentState={setCurrentState}
            confirmSignInFn={confirmSignInFn}
          />
        )}
        {currentState?.nextStep.signInStep ===
          "CONTINUE_SIGN_IN_WITH_TOTP_SETUP" && (
          <TotpSetupForm
            currentState={currentState}
            setCurrentState={setCurrentState}
            email={email || ""}
            confirmSignInFn={confirmSignInFn}
          />
        )}
        {currentState?.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && (
          <MfaVerificationForm
            setCurrentState={setCurrentState}
            confirmSignInFn={confirmSignInFn}
          />
        )}
      </CardContent>
    </Card>
  );
}
