import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { canUserEditPayer } from "@/utils/can-user-edit-payer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { UserType } from "@/types/user-type";

import { insertPhysPyConfigAction } from "../actions/insert-phys-py-config-action";
import { updatePhysPyConfigAction } from "../actions/update-phys-py-config-action";
import {
  PhysPyConfigFormData,
  PhysPyConfigFormInput,
  PhysPyConfigFormOutput,
  PhysPyConfigFormSchema,
} from "../components/py-config/phys-py-config-form-schema";

// User types and role required to Edit
const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  payerPubId: string;
  data?: PhysPyConfigFormData;
  pubId?: string;
};

/**
 * Provides form state management, validation, permission enforcement, and submission logic for the Physician PY Config form.
 *
 * Handles both creation and editing of Physician PY Config data, including user permission checks, error dialog management, and success notifications.
 *
 * @param onSuccess - Callback invoked after a successful form submission.
 * @param setIsSubmitting - Function to control the external submitting state.
 * @param payerPubId - Public identifier for the payer associated with the configuration.
 * @param data - Optional initial form data for editing an existing configuration.
 * @param pubId - Optional public identifier for the configuration being edited.
 *
 * @returns An object containing the form instance, submission handler, pending state flag, error dialog controls, and a boolean indicating if the user can edit the configuration.
 */
export function usePhysPyConfigForm({
  onSuccess,
  setIsSubmitting,
  payerPubId,
  data,
  pubId,
}: props) {
  // get user context for permission checks
  const usersData = useUserContext();

  const userCanEdit = canUserEditPayer({
    payerPubId,
    allowedUserTypes: ALLOWED_USER_TYPES,
    usersAppAttrs: usersData.usersAppAttrs,
  });

  // Set revalidation path
  const revalidationPath = usePathname();

  // Set up react hook form
  const form = useForm<PhysPyConfigFormInput>({
    resolver: zodResolver(PhysPyConfigFormSchema),
    defaultValues: data,
    mode: "onChange",
  });

  // Set up error dialog
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  // Set up update action
  const {
    execute: executeUpdatePhysPyConfig,
    isPending: isUpdatePhysPyConfigPending,
  } = useAction(updatePhysPyConfigAction, {
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
        description: "Physician PY Config was updated successfully.",
      });
      onSuccess?.();
      setIsSubmitting?.(false);
    },
  });

  // Set up insert action
  const {
    execute: executeInsertPhysPyConfig,
    isPending: isInsertPhysPyConfigPending,
  } = useAction(insertPhysPyConfigAction, {
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
        description: "Physician PY Config was saved successfully.",
      });
      onSuccess?.();
      setIsSubmitting?.(false);
    },
  });

  const { slug } = useParams();
  const physPubId = slug as string;

  function onSubmit(formData: PhysPyConfigFormOutput) {
    if (!userCanEdit) {
      openErrorDialog(
        "Error",
        "You do not have permission to edit this payer.",
      );
      return;
    }

    setIsSubmitting?.(true);

    if (data && pubId) {
      executeUpdatePhysPyConfig({
        formData,
        pubId,
        payerPubId: payerPubId!,
        revalidationPath,
      });
    } else {
      executeInsertPhysPyConfig({
        formData,
        payerPubId: payerPubId!,
        physPubId: physPubId,
        revalidationPath,
      });
    }
  }

  return {
    form,
    onSubmit,
    isPending: isUpdatePhysPyConfigPending || isInsertPhysPyConfigPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    userCanEdit,
  };
}
