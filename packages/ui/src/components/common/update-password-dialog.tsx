import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

type props = {
  isOpen: boolean;
  closeDialog: () => void;
  UpdatePasswordForm: React.ComponentType<{
    closeDialog: () => void;
  }>;
};

export function UpdatePasswordDialog({
  isOpen,
  closeDialog,
  UpdatePasswordForm,
}: props) {
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
