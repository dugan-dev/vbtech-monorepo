"use client";

import { useFormContext } from "react-hook-form";

import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { formatPhoneNumber } from "@workspace/ui/lib/formatPhoneNumber";

import { LicenseTypeLabels, LicenseTypes } from "@/types/license-type";

import { SetupFormData } from "../setup-form-schema";

type props = {
  isSubmitting: boolean;
};

export function SetupStep1LicenseInfo({ isSubmitting }: props) {
  const { control } = useFormContext<SetupFormData>();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">License Information</h2>
        <p className="text-muted-foreground">Enter the license information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCombo
          control={control}
          name="licenseInfo.type"
          label="License Type"
          comboItems={LicenseTypes.map((type) => ({
            label: LicenseTypeLabels[type],
            value: type,
          }))}
          isDisabled={isSubmitting}
          isRequired
        />

        <FormInput
          control={control}
          name="licenseInfo.numPayers"
          label="Number of Payers"
          isRequired
          type="number"
          isDisabled={isSubmitting}
        />
        <FormInput
          control={control}
          name="licenseInfo.fromDate"
          label="From Date"
          isRequired
          type="date"
          isDisabled={isSubmitting}
        />
        <FormInput
          control={control}
          name="licenseInfo.toDate"
          label="To Date"
          isRequired
          type="date"
          isDisabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          control={control}
          name="licenseInfo.clientName"
          label="Client Name"
          isRequired
          type="text"
          isDisabled={isSubmitting}
        />
        <FormInput
          control={control}
          name="licenseInfo.pocName"
          label="Point of Contact Name"
          isRequired
          type="text"
          isDisabled={isSubmitting}
        />
        <FormInput
          control={control}
          name="licenseInfo.pocPhone"
          label="Point of Contact Phone"
          isRequired
          type="tel"
          isDisabled={isSubmitting}
          formatOnChange={(value) => formatPhoneNumber(value)}
        />
        <FormInput
          control={control}
          name="licenseInfo.pocEmail"
          label="Point of Contact Email"
          isRequired
          type="email"
          isDisabled={isSubmitting}
        />
      </div>
    </div>
  );
}
