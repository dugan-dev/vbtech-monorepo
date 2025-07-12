"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

export function TotpSetupSecretDialog({ secret }: { secret: string }) {
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
