import { signOut } from "aws-amplify/auth";

import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Icons } from "@/components/icons";

export function SignOutButton() {
  const {
    openConfDialog,
    isConfDialogOpen,
    cancel,
    confirm,
    confDialogTitle,
    confDialogMsg,
  } = useConfirmationDialog({
    onConfirmAsync: signOut,
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
            <Icons.logout />
          </Button>
        </TooltipTrigger>
        <TooltipContent data-testid="sign-out-button-tooltip-content">
          Sign Out
        </TooltipContent>
      </Tooltip>
    </>
  );
}
