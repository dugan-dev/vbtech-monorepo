import { updatePassword } from "aws-amplify/auth";
import { toast } from "sonner";

import { useUpdatePassword as useSharedUpdatePassword } from "@workspace/ui/hooks/use-update-password";
import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

interface UseUpdatePasswordProps {
  onSuccess?: () => void;
}

export function useUpdatePassword({ onSuccess }: UseUpdatePasswordProps = {}) {
  return useSharedUpdatePassword({
    updatePasswordFn: async (data) => {
      await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess,
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
    showToast: (title, description) => {
      toast(title, {
        description,
        dismissible: true,
        duration: 10000,
        position: "top-center",
      });
    },
  });
}
