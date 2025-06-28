"use client";

import { Dispatch, SetStateAction } from "react";

import { EditButton } from "@workspace/ui/components/edit-button";
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
import { ErrorDialog } from "@workspace/ui/components/error-dialog";

import { useEditEntityForm } from "../../../hooks/use-edit-entity-form";
import { EditEntityFormData } from "./edit-entity-form-schema";

type props = {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  formData: EditEntityFormData;
  payerPubId: string;
};

/**
 * Renders a form for viewing and editing network entity details, supporting toggling between view and edit modes.
 *
 * The form displays fields for entity type, marketing name, legal name, acronym/nickname, organizational NPI, and tax ID. Editing is gated by the `isEditing` prop, and form submission invokes the provided `onSuccess` callback on success. An error dialog is shown if submission fails. The edit button is conditionally enabled based on user permissions.
 *
 * @param isEditing - Whether the form is currently in edit mode.
 * @param setIsEditing - Function to toggle the edit mode state.
 * @param onSuccess - Callback invoked after successful form submission.
 * @param formData - Initial values for the form fields.
 * @param payerPubId - Identifier for the payer entity associated with the form.
 */
export function EditEntityForm({
  isEditing,
  setIsEditing,
  onSuccess,
  formData,
  payerPubId,
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
  } = useEditEntityForm({
    onSuccess,
    formData,
    payerPubId,
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
              <fieldset
                disabled={isPending || !isEditing}
                className="space-y-4 mb-8"
              >
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
                {isEditing ? (
                  <FormSubmitButton isSaving={isPending} />
                ) : (
                  <EditButton
                    setIsEditing={setIsEditing}
                    userCanEdit={userCanEdit}
                  />
                )}
              </div>
            </ScrollArea>
          </form>
        </Form>
      </div>
    </div>
  );
}
