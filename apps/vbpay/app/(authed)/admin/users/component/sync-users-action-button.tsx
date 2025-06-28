"use client";

import { usePathname } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

import { useErrorDialog } from "@/hooks/use-error-dialog";
import { ClientFormattedDate } from "@/components/client-formatted-date";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Icons } from "@/components/icons";

import { syncUsersAction } from "../action/sync-users-action";

type props = {
  lastSync?: Date;
};

export function SyncUsersActionButton({ lastSync }: props) {
  const revalidationPath = usePathname();
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { execute: executeSyncUsers, isPending } = useAction(syncUsersAction, {
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
    onSuccess: () => {
      toast("Success", {
        description: "The user sync operation completed successfully.",
      });
    },
  });

  function handleSyncUsers() {
    executeSyncUsers({
      revalidationPath: revalidationPath,
    });
  }

  return (
    <div className="flex items-center gap-2">
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
            size="icon"
            variant="outline"
            disabled={isPending}
            onClick={handleSyncUsers}
          >
            <Icons.refresh
              className={cn("h-4 w-4", isPending && "animate-spin")}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <h3 className="font-semibold">Sync Users with Cognito</h3>
          <br />
          <strong>Last Sync: </strong>
          {!lastSync && <span>Never</span>}
          {lastSync && (
            <ClientFormattedDate
              date={lastSync}
              options={{
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              }}
            />
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
