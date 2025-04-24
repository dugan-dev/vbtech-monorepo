import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";

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
