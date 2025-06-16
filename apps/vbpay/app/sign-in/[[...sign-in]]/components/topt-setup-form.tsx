"use client";

import { SignInOutput } from "aws-amplify/auth";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormInputOtp } from "@workspace/ui/components/form/form-input-otp";

import { Icons } from "@/components/icons";

import { useTotpSetupForm } from "../hooks/use-totp-setup-form";
import { TotpSetupSecretDialog } from "./totp-setup-secret-dialog";

type props = {
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>;
  currentState: SignInOutput | null;
  email: string;
};

export function TotpSetupForm({ currentState, email, setCurrentState }: props) {
  const {
    form,
    onSubmit,
    isLoading,
    isErrorDialogOpen,
    closeErrorDialog,
    errorMsg,
    errorTitle,
  } = useTotpSetupForm({ setCurrentState });
  // @ts-expect-error Type 'null' is not assignable to type 'SignInOutput'.
  const { sharedSecret } = currentState!.nextStep!.totpSetupDetails!;
  const otpAuthUrl = `otpauth://totp/VBTech:${email}?secret=${sharedSecret}&issuer=VBTech`;
  return (
    <div className="flex flex-1 flex-col gap-4 items-center">
      <h1>Scan this QR code with your authenticator app</h1>
      <QRCodeSVG value={otpAuthUrl} />
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <FormInputOtp
            control={form.control}
            name="code"
            label="Enter the code from your authenticator app."
          />
          <TotpSetupSecretDialog secret={sharedSecret} />
          <Button type="submit" disabled={isLoading} className="mt-4">
            {isLoading ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                {"Verifying..."}
              </>
            ) : (
              "Verify code"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
