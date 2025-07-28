"use client";

import {
  confirmResetPassword,
  confirmSignIn,
  resetPassword,
  signIn,
} from "aws-amplify/auth";

import { SignInCard } from "@workspace/auth/components/auth/sign-in-card";

import { AppIcons } from "@/components/app-icons";

export function SignInWrapper() {
  return (
    <div className="w-[425px]">
      <SignInCard
        logo={AppIcons.logo}
        logoDark={AppIcons.logoDark}
        signInFn={signIn}
        confirmSignInFn={confirmSignIn}
        confirmResetPasswordFn={confirmResetPassword}
        resetPasswordFn={resetPassword}
      />
    </div>
  );
}
