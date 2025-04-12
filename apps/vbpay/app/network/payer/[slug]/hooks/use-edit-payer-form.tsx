import { useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@/hooks/use-error-dialog";

import { updatePayerAction } from "../actions/update-payer-action";
import {
  EditPayerFormData,
  EditPayerFormInput,
  EditPayerFormOutput,
  EditPayerFormSchema,
} from "../components/info/edit-payer-form/edit-payer-form-schema";

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
  const form = useForm<EditPayerFormInput>({
    resolver: zodResolver(EditPayerFormSchema),
    defaultValues: formData,
  });

  const { slug: pubId } = useParams();

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

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

  function onSubmit(formData: EditPayerFormOutput) {
    execute({
      pubId: pubId as string,
      formData: {
        ...formData,
        initPerfMo: formData.initPerfMo,
        initPerfYr: formData.initPerfYr,
      },
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
  };
}
