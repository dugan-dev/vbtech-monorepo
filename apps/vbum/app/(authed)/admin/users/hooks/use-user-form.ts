import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useDidMountEffect } from "@workspace/ui/hooks/use-did-mount-effect";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { UserCognito } from "@/types/user-cognito";
import { UserType } from "@/types/user-type";

import { createUserAction } from "../action/create-user-action";
import { editUserAction } from "../action/edit-user-action";
import {
  UserFormDefaultValues,
  UserFormInput,
  UserFormOutput,
  UserFormSchema,
} from "../component/user-form-schema";

type props = {
  onSuccess?: () => void;
  user?: UserCognito;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Provides state and logic for a multi-step user form with validation, submission, and error handling.
 *
 * Supports both user creation and editing workflows, including step navigation, field validation per step, error dialog management, and asynchronous submission with success and error feedback. Exposes form state, navigation controls, and pending status for UI integration.
 *
 * @param onSuccess - Optional callback invoked after successful user creation or update.
 * @param user - Optional existing user data; if provided, the form initializes in edit mode.
 * @param setIsSubmitting - Optional setter to control external submission state.
 *
 * @returns An object containing the form instance, submission handler, step navigation and validation functions, error dialog controls, current step state, and pending status indicators.
 */
export function useUserForm({ onSuccess, user, setIsSubmitting }: props) {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    user?.appAttrs?.type || null,
  );

  const revalidationPath = usePathname();

  // Create a properly typed default value
  const defaultValues: UserFormInput = user
    ? {
        type: user.appAttrs?.type || UserFormDefaultValues.type,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        super: user.appAttrs?.super || UserFormDefaultValues.super,
        admin: user.appAttrs?.admin || UserFormDefaultValues.admin,
        ids: user.appAttrs?.ids?.map((id) => id.id) || [],
      }
    : UserFormDefaultValues;

  const form = useForm<UserFormInput>({
    resolver: zodResolver(UserFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { watch } = form;
  const type = watch("type");

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { execute: executeCreateUser, isPending: isPendingCreateUser } =
    useAction(createUserAction, {
      onError: ({ error }) => {
        openErrorDialog(
          "Error",
          error.validationErrors
            ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
            : error.serverError
              ? error.serverError
              : (error as string),
        );
        setIsSubmitting?.(false);
      },
      onSuccess: () => {
        toast("Success", {
          description: "The user was created successfully.",
        });
        form.reset(UserFormDefaultValues);
        onSuccess?.();
        setIsSubmitting?.(false);
      },
    });

  const { execute: executeEditUser, isPending: isPendingEditUser } = useAction(
    editUserAction,
    {
      onError: ({ error }) => {
        openErrorDialog(
          "Error",
          error.validationErrors
            ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
            : error.serverError
              ? error.serverError
              : (error as string),
        );
        setIsSubmitting?.(false);
      },
      onSuccess: () => {
        toast("Success", {
          description: "The user was updated successfully.",
        });
        form.reset(UserFormDefaultValues);
        onSuccess?.();
        setIsSubmitting?.(false);
      },
    },
  );

  function onSubmit(formData: UserFormOutput) {
    setIsSubmitting?.(true);
    if (user) {
      executeEditUser({
        formData,
        userId: user.userId,
        revalidationPath,
      });
    } else {
      executeCreateUser({
        formData,
        revalidationPath,
      });
    }
  }

  useDidMountEffect(() => {
    if (type !== selectedUserType) {
      form.setValue("ids", []);
      form.setValue("super", false);
      form.setValue("admin", false);
      setSelectedUserType(type as UserType);
    }
  }, [type]);

  return {
    form,
    onSubmit,
    isPendingCreateUser,
    isPendingEditUser,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
