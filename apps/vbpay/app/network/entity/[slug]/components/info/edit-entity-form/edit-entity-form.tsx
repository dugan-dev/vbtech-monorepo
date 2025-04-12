"use client";

import { Form } from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { formatTaxId } from "@workspace/ui/lib/formatTaxId";

import {
  NetworkEntityTypeLabels,
  NetworkEntityTypes,
} from "@/types/network-entity-type";
import { ErrorDialog } from "@/components/error-dialog";

import { useEditEntityForm } from "../../../hooks/use-edit-entity-form";
import { EditEntityFormData } from "./edit-entity-form-schema";

type props = {
  onSuccess: () => void;
  formData: EditEntityFormData;
};

export function EditEntityForm({ onSuccess, formData }: props) {
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useEditEntityForm({
    onSuccess,
    formData,
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="container max-w-screen-lg mx-auto px-6 py-8">
        <Form {...form}>
          <ErrorDialog
            open={isErrorDialogOpen}
            onOpenChange={closeErrorDialog}
            description={errorMsg}
            title={errorTitle}
          />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
              <fieldset disabled={isPending} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormCombo
                    control={form.control}
                    name="netEntType"
                    label="Entity Type"
                    isRequired
                    comboItems={NetworkEntityTypes.map((type) => ({
                      label: NetworkEntityTypeLabels[type],
                      value: type,
                    }))}
                  />
                  <FormInput
                    control={form.control}
                    name="marketingName"
                    label="Marketing Name"
                    type="text"
                    isRequired
                  />
                  <FormInput
                    control={form.control}
                    name="legalName"
                    label="Legal Name"
                    type="text"
                  />
                  <FormInput
                    control={form.control}
                    name="referenceName"
                    label="Acronym/Nickname"
                    type="text"
                  />
                  <FormInput
                    control={form.control}
                    name="orgNpi"
                    label="Organizational NPI"
                    type="text"
                  />
                  <FormInput
                    control={form.control}
                    name="taxId"
                    label="Tax ID"
                    type="text"
                    formatOnChange={formatTaxId}
                  />
                </div>
              </fieldset>
              <div className="flex pt-4 border-t justify-end">
                <FormSubmitButton isSaving={isPending} />
              </div>
            </ScrollArea>
          </form>
        </Form>
      </div>
    </div>
  );
}
