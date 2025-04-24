import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";

/**
 * Converts the allowed payer types from global settings into an array of combo items.
 *
 * Each combo item contains a label from {@link PayerTypeLabels} and the corresponding payer type value.
 *
 * @param settings - Global settings containing allowed payer types as a comma-separated string.
 * @returns An array of combo items representing the allowed payer types.
 */
export function settingsToAllowedPayerTypesCombo(
  settings: VBPayGlobalSettings,
) {
  const payerTypes: ComboItem[] = settings.allowedPayerTypes
    .split(",")
    .map((payerType) => ({
      label: PayerTypeLabels[payerType as PayerType],
      value: payerType,
    }));
  return payerTypes;
}
