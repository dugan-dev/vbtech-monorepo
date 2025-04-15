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
 * Custom hook for managing the form used to edit payer information.
 *
 * This hook initializes a form with default values and Zod-based validation, extracts the payer's
 * public ID from the URL parameters, and sets up an action to update the payer information. On a
 * successful update, it displays a success toast, triggers an optional callback, and resets the form.
 * If an error occurs, it opens an error dialog with an appropriate message based on the error type.
 *
 * @param onSuccess - Optional callback invoked upon a successful update.
 * @param formData - Initial data used to populate the form.
 *
 * @returns An object containing:
 *   - form: The form instance managed by react-hook-form.
 *   - onSubmit: The submission handler that triggers the update action.
 *   - isPending: Boolean indicating whether the update action is in progress.
 *   - isErrorDialogOpen: Boolean indicating whether the error dialog is open.
 *   - errorMsg: Error message to display in the dialog.
 *   - errorTitle: Title for the error dialog.
 *   - closeErrorDialog: Function to close the error dialog.
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

  // handle form submission
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
