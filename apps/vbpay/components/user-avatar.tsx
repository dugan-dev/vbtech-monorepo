"use client";

import { useState } from "react";
import { signOut } from "aws-amplify/auth";

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useConfirmationDialog } from "@workspace/ui/hooks/use-confirmation-dialog";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Icons } from "@/components/icons";
import { UpdatePasswordDialog } from "@/components/update-password-dialog";

type props = {
  firstName: string;
  lastName: string;
  email: string;
};

export function UserAvatar({ firstName, lastName, email }: props) {
  const {
    confirm,
    cancel,
    openConfDialog,
    isConfDialogOpen,
    confDialogTitle,
    confDialogMsg,
  } = useConfirmationDialog({
    onConfirmAsync: signOut,
    onConfirmAfterAsync: () => {
      window.location.reload();
    },
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
            <Icons.lock className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openConfDialog("Sign Out", "Are you sure you want to sign out?")
            }
          >
            <Icons.logout className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
