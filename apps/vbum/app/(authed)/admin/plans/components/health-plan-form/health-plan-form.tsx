"use client";

import { timezones } from "@/values/timezones";

import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { FormTextarea } from "@workspace/ui/components/form/form-text-area";

import { useHealthPlanForm } from "../../hooks/use-health-plan-form";
import { HealthPlanFormData } from "./health-plan-form-schema";

type props = {
  onSuccess?: () => void;
  formData?: HealthPlanFormData;
  clientPubId: string;
  healthPlanPubId?: string;
};

/**
 * Render a health plan form bound to form state, submission handlers, and error dialog.
 *
 * @param onSuccess - Optional callback invoked after a successful form submission.
 * @param formData - Optional initial form values to populate the form (used for editing).
 * @param clientPubId - Public identifier of the client the health plan belongs to.
 * @param healthPlanPubId - Optional public identifier of the health plan (present when editing).
 * @returns A React element that renders the health plan form UI.
 */
export function HealthPlanForm({
  onSuccess,
  formData,
  clientPubId,
  healthPlanPubId,
}: props) {
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useHealthPlanForm({
    onSuccess,
    formData,
    clientPubId,
    healthPlanPubId,
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
            name="planName"
            label="Name"
            type="text"
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