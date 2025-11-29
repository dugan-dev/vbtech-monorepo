"use client";

import { Controller } from "react-hook-form";

import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Field,
  FieldLabel,
  FieldError as FormFieldError,
} from "@workspace/ui/components/field";
import { Form } from "@workspace/ui/components/form";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { Input } from "@workspace/ui/components/input";

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
          <Field>
            <FieldLabel htmlFor="planName">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="planName"
              control={form.control}
              rules={{ required: "Plan name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="planName"
                  placeholder="Enter health plan name"
                />
              )}
            />
            <FormFieldError errors={[form.formState.errors.planName]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="tatStandard">
              TAT Standard (Days) <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="tatStandard"
              control={form.control}
              rules={{ required: "TAT Standard is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="tatStandard"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter standard turnaround time in days"
                />
              )}
            />
            <FormFieldError errors={[form.formState.errors.tatStandard]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="tatExpedited">
              TAT Expedited (Days) <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="tatExpedited"
              control={form.control}
              rules={{ required: "TAT Expedited is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="tatExpedited"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter expedited turnaround time in days"
                />
              )}
            />
            <FormFieldError errors={[form.formState.errors.tatExpedited]} />
          </Field>
        </fieldset>
        <div className="flex justify-end">
          <FormSubmitButton isSaving={isPending} />
        </div>
      </form>
    </Form>
  );
}
