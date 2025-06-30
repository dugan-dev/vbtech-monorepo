import { useState } from "react";

interface UseUpdatePasswordProps {
  updatePasswordFn: (data: { oldPassword: string; newPassword: string }) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  showToast?: (title: string, description: string) => void;
}

export function useUpdatePassword({
  updatePasswordFn,
  onSuccess,
  onError,
  successMessage = "Your password has been updated successfully.",
  showToast,
}: UseUpdatePasswordProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setIsLoading(true);

    try {
      await updatePasswordFn({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      onSuccess?.();

      if (showToast) {
        showToast("Success", successMessage);
      }
    } catch (e) {
      console.error(e);
      const error = e instanceof Error ? e : new Error("An error occurred");
      
      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdatePassword,
    isLoading,
  };
}