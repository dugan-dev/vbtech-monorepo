import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserRole } from "@/types/user-role";
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
const REQUIRED_USER_ROLE: UserRole = "edit";

type props = {
  onSuccess: () => void;
  formData: EditPayerFormData;
};

/**
 * Provides form state and submission logic for editing payer information, including user permission checks and error handling.
 *
 * Initializes a form with validation and default values, determines if the current user has permission to edit the payer, and manages the update action. Displays success or error feedback as appropriate.
 *
 * @param onSuccess - Optional callback invoked after a successful payer update.
 * @param formData - Initial values to populate the edit form.
 *
 * @returns An object with the form instance, submission handler, pending state, error dialog controls, and a flag indicating if the user can edit.
 *
 * @remark If the user lacks edit permission, form submission is blocked and an error dialog is shown.
 */
export function useEditPayerForm({ onSuccess, formData }: props) {
  // get the slug from the url which is the pubId of the payer
  const { slug: pubId } = useParams();

  // get user context for permission checks
  const usersAppAttrs = useUserContext();

  // get users payer specific permissions
  const payerPermissions = usersAppAttrs.ids?.find(
    (id) => id.id === (pubId as string),
  );

  // assume user cannot edit
  let userCanEdit = false;

  // check if user can edit and update userCanEdit if they can
  if (
    payerPermissions &&
    ALLOWED_USER_TYPES.includes(usersAppAttrs.type) &&
    payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
  ) {
    userCanEdit = true;
  }

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
