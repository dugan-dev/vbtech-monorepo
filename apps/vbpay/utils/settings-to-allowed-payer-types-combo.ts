import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";

/**
 * Returns an array of combo items representing the allowed payer types from the provided global settings.
 *
 * Each combo item contains a label derived from {@link PayerTypeLabels} and a value corresponding to a payer type identifier.
 *
 * @param settings - The global settings object containing allowed payer types as a comma-separated string.
 * @returns An array of combo items for the allowed payer types.
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
