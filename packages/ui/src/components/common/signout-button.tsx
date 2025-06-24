"use client";

import { LogOut } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { ConfirmationDialog } from "@workspace/ui/components/common/confirmation-dialog";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useConfirmationDialog } from "@workspace/ui/hooks/use-confirmation-dialog";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

type props = {
  signOut: () => Promise<void>;
  onSignOut?: () => void;
};

export function SignoutButton({ signOut, onSignOut }: props) {
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const {
    confirm,
    cancel,
    openConfDialog,
    isConfDialogOpen,
    confDialogTitle,
    confDialogMsg,
  } = useConfirmationDialog({
    onConfirmAsync: async () => {
      try {
        if (onSignOut) {
          onSignOut();
        }
        await signOut();
      } catch (err) {
        const error = err as Error;
        openErrorDialog("Error Signing Out", error.message);
      }
    },
    onConfirmAfterAsync: () => {
      window.location.reload();
    },
  });

  return (
    <>
      {isConfDialogOpen && (
        <ConfirmationDialog
          open={isConfDialogOpen}
          onOpenChange={cancel}
          onConfirm={confirm}
          description={confDialogMsg}
          title={confDialogTitle}
        />
      )}
      {isErrorDialogOpen && (
        <ErrorDialog
          open={isErrorDialogOpen}
          title={errorTitle}
          description={errorMsg}
          onOpenChange={closeErrorDialog}
        />
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() =>
              openConfDialog("Sign Out", "Are you sure you want to sign out?")
            }
            variant="ghost"
            size="icon"
            data-testid="sign-out-button"
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent data-testid="sign-out-button-tooltip-content">
          Sign Out
        </TooltipContent>
      </Tooltip>
    </>
  );
}
