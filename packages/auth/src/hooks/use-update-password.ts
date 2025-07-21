import { updatePassword } from "aws-amplify/auth";
import { toast } from "sonner";

import { useUpdatePassword as useSharedUpdatePassword } from "@workspace/ui/hooks/use-update-password";
import { getErrorMessage } from "@workspace/utils/get-error-message";

type props = {
  onSuccess?: () => void;
};

export function useUpdatePassword({ onSuccess }: props = {}) {
  return useSharedUpdatePassword({
    updatePasswordFn: async (data: {
      oldPassword: string;
      newPassword: string;
    }) => {
      await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess,
    onError: (error: Error) => {
      throw new Error(getErrorMessage(error));
    },
    showToast: (title: string, description: string) => {
      toast(title, {
        description,
        dismissible: true,
        duration: 10000,
        position: "top-center",
      });
    },
  });
}
