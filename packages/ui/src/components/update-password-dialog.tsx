import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { UpdatePasswordForm } from "./form/update-password-form";

interface UpdatePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  loadingText?: string;
  submitText?: string;
}

export function UpdatePasswordDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  title = "Change Password",
  description = "Enter your new password below. We recommend using a strong, unique password.",
  loadingText,
  submitText,
}: UpdatePasswordDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <UpdatePasswordForm
          onSubmit={onSubmit}
          onClose={onClose}
          isLoading={isLoading}
          loadingText={loadingText}
          submitText={submitText}
        />
      </DialogContent>
    </Dialog>
  );
}
