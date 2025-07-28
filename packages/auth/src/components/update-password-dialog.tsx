import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

import { useUpdatePassword } from "../hooks/use-update-password";
import { UpdatePasswordForm } from "./update-password-form";

type props = {
  isOpen: boolean;
  closeDialog: () => void;
};

export function UpdatePasswordDialog({ isOpen, closeDialog }: props) {
  const { handleUpdatePassword, isLoading } = useUpdatePassword({
    onSuccess: closeDialog,
  });

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your new password below. We recommend using a strong, unique
            password.
          </DialogDescription>
        </DialogHeader>
        <UpdatePasswordForm
          onSubmit={handleUpdatePassword}
          onClose={closeDialog}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
