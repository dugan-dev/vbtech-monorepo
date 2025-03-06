"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

import { useSignInCard } from "../hooks/use-sign-in-card";
import { ChangePasswordForm } from "./change-password-form";
import { MfaVerificationForm } from "./mfa-verification-form";
import { SignInForm } from "./sign-in-form";
import { TotpSetupForm } from "./topt-setup-form";

export function SignInCard() {
  const { theme, currentState, setCurrentState, email, setEmail } =
    useSignInCard();
  return (
    <Card>
      <CardContent className="min-w-[425px] sm:max-w-[425px]">
        <div className="flex justify-end pt-4">
          <ThemeToggle />
        </div>
        <CardHeader>
          <div className="mx-auto">
            {theme === "dark" ? (
              <Icons.logoDark height={80} width={150} />
            ) : (
              <Icons.logo height={80} width={150} />
            )}
          </div>
          <CardTitle className="text-center text-2xl font-semibold">
            {(currentState === null || currentState === undefined) && "Sign in"}
            {currentState?.nextStep.signInStep ===
              "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" &&
              "Create a new password"}
            {currentState?.nextStep.signInStep ===
              "CONTINUE_SIGN_IN_WITH_TOTP_SETUP" && "Setup MFA"}
            {currentState?.nextStep.signInStep ===
              "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && "Enter MFA code"}
          </CardTitle>
        </CardHeader>
        {currentState === null && (
          <SignInForm setEmail={setEmail} setCurrentState={setCurrentState} />
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
