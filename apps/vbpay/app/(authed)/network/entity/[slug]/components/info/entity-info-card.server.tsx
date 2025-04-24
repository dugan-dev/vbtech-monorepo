import { getNetworkEntity } from "@/repos/network-entity-repository";

import { formatEditEntityFormData } from "../../utils/format-edit-entity-form-data";
import { EntityInfoCardClient } from "./entity-info-card.client";

type props = {
  entityPubId: string;
};

/**
 * Asynchronously fetches and displays an entity info card for a given public ID.
 *
 * Retrieves a network entity using the provided public ID, formats its data, and renders the {@link EntityInfoCardClient} component with the relevant information.
 *
 * @param entityPubId - The public ID of the entity to display.
 * @returns A JSX element containing the entity info card.
 *
 * @throws {Error} If no entity is found for the specified {@link entityPubId}.
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
