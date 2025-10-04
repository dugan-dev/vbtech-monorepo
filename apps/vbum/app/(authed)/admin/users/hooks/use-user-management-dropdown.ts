import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { useConfirmationDialog } from "@workspace/ui/hooks/use-confirmation-dialog";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { disableUserAction } from "../action/disable-user-action";
import { enableUserAction } from "../action/enable-user-action";
import { forceChangeUserPasswordAction } from "../action/force-change-user-password-action";

type props = {
  accountStatus: string;
  confirmationStatus: string;
  userId: string;
};

/**
 * Provides state and handlers for managing user account actions within a dropdown interface.
 *
 * This hook encapsulates the logic for enabling, disabling, and forcing a password change on a user account.
 * It manages local UI states (e.g., showing an edit user sheet, pending action indicator, temporary password visibility)
 * and integrates with asynchronous action handlers and confirmation dialogs to perform user management operations.
 *
 * @param accountStatus - The current status of the user's account (e.g., "ENABLED", "DISABLED"), determining available actions.
 * @param confirmationStatus - The current confirmation status affecting the execution of certain actions.
 * @param userId - The unique identifier of the user whose account actions are being managed.
 *
 * @returns An object containing state variables and functions for handling user management actions and dialogs.
 */
export function useUserManagementDropdown({
  accountStatus,
  confirmationStatus,
  userId,
}: props) {
  const revalidationPath = usePathname();

  const [openEditUserSheet, setOpenEditUserSheet] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [showTempPassword, setShowTempPassword] = useState(false);

  const { execute: executeForceChangePassword } = useAction(
    forceChangeUserPasswordAction,
    {
      onExecute: () => {
        setIsActionPending(true);
      },
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
      onSuccess: ({ data }) => {
        const tempPass = data?.tempPass;
        setTempPassword(tempPass!);
        setShowTempPassword(true);
        toast("Success", {
          description: "The force user password was successful.",
        });
      },
      onSettled: () => {
        setIsActionPending(false);
      },
    },
  );

  function handleForceChangePassword() {
    openConfirmForceChangePasswordDialog(
      "Force Change Password",
      `Are you sure you want to force change this user's password?`,
    );
  }

  const { execute: executeEnableUser } = useAction(enableUserAction, {
    onExecute: () => {
      setIsActionPending(true);
    },
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
        description: "The user's account was enabled successfully.",
      });
    },
    onSettled: () => {
      setIsActionPending(false);
    },
  });

  function handleEnableUser() {
    openConfirmEnableUserDialog(
      "Enable User",
      `Are you sure you want to enable this user's account?`,
    );
  }

  const { execute: executeDisableUser } = useAction(disableUserAction, {
    onExecute: () => {
      setIsActionPending(true);
    },
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
        description: "The user's account was disabled successfully.",
      });
    },
    onSettled: () => {
      setIsActionPending(false);
    },
  });

  function handleDisableUser() {
    openConfirmDisableUserDialog(
      "Disable User",
      `Are you sure you want to disable this user's account?`,
    );
  }

  const {
    confirm: confirmForceChangePassword,
    cancel: cancelForceChangePassword,
    openConfDialog: openConfirmForceChangePasswordDialog,
    isConfDialogOpen: isConfirmForceChangePasswordDialogOpen,
    confDialogTitle: confirmForceChangePasswordDialogTitle,
    confDialogMsg: confirmForceChangePasswordDialogMsg,
  } = useConfirmationDialog({
    onConfirmAfterAsync: () => {
      executeForceChangePassword({ userId, revalidationPath });
    },
  });

  const {
    confirm: confirmEnableUser,
    cancel: cancelEnableUser,
    openConfDialog: openConfirmEnableUserDialog,
    isConfDialogOpen: isConfirmEnableUserDialogOpen,
    confDialogTitle: confirmEnableUserDialogTitle,
    confDialogMsg: confirmEnableUserDialogMsg,
  } = useConfirmationDialog({
    onConfirmAfterAsync: () => {
      executeEnableUser({ userId, revalidationPath });
    },
  });

  const {
    confirm: confirmDisableUser,
    cancel: cancelDisableUser,
    openConfDialog: openConfirmDisableUserDialog,
    isConfDialogOpen: isConfirmDisableUserDialogOpen,
    confDialogTitle: confirmDisableUserDialogTitle,
    confDialogMsg: confirmDisableUserDialogMsg,
  } = useConfirmationDialog({
    onConfirmAfterAsync: () => {
      executeDisableUser({ userId, revalidationPath });
    },
  });

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  return {
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    showTempPassword,
    setShowTempPassword,
    tempPassword,
    handleEnableUser:
      accountStatus === "DISABLED" ? handleEnableUser : undefined,
    handleDisableUser:
      accountStatus === "ENABLED" ? handleDisableUser : undefined,
    handleForceChangePassword:
      accountStatus === "ENABLED" && confirmationStatus !== "CONFIRMED"
        ? handleForceChangePassword
        : undefined,
    showEditUserSheet: accountStatus === "ENABLED",
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
  };
}
