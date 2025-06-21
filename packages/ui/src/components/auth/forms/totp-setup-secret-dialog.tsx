"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

/**
 * Props for the TotpSetupSecretDialog component.
 */
type TotpSetupSecretDialogProps = {
  /** The secret key to display and copy */
  secret: string;
};

/**
 * A dialog component for displaying and copying TOTP secret keys.
 *
 * This component provides a user-friendly interface for users who cannot
 * scan QR codes and need to manually enter the secret key in their
 * authenticator app. It includes:
 * - Secret key display in a readable format
 * - One-click copy to clipboard functionality
 * - Visual feedback for successful copying
 *
 * @param props - Component props including the secret key
 * @returns TotpSetupSecretDialog component with secret key management
 */
export function TotpSetupSecretDialog({ secret }: TotpSetupSecretDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="link"
          className="justify-self-end text-sm text-primary hover:underline"
        >
          {"Can't scan the QR code?"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Manual Entry Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Enter this key manually in your authenticator app:
          </p>
          <div className="flex items-center space-x-2 border rounded-md p-3 bg-muted/50">
            <p className="font-mono text-sm break-all flex-1">{secret}</p>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={copyToClipboard}
            >
              {copied ? "Copied" : "Copy"}
              {copied ? (
                <Check className="ml-2 h-3 w-3" />
              ) : (
                <Copy className="ml-2 h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
