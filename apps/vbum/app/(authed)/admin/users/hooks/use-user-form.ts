import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm, useWatch } from "react-hook-form";
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
 * Manage a user creation/edit form with validation, submission, and error dialog handling.
 *
 * Initializes form default values from an optional existing user, performs Zod-based validation, submits create or edit actions, shows success toasts, and exposes error dialog controls.
 *
 * @param onSuccess - Optional callback invoked after a successful create or update.
 * @param user - Optional existing user object; when provided the form is initialized for editing.
 * @param setIsSubmitting - Optional setter to reflect external submitting state.
 * @returns An object containing the form instance, the `onSubmit` handler, create/edit pending flags, and error dialog state and controls (`isErrorDialogOpen`, `errorMsg`, `errorTitle`, `closeErrorDialog`).
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

  const type = useWatch({ control: form.control, name: "type" });

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
