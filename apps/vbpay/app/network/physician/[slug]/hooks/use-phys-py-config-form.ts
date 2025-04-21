import { useParams, usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { useErrorDialog } from "@/hooks/use-error-dialog";

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
const REQUIRED_USER_ROLE: UserRole = "edit";

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  payerPubId: string;
  data?: PhysPyConfigFormData;
  pubId?: string;
};

export function usePhysPyConfigForm({
  onSuccess,
  setIsSubmitting,
  payerPubId,
  data,
  pubId,
}: props) {
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
