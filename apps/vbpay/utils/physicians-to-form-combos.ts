import { formatPhysicianNameNpi } from "@/utils/format-physician-name-and-npi";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkPhysician } from "@/types/network-physician";

type props = {
  physicians: NetworkPhysician[];
};

export function physiciansToFormCombos({ physicians }: props): ComboItem[] {
  return physicians.map((entity) => ({
    value: entity.pubId,
    label: formatPhysicianNameNpi(
      entity.firstName,
      entity.lastName,
      entity.npi,
    ),
  }));
}
