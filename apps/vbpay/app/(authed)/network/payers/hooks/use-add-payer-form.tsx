import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { insertPayerAction } from "../actions/insert-payer-action";
import {
  AddPayerFormDefaultValues,
  AddPayerFormInput,
  AddPayerFormOutput,
  AddPayerFormSchema,
} from "../components/add-payer-form/add-payer-form-schema";

type props = {
  onSuccess?: () => void;
};

export function useAddPayerForm({ onSuccess }: props) {
  const form = useForm<AddPayerFormInput>({
    resolver: zodResolver(AddPayerFormSchema),
    defaultValues: AddPayerFormDefaultValues,
  });

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const revalidationPath = usePathname();

  const { execute: execInsertPayerAction, isPending: isInsertPayerPending } =
    useAction(insertPayerAction, {
      onSuccess: () => {
        toast("Success", {
          description: "The payer has been created successfully.",
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

  function onSubmit(formData: AddPayerFormInput) {
    // Transform the form data to match the expected output type
    const transformedData: AddPayerFormOutput = {
      payerType: formData.payerType,
      initPerfYr: formData.initPerfYr,
      initPerfMo: formData.initPerfMo,
      marketingName: formData.marketingName,
      cmsId: formData.cmsId === "" ? undefined : formData.cmsId,
      legalName: formData.legalName === "" ? undefined : formData.legalName,
      referenceName:
        formData.referenceName === "" ? undefined : formData.referenceName,
      taxId:
        formData.taxId === "" ? undefined : formData.taxId?.replace("-", ""),
      parentOrgName:
        formData.parentOrgName === "" ? undefined : formData.parentOrgName,
      websiteUrl: formData.websiteUrl === "" ? undefined : formData.websiteUrl,
    };

    execInsertPayerAction({
      formData: transformedData,
      revalidationPath,
    });
  }

  return {
    form,
    onSubmit,
    isInsertPayerPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
