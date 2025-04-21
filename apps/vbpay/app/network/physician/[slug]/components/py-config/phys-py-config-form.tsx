"use client";

import { useLicenseContext } from "@/contexts/license-context";

import { EditButton } from "@workspace/ui/components/edit-button";
import { Form } from "@workspace/ui/components/form";
import { FormCheckbox } from "@workspace/ui/components/form/form-checkbox";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";

import { PaymentTypeType } from "@/types/payment-type";
import { PerfYears } from "@/types/perf-year";
import { ErrorDialog } from "@/components/error-dialog";

import { usePhysPyConfigForm } from "../../hooks/use-phys-py-config-form";
import { PhysPyConfigFormData } from "./phys-py-config-form-schema";

type props = {
  onSuccess: () => void;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  data?: PhysPyConfigFormData;
  payerPubId?: string;
  pubId?: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function PhysPyConfigForm({
  onSuccess,
  setIsSubmitting,
  data,
  payerPubId,
  pubId,
  isEditing,
  setIsEditing,
}: props) {
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    userCanEdit,
  } = usePhysPyConfigForm({
    onSuccess,
    setIsSubmitting,
    data,
    payerPubId,
    pubId,
  });
  const license = useLicenseContext();
  const paymentTypes = license.paymentTypes.split(",") as PaymentTypeType[];
  const hasCapitation = paymentTypes.includes("capitation");
  const hasClaim = paymentTypes.includes("ffs replacement");
  const hasValueBased = paymentTypes.includes("value based");

  return (
    <Form {...form}>
      {isErrorDialogOpen && (
        <ErrorDialog
          description={errorMsg}
          title={errorTitle}
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
        />
      )}
      <form
        onSubmit={form.handleSubmit((data) =>
          onSubmit(data as PhysPyConfigFormData),
        )}
        className="space-y-8"
      >
        <fieldset
          disabled={isPending || (data && pubId && !isEditing ? true : false)}
          className="flex flex-col gap-4 w-1/2 py-4"
        >
          <FormCombo
            name="perfYear"
            label="Performance Year"
            control={form.control}
            isRequired
            comboItems={PerfYears.map((perfYear) => ({
              label: perfYear,
              value: perfYear,
            }))}
            isDisabled={data ? true : false}
          />
          {hasCapitation && (
            <FormCheckbox
              name="enableCapPayments"
              label="Capitation Payments"
              control={form.control}
              labelFirst
            />
          )}
          {hasClaim && (
            <FormCheckbox
              name="enableClaimPayments"
              label="Claim Payments"
              control={form.control}
              labelFirst
            />
          )}
          {hasValueBased && (
            <FormCheckbox
              name="enableValuePayments"
              label="Value Payments"
              control={form.control}
              labelFirst
            />
          )}
        </fieldset>
        {data && pubId && !isEditing ? (
          <EditButton setIsEditing={setIsEditing} userCanEdit={userCanEdit} />
        ) : (
          <FormSubmitButton isSaving={isPending} />
        )}
      </form>
    </Form>
  );
}
