import { useState } from "react";
import { updatePassword } from "aws-amplify/auth";
import { toast } from "sonner";

import { getErrorMessage } from "@workspace/ui/lib/get-error-message";

interface UseUpdatePasswordProps {
  onSuccess?: () => void;
}

export function useUpdatePassword({ onSuccess }: UseUpdatePasswordProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setIsLoading(true);

    try {
      await updatePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      onSuccess?.();

      toast("Success", {
        description: "Your password has been updated successfully.",
        dismissible: true,
        duration: 10000,
        position: "top-center",
      });
    } catch (e) {
      console.error(e);
      throw new Error(getErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdatePassword,
    isLoading,
  };
}
