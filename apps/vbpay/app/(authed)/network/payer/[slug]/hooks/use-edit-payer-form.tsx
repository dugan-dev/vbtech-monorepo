import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { canUserEditPayer } from "@/utils/can-user-edit-payer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserType } from "@/types/user-type";
import { useErrorDialog } from "@/hooks/use-error-dialog";

import { updatePayerAction } from "../actions/update-payer-action";
import {
  EditPayerFormData,
  EditPayerFormInput,
  EditPayerFormOutput,
  EditPayerFormSchema,
} from "../components/info/edit-payer-form/edit-payer-form-schema";

// User types and role required to Edit
const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  onSuccess: () => void;
  formData: EditPayerFormData;
};

/**
 * Provides state management, validation, permission checks, and submission handling for the edit payer form.
 *
 * Initializes the form with validation and default values, determines user edit permissions, and manages update actions with success and error feedback.
 *
 * @param onSuccess - Callback invoked after a successful payer update.
 * @param formData - Initial values to populate the edit form.
 * @returns An object containing the form instance, submission handler, pending state, error dialog controls, and a flag indicating if the user can edit.
 *
 * @remark If the user does not have permission to edit the payer, form submission is prevented and an error dialog is shown.
 */
export function useEditPayerForm({ onSuccess, formData }: props) {
  // get the slug from the url which is the pubId of the payer
  const { slug: pubId } = useParams();

  // get user context for permission checks
  const usersData = useUserContext();

  const userCanEdit = canUserEditPayer({
    payerPubId: pubId as string,
    allowedUserTypes: ALLOWED_USER_TYPES,
    usersAppAttrs: usersData.usersAppAttrs,
  });

  // set up react hook form
  const form = useForm<EditPayerFormInput>({
    resolver: zodResolver(EditPayerFormSchema),
    defaultValues: formData,
  });

  // set up error dialog
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  // get the path to revalidate after a successful update
  const revalidationPath = usePathname();

  // set up action
  const { execute, isPending } = useAction(updatePayerAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The payer has been updated successfully.",
      });
      onSuccess?.();
      form.reset();
    },
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? `Invalid inputs. Please double check the data and try again. If the problem persists please contact support. ${JSON.stringify(error)}`
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
  });

  /**
   * Handles submission of the edit payer form, executing the update action if the user has edit permissions.
   *
   * @param formData - The data submitted from the edit payer form.
   *
   * @remark
   * If the user lacks permission to edit the payer, an error dialog is displayed and the update action is not executed.
   */
  function onSubmit(formData: EditPayerFormOutput) {
    if (!userCanEdit) {
      openErrorDialog(
        "Error",
        "You do not have permission to edit this payer.",
      );
      return;
    }
    execute({
      pubId: pubId as string,
      formData,
      revalidationPath,
    });
  }

  return {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    userCanEdit,
  };
}
