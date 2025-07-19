import { UpdatePasswordDialog as SharedUpdatePasswordDialog } from "@workspace/auth/components/update-password-dialog";

import { useUpdatePassword } from "@/hooks/use-update-password";

type props = {
  isOpen: boolean;
  closeDialog: () => void;
};

export function UpdatePasswordDialog({ isOpen, closeDialog }: props) {
  const { handleUpdatePassword, isLoading } = useUpdatePassword({
    onSuccess: closeDialog,
  });

  return (
    <SharedUpdatePasswordDialog
      isOpen={isOpen}
      onClose={closeDialog}
      onSubmit={handleUpdatePassword}
      isLoading={isLoading}
    />
  );
}
