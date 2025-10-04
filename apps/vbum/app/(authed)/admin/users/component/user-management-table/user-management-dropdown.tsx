import { Ellipsis } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { ConfirmationDialog } from "@workspace/ui/components/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { UserCognito } from "@/types/user-cognito";

import { useUserManagementDropdown } from "../../hooks/use-user-management-dropdown";
import { EditUserSheet } from "../edit-user-sheet";

type props = {
  accountStatus: string;
  confirmationStatus: string;
  user: UserCognito;
};

/**
 * Renders a dropdown menu for managing user account actions.
 *
 * This component displays a dropdown menu that provides options to edit a user, force a password change,
 * disable the user, or enable the user depending on the current account status and available handlers.
 * It also manages various confirmation and error dialogs as well as a dialog to display a temporary password.
 *
 * @param accountStatus - The current status of the user account.
 * @param confirmationStatus - A flag indicating the confirmation state for user actions.
 * @param user - The user object containing account details.
 */
export function UserManagementDropdown({
  accountStatus,
  confirmationStatus,
  user,
}: props) {
  const {
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    handleEnableUser,
    handleDisableUser,
    handleForceChangePassword,
    showTempPassword,
    setShowTempPassword,
    tempPassword,
    isConfirmEnableUserDialogOpen,
    confirmEnableUserDialogTitle,
    confirmEnableUserDialogMsg,
    cancelEnableUser,
    confirmEnableUser,
    isConfirmDisableUserDialogOpen,
    confirmDisableUserDialogTitle,
    confirmDisableUserDialogMsg,
    cancelDisableUser,
    confirmDisableUser,
    isConfirmForceChangePasswordDialogOpen,
    confirmForceChangePasswordDialogTitle,
    confirmForceChangePasswordDialogMsg,
    cancelForceChangePassword,
    confirmForceChangePassword,
    openEditUserSheet,
    setOpenEditUserSheet,
    isActionPending,
    setIsActionPending,
    showEditUserSheet,
  } = useUserManagementDropdown({
    accountStatus,
    confirmationStatus,
    userId: user.userId,
  });
  return (
    <div className="flex space-x-2">
      <ConfirmationDialog
        open={isConfirmForceChangePasswordDialogOpen}
        onOpenChange={cancelForceChangePassword}
        onConfirm={confirmForceChangePassword}
        description={confirmForceChangePasswordDialogMsg}
        title={confirmForceChangePasswordDialogTitle}
      />

      <ConfirmationDialog
        open={isConfirmEnableUserDialogOpen}
        onOpenChange={cancelEnableUser}
        onConfirm={confirmEnableUser}
        description={confirmEnableUserDialogMsg}
        title={confirmEnableUserDialogTitle}
      />

      <ConfirmationDialog
        open={isConfirmDisableUserDialogOpen}
        onOpenChange={cancelDisableUser}
        onConfirm={confirmDisableUser}
        description={confirmDisableUserDialogMsg}
        title={confirmDisableUserDialogTitle}
      />

      <ErrorDialog
        open={isErrorDialogOpen}
        onOpenChange={closeErrorDialog}
        title={errorTitle}
        description={errorMsg}
      />

      {showEditUserSheet && (
        <EditUserSheet
          open={openEditUserSheet}
          onOpenChange={setOpenEditUserSheet}
          isActionPending={isActionPending}
          setIsActionPending={setIsActionPending}
          user={user}
        />
      )}

      <Dialog open={showTempPassword} onOpenChange={setShowTempPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Change Password Success</DialogTitle>
            <DialogDescription>
              Below is the temporary password that needs to be provided to the
              user to change their password.
            </DialogDescription>
          </DialogHeader>
          <p>{tempPassword}</p>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isActionPending}>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>More Actions Dropdown</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent>
          {accountStatus === "ENABLED" && (
            <DropdownMenuItem
              disabled={isActionPending}
              onClick={() => setOpenEditUserSheet(true)}
            >
              Edit User
            </DropdownMenuItem>
          )}
          {handleForceChangePassword && (
            <DropdownMenuItem
              disabled={isActionPending}
              onClick={() => handleForceChangePassword()}
            >
              Force Change Password
            </DropdownMenuItem>
          )}
          {handleDisableUser && (
            <DropdownMenuItem
              disabled={isActionPending}
              onClick={() => handleDisableUser()}
            >
              Disable User
            </DropdownMenuItem>
          )}
          {handleEnableUser && (
            <DropdownMenuItem
              disabled={isActionPending}
              onClick={() => handleEnableUser()}
            >
              Enable User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
