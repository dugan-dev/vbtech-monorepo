"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormSwitch } from "@workspace/ui/components/form/form-switch";

import {
  AcoPhysAssignMethodLabels,
  AcoPhysAssignMethods,
} from "@/types/aco-phys-assign-method";
import {
  AcoPhysAssignSourceLabels,
  AcoPhysAssignSources,
} from "@/types/aco-phys-assign-source";

import { PayerPyConfigFormData } from "../payer-py-config-form-schema";

type props = {
  isSubmitting: boolean;
};

/**
 * Renders the physician assignment configuration step within the payer form.
 *
 * This component uses the react-hook-form context to present a toggle for enabling
 * physician assignment. When activated, it displays combo boxes for selecting the
 * assignment source and method. All controls are disabled when form submission is in progress.
 *
 * @param isSubmitting - Indicates whether the form submission is in progress.
 */
export function PayerPyConfigPhysAssignmentStep2({ isSubmitting }: props) {
  const { control } = useFormContext<PayerPyConfigFormData>();
  const watchIsPhysAssignmentRequired = useWatch({
    control,
    name: "physAssignment.isRequired",
  });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormSwitch
          control={control}
          name="physAssignment.isRequired"
          label="Assign to Physician"
          isDisabled={isSubmitting}
          isRequired
          labelFirst
        />
        {watchIsPhysAssignmentRequired && (
          <div className="grid grid-cols-1 gap-6">
            <FormCombo
              control={control}
              name="physAssignment.physAssignSource"
              label="Physician Assignment Source"
              comboItems={AcoPhysAssignSources.map((src) => ({
                label: AcoPhysAssignSourceLabels[src],
                value: src,
              }))}
              isDisabled={isSubmitting}
              isRequired
            />
            <FormCombo
              control={control}
              name="physAssignment.physAssignMethod"
              label="Physician Assignment Method"
              comboItems={AcoPhysAssignMethods.map((method) => ({
                label: AcoPhysAssignMethodLabels[method],
                value: method,
              }))}
              isDisabled={isSubmitting}
              isRequired
            />
          </div>
        )}
      </div>
    </div>
  );
}
