import { Control, useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSwitch } from "@workspace/ui/components/form/form-switch";

import { Icons } from "@/components/icons";

import { HealthPlanFormData } from "./health-plan-form-schema";

// PBP item type for better type safety
type PBPItem = {
  pbpId: string;
  pbpName: string;
  isActive: boolean;
  pbpPubId: string;
};

/**
 * Displays a card for editing a single Plan Benefit Package (PBP) entry within a form.
 *
 * Shows input fields for "PBP ID" and "PBP Name", and conditionally renders either a remove button or an "Active" toggle switch based on whether the PBP has a published ID.
 *
 * @param field - The PBP data for this card, including identifiers and status.
 * @param index - The index of this PBP in the PBPs array.
 * @param onRemove - Callback to remove this PBP from the list.
 * @param canRemove - Whether this PBP can be removed.
 * @param isDisabled - Whether the input fields are disabled.
 */
function PBPCard({
  field,
  index,
  onRemove,
  canRemove,
  control,
  isDisabled,
}: {
  field: Record<"id", string> & Partial<PBPItem>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  control: Control<HealthPlanFormData>;
  isDisabled: boolean;
}) {
  const hasPublishedId =
    field.pbpPubId !== "" &&
    field.pbpPubId !== undefined &&
    field.pbpPubId !== null;

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            type="text"
            control={control}
            label="PBP ID"
            name={`pbps.${index}.pbpId`}
            isRequired
            isDisabled={isDisabled}
          />

          <FormInput
            type="text"
            control={control}
            label="PBP Name"
            name={`pbps.${index}.pbpName`}
            isRequired
            isDisabled={isDisabled}
          />
        </div>

        {canRemove && !hasPublishedId && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Icons.trash2 className="h-4 w-4" />
            <span className="sr-only">Remove PBP</span>
          </Button>
        )}

        {hasPublishedId && (
          <div className="absolute top-4 right-4">
            <FormSwitch
              control={control}
              label="Active"
              name={`pbps.${index}.isActive`}
              labelFirst
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Renders a form step for managing a dynamic list of Plan Benefit Packages (PBPs) within a health plan form.
 *
 * Allows users to add, remove, and edit PBPs, enforcing that at least one PBP is present. Each PBP can be marked as active or inactive, and removal is restricted if only one PBP remains or if the PBP has a published ID. Displays validation errors for the PBPs array when present.
 */
export function HealthPlanFormPBPsStep() {
  const form = useFormContext<HealthPlanFormData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pbps",
  });

  const addPbp = () => {
    append({ pbpId: "", pbpName: "", isActive: true, pbpPubId: "" });
  };

  const removePbp = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Plan Benefit Packages</h2>
        <p className="text-muted-foreground">
          Enter the PBP(s) for this health plan. At least one PBP is required.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <PBPCard
            key={field.id}
            field={field}
            index={index}
            onRemove={() => removePbp(index)}
            canRemove={fields.length > 1}
            control={form.control}
            isDisabled={form.getValues(`pbps.${index}.isActive`) === false}
          />
        ))}

        {form.formState.errors.pbps &&
          typeof form.formState.errors.pbps.message === "string" && (
            <p className="text-sm text-destructive">
              {form.formState.errors.pbps.message}
            </p>
          )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addPbp}
        className="w-full"
      >
        <Icons.plus className="h-4 w-4 mr-2" />
        Add Another PBP
      </Button>
    </div>
  );
}
