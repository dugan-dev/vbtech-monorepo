import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkEntity } from "@/types/network-entity";
import { NetworkEntityType } from "@/types/network-entity-type";

type props = {
  entities: NetworkEntity[];
};

export function networkEntitiesToFormCombos({ entities }: props) {
  const mapEntitiesByType = (type: NetworkEntityType): ComboItem[] => {
    return entities
      .filter((entity) => (entity.netEntType as NetworkEntityType) === type)
      .map((entity) => ({
        value: entity.pubId,
        label: formatMarketingAndRefName(
          entity.marketingName,
          entity.referenceName,
        ),
      }));
  };

  const pos = mapEntitiesByType("po");
  const practices = mapEntitiesByType("prac");
  const facilities = mapEntitiesByType("facl");
  const vendors = mapEntitiesByType("vendor");

  return {
    pos,
    practices,
    facilities,
    vendors,
  };
}
