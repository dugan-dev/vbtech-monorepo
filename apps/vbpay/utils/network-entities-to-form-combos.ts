import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkEntity } from "@/types/network-entity";
import { NetworkEntityType } from "@/types/network-entity-type";

type props = {
  entities: NetworkEntity[];
};

export function networkEntitiesToFormCombos({ entities }: props) {
  const pos: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "po")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  const practices: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "prac")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  const facilities: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "facl")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  const vendors: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "vendor")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  return {
    pos,
    practices,
    facilities,
    vendors,
  };
}
