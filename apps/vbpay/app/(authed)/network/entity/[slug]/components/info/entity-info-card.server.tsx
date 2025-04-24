import { getNetworkEntity } from "@/repos/network-entity-repository";

import { formatEditEntityFormData } from "../../utils/format-edit-entity-form-data";
import { EntityInfoCardClient } from "./entity-info-card.client";

type props = {
  entityPubId: string;
};

/**
 * Server component that fetches entity data and renders an entity info card.
 *
 * Retrieves a network entity by its public ID, formats the data, and displays it using {@link EntityInfoCardClient}.
 *
 * @param entityPubId - The public ID of the entity to display.
 * @returns A JSX element containing the entity info card.
 *
 * @throws {Error} If no entity is found for the provided {@link entityPubId}.
 */
export async function EntityInfoCardServer({ entityPubId }: props) {
  const entity = await getNetworkEntity(entityPubId);

  if (!entity) {
    throw new Error(`No entity found for pubId: ${entityPubId}`);
  }

  const formData = formatEditEntityFormData(entity!);

  return (
    <EntityInfoCardClient data={formData} payerPubId={entity.payerPubId} />
  );
}
