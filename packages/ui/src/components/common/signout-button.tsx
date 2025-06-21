"use client";

import { LogOut } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { ConfirmationDialog } from "@workspace/ui/components/common/confirmation-dialog";
import { useConfirmationDialog } from "@workspace/ui/hooks/use-confirmation-dialog";

type props = {
  signOut: () => Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
};

export function SignoutButton({
  signOut,
  variant = "ghost",
  size = "default",
  className,
  children,
}: props) {
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
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() =>
          openConfDialog("Sign Out", "Are you sure you want to sign out?")
        }
      >
        <LogOut className="mr-2 h-4 w-4" />
        {children || "Sign out"}
      </Button>
    </>
  );
}
