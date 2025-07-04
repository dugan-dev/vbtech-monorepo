import { APP_NAME } from "@/values/app-name";
import { signOut } from "aws-amplify/auth";
import { LogOut } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { ConfirmationDialog } from "@workspace/ui/components/confirmation-dialog";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { clearSidebarState } from "@workspace/ui/components/main-sidebar/main-sidebar-cookies";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useConfirmationDialog } from "@workspace/ui/hooks/use-confirmation-dialog";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

/**
 * Renders a sign-out button that prompts for confirmation and handles errors.
 *
 * Displays a confirmation dialog before signing out, clears sidebar state, and reloads the page upon successful sign-out. If an error occurs during sign-out, an error dialog is shown with details.
 */
export function SignOutButton() {
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const {
    openConfDialog,
    isConfDialogOpen,
    cancel,
    confirm,
    confDialogTitle,
    confDialogMsg,
  } = useConfirmationDialog({
    onConfirmAsync: async () => {
      try {
        clearSidebarState(APP_NAME);
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
    <Tooltip>
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
  );
}
