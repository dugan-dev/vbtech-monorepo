import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { useErrorDialog } from "@/hooks/use-error-dialog";

import { updateEntityAction } from "../actions/update-entity-action";
import {
  EditEntityFormData,
  EditEntityFormInput,
  EditEntityFormOutput,
  EditEntityFormSchema,
} from "../components/info/edit-entity-form/edit-entity-form-schema";

type props = {
  onSuccess: () => void;
  formData: EditEntityFormData;
  payerPubId: string;
};

// Users with these user types and roles can edit an entity for a specific payer
const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];
const REQUIRED_USER_ROLE: UserRole = "edit";

/**
 * React hook for managing the edit form of a network entity with integrated permission checks, form validation, and error handling.
 *
 * Provides form state, submission handler, error dialog controls, pending state, and a flag indicating whether the current user has permission to edit the entity.
 *
 * @param onSuccess - Callback invoked after a successful entity update.
 * @param formData - Initial values for the edit form.
 * @param payerPubId - Public ID of the payer associated with the entity.
 * @returns An object containing the form instance, submit handler, pending state, error dialog controls, and the `userCanEdit` permission flag.
 *
 * @remark If the user lacks edit permissions, form submission is blocked and an error dialog is shown.
 */
export function useEditEntityForm({ onSuccess, formData, payerPubId }: props) {
  // get user context for permission checks
  const usersAppAttrs = useUserContext();

  // get users payer specific permissions
  const payerPermissions = usersAppAttrs.ids?.find(
    (id) => id.id === payerPubId,
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

  // get the slug from the url which is the pubId of the entity
  const { slug: pubId } = useParams();

  // set up react hook form
  const form = useForm<EditEntityFormInput>({
    resolver: zodResolver(EditEntityFormSchema),
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

  // get revalidation path for use in action
  const revalidationPath = usePathname();

  // set up action
  const { execute, isPending } = useAction(updateEntityAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The network entity has been updated successfully.",
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

  function onSubmit(formData: EditEntityFormOutput) {
    if (!userCanEdit) {
      openErrorDialog(
        "Error",
        "You do not have permission to edit this entity.",
      );
      return;
    }
    execute({
      pubId: pubId as string,
      formData,
      revalidationPath,
      payerPubId,
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
