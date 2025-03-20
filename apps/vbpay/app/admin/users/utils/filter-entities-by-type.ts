import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { NetworkEntity } from "@/types/network-entity";
import { NetworkEntityType } from "@/types/network-entity-type";

export function filterEntitiesByType(
  entities: NetworkEntity[],
  type: NetworkEntityType,
) {
  return entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === type)
    .map((entity) => ({
export function filterEntitiesByType(
  entities: NetworkEntity[],
  type: NetworkEntityType,
) {
  return entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === type)
    .map((entity) => ({
      label: formatMarketingAndRefName(entity.marketingName, entity.referenceName),
      value: entity.pubId,
    }));
}
      value: entity.pubId,
    }));
}
