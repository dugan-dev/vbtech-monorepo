"use client";

import { EditButton } from "@workspace/ui/components/edit-button";
import { Form } from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormRadioGroup } from "@workspace/ui/components/form/form-radio-group";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { formatTaxId } from "@workspace/ui/lib/formatTaxId";

import {
  NetworkPhysicianClasses,
  NetworkPhysicianClassLabels,
} from "@/types/network-physician-class";
import {
  NetworkPhysicianSpecialties,
  NetworkPhysicianSpecialty,
  NetworkPhysicianSpecialtyLabels,
} from "@/types/network-physician-specialty";
import {
  NetworkPhysicianType,
  NetworkPhysicianTypeLabels,
  NetworkPhysicianTypes,
} from "@/types/network-physician-type";
import {
  TaxonomyCode,
  TaxonomyCodeDefinitions,
  TaxonomyCodeDisplayNames,
  TaxonomyCodes,
} from "@/types/taxonomy-codes";
import { ErrorDialog } from "@/components/error-dialog";

import { useEditPhysicianForm } from "../../../hooks/use-edit-physician-form";
import {
  EditPhysicianFormData,
  EditPhysicianFormOutput,
} from "./edit-physician-form-schema";

type props = {
  onSuccess: () => void;
  formData: EditPhysicianFormData;
  payerPubId: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders a controlled form for viewing and editing physician details, supporting toggling between read-only and edit modes.
 *
 * The form displays physician information with conditional fields and validation based on the selected physician type and sole proprietor status. Editing can be enabled or disabled externally, and submission errors are shown in a dialog.
 *
 * @param onSuccess - Callback invoked after a successful form submission.
 * @param formData - Initial data to populate the form fields.
 * @param payerPubId - Identifier associated with the payer.
 * @param isEditing - Whether the form is currently in editing mode.
 * @param setIsEditing - Function to toggle the editing state.
 */
export function EditPhysicianForm({
  onSuccess,
  formData,
  payerPubId,
  isEditing,
  setIsEditing,
}: props) {
  "use no memo";
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    userCanEdit,
  } = useEditPhysicianForm({
    onSuccess,
    formData,
    payerPubId,
  });

  const watchType = form.watch("type") as NetworkPhysicianType | "";
  const watchSoleProprietor = form.watch("soleProprietor");

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
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(data as EditPhysicianFormOutput),
            )}
            className="space-y-4"
          >
            <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
              <fieldset
                disabled={isPending || !isEditing}
                className="space-y-4 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                  <FormInput
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    type="text"
                    isRequired
                  />
                  <FormInput
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    type="text"
                    isRequired
                  />
                  <FormInput
                    control={form.control}
                    name="npi"
                    label="Individual NPI"
                    type="text"
                    isRequired
                  />
                  <FormCombo
                    control={form.control}
                    name="type"
                    label="Type"
                    isRequired
                    comboItems={NetworkPhysicianTypes.map((type) => ({
                      label: NetworkPhysicianTypeLabels[type],
                      value: type,
                    }))}
                  />
                  {(watchType === "fqhc individual" ||
                    watchType === "organizational provider") && (
                    <FormInput
                      control={form.control}
                      name="orgNpi"
                      label="Organization NPI"
                      type="text"
                    />
                  )}
                  <FormCombo
                    control={form.control}
                    name="class"
                    label="Class"
                    isRequired
                    comboItems={NetworkPhysicianClasses.map((type) => ({
                      label: NetworkPhysicianClassLabels[type],
                      value: type,
                    }))}
                  />
                  <FormRadioGroup
                    control={form.control}
                    name="soleProprietor"
                    label="Sole Proprietor"
                    items={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    isHorizontal
                  />
                  <FormInput
                    control={form.control}
                    name="taxId"
                    label="Tax ID"
                    type="text"
                    formatOnChange={formatTaxId}
                    isRequired={watchSoleProprietor === "yes"}
                  />
                  <FormCombo
                    control={form.control}
                    name="primaryTaxonomyCode"
                    label="Primary Taxonomy"
                    comboItems={TaxonomyCodes.map((taxonomy) => ({
                      label: (
                        <span>
                          <strong>{`${TaxonomyCodeDisplayNames[taxonomy as TaxonomyCode]} (${taxonomy})`}</strong>
                          <br />
                          {TaxonomyCodeDefinitions[taxonomy as TaxonomyCode]}
                        </span>
                      ),
                      value: taxonomy,
                      selectionDisplay: `${TaxonomyCodeDisplayNames[taxonomy as TaxonomyCode]} (${taxonomy})`,
                    }))}
                  />
                  <FormCombo
                    control={form.control}
                    name="specialty"
                    label="Specialty"
                    comboItems={NetworkPhysicianSpecialties.map(
                      (specialty) => ({
                        label:
                          NetworkPhysicianSpecialtyLabels[
                            specialty as NetworkPhysicianSpecialty
                          ],
                        value: specialty,
                      }),
                    )}
                  />
                  <FormInput
                    control={form.control}
                    name="credential"
                    label="Credential"
                    type="text"
                  />
                </div>
              </fieldset>
              <div className="flex pt-4 border-t justify-end">
                {isEditing ? (
                  <FormSubmitButton isSaving={isPending} />
                ) : (
                  <EditButton
                    userCanEdit={userCanEdit}
                    setIsEditing={setIsEditing}
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
