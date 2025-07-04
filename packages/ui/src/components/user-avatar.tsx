"use client";

import { useState } from "react";
import type { ComponentType } from "react";

import { useConfirmationDialog } from "../hooks/use-confirmation-dialog";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { ConfirmationDialog } from "./confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  email: string;
  onSignOut: () => Promise<void>;
  onSignOutComplete?: () => void;
  lockIcon: ComponentType<{ className?: string }>;
  logoutIcon: ComponentType<{ className?: string }>;
  updatePasswordDialog: ComponentType<{
    isOpen: boolean;
    closeDialog: () => void;
  }>;
}

export function UserAvatar({
  firstName,
  lastName,
  email,
  onSignOut,
  onSignOutComplete,
  lockIcon: LockIcon,
  logoutIcon: LogoutIcon,
  updatePasswordDialog: UpdatePasswordDialog,
}: UserAvatarProps) {
  const {
    confirm,
    cancel,
    openConfDialog,
    isConfDialogOpen,
    confDialogTitle,
    confDialogMsg,
  } = useConfirmationDialog({
    onConfirmAsync: onSignOut,
    onConfirmAfterAsync: onSignOutComplete,
  });

  const [isPasswordUpdateDialogOpen, setIsPasswordUpdateDialogOpen] =
    useState(false);

  const avatarFallbackText =
    firstName && lastName
      ? `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
      : email.charAt(0).toUpperCase();

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
      <UpdatePasswordDialog
        isOpen={isPasswordUpdateDialogOpen}
        closeDialog={() => setIsPasswordUpdateDialogOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 gap-2 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="border font-semibold hover:bg-accent dark:border-white/30 dark:bg-white/10">
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {firstName && lastName
                  ? `${firstName} ${lastName}`
                  : "Guest User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPasswordUpdateDialogOpen(true)}>
            <LockIcon className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openConfDialog("Sign Out", "Are you sure you want to sign out?")
            }
          >
            <LogoutIcon className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
