import { NetworkEntity } from "@/types/network-entity";

import { EditEntityFormData } from "../components/info/edit-entity-form/edit-entity-form-schema";

export function formatEditEntityFormData(
  entity: NetworkEntity,
): EditEntityFormData {
  return {
    netEntType: entity.netEntType,
    marketingName: entity.marketingName,
    legalName: entity.legalName || "",
    referenceName: entity.referenceName || "",
    orgNpi: entity.orgNpi || "",
    taxId: entity.taxId || "",
  };
}
