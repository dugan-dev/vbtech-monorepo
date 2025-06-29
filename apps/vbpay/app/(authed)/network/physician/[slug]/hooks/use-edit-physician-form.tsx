import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { canUserEditPayer } from "@/utils/can-user-edit-payer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserType } from "@/types/user-type";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { updatePhysicianAction } from "../actions/update-physician-action";
import {
  EditPhysicianFormData,
  EditPhysicianFormInput,
  EditPhysicianFormOutput,
  EditPhysicianFormSchema,
} from "../components/info/edit-physician-form/edit-physician-form-schema";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  onSuccess: () => void;
  formData: EditPhysicianFormData;
  payerPubId: string;
};

/**
 * React hook for managing the edit physician form, including permission checks, form state, submission handling, and error dialogs.
 *
 * Returns form methods, a submission handler, loading and error dialog states, and a flag indicating whether the current user can edit the physician.
 *
 * @param onSuccess - Callback invoked after a successful form submission.
 * @param formData - Initial values for the form fields.
 * @param payerPubId - Identifier for the payer context used in permission checks.
 *
 * @returns An object containing the form instance, submission handler, loading state, error dialog controls, and the `userCanEdit` permission flag.
 *
 * @remark If the user lacks permission to edit, form submission is blocked and an error dialog is shown.
 */
export function useEditPhysicianForm({
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
  const form = useForm<EditPhysicianFormInput>({
    resolver: zodResolver(EditPhysicianFormSchema),
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
  const { execute, isPending } = useAction(updatePhysicianAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The network physician has been updated successfully.",
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
  function onSubmit(formData: EditPhysicianFormOutput) {
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
