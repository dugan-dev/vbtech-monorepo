import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

import { UpdatePasswordForm } from "@/components/update-password-form/update-password-form";

type props = {
  isOpen: boolean;
  closeDialog: () => void;
};

export function UpdatePasswordDialog({ isOpen, closeDialog }: props) {
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
        <UpdatePasswordForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
