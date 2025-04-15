import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserCognito } from "@/types/user-cognito";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { useDidMountEffect } from "@/hooks/use-did-mount-effect";
import { useErrorDialog } from "@/hooks/use-error-dialog";

import { createUserAction } from "../action/create-user-action";
import { editUserAction } from "../action/edit-user-action";
import { UserFormStepValues } from "../component/user-form/steps/user-form-step-values";
import {
  UserFormDefaultValues,
  UserFormInput,
  UserFormOutput,
  UserFormSchema,
} from "../component/user-form/user-form-schema";

type props = {
  onSuccess?: () => void;
  user?: UserCognito;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useSteppedUserForm({
  onSuccess,
  user,
  setIsSubmitting,
}: props) {
  const [currentStep, setCurrentStep] = useState(user ? 3 : 1);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    user?.appAttrs.type || null,
  );

  // Navigate to next step
  const nextStep = async () => {
    let canProceed = false;

    if (currentStep === 1) {
      // Validate only the basic info fields
      const result = await form.trigger(["firstName", "lastName", "email"]);
      canProceed = result;
    } else if (currentStep === 2) {
      // Validate only the user type fields
      const result = await form.trigger(["type", "admin", "super"]);
      canProceed = result;
    }

    if (canProceed || currentStep === 3) {
      setCurrentStep((prev) => Math.min(prev + 1, UserFormStepValues.length));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const revalidationPath = usePathname();

  // Create a properly typed default value
  const defaultValues: UserFormInput = user
    ? {
        type: user.appAttrs.type,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        super: user.appAttrs.super,
        admin: user.appAttrs.admin,
        ids:
          user.appAttrs.ids?.map((id) => {
            const validRoles = id.userRoles.map((role) => role as UserRole);
            return {
              id: id.id,
              userMode: id.userMode,
              userRoles: validRoles,
            };
          }) || [],
      }
    : UserFormDefaultValues;

  const form = useForm<UserFormInput>({
    resolver: zodResolver(UserFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const email = form.watch("email");
  const type = form.watch("type");
  const ids = form.watch("ids");

  const isStepValid = (step: number) => {
    if (step === 1) {
      return (
        firstName.length > 0 &&
        lastName.length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      );
    }
    if (step === 2) {
      return type !== ""; // Ensure type is selected
    }
    if (step === 3) {
      return ids.length > 0;
    }
    return false;
  };

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
    isStepValid,
    prevStep,
    nextStep,
    currentStep,
    setCurrentStep,
  };
}
