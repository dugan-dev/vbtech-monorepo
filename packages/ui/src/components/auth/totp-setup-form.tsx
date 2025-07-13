"use client";

import { Loader2 } from "lucide-react";

import { useQrCode } from "../../hooks/auth/use-qr-code";
import { useTotpSetupForm } from "../../hooks/auth/use-totp-setup-form";
import type { SignInResult } from "../../types/auth";
import { Button } from "../button";
import { ErrorDialog } from "../error-dialog";
import { Form } from "../form";
import { FormInputOtp } from "../form/form-input-otp";
import { TotpSetupSecretDialog } from "./totp-setup-secret-dialog";

type ConfirmSignInFunction = (params: {
  challengeResponse: string;
}) => Promise<SignInResult>;

type props<T> = {
  currentState: T;
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>;
  email: string;
  confirmSignInFn: ConfirmSignInFunction;
};

export function TotpSetupForm<
  T extends {
    nextStep: {
      signInStep: string;
      totpSetupDetails?: { sharedSecret: string };
    };
  },
>({ currentState, setCurrentState, email, confirmSignInFn }: props<T>) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useTotpSetupForm({ setCurrentState, confirmSignInFn });

  const secret = currentState.nextStep.totpSetupDetails?.sharedSecret || "";
  const qrCodeUrl = `otpauth://totp/${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent("VBTech")}`;
  const {
    qrCodeDataUrl,
    isLoading: isQrLoading,
    error: qrError,
  } = useQrCode(qrCodeUrl);

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
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scan this QR code with your authenticator app:
          </p>
          <div className="flex justify-center">
            {isQrLoading ? (
              <div className="w-[200px] h-[200px] border rounded-md flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : qrError ? (
              <div className="w-[200px] h-[200px] border rounded-md flex items-center justify-center bg-muted text-sm text-muted-foreground text-center p-4">
                Failed to generate QR code. Please use the manual setup option
                below.
              </div>
            ) : qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code for MFA setup"
                className="border rounded-md"
              />
            ) : null}
          </div>
          <TotpSetupSecretDialog secret={secret} />
        </div>
        <FormInputOtp
          control={form.control}
          name="code"
          label="Enter the 6-digit code from your authenticator app."
        />
        <Button type="submit" disabled={isLoading} className="mt-8">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {"Setting up MFA..."}
            </>
          ) : (
            "Complete setup"
          )}
        </Button>
      </form>
    </Form>
  );
}
