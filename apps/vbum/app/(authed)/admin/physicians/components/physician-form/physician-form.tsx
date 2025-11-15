"use client";

import { useWatch } from "react-hook-form";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";

import { usePhysicianContext } from "../../context/physician-context";
import { usePhysicianForm } from "../../hooks/use-physician-form";
import { PhysicianFormData } from "./physician-form-schema";

type props = {
  onSuccess?: () => void;
  formData?: PhysicianFormData;
  physPubId?: string;
};

export function PhysicianForm({ onSuccess, formData, physPubId }: props) {
  const {
    form,
    onSubmit,
    isPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = usePhysicianForm({
    onSuccess,
    formData,
    physPubId,
  });

  const { clients: availableClients } = usePhysicianContext();

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
    defaultValue: true,
  });

  const selectedClients = useWatch({
    control: form.control,
    name: "clients",
  });

  const handleClientToggle = (pubId: string, checked: boolean) => {
    if (checked) {
      form.setValue("clients", [...selectedClients, pubId], {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "clients",
        selectedClients.filter((id) => id !== pubId),
        { shouldValidate: true },
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
      <div className="max-h-[70vh] overflow-y-auto px-1">
        <ErrorDialog
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
          description={errorMsg}
          title={errorTitle}
        />
        <FieldGroup>
          <div className="">
            <h3 className="text-lg font-semibold">Physician Information</h3>
            <p className="text-sm text-muted-foreground">
              {`Enter the physician's details and compensation rates`}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Field data-invalid={!!form.formState.errors.name}>
                <FieldLabel htmlFor="name">Physician Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Dr. Rahul Singal"
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register("name")}
                />
                <FieldDescription>
                  Full name of the reviewing physician
                </FieldDescription>
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.clients}>
                <FieldLabel htmlFor="clients">Clients</FieldLabel>
                <FieldDescription>
                  Select the clients this physician reviews for
                </FieldDescription>
                <div className="mt-3 space-y-3">
                  {availableClients.map((client) => (
                    <Field key={client.value} orientation="horizontal">
                      <Checkbox
                        id={`client-${client.value}`}
                        checked={selectedClients.includes(client.value)}
                        onCheckedChange={(checked) =>
                          handleClientToggle(client.value, checked === true)
                        }
                      />
                      <FieldLabel
                        htmlFor={`client-${client.value}`}
                        className="font-normal"
                      >
                        {client.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
                {form.formState.errors.clients && (
                  <FieldError>
                    {form.formState.errors.clients.message}
                  </FieldError>
                )}
              </Field>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Compensation Rates</h4>
                <div className="space-y-4">
                  <Field data-invalid={!!form.formState.errors.rateReview}>
                    <FieldLabel htmlFor="reviewRate">Review Rate</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="reviewRate"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="30.00"
                        className="pl-7"
                        aria-invalid={!!form.formState.errors.rateReview}
                        {...form.register("rateReview")}
                      />
                    </div>
                    <FieldDescription>Rate per review ($)</FieldDescription>
                    {form.formState.errors.rateReview && (
                      <FieldError>
                        {form.formState.errors.rateReview.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field
                    data-invalid={!!form.formState.errors.rateDenyWithdraw}
                  >
                    <FieldLabel htmlFor="denialWithdrawalRate">
                      Denial/Withdrawal Rate
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="denialWithdrawalRate"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="60.00"
                        className="pl-7"
                        aria-invalid={!!form.formState.errors.rateDenyWithdraw}
                        {...form.register("rateDenyWithdraw")}
                      />
                    </div>
                    <FieldDescription>
                      Rate per withdrawal/denial ($)
                    </FieldDescription>
                    {form.formState.errors.rateDenyWithdraw && (
                      <FieldError>
                        {form.formState.errors.rateDenyWithdraw.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!form.formState.errors.rateP2p}>
                    <FieldLabel htmlFor="peerToPeerRate">
                      Peer-to-Peer Rate
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="peerToPeerRate"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="90.00"
                        className="pl-7"
                        aria-invalid={!!form.formState.errors.rateP2p}
                        {...form.register("rateP2p")}
                      />
                    </div>
                    <FieldDescription>Rate per P2P ($)</FieldDescription>
                    {form.formState.errors.rateP2p && (
                      <FieldError>
                        {form.formState.errors.rateP2p.message}
                      </FieldError>
                    )}
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Field data-invalid={!!form.formState.errors.notes}>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this physician..."
                rows={4}
                aria-invalid={!!form.formState.errors.notes}
                {...form.register("notes")}
              />
              <FieldDescription>
                Optional notes or special instructions
              </FieldDescription>
              {form.formState.errors.notes && (
                <FieldError>{form.formState.errors.notes.message}</FieldError>
              )}
            </Field>
          </div>

          {physPubId && (
            <Field orientation="horizontal">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) =>
                  form.setValue("isActive", checked === true)
                }
              />
              <FieldLabel htmlFor="isActive" className="font-normal">
                Active physician
              </FieldLabel>
            </Field>
          )}
        </FieldGroup>
      </div>
      <div className="flex justify-end">
        <FormSubmitButton isSaving={isPending} />
      </div>
    </form>
  );
}
