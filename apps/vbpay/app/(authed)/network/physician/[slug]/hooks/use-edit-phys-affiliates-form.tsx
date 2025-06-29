import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { canUserEditPayer } from "@/utils/can-user-edit-payer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserType } from "@/types/user-type";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { updatePhysAffiliatesAction } from "../actions/update-phys-affiliates-action";
import {
  EditPhysAffiliatesFormData,
  EditPhysAffiliatesFormInput,
  EditPhysAffiliatesFormOutput,
  EditPhysAffiliatesFormSchema,
} from "../components/affiliates/edit-affiliates-form/edit-phys-affiliates-schema";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  onSuccess: () => void;
  formData: EditPhysAffiliatesFormData;
  payerPubId: string;
};

/**
 * Manages form state, validation, and submission for editing a network physician's affiliations.
 *
 * Handles user permission checks, error dialog state, and action execution for updating physician affiliations. Returns form utilities, submission handler, loading and error states, and a flag indicating whether the user can edit.
 *
 * @param onSuccess - Optional callback invoked after a successful update.
 * @param formData - Initial values for the form fields.
 * @param payerPubId - Public ID of the payer whose physician affiliations are being edited.
 *
 * @returns An object with the form instance, submission handler, loading state, error dialog controls, and a permission flag.
 */
export function useEditPhysAffiliatesForm({
  onSuccess,
  formData,
  payerPubId,
}: props) {
  // get user context for permission checks
  const usersData = useUserContext();

  const userCanEdit = canUserEditPayer({
    payerPubId,
    allowedUserTypes: ALLOWED_USER_TYPES,
    usersAppAttrs: usersData.usersAppAttrs,
  });

  // get the slug from the url which is the pubId of the physician
  const { slug: pubId } = useParams();

  // set up react-hook-form
  const form = useForm<EditPhysAffiliatesFormInput>({
    resolver: zodResolver(EditPhysAffiliatesFormSchema),
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

  // get revalidation path for action
  const revalidationPath = usePathname();

  // set up action
  const { execute, isPending } = useAction(updatePhysAffiliatesAction, {
    onSuccess: () => {
      toast("Success", {
        description:
          "The network physician's affiliations have been updated successfully.",
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
  function onSubmit(formData: EditPhysAffiliatesFormOutput) {
    if (!userCanEdit) {
      openErrorDialog(
        "Error",
        "You do not have permission to edit this physician.",
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
