import { NetworkEntity } from "@/types/network-entity";

import { EditEntityFormData } from "../components/info/edit-entity-form/edit-entity-form-schema";

/**
 * Transforms a NetworkEntity into an EditEntityFormData.
 *
 * Extracts specific properties from the provided entity and assigns default
 * empty strings for any missing or falsy values in string fields. This ensures
 * that the returned edit form data object contains valid string values.
 *
 * @param entity - The network entity whose properties are used to build the form data.
 * @returns A new object containing the formatted entity data.
 */
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
