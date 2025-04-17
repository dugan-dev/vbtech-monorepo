import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { Payer } from "@/types/payer";

type props = {
  payers: Payer[];
};

export function payersToFormCombos({ payers }: props): ComboItem[] {
  return payers.map((entity) => ({
    value: entity.pubId,
    label: formatMarketingAndRefName(
      entity.marketingName,
      entity.referenceName,
    ),
  }));
}
