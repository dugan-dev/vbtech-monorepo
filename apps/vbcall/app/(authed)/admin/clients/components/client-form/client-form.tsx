"use client";

import { timezones } from "@/values/timezones";

import { Form } from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { FormTextarea } from "@workspace/ui/components/form/form-text-area";

import { ErrorDialog } from "@/components/error-dialog";

import { useClientForm } from "../../hooks/use-client-form";
import { ClientFormData } from "./client-form-schema";

type props = {
  onSuccess?: () => void;
  formData?: ClientFormData;
  clientPubId?: string;
};

export function ClientForm({ onSuccess, formData, clientPubId }: props) {
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useClientForm({
    onSuccess,
    formData,
    clientPubId,
  });

  return (
    <Form {...form}>
      <ErrorDialog
        open={isErrorDialogOpen}
        onOpenChange={closeErrorDialog}
        description={errorMsg}
        title={errorTitle}
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={isPending} className="space-y-4 mb-8">
          <FormInput
            control={form.control}
            name="clientName"
            label="Client Name"
            type="text"
            isRequired
          />
          <FormInput
            control={form.control}
            name="clientCode"
            label="Client Code"
            type="text"
            isRequired
          />
          <FormCombo
            control={form.control}
            name="timezone"
            label="Timezone"
            comboItems={timezones}
            isRequired
          />
          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            isRequired
          />
        </fieldset>
        <div className="flex justify-end">
          <FormSubmitButton isSaving={isPending} />
        </div>
      </form>
    </Form>
  );
}
