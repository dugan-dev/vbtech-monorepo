"use client";

import { useFormContext } from "react-hook-form";

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

export function PayerPyConfigPhysAssignmentStep2({ isSubmitting }: props) {
  "use no memo"; // react compiler was memoizing watch so it was not updating
  const { control, watch } = useFormContext<PayerPyConfigFormData>();
  const watchIsPhysAssignmentRequired = watch("physAssignment.isRequired");
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
