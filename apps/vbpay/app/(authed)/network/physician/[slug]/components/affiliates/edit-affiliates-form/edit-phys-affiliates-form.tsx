"use client";

import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { EditButton } from "@workspace/ui/components/edit-button";
import { Form } from "@workspace/ui/components/form";
import { FormCheckbox } from "@workspace/ui/components/form/form-checkbox";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Icons } from "@/components/icons";

import { useEditPhysAffiliatesForm } from "../../../hooks/use-edit-phys-affiliates-form";
import { EditPhysAffiliatesFormData } from "./edit-phys-affiliates-schema";

type props = {
  onSuccess: () => void;
  formData: EditPhysAffiliatesFormData;
  payerPubId: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  pos: ComboItem[];
  practices: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
};

export function EditPhysAffiliatesForm({
  onSuccess,
  formData,
  payerPubId,
  isEditing,
  setIsEditing,
  pos,
  practices,
  facilities,
  vendors,
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
  } = useEditPhysAffiliatesForm({
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                  <FormCombo
                    control={form.control}
                    name="poNetEntPubId"
                    label="Affiliate Physician Org"
                    comboItems={pos}
                  />
                  <FormCombo
                    control={form.control}
                    name="pracNetEntPubId"
                    label="Affiliate Practice"
                    comboItems={practices}
                  />
                  <FormCombo
                    control={form.control}
                    name="faclNetEntPubId"
                    label="Affiliate Facility"
                    comboItems={facilities}
                  />
                  <FormCombo
                    control={form.control}
                    name="vendorNetEntPubId"
                    label="Affiliate Vendor"
                    comboItems={vendors}
                  />
                </div>
                <Alert className="bg-card flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <Icons.alertCircle className="h-4 w-4" />
                    <AlertDescription>
                      If this physician has no affiliations, check the box
                      below.
                    </AlertDescription>
                  </div>
                  <FormCheckbox
                    control={form.control}
                    name="affInfo.noAffiliates"
                    label="No Affiliates"
                    itemClassName="space-x-2 justify-start"
                  />
                </Alert>
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
