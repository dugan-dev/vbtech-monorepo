"use client";

import { useFormContext } from "react-hook-form";

import { FormCombo } from "@workspace/ui/components/form/form-combo";

import { AcoEligSourceLabels, AcoEligSources } from "@/types/aco-elig-source";
import {
  AcoPaymentModelLabels,
  AcoPaymentModels,
} from "@/types/aco-payment-model";
import { AcoProgramLabels, AcoPrograms } from "@/types/aco-program";
import { AcoRiskOptionLabels, AcoRiskOptions } from "@/types/aco-risk-option";
import { AcoTypeLabels, AcoTypes } from "@/types/aco-type";
import { PerfYears } from "@/types/perf-year";

import { PayerPyConfigFormData } from "../payer-py-config-form-schema";

type props = {
  isSubmitting: boolean;
};

export function PayerPyConfigBasicInfoStep1({ isSubmitting }: props) {
  const { control } = useFormContext<PayerPyConfigFormData>();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCombo
          control={control}
          name="basicInfo.perfYear"
          label="Performance Year"
          comboItems={PerfYears.map((year) => ({
            label: year,
            value: year,
          }))}
          isDisabled={isSubmitting}
          isRequired
        />
        <FormCombo
          control={control}
          name="basicInfo.program"
          label="Program"
          comboItems={AcoPrograms.map((program) => ({
            label: AcoProgramLabels[program],
            value: program,
          }))}
          isRequired
          isDisabled={isSubmitting}
        />
        <FormCombo
          control={control}
          name="basicInfo.type"
          label="Type"
          isRequired
          comboItems={AcoTypes.map((type) => ({
            label: AcoTypeLabels[type],
            value: type,
          }))}
          isDisabled={isSubmitting}
        />
        <FormCombo
          control={control}
          name="basicInfo.riskOption"
          label="Risk Option"
          isRequired
          comboItems={AcoRiskOptions.map((option) => ({
            label: AcoRiskOptionLabels[option],
            value: option,
          }))}
          isDisabled={isSubmitting}
        />
        <FormCombo
          control={control}
          name="basicInfo.paymentModel"
          label="Payment Model"
          isRequired
          comboItems={AcoPaymentModels.map((model) => ({
            label: AcoPaymentModelLabels[model],
            value: model,
          }))}
          isDisabled={isSubmitting}
        />
        <FormCombo
          control={control}
          name="basicInfo.eligSource"
          label="Eligibility Source"
          isRequired
          comboItems={AcoEligSources.map((source) => ({
            label: AcoEligSourceLabels[source],
            value: source,
          }))}
          isDisabled={isSubmitting}
        />
      </div>
    </div>
  );
}
