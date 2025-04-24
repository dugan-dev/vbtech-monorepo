import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";

/**
 * Converts the allowed payer types from global settings into an array of combo items.
 *
 * @param settings - The global settings object containing allowed payer types as a comma-separated string.
 * @returns An array of combo items, each representing an allowed payer type with its label and value.
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
