"use client";

import { useFormContext } from "react-hook-form";

import { FormCheckboxList } from "@workspace/ui/components/form/form-checkbox-list";

import {
  LicenseFunctionalities,
  LicenseFunctionalityLabels,
} from "@/types/license-functionality";
import { PaymentTypeLabels, PaymentTypes } from "@/types/payment-type";

import { SetupFormData } from "../setup-form-schema";

type props = {
  isSubmitting: boolean;
};

export function SetupStep2LicenseFunctionality({ isSubmitting }: props) {
  const { control } = useFormContext<SetupFormData>();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">License Functionality</h2>
        <p className="text-muted-foreground">Enter the license information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCheckboxList
          isDisabled={isSubmitting}
          control={control}
          name="functionality.paymentTypes"
          label="Payment Types"
          isRequired
          items={PaymentTypes.map((type) => ({
            label: PaymentTypeLabels[type],
            value: type,
          }))}
        />
        <FormCheckboxList
          isDisabled={isSubmitting}
          control={control}
          name="functionality.functionality"
          label="Licensed Functionalities"
          isRequired
          items={LicenseFunctionalities.map((type) => ({
            label: LicenseFunctionalityLabels[type],
            value: type,
          }))}
          uncheckAllWhenCheckedValue="none"
        />
      </div>
    </div>
  );
}
